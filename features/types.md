---
layout: default
title: Types
parent: Features
nav_order: 2
---

# Types

YAML Schema supports validation for all YAML data types. This page covers string, number, integer, boolean, null, and array types. For object validation, see [Objects](objects.html).

## String Type

The `string` type validates text values.

### Basic String Validation

```yaml
# Schema
type: string
```

**Valid examples:**
```yaml
"Déjà vu"
```

```yaml
""
```

```yaml
"42"
```

**Invalid examples:**
```yaml
42
```

```yaml
true
```

### String Length Constraints

```yaml
# Schema
type: string
minLength: 2
maxLength: 3
```

**Valid examples:**
```yaml
"AB"
```

```yaml
"ABC"
```

**Invalid examples:**
```yaml
"A"
```

```yaml
"ABCD"
```

`minLength` and `maxLength` count **Unicode scalar values** (code points), not UTF-8 bytes. For example, with `maxLength: 2`, `"αβ"` is valid and `"αβγ"` is too long.

For dates, emails, URIs, and other standard string shapes, see [String formats](formats.html).

### String Pattern Matching

```yaml
# Schema
type: string
pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
```

**Valid examples:**
```yaml
"555-1212"
```

```yaml
"(888)555-1212"
```

**Invalid examples:**
```yaml
"(888)555-1212 ext. 532"
```

```yaml
"(800)FLOWERS"
```

## Number Types

### Number Type

The `number` type validates both integers and floating-point numbers.

```yaml
# Schema
type: number
```

**Valid examples:**
```yaml
42
```

```yaml
3.14
```

**Invalid examples:**
```yaml
"I'm a string"
```

### Integer Type

The `integer` type validates whole numbers. Note that `1.0` is considered an integer.

```yaml
# Schema
type: integer
```

**Valid examples:**
```yaml
42
```

```yaml
-1
```

```yaml
1.0
```

**Invalid examples:**
```yaml
3.1415926
```

```yaml
"42"
```

### Number Constraints

#### Multiples

```yaml
# Schema
type: number
multipleOf: 10
```

**Valid examples:**
```yaml
0
```

```yaml
10
```

```yaml
20
```

**Invalid examples:**
```yaml
23
```

#### Range Validation

```yaml
# Schema
type: number
minimum: 0
exclusiveMaximum: 100
```

**Valid examples:**
```yaml
0
```

```yaml
10
```

```yaml
99
```

**Invalid examples:**
```yaml
-1
```

```yaml
100
```

```yaml
101
```

Note: `minimum` is inclusive, while `exclusiveMaximum` is exclusive.

## Boolean Type

The `boolean` type validates true/false values.

```yaml
# Schema
type: boolean
```

**Valid examples:**
```yaml
true
```

```yaml
false
```

**Invalid examples:**
```yaml
"true"
```

## Null Type

The `null` type validates only null values.

```yaml
# Schema
type: null
```

**Valid examples:**
```yaml
null
```

**Invalid examples:**
```yaml
false
```

```yaml
0
```

```yaml
""
```

## Array Type

The `array` type validates ordered lists of values.

### Basic Array Validation

```yaml
# Schema
type: array
```

**Valid examples:**
```yaml
- 1
- 2
- 3
- 4
- 5
```

```yaml
- 3
- different
- types: "of values"
```

**Invalid examples:**
```yaml
Not: "an array"
```

### Array Items

```yaml
# Schema
type: array
items:
  type: number
```

**Valid examples:**
```yaml
- 1
- 2
- 3
- 4
- 5
```

```yaml
[]
```

**Invalid examples:**
```yaml
- 1
- 2
- "3"
- 4
- 5
```

Note: A single non-matching item causes the entire array to be invalid. Empty arrays are always valid.

### Tuple Validation with prefixItems

```yaml
# Schema
type: array
prefixItems:
  - type: number
  - type: string
  - enum:
    - Street
    - Avenue
    - Boulevard
  - enum:
    - NW
    - NE
    - SW
    - SE
```

**Valid examples:**
```yaml
- 1600
- Pennsylvania
- Avenue
- NW
```

```yaml
- 10
- Downing
- Street
```

```yaml
- 1600
- Pennsylvania
- Avenue
- NW
- Washington
```

**Invalid examples:**
```yaml
- 24
- Sussex
- Drive
```

```yaml
- Palais de l'Élysée
```

### Additional Items

By default, additional items beyond `prefixItems` are allowed. You can restrict this:

```yaml
# Schema
type: array
prefixItems:
  - type: number
  - type: string
items: false
```

**Valid examples:**
```yaml
- 1600
- Pennsylvania
- Avenue
- NW
```

```yaml
- 1600
- Pennsylvania
- Avenue
```

**Invalid examples:**
```yaml
- 1600
- Pennsylvania
- Avenue
- NW
- Washington
```

You can also specify a schema for additional items:

```yaml
# Schema
type: array
prefixItems:
  - type: number
  - type: string
items:
  type: string
```

**Valid examples:**
```yaml
- 1600
- Pennsylvania
- Avenue
- NW
- Washington
```

**Invalid examples:**
```yaml
- 1600
- Pennsylvania
- Avenue
- NW
- 20500
```

### Contains

The `contains` keyword requires that at least one item in the array matches the schema:

```yaml
# Schema
type: array
contains:
  type: number
```

**Valid examples:**
```yaml
- life
- universe
- everything
- 42
```

```yaml
- 1
- 2
- 3
- 4
- 5
```

**Invalid examples:**
```yaml
- life
- universe
- everything
- forty-two
```

### minItems and maxItems

```yaml
# Schema
type: array
minItems: 2
```

Too few elements (including `[]`) fails validation. `maxItems` rejects arrays longer than the limit; an empty array is always allowed when `minItems` is not set.

Combined with `items`:

```yaml
type: array
minItems: 2
maxItems: 4
items:
  type: number
```

### uniqueItems

When `uniqueItems` is `true`, no two elements may be equal (including strings). `false` allows duplicates. Empty and single-element arrays are always valid.

```yaml
type: array
uniqueItems: true
```

### minContains and maxContains

With `contains`, **`minContains`** (default `1`) is the minimum number of elements that must match the `contains` schema; **`maxContains`** caps how many may match.

```yaml
type: array
contains:
  type: number
minContains: 2
```

At least two numbers are required somewhere in the array.

```yaml
type: array
contains:
  type: number
maxContains: 3
```

At most three elements may be numbers that satisfy `contains`.

Setting **`minContains: 0`** means the `contains` constraint is satisfied even when **no** element matches (the array may have zero matches).
