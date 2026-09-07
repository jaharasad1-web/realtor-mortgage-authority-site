const PMMS_URL = "https://www.freddiemac.com/pmms";
const TREASURY_URL = "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value=2026&type=daily_treasury_yield_curve";
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
    const cacheKey = new Request("https://jaharasad.com/__pmms-cache-v2");
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

async function getTreasury() {
  const fallback = { date: "09/04/2026", two: "4.37", ten: "4.78" };
  try {
    const cache = caches.default;
    const cacheKey = new Request("https://jaharasad.com/__treasury-cache-v1");
    const cached = await cache.match(cacheKey);
    if (cached) return await cached.json();
    const response = await fetch(TREASURY_URL, { headers: { "User-Agent": "JaharAsad.com market ticker" } });
    if (!response.ok) return fallback;
    const html = await response.text();
    const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
    const rows = [...text.matchAll(/(\d{2}\/\d{2}\/2026)\s+(?:N\/A\s+){11}([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/g)];
    if (!rows.length) return fallback;
    const m = rows[rows.length - 1];
    const data = { date: m[1], two: m[9], ten: m[14] };
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

function tickerMarkup(rates, treasury) {
  const strip = `
    <span class="trmm-ticker-label">TRMM MARKET UPDATE</span>
    <span class="trmm-ticker-item">30-YR FIXED <b>${escapeHtml(rates.thirty)}%</b></span>
    <span class="trmm-dot">•</span>
    <span class="trmm-ticker-item">15-YR FIXED <b>${escapeHtml(rates.fifteen)}%</b></span>
    <span class="trmm-dot">•</span>
    <span class="trmm-ticker-item">2-YR TREASURY <b>${escapeHtml(treasury.two)}%</b></span>
    <span class="trmm-dot">•</span>
    <span class="trmm-ticker-item">10-YR TREASURY <b>${escapeHtml(treasury.ten)}%</b></span>
    <span class="trmm-dot">•</span>
    <span class="trmm-ticker-item trmm-market-pulse">MARKET PULSE: S&amp;P 500 • DOW • NASDAQ</span>
    <span class="trmm-dot">•</span>
    <span class="trmm-ticker-date">Freddie Mac ${escapeHtml(rates.date)} • Treasury ${escapeHtml(treasury.date)}</span>
    <span class="trmm-dot">•</span>
    <a class="trmm-ticker-link" href="/finance.html">EXPLORE FINANCING →</a>`;

  return `
  <style>
    .trmm-rate-ticker{background:#111820;color:#fff;border-bottom:1px solid #4A627A;font-family:Arial,sans-serif;overflow:hidden;white-space:nowrap;position:relative}
    .trmm-rate-track{display:flex;width:max-content;align-items:center;animation:trmmTicker 32s linear infinite;will-change:transform}
    .trmm-rate-group{display:flex;align-items:center;gap:18px;padding:10px 18px;flex:none}
    .trmm-ticker-label{font-size:.76rem;font-weight:900;letter-spacing:.12em;color:#DCE8F2}
    .trmm-ticker-item{font-size:.9rem;font-weight:800}
    .trmm-ticker-item b{font-size:1rem;color:#fff}
    .trmm-market-pulse{color:#DCE8F2}
    .trmm-ticker-date{font-size:.72rem;color:#DCE8F2}
    .trmm-ticker-link{color:#fff;text-decoration:none;font-size:.78rem;font-weight:900;border:1px solid #667789;border-radius:5px;padding:6px 10px}
    .trmm-dot{color:#667789}
    .trmm-rate-ticker:hover .trmm-rate-track{animation-play-state:paused}
    @keyframes trmmTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @media(max-width:700px){.trmm-rate-track{animation-duration:24s}.trmm-rate-group{gap:14px;padding:9px 14px}.trmm-ticker-item{font-size:.82rem}.trmm-ticker-label{font-size:.7rem}}
    @media(prefers-reduced-motion:reduce){.trmm-rate-track{animation:none;overflow-x:auto;max-width:100vw}}
  </style>
  <div class="trmm-rate-ticker" role="region" aria-label="Mortgage, Treasury and market update">
    <div class="trmm-rate-track">
      <div class="trmm-rate-group">${strip}</div>
      <div class="trmm-rate-group" aria-hidden="true">${strip}</div>
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
    const [rates, treasury] = await Promise.all([getPmms(), getTreasury()]);
    html = html.replace("</header>", `</header>${tickerMarkup(rates, treasury)}`);
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("Cache-Control", "no-cache");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}
