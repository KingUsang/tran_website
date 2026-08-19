# TRAN Homepage Wireframe

**Status:** Low-fidelity draft  
**Companion:** `HOMEPAGE_BLUEPRINT.md`  
**Rule:** Bracketed content requires confirmation before final design or build.

## Desktop flow

```text
┌───────────────────────────────────────────────────────────────────┐
│ TRAN logo     About TRAN · CYTRAC™ · Impact · Partner · News · Contact │
│                                             [Ubuntu Bridge Initiative ↗] │
├───────────────────────────────────────────────────────────────────┤
│  01  TRAN / EDUCATIONAL INTELLECTUAL PROPERTY                     │
│                                                                    │
│  We build worlds that help children          [Approved CYTRAC     │
│  play, learn and stay safer online.           product/family       │
│                                               visual]              │
│  [Explore CYTRAC™] [Partner With Us]                                │
└───────────────────────────────────────────────────────────────────┘
                              ↓ TRAN relationship line resolves
┌───────────────────────────────────────────────────────────────────┐
│  TRAN creates educational IP for a safer digital generation.      │
│                                                                    │
│       TRAN                                                        │
│        ├───────── CYTRAC™                 UBI                     │
│        │          Flagship IP             Social-impact arm       │
│        │          [Explore]                [Visit UBI]             │
└───────────────────────────────────────────────────────────────────┘
                              ↓ CYTRAC card expands into product world
┌───────────────────────────────────────────────────────────────────┐
│  02  FLAGSHIP IP / CYTRAC™                                        │
│                                                                    │
│  CYTRAC™ — Play. Learn. Stay Secure.       [Product board / cards │
│  [Approved one-sentence promise]            / play image]          │
│                                                                    │
│  [Who it is for] [What children learn] [How it works: 1 · 2 · 3] │
│  [Explore / Buy CYTRAC™] [For Schools]                              │
└───────────────────────────────────────────────────────────────────┘
                              ↓ board-path motif continues
┌───────────────────────────────────────────────────────────────────┐
│  03  WHY IT MATTERS                                                │
│                                                                    │
│  Children live online.  Safety education is often boring.         │
│  Learning through play can make safe choices memorable.            │
│                                                                    │
│  [Three concise illustrated/editorial statements]                 │
└───────────────────────────────────────────────────────────────────┘
                              ↓ path becomes an ecosystem timeline
┌───────────────────────────────────────────────────────────────────┐
│  04  THE CYTRAC UNIVERSE                                          │
│                                                                    │
│  Board game → Stories → Animation → Schools → Digital experiences │
│  → Licensing                                                       │
│                                                                    │
│  [Available now]  [Vision / In development where applicable]      │
│  [Partner with TRAN]                                               │
└───────────────────────────────────────────────────────────────────┘
                              ↓ product colour settles into evidence
┌───────────────────────────────────────────────────────────────────┐
│  05  PROOF IN PRACTICE                                            │
│                                                                    │
│  [Validated CYTRAC/school metric] [Validated UBI metric]          │
│  [Featured real school/family/impact image or short video]        │
│  [Dated testimonial or case-study extract]  [Read the story]      │
└───────────────────────────────────────────────────────────────────┘
                              ↓ colour changes to UBI territory
┌───────────────────────────────────────────────────────────────────┐
│  06  UBUNTU BRIDGE INITIATIVE                                     │
│                                                                    │
│  UBI is TRAN's social-impact arm.        [Approved UBI image]     │
│  [Current, approved purpose statement]                              │
│  [Visit Ubuntu Bridge Initiative] [Support / Partner]             │
└───────────────────────────────────────────────────────────────────┘
                              ↓ return to TRAN parent-brand palette
┌───────────────────────────────────────────────────────────────────┐
│  07  BUILD WITH US                                                │
│                                                                    │
│  [Schools] [Retail / Distribution] [Corporate / CSR]              │
│  [Licensing / Strategic Partners]                                 │
│                                               [Partner With Us]    │
└───────────────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────────────┐
│  08  LATEST STORIES (only if three current stories are approved)  │
│  [CYTRAC] [Schools] [UBI / Partnership]          [All stories]    │
└───────────────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────────────┐
│  Stay updated on products, school resources, and impact.          │
│  [Newsletter form with confirmed consent language]                 │
│  Footer: TRAN / CYTRAC / UBI / company details / legal / social   │
└───────────────────────────────────────────────────────────────────┘
```

## Mobile flow

1. Header: logo, `Menu`, and a visible UBI link inside the opened menu.
2. Hero: eyebrow → headline → subcopy → primary CTA → secondary CTA → visual.
3. Brand architecture: TRAN root → CYTRAC card → UBI card. Avoid side-by-side micro-cards.
4. CYTRAC: product visual → promise → details → three steps → CTAs.
5. Why it matters: stacked statements with no horizontal scrolling.
6. Ecosystem: vertical timeline; label all non-available concepts clearly.
7. Proof: one metric at a time, then case study/testimonial.
8. UBI: image → statement → CTA.
9. Partner types: stacked cards with one shared CTA.
10. Stories, newsletter, and footer.

## Responsive and motion notes

- The product visual should remain visible in the first mobile viewport without blocking the headline or CTA.
- Decorative grids, card movement, and board-path transitions must not create horizontal overflow.
- The mobile navigation, all CTAs, and video controls must remain fully keyboard accessible.
- Motion is enhancement only: use the static hierarchy as the reduced-motion presentation.
- Story cards and metrics should never delay access to their text while animating.

## Confirm before high-fidelity design

1. Exact navigation labels and final route slugs.
2. CYTRAC's current product availability and appropriate top-level CTA wording.
3. Approved hero/product imagery and rights to use it.
4. Current UBI destination, copy, and support path.
5. Dated proof metrics, testimonials, case studies, and partner/logo permissions.
6. Whether the Latest Stories block launches now or waits for active editorial content.
