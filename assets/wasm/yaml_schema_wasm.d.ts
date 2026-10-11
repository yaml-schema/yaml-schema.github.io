/* tslint:disable */
/* eslint-disable */
/**
 * Validates a YAML `document` against a YAML `schema` (both as strings).
 *
 * `options` is an optional `{ failFast?: boolean }` object.
 *
 * Returns `{ valid, errors: [{ path, line, col, error }], fatal? }`, where `fatal` is
 * `{ phase: "schema" | "document" | "validation", message, line?, col? }` when validation
 * couldn't run to completion. Lines and columns are 1-based.
 *
 * Remote (`http`/`https`) and `file://` `$ref`s aren't supported in the WebAssembly build;
 * they produce a `fatal` error with phase `"validation"`.
 */
export function validate(schema: string, document: string, options: any): any;
/**
 * Validates a YAML `schema` against the YAML Schema meta-schema. Returns the same shape as
 * [`validate`]; YAML syntax errors in `schema` are reported with phase `"schema"`.
 */
export function validateSchema(schema: string): any;
/**
 * Returns the version of the underlying `yaml-schema` library.
 */
export function version(): string;
export function start(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly validate: (a: number, b: number, c: number, d: number, e: any) => [number, number, number];
  readonly validateSchema: (a: number, b: number) => [number, number, number];
  readonly version: () => [number, number];
  readonly start: () => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
