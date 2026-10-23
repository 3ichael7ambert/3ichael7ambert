# Portfolio audit & rebuild

Date: 2026-10-23. Repository: `3ichael7ambert/3ichael7ambert`.
Original revision: `5805ca2954edaf7b63110669bdfa096f8cb789b6`.
Public website: https://3ichael7ambert.com/.

## Scope and evidence

Reviewed the original HTML, styling, theme scripts, galleries, local image collection, navigation, embedded media, deployment workflow and public destinations linked from the portfolio. The current implementation is a static HTML/CSS/JavaScript site generated from editable JSON. It stays on GitHub Pages with the existing domain; no hosting migration or account integration was added.

The mobile crash report was treated as a performance and reliability problem. No device crash log, physical iPhone or Safari profiler was available. The findings below are concrete resource/code risks, **not a confirmed single root cause**. Real-device Safari and Android testing remains important.

## Findings and changes

| Area | Original evidence | Change |
| --- | --- | --- |
| Embedded content | 102 iframe elements in the old document; hiding sections did not unload third-party content | Zero initial iframes. Music and retailers use ordinary links. One optional video iframe is created only after a click and removed on close/collapse. |
| Original images | Approximately 241 MB under `imgs`, 207 MB in design; individual selected PNGs 19–27 MB | 480px gallery thumbnails and maximum 1600px lightbox derivatives; all originals preserved in Git. |
| Decoded memory | Large source dimensions and galleries that could load numerous images | Full-screen gallery keeps only the current and adjacent images mounted (maximum three); closing removes all slides. |
| JavaScript robustness | References to missing canvas/slides, undeclared navigation variables, duplicated theme listeners and an out-of-scope sketchbook helper | One scoped behavior script; explicit controls and lifecycle cleanup; no old scripts loaded. |
| Animation | Unconditional animation loops, rapid redraw intervals and multiple effects | Pointer updates only on actual movement; no perpetual JavaScript animation loop. Bounded CSS particles, paused when hidden; reduced motion and save-data respected. Touch devices do not get a mouse cursor effect. |
| Gallery discovery | Guessed sequential filenames/extensions, including JPG requests for PNG/uppercase sources | Explicit manifest with real filenames, alt text and categories. |
| Readability | Decorative body type, busy imagery and oversized first-screen layout | System body text, readable serif headings, subdued paper texture, clear hierarchy, contrast-aware theme variables. |
| Markup | Duplicate IDs and nested/repeated content structure | Semantic sections, unique IDs, native disclosures, skip link, focus outlines and image dimensions. |
| Books | Long repeated descriptions and scattered shop links | 17 edition cards, six subject filters, cached covers, concise descriptions and clear retailer links. |
| Store | Mixed resources and numerous embedded storefronts | Three primary destinations organized by purpose; secondary storefronts retained in a disclosure. Alieno Apparel is identified as the clothing line, not the artist name. |
| Games | Older portfolio list did not show the breadth of current releases | Five featured entries plus a searchable snapshot of 133 projects from both public itch.io catalogs. Mixed tools/music are not falsely presented as games. |
| Contact | Embedded form added third-party dependencies | Direct business email, social links and the original downloadable vCard. No new backend or analytics. |
| Deployment | Whole repository, including high-resolution originals, uploaded to Pages | Explicit `dist` package of runtime files only. Source originals and authoring tools remain versioned, not deployed. |

## Image results

The 58 manifest assets reference **102,117,857 source bytes** and produce **4,410,030 web bytes**, about **95.7% smaller**. This comparison is of the selected source assets and their generated variants, not a measured whole-page transfer or Lighthouse score.

Examples (thumbnail and large variant together):

| Source artwork | Original bytes | Web bytes |
| --- | ---: | ---: |
| `urban7.png` / Electric color | 23,098,523 | 136,830 |
| `urban5.png` / A figure in light | 27,273,974 | 281,780 |
| `urban6.png` / Red in motion | 19,430,216 | 367,900 |

WebP quality is 76 for thumbnails and 80 for large art. EXIF orientation is applied and metadata is not carried into web derivatives. Transparent pencil/paper overlays retain alpha. Images below the hero lazy-load. The original approximately 4.6 MB vCard is still a click-only download, never an initial page resource.

## Themes and navigation preserved

Sketchbook, Light, Dark, Music and Art grid are available in a single selector. Sketchbook keeps the paper identity and optional pencil-following-mouse effect. Rain/snow and animated music notes are lightweight optional effects. Appearance persists locally, with blocked/malformed storage handled safely.

Old named profile/hide query flags and primary anchor IDs are retained, including `design`, `games`, `music`, `book`, `clothing`, `education`, `resume`, `certificates`, `software`, and `contact`. `art`, `stores`, `additional_books`, and `reviews` hashes have aliases. This is compatibility with the important named options, not a claim that every accidental behavior of the former scripts is reproduced.

## Artwork selection and limits

Visually reviewed contact sheets of 118 repository artworks and selected 24 across photography, digital/urban work, ink/graphite, little planets/panoramas, illustration, painting/mixed media and apparel. Captions are descriptive browsing labels, not assertions of official artwork titles. Originals are unchanged and no replacement art was generated.

Prior conversation context informed the range of media and the Alieno Apparel identity. Not every attachment from previous chats was accessible; this is not a claim to have reviewed the entire historical chat archive. The curated gallery uses inspectable repository assets. Additional art-book or photography repositories can be merged into `data/gallery.json` when their exact source files are available.

## Public-source research

Primary destinations reviewed on 2026-10-23:

- [Drunk Yeti catalog](https://drunkyeti.itch.io/) and [original itch.io catalog](https://3ichael7ambert.itch.io/): current public project listings; also used by the updater.
- [Moly, Bart & Skid](https://drunkyeti.itch.io/moly-bart-skid-the-lost-spring), [AR3NA](https://drunkyeti.itch.io/ar3na-foosball-circuit), [Xero](https://3ichael7ambert.itch.io/xero), [A Rocket’s Intensity](https://3ichael7ambert.itch.io/a-rockets-intensity), [The Paper Arcade](https://3ichael7ambert.itch.io/the-paper-arcade): featured projects. Xero supplied no usable cover metadata; no invented cover was substituted.
- [Steam publisher](https://store.steampowered.com/publisher/3ichael7ambert): retained catalog destination.
- [3ichael 7ambert on Apple Music](https://music.apple.com/us/artist/3ichael-7ambert/653323466), [A Rocket’s Intensity](https://music.apple.com/us/artist/a-rockets-intensity/576515896), [AR3NA soundtrack](https://drunkyeti.itch.io/ar3na-foosball-soundtrack): music identities and release information.
- [Redbubble](https://www.redbubble.com/people/odonisorphane/shop): public artwork/products. [Gumroad](https://3ichael7ambert.gumroad.com/) is retained as the original digital-resource storefront; no claim about current inventory or pricing.
- [Behance](https://www.behance.net/3ichael7ambert): public portfolio identity.
- Apple Books: [Portraitography](https://books.apple.com/us/book/portraitography/id6822920533), [Artist Statement](https://books.apple.com/us/book/the-artwork-of-3ichael-7ambert/id6822090618), [DeadSexyMikey](https://books.apple.com/us/book/deadsexymikey/id6822102297), [The Three Esses](https://books.apple.com/us/book/the-three-esses/id6822088361), [49 States & 18 Wheels](https://books.apple.com/us/book/49-states-18-wheels/id6821455670). These are distinct editions, not replacements for older art books.
- [The Curly Caterpillar at Barnes & Noble](https://www.barnesandnoble.com/w/the-curly-caterpillar-michael-andrew-lambert/1148223958) and [Hoopla publisher catalog](https://www.hoopladigital.com/publisher/3ichael-7ambert/10216095048/titles): book/catalog cross-checks.

Some retailer, social and portfolio pages could not be independently inspected. Society6, eBay, ArtStation and some older book destinations are preserved from the original site and should be manually checked by the owner. Retailer prices/stock are deliberately not hard-coded. A 403, timeout or automation restriction is not proof that a destination is dead. `docs/link-check.json`, when produced by `--check`, records machine observations separately from editorial verification.

The completed machine check covered 258 public URLs: 244 returned HTTP 200, seven 404, three 500, one 429, one 999, and two were unverified. Society6 and six older coursework repository URLs returned 404. Their destinations are retained in the inventory/report; unavailable public links are shown as plain text in the rendered page rather than active calls to action. Amazon short links returned 500 from this environment; alternate retailers remain available. HTTP 200 only confirms a response, not product availability or content accuracy.

Document-sharing and credential-recipient URLs are redacted from the diagnostic report, including redirect destinations. Existing career links in the page were checked against the original public HTML commit; no new private document links were added.

## Verification

- Offline structural checks: unique IDs, local paths, anchor targets, alt attributes, image dimensions, lazy loading, URL schemes and performance budgets.
- Four network-free updater tests: partial-source failure and empty results preserve the previous catalog; relative URLs resolve correctly; external catalog hosts and non-HTTPS fetches are rejected.
- JavaScript syntax checked with Node; Python build, optimizer and package scripts executed.
- Browser QA: five theme selections, gallery open/next/close, bounded image count, filtered gallery, browser-back close, and book filtering.
- Responsive QA: 390 × 844 desktop-browser iframe (375px layout width with browser scrollbar), no document-level horizontal overflow. This is **not physical-device emulation or a Safari test**.
- Browser-extension console noise was observed; it is not attributed to the website.

## Remaining owner/device checks

1. Open on a real iPhone/Safari and Android/Chrome; scroll the entire page, open/close the gallery repeatedly, rotate the device and background/restore the tab.
2. Check VoiceOver/TalkBack, reduced-motion and low-data modes on device. Native dialog focus behavior is used, but assistive-device testing was not available here.
3. Review descriptive art captions and featured selections; replace with official titles where desired.
4. Confirm older retailer destinations and career facts remain current. The extensive original career text is retained, not independently credential-verified.
5. Checkout/payment, streaming playback and third-party account functions belong to the destination services and were not transaction-tested.

No original artwork or old source scripts were deleted. The unrelated pre-existing temporary image file was left untouched. Legacy content remains in Git history. The raw migration inventory is ignored and is not included in this release because it repeats document-sharing metadata and an administrative dashboard URL; the live page does not need that archive. Existing public resume/certificate links remain in the career section, while the administrative dashboard link is excluded.
