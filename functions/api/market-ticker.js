// Serve a dated market snapshot produced by the scheduled GitHub Actions workflow.
// Never request FRED directly from a Cloudflare Worker (FRED responds with HTTP 520).
export async function onRequestGet({env,request}) {
  try {
    const url = new URL("/market-ticker.json",request.url);
    const response = await env.ASSETS.fetch(new Request(url.toString(),{method:"GET"}));
    if(!response.ok) throw new Error("Snapshot not published yet (HTTP "+response.status+")");
    const data = await response.json();
    for(const id of ["MORTGAGE30US","MORTGAGE15US","DGS2","DGS10"]){
      const row=data.rates?.[id];
      if(!row || !Number.isFinite(row.value) || !/^\\d{4}-\\d{2}-\\d{2}$/.test(row.date)) throw new Error("Missing published series: "+id);
      const days=(Date.now()-Date.parse(row.date+"T00:00:00Z"))/86400000;
      if(days>(id.startsWith("MORTGAGE")?14:10)) throw new Error("Published snapshot is stale: "+id);
    }
    return Response.json(data,{headers:{"Cache-Control":"public, max-age=1800, s-maxage=3600"}});
  }catch(error){
    console.error("TRMM ticker snapshot unavailable",String(error));
    return Response.json({error:"Current market data temporarily unavailable",diagnostic:String(error?.message||error).slice(0,180)},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
