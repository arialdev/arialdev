# Portfolio content

## Purpose
Define the verified professional identity, career history, project destinations, social links, contact information, and CV access published by Álvaro Rivas’s portfolio.

## Requirements

### Requirement: Verified professional identity
The portfolio SHALL identify Álvaro Rivas as a Senior Software Engineer based in Madrid, Spain. Professional facts SHALL come from the supplied CV, with source provenance retained in the content data. It SHALL present his React, microfrontend, distributed-systems, and AI background without invented accomplishments or availability claims.

#### Scenario: Recruiter reads the introduction
- **WHEN** a visitor loads the home page
- **THEN** Álvaro's name, current professional title, location, and a concise source-backed summary are readable in the initial HTML
- **AND** clear links lead to projects and the supplied CV

### Requirement: CV-only relocation details
The portfolio MUST NOT include relocation intentions, destination preferences, or employer-sponsorship details in visible copy, generated HTML, metadata, structured data, social-preview text, accessibility text, or serialized client data. These details SHALL remain exclusively in the unchanged linked CV. The portfolio SHALL retain Madrid, Spain as the current location.

#### Scenario: Public portfolio output is inspected
- **WHEN** a visitor, crawler, or automated check inspects portfolio output and client data
- **THEN** relocation intentions and sponsorship details are absent
- **AND** the current Madrid location and original CV asset remain available

#### Scenario: Visitor opens the CV
- **WHEN** a visitor follows the portfolio's CV link
- **THEN** the link targets the exact supplied PDF without changing its contents

### Requirement: Career and education history
The portfolio SHALL include Nexthink employment from 2022 to present, Sotec Consulting employment from 2020 to 2021, the 2025–2026 AI master's degree at Alfonso X el Sabio University, and the 2017–2022 double degree at Rey Juan Carlos University of Madrid. It SHALL include CV-backed technical skills and omit spoken-language levels at the user's request. Metrics SHALL retain their original qualifications, including 40+ microfrontends and up to 70% performance improvement.

#### Scenario: Visitor reviews experience and education
- **WHEN** the visitor reads the professional history
- **THEN** the employers, roles, institutions, dates, and qualified achievements match the supplied CV
- **AND** the thesis is described as an AI SRE agent for incident diagnosis and contextual remediation guidance

### Requirement: Selected projects and real destinations
The portfolio SHALL feature SRE Agent, Vocabulaire, and Awards Predictions with verified descriptions and the destinations recorded in the design content contract. It SHALL include a link to `https://github.com/arialdev` for the full project archive. It MUST NOT invent project dates, outcomes, repositories, screenshots, or live demos.

#### Scenario: Visitor chooses a project
- **WHEN** the visitor follows a project's source or demo link
- **THEN** the destination matches that project's verified URL
- **AND** a demo is offered only when a real demo destination is known

### Requirement: Writing and social links
The portfolio SHALL link to `https://blog.arial.dev/`, `https://github.com/arialdev`, and `https://www.linkedin.com/in/alvaro-rivas`. It MUST NOT publish the user's Twitter/X profile URL or account attribution in public links, structured data, social-account metadata, or serialized profile data. Generic link-preview card metadata SHALL NOT include Twitter/X account attribution. Blog access SHALL be a direct external link; the portfolio MUST NOT render an article-list section, article cards, or article search. Article retrieval SHALL NOT be required during visitor page loads or builds.

#### Scenario: Social destinations are inspected
- **WHEN** a visitor or automated check inspects social links, metadata, structured data, and client profile data
- **THEN** the GitHub, LinkedIn, and blog destinations are present
- **AND** the excluded Twitter/X profile URL and account attribution are absent

#### Scenario: External blog is unavailable
- **WHEN** the external blog or its API cannot be reached
- **THEN** the portfolio still builds and renders its direct blog link
- **AND** no article-list block or article search is rendered

### Requirement: Contact and CV access
The portfolio SHALL use `mailto:contact@arial.dev` as its primary email destination, following the user's explicit preference to restore the previous portfolio address. Contact copy, email links, and structured data SHALL agree on that address. Contact SHALL contain a single email action within “Let’s build something together” and an enlarged “Follow me!” panel, without a duplicate Email block. The “Based in Madrid, Spain” label SHALL appear in About rather than Contact. It SHALL retain the supplied Cloudinary source URL in typed profile data and derive an attachment-delivery URL for a clearly labeled Download CV PDF link. The download SHALL preserve the original PDF bytes and use Alvaro-Rivas-CV.pdf as its filename. It SHALL provide working contact links without requiring a contact service.

#### Scenario: Visitor accesses contact information without JavaScript
- **WHEN** JavaScript is disabled
- **THEN** email, social, blog, and CV links remain visible and usable
- **AND** Cloudinary supplies Content-Disposition: attachment, so downloading works without JavaScript and does not rely solely on the cross-origin download attribute
