# Portfolio implementation and validation

Change: `rebuild-personal-portfolio`. Validated 2026-10-26 against the production build at `http://127.0.0.1:4321/`. Nothing has been deployed.

## Current design

The interface closely follows the supplied reference: a full-height glass panel, pink-to-cyan gradient, blurred coloured circles, locally hosted Poppins, orange pill controls, circular portrait, and corner home/menu controls. With JavaScript, Home, About, Projects, and Contact share the panel; without JavaScript, all sections remain readable. The overlay menu supports keyboard use, focus management, browser history, and direct section hashes. About contains skills and the experience/education tabs; `#experience` remains a supported deep link.

The supplied photo has been relocated from root `me.jpg` to `src/assets/images/alvaro-rivas.jpg`, preserving its original bytes. Both Home and About import this source asset through Astro. Astro's built-in image pipeline generates optimized WebP variants, including a sharp cropped hero portrait and a wider About photo. The hero loads eagerly; the About photo loads lazily. The sharing artwork uses the same photo and visual style. Poppins v24 is hosted in `public/fonts/` with its SIL Open Font License; there is no runtime font service.

The hero subtitle types and erases the seven user-selected phrases using native TypeScript. It reserves layout space, uses correct a/an articles, omits the pause/resume button at the user’s request, and suspends when Home or the document is hidden. Reduced motion (including runtime changes) and disabled JavaScript show the static professional role. Assistive technology receives a complete stable sentence without character-by-character announcements. No animation dependency was added.

Contact keeps one email action in “Let’s build something together” and gives “Follow me!” a larger panel with 64–72px social controls. “Based in Madrid, Spain” now sits beneath the About photo. The duplicate Email block, footer, and spoken-language line have been removed at the user’s request. Design inspiration remains credited in the README. Blog icons use Hashnode’s official inline SVG in Home and Contact; Blog is omitted from the menu. Project destinations retain their earlier plain underlined style in cards and pill style in dialogs, with no arrow or chain icons. Card destination links sit at the bottom of each row, preserving alignment when tag counts differ. Project images open their detail dialogs through pointer input, Enter, or Space, and regain focus on close. Separate visible “View project” buttons are removed. Without JavaScript the artwork remains static and native details remain usable. Fine-pointer hover adds a 2.5% zoom and 2px lift over 220ms while preserving the original border color and surrounding layout. Browser checks confirm the motion is disabled with reduced motion. The Home portrait crop is slightly wider (2× rather than 2.2×), and fine-pointer hover adds a gentle tilt/lift with a single 750ms light sweep. The tilt now follows both pointer axes, bounded to 7° and 4px, using native TypeScript with one update per animation frame and a stationary hover surface. It smoothly resets on pointer exit and respects preference changes. All four quadrants, reset behavior, layout stability, touch, reduced motion, and the production build were verified. Link arrows have been removed, including the 404 return action. A deferred navigation-focus race caught by the browser suite was fixed by applying view focus synchronously; the skip-link regression and all 20 browser checks pass.

The CV button now uses Cloudinary attachment delivery and reads Download CV PDF. A real Chrome download produced Alvaro-Rivas-CV.pdf (40,397 bytes), left the portfolio open, and matched the original PDF SHA-256 exactly. The original source URL remains in profile data; no PDF copy or new dependency is added. All 20 browser tests pass.

The requested contact address is `contact@arial.dev`. The original code-bracket favicon and home-control logo remain. The blog is a direct link only, and the excluded social profile and CV-only personal details are absent from the portfolio output.

## Tool versions

Node 26.12.1; PNPM 12.15.0; Astro 7.4.2; React/React DOM 19.3.1; Astro React integration 7.1.1; TypeScript 6.0.3; Astro check 0.9.12; oxlint 1.89.0; Playwright Test 1.64.1; axe Playwright integration 4.14.0; Lighthouse 13.5.0; React/React DOM types 19.3.0.

Direct versions and the PNPM lockfile are pinned. An isolated frozen-lockfile installation passed. Lighthouse's tracing dependencies use the compatible transitive OpenTelemetry API override 1.9.1 with strict peer checks. The optional React transform peer is not installed.

## Build and browser verification

- `pnpm lint`, `pnpm check`, and `pnpm build` pass; Astro check reports zero errors, warnings, or hints.
- **20 Playwright tests pass**, with desktop and mobile projects and no skipped cases.
- Tests cover static HTML and structured data, exact destinations, sharing-image dimensions, career-tab keyboard navigation, project-dialog focus cycling/restoration, all-view overlay navigation, browser back/forward, skip links, reload positioning, no-JavaScript access, every subtitle phrase, correct articles, stable hero-button positions, hidden-view suspension, and reduced-motion preference changes.
- Every Home/About/Projects/Contact view, the open menu, and the project dialog pass axe WCAG A/AA scans.
- Layout checks cover every section at 320, 390, 768, and 1440 CSS pixels, 200% text size, reduced motion, and opaque fallback surfaces. No horizontal document overflow was found.
- The home, menu, and About composition were visually compared with the live reference at matching desktop and mobile sizes. The source photo was reviewed and the generated sharing image was visually verified.
- Public HTML, styles, scripts, SVG, robots, and sitemap are checked for excluded content. The canonical URL, sharing metadata, favicon, Person/ProfilePage JSON-LD, sitemap, robots, and noindex 404 are verified.

## Final mobile Lighthouse runs

Lighthouse 13.5.0, headless Chrome 155, simulated mobile profile: 412 × 823 viewport, 1.75 device scale, 150 ms RTT, 1638.4 Kbps throughput, and 4× CPU slowdown. Storage reset is enabled. The tracked [audit summary](portfolio-audits.json) records configuration, measured build hash, scores, metrics, and timestamps. These runs precede the subsequent icon, menu, link-style, and portrait-interaction refinements, which passed the production build and browser checks. Local reports are regenerated in `test-results/lighthouse/` by the audit command; `pnpm test` clears that directory.

| Category | Run 1 | Run 2 | Run 3 | Median |
| --- | --- | --- | --- | --- |
| Performance | 99 | 99 | 99 | 99 |
| Accessibility | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| Best Practices | 100 | 100 | 100 | 100 |

Median LCP: **2101.6 ms**. CLS: **0.0030**. TBT: **0 ms**. Initial transfer: **202.1 KiB**. All specified acceptance budgets pass. Total compressed JavaScript across eventual island bundles and inline executable scripts is **74.9 KiB**, below 80 KiB. Initial transfer remains below 500 KiB, including local fonts and the portrait.

These are lab measurements, not field Core Web Vitals or a WCAG certification. INP is not claimed as a measured field result.

## Manual review status

Task 6.4 was closed at the user's explicit request when archiving the change. Browser accessibility-tree and keyboard checks have been performed. The live VoiceOver/NVDA session was waived for archiving and was not performed. The following checklist is retained for a future live screen-reader review:

1. Follow Skip to content and navigate headings in each active section.
2. Open the full-panel menu, confirm expanded state and inaccessible underlying content, then select a view or press Escape.
3. In About, check Experience/Education tab names, selected state, arrow keys, Home/End, and their labeled panels.
4. Open a project, confirm its announced dialog title and contained focus, press Escape, and confirm focus returns to the trigger.
5. Confirm email and external profile links have useful announced names.

The archived task records this waiver rather than claiming a successful live screen-reader check.
