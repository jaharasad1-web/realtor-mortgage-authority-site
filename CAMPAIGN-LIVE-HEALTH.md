# TRMM Campaign Live Health

Last source audit: 2026-09-03
Production smoke test: PASS — 2026-09-03
Launch status: PRODUCTION READY / LAUNCHED

This manifest tracks the production campaign routing + lead-intake wiring in `realtor-mortgage-authority-site`. Source-level checks are distinguished from browser verification.

## Launch readiness

Source-level launch audit completed 2026-09-03. Approved homepage source, core campaign router, hardened `/contact/` intake, campaign attribution, and public-state restrictions were rechecked. No source-level launch blocker was found in those core paths.

Final production smoke test completed 2026-09-03. The approved homepage was confirmed live, and Jahar Asad manually confirmed both the live `/contact/` submission path and `/go/first-time-homebuyer` campaign route work in a normal production browser.

**LAUNCH GATE: PASS.**

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

## Campaign status

| Campaign | Go route | Destination | Lead API | Source audit |
|---|---|---|---|---|
| First-Time Homebuyer | `/go/first-time-homebuyer` | `/first-time-homebuyer.html` | `/api/lead` | Full dedicated attribution (`utm_source`, `utm_medium`, `utm_campaign`, `qr_id`, `fbclid`, `page_url`), anti-bot timing, honeypot, explicit consent and browser validity checks confirmed 2026-09-02; production route browser-confirmed 2026-09-03 |
| Down Payment Assistance | `/go/down-payment-assistance` | `/down-payment-assistance.html` | `/api/lead` | Consent + validity checks present. Page explicitly captures `utm_source`, `utm_campaign`, `fbclid`, and full `page_url`; API safely recovers `utm_medium`, `qr_id`, and any missing attribution from the landing-page URL. |
| Manufactured Homes | `/go/manufactured-homes` | `/manufactured-homes.html` | `/api/lead` | Dedicated UTM/QR attribution + validity check added in `b126af1f2efacb2e78418f3dccec18c767451706` |
| New Construction | `/go/new-construction` | `/new-construction.html` | `/api/lead` | Canonical campaign + consent + dedicated UTM/QR attribution wired in `8c97e7b827bf9ace0a6f43d0bfc76a12176f7331` |
| Reverse Mortgage | `/go/reverse-mortgage` | `/reverse-mortgage.html` | `/api/lead` | Alias normalizes to `reverse-mortgage`; dedicated UTM/QR attribution + validity check added in `623886e0174bf9cee62db8a26f966c2c82a8c224` |
| Reverse Mortgage alias | `/go/reverse-mortgage-hecm` | `/reverse-mortgage.html` | `/api/lead` | Routed to canonical Reverse Mortgage campaign |
| Pre-Foreclosure | `/go/pre-foreclosure` | `/foreclosure-solutions.html` | `/api/lead` | Alias normalizes to `pre-foreclosure`; dedicated UTM/QR attribution + validity check added in `7224844ddfaacf4c0a92c7740001eea3e92499c7` |
| Foreclosure Solutions alias | `/go/foreclosure-solutions` | `/foreclosure-solutions.html` | `/api/lead` | Routed to canonical Pre-Foreclosure campaign |
| USDA | `/go/usda` | `/usda-home-loans.html` | `/api/lead` | Alias `usda-0-down` normalizes to `usda`; dedicated UTM/QR attribution + validity check added in `671ac2332b3cc951da70ebed1ef016faaaa3455e` |
| USDA alias | `/go/usda-home-loans` | `/usda-home-loans.html` | `/api/lead` | Routed to canonical USDA campaign |
| Rent vs. Own | `/go/rent-vs-own` | `/rent-vs-own.html` | `/api/lead` | Full dedicated attribution already present; anti-bot timing, browser validity checks and explicit consent serialization added in `28db48c2111951663af4bfe03fca7d3c7f86fd9d` |
| Fire Your Landlord | `/go/fire-your-landlord` | OneDesk campaign page | OneDesk `/api/lead-v2` | Source wired; OneDesk lead intake hardened 2026-09-01 |
| Right-Sizing | `/go/right-sizing` | OneDesk campaign page | OneDesk `/api/lead-v2` | Source wired; OneDesk lead intake hardened 2026-09-01 |
| Right-Sizing aliases | `/go/rightsizing-options`, `/go/downsize-upsize-right-size` | OneDesk campaign page | OneDesk `/api/lead-v2` | Routed to canonical `right-sizing` |
| DSCR | `/go/dscr` | `/campaigns/dscr.html` | `/api/dscr-lead` | QR/UTM attribution + Supabase authorization hardened 2026-09-01 |
| DSCR alias | `/go/dscr-investors` | `/campaigns/dscr.html` | `/api/dscr-lead` | Routed to DSCR landing page |
| Sell / Equity / Finance / Next Home | `/go/sell-equity-finance-next-home` | `/campaigns/sell-equity-finance-next-home.html` | `/api/lead` | Canonical CRM campaign is `sell-and-buy`; approved embedded artwork intentionally untouched |

## General contact intake

`/contact/` posts through `/contact-submit` into the main `/api/lead` CRM intake. Full dedicated attribution (`utm_source`, `utm_medium`, `utm_campaign`, `qr_id`, `fbclid`, `page_url`) plus automatic `form_started_at` capture is present. Query-string `interest` is validated against the actual select options before preselection, so authority-page CTAs retain their intended CRM category.

Public state choices remain restricted to NC, SC, GA, IL, and FL.

Production contact submission was manually confirmed working on 2026-09-03.

## Homepage protection

The 2026-09-03 source audit confirmed the approved homepage continues to reference the locked TRMM logo, locked Jahar profile image, approved family image, and locked seven-logo brand strip. No homepage redesign was performed during launch hardening.

## CRM canonical campaigns repaired/confirmed

Main authority-site lead API includes the campaign categories used by the current contact and campaign paths, including `rent-vs-own`, `sell-and-buy`, `manufactured-homes`, `new-construction`, `reverse-mortgage`, `pre-foreclosure`, `usda`, `down-payment-assistance`, `first-time-homebuyer`, and the authority-site contact categories.

The main lead API also recovers `utm_source`, `utm_medium`, `utm_campaign`, `qr_id`, and `fbclid` from `page_url` when a landing page does not send a dedicated field.

Aliases currently include:
- `New Construction` -> `new-construction`
- `reverse-mortgage-hecm` -> `reverse-mortgage`
- `pre-foreclosure-solutions` -> `pre-foreclosure`
- `usda-0-down` -> `usda`

## Final launch gate

Source audit: PASS.
Homepage production check: PASS.
Contact submission smoke test: PASS.
First-Time Homebuyer `/go/` route smoke test: PASS.

**Overall launch status: PRODUCTION READY / LAUNCHED — 2026-09-03.**

Additional campaign routes remain governed by their individual source-audit status above and can be browser-tested during normal campaign QA without blocking the core website launch.

## Artwork protection

This health manifest does not alter campaign artwork. Approved/locked campaign graphics remain the source of truth and should not be regenerated or redesigned during routing/CRM maintenance.
