function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}

function headers(env,extra={}){return {apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,Accept:"application/json","Content-Type":"application/json",...extra}}

async function probe(env,table,columns){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return {ok:false,status:null,error:"Supabase environment variables are missing."};
  const url=`${env.SUPABASE_URL.replace(/\/$/,"")}/rest/v1/${table}?select=${encodeURIComponent(columns)}&limit=0`;
  try{
    const r=await fetch(url,{headers:headers(env)});
    if(r.ok)return {ok:true,status:r.status,columns};
    let detail="";
    try{const data=await r.json();detail=[data?.code,data?.message,data?.details,data?.hint].filter(Boolean).join(" | ")||"Supabase request failed."}catch{detail=`HTTP ${r.status}`}
    return {ok:false,status:r.status,columns,error:String(detail).slice(0,350)};
  }catch(err){return {ok:false,status:null,columns,error:String(err?.message||err).slice(0,350)}}
}

async function writeProbe(env){
  const base=env.SUPABASE_URL.replace(/\/$/,"");
  const stamp=String(Date.now());
  const payload={first_name:"TRMM",last_name:"HealthCheck",household_name:"TRMM HealthCheck",email:`health-${stamp}@example.invalid`,phone:stamp.slice(-10),state:"NC",relationship_status:"new",email_marketing_consent:false,direct_mail_eligible:false,do_not_mail:true,source:"System | Health Check",notes:"Temporary automated write probe. Safe to delete."};
  let id=null;
  try{
    const r=await fetch(`${base}/rest/v1/families?select=id`,{method:"POST",headers:headers(env,{Prefer:"return=representation"}),body:JSON.stringify(payload)});
    const text=await r.text();
    if(!r.ok){let detail=text;try{const d=JSON.parse(text);detail=[d?.code,d?.message,d?.details,d?.hint].filter(Boolean).join(" | ")||text}catch{}return {ok:false,status:r.status,error:String(detail).slice(0,500)}}
    let rows=[];try{rows=text?JSON.parse(text):[]}catch{}
    id=Array.isArray(rows)?rows[0]?.id:rows?.id;
    if(!id)return {ok:false,status:r.status,error:"Write succeeded but no family ID was returned."};
    const del=await fetch(`${base}/rest/v1/families?id=eq.${encodeURIComponent(id)}`,{method:"DELETE",headers:headers(env,{Prefer:"return=minimal"})});
    if(!del.ok)return {ok:true,status:r.status,cleanup:false,warning:`Write succeeded; temporary health-check row ${id} could not be auto-deleted.`};
    return {ok:true,status:r.status,cleanup:true};
  }catch(err){return {ok:false,status:null,error:String(err?.message||err).slice(0,500)}}
}

export async function onRequestGet({env,request}){
  const configured=Boolean(env.SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY);
  if(!configured)return json({ok:false,configured:false,families:{ok:false},contact_timeline:{ok:false}},503);
  const familyColumns="id,first_name,last_name,household_name,email,phone,state,relationship_status,email_marketing_consent,direct_mail_eligible,do_not_mail,source,notes";
  const timelineColumns="family_id,event_type,title,details";
  const [families,contactTimeline]=await Promise.all([probe(env,"families",familyColumns),probe(env,"contact_timeline",timelineColumns)]);
  let write={skipped:true};
  const url=new URL(request.url);
  if(url.searchParams.get("write")==="1")write=await writeProbe(env);
  const ok=families.ok&&contactTimeline.ok&&(write.skipped||write.ok);
  return json({ok,configured:true,families,contact_timeline:contactTimeline,write},ok?200:500);
}
