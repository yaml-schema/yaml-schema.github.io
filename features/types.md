---
layout: default
title: Types
parent: Features
nav_order: 2
---

# Types

YAML Schema supports validation for all YAML data types. This page covers string, number, integer, boolean, null, array, and object types.

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

## Object Type

The `object` type validates key-value mappings.

### Basic Object Validation

```yaml
# Schema
type: object
```

**Valid examples:**
```yaml
key: value
another_key: another_value
```

```yaml
Sun: 1.9891e30
Jupiter: 1.8986e27
```

```yaml
0.01: cm
1: m
1000: km
```

**Invalid examples:**
```yaml
"Not an object"
```

```yaml
["An", "array", "not", "an", "object"]
```

Note: Unlike JSON, YAML allows numeric keys, which are treated as strings.

### Properties

```yaml
# Schema
type: object
properties:
  number:
    type: number
  street_name:
    type: string
  street_type:
    enum: [Street, Avenue, Boulevard]
```

**Valid examples:**
```yaml
number: 1600
street_name: Pennsylvania
street_type: Avenue
```

```yaml
number: 1600
street_name: Pennsylvania
```

```yaml
{}
```

```yaml
number: 1600
street_name: Pennsylvania
street_type: Avenue
direction: NW
```

**Invalid examples:**
```yaml
number: "1600"
street_name: Pennsylvania
street_type: Avenue
```

Note: By default, leaving out properties is valid, and providing additional properties is also valid.

### Pattern Properties

```yaml
# Schema
type: object
patternProperties:
  ^S_:
    type: string
  ^I_:
    type: integer
```

**Valid examples:**
```yaml
S_25: This is a string
```

```yaml
I_0: 42
```

```yaml
keyword: value
```

**Invalid examples:**
```yaml
S_0: 42
```

```yaml
I_42: This is a string
```

### Additional Properties

By default, additional properties are allowed. You can restrict this:

```yaml
# Schema
type: object
properties:
  number:
    type: number
  street_name:
    type: string
additionalProperties: false
```

**Valid examples:**
```yaml
number: 1600
street_name: Pennsylvania
```

**Invalid examples:**
```yaml
number: 1600
street_name: Pennsylvania
direction: NW
```

You can also specify a schema for additional properties:

```yaml
# Schema
type: object
properties:
  number:
    type: number
additionalProperties:
  type: string
```

**Valid examples:**
```yaml
number: 1600
direction: NW
```

**Invalid examples:**
```yaml
number: 1600
office_number: 201
```

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

```yaml
name: William Shakespeare
email: bill@stratford-upon-avon.co.uk
address: Henley Street, Stratford-upon-Avon, Warwickshire, England
authorship: in question
```

**Invalid examples:**
```yaml
name: William Shakespeare
address: Henley Street, Stratford-upon-Avon, Warwickshire, England
```

```yaml
name: William Shakespeare
address: Henley Street, Stratford-upon-Avon, Warwickshire, England
email: null
```

Note: A property with a `null` value is considered not being present.

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

**Error:** `[1:1] .: Property name '-001 invalid' does not match pattern '^[A-Za-z_][A-Za-z0-9_]*$'`

### Object Size

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
