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

// Sample object schema, adapted from the Objects feature page.
const SAMPLE_SCHEMA = `type: object
properties:
  number:
    type: number
  street_name:
    type: string
  street_type:
    enum: [Street, Avenue, Boulevard]
additionalProperties: false
`;

const SAMPLE_DOCUMENT = `number: 1600
street_name: Pennsylvania
street_type: Avenue
`;

// Edits re-validate once typing has paused this long
const DEBOUNCE_MS = 1000;
// Validation usually takes a few milliseconds; keep the spinner up at least this long so it reads
// as feedback rather than a flicker
const MIN_SPINNER_MS = 100;

const validateButton = document.getElementById("pg-validate");
const schemaResultsEl = document.getElementById("pg-schema-results");
const documentResultsEl = document.getElementById("pg-document-results");
const schemaStatusEl = document.getElementById("pg-schema-status");
const documentStatusEl = document.getElementById("pg-document-status");

function createEditor(parent, doc) {
  return new EditorView({
    doc,
    parent,
    extensions: [
      // Before basicSetup, so it takes precedence over the default Mod-Enter (insertBlankLine).
      keymap.of([{ key: "Mod-Enter", run: () => (runValidation(), true) }]),
      basicSetup,
      yaml(),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) scheduleValidation();
      }),
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

const issueItem = ({ path, line, col, error }) => ({ line, col, text: path ? `.${path}: ${error}` : error });

const fatalItem = ({ line, col, message }) => ({ line, col, text: message });

/**
 * Shows a panel's validation outcome: a ✓ or ✗ after its title (`status` "valid" or "invalid",
 * or none when it wasn't validated), the `items` ([{ line, col, text }]) highlighted in `editor`
 * and listed in the results box `el`, and an optional `note` in place of the list.
 */
function renderPanel(el, statusEl, editor, { status, items = [], note }) {
  statusEl.hidden = !status;
  statusEl.className = `pg-status pg-status-${status}`;
  statusEl.textContent = status === "valid" ? "✓" : "✗";
  statusEl.title = status === "valid" ? "Valid" : "Invalid";
  statusEl.setAttribute("aria-label", statusEl.title);
  statusEl.setAttribute("role", "img");

  el.className = `pg-results ${note ? "pg-note" : "pg-invalid"}`;
  el.replaceChildren();
  if (note) {
    el.textContent = note;
  } else if (items.length > 0) {
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
  renderPanel(schemaResultsEl, schemaStatusEl, schemaEditor, {
    status: items.length === 0 ? "valid" : "invalid",
    items,
  });
}

function renderDocumentResult(result) {
  const { fatal } = result;
  if (fatal?.phase === "schema") {
    // The document wasn't validated, so it gets neither a ✓ nor a ✗
    renderPanel(documentResultsEl, documentStatusEl, documentEditor, {
      note: "Fix the schema errors to validate the document.",
    });
  } else {
    const items = fatal ? [fatalItem(fatal)] : result.errors.map(issueItem);
    renderPanel(documentResultsEl, documentStatusEl, documentEditor, {
      status: items.length === 0 ? "valid" : "invalid",
      items,
    });
  }
}

function validateNow() {
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

let ready = false;
let validating = false;
// Set when an edit or click arrives mid-validation, so it runs again on the latest text
let rerun = false;
let debounceTimer;

function scheduleValidation() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runValidation, DEBOUNCE_MS);
}

function setValidating(busy) {
  validating = busy;
  validateButton.setAttribute("aria-busy", String(busy));
  if (busy) {
    const spinner = document.createElement("span");
    spinner.className = "pg-spinner";
    spinner.setAttribute("aria-hidden", "true");
    validateButton.replaceChildren(spinner, "Validating…");
  } else {
    validateButton.replaceChildren("Validate");
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Resolves after the browser has painted, so the spinner shows before the synchronous wasm call
// blocks the main thread
const afterPaint = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));

/** Validates now (cancelling any pending debounced run), showing a spinner on the button. */
async function runValidation() {
  if (!ready) return;
  clearTimeout(debounceTimer);
  if (validating) {
    rerun = true;
    return;
  }
  setValidating(true);
  const started = performance.now();
  await afterPaint();
  validateNow();
  await delay(MIN_SPINNER_MS - (performance.now() - started));
  setValidating(false);
  if (rerun) {
    rerun = false;
    runValidation();
  }
}

await wasm.default();
ready = true;
validateButton.disabled = false;
validateButton.addEventListener("click", runValidation);
runValidation();
document.getElementById("pg-version").textContent =
  `yaml-schema v${wasm.version()} (WebAssembly)`;
