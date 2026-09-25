export async function onRequestGet({ env }) {
  const configured = name => Boolean(env[name]);
  return new Response(JSON.stringify({
    ok: true,
    environment: {
      SUPABASE_URL: configured('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: configured('SUPABASE_SERVICE_ROLE_KEY'),
      RESEND_API_KEY: configured('RESEND_API_KEY'),
      EMAIL_FROM: configured('EMAIL_FROM'),
      NOTIFY_EMAIL: configured('NOTIFY_EMAIL'),
      NTFY_TOPIC: configured('NTFY_TOPIC'),
      ALLOWED_ORIGINS: configured('ALLOWED_ORIGINS')
    }
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
