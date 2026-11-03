# Vercel build audit — November 3, 2026

## Evidence and scope

Audited production deployment `gyf-ministry-evzjwn7k7-will-ribeiros-projects.vercel.app` using `vercel inspect --logs`, reproduced its build locally, and queried production runtime logs for the preceding 24 hours. The deployment was Ready. The runtime query returned zero error, warning, or fatal records, with no excluded intervals. This is an observation of available logs, not proof that every route was exercised.

## Findings and changes

- The client editor shared chunk was 811.44 kB minified. Explicit Tiptap and ProseMirror chunk groups reduced the largest client chunk to 351.37 kB without increasing the warning threshold. Configuration follows [Rolldown's code splitting API](https://rolldown.rs/reference/OutputOptions.codeSplitting).
- Auth tracing could not resolve `@opentelemetry/api`. Added the dependency and verified the warning disappeared.
- NFT 1.11.0's Sharp special case recognizes `sharp/lib/index.js`, whereas Sharp 0.35 uses `dist` entry points. Pinned every Sharp copy to 0.34.5, preventing mixed libvips versions and restoring native asset tracing.
- Four residual Sharp trace reports are optional development headers, optional WASM version metadata, and an unresolved platform token used only in native-load failure diagnostics. The checked-in adapter patch filters those exact importer/module pairs. It does not install those optional modules or fix NFT's analysis; it removes verified false positives. Required native binary resolution failures remain visible. Revisit the pin and patch when NFT supports Sharp's current entry points.
- Lint identified unsafe object-to-string conversions in ministry forms, auth forms, post hydration, custom fields, service errors, and fetch mocks. Added scalar text narrowing so uploaded files and malformed objects cannot become `[object Object]`. Added regression coverage.
- Replaced awaiting synchronous `dispatchEvent` with an explicit Svelte `tick` before checking the resulting DOM.

## Validation

- `env -u NO_COLOR pnpm build`: passed, no dependency or oversized-chunk warnings. Removing the conflicting inherited local color variable avoids Node's terminal-color warning; Vercel's inspected build did not contain that warning.
- Full browser/server suite: 25 files, 153 tests passed. After adding text regression tests, the server suite passed 16 files and 84 tests (two additional tests).
- Native smoke check loaded Sharp relative to the generated Vercel function, resized an image to 4 × 3, and encoded a 64-byte WebP successfully on macOS arm64. Linux execution still requires a Vercel build/deployment check.
- Type and lint results are recorded in the final audit response.

## Remaining upstream notices and limits

`pnpm install` still reports deprecated `@esbuild-kit/esm-loader@2.6.5` and `@esbuild-kit/core-utils@3.3.2`, introduced by `drizzle-kit@0.31.11`. These are install-time development dependency notices; replacing the loader with an incompatible package alias would not be a verified fix. They remain unresolved pending an upstream dependency change.

Rolldown may emit plugin timing advisories about Svelte compilation. These are performance measurements, not application errors. Svelte MCP tools were unavailable; no Svelte component source was edited.

Changes are local. No deployment was created or promoted during this audit.
