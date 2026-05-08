---
layout: default
title: Multiple Types
parent: Features
nav_order: 6
---

# Multiple Types

YAML Schema supports specifying multiple types for a value using an array. This allows a value to be validated against any of the specified types.

## Basic Multiple Types

You can specify multiple types by providing an array of type names:

```yaml
# Schema
type:
  - string
  - number
```

**Valid examples:**
```yaml
"I'm a string"
```

```yaml
42
```

**Invalid examples:**
```yaml
null
```

```yaml
true
```

```yaml
an:
  - arbitrarily
  - nested
data: structure
```

The value must be either a string OR a number.

## Multiple Types with Constraints

When using multiple types, constraints are applied to each type where applicable:

```yaml
# Schema
type:
  - string
  - number
minimum: 1
minLength: 1
```

**Valid examples:**
```yaml
1
```

```yaml
"one"
```

**Invalid examples:**
```yaml
0
```

```yaml
""
```

In this example:
- For numbers, the `minimum: 1` constraint applies, so `0` is invalid
- For strings, the `minLength: 1` constraint applies, so `""` is invalid

## Use Cases

Multiple types are useful when:

1. **Accepting different representations**: A value might be provided as either a string or a number
2. **Backward compatibility**: Supporting both old and new formats
3. **Flexible schemas**: Allowing users to choose the most convenient format

## Comparison with anyOf

Multiple types (`type: [string, number]`) is similar to using `anyOf`:

```yaml
# Using multiple types
type:
  - string
  - number
```

```yaml
# Using anyOf
anyOf:
  - type: string
  - type: number
```

However, multiple types is more concise when you only need to specify types without additional constraints. Use `anyOf` when you need different constraints for each type or more complex composition.
