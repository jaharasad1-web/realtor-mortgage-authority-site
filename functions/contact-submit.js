import { onRequestPost as leadPost } from "./api/lead.js";

function page(title,message,status=200,success=false){return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Jahar Asad</title><style>:root{--navy:#0A1633;--slate:#4A627A;--soft:#DCE8F2;--light:#EEF5FA;--text:#2B2B2B}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:var(--light);color:var(--text)}.wrap{width:min(760px,92%);margin:80px auto}.card{background:#fff;border-radius:20px;padding:40px;box-shadow:0 10px 30px rgba(10,22,51,.10);text-align:center}h1{color:var(--navy);font-size:clamp(2.2rem,6vw,3.8rem);margin:.2em 0}.eyebrow{color:var(--slate);font-weight:800;letter-spacing:.12em}.lead{font-size:1.1rem;line-height:1.6}.btn{display:inline-block;margin:20px 6px 0;background:var(--navy);color:#fff;text-decoration:none;font-weight:800;padding:14px 22px;border-radius:999px}.btn.alt{background:var(--slate)}</style></head><body><main class="wrap"><section class="card"><div class="eyebrow">${success?"REQUEST RECEIVED":"CONTACT REQUEST"}</div><h1>${title}</h1><p class="lead">${message}</p>${success?'<a class="btn" href="/">Return Home</a>':'<a class="btn" href="/contact/">Return to Contact</a><a class="btn alt" href="tel:9192003359">Call 919-200-3359</a>'}</section></main></body></html>`,{status,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store, no-cache, must-revalidate","pragma":"no-cache","expires":"0"}})}

export async function onRequestPost({request,env}){
  let fd;
  try{fd=await request.formData()}catch{return page("Unable to Submit","We could not read your request. Please try again or call 919-200-3359.",400)}
  const body={};
  for(const [k,v] of fd.entries())body[k]=typeof v==="string"?v:"";
  if(body.interest){body.campaign=body.interest;delete body.interest}
  body.consent=body.consent==="on"||body.consent==="true";
  body.page_url=body.page_url||new URL(request.url).origin+"/contact/";
  const proxyRequest=new Request(new URL("/api/lead",request.url),{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(body)});
  const response=await leadPost({request:proxyRequest,env});
  let data={};try{data=await response.clone().json()}catch{}
  if(response.ok&&data.ok)return page("Thank You","Your information was received successfully. Jahar Asad / TRMM will follow up with you regarding your request.",200,true);
  const detail=data?.diagnostic?.detail?` ${data.diagnostic.detail}`:"";
  return page("Unable to Submit",`${data.error||"We could not save your information right now."}${detail} Please call 919-200-3359.`,response.status||500)
}
