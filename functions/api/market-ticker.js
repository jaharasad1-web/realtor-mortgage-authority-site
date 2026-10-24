// Cloudflare Pages Function: live TRMM market ticker, sourced from FRED.
// FRED series: MORTGAGE30US / MORTGAGE15US (weekly Freddie Mac PMMS), DGS2 / DGS10 (business-day Treasury).
const SERIES = ["MORTGAGE30US","MORTGAGE15US","DGS2","DGS10"];
async function readSeries(id) {
  const url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=" + encodeURIComponent(id);
  const response = await fetch(url, {headers:{"Accept":"text/csv","User-Agent":"TRMM-Market-Ticker/1.0"}});
  if (!response.ok) throw new Error("FRED "+id+" HTTP "+response.status);
  const csv = await response.text();
  const lines = csv.trim().split(/\r?\n/);
  let latest = null;
  for (const line of lines.slice(1)) {
    const [date,raw] = line.split(",");
    const value = Number(raw);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && raw && raw.trim() !== "." && Number.isFinite(value)) latest={date,value};
  }
  if (!latest) throw new Error("No numeric data for "+id);
  return latest;
}
export async function onRequestGet() {
  try {
    const results = await Promise.all(SERIES.map(readSeries));
    const data = Object.fromEntries(SERIES.map((id,i)=>[id,results[i]]));
    const now = Date.now();
    const ageDays = date => (now - Date.parse(date+"T00:00:00Z")) / 86400000;
    if (ageDays(data.MORTGAGE30US.date)>14 || ageDays(data.MORTGAGE15US.date)>14 || ageDays(data.DGS2.date)>10 || ageDays(data.DGS10.date)>10) throw new Error("Market data is too old");
    return Response.json({source:"Federal Reserve Economic Data (FRED); Freddie Mac PMMS / US Treasury",rates:data},{headers:{"Cache-Control":"public, max-age=1800, s-maxage=21600","Access-Control-Allow-Origin":"*"}});
  } catch(error) {
    return Response.json({error:"Current market data temporarily unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
