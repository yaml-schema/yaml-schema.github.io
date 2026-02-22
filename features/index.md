---
layout: default
title: Features
nav_order: 3
has_children: true
---

# Features

YAML Schema provides comprehensive validation capabilities for YAML documents. This section covers all the features available in the YAML Schema specification.

## Core Features
- **[CLI](cli.md)** - Command-line interface usage
- **[Basics](basics.md)** - Fundamental schema concepts including empty schemas, boolean schemas, and type validation
- **[Types](types.md)** - Support for all YAML types: strings, numbers, integers, booleans, nulls, arrays, and objects
- **[Validation](validation.md)** - Validation constraints including enums, constants, length, range, and pattern matching
- **[Composition](composition.md)** - Schema composition with `allOf`, `anyOf`, `oneOf`, and `not`
- **[Multiple Types](multiple-types.md)** - Support for multiple type values
- **[References](references.md)** - Reusable schema definitions with `$defs` and `$ref`

## Type System

YAML Schema supports the following types:
- `string` - Text values
- `number` - Numeric values (integers and floats)
- `integer` - Whole numbers
- `boolean` - True/false values
- `null` - Null values
- `array` - Ordered lists
- `object` - Key-value mappings

Each type can be combined with validation constraints to create precise schemas for your YAML documents.
