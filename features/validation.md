---
layout: default
title: Validation
parent: Features
nav_order: 4
---

# Validation

YAML Schema provides various validation constraints that can be applied to types. This page covers enums, constants, and other validation features.

## Enums

The `enum` keyword restricts values to a specific set of allowed values.

### Basic Enum

```yaml
# Schema
enum:
  - red
  - amber
  - green
```

**Valid examples:**
```yaml
red
```

```yaml
green
```

**Invalid examples:**
```yaml
blue
```

### Enum with Mixed Types

Enums can contain values of different types:

```yaml
# Schema
enum:
  - red
  - amber
  - green
  - null
  - 42
```

**Valid examples:**
```yaml
red
```

```yaml
null
```

```yaml
42
```

**Invalid examples:**
```yaml
0
```

### Enum with Type Constraint

You can combine `enum` with a `type` constraint:

```yaml
# Schema
type: object
properties:
  version:
    type: integer
    enum: [1]
```

**Valid examples:**
```yaml
version: 1
```

**Invalid examples:**
```yaml
version: 2
```

### Enum in Arrays

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

**Invalid examples:**
```yaml
- 24
- Sussex
- Drive
```

### Enum with Numbers

```yaml
# Schema
type: integer
enum: [1, 10, 100]
```

**Valid examples:**
```yaml
1
```

```yaml
10
```

```yaml
100
```

**Invalid examples:**
```yaml
101
```

```yaml
# Schema
type: number
enum: [-1.0, 0.0, 1.0]
```

**Valid examples:**
```yaml
-1.0
```

```yaml
0.0
```

```yaml
1.0
```

**Invalid examples:**
```yaml
3.14
```

## Constants

The `const` keyword requires the value to be exactly equal to a specific constant value.

### Basic Const

```yaml
# Schema
type: object
properties:
  country:
    const: United States of America
```

**Valid examples:**
```yaml
country: United States of America
```

**Invalid examples:**
```yaml
country: Canada
```

### Const in Composition

Constants are often used with composition operators like `oneOf`:

```yaml
# Schema
oneOf:
  - type: object
    properties:
      type:
        const: "integer"
      minimum:
        type: integer
      maximum:
        type: integer
    required:
      - type
  - type: object
    properties:
      type:
        const: "string"
    required:
      - type
```

**Valid examples:**
```yaml
type: integer
```

```yaml
type: integer
minimum: 1
maximum: 10
```

```yaml
type: string
```

**Invalid examples:**
```yaml
type: boolean
```

## String Validation

### Length Constraints

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

### Pattern Matching

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

## Number Validation

### Multiples

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

### Range Constraints

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

Available range keywords:
- `minimum` - Inclusive minimum value
- `maximum` - Inclusive maximum value
- `exclusiveMinimum` - Exclusive minimum value
- `exclusiveMaximum` - Exclusive maximum value

## Array Validation

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

See [Types](types.html#minitems-and-maxitems) for `minItems`, `maxItems`, `uniqueItems`, and `minContains` / `maxContains` with `contains`.

## Object Validation

### Required Properties

```yaml
# Schema
type: object
properties:
  name:
    type: string
  email:
    type: string
required:
  - name
  - email
```

**Valid examples:**
```yaml
name: William Shakespeare
email: bill@stratford-upon-avon.co.uk
```

**Invalid examples:**
```yaml
name: William Shakespeare
address: Henley Street, Stratford-upon-Avon, Warwickshire, England
```

```yaml
name: William Shakespeare
email: null
```

Note: A property with a `null` value is considered not being present.

### Property Size

```yaml
# Schema
type: object
minProperties: 2
maxProperties: 3
```

**Valid examples:**
```yaml
a: 0
b: 1
```

```yaml
a: 0
b: 1
c: 2
```

**Invalid examples:**
```yaml
{}
```

```yaml
a: 0
```

```yaml
a: 0
b: 1
c: 2
d: 3
```

### Property Names

```yaml
# Schema
type: object
propertyNames:
  pattern: "^[A-Za-z_][A-Za-z0-9_]*$"
```

**Valid examples:**
```yaml
_a_proper_token_001: "value"
```

**Invalid examples:**
```yaml
-001 invalid: "value"
```

## Descriptions

You can add descriptions to schemas for documentation purposes. Descriptions don't affect validation:

```yaml
# Schema
type: string
description: "First name"
```

```yaml
# Schema
description: A string or a number
anyOf:
  - type: string
  - type: number
```

```yaml
# Schema
type: number
description: The description
```
