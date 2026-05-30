---
layout: default
title: Objects
parent: Features
nav_order: 3
---

# Objects

The `object` type validates key-value mappings.

## Basic Object Validation

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

## Properties

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

## Pattern Properties

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

## Additional Properties

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

## Required Properties

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

## Property Names

`propertyNames`, by default, uses an implicit `type: string` and validates a **pattern** to each key's **string form** (JSON Schema behavior).

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

## Property Names (YAML-specific)

Unlike JSON, YAML may use **non-string scalars** as mapping keys (e.g. integers). JSON Schema's `propertyNames` is defined in terms of **string** property names and only supports a `pattern` on that string projection.

In YAML Schema, **`propertyNames`** is extended to support a **subschema** to validate against each mapping **key node** as parsed YAML, the same way `items` validates array elements. Any keywords valid in a subschema apply (`type`, `enum`, `const`, composition, and so on).

The reference implementation is the [`yaml-schema`](https://crates.io/crates/yaml-schema) crate and `ys` CLI ([source on GitHub](https://github.com/yaml-schema/yaml-schema)).

### Integer keys

```yaml
# Schema
type: object
propertyNames:
  type: integer
```

**Valid examples:**
```yaml
1: one
2: two
```

**Invalid examples:**
```yaml
hello: world
```

**Error:** `[1:1] .hello: Expected a number, but got: "hello" (string)`

### String keys with enum

```yaml
# Schema
type: object
propertyNames:
  type: string
  enum:
    - alpha
    - beta
```

**Valid examples:**
```yaml
alpha: 1
beta: 2
```

**Invalid examples:**
```yaml
gamma: 3
```

**Error:** `[1:1] .gamma: Value "gamma" is not in the enum: ["alpha", "beta"]`

## Object Size

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
