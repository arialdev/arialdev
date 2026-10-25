## ADDED Requirements

### Requirement: Semantic and perceivable interface
The portfolio SHALL target WCAG 2.2 AA with a skip link, semantic landmarks, one H1, ordered section headings, visible keyboard focus, accessible control names, and 44px minimum control hit areas. Normal text SHALL meet 4.5:1 contrast; large text and applicable non-text indicators SHALL meet 3:1 over their actual backgrounds.

#### Scenario: Keyboard and screen-reader review
- **WHEN** a visitor navigates using only the keyboard and a screen reader
- **THEN** the skip link reaches main content, focus order follows the reading order, and all controls expose meaningful names and states
- **AND** no content or action requires hovering or pointing-device input

### Requirement: Progressive anchor navigation
The portfolio SHALL expose real section links to `#home`, `#about`, `#projects`, and `#contact`. The menu SHALL omit Blog at the user's request; Home and Contact SHALL retain their direct external blog icons. The historical `#experience` hash SHALL open About and reach its career section. All primary sections SHALL remain in the generated HTML and readable without JavaScript. With JavaScript enabled, hash navigation SHALL switch the visible panel and preserve browser history. Overlay navigation on every viewport SHALL communicate expanded state, make underlying content inert while open, close on selection or Escape, and restore focus appropriately.

#### Scenario: Direct or historical anchor navigation
- **WHEN** the visitor opens a section URL, uses browser back/forward, or follows an existing `#about`, `#projects`, or `#contact` link
- **THEN** the correct section is reached without requiring a client-side router
- **AND** its heading is not obscured by navigation

#### Scenario: JavaScript fails to initialize
- **WHEN** client scripts fail or are disabled
- **THEN** all primary content and navigation destinations remain usable
- **AND** the page does not expose enabled controls that require unavailable enhancement

### Requirement: Accessible career tabs
After enhancement, Experience and Education SHALL use labeled tablist/tab/tabpanel semantics, selected state, arrow-key and Home/End navigation, and roving focus. Experience SHALL be initially selected. Before enhancement, both histories SHALL remain readable. The tabs SHALL use a briefcase icon for Experience and a graduation-cap icon for Education; icons SHALL be hidden from assistive technology so the visible text remains the accessible name.

#### Scenario: Visitor switches timelines with a keyboard
- **WHEN** focus is on a career tab and the visitor uses arrow keys or Home/End
- **THEN** focus and the selected panel update consistently
- **AND** the selected tab and associated panel expose matching accessible relationships

### Requirement: Accessible project details
After enhancement, each project image SHALL act as a named native button opening its details by pointer, Enter, or Space; the separate visible “View project” button SHALL be omitted. Without JavaScript the image SHALL remain static and native project details SHALL remain usable. Expanded project details SHALL use a labeled native modal dialog with initial focus, modal focus containment, Escape dismissal, and focus return to the invoking control. Project summaries, essential details, and destination links SHALL remain available before enhancement and without JavaScript.

#### Scenario: Project dialog lifecycle
- **WHEN** a visitor opens a project, navigates inside its dialog, and presses Escape
- **THEN** focus remains inside the open dialog and returns to the invoking control after closure
- **AND** the dialog is announced by the project's title

