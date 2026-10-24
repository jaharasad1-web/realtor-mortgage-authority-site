// Cloudflare Pages Function: live TRMM market ticker, sourced from FRED.
// FRED series: MORTGAGE30US / MORTGAGE15US (weekly Freddie Mac PMMS), DGS2 / DGS10 (business-day Treasury).
const SERIES = ["MORTGAGE30US","MORTGAGE15US","DGS2","DGS10"];
async function readSeries(id) {
  const url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=" + encodeURIComponent(id);
  // FRED occasionally returns Cloudflare 520 to edge workers. Retry transient failures.
  let csv, lastError;
  for (let attempt=0; attempt<3; attempt++) {
    try {
      const response=await fetch(url, {headers:{"Accept":"text/csv"},cf:{cacheTtl:3600,cacheEverything:true}});
      if (!response.ok) throw new Error("FRED "+id+" HTTP "+response.status);
      csv=await response.text();
      break;
    } catch (error) {
      lastError=error;
      if(attempt<2) await new Promise(resolve=>setTimeout(resolve,300*(attempt+1)));
    }
  }
  if (!csv) throw lastError || new Error("FRED unavailable");
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
    console.error("TRMM ticker feed failure", String(error));
    return Response.json({error:"Current market data temporarily unavailable",diagnostic:String(error?.message || error).slice(0,180)},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
