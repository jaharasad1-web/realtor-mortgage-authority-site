import { onRequestPost as leadPost } from "./api/lead.js";

function html(message,status=200){return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact Jahar Asad</title><style>body{font-family:Arial,sans-serif;background:#EEF5FA;color:#2B2B2B;margin:0;padding:40px}.card{max-width:680px;margin:60px auto;background:white;padding:32px;border-radius:18px;box-shadow:0 10px 30px rgba(10,22,51,.10)}h1{color:#0A1633}a{color:#0A1633;font-weight:700}</style></head><body><div class="card"><h1>Contact Jahar</h1><p>${message}</p><p><a href="/contact/">Return to Contact</a> · <a href="/">Return Home</a></p></div></body></html>`,{status,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}})}

export async function onRequestPost({request,env}){
  let fd;
  try{fd=await request.formData()}catch{return html("We could not read your request. Please try again or call 919-200-3359.",400)}
  const body={};
  for(const [k,v] of fd.entries())body[k]=typeof v==="string"?v:"";
  if(body.interest){body.campaign=body.interest;delete body.interest}
  body.consent=body.consent==="on"||body.consent==="true";
  body.page_url=body.page_url||new URL(request.url).origin+"/contact/";
  const proxyRequest=new Request(new URL("/api/lead",request.url),{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(body)});
  const response=await leadPost({request:proxyRequest,env});
  let data={};try{data=await response.clone().json()}catch{}
  if(response.ok&&data.ok)return Response.redirect(new URL("/thank-you/",request.url),303);
  const detail=data?.diagnostic?.detail?` ${data.diagnostic.detail}`:"";
  return html(`${data.error||"We could not save your information right now."}${detail} Please call 919-200-3359.`,response.status||500)
}
