---
layout: default
title: References
parent: Features
nav_order: 7
---

# References

YAML Schema supports reusable schema definitions using `$defs` and `$ref`. This allows you to define a schema once and reference it in multiple places, reducing duplication and making schemas easier to maintain.

## Defining Reusable Schemas with `$defs`

The `$defs` keyword declares a set of named schema definitions that can be referenced elsewhere in the schema:

```yaml
# Schema
$defs:
  name:
    type: string
  age:
    type: integer
    minimum: 0
type: object
properties:
  name:
    $ref: "#/$defs/name"
  age:
    $ref: "#/$defs/age"
```

**Valid examples:**
```yaml
name: "John Doe"
age: 30
```

**Invalid examples:**
```yaml
name: 42
age: "not a number"
```

## Using `$ref`

The `$ref` keyword references a schema defined in `$defs`. References use JSON Pointer syntax starting with `#/$defs/`:

```yaml
$ref: "#/$defs/name"
```

When a `$ref` is encountered during validation, the referenced schema is looked up and used to validate the value.

## Reference Format

References must be local JSON Pointer references starting with one of:
- `#/$defs/` - the standard location for definitions
- `#/definitions/` - an alternate location (for compatibility)

External references (URLs or file paths) are not currently supported.

## Example: Shared Type Definitions

```yaml
# Schema
$defs:
  address:
    type: object
    properties:
      street:
        type: string
      city:
        type: string
    required:
      - street
      - city
type: object
properties:
  home_address:
    $ref: "#/$defs/address"
  work_address:
    $ref: "#/$defs/address"
```

**Valid examples:**
```yaml
home_address:
  street: "123 Main St"
  city: "Springfield"
work_address:
  street: "456 Office Blvd"
  city: "Shelbyville"
```

**Invalid examples:**
```yaml
home_address:
  street: "123 Main St"
work_address:
  city: "Shelbyville"
```

In this example, both `home_address` and `work_address` must conform to the same `address` schema, which requires both `street` and `city` properties.

## Annotations

YAML Schema also supports the following annotation keywords that don't affect validation:

- `$id` - A URI identifier for the schema
- `$schema` - Identifies the meta-schema
- `title` - A short title for the schema
- `description` - A longer description of the schema (see [Validation - Descriptions](validation.md#descriptions))
