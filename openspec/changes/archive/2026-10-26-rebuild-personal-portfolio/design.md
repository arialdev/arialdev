## Context

This repository currently contains a profile README, OpenSpec configuration, `.nvmrc` set to 24, and working-tree deletions of the prior portfolio. No main specifications exist. These planning artifacts must preserve that state.

The user requests the visual direction of [Bandi Revanth's portfolio](https://bandirevanth.github.io/) and [repository](https://github.com/bandirevanth/bandirevanth.github.io), using Álvaro's information. The published preview and styles show a pastel background, translucent rounded panels, circular identity art, and pill controls. Source sections include biography, timelines, projects, writing, and contact. The implementation follows the reference’s full-height single-panel interface closely, with progressive section switching and a complete no-JavaScript document fallback.

Research was performed on 2026-10-25. Professional facts come from the [supplied CV](https://res.cloudinary.com/duemlwqqt/image/upload/v1791067842/CV%20Alvaro%20Rivas.pdf). Destination links come from the live HTML of [the deprecated portfolio](https://alvarorivas.dev/), which is fresher than its indexed search snapshot.

## Goals / Non-Goals

**Goals:**

- Present Álvaro's current senior engineering work, achievements, projects, education, skills, and external blog access in an accessible English-language portfolio.
- Closely match the reference’s composition, typography, gradient, orange accents, full-panel menu, and section layout using original code and Álvaro’s photo.
- Deliver static, indexable HTML and small, progressively enhanced React islands.
- Make tooling approval, current-version verification, accessibility, SEO, and performance acceptance explicit.

**Non-Goals:**

- Publishing, choosing a hosting vendor, changing DNS, or replacing the external blog.
- A CMS, live GitHub statistics, runtime article feeds, authentication, analytics, or a contact backend.
- Adding styling frameworks, component kits, animation packages, icon libraries, extra type-checking tools, formatters, or test frameworks without approval.

## Decisions

### 1. Approved stack and release policy

Use Astro for static generation, React for interactive islands, TypeScript 6 for authored application code, PNPM exclusively for project package operations, and oxlint for linting. Native CSS, TypeScript/TSX, browser APIs, and authored SVG supply styling and interactions. The user has explicitly approved `@astrojs/react`, `react-dom`, `@astrojs/check`, `@playwright/test`, `@axe-core/playwright`, and development-only Lighthouse.

The following are registry observations, not installed dependencies or frozen implementation choices:

| Package/runtime | Selected release observed | Status |
| --- | --- | --- |
| Astro | 7.4.2 | User requested |
| React | 19.3.1 | User requested |
| TypeScript | 6.0.3, latest stable in major 6 | User requested major-6 exception to latest overall |
| PNPM | 12.15.0 | User requested |
| oxlint | 1.89.0 | User requested |
| `@astrojs/react` | 7.1.1 | User approved |
| `react-dom` | 19.3.1 | User approved |
| `@astrojs/check` | 0.9.12 | User approved |
| `@playwright/test` | 1.64.1 | User approved |
| `@axe-core/playwright` | 4.14.0 | User approved |
| Lighthouse | 13.5.0 | User approved for performance audits |
| `@types/react`, `@types/react-dom` | 19.3.0 each | Type definitions supporting approved React + TypeScript |
| Node.js | 26.12.1, observed stable release in major 26 | User approved major 26 |

Re-query official package registry `latest` tags and the [Node release index](https://nodejs.org/dist/index.json) immediately before setup; select the highest stable TypeScript 6.x and Node.js 26.x releases within the user's approved major versions. Verify engine and peer ranges together, pin the exact selected versions and PNPM `packageManager` field, and commit the PNPM lockfile. Reproducible installs use `pnpm install --frozen-lockfile`; do not update packages at every build. TypeScript 6 and Node.js 26 are authorized constraints and do not require another approval.

Use the latest stable Node.js 26.x release, update `.nvmrc` from 24, and align the package engine constraint and development instructions with major 26. If an approved dependency is incompatible with that runtime, ask before changing the selected major or replacing the dependency.

The latest Astro React integration declares required peers including `oxc-transform-react` and React type packages. Include React type definitions as support for the requested TypeScript implementation. Inspect the integration's full dependency/peer inventory before installation and explicitly ask about any extra top-level tool not covered by the user's approval, including the transform peer. Do not enable automatic peer installation as a way to bypass that decision. The earlier README's Tailwind, Prettier, Playwright, and check commands do not authorize reinstating those dependencies.

Use `astro/tsconfigs/strict`, `.ts` data modules, `.tsx` React islands, and typed Astro component props. Use explicit type-only imports and typed DOM access. Configure `pnpm check` to run `astro check`, covering Astro components and TypeScript/TSX files. Astro compilation alone is not proof of type correctness, and standalone `tsc` does not check `.astro` templates.

Approved development additions:

- `@astrojs/check`: checks Astro templates as well as TypeScript through `astro check`, complementing oxlint. Observed version 0.9.12 declares TypeScript peer range `^5.0.0 || ^6.0.0`; the user's selection of TypeScript 6 resolves the previously identified peer-range conflict. Recheck all peers during setup without forcing unsupported combinations.
- `@playwright/test` and `@axe-core/playwright`: focused regression checks for keyboard behavior, dialog focus, mobile layouts, content exclusions, and automatically detectable accessibility issues. Configure `pnpm test` for these production-preview checks. Keep manual screen-reader and accessibility reviews. These are approved development dependencies.
- Lighthouse: the user approved a development-only dependency for three mobile performance runs because the existing browser audit tool excludes the Performance category. Use the latest stable verified release and save the reports locally.

Retain native CSS and the native sitemap endpoint for the current small static site. Revisit the official sitemap integration if the route set grows; it is not selected now. Additional UI or state-management libraries are not necessary for the planned interactions.

### 2. Document architecture and React boundaries

Create a static Astro layout with metadata and a semantic header, navigation, and main; omit the footer per the user’s updated scope. `src/data/portfolio.ts` holds typed content and source URLs; reusable Astro sections with typed props render all core content at build time. Store typed project records alongside the profile in plain data modules, avoiding a CMS or parsing plugin. Interactive islands use `.tsx` files.

Suggested areas: `src/layouts/PortfolioLayout.astro`, `src/components/sections/`, `src/components/islands/`, `src/styles/`, `src/pages/index.astro`, `src/pages/404.astro`, and `public/`.

Use stable anchors `#home`, `#about`, `#experience`, `#projects`, and `#contact`. All primary sections are rendered in the document. A small native hash controller selects one visible panel after enhancement, supports browser history and focus management, and maps #experience to the career area inside About. Without JavaScript every section remains readable. This explicitly replaces the earlier scrolling editorial layout at the user’s request. React supplies timeline tabs and project detail enhancement, hydrating below-fold islands with `client:visible`. Keep the blog as a direct external link, with no entry-list section or search. Server-render every record; avoid `client:only`.

Render both timelines and project details accessibly before hydration. On enhancement, expose working tab/dialog controls and apply their visibility rules together. Do not present an enabled inert button while waiting for hydration. Navigation can use native disclosure and small built-in browser scripting; it must retain real links without React.

### 3. Content contract

Use the CV for career facts, dates, degree wording, metrics, language levels, and primary email. Use the deprecated portfolio for project and social destinations. Keep sources with the data to make later maintenance straightforward. Avoid aging copy such as a computed years-of-experience counter; emphasize the dated work history.

Curate the portfolio data rather than embedding the complete extracted CV. Exclude all relocation intentions, destination preferences, and employer-sponsorship details from visible copy, HTML, metadata, structured data, social-preview text, accessibility text, and serialized client data. The exact linked PDF remains unchanged and is the only place these details belong. Retain Madrid, Spain as the current location.

| Area | Content to implement |
| --- | --- |
| Identity | Álvaro Rivas; Senior Software Engineer; Madrid, Spain; JavaScript/TypeScript, React, distributed systems, microfrontends, and AI. |
| Nexthink | Senior Software Engineer, 2022–present; 40+ microfrontend migration to Module Federation; up to 70% React performance improvement; testing strategy; Kafka streaming; reusable GitHub Actions; backend Java/Node.js work. Retain the CV's qualified metrics. |
| Sotec Consulting | Junior Full-stack Developer, 2020–2021; Angular, Ionic mobile applications, REST APIs, and Oracle SQL. |
| Education | MSc in Artificial Intelligence, Alfonso X el Sabio University, 2025–2026; double degree in Computer Engineering and Software Engineering, Rey Juan Carlos University of Madrid, 2017–2022. |
| Skills | CV-backed software engineering and AI groups; omit spoken-language levels per the updated scope. |
| Featured project | SRE Agent: thesis-based incident diagnosis and contextual remediation guidance using LLMs, RAG, Kubernetes, Prometheus, and runbooks; `https://sre-agent.arial.dev/`. |
| Other projects | Vocabulaire: `https://github.com/arialdev/vocabulaire`; Awards Predictions: `https://github.com/arialdev/Awards-Predictions`. Verify repository descriptions before expanding beyond the old site's labels. |
| Primary contact | `mailto:contact@arial.dev`, restored at the user’s explicit request; use the same address in links, visible copy, and structured data. |
| GitHub | `https://github.com/arialdev` |
| LinkedIn | `https://www.linkedin.com/in/alvaro-rivas` |
| Blog | `https://blog.arial.dev/`; retain a direct link only, without an article section or search. |
| CV | Exact user-supplied PDF URL; use “View CV (PDF)” because cross-origin `download` is not guaranteed. |

The user has excluded their Twitter/X profile. Do not publish its URL or handle in navigation, social controls, structured-data `sameAs`, social-account metadata, or serialized profile data. Generic Twitter Card preview tags can remain for link sharing, without `twitter:site` or `twitter:creator` account attribution.

Blog entries and their search interface are excluded at the user’s request. The direct external blog link remains in navigation and contact links.

### 4. Visual composition and assets

At 1440px desktop width, use a 1200px-wide panel with 35px outer vertical spacing, 30px corners, and a pink-to-cyan background with softly blurred coloured circles. Use a name-led 55px desktop heading, an orange role line, translucent pill actions, and a 360px circular portrait. Place the preserved code logo and menu toggle in 50px corner controls. Match the reference’s stacked mobile arrangement with a roughly 300px portrait and 30px name heading. Keep the hero simple and remove the editorial headline, serif type, orbit artwork, metrics strip, and top navigation bar.

Carry rounded panels, pills, timeline markers, and project cards throughout. Use CSS tokens and fluid type/spacing with content-driven breakpoints. Self-host compact Latin Poppins font files at weights 300, 400, 500, and 600. Assets are fetched from Google Fonts v24 and retain the bundled SIL Open Font License in public/fonts/OFL.txt; no runtime font service or extra package is used. Use local project imagery when verified; otherwise use original typographic/SVG compositions rather than empty screenshot placeholders.

Decorative shapes are hidden from assistive technology. Any optional background movement is finite, under five seconds, and disabled with reduced motion; avoid expensive animated blur. The hero uses a native TypeScript typing/erasing loop for the seven user-selected phrases with a blinking caret, correct a/an articles, stable reserved space, and suspension when Home or the document is hidden. Reduced motion and no JavaScript retain the static professional role. Assistive technology receives one complete static sentence without per-character announcements. Use translucency with an opaque fallback and test contrast over the least favorable background.

The upstream README requests credit and its NOTICE conflicts with its advertised reuse license. Implement original markup, CSS, and visuals without importing upstream code, logos, images, or text. Keep the design-inspiration link in the README; omit the visible footer at the user’s request. If implementation later requires actual upstream material, resolve its reuse terms before importing it.

### 5. Accessible interactions

Target WCAG 2.2 AA. Include one H1, ordered section headings, a skip link, visible focus, named icon controls, meaningful image alternatives, and 44px minimum control hit areas. Text contrast is at least 4.5:1 for normal text and 3:1 for large text; component boundaries and focus indicators meet 3:1 where applicable.

Timeline tabs use the tablist/tab/tabpanel pattern with arrow keys, Home/End, selected state, and roving focus. On first enhancement, Experience is selected; without JavaScript both timelines remain readable. Use a labeled native dialog for expanded projects, including Escape, initial focus, modal focus containment, and return to the invoking control. Keep summaries and destination links outside the dialog. Experience uses a native briefcase SVG and Education a native graduation-cap SVG; these decorative icons preserve the text-only accessible tab names.

Contact has one direct email action in “Let’s build something together” and a prominent, padded “Follow me!” panel with larger social controls. The duplicate Email block is omitted, and the location label sits beneath the About photo. The Home pause/resume button is omitted at the user’s request; reduced-motion and hidden-view suspension remain. The reference's contact form would require an additional service and is replaced by working contact links within the approved scope.

### 6. SEO and delivery quality

Set Astro's production site origin to `https://alvarorivas.dev`. Generate canonical URLs from that single configuration. Provide an accurate title and description, `lang="en"`, viewport metadata, favicon, Open Graph and Twitter metadata with an absolute local preview-image URL, and JSON-LD describing Person/ProfilePage using verified facts and social `sameAs` links.

Generate `sitemap.xml` with a native static Astro endpoint; include canonical page URLs and omit hash fragments and the 404. Ship `robots.txt` referencing the production sitemap. Provide a useful 404 and preserve current `#about`, `#projects`, and `#contact` links. Do not add invented reviews, project outcomes, unsupported Article markup, or placeholder social images.

Budget the production page for at most 80 KiB of compressed JavaScript across all hydrated islands and at most 500 KiB of compressed resources for the initial viewport, excluding a user-initiated CV request. Use dimensioned images and responsive formats; lazy-load below-fold images, keep the LCP asset eager, and avoid external render-blocking resources and visitor-time API calls.

Validate the production build with `pnpm lint`, `pnpm check`, `pnpm build`, and `pnpm test`, inspection of generated HTML/metadata, keyboard and screen-reader review, no-JavaScript checks, and responsive browser review at 320, 390, 768, and 1440px. Oxlint supports TypeScript/TSX and framework script blocks; its Astro support does not constitute complete Astro template checking. Astro check supplies that type-checking coverage. Use approved Playwright and axe checks against the production preview, including a regression check that excluded CV details never appear in public output. Use an existing browser's built-in performance audit facilities when available; any additional audit dependency still requires approval.

Record three cold-cache mobile Lighthouse runs against the production preview, with the median score at least 95 Performance, 100 Accessibility, 100 SEO, and 95 Best Practices. Record browser/audit versions and the throttling preset. Require measured mobile LCP at most 2.5s, CLS at most 0.1, and TBT at most 200ms under that same lab profile. Audit scores supplement manual accessibility checks. INP at most 200ms is a future field-data goal, not a prelaunch claim.

## Risks / Trade-offs

- Glass surfaces can lose contrast or increase painting cost → use adequate surface opacity, bounded static blur, and low-end/mobile checks.
- Latest releases can conflict or change after planning → re-query, check compatibility, pin the approved resolution, and ask before substitutions.
- Integration peers can expand the apparent stack → inspect peers before installation and explicitly confirm uncovered top-level tools.
- CV and current portfolio differ in email → follow the user’s explicit choice of contact@arial.dev and retain the unchanged linked CV.
- Some project/article pages could not be fetched during research → retain discovered destinations, recheck before release, and avoid invented metadata or success claims.
- No user-owned portrait has been supplied → ship an original initials treatment with a clear replacement point.
- Field Core Web Vitals and production indexing cannot be established locally → report lab evidence accurately and leave field monitoring for after an authorized deployment.

## Migration Plan

1. Preserve unrelated user changes; inspect existing deletions before touching implementation paths.
2. Resolve stack approval and current versions, then create the app and lockfile using PNPM.
3. Add source-backed data, original assets, static sections, and progressive React enhancements.
4. Complete production validation and document exact versions, audit results, and any remaining external-link limitations.
5. Deliver a local reviewable build. Deployment and hosting changes require a separate user instruction. If subsequently deployed, retain the prior deployment for rollback; no data migration is needed.

## Open Questions

- `@astrojs/react`, `react-dom`, TypeScript 6, Node.js 26, `@astrojs/check`, `@playwright/test`, `@axe-core/playwright`, and development-only Lighthouse are approved. Any uncovered integration tooling still requires approval.
- The supplied portrait is available. The supplied photo is stored at src/assets/images/alvaro-rivas.jpg; preserve its original bytes and optimize public variants through Astro assets.

## Reference fidelity correction

The user rejected the initial design as too different from the reference. The current implementation follows its actual panel-based interface and rounded Poppins typography. The home screen, full-panel menu, and About layout were visually compared against the live reference at matching desktop and mobile sizes. The supplied me.jpg provides a tight hero crop and wider About image; sharing artwork uses the same portrait and design. Previous preferences for contact@arial.dev, the original favicon, direct blog access without article cards, no Twitter, and CV-only relocation information remain in force.
