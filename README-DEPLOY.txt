TRMM CAMPAIGNS — LIVE READY

Deploy these folders at the root of the existing Cloudflare Pages project:
  /campaigns/
  /assets/TRMM-DPA-CAMPAIGN-02-APPROVED-LOCKED.png
  /functions/api/lead.js

LIVE DESTINATIONS AFTER DEPLOYMENT:
  https://jaharasad.com/campaigns/first-time-homebuyer.html
  https://jaharasad.com/campaigns/down-payment-assistance.html
  https://jaharasad.com/campaigns/reverse-mortgage.html
  https://jaharasad.com/campaigns/

Cloudflare Pages environment variables required by existing lead handler:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
Optional: ALLOWED_ORIGINS

The lead form captures: campaign, first/last name, email, phone, licensed state, timeframe, housing status, preferred contact, primary question/obstacle, UTM source/campaign, Facebook click ID and landing-page URL.
