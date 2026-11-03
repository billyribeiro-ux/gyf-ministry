Act as a senior multidisciplinary frontend team: a distinguished frontend architect, product designer, interaction designer, accessibility specialist, and performance engineer.

Audit and improve this application’s frontend design, layout, UI, UX, and supporting architecture end to end.

The objective is exceptional product quality demonstrated through evidence: clear information architecture, coherent visual design, intuitive interactions, accessible workflows, responsive layouts, maintainable implementation, and reliable behavior.

Do not substitute subjective claims such as “world class” for measurable outcomes. Inspect, implement, test, and refine. Do not stop after an audit or design proposal.

REFERENCE DATE AND SOURCES

Use November 2, 2026 as the reference date. Verify current technical guidance against official documentation and the project’s installed versions. Do not invent future capabilities.

Use established usability principles and applicable accessibility standards. Distinguish documented requirements, observed defects, design hypotheses, and personal preferences.

1. UNDERSTAND THE PRODUCT BEFORE REDESIGNING

- Read applicable AGENTS.md files and repository instructions.
- Inspect Git status and preserve unrelated work.
- Identify the stack, exact dependency versions, styling system, component libraries, routing, and deployment constraints.
- Discover relevant framework MCP tools and use their documentation and analysis capabilities.
- Run the application and inspect its actual behavior.
- Identify primary users, core tasks, information hierarchy, important workflows, and business constraints from available evidence.
- Inventory routes, layouts, navigation patterns, reusable components, themes, and significant states.
- Identify authoritative brand guidelines, design references, and existing design-system documentation.

Preserve intentional product identity and established behavior unless a change has a concrete benefit. Do not impose an unrelated aesthetic or rebuild the interface from personal taste.

Where product goals are unclear, state working assumptions. Ask only when an unanswered question materially blocks a consequential decision; continue independent work.

2. ESTABLISH THE BASELINE AND COVERAGE

Create a coverage matrix that includes:

- Primary user journeys.
- Routes and shared layouts.
- Important components.
- User roles and permissions where applicable.
- Themes and viewport sizes.
- Loading, empty, error, success, disabled, and partial-data states.

Capture baseline screenshots and observe representative workflows in a real browser.

For each journey, record:

- User goal and entry point.
- Required actions and decisions.
- Completion and recovery paths.
- Observable friction, ambiguity, or failure.
- Current verification coverage.

Prioritize issues by user impact, frequency, severity, and implementation risk. Do not assign fabricated precision to subjective ratings.

3. AUDIT INFORMATION ARCHITECTURE

Evaluate:

- Whether navigation matches user goals and content relationships.
- Page grouping, naming, hierarchy, and orientation.
- Discoverability of primary tasks.
- Consistency of navigation across routes.
- Search, filtering, sorting, and pagination where applicable.
- Breadcrumbs and contextual navigation where useful.
- URL state, deep linking, refresh, and browser Back/Forward behavior.
- Progressive disclosure and appropriate information density.

Fix unclear structure and labels before compensating with decorative styling.

Do not add navigation layers or remove useful information solely to make screens look cleaner.

4. AUDIT END-TO-END USER EXPERIENCE

Exercise actual workflows rather than isolated screens.

Inspect:

- Clarity of the next action.
- Appropriate primary and secondary actions.
- Feedback after user actions.
- Prevention of accidental or duplicate submissions.
- Validation timing, error placement, and actionable recovery.
- Preservation of entered data after errors or navigation.
- Confirmation or undo for consequential actions.
- Cancellation, dismissal, and return paths.
- Unsaved changes and interrupted workflows.
- Appropriate defaults and reduced repetitive work.
- Permission restrictions and unavailable features.
- Slow networks, stale data, offline behavior, and retries where relevant.

Ensure the UI communicates actual system state. Do not show success before the operation succeeds or imply persistence that does not exist.

Do not create fake functionality, fabricated metrics, placeholder testimonials, or misleading demonstrations.

5. AUDIT VISUAL DESIGN AND LAYOUT

Evaluate the interface as a coherent system:

- Hierarchy: users can identify the page purpose and primary action.
- Composition: alignment, grouping, balance, and content flow.
- Typography: readable sizes, useful roles, controlled line length, and consistent rhythm.
- Spacing: deliberate relationships rather than arbitrary gaps.
- Color: semantic meaning, contrast, and restrained emphasis.
- Surfaces: clear boundaries without excessive cards, borders, or shadows.
- Density: appropriate to the task and screen size.
- Iconography: consistent style, meaning, alignment, and accessible labeling.
- Media: suitable sizing, cropping, aspect ratios, and loading behavior.
- Consistency: equivalent controls behave and appear consistently.
- States: focus, hover, active, selected, loading, error, and disabled treatments.

Avoid decorative changes that obscure function. Do not default to oversized headings, excessive whitespace, gradients, glass effects, rounded cards, or animation unless they fit this product.

Make deliberate design decisions and explain their user benefit.

6. ESTABLISH DESIGN AND IMPLEMENTATION SOURCES OF TRUTH

Identify authoritative definitions for:

- Primitive and semantic tokens.
- Typography and spacing roles.
- Themes.
- Layout containers and shared patterns.
- Component variants and interaction states.
- Layering and motion conventions.

Remove conflicting shared definitions and repair drift at its source.

Keep responsibilities clear:

- Tokens own shared design decisions.
- Components own reusable behavior and presentation.
- Pages compose product workflows.
- Local styles own genuinely local details.

SSOT does not mean one giant stylesheet or a token for every value. Extract shared patterns when their meaning and behavior should evolve together, not merely because two fragments look similar.

7. AUDIT FRONTEND ARCHITECTURE

Inspect:

- Component cohesion and appropriate boundaries.
- Clear ownership of state and derived state.
- Separation of presentation, domain behavior, and data access where useful.
- Reusable primitives without excessive configuration.
- Consistent handling of loading, errors, permissions, and mutations.
- Stable public component APIs.
- Avoidable duplication and hidden coupling.
- Styling scope and integration boundaries.
- SSR, hydration, lifecycle cleanup, and navigation behavior.
- Semantic HTML and native browser capabilities.

For Svelte 5 projects:

- Follow the installed version’s guidance for runes, props, bindings, snippets, context, and lifecycle.
- Prefer derived state over effects that unnecessarily synchronize local state.
- Keep styles scoped where appropriate and use :global intentionally.
- Avoid browser-only execution during SSR.
- Verify framework behavior using available Svelte MCP tools and official documentation.

For other frameworks, apply their corresponding best practices.

Do not introduce a new state manager, component framework, design system, or abstraction without a concrete need. Preserve valid existing architecture.

8. VERIFY RESPONSIVE AND INPUT BEHAVIOR

Test at minimum:

- 320px and 390px widths.
- 768px and 1024px widths.
- 1440px and approximately 1920px widths.
- Landscape and short-height viewports.
- Intermediate widths around actual breakpoints.

Use these as test samples, not mandatory CSS breakpoint values.

Verify:

- Content-driven adaptation rather than simple shrinking.
- Useful prioritization on small screens.
- No unintended overlap, clipping, or page overflow.
- Usable navigation, forms, tables, toolbars, editors, and dialogs.
- Long content, localized text, empty states, and dense data.
- Sticky/fixed elements, safe areas, mobile browser chrome, and virtual keyboards.
- Touch, mouse, keyboard, coarse pointers, and hoverless interactions.
- Browser zoom, text resizing, and applicable reflow requirements.

Use actual devices where available and state the limits of emulation.

9. VERIFY ACCESSIBILITY AS PRODUCT BEHAVIOR

Assess applicable WCAG 2.2 AA requirements and check for newer finalized guidance as of the reference date.

Verify:

- Semantic structure, landmarks, headings, and accessible names.
- Complete keyboard operation.
- Logical focus order and visible, unobscured focus.
- Dialog focus entry, containment where appropriate, dismissal, and restoration.
- Form labels, instructions, validation, and error association.
- Status announcements without excessive interruption.
- Text and non-text contrast across relevant states.
- Information conveyed beyond color alone.
- Touch-target size and spacing.
- Reduced motion and forced-colors behavior.
- Text spacing, zoom, and reflow.
- Screen-reader behavior for critical workflows.

Combine automated checks with manual keyboard and assistive-technology testing where available. State what was actually tested.

10. AUDIT PERCEIVED AND MEASURED PERFORMANCE

Inspect:

- Initial rendering and navigation responsiveness.
- Layout stability and font loading.
- Loading indicators that reflect expected duration and scope.
- Image and asset delivery.
- Long tasks and expensive rendering.
- Large lists and data-heavy views.
- Optimistic updates, rollback, and stale-state handling.
- Animation smoothness and reduced-motion alternatives.

Use representative measurements. Distinguish laboratory results from real-user data.

Do not claim improved usability, conversion, or productivity without appropriate user evidence. Label heuristic improvements as such.

11. PLAN AND IMPLEMENT COHERENT IMPROVEMENTS

Before editing, summarize:

- The highest-impact problems.
- The design direction within the existing product identity.
- The components and workflows affected.
- The evidence that will establish improvement.

Then implement without waiting for approval on routine, reversible decisions.

Work in coherent increments:

- Fix broken and inaccessible workflows first.
- Correct shared layout and component issues.
- Refine visual hierarchy and interaction details.
- Recheck affected consumers after shared changes.

Do not remove functionality, substantially change business rules, or replace the product’s identity based on assumptions.

Keep changes focused and reviewable. Add regression tests for meaningful behavioral defects.

12. VERIFY THE IMPLEMENTED EXPERIENCE

Run applicable checks, tests, and production builds.

Serve the production application and repeat primary journeys in a real browser:

- Complete tasks through visible controls.
- Exercise success, failure, cancellation, and recovery.
- Verify keyboard and focus behavior.
- Check responsive layouts and themes.
- Inspect browser console errors and failed requests.
- Confirm navigation, refresh, and persisted state behave correctly.

Capture final screenshots at matching baseline conditions.

If an authoritative design reference exists, compare matching content, viewport, browser, zoom, fonts, and interaction state using side-by-side views and overlays.

Without a reference, evaluate coherence and usability. Do not claim “pixel perfect.”

13. REQUIRE EVIDENCE AND HONEST COMPLETION

For each finding record:

- Severity.
- Affected route/component and file location.
- User impact.
- Reproduction or supporting evidence.
- Implemented correction.
- Verification outcome.

Save reviewable artifacts:

- Coverage matrix.
- Prioritized findings and resolutions.
- Design-system ownership/SSOT map.
- Before/after screenshots.
- Relevant visual comparisons.
- Workflow and accessibility test results.
- Performance measurements and conditions.
- Verification commands and outcomes.
- Remaining limitations.

Use PASS, FAIL, BLOCKED, or NOT CHECKED.

Never:

- Mark unperformed checks as passed.
- Treat a clean build as proof of good UX.
- Treat attractive screenshots as proof of functional quality.
- Claim user validation without user research.
- Describe incomplete or simulated features as production-ready.
- Claim universal browser/device support from limited testing.

If a capability is unavailable, complete independent work and identify exactly what remains unverified.

Finish with a concise report:

1. What was inspected and excluded.
2. The most important improvements and their user benefit.
3. Architectural and design-system changes.
4. Evidence from workflow, visual, responsive, accessibility, and performance verification.
5. Remaining defects, assumptions, and blocked checks.
6. How to reproduce the results.

The completion standard is a demonstrably better application with a maintainable implementation and reviewable evidence—not a confident description of one.
