const PMMS_URL = "https://www.freddiemac.com/pmms";
const META_PIXEL_ID = "1327292961902434";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

async function getPmms() {
  const fallback = { date: "September 3, 2026", thirty: "6.71", fifteen: "6.04" };
  try {
    const cache = caches.default;
    const cacheKey = new Request("https://jaharasad.com/__pmms-cache-v1");
    const cached = await cache.match(cacheKey);
    if (cached) return await cached.json();
    const response = await fetch(PMMS_URL, { headers: { "User-Agent": "JaharAsad.com mortgage-market ticker" } });
    if (!response.ok) return fallback;
    const html = await response.text();
    const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
    const dateMatch = text.match(/U\.S\. weekly mortgage rate averages as of\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/i);
    const thirtyMatch = text.match(/30[- ]year Fixed[- ]Rate Mortgage\s*([0-9]+\.[0-9]+)%/i) || text.match(/30-year fixed-rate mortgage\s+averaged\s+([0-9]+\.[0-9]+)%/i);
    const fifteenMatch = text.match(/15[- ]year Fixed[- ]Rate Mortgage\s*([0-9]+\.[0-9]+)%/i) || text.match(/15-year fixed-rate mortgage\s+averaged\s+([0-9]+\.[0-9]+)%/i);
    const data = { date: dateMatch?.[1] || fallback.date, thirty: thirtyMatch?.[1] || fallback.thirty, fifteen: fifteenMatch?.[1] || fallback.fifteen };
    await cache.put(cacheKey, Response.json(data, { headers: { "Cache-Control": "public, max-age=21600" } }));
    return data;
  } catch (_) {
    return fallback;
  }
}

function pixelMarkup() {
  return `<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');\nfbq('init','${META_PIXEL_ID}');\nfbq('track','PageView');\n</script>\n<!-- End Meta Pixel Code -->`;
}

function pixelNoScript() {
  return `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" alt=""></noscript>`;
}

function tickerMarkup(rates) {
  return `
  <style>
    .trmm-rate-ticker{background:#111820;color:#fff;border-bottom:1px solid #4A627A;font-family:Arial,sans-serif}
    .trmm-rate-inner{width:min(1220px,92%);margin:auto;display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;padding:10px 0;text-align:center}
    .trmm-rate-label{font-size:.76rem;font-weight:900;letter-spacing:.12em;color:#DCE8F2}
    .trmm-rate-item{font-size:.92rem;font-weight:900;white-space:nowrap}
    .trmm-rate-item b{font-size:1.05rem;color:#fff}
    .trmm-rate-date{font-size:.72rem;color:#DCE8F2}
    .trmm-rate-link{color:#fff;text-decoration:none;font-size:.78rem;font-weight:900;border:1px solid #667789;border-radius:5px;padding:7px 10px}
    .trmm-rate-note{width:100%;font-size:.64rem;line-height:1.35;color:#DCE8F2;margin-top:-3px}
    @media(max-width:700px){.trmm-rate-inner{gap:9px 14px;padding:9px 0}.trmm-rate-label{width:100%}.trmm-rate-note{font-size:.6rem}}
  </style>
  <div class="trmm-rate-ticker" role="region" aria-label="Current mortgage market averages">
    <div class="trmm-rate-inner">
      <span class="trmm-rate-label">MORTGAGE MARKET UPDATE</span>
      <span class="trmm-rate-item">30-YR FIXED <b>${escapeHtml(rates.thirty)}%</b></span>
      <span class="trmm-rate-item">15-YR FIXED <b>${escapeHtml(rates.fifteen)}%</b></span>
      <span class="trmm-rate-date">Freddie Mac national averages • ${escapeHtml(rates.date)}</span>
      <a class="trmm-rate-link" href="/finance.html">EXPLORE FINANCING →</a>
      <span class="trmm-rate-note">Market benchmark for educational purposes only; not an offer or personalized rate quote. Actual rates, APR, points, fees and eligibility vary by borrower, property, loan program and market conditions.</span>
    </div>
  </div>`;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!response.ok || !type.includes("text/html")) return response;

  let html = await response.text();
  html = html.replace("</head>", `${pixelMarkup()}</head>`);
  html = html.replace("<body", `${pixelNoScript()}<body`);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    const rates = await getPmms();
    html = html.replace("</header>", `</header>${tickerMarkup(rates)}`);
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("Cache-Control", "no-cache");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}
