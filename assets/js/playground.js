// Interactive YAML Schema playground: validates the Document editor against the Schema editor,
// and the Schema editor against the YAML Schema meta-schema, using the yaml-schema-wasm build in
// /assets/wasm.

// Pin the shared CodeMirror packages via ?deps= so every module resolves to the same
// @codemirror/state and @codemirror/view instances. With a second instance, extensions from it
// (e.g. a keymap) are silently ignored or rejected by the editor.
const CM_STATE = "@codemirror/state@6.7.6";
const CM_DEPS = `deps=${CM_STATE},@codemirror/view@6.43.14`;

const [
  { basicSetup },
  { yaml },
  { EditorView, keymap },
  { syntaxTree },
  { setDiagnostics },
  wasm,
] = await Promise.all([
  import(`https://esm.sh/codemirror@6.0.2?${CM_DEPS}`),
  import(`https://esm.sh/@codemirror/lang-yaml@6.1.3?${CM_DEPS}`),
  import(`https://esm.sh/@codemirror/view@6.43.14?deps=${CM_STATE}`),
  import(`https://esm.sh/@codemirror/language@6.13.1?${CM_DEPS}`),
  import(`https://esm.sh/@codemirror/lint@6.9.7?${CM_DEPS}`),
  import("../wasm/yaml_schema_wasm.js"),
]);

// Sample object schema, from the Objects feature page.
const SAMPLE_SCHEMA = `type: object
properties:
  number:
    type: number
  street_name:
    type: string
  street_type:
    enum: [Street, Avenue, Boulevard]
`;

const SAMPLE_DOCUMENT = `number: 1600
street_name: Pennsylvania
street_type: Avenue
`;

const PHASE_LABELS = {
  schema: "Schema error",
  document: "Document error",
  validation: "Validation error",
};

const validateButton = document.getElementById("pg-validate");
const schemaResultsEl = document.getElementById("pg-schema-results");
const documentResultsEl = document.getElementById("pg-document-results");

function createEditor(parent, doc) {
  return new EditorView({
    doc,
    parent,
    extensions: [
      // Before basicSetup, so it takes precedence over the default Mod-Enter (insertBlankLine).
      keymap.of([{ key: "Mod-Enter", run: () => (runValidation(), true) }]),
      basicSetup,
      yaml(),
    ],
  });
}

const schemaEditor = createEditor(document.getElementById("pg-schema"), SAMPLE_SCHEMA);
const documentEditor = createEditor(document.getElementById("pg-document"), SAMPLE_DOCUMENT);

/** Converts a 1-based `line`/`col` to a document offset, clamped to the document. */
function toPos(doc, line, col) {
  const lineInfo = doc.line(Math.min(Math.max(line, 1), doc.lines));
  return { lineInfo, pos: Math.min(lineInfo.from + Math.max((col ?? 1) - 1, 0), lineInfo.to) };
}

/** Moves the cursor in `editor` to the 1-based `line`/`col` and focuses it. */
function jumpTo(editor, line, col) {
  const { pos } = toPos(editor.state.doc, line, col);
  editor.dispatch({ selection: { anchor: pos }, scrollIntoView: true });
  editor.focus();
}

/**
 * The range to highlight for an error reported at `line`/`col`. yaml-schema only reports where
 * the offending node starts, so this extends it to the largest YAML syntax node starting there
 * (e.g. a whole `"quoted"` scalar or `[flow, sequence]`), falling back to the next
 * whitespace-delimited token. It stops below a `Pair`, so an error reported at a key (e.g. a
 * disallowed additional property) highlights just the key, not `key: value`. Capped at the end
 * of the line, so errors on a mapping or the whole document don't paint an entire block.
 */
function errorRange(state, line, col) {
  const { lineInfo, pos: from } = toPos(state.doc, line, col);
  let node = syntaxTree(state).resolveInner(from, 1);
  let to;
  if (node.from === from && node.to > from) {
    while (node.parent && node.parent.from === from && node.parent.name !== "Pair") {
      node = node.parent;
    }
    to = node.to;
  } else {
    to = from + (/^\S*/.exec(state.sliceDoc(from, lineInfo.to))?.[0].length ?? 0);
  }
  to = Math.min(to, lineInfo.to);
  // Trim trailing whitespace (e.g. before a comment) from the highlight
  while (to > from && /\s/.test(state.sliceDoc(to - 1, to))) to -= 1;
  return { from, to };
}

/** Replaces `editor`'s error highlights with `errors` ([{ line, col, text }]). */
function showDiagnostics(editor, errors) {
  const diagnostics = errors
    .filter(({ line }) => line != null)
    .map(({ line, col, text }) => ({
      ...errorRange(editor.state, line, col),
      severity: "error",
      message: text,
    }));
  editor.dispatch(setDiagnostics(editor.state, diagnostics));
}

function locationLabel(line, col) {
  if (line == null) return "";
  return col == null ? `${line}` : `${line}:${col}`;
}

function errorItem(editor, { line, col, text }) {
  const li = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pg-error";
  const loc = document.createElement("span");
  loc.className = "pg-error-loc";
  loc.textContent = locationLabel(line, col);
  const message = document.createElement("span");
  message.textContent = text;
  button.append(loc, message);
  if (line != null) {
    button.addEventListener("click", () => jumpTo(editor, line, col));
  } else {
    button.disabled = true;
  }
  li.append(button);
  return li;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const issueItem = ({ path, line, col, error }) => ({ line, col, text: path ? `.${path}: ${error}` : error });

const fatalItem = ({ line, col, message }) => ({ line, col, text: message });

/**
 * Fills the results box `el` with a `summary` line and a clickable list of `items`
 * ([{ line, col, text }]), and highlights the same items in `editor`.
 */
function renderBox(el, editor, { valid, summary, items = [] }) {
  el.className = `pg-results ${valid ? "pg-valid" : "pg-invalid"}`;
  const summaryEl = document.createElement("div");
  summaryEl.className = "pg-results-summary";
  summaryEl.textContent = summary;
  el.replaceChildren(summaryEl);
  if (items.length > 0) {
    const list = document.createElement("ul");
    list.append(...items.map((item) => errorItem(editor, item)));
    el.append(list);
  }
  showDiagnostics(editor, items);
}

/**
 * Problems with the schema: meta-schema violations from `metaResult`, plus anything that stopped
 * `result` from loading it. The two checks overlap (e.g. YAML syntax errors) but neither is a
 * subset of the other: the meta-schema catches misspelled keywords, which the loader ignores, and
 * the loader catches some invalid keyword values the meta-schema allows.
 */
function schemaItems(metaResult, result) {
  const items = metaResult.errors.map(issueItem);
  if (metaResult.fatal) items.push(fatalItem(metaResult.fatal));
  const loadError = result.fatal?.phase === "schema" ? result.fatal : null;
  if (loadError && loadError.message !== metaResult.fatal?.message) items.push(fatalItem(loadError));
  return items;
}

function renderSchemaResult(metaResult, result) {
  const items = schemaItems(metaResult, result);
  renderBox(schemaResultsEl, schemaEditor, {
    valid: items.length === 0,
    summary: items.length === 0 ? "✓ Schema is valid" : `✗ ${plural(items.length, "schema error")}`,
    items,
  });
}

function renderDocumentResult(result) {
  const { fatal } = result;
  if (fatal?.phase === "schema") {
    renderBox(documentResultsEl, documentEditor, {
      valid: false,
      summary: "Fix the schema errors to validate the document",
    });
  } else if (fatal) {
    renderBox(documentResultsEl, documentEditor, {
      valid: false,
      summary: PHASE_LABELS[fatal.phase] ?? "Error",
      items: [fatalItem(fatal)],
    });
  } else if (result.valid) {
    renderBox(documentResultsEl, documentEditor, { valid: true, summary: "✓ Document is valid" });
  } else {
    renderBox(documentResultsEl, documentEditor, {
      valid: false,
      summary: `✗ ${plural(result.errors.length, "validation error")}`,
      items: result.errors.map(issueItem),
    });
  }
}

function runValidation() {
  if (validateButton.disabled) return;
  const schema = schemaEditor.state.doc.toString();
  let result;
  try {
    result = wasm.validate(schema, documentEditor.state.doc.toString());
    renderSchemaResult(wasm.validateSchema(schema), result);
  } catch (e) {
    result ??= { valid: false, errors: [], fatal: { phase: "validation", message: String(e) } };
  }
  renderDocumentResult(result);
}

await wasm.default();
validateButton.textContent = "Validate";
validateButton.disabled = false;
validateButton.addEventListener("click", runValidation);
document.getElementById("pg-version").textContent =
  `yaml-schema v${wasm.version()} (WebAssembly)`;
