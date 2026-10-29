# Reference presentation

## Purpose
Define the portfolio’s reference-inspired visual composition, responsive panel layout, image treatment, and motion behavior while preserving readable and accessible content.

## Requirements

### Requirement: Reference-based visual composition
The portfolio SHALL closely reproduce the reference's single glass-panel composition, pink-to-cyan background, softly blurred coloured circles, Poppins typography, orange accents, pill buttons, and circular portrait. The desktop hero SHALL lead with “Hello, I’m”, Álvaro's full name, and his role. Corner controls SHALL provide home access and a full-panel navigation overlay. It SHALL use original implementation code and Álvaro's own photo, with a design-inspiration link in the README. The page SHALL omit the footer at the user's request.

#### Scenario: Visitor views the desktop hero
- **WHEN** the viewport is 1440px wide
- **THEN** the hero presents Álvaro's greeting, full name, role, pill actions, and circular photo in two columns inside a centered panel approximately 1200px wide, inset 35px vertically
- **AND** typography, control positions, panel proportions, and background styling closely follow the reference

### Requirement: Section-based reference layout
With JavaScript enabled, the portfolio SHALL show one primary panel at a time: Home, About, Projects, or Contact. About SHALL contain the skills and career tabs. The menu SHALL replace the panel visually with centered navigation links. Without JavaScript, all substantive sections SHALL remain readable as a normal document.

#### Scenario: Visitor switches sections
- **WHEN** the visitor follows a menu item or hero section link
- **THEN** the selected section fills the shared glass panel and the URL hash updates
- **AND** browser back/forward restores the correct view

### Requirement: Responsive reading layout
The portfolio SHALL adapt navigation, timelines, project cards, and hero content to narrow screens without horizontal document scrolling, clipped content, or overlapping controls. It SHALL support text resizing to 200% and reflow at a 320 CSS-pixel viewport.

#### Scenario: Mobile and zoom review
- **WHEN** the page is reviewed at 320, 390, 768, and 1440px widths and at 200% text size
- **THEN** content remains readable and all controls remain reachable
- **AND** the hero stacks where needed and card grids reduce their column count without overflow

### Requirement: Identity and image treatment
The portfolio SHALL retain the previous code-bracket favicon and home-control logo. The supplied photo, stored at `src/assets/images/alvaro-rivas.jpg`, SHALL supply the hero portrait, About image, and sharing artwork. Both Astro portrait components SHALL import this source asset for build-time optimization. Astro's built-in image pipeline SHALL produce optimized WebP assets with explicit dimensions; the hero image SHALL load eagerly and the About image SHALL load lazily. Decorative SVG and background shapes SHALL be hidden from assistive technology.

#### Scenario: Supplied photo is displayed
- **WHEN** the portfolio is built with the supplied portrait source
- **THEN** the hero shows a circular crop centered on Álvaro and About shows the wider photo
- **AND** the original source image remains unchanged

### Requirement: Robust surfaces and bounded motion
The portfolio SHALL remain readable without backdrop-filter support. Any optional background motion SHALL finish within five seconds and SHALL be disabled under `prefers-reduced-motion`. Primary text SHALL be available without animation.

#### Scenario: Reduced motion or unsupported visual effect
- **WHEN** reduced motion is enabled or the browser does not support backdrop filtering
- **THEN** the page uses static decoration and readable fallback surfaces
- **AND** no navigation or content depends on an animation completing

### Requirement: Reference-style typing subtitle
The hero SHALL cycle through Senior Software Engineer, Microfrontends Builder, Engineering Enthusiast, Module Federation Specialist, Clean Design Lover, Distributed Systems Builder, React Sailor, AI Explorer, Software Architecture Enthusiast, and Curious Problem Solver using native TypeScript typing and erasing, reading pauses, a blinking caret, and the correct indefinite article. The animation SHALL reserve space for all phrases, omit the pause/resume control at the user’s request, suspend while the document or home view is hidden, and show a static professional role without JavaScript or with reduced motion. Assistive technology SHALL receive a stable complete sentence without per-character announcements.

#### Scenario: Visitor reads the animated subtitle
- **WHEN** motion is allowed and Home is visible
- **THEN** the subtitle types and erases the complete phrase collection in a loop without moving the hero actions
- **AND** no pause/resume button is rendered

#### Scenario: Visitor requests reduced motion
- **WHEN** reduced motion is enabled initially or while typing
- **THEN** the subtitle shows Senior Software Engineer statically and hides the unnecessary animation control

### Requirement: Directional portrait hover
The Home portrait SHALL retain the slightly wider crop and finite light sweep. With a fine pointer and motion permitted, its tilt and small translation SHALL follow pointer position horizontally, vertically, and diagonally within a stationary hover surface. Native TypeScript SHALL batch pointer updates with requestAnimationFrame and reset the effect on pointer exit, cancellation, window blur, or motion-preference changes. The effect SHALL remain decorative, preserve layout, and remain static on touch devices or with reduced motion.

#### Scenario: Visitor moves across the portrait
- **WHEN** the pointer moves between the four quadrants of the portrait
- **THEN** the tilt follows both pointer axes without moving surrounding content
- **AND** leaving the portrait smoothly restores its neutral position
