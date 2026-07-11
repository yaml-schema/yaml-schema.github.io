---
layout: default
title: Basic Usage
parent: Getting Started
nav_order: 2
---

Basic Usage
====

This guide walks through validating a YAML file with the `ys` command-line tool. If you have not installed `ys` yet, start with the [Installation](installation.html) guide.

## What you need

YAML Schema validation involves two documents:

1. **Schema** — describes the shape and constraints of acceptable YAML (types, required fields, allowed values, and so on).
2. **Instance** — the YAML file you want to check against that schema.

The YAML Schema specification is based on [JSON Schema](https://json-schema.org/), but schemas are written in YAML. The `ys` tool reads both files and reports any violations.

## A minimal example

Create a schema file named `schema.yaml`:

```yaml
type: object
properties:
  foo:
    type: string
  bar:
    type: number
```

This schema says the document must be a mapping with two optional properties: `foo` (a string) and `bar` (a number).

Create a valid instance file named `valid.yaml`:

```yaml
foo: "I'm a string"
bar: 42
```

Validate it:

```bash
ys -f schema.yaml valid.yaml
```

On success, `ys` prints nothing and exits with status code `0`.

## When validation fails

Create an invalid instance named `invalid.yaml`:

```yaml
foo: 42
bar: "I'm a string"
```

Run the same command:

```bash
ys -f schema.yaml invalid.yaml
```

`ys` exits with status code `1` and prints errors to **stderr**, one per violation:

```
[1:6] .foo: Expected a string, but got: 42 (int)
[2:6] .bar: Expected a number, but got: "I'm a string" (string)
```

Each line follows the format `[line:column] path: message`:

- **line:column** — where in the instance file the problem was found
- **path** — the location in the document (e.g. `.foo`, `.items.0`)
- **message** — what the schema expected and what was found

By default, `ys` collects every validation error before exiting. Use `--fail-fast` to stop after the first error:

```bash
ys --fail-fast -f schema.yaml invalid.yaml
```

## Pointing to the schema with `$schema`

Instead of passing `-f` / `--schema`, you can embed the schema location in the instance. Add a top-level string property `$schema` whose value is a URL or file path (absolute, or relative to the instance file's directory):

```yaml
$schema: schema.yaml
foo: "I'm a string"
bar: 42
```

Then validate without `-f`:

```bash
ys valid.yaml
```

If the instance has no `$schema` and you omit `-f`, `ys` exits with an error. See the [CLI reference](../features/cli.html) for supported URI forms (`https://`, `file:///`, and local paths).

## Multiple schema files

The `-f` / `--schema` option may be repeated. The **first** file is the root schema used to validate the instance; additional files are pre-loaded so `$ref` can resolve definitions in other documents:

```bash
ys -f root-schema.yaml -f shared-defs.yaml instance.yaml
```

See [References](../features/references.html) for `$defs`, `$ref`, and external schema resolution.

## JSON output for tooling

Pass `--json` when you need machine-readable errors (for editors, CI, or other tools). On validation failure, `ys` prints a JSON **array** to **stdout** — one object per error:

```bash
ys --json -f schema.yaml invalid.yaml
```

Example output (the tool emits compact JSON on one line):

```json
[
  {
    "col": 5,
    "error": "Expected a string, but got: 42 (int)",
    "index": 5,
    "line": 1,
    "path": "foo"
  },
  {
    "col": 5,
    "error": "Expected a number, but got: \"I'm a string\" (string)",
    "index": 13,
    "line": 2,
    "path": "bar"
  }
]
```

| Field   | Meaning |
|--------|---------|
| `index` | Byte offset into the source, or `null` if unknown |
| `line`  | 1-based line number, or `null` if unknown |
| `col`   | 0-based column index, or `null` if unknown |
| `path`  | Dot-separated path from the document root (e.g. `foo`, `items.0`) |
| `error` | Human-readable message |

Successful validation still exits `0` with no stdout. Non-validation failures (missing files, parse errors, and similar) print `{"error":"..."}` on **stderr**. See [CLI](../features/cli.html) for the full distinction between stdout and stderr.

## Writing schemas

The example above only checks property types. Common next steps when authoring schemas:

- **Required fields** — use the `required` keyword to reject missing properties. See [Validation](../features/validation.html#required-properties).
- **More types** — `string`, `number`, `integer`, `boolean`, `null`, `array`, and `object`. See [Basics](../features/basics.html) and [Types](../features/types.html).
- **Constraints** — `enum`, `const`, `pattern`, `minimum` / `maximum`, and more. See [Validation](../features/validation.html).
- **Composition** — combine subschemas with `allOf`, `anyOf`, `oneOf`, and `not`. See [Composition](../features/composition.html).

### YAML mapping keys

When you write schemas or instances in YAML, **mapping keys are parsed by YAML first**. Unquoted keys such as `1` become numbers; keys starting with `@` or `#` may need quoting. Use explicit quotes (e.g. `"@id"`, `"1"`) when the property name must be that exact string. See [Types](../features/types.html) for how `propertyNames` interacts with non-string keys.

## Checking your setup

Confirm `ys` is available and see its options:

```bash
ys --help
ys version
```

**yaml-schema** is also [self-validating](https://github.com/yaml-schema/yaml-schema#self-validation): its own schema ships as `yaml-schema.yaml` in the project repository and can be used to validate that file.

## Next Steps

Now that you can validate YAML with `ys`, explore:

- [CLI](../features/cli.html) — full command-line reference, exit codes, and error formats
- [Basics](../features/basics.html) — empty schemas, boolean schemas, and type validation
- [Features](../features/index.html) — complete keyword documentation
