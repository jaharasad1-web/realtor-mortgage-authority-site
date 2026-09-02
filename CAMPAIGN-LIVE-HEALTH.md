# TRMM Campaign Live Health

Last source audit: 2026-09-01

This manifest tracks the production campaign routing + lead-intake wiring in `realtor-mortgage-authority-site`. It is intentionally source-level only: a route is not marked browser-verified unless it has actually been opened successfully in production.

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
| First-Time Homebuyer | `/go/first-time-homebuyer` | `/first-time-homebuyer.html` | `/api/lead` | CRM + dedicated UTM/QR attribution wired; production route previously opened successfully |
| Down Payment Assistance | `/go/down-payment-assistance` | `/down-payment-assistance.html` | `/api/lead` | Consent present; page URL preserves router attribution; source audited |
| Manufactured Homes | `/go/manufactured-homes` | `/manufactured-homes.html` | `/api/lead` | Dedicated UTM/QR attribution + validity check added in `b126af1f2efacb2e78418f3dccec18c767451706` |
| New Construction | `/go/new-construction` | `/new-construction.html` | `/api/lead` | Canonical campaign + consent + dedicated UTM/QR attribution wired in `8c97e7b827bf9ace0a6f43d0bfc76a12176f7331` |
| Reverse Mortgage | `/go/reverse-mortgage` | `/reverse-mortgage.html` | `/api/lead` | Alias normalizes to `reverse-mortgage`; dedicated UTM/QR attribution + validity check added in `623886e0174bf9cee62db8a26f966c2c82a8c224` |
| Reverse Mortgage alias | `/go/reverse-mortgage-hecm` | `/reverse-mortgage.html` | `/api/lead` | Routed to canonical Reverse Mortgage campaign |
| Pre-Foreclosure | `/go/pre-foreclosure` | `/foreclosure-solutions.html` | `/api/lead` | Alias normalizes to `pre-foreclosure`; dedicated UTM/QR attribution + validity check added in `7224844ddfaacf4c0a92c7740001eea3e92499c7` |
| Foreclosure Solutions alias | `/go/foreclosure-solutions` | `/foreclosure-solutions.html` | `/api/lead` | Routed to canonical Pre-Foreclosure campaign |
| USDA | `/go/usda` | `/usda-home-loans.html` | `/api/lead` | Alias `usda-0-down` normalizes to `usda`; dedicated UTM/QR attribution + validity check added in `671ac2332b3cc951da70ebed1ef016faaaa3455e` |
| USDA alias | `/go/usda-home-loans` | `/usda-home-loans.html` | `/api/lead` | Routed to canonical USDA campaign |
| Rent vs. Own | `/go/rent-vs-own` | `/rent-vs-own.html` | `/api/lead` | CRM allowlist + consent/QR attribution repaired 2026-09-01 |
| Fire Your Landlord | `/go/fire-your-landlord` | OneDesk campaign page | OneDesk `/api/lead-v2` | Source wired; OneDesk lead intake hardened 2026-09-01 |
| Right-Sizing | `/go/right-sizing` | OneDesk campaign page | OneDesk `/api/lead-v2` | Source wired; OneDesk lead intake hardened 2026-09-01 |
| Right-Sizing aliases | `/go/rightsizing-options`, `/go/downsize-upsize-right-size` | OneDesk campaign page | OneDesk `/api/lead-v2` | Routed to canonical `right-sizing` |
| DSCR | `/go/dscr` | `/campaigns/dscr.html` | `/api/dscr-lead` | QR/UTM attribution + Supabase authorization hardened 2026-09-01 |
| DSCR alias | `/go/dscr-investors` | `/campaigns/dscr.html` | `/api/dscr-lead` | Routed to DSCR landing page |
| Sell / Equity / Finance / Next Home | `/go/sell-equity-finance-next-home` | `/campaigns/sell-equity-finance-next-home.html` | `/api/lead` | Canonical CRM campaign is `sell-and-buy`; approved embedded artwork intentionally untouched |

## CRM canonical campaigns repaired/confirmed

Main authority-site lead API includes `rent-vs-own`, `sell-and-buy`, `manufactured-homes`, `new-construction`, `reverse-mortgage`, `pre-foreclosure`, `usda`, `down-payment-assistance`, and `first-time-homebuyer` among its accepted campaigns.

Aliases currently include:
- `New Construction` -> `new-construction`
- `reverse-mortgage-hecm` -> `reverse-mortgage`
- `pre-foreclosure-solutions` -> `pre-foreclosure`
- `usda-0-down` -> `usda`

## Important verification rule

Source configuration is not the same as live browser verification. Do not claim every `/go/` route is production-verified until each route has been opened/tested after Cloudflare deployment.

## Artwork protection

This health manifest does not alter campaign artwork. Approved/locked campaign graphics remain the source of truth and should not be regenerated or redesigned during routing/CRM maintenance.
