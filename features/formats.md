---
layout: default
title: String formats
parent: Features
nav_order: 3
---

# String formats

For `type: string`, the `format` keyword applies additional checks for common serialized forms. Formats follow JSON Schema conventions (RFC 3339 dates and times, ISO 8601 duration, etc.).

Combine `format` with other string keywords such as `minLength`, `pattern`, and `maxLength`; all applicable constraints must pass.

## Supported formats

| `format` value    | Validates |
|-------------------|-----------|
| `date`            | Full-date per RFC 3339 |
| `date-time`       | Date-time per RFC 3339 |
| `time`            | Partial-time with optional timezone per RFC 3339 |
| `duration`        | ISO 8601 duration |
| `email`           | Common email address shape |
| `hostname`        | RFC 1123 hostname |
| `ipv4`            | IPv4 address |
| `ipv6`            | IPv6 address |
| `uri`             | Absolute URI reference |
| `uuid`            | UUID string |
| `json-pointer`    | JSON Pointer (RFC 6901) |
| `regex`           | A valid regular expression string |

### Examples

**Date (RFC 3339 full-date)**

```yaml
# Schema
type: string
format: date
```

Valid: `"2024-01-15"`, `"2000-02-29"`  
Invalid: `"not-a-date"`, invalid months/days.

**Date-time**

```yaml
type: string
format: date-time
```

Valid: `"2024-01-15T12:00:00Z"`, with offsets or fractional seconds.  
Invalid: a bare date without time where a full date-time is required.

**Time**

```yaml
type: string
format: time
```

Valid: `"12:00:00Z"`, `"23:59:59+00:00"`. Invalid hour ranges, malformed strings.

**Duration (ISO 8601)**

```yaml
type: string
format: duration
```

Valid: `"P1Y2M3D"`, `"PT1H30M"`. Invalid: `"P"` alone, arbitrary text.

**Email, hostname, IPv4, IPv6, URI, UUID** follow the usual shapes (e.g. `"user@example.com"` for `email`, `"::1"` for `ipv6`).

**JSON Pointer**

```yaml
type: string
format: json-pointer
```

Valid: `""`, `"/foo/bar"`, `"/foo/0"`. Invalid: missing leading `/` where required.

**Regex**

The value must be a syntactically valid regular expression string (as used by the implementation), not arbitrary text.

## Combining `format` with other keywords

Other string constraints apply in addition to `format`. For example, `format: email` with `minLength: 10` rejects short but syntactically valid local parts.

```yaml
type: string
format: email
minLength: 10
```

## Unknown formats (annotation-only)

If `format` names a value that the implementation does not recognize, it is treated as an **annotation only**: validation does **not** fail based on that keyword. This allows custom `format` labels for tools while keeping instances valid.

```yaml
type: string
format: my-custom-format
```

Any string value is accepted for validation purposes.

## See also

- [Types - String type](types.html#string-type) for `pattern`, `minLength`, and `maxLength`.
