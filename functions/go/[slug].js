const ROUTES = {
  "first-time-homebuyer": { campaign: "first-time-homebuyer", destination: "/first-time-homebuyer.html" },
  "first-time-homebuyer-webinar": { campaign: "first-time-homebuyer-webinar", destination: "/homebuying-masterclass.html" },
  "homebuying-masterclass": { campaign: "first-time-homebuyer-webinar", destination: "/homebuying-masterclass.html" },
  "down-payment-assistance": { campaign: "down-payment-assistance", destination: "/down-payment-assistance.html" },
  "manufactured-homes": { campaign: "manufactured-homes", destination: "/manufactured-homes.html" },
  "new-construction": { campaign: "new-construction", destination: "/new-construction.html" },
  "condo-financing": { campaign: "condo-financing", destination: "/condo-financing.html" },
  "reverse-mortgage": { campaign: "reverse-mortgage", destination: "/reverse-mortgage.html" },
  "reverse-mortgage-hecm": { campaign: "reverse-mortgage", destination: "/reverse-mortgage.html" },
  "reverse-mortgage-webinar": { campaign: "reverse-mortgage-webinar", destination: "/reverse-mortgage-webinar.html" },
  "pre-foreclosure": { campaign: "pre-foreclosure", destination: "/foreclosure-solutions.html" },
  "foreclosure-solutions": { campaign: "pre-foreclosure", destination: "/foreclosure-solutions.html" },
  "we-buy-homes": { campaign: "we-buy-homes", destination: "/we-buy-homes.html" },
  "usda": { campaign: "usda", destination: "/usda-home-loans.html" },
  "usda-home-loans": { campaign: "usda", destination: "/usda-home-loans.html" },
  "rent-vs-own": { campaign: "rent-vs-own", destination: "/rent-vs-own.html" },
  "fire-your-landlord": { campaign: "fire-your-landlord", destination: "https://trmm-onedesk.pages.dev/campaigns/fire-your-landlord.html" },
  "right-sizing": { campaign: "right-sizing", destination: "https://trmm-onedesk.pages.dev/campaigns/right-sizing.html" },
  "rightsizing-options": { campaign: "right-sizing", destination: "https://trmm-onedesk.pages.dev/campaigns/right-sizing.html" },
  "downsize-upsize-right-size": { campaign: "right-sizing", destination: "https://trmm-onedesk.pages.dev/campaigns/right-sizing.html" },
  "dscr": { campaign: "dscr-investors", destination: "/campaigns/dscr.html" },
  "dscr-investors": { campaign: "dscr-investors", destination: "/campaigns/dscr.html" },
  "sell-equity-finance-next-home": { campaign: "sell-and-buy", destination: "/campaigns/sell-equity-finance-next-home.html" }
};

export async function onRequestGet({ request, params }) {
  const slug = String(params.slug || "").toLowerCase();
  const route = ROUTES[slug];
  const incoming = new URL(request.url);

  if (!route) {
    return new Response("Campaign route not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" }
    });
  }

  const target = route.destination.startsWith("http")
    ? new URL(route.destination)
    : new URL(route.destination, incoming.origin);

  for (const [key, value] of incoming.searchParams.entries()) {
    target.searchParams.append(key, value);
  }

  if (!target.searchParams.has("campaign")) target.searchParams.set("campaign", route.campaign);
  if (!target.searchParams.has("utm_source")) target.searchParams.set("utm_source", "qr");
  if (!target.searchParams.has("utm_medium")) target.searchParams.set("utm_medium", "qr");
  if (!target.searchParams.has("utm_campaign")) target.searchParams.set("utm_campaign", route.campaign);
  if (!target.searchParams.has("qr_id")) target.searchParams.set("qr_id", slug);

  return new Response(null, {
    status: 302,
    headers: {
      "Location": target.toString(),
      "Cache-Control": "no-store"
    }
  });
}
