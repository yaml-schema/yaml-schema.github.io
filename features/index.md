---
layout: default
title: Features
nav_order: 3
has_children: true
---

# Features

This section documents validation and schema keywords supported by YAML Schema and the `ys` CLI. For the normative keyword set, see the published schema at [yaml-schema.yaml](https://yaml-schema.net/yaml-schema.yaml).

## Topics

- **[CLI](cli.html)** — Command-line usage, instance `$schema`, JSON errors
- **[Basics](basics.html)** — Empty schemas, boolean schemas, basic types
- **[Types](types.html)** — Strings (including Unicode length), numbers, arrays, etc.
- **[Objects](objects.html)** — `properties`, `patternProperties`, `additionalProperties`, `propertyNames`, and size constraints
- **[String formats](formats.html)** — `format` for dates, times, email, URI, UUID, and custom labels
- **[Validation](validation.html)** — Enums, `const`, descriptions, shared constraint examples
- **[Composition](composition.html)** — `allOf`, `anyOf`, `oneOf`, `not`
- **[Multiple types](multiple-types.html)** — `type: [string, number]` style unions
- **[Conditionals](conditionals.html)** — `dependentRequired`, `dependentSchemas`, `if` / `then` / `else`
- **[Unevaluated keywords](unevaluated.html)** — `unevaluatedProperties`, `unevaluatedItems`
- **[References](references.html)** — `$defs`, `$ref`, external resolution, circular refs

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
