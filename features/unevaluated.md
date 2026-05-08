---
layout: default
title: Unevaluated keywords
parent: Features
nav_order: 8
---

# Unevaluated properties and items

JSON Schema 2020-12-style **`unevaluatedProperties`** and **`unevaluatedItems`** apply to object keys and array positions that were not already “evaluated” by `properties`, `patternProperties`, `additionalProperties`, `items`, `prefixItems`, composition, and related keywords.

They are useful when you want **forbid extra** keys or **constrain extra** array elements after tuples or composition.

## `unevaluatedProperties`

### With explicit `properties`

```yaml
type: object
properties:
  a:
    type: string
unevaluatedProperties: false
```

- Valid: `{ a: hello }`
- Invalid: an extra key such as `b`.

### With `allOf`

Annotations from branches of `allOf` can merge which names count as evaluated. Keys allowed by any subschema may be present; `unevaluatedProperties: false` then rejects any **other** keys.

```yaml
allOf:
  - properties:
      a:
        type: string
  - unevaluatedProperties: false
```

`a` is allowed; `b` is not.

### With `anyOf`

Successful branches contribute evaluated property names from their schemas. For example, if the instance matches the first branch, only keys allowed by that branch (and merged annotations) count as evaluated; extra keys can still fail `unevaluatedProperties: false`.

```yaml
anyOf:
  - properties:
      a:
        type: string
  - properties:
      b:
        type: string
unevaluatedProperties: false
```

- Valid: `a: ok` or `b: ok` (each branch’s allowed keys only).
- Invalid: `a: ok` together with an extra unevaluated key such as `c: extra`.

## `unevaluatedItems`

### After `prefixItems`

Positions beyond the tuple are “unevaluated” unless covered by `items`.

```yaml
type: array
prefixItems:
  - type: integer
unevaluatedItems:
  type: string
```

- Valid: `[1, foo, bar]`
- Invalid: a non-string after the first integer, e.g. `[1, 2]`.

### Without `items` or `prefixItems`

Every index is unevaluated, so the schema applies to **all** elements:

```yaml
type: array
unevaluatedItems:
  type: integer
```

- Valid: `[1, 2]`
- Invalid: `[1, hi]` (second item is not an integer).

## See also

- [Types - Array type](types.md#array-type) for `items`, `prefixItems`, and `contains`
- [Types - Object type](types.md#object-type) for `properties`, `patternProperties`, and `additionalProperties`
