# TRMM Campaigns 01–11 — Launch Audit

Status: ROLLOUT BUILD COMPLETE / PRE-SPEND VERIFICATION
Audit date: September 3, 2026
Public states: NC • SC • GA • IL • FL

## Executive Result

All 11 campaign rollout playbooks are present in the production repository. The shared `/go/` campaign router contains tracked routes for the campaign families that use it and preserves incoming query parameters while adding campaign, UTM and QR defaults when missing.

The campaign system is ready for controlled organic rollout and final pre-spend verification. Do not treat an existing route or rollout document as proof that a QR code baked into artwork points to that route. Exact artwork QR payload verification remains a separate pre-paid-media checkpoint where applicable.

## Campaign Audit Matrix

| # | Campaign | Rollout | Primary Destination / Route | Launch Status |
|---|---|---|---|---|
| 01 | First-Time Homebuyer + Webinar | Present | `/go/first-time-homebuyer` + `/go/first-time-homebuyer-webinar` | READY; verify baked artwork QR before paid spend |
| 02 | Reverse Mortgage + Webinar | Present | `/go/reverse-mortgage` + `/go/reverse-mortgage-webinar` | READY; HECM compliance guardrails required |
| 03 | Down Payment Assistance | Present | `/go/down-payment-assistance` | READY; verify baked artwork QR before paid spend |
| 04 | USDA / 0% Down | Present | `/go/usda` | READY; preserve eligibility disclosures |
| 05 | Manufactured Homes | Present | `/go/manufactured-homes` | READY; property + borrower eligibility framing required |
| 06 | Pre-Foreclosure / Homeowner Solutions | Present | `/go/pre-foreclosure` | READY; education-first / no rescue guarantees |
| 07 | Rent vs Own | Present | `/go/rent-vs-own` | READY; no guaranteed savings/equity claims |
| 08 | Sell • Equity • Finance • Next Home | Present | `/go/sell-equity-finance-next-home` | READY; preserve locked embedded creative |
| 09 | New Construction | Present | `/go/new-construction` | READY; no guaranteed builder/lender incentive claims |
| 10 | Condo Financing | Present | `/go/condo-financing` | READY; project eligibility must remain conditional |
| 11 | We Buy Homes | Present | `/go/we-buy-homes` | READY; options-first, no guaranteed purchase offer |

## Router Verification

Current shared router includes campaign destinations for:

- First-Time Homebuyer
- First-Time Homebuyer Webinar / Homebuying MasterClass
- Down Payment Assistance
- Manufactured Homes
- New Construction
- Condo Financing
- Reverse Mortgage / HECM
- Reverse Mortgage Webinar
- Pre-Foreclosure / Foreclosure Solutions
- We Buy Homes
- USDA / USDA Home Loans
- Rent vs Own
- Sell • Equity • Finance • Next Home

The router also supports other TRMM campaign families such as Fire Your Landlord, Right-Sizing and DSCR.

For recognized routes it:

1. preserves incoming query parameters;
2. sets the campaign when missing;
3. defaults `utm_source=qr` when missing;
4. defaults `utm_medium=qr` when missing;
5. defaults `utm_campaign` to the route campaign when missing;
6. defaults `qr_id` to the route slug when missing;
7. returns a no-store 302 redirect.

## Pre-Spend Gate

Before meaningful paid-media spend on any creative containing a baked/printed QR code:

1. Scan the exact final artwork from a second device.
2. Confirm the destination resolves on `JaharAsad.com`.
3. Confirm the campaign lands on the intended page.
4. Confirm the URL retains or receives campaign/UTM/QR attribution.
5. Submit one controlled test lead using Jahar-authorized test information.
6. Confirm the lead appears in the intended CRM path with campaign/source attribution.
7. Confirm mobile layout and CTA are usable.
8. Only then mark that specific creative `PAID-SPEND VERIFIED`.

Do not send synthetic/fake production leads merely to complete an audit.

## Known QR Verification Items

Priority exact-payload checks before paid spend:

- First-Time Homebuyer approved artwork QR
- Down Payment Assistance approved artwork QR
- DSCR artwork QR if/when DSCR is included in paid rollout
- any older campaign artwork produced before the current `/go/` tracking convention

A generic TRMM QR that resolves only to the homepage can remain useful for general branding, but campaign advertising should preferably use the matching `/go/<campaign>` route for attribution.

## CRM / Form Gate

Campaign landing pages should either submit to the active lead API or deliberately route into the appropriate contact/OneDesk flow. Do not assume a visible CTA proves CRM delivery. For paid launch, verify the actual production submission path once per distinct form architecture rather than flooding the CRM with tests.

The First-Time Homebuyer and Reverse Mortgage webinar tracks are separate registration funnels and should retain their webinar lifecycle stages rather than being treated as ordinary buyer leads.

## Compliance Gate Across All 11

- Public advertising remains NC • SC • GA • IL • FL only.
- No guaranteed approval, rate, payment, savings, assistance, equity growth, proceeds, closing result or purchase offer.
- Financing language remains subject to program, borrower, property, lender and underwriting requirements as applicable.
- DPA language remains conditional and does not imply every buyer qualifies or that all assistance is free money.
- USDA 0% down / 100% financing language must clarify that eligible transactions can still involve closing costs, prepaid items or other expenses.
- HECM content must preserve borrower obligations and required counseling disclosures and must not imply HUD/FHA endorsement of TRMM materials.
- Pre-Foreclosure content must remain educational and must not promise foreclosure prevention, legal results or loan modification.
- We Buy Homes remains an options-comparison campaign; no direct or third-party purchase offer is guaranteed.
- Condo financing remains conditional on borrower, unit, project, occupancy, program and lender requirements.
- Manufactured-home financing remains conditional on home/property classification, title/land, installation/foundation, condition, program and lender requirements.

## Locked Asset Gate

Do not regenerate, redesign, retouch, recolor or substitute approved campaign masters, Jahar's locked profile image, TRMM logo, QR treatment or locked brand strip unless Jahar explicitly reopens that asset for correction.

Campaign rollout documents are marketing/operations playbooks; their creation does not authorize changing locked artwork.

## Recommended Launch Priority

Start the controlled rollout in the approved sequence rather than launching all 11 paid campaigns simultaneously:

01 First-Time Homebuyer + Webinar
02 Reverse Mortgage + Webinar
03 Down Payment Assistance
04 USDA / 0% Down
05 Manufactured Homes
06 Pre-Foreclosure / Homeowner Solutions
07 Rent vs Own
08 Sell • Equity • Finance • Next Home
09 New Construction
10 Condo Financing
11 We Buy Homes

This allows tracking, lead quality and conversion data from each campaign to inform budget allocation before scaling.

## Final Status Definitions

`ROLLOUT READY` — copy, funnel strategy, tracking convention and compliance plan exist.

`ORGANIC READY` — campaign can be used in controlled organic promotion with the current destination.

`PAID-SPEND VERIFIED` — exact final creative, exact QR/link, production destination and CRM attribution have been tested together.

As of this audit, the 11-campaign rollout build is complete. The remaining launch work is verification and deployment discipline, not rebuilding the campaign system.
