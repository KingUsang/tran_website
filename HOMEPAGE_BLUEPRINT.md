# TRAN Homepage Blueprint

**Status:** Draft for review  
**Source of truth:** `TRAN Website Rebuild Software Brief.md`  
**Purpose:** Translate the brief's homepage requirements into a visual, content, and motion plan before wireframing or implementation.

## 1. Page job

Within five seconds, a first-time visitor should understand:

1. TRAN is an educational intellectual-property company.
2. CYTRAC™ is its flagship commercial IP.
3. Ubuntu Bridge Initiative (UBI) is TRAN's social-impact arm.

The page should then lead visitors to the correct next action:

- Families: explore or buy CYTRAC.
- Schools: request information or bring CYTRAC to their school.
- Partners: start a commercial, distribution, licensing, CSR, or strategic conversation.
- UBI supporters: visit or support UBI without mistaking it for TRAN's core commercial offer.

## 2. Visual concept

**Working direction: from signal to play.**

The opening establishes TRAN as a confident, premium parent brand. As visitors move into CYTRAC, the page becomes brighter, more tactile, and more playful. UBI then receives its own calm navy/purple territory before the page returns to TRAN's parent-brand system for partner conversion and the footer.

This retains the inspiration prototype's dark technical foundation while avoiding generic cybersecurity visuals. The primary imagery should be the CYTRAC product, children/families or educators using it, and real TRAN/UBI impact activity.

## 3. Section map

| # | Brief requirement | Content purpose | Visual treatment | Primary action |
| --- | --- | --- | --- | --- |
| 1 | Hero | State what TRAN builds and create immediate emotional interest. | Editorial split composition: short copy beside a large approved CYTRAC/family/school visual; restrained TRAN grid/detail texture. | Explore CYTRAC™ |
| 2 | Brand architecture | Make the parent brand, flagship IP, and social-impact relationship instantly legible. | One compact branching diagram: TRAN at the root, CYTRAC as the larger foreground card, UBI as a distinct secondary card. | Learn about TRAN / Visit UBI |
| 3 | Flagship IP | Make CYTRAC tangible: what it is, who it is for, and why it matters. | Product-stage section with board, cards, play moments, and a short three-step explanation. | Explore / Buy CYTRAC™ |
| 4 | Why it matters | Explain the underlying problem without fear-based cybersecurity language. | Three large, simple statements with one visual focal point each; keep copy short. | See how CYTRAC works |
| 5 | Future ecosystem teaser | Show the scalable IP direction without claiming unreleased products exist. | A calm horizontal progression from board game to future formats; every unlaunched item is explicitly marked `Vision` or `In development`. | Partner with TRAN |
| 6 | Proof and impact | Earn trust through real evidence. | Dated metrics, one featured testimony/case study, and real imagery/video. CYTRAC and UBI numbers must be clearly separated. | Read an impact story |
| 7 | UBI social-impact strip | Explain UBI's role and route visitors to it cleanly. | A full-width navy/purple transition with a human image and concise statement. | Visit Ubuntu Bridge Initiative |
| 8 | Partner section | Turn organisational interest into a relevant conversation. | Four audience tiles: Schools, Distribution/Licensing, Corporate/CSR, Strategic Partners. | Build with us |
| 9 | Latest stories | Supply fresh editorial proof, if current stories exist. | Maximum three date-stamped cards with category labels. Omit this section until a viable publishing cadence exists. | View all stories |
| 10 | Newsletter and footer | Maintain an owned audience and provide parent-brand navigation/legal information. | Simple high-contrast signup followed by a structured footer. | Subscribe |

## 4. Transition and motion rules

Each transition must explain the relationship between sections. No animation exists only to make the page feel busy.

| Transition | Intended effect | Reduced-motion equivalent |
| --- | --- | --- |
| Hero → architecture | A small line/path from the hero's TRAN mark resolves into the TRAN → CYTRAC + UBI relationship. | Relationship diagram is visible immediately. |
| Architecture → CYTRAC | The CYTRAC card expands into the product-stage palette and imagery. | A simple colour/background change. |
| CYTRAC product moments | Cards and board details reveal in a short, sequential order as the section enters view. | All elements appear together. |
| Why it matters → ecosystem | A board-path motif continues into a clean future-format sequence. | Static sequence with clear labels. |
| Proof → UBI | The page moves from CYTRAC's playful territory into UBI's more human, community-oriented colour field. | Immediate background and typography change. |
| Partner → footer | The interface returns to the TRAN parent-brand foundation. | Immediate background and typography change. |

Motion constraints:

- Prefer opacity, colour, clip/reveal, and small transforms over parallax or large viewport movement.
- Keep non-essential section transitions short and calm; avoid autoplaying hero video on mobile.
- Respect `prefers-reduced-motion`; page meaning and task completion must not depend on animation.
- Keep keyboard focus visible and never move focus without a user action.

## 5. Content and asset requirements

Before high-fidelity design, identify an approved item for every requirement below.

| Requirement | Needed asset or fact | Status |
| --- | --- | --- |
| Hero | Best available CYTRAC-in-use image or an approved shoot/art direction brief | To audit |
| CYTRAC stage | Product photographs, logo, board/card details, target age, player count, availability, store link | To verify |
| Schools | Approved educator/school imagery, offer wording, testimonials, and enquiry destination | To verify |
| Proof | Metrics with source and reporting period; permission for quotes, logos, and images | To verify |
| UBI strip | Current description, approved image, destination URL, and active support CTA | To verify |
| Partner section | Approved partnership types, owner/contact route, and any available proof | To verify |
| Stories | Three current, publishable stories with dates, images, and destinations | To verify |
| Newsletter | Confirmed value proposition, consent wording, and live submission list/integration | To verify |

## 6. UX quality bar

- One dominant message and one primary CTA above the fold.
- Product imagery must be clear enough for visitors to recognise what CYTRAC is without reading every paragraph.
- Each major audience must find a relevant route without being sent through a generic "Get involved" funnel.
- Text, controls, forms, contrast, keyboard behaviour, and responsive layouts must meet WCAG 2.2 AA targets.
- Mobile is a first-class layout: no horizontal scroll effects, hover-only meaning, tiny tap targets, or autoplay-heavy media.
- Product and impact claims are specific, sourced, and dated; future products are not shown as already available.

## 6.1 Initial asset review

| Asset | Best homepage role | Constraint / decision needed |
| --- | --- | --- |
| `cytrac.jpg` | Primary CYTRAC product-stage image; can support a cropped hero composition if packaging and availability are confirmed. | Confirm that the shown packaging is current, approved for use, and representative of the product being sold. Source higher-resolution and in-use images for a full visual system. |
| `School tour.jpg` | Documentary proof in the school/impact section. | It demonstrates real-world activity but not CYTRAC play specifically. Confirm event context, date, consent, and whether it supports the new CYTRAC school narrative. |
| `data_support.jpeg` | Supporting UBI/archive material only. | It is a campaign graphic, not a premium photographic anchor; do not use it as the UBI hero unless no current imagery exists. |
| `about-hero.jpg` | TRAN origin, historical outreach, or impact-story image. | It supports the older cybersecurity-awareness narrative, not the CYTRAC product hero. Confirm consent and partner-logo visibility before reuse. |
| `schooltour.jpeg` | Archive/reference material for historical school outreach. | This is a legacy promotional flyer with outdated positioning and should not appear as a large homepage visual. |
| `thumbnail1.png` and `thumbnail2.png` | Optional editorial/video thumbnails in a future archive. | The existing vox-pop material is not central to the new CYTRAC-led narrative; use only if the accompanying story is current and relevant. |
| `tran_powebank.jpg` | UBI impact proof or a short case-study card. | It can show a tangible UBI outcome, but requires context, date, consent, and confirmation that the initiative remains active. |

## 7. Delivery sequence

1. Audit the existing assets against Section 5.
2. Produce a low-fidelity desktop/mobile wireframe from the section map.
3. Review and approve the content hierarchy and missing-asset decisions.
4. Produce high-fidelity visual and motion direction.
5. Implement the approved homepage and validate performance, accessibility, forms, and responsive behaviour.

## 8. Research applied

- Product pages need clear, high-quality product imagery supported by concise benefit-led copy; both neutral product views and real-life use are valuable.
- Family and school experiences need distinct pathways and audience-specific explanations.
- Brand/IP expansion should be visually secondary to the available product.
- Motion should guide attention and preserve context, while respecting reduced-motion preferences.
