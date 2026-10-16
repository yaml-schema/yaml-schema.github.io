---
layout: default
title: Home
nav_order: 1
---

# YAML Schema

YAML Schema is a tool to define and validate the structure and constraints of YAML documents, in YAML.
{: .fs-6 .fw-300 }

The YAML Schema specification is based on JSON Schema ([https://json-schema.org/](https://json-schema.org/)), but expressed as YAML.

It also provides a reference implementation and CLI (`ys`) written in Rust: the [`yaml-schema`](https://crates.io/crates/yaml-schema) crate ([source on GitHub](https://github.com/yaml-schema/yaml-schema)).

## Try it now

No install needed: the **[Playground](playground.html)** lets you edit a schema and a YAML document side by side, validating as you type.
Validation runs locally in your browser via WebAssembly, so nothing is sent to a server.

[Open the Playground](playground.html){: .btn .btn-primary }

## Getting Started

If you're new to YAML Schema, we recommend starting with these guides:

1. **[Playground](playground.html)** - Experiment in your browser without installing anything
2. **[Installation](getting-started/installation.html)** - Install the `ys` command-line tool
3. **[Basic Usage](getting-started/basic-usage.html)** - Learn the fundamentals of schema validation
4. **[Features](features/index.html)** - YAML Schema features

## Getting Help

- Report issues on [GitHub](https://github.com/yaml-schema/yaml-schema)

---

*This documentation is built with [Just the Docs](https://just-the-docs.github.io/just-the-docs/), a modern documentation theme for Jekyll.*
