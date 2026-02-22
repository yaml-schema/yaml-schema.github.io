---
layout: default
title: Composition
parent: Features
nav_order: 4
---

# Composition

YAML Schema provides several composition operators that allow you to combine multiple schemas: `allOf`, `anyOf`, `oneOf`, and `not`.

## allOf

The `allOf` keyword requires that the value validates against **all** of the provided schemas.

### Basic allOf

```yaml
# Schema
allOf:
  - type: string
    minLength: 1
  - type: string
    maxLength: 5
```

**Valid examples:**
```yaml
"short"
```

**Invalid examples:**
```yaml
""
```

```yaml
"too long"
```

The value must satisfy both constraints: it must be a string with length between 1 and 5 characters.

## anyOf

The `anyOf` keyword requires that the value validates against **at least one** of the provided schemas.

### Basic anyOf

```yaml
# Schema
anyOf:
  - type: string
    maxLength: 5
  - type: number
    minimum: 0
```

**Valid examples:**
```yaml
"short"
```

```yaml
12
```

**Invalid examples:**
```yaml
"too long"
```

```yaml
-5
```

```yaml
true
```

The value can be either a short string (5 characters or less) OR a non-negative number.

### anyOf with Description

```yaml
# Schema
description: A string or a number
anyOf:
  - type: string
  - type: number
```

**Valid examples:**
```yaml
"I am a string"
```

```yaml
42
```

**Invalid examples:**
```yaml
true
```

## oneOf

The `oneOf` keyword requires that the value validates against **exactly one** of the provided schemas (not zero, not multiple).

### Basic oneOf

```yaml
# Schema
oneOf:
  - type: number
    multipleOf: 5
  - type: number
    multipleOf: 3
```

**Valid examples:**
```yaml
10
```

```yaml
9
```

**Invalid examples:**
```yaml
2
```

```yaml
15
```

The value `15` is rejected because it's a multiple of both 5 and 3, which means it matches multiple schemas. The value `2` is rejected because it matches none of the schemas.

### oneOf with Objects

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

### oneOf with Null or Object

```yaml
# Schema
type: object
properties:
  child:
    oneOf:
      - type: null
      - type: object
        properties:
          name:
            type: string
        required:
          - name
additionalProperties: false
```

**Valid examples:**
```yaml
child: null
```

```yaml
child:
  name: John
```

**Invalid examples:**
```yaml
name: John
```

This schema allows `child` to be either `null` or an object with a required `name` property.

### oneOf in Properties

```yaml
# Schema
type: object
properties:
  name:
    type: string
  github:
    type: object
    properties:
      environments:
        type: object
        patternProperties:
          "^[a-zA-Z][a-zA-Z0-9_-]*$":
            type: object
            properties:
              reviewers:
                oneOf:
                  - type: null
                  - type: array
                    items:
                      type: string
```

**Valid examples:**
```yaml
name: test
github:
  environments:
    development:
      reviewers: null
```

```yaml
name: test
github:
  environments:
    production:
      reviewers:
        - alice
        - bob
```

**Invalid examples:**
```yaml
name: test
github:
  environments:
    development:
      reviewers: true
```

### oneOf with Pattern Properties

```yaml
# Schema
type: object
patternProperties:
  ^[a-zA-Z0-9]+$:
    oneOf:
      - type: null
      - type: object
        properties:
          name:
            type: string
```

**Valid examples:**
```yaml
a1b:
  name: John
```

## not

The `not` keyword requires that the value **does not** validate against the provided schema.

### Basic not

```yaml
# Schema
not:
  type: string
```

**Valid examples:**
```yaml
42
```

```yaml
key: value
```

**Invalid examples:**
```yaml
"I am a string"
```

### not with Constraints

```yaml
# Schema
not:
  type: number
  multipleOf: 2
```

**Valid examples:**
```yaml
1
```

```yaml
-1
```

```yaml
3
```

**Invalid examples:**
```yaml
2
```

```yaml
-2
```

This schema accepts any value that is NOT an even number.

## Combining Composition Operators

Composition operators can be nested and combined to create complex validation rules:

```yaml
# Schema
type: object
properties:
  child:
    oneOf:
      - type: null
      - type: object
        properties:
          name:
            type: string
        required:
          - name
additionalProperties: false
```

```yaml
# Schema
type: object
properties:
  github:
    type: object
    properties:
      environments:
        type: object
        patternProperties:
          "^[a-zA-Z][a-zA-Z0-9_-]*$":
            type: object
            properties:
              reviewers:
                oneOf:
                  - type: null
                  - type: array
                    items:
                      type: string
```

These examples show how `oneOf` can be used within object properties and pattern properties to create flexible schemas that allow multiple valid forms.
