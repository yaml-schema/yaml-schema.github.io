---
layout: default
title: Basics
parent: Features
nav_order: 1
---

# Basics

This page covers the fundamental concepts of YAML Schema, including empty schemas, boolean schemas, and basic type validation.

## Empty Schema

An empty schema accepts any valid YAML value:

```yaml
# Schema
```

**Valid examples:**
```yaml
42
```

```yaml
"I'm a string"
```

```yaml
an:
  - arbitrarily
  - nested
data: structure
```

## Boolean Schemas

### `true` Schema

A schema with the value `true` accepts any value:

```yaml
# Schema
true
```

**Valid examples:**
```yaml
42
```

```yaml
"I'm a string"
```

```yaml
an:
  - arbitrarily
  - nested
data: structure
```

### `false` Schema

A schema with the value `false` rejects all values:

```yaml
# Schema
false
```

**Invalid examples:**
```yaml
42
```

```yaml
"I'm a string"
```

```yaml
an:
  - arbitrarily
  - nested
data: structure
```

## Type Validation

### Supported Types

YAML Schema supports the following types:
- `string`
- `number`
- `integer`
- `boolean`
- `null`
- `object`
- `array`

### Invalid Type Error

If you specify an unsupported type, validation will fail:

```yaml
# Schema
type: foo
```

**Error:** `Unsupported type: Expected type: string, number, integer, boolean, null, object, or array, but got: foo`

### String Type

```yaml
# Schema
type: string
```

**Valid examples:**
```yaml
""
```

```yaml
"I'm a string"
```

**Invalid examples:**
```yaml
42
```

```yaml
an:
  - arbitrarily
  - nested
data: structure
```

### Number Type

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

```yaml
an:
  - arbitrarily
  - nested
data: structure
```

### Object Type with Properties

```yaml
# Schema
type: object
properties:
  foo:
    type: string
  bar:
    type: number
```

**Valid examples:**
```yaml
foo: "I'm a string"
bar: 42
```

```yaml
foo: "I'm a string"
```

**Invalid examples:**
```yaml
foo: 42
bar: "I'm a string"
```

**Error:** `[1:6] .foo: Expected a string, but got: Value(Integer(42))`

Note: Missing properties are allowed by default unless `required` properties are specified.
