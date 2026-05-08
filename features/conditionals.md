---
layout: default
title: Conditionals
parent: Features
nav_order: 7
---

# Conditionals

Object schemas can express **dependencies** between properties and **conditional** subschemas using `if`, `then`, and `else`, similar to JSON Schema.

## `dependentRequired`

When certain properties are present, other properties become required. The value is an object whose keys are property names; each key maps to a list of property names that must also appear if the key is present.

```yaml
# Schema
type: object
properties:
  name:
    type: string
  credit_card:
    type: number
  billing_address:
    type: string
required:
  - name
dependentRequired:
  credit_card:
    - billing_address
```

- Valid: `name` only; or `name` + `credit_card` + `billing_address`; or `name` + `billing_address` (dependencies are not bidirectional).
- Invalid: `credit_card` without `billing_address`.

To require both directions (e.g. card and address together or neither), list both keys under `dependentRequired`:

```yaml
dependentRequired:
  credit_card:
    - billing_address
  billing_address:
    - credit_card
```

## `dependentSchemas`

When a property is present, apply an additional schema (extra `properties`, `required`, etc.).

```yaml
type: object
properties:
  name:
    type: string
  credit_card:
    type: number
required:
  - name
dependentSchemas:
  credit_card:
    properties:
      billing_address:
        type: string
    required:
      - billing_address
```

If `credit_card` is present, `billing_address` must exist and be a string. If `credit_card` is absent, `billing_address` is not required by this rule.

## `if`, `then`, and `else`

- **`if`** — schema; if the instance is valid against it, **`then`** must also validate; otherwise **`else`** applies (when present).
- **`default`** on a property is an **annotation** and does not change whether `if` matches; it documents the value processors may use when the property is missing.

Postal code example (country-specific patterns):

```yaml
type: object
properties:
  street_address:
    type: string
  country:
    default: United States of America
    enum:
      - United States of America
      - Canada
if:
  properties:
    country:
      const: United States of America
then:
  properties:
    postal_code:
      pattern: '[0-9]{5}(-[0-9]{4})?'
else:
  properties:
    postal_code:
      pattern: '[A-Z][0-9][A-Z] [0-9][A-Z][0-9]'
```

You can express several country-specific branches by placing multiple `if` / `then` pairs inside `allOf`.

## See also

- [Composition](composition.md) for `allOf` with conditionals
- [References - Annotations](references.md#annotations) for `default`
