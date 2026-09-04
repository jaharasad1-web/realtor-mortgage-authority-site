export async function onRequestGet({ env }) {
  const topic = typeof env.NTFY_TOPIC === 'string' ? env.NTFY_TOPIC.trim() : '';
  if (!topic) {
    return new Response('DIAGNOSTIC: NTFY_TOPIC is not configured in this deployment.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }

  const server = (typeof env.NTFY_SERVER === 'string' && env.NTFY_SERVER.trim()
    ? env.NTFY_SERVER.trim()
    : 'https://ntfy.sh').replace(/\/$/, '');

  try {
    const r = await fetch(`${server}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TRMM-Website-Lead-Notifier/1.0'
      },
      body: JSON.stringify({
        topic,
        title: 'TRMM Website Test',
        message: 'Cloudflare can reach your ntfy topic. Website notification connection is working.',
        priority: 4,
        tags: ['white_check_mark', 'house']
      })
    });

    const body = await r.text();
    if (r.ok) {
      return new Response('SUCCESS: TRMM ntfy test sent successfully. Check your phone.', {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
      });
    }

    return new Response(`DIAGNOSTIC: ntfy returned HTTP ${r.status}\n\n${body.slice(0, 1000)}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return new Response(`DIAGNOSTIC: ntfy fetch threw an exception\n\n${String(error)}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
}
