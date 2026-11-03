# Blog visual audit and implementation

November 3, 2026. Changes are local, in `src/lib/styles/inner-page.css`.

## Findings and changes

The rendered blog background was `rgb(11, 14, 18)` (`#0b0e12`), while the main site's public palette uses parchment `#faf7f2`, navy `#0f203c`, gold `#d4a843`, and white surfaces. The shared public blog stylesheet consumed the same dark `--bg`, `--panel`, and `--text` tokens as the admin studio. That was the direct source of the mismatch.

The implementation maps these legacy tokens to the canonical public palette within `.inner-page` only. This covers the index, article, category/tag archives, search/empty states, and blog error page without changing the admin theme or site-wide tokens. The navy hero remains consistent with other public pages; its gold text and focus indicators are explicitly scoped for its dark surface.

Article cards now use white surfaces, dark text, soft borders/shadows, readable excerpts, and body-font metadata. Gold is used for actions and restrained accents. Dark teal is used for links on light surfaces, rather than using low-contrast gold text on white. Calculated solid-color contrast ratios: teal/white 6.25:1; muted text/white 7.56:1; primary text/white 14.63:1; navy/gold 7.34:1. These selected pairs are not a complete accessibility certification of every state.

The original lone featured article occupied one of three grid columns, leaving the remainder of the row empty. A single featured article with an image now fills the row with a two-column image/text layout; it stacks below 760 px. Multiple featured cards retain the existing grid. Cards without an image are not forced into the two-column layout.

Category navigation and article links have 44 px minimum target heights. Search controls are 48 px tall with 16 px text. Card bodies and metadata can shrink/wrap under enlarged text. Pagination wraps, taxonomy breadcrumbs wrap, and the password-input row stacks on small screens. No article content, URLs, forms, SEO, or server data logic was changed.

## Validation

- Chromium exercised index, matching search, empty search, category, article, tag, and 404 pages at 320, 375, 768, and 1440 CSS px: 28 route/viewport combinations. Normal layouts had no horizontal overflow and no page errors.
- Submitting the search form with `mustard` navigated to `/blog?search=mustard`, displayed the matching heading, and returned one article.
- All four displayed card images decoded successfully at natural width 1,200 px. Blank thumbnails in an early full-page capture were caused by images not yet loaded; screenshots were retaken after decoding.
- Root-font enlargement to 200% at 375 px exposed card metadata wrapping defects. These were corrected and rechecked. This is a stress test, not a substitute for real browser zoom or assistive-technology testing.
- `pnpm check` passed with zero errors/warnings. The production build and lint passed.
- Application changes are CSS only. The configured Svelte MCP tools were unavailable, and no Svelte source was written.

## Evidence and visual review

[Desktop after](desktop.png) · [Mobile after](mobile.png) · [Before](before.png) · [Browser measurements](browser-evidence.json).

The browser measurements precede the final small control-font and enlarged-text wrapping refinements. Normal-width checks were repeated after the control-font change; the enlarged-text check was repeated after the final wrapping correction. Screenshots show the implemented layout; the last metadata-wrapping adjustment only affects enlarged text.

Guidance checked on November 3, 2026: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Branding choices come from the existing site's design tokens and the user's requested visual consistency. There is no claim of measured conversion uplift.

The earlier footer audit remains a separate deliverable; this change does not implement its proposed redesign. The implementation and evidence are packaged together for pull-request review and deployment.
