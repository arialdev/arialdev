## 1. Confirm tooling and establish the application

- [x] 1.1 Inspect the working tree and preserve unrelated changes; reconcile existing portfolio deletions only within the new implementation scope.
- [x] 1.2 Carry forward approval for TypeScript 6, Node.js 26, the official Astro React integration, React DOM, Astro check, Playwright Test, and axe; resolve uncovered integration peers before use.
- [x] 1.3 Re-query latest stable Astro, React, PNPM, oxlint, and approved integration/checker/test versions; select the latest stable TypeScript 6.x and Node.js 26.x releases, verify engine and peer compatibility, and ask before changes outside the approved version constraints.
- [x] 1.4 Create a static Astro application with the approved React integration using PNPM, native CSS, TypeScript/TSX, and React type definitions; configure strict TypeScript and typed Astro props, pin direct versions and PNPM, and align `.nvmrc`, package engines, and documentation with Node.js 26.
- [x] 1.5 Configure oxlint for TypeScript/TSX and supported framework script blocks, `pnpm check` using Astro check, `pnpm test` using Playwright and axe, production build/preview scripts, and a committed PNPM lockfile.

## 2. Establish source-backed content

- [x] 2.1 Create typed profile data and typed project records with CV provenance, name/title/current location, qualified achievements, skills, language levels, and user-selected contact email; omit all relocation and sponsorship fields from portfolio data while preserving the unchanged CV link.
- [x] 2.2 Add the two verified employment entries and two education entries, retaining dates and the original qualifications on metrics.
- [x] 2.3 Create SRE Agent, Vocabulaire, and Awards Predictions records using the design's destinations; verify any additional descriptions before including them.
- [x] 2.4 Add exact GitHub, LinkedIn, blog, CV, and email destinations, with the blog as a direct external link; omit the Twitter/X profile from public links, structured data, account metadata, and serialized profile data.

## 3. Build the responsive presentation

- [x] 3.1 Create the semantic Astro layout, skip link, primary navigation, and stable section anchors, preserving the existing about/projects/contact hashes. Omit the footer per the updated scope.
- [x] 3.2 Define native CSS tokens, fluid typography and spacing, pastel background, accessible glass surfaces, warm controls, and opaque fallbacks.
- [x] 3.3 Build the two-column hero and supplied circular portrait, then adapt them to narrow screens without layout shifts or clipped content.
- [x] 3.4 Render biography, skills, full experience/education histories, selected projects, external blog links, and contact/CV links as static HTML.
- [x] 3.5 Add verified project imagery or original SVG/type compositions with dimensions and appropriate alternatives; include design-inspiration credit in the README.
- [x] 3.6 Implement responsive card grids and timelines, 44px control hit areas, contrast and focus styles, reduced-motion support, and bounded optional decoration.

## 4. Add progressive interactions

- [x] 4.1 Implement keyboard-accessible full-panel overlay navigation with real anchors, expanded state, Escape/selection closure, and a usable no-JavaScript fallback.
- [x] 4.2 Implement a deferred React career island with accessible tabs, arrow/Home/End handling, selected state, and roving focus; preserve both histories before enhancement.
- [x] 4.3 Implement project detail enhancement with labeled native dialogs, initial focus, Escape dismissal, modal focus containment, and trigger-focus restoration; preserve static summaries/details/links.
- [x] 4.4 Keep direct external blog links and remove the article-list section, article data, and writing-search island per the user’s updated scope.
- [x] 4.5 Verify hydration does not expose inert enabled controls, duplicate content, hide essential content, or produce hydration errors.

## 5. Complete SEO and performance work

- [x] 5.1 Configure the production origin and add accurate title/description, canonical URL, English document language, viewport, favicon, and verified Person/ProfilePage JSON-LD.
- [x] 5.2 Create a local social-preview image and complete Open Graph/Twitter metadata with absolute URLs and actual image dimensions.
- [x] 5.3 Generate sitemap.xml through native Astro functionality, add robots.txt referencing the production sitemap, and create a useful 404 excluded from the sitemap.
- [x] 5.4 Optimize image sizing/loading and React hydration; remove runtime content requests and external render-blocking resources.
- [x] 5.5 Measure compressed production JavaScript across all islands and initial-viewport resources against the 80 KiB and 500 KiB budgets; correct any excess.

## 6. Verify and document the implementation

- [x] 6.1 Run a clean frozen-lockfile PNPM install, `pnpm lint`, `pnpm check`, `pnpm build`, and `pnpm test` with the approved runtime; record checker coverage and resolve errors without introducing unapproved tools.
- [x] 6.2 Inspect generated HTML for substantive static content, exact destination URLs, metadata, JSON-LD, sitemap, robots rules, local sharing assets, and 404 behavior.
- [x] 6.3 Review the production preview at 320, 390, 768, and 1440px, with 200% text sizing, reduced motion, unsupported blur, and JavaScript disabled; verify no overflow or inaccessible content.
- [x] 6.4 Close the manual accessibility review at the user's request. Keyboard and accessibility-tree checks are complete; the live screen-reader session was waived for archiving and was not performed.
- [x] 6.5 Use existing browser audit facilities for three cold-cache mobile production-preview runs; record versions/profile and meet median Lighthouse thresholds of 95 Performance, 100 Accessibility, 100 SEO, and 95 Best Practices, plus LCP ≤2.5s, CLS ≤0.1, and TBT ≤200ms. Ask before adding an audit tool if needed.
- [x] 6.6 Recheck external project/article/CV destinations, document any inaccessible destinations accurately, and avoid reporting unperformed checks as successful.
- [x] 6.7 Update portfolio development instructions and record selected versions, content provenance, asset budgets, audit evidence, and manual review results; deliver the local build for review without publishing.
- [x] 6.8 Add focused Playwright interaction, no-JavaScript, mobile layout, and axe checks and run them against the production preview.
- [x] 6.9 Verify relocation intentions and sponsorship details are absent from visible copy, generated HTML, metadata, structured data, accessibility text, social-preview text, and serialized client data; confirm the CV URL remains unchanged.
- [x] 6.10 Verify the excluded Twitter/X profile URL and account attribution are absent from public output and client data, while GitHub, LinkedIn, and blog destinations remain correct.

## 7. Apply requested portfolio refinements

- [x] 7.1 Restore contact@arial.dev in visible contact details, links, and structured data.
- [x] 7.2 Restore the exact previous favicon and code-bracket branding for the home control; the supplied photo now provides the hero and sharing identity.
- [x] 7.3 Remove the blog-entry section, article data, search code, and unused styles; preserve direct external blog links.
- [x] 7.4 Replace timeline-tab symbols with decorative briefcase and graduation-cap SVGs; verify layouts, keyboard behavior, accessibility, and refreshed production audits.

## 8. Match the requested reference closely

- [x] 8.1 Inspect the live reference at matching desktop and mobile viewports and replace the earlier editorial interpretation.
- [x] 8.2 Match the glass-panel proportions, pink/cyan background, blurred circles, self-hosted Poppins typography, orange controls, and name-led hero.
- [x] 8.3 Use the provided photo (now stored in src/assets/images/alvaro-rivas.jpg) for the circular hero portrait, wider About image, and sharing artwork; optimize it with Astro assets and retain the source file unchanged.
- [x] 8.4 Add full-panel overlay navigation and one-view-at-a-time hash navigation, with About-integrated career tabs, focus management, history support, and a complete no-JavaScript fallback.
- [x] 8.5 Verify all four views, the menu, and project dialogs at desktop/mobile widths, enlarged text, keyboard input, accessibility scans, and three refreshed production performance audits.

## 9. Animate the subtitle and simplify the page

- [x] 9.1 Add a native TypeScript typing/erasing loop for the seven user-selected phrases, correct indefinite articles, and a blinking caret; provide static accessible text, reduced-motion and no-JavaScript fallbacks, and stable layout.
- [x] 9.2 Remove the footer and spoken-language line, including unused styles and navigation references.
- [x] 9.3 Verify the phrase cycle, reduced-motion preference changes, hidden-view suspension, mobile layout, accessibility, and refreshed production audits.

## 10. Refine Contact, About, and Home

- [x] 10.1 Keep one contact email action, enlarge the social panel and controls, and move the location label below the About photo.
- [x] 10.2 Remove the Home pause/resume control and unused code, preserving reduced-motion and hidden-view behavior; verify desktop/mobile layouts, accessibility, and production checks.

- [x] 10.3 Use the official Hashnode SVG for blog icons in Home and Contact, and remove Blog from the menu.
- [x] 10.4 Remove project-link and 404 return-link arrows; preserve the original plain card links and pill links in dialogs, and align card actions consistently at the bottom of each row.

- [x] 10.5 Fix deferred navigation focus stealing focus from the skip link, add a focused regression assertion, and rerun all 18 desktop/mobile checks.

- [x] 10.6 Make project images the accessible dialog triggers, remove separate visible View project buttons and unused styles, and verify pointer/keyboard/focus and no-JavaScript behavior.

- [x] 10.7 Add a restrained 2.5% project-image zoom and 2px lift over 220ms for fine-pointer hover, keep the original border color, and verify stable layout and reduced-motion behavior.

- [x] 10.8 Zoom the Home portrait out slightly and add a restrained hover tilt, lift, and finite light sweep; verify desktop presentation, touch fallback, reduced motion, and the production build.

- [x] 10.9 Make the Home portrait follow pointer position in all directions with a stable hover surface, bounded native TypeScript updates, smooth reset, and desktop/touch/reduced-motion regression checks.

- [x] 10.10 Relocate the original portrait into src/assets/images/alvaro-rivas.jpg, update both Astro imports and documentation, and verify optimized image output and the production build.

- [x] 10.11 Make the CV action download the original Cloudinary PDF as Alvaro-Rivas-CV.pdf; verify attachment headers, byte equality, real browser download without navigation, and the full browser suite.

## Validation status

58/58 tasks closed. Task 6.4 was closed at the user's explicit request: keyboard and accessibility-tree checks were performed, while the live screen-reader session was waived for archiving and was not performed. See `docs/portfolio-validation.md` for the validation evidence and retained manual checklist.
