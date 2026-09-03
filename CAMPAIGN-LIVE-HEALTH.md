# TRMM Campaign Live Health

Last source audit: 2026-09-03
Production smoke test: PASS — 2026-09-03
Launch status: PRODUCTION READY / LAUNCHED

This manifest tracks the production campaign routing + lead-intake wiring in `realtor-mortgage-authority-site`. Source-level checks are distinguished from browser verification.

## Launch readiness

Source-level launch audit completed 2026-09-03. Approved homepage source, core campaign router, hardened `/contact/` intake, campaign attribution, and public-state restrictions were rechecked. No source-level launch blocker was found in those core paths.

Final production smoke test completed 2026-09-03. The approved homepage was confirmed live, and Jahar Asad manually confirmed both the live `/contact/` submission path and `/go/first-time-homebuyer` campaign route work in a normal production browser.

**LAUNCH GATE: PASS.**

Recent rollout additions:
- FTHB webinar route -> `/homebuying-masterclass.html`
- Reverse Mortgage webinar route -> `/reverse-mortgage-webinar.html`
- Condo Financing route -> `/condo-financing.html`
- We Buy Homes route -> `/we-buy-homes.html`
- Reverse Mortgage webinar page created in commit `757a21cc88d9a717d846f0e293160eb31b94a12f`
- We Buy Homes education-first seller options page created in commit `dc2ee46606d4ff1bdd587b0e88cc0b3f5cf9a0fd`
- Router expansion commit `6538d20d19efcc4df947dda74428e36ef12a90ee`

Recent conversion-path hardening:
- Ask Jahar -> `/contact-submit` -> `/api/lead`: `4ec092eabb60e639f07dc6b4017f582c8e50bd34`
- AI Pre-Approval CRM intake: `a88064a0749bb48b9a579fef9938ae6cf6fdd80d`
- Contact interest preselection: `ed5a5c7c8e234f875611b6a1e31387f7f88bd7ac`
- Search Homes attribution forwarding: `60671648586cc7804f6994277ad48ce91255ceb3`
- Condo Financing intent + attribution: `2863b3ca5869ebcb040772f340eedc420b166531`
- Homeowner Solutions attribution forwarding: `f05962368bae9fa4fd751b4b1cc85689302fb5a4`
- Housing Transitions CRM routing: `e7cc5a23d3a710a460c4a0302d73d4da54cb38d2`
- Professional Partners attribution forwarding: `57483151c0644fa8ae6ee33e9cb040f6573736d2`

## Core router

`functions/go/[slug].js`

Permanent campaign router behavior:
- preserves incoming query parameters
- adds `campaign` when absent
- adds `utm_source=qr` when absent
- adds `utm_medium=qr` when absent
- adds `utm_campaign=<canonical campaign>` when absent
- adds `qr_id=<slug>` when absent
- returns 302 redirects with `Cache-Control: no-store`

Canonical UTM campaign attribution was added to the router in commit `1aff7a339d2ecd233a3e2e7c48315d11aeeabda9`.

## Priority rollout status

| Campaign | Go route | Destination | Lead handling | Status |
|---|---|---|---|---|
| First-Time Homebuyer | `/go/first-time-homebuyer` | `/first-time-homebuyer.html` | `/api/lead` | Production route browser-confirmed 2026-09-03 |
| FTHB Webinar | `/go/first-time-homebuyer-webinar` | `/homebuying-masterclass.html` | OneDesk registration page | Source wired |
| Reverse Mortgage | `/go/reverse-mortgage` | `/reverse-mortgage.html` | `/api/lead` | Source hardened |
| Reverse Mortgage Webinar | `/go/reverse-mortgage-webinar` | `/reverse-mortgage-webinar.html` | `/api/lead` as Reverse Mortgage with webinar UTM attribution | New page created; browser QA pending |
| Down Payment Assistance | `/go/down-payment-assistance` | `/down-payment-assistance.html` | `/api/lead` | Source hardened |
| USDA | `/go/usda` | `/usda-home-loans.html` | `/api/lead` | Source hardened |
| Manufactured Homes | `/go/manufactured-homes` | `/manufactured-homes.html` | `/api/lead` | Source hardened |
| Pre-Foreclosure | `/go/pre-foreclosure` | `/foreclosure-solutions.html` | `/api/lead` | Source hardened |
| Rent vs. Own | `/go/rent-vs-own` | `/rent-vs-own.html` | `/api/lead` | Source hardened |
| Sell / Equity / Finance / Next Home | `/go/sell-equity-finance-next-home` | `/campaigns/sell-equity-finance-next-home.html` | `/api/lead` | Approved embedded artwork intentionally untouched |
| New Construction | `/go/new-construction` | `/new-construction.html` | `/api/lead` | Source hardened |
| Condo Financing | `/go/condo-financing` | `/condo-financing.html` | Contact CRM intent `condo-financing` | Source wired |
| We Buy Homes | `/go/we-buy-homes` | `/we-buy-homes.html` | `/api/lead` as Seller Strategy with `we-buy-homes` UTM attribution | New education-first page created; browser QA pending |

## General contact intake

`/contact/` posts through `/contact-submit` into the main `/api/lead` CRM intake. Full dedicated attribution (`utm_source`, `utm_medium`, `utm_campaign`, `qr_id`, `fbclid`, `page_url`) plus automatic `form_started_at` capture is present. Query-string `interest` is validated against the actual select options before preselection, so authority-page CTAs retain their intended CRM category.

Public state choices remain restricted to NC, SC, GA, IL, and FL.

Production contact submission was manually confirmed working on 2026-09-03.

## Homepage protection

The 2026-09-03 source audit confirmed the approved homepage continues to reference the locked TRMM logo, locked Jahar profile image, approved family image, and locked seven-logo brand strip. No homepage redesign was performed during launch hardening.

## CRM strategy for new rollout pages

To avoid destabilizing the already-live main intake during rapid rollout, the new Reverse Mortgage webinar currently posts to the existing canonical `reverse-mortgage` CRM campaign while preserving `utm_campaign=reverse-mortgage-webinar` and full page attribution. The We Buy Homes page posts to the existing canonical `seller-strategy` CRM campaign while preserving `utm_campaign=we-buy-homes` and full page attribution. This keeps both lead types distinguishable in CRM notes without creating a new launch dependency.

## Final launch gate

Source audit: PASS.
Homepage production check: PASS.
Contact submission smoke test: PASS.
First-Time Homebuyer `/go/` route smoke test: PASS.

**Overall launch status: PRODUCTION READY / LAUNCHED — 2026-09-03.**

New campaign pages added after launch remain subject to their own short browser QA before advertising.

## Artwork protection

This health manifest does not alter campaign artwork. Approved/locked campaign graphics remain the source of truth and should not be regenerated or redesigned during routing/CRM maintenance.
