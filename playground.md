---
layout: default
title: Playground
nav_order: 4
---

# Playground

Validate a YAML document against a YAML schema, right in your browser. Validation runs locally
via WebAssembly; nothing is sent to a server.

{%- comment -%}
  ?v=<build time> busts the browser cache: Jekyll (and GitHub Pages) serve these without
  Cache-Control, so after an update the browser can pair the new page with stale assets.
{%- endcomment -%}
{%- capture asset_version -%}{{ site.time | date: '%s' }}{%- endcapture %}

<link rel="stylesheet" href="{{ '/assets/css/playground.css' | relative_url }}?v={{ asset_version }}">

<div class="playground">
  <section class="pg-panel" aria-labelledby="pg-schema-label">
    <div class="pg-panel-header">
      <span class="pg-panel-title"><span id="pg-schema-label">Schema</span><span id="pg-schema-status" class="pg-status" hidden></span></span>
    </div>
    <div id="pg-schema" class="pg-editor"></div>
    <div id="pg-schema-results" class="pg-results" aria-live="polite"></div>
  </section>

  <section class="pg-panel" aria-labelledby="pg-document-label">
    <div class="pg-panel-header">
      <span class="pg-panel-title"><span id="pg-document-label">Document</span><span id="pg-document-status" class="pg-status" hidden></span></span>
      <button id="pg-validate" type="button" class="btn btn-primary" disabled>Loading…</button>
    </div>
    <div id="pg-document" class="pg-editor"></div>
    <div id="pg-document-results" class="pg-results" aria-live="polite"></div>
  </section>
</div>

<p id="pg-version" class="pg-version"></p>

<script type="module" src="{{ '/assets/js/playground.js' | relative_url }}?v={{ asset_version }}"></script>
