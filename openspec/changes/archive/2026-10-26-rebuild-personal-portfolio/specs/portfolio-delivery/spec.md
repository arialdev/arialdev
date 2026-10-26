## ADDED Requirements

### Requirement: Explicit stack governance
The implementation SHALL use Astro, React, TypeScript 6, Node.js 26, PNPM, and oxlint. The official `@astrojs/react` integration, `react-dom`, `@astrojs/check`, `@playwright/test`, `@axe-core/playwright`, and development-only Lighthouse are approved. It SHALL obtain user approval before using other additional stack tools, including any uncovered required integration/runtime/peer packages. Native CSS and TypeScript/TSX SHALL be the default. Historical README instructions SHALL NOT authorize restoring additional tools.

#### Scenario: Additional dependency is needed
- **WHEN** setup or a feature requires a tool outside the authorized stack
- **THEN** implementation asks the user before installing or using it
- **AND** it records the concrete reason and does not silently substitute another tool

### Requirement: Latest compatible stable versions and reproducibility
At implementation setup, the maintainer SHALL verify current stable release tags and engine/peer compatibility from official sources. TypeScript SHALL use the latest stable 6.x release and Node.js SHALL use the latest stable 26.x release within the user's approved major-version constraints. Direct selected package versions and PNPM SHALL be pinned, the PNPM lockfile SHALL be committed, and `.nvmrc`, package engines, and development documentation SHALL agree on Node.js 26. An incompatibility outside the approved constraints SHALL require a user decision before downgrading or replacing a selected tool.

#### Scenario: Clean reproducible build
- **WHEN** an approved compatible Node runtime runs `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm check`, `pnpm build`, and `pnpm test` from a clean checkout
- **THEN** installation succeeds without changing the lockfile and lint, Astro type checking, build, and browser/accessibility tests complete without errors
- **AND** the README documents the same commands and actual selected versions

### Requirement: Strict typed application code
Authored application data modules and React islands SHALL use TypeScript 6 and TSX, with strict TypeScript configuration and typed Astro props. React type definitions SHALL support those approved technologies. Validation SHALL run the approved Astro checker through `pnpm check`, covering Astro components and TypeScript/TSX files. The dependency set SHALL satisfy the checker's declared compatibility ranges.

#### Scenario: Typed implementation is reviewed
- **WHEN** source files and validation results are inspected
- **THEN** data modules use `.ts`, React islands use `.tsx`, and Astro components declare their prop types where applicable
- **AND** `pnpm check` runs Astro-aware type checking on the project's Astro components and TypeScript/TSX files

#### Scenario: TypeScript version is selected
- **WHEN** implementation resolves the TypeScript version
- **THEN** it selects and pins the latest stable 6.x release compatible with the approved Astro checker
- **AND** it does not select TypeScript 7 through an unconstrained latest tag or force an unsupported peer combination

### Requirement: Automated browser and accessibility regression checks
The implementation SHALL use approved Playwright Test and axe integration for focused production-preview checks of keyboard interactions, project dialog focus, mobile layout, no-JavaScript access, common accessibility issues, and excluded CV-only content. Automated checks SHALL supplement manual accessibility review.

#### Scenario: Portfolio validation runs
- **WHEN** `pnpm test` runs against the production preview
- **THEN** interaction, responsive layout, no-JavaScript, and automated accessibility checks pass
- **AND** a content regression check confirms that relocation and sponsorship details are absent from portfolio output while the original CV link is preserved

### Requirement: Static content and scoped hydration
The portfolio SHALL emit core identity, career, education, project, external blog links, and contact content as static HTML. React SHALL enhance bounded interactive islands, using deferred hydration for below-fold features. The page SHALL NOT require a server adapter, visitor-time API requests, or full-page hydration.

#### Scenario: Search crawler fetches HTML
- **WHEN** a crawler requests the page without executing JavaScript
- **THEN** it receives all substantive portfolio text and crawlable destination links
- **AND** essential content is not supplied solely by a client-only component

### Requirement: Technical SEO and sharing
The home page SHALL include an accurate title and description, English document language, canonical URL at `https://alvarorivas.dev/`, viewport metadata, favicon, complete Open Graph/Twitter metadata with an existing absolute preview-image URL, and valid Person/ProfilePage JSON-LD using verified facts. A native sitemap SHALL list indexable page URLs and robots.txt SHALL reference it. A useful 404 page SHALL be excluded from the sitemap.

#### Scenario: Production output inspection
- **WHEN** generated HTML, sitemap.xml, robots.txt, preview assets, and 404 output are inspected
- **THEN** canonical and social URLs use the configured production origin and resolve to the intended artifacts
- **AND** the sitemap contains no anchor fragments or 404 entry and JSON-LD contains no invented claims

### Requirement: Asset and rendering budgets
The production portfolio SHALL deliver at most 80 KiB of compressed JavaScript across all hydrated islands and at most 500 KiB of compressed resources for the initial viewport, excluding a user-initiated CV request. Images SHALL reserve space, below-fold images SHALL be lazy-loaded, and the LCP asset SHALL NOT be lazy-loaded. No external render-blocking resources SHALL be required.

#### Scenario: Production network and layout review
- **WHEN** the built home page loads from a cold cache at a mobile viewport
- **THEN** measured compressed resource totals meet the budgets
- **AND** images reserve their layout space and deferred content does not cause excessive layout shifts

### Requirement: Evidence-based quality acceptance
Before implementation is marked complete, validation SHALL record a production build, oxlint results, responsive and no-JavaScript review, keyboard/screen-reader checks, and three cold-cache mobile browser audit runs. Median Lighthouse scores SHALL reach at least 95 Performance, 100 Accessibility, 100 SEO, and 95 Best Practices. Under the recorded mobile lab profile, median LCP SHALL be at most 2.5s, CLS at most 0.1, and TBT at most 200ms. New audit dependencies SHALL require approval before use.

#### Scenario: Delivery is reviewed
- **WHEN** implementation is presented as complete
- **THEN** validation evidence identifies the build, browser/audit versions, profile, measurements, and manual accessibility results
- **AND** blocked checks or unavailable external destinations are explicitly reported rather than claimed as passed
- **AND** a future INP field-data goal is not represented as a measured prelaunch result
