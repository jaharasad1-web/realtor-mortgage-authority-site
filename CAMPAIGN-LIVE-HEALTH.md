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
- Router expansion commit `6538d20d19efcc4df947dda74428e36ef12a90ee`
- Reverse Mortgage public webinar page connected to the scheduled Sept. 29 OneDesk registration funnel in commit `29d9c25d1a98e1ea92b4fac014cfff00a84736f6`

Recent conversion-path hardening:
- Ask Jahar -> `/contact-submit` -> `/api/lead`: `4ec092eabb60e639f07dc6b4017f582c8e50bd34`
- AI Pre-Approval CRM intake: `a88064a0749bb48b9a579fef9938ae6cf6fdd80d`
- Contact interest preselection: `ed5a5c7c8e234f875611b6a1e31387f7f88bd7ac`
- Search Homes attribution forwarding: `60671648586cc7804f6994277ad48ce91255ceb3`
- Condo Financing intent + attribution: `2863b3ca5869ebcb040772f340eedc420b166531`
- Homeowner Solutions attribution forwarding: `f05962368bae9fa4fd751b4b1cc85689302fb5a4`
- Housing Transitions CRM routing: `e7cc5a23d3a710a460c4a0302d73d4da54cb38d2`
- Professional Partners attribution forwarding: `57483151c0644fa8ae6ee33e9cb040f6573736d2`
- Pre-Foreclosure anti-bot timing + honeypot: `f68f1e71c65f725a2c87cc60dec3f9ad6757720a`
- Sell / Equity / Finance / Next Home CRM alias normalization: `b5183a994d8faf8bb991d889b9b4983e9f761567`

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

## Priority rollout status

| Campaign | Go route | Destination | Lead handling | Status |
|---|---|---|---|---|
| First-Time Homebuyer | `/go/first-time-homebuyer` | `/first-time-homebuyer.html` | `/api/lead` | Production route browser-confirmed 2026-09-03 |
| FTHB Webinar | `/go/first-time-homebuyer-webinar` | `/homebuying-masterclass.html` -> OneDesk | OneDesk `/api/lead` | OneDesk MasterClass campaign enabled; registration fields and webinar timeline events hardened |
| Reverse Mortgage | `/go/reverse-mortgage` | `/reverse-mortgage.html` | `/api/lead` | Source hardened |
| Reverse Mortgage Webinar | `/go/reverse-mortgage-webinar` | `/reverse-mortgage-webinar.html` -> OneDesk | OneDesk `/api/lead` | Connected to Sept. 29, 2026 6:30 PM ET MasterClass registration funnel |
| Down Payment Assistance | `/go/down-payment-assistance` | `/down-payment-assistance.html` | `/api/lead` | Source hardened |
| USDA | `/go/usda` | `/usda-home-loans.html` | `/api/lead` | Source hardened |
| Manufactured Homes | `/go/manufactured-homes` | `/manufactured-homes.html` | `/api/lead` | Source hardened |
| Pre-Foreclosure | `/go/pre-foreclosure` | `/foreclosure-solutions.html` | `/api/lead` | Attribution, consent, browser validity, anti-bot timing and honeypot present |
| Rent vs. Own | `/go/rent-vs-own` | `/rent-vs-own.html` | `/api/lead` | Source hardened |
| Sell / Equity / Finance / Next Home | `/go/sell-equity-finance-next-home` | `/campaigns/sell-equity-finance-next-home.html` | `/api/lead` | Embedded approved artwork untouched; page campaign value normalized by API alias to canonical `sell-and-buy` |
| New Construction | `/go/new-construction` | `/new-construction.html` | `/api/lead` | Source hardened |
| Condo Financing | `/go/condo-financing` | `/condo-financing.html` | Contact CRM intent `condo-financing` | Source wired |
| We Buy Homes | `/go/we-buy-homes` | `/we-buy-homes.html` | `/api/lead` as Seller Strategy with `we-buy-homes` UTM attribution | Education-first page created; browser QA pending |

## Webinar funnel status

OneDesk contains both scheduled Sept. 29 MasterClasses:
- Reverse Mortgage MasterClass — Sept. 29, 2026 at 6:30 PM Eastern
- Homebuying 101™ MasterClass — Sept. 29, 2026 at 8:00 PM Eastern

OneDesk `/api/lead` now allows both `reverse-mortgage-masterclass` and `first-time-homebuyer-masterclass`, stores event metadata in notes, and writes `webinar_registration` timeline events. Registration pages include NC, SC, GA, IL and FL state choices and consent language.

## General contact intake

`/contact/` posts through `/contact-submit` into the main `/api/lead` CRM intake. Full dedicated attribution (`utm_source`, `utm_medium`, `utm_campaign`, `qr_id`, `fbclid`, `page_url`) plus automatic `form_started_at` capture is present. Query-string `interest` is validated against the actual select options before preselection, so authority-page CTAs retain their intended CRM category.

Public state choices remain restricted to NC, SC, GA, IL, and FL.

Production contact submission was manually confirmed working on 2026-09-03.

## Homepage protection

The 2026-09-03 source audit confirmed the approved homepage continues to reference the locked TRMM logo, locked Jahar profile image, approved family image, and locked seven-logo brand strip. No homepage redesign was performed during launch hardening.

## CRM strategy for new rollout pages

The We Buy Homes page posts to the existing canonical `seller-strategy` CRM campaign while preserving `utm_campaign=we-buy-homes` and full page attribution. The public Reverse Mortgage webinar page now hands off to the scheduled OneDesk Reverse Mortgage MasterClass registration funnel, which has its own allowed campaign and webinar-specific timeline event.

## Final launch gate

Source audit: PASS.
Homepage production check: PASS.
Contact submission smoke test: PASS.
First-Time Homebuyer `/go/` route smoke test: PASS.

**Overall launch status: PRODUCTION READY / LAUNCHED — 2026-09-03.**

New campaign pages added after launch remain subject to their own short browser QA before advertising.

## Artwork protection

This health manifest does not alter campaign artwork. Approved/locked campaign graphics remain the source of truth and should not be regenerated or redesigned during routing/CRM maintenance.
