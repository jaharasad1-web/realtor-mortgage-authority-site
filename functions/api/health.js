function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}

async function probe(env,table,columns){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return {ok:false,status:null,error:"Supabase environment variables are missing."};
  const url=`${env.SUPABASE_URL.replace(/\/$/,"")}/rest/v1/${table}?select=${encodeURIComponent(columns)}&limit=0`;
  try{
    const r=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,Accept:"application/json"}});
    if(r.ok)return {ok:true,status:r.status,columns};
    let detail="";
    try{const data=await r.json();detail=[data?.code,data?.message,data?.details,data?.hint].filter(Boolean).join(" | ")||"Supabase request failed."}catch{detail=`HTTP ${r.status}`}
    return {ok:false,status:r.status,columns,error:String(detail).slice(0,350)};
  }catch(err){return {ok:false,status:null,columns,error:String(err?.message||err).slice(0,350)}}
}

export async function onRequestGet({env}){
  const configured=Boolean(env.SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY);
  if(!configured)return json({ok:false,configured:false,families:{ok:false},contact_timeline:{ok:false}},503);
  const familyColumns="id,first_name,last_name,household_name,email,phone,state,relationship_status,email_marketing_consent,direct_mail_eligible,do_not_mail,source,notes";
  const timelineColumns="family_id,event_type,title,details";
  const [families,contactTimeline]=await Promise.all([
    probe(env,"families",familyColumns),
    probe(env,"contact_timeline",timelineColumns)
  ]);
  const ok=families.ok&&contactTimeline.ok;
  return json({ok,configured:true,families,contact_timeline:contactTimeline},ok?200:500);
}
