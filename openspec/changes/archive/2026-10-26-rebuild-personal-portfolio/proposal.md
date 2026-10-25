## Why

Álvaro Rivas needs a portfolio that reflects his current senior engineering experience and AI background, replacing the deprecated presentation at alvarorivas.dev. The reference portfolio provides a visual direction for a distinctive personal site, while Astro and carefully scoped React interactions support fast, accessible, search-friendly delivery.

## What Changes

- Build an English-language portfolio for Álvaro using the supplied CV as the primary source of professional facts and the current portfolio as the source of social, project, and blog destinations. Keep relocation intentions and sponsorship details exclusively in the linked CV; exclude them from portfolio content and metadata.
- Closely reproduce the reference’s single glass panel, Poppins typography, orange controls, overlay menu, section switching, and circular portrait using original Astro/React components, native CSS, and the supplied me.jpg.
- Present a hero, biography, skills, experience and education timelines, selected projects, a direct external blog link, contact links, and CV access.
- Use server-rendered content and real hash links; progressively enhance the reference-style panel navigation, timeline tabs, and project details with accessible interactions and a complete no-JavaScript fallback.
- Establish indexable HTML, canonical metadata, social previews, structured data, sitemap, robots rules, asset budgets, and measurable accessibility and performance criteria.
- Use the latest stable Astro, React, PNPM, and oxlint releases verified at implementation time, with the latest stable TypeScript 6 and Node.js 26 releases as the user's explicit major-version constraints. The user has approved `@astrojs/react`, `react-dom`, `@astrojs/check`, `@playwright/test`, `@axe-core/playwright`, and development-only Lighthouse; ask before using any other additional stack tools.
- Include GitHub, LinkedIn, and the blog as public profile destinations; omit the Twitter/X profile link from the portfolio and its metadata.

## Capabilities

### New Capabilities

- `portfolio-content`: Verified professional identity, work history, education, projects, writing links, contact destinations, and CV access.
- `reference-presentation`: Responsive glass-panel presentation based on the reference's visual direction, with Álvaro's identity and original assets.
- `accessible-interactions`: Keyboard-accessible navigation, timeline switching, and project details with progressive enhancement and reduced-motion support.
- `portfolio-delivery`: Static Astro/React delivery, approved tooling, version verification, technical SEO, and performance and accessibility acceptance criteria.

### Modified Capabilities

None. No existing main specifications are present.

## Impact

- Implementation will create the Astro app structure under `src/` and `public/`, package and PNPM lock files, oxlint configuration, and current development instructions.
- The working tree already contains deletions of the previous implementation. Planning preserves those changes; implementation must reconcile them deliberately without restoring the old app wholesale.
- The intended production origin is `https://alvarorivas.dev`. The existing external blog remains at `https://blog.arial.dev`; no blog migration or contact service is required.
- Use native CSS, TypeScript/TSX, typed Astro props, and strict TypeScript configuration. The official Astro React bridge, React DOM, and Node.js 26 runtime are approved; any uncovered tooling still requires confirmation.
- Add approved Astro-aware type checking, focused browser/accessibility automation, and development-only Lighthouse performance auditing. TypeScript 6 resolves the previously identified Astro check peer-range conflict; verify the complete dependency set at implementation time.
- This proposal prepares implementation only. Hosting changes, publication, backend services, analytics, and sending messages are outside its scope.
