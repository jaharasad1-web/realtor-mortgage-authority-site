function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}

async function probe(env,table){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return {ok:false,status:null,error:"Supabase environment variables are missing."};
  const url=`${env.SUPABASE_URL.replace(/\/$/,"")}/rest/v1/${table}?select=*&limit=0`;
  try{
    const r=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,Accept:"application/json"}});
    if(r.ok)return {ok:true,status:r.status};
    let detail="";
    try{const data=await r.json();detail=data?.code||data?.message||data?.hint||"Supabase request failed."}catch{detail=`HTTP ${r.status}`}
    return {ok:false,status:r.status,error:String(detail).slice(0,180)};
  }catch(err){return {ok:false,status:null,error:String(err?.message||err).slice(0,180)}}
}

export async function onRequestGet({env}){
  const configured=Boolean(env.SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY);
  if(!configured)return json({ok:false,configured:false,families:{ok:false},contact_timeline:{ok:false}},503);
  const [families,contactTimeline]=await Promise.all([probe(env,"families"),probe(env,"contact_timeline")]);
  const ok=families.ok&&contactTimeline.ok;
  return json({ok,configured:true,families,contact_timeline:contactTimeline},ok?200:500);
}
