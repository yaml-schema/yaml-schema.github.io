---
layout: default
title: Features
nav_order: 3
has_children: true
---

# Features

This section documents validation and schema keywords supported by YAML Schema and the `ys` CLI. For the normative keyword set, see the published schema at [yaml-schema.yaml](https://yaml-schema.net/yaml-schema.yaml).

## Topics

- **[CLI](cli.md)** — Command-line usage, instance `$schema`, JSON errors
- **[Basics](basics.md)** — Empty schemas, boolean schemas, basic types
- **[Types](types.md)** — Strings (including Unicode length), numbers, arrays, objects, etc.
- **[String formats](formats.md)** — `format` for dates, times, email, URI, UUID, and custom labels
- **[Validation](validation.md)** — Enums, `const`, descriptions, shared constraint examples
- **[Composition](composition.md)** — `allOf`, `anyOf`, `oneOf`, `not`
- **[Multiple types](multiple-types.md)** — `type: [string, number]` style unions
- **[Conditionals](conditionals.md)** — `dependentRequired`, `dependentSchemas`, `if` / `then` / `else`
- **[Unevaluated keywords](unevaluated.md)** — `unevaluatedProperties`, `unevaluatedItems`
- **[References](references.md)** — `$defs`, `$ref`, external resolution, circular refs

## Type system

YAML Schema supports these types:

- `string` — Text values
- `number` — Numeric values (integers and floats)
- `integer` — Whole numbers
- `boolean` — True/false values
- `null` — Null values
- `array` — Ordered lists
- `object` — Key-value mappings

Types combine with validation keywords and composition to describe your YAML documents.
