---
layout: default
title: CLI
parent: Features
nav_order: 9
---

# Command-Line Interface

YAML Schema provides a command-line tool `ys` for validating YAML files against schemas.

## Installation

See the [Installation guide](../getting-started/installation.md) for instructions on installing the `ys` command-line tool.

## Version

Display the version of `ys`:

```bash
ys version
```

**Output (example):**
```
ys 0.9.1
```

## Basic Validation

Validate a YAML file against a schema file:

```bash
ys -f tests/fixtures/schema.yaml tests/fixtures/valid.yaml
```

**Exit code:** `0` (success)

If the file is valid, the command exits with status code 0 and produces no human-readable output (aside from optional JSON; see below).

## Schema from the instance (`$schema`)

If you omit `-f` / `--schema`, `ys` reads a **string** property `$schema` from the **root mapping** of the instance YAML. That value is a schema URL or path: `https://…`, `http://…`, `file:///…`, an absolute path, or a path relative to the instance file’s directory.

```bash
ys path/to/instance.yaml
```

This matches common “self-describing” documents. If `$schema` is missing and no `-f` is given, the tool exits with an error.

## Validation Errors

When validation fails, `ys` prints plain-text errors to **stderr** by default:

```bash
ys -f tests/fixtures/schema.yaml tests/fixtures/invalid.yaml
```

**Exit code:** `1` (failure)

**Example stderr output:**
```
[1:6] .foo: Expected a string, but got: 42 (int)
[2:6] .bar: Expected a number, but got: "I'm a string" (string)
```

## JSON output

With `--json`, validation failures print a **JSON array** to **stdout**. Each element has `index`, `line`, `col`, `path`, and `error` (markers may be null if unavailable). Other failures (missing file, bad schema, etc.) print a single JSON object `{"error":"…"}` to **stderr**.

```bash
ys --json -f tests/fixtures/schema.yaml tests/fixtures/invalid.yaml
```

Use this for tooling and CI parsers.

## Error Format

Error messages follow this format:
```
[line:column] path: Error message
```

Where:
- `line:column` - The location in the YAML file where the error occurred
- `path` - The JSON path to the invalid value (e.g., `.foo`, `.bar.baz`)
- `Error message` - A description of what was expected and what was found

## Fail Fast

By default, `ys` collects validation errors and reports them at the end. Use `--fail-fast` to stop after the first validation error:

```bash
ys --fail-fast -f tests/fixtures/schema.yaml tests/fixtures/invalid.yaml
```

## Usage

```bash
ys [options] <yaml-file>
ys version
```

**Common options:**
- `-f, --schema <schema-file>` — Schema path (repeatable for additional preloaded documents for `$ref`). Optional if the instance has a string `$schema` at the root.
- `--fail-fast` — Stop after the first validation error
- `--json` — Emit validation errors as JSON on stdout; non-validation failures as `{"error":...}` on stderr

**Arguments:**
- `<yaml-file>` — YAML instance to validate (required for validation)

**Exit codes:**
- `0` — Validation succeeded
- `1` — Validation failed or another error occurred
