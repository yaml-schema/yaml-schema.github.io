---
layout: default
title: CLI
parent: Features
nav_order: 6
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

**Output:**
```
ys 0.9.0-rc1
```

## Basic Validation

Validate a YAML file against a schema:

```bash
ys -f tests/fixtures/schema.yaml tests/fixtures/valid.yaml
```

**Exit code:** `0` (success)

If the file is valid, the command exits with status code 0 and produces no output.

## Validation Errors

When validation fails, `ys` outputs error messages to stderr:

```bash
ys -f tests/fixtures/schema.yaml tests/fixtures/invalid.yaml
```

**Exit code:** `1` (failure)

**Example stderr output:**
```
[1:6] .foo: Expected a string, but got: Value(Integer(42))
[2:6] .bar: Expected a number, but got: Value(String("I'm a string"))
```

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

By default, `ys` collects all validation errors and reports them at the end. Use `--fail-fast` to exit as soon as the first error is encountered:

```bash
ys --fail-fast -f tests/fixtures/schema.yaml tests/fixtures/invalid.yaml
```

## Usage

```bash
ys -f <schema-file> <yaml-file>
```

**Arguments:**
- `-f, --schema <schema-file>` - Path to the YAML schema file
- `<yaml-file>` - Path to the YAML file to validate
- `--fail-fast` - Exit as soon as any validation error is encountered

**Exit codes:**
- `0` - Validation succeeded
- `1` - Validation failed or an error occurred
