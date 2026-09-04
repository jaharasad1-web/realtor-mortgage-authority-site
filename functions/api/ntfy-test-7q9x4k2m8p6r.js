export async function onRequestGet({ env }) {
  const topic = typeof env.NTFY_TOPIC === 'string' ? env.NTFY_TOPIC.trim() : '';
  if (!topic) {
    return new Response('NTFY_TOPIC is not configured in this deployment.', { status: 500 });
  }

  const server = (typeof env.NTFY_SERVER === 'string' && env.NTFY_SERVER.trim()
    ? env.NTFY_SERVER.trim()
    : 'https://ntfy.sh').replace(/\/$/, '');

  const r = await fetch(`${server}/${encodeURIComponent(topic)}`, {
    method: 'POST',
    headers: {
      'Title': 'TRMM Website Test',
      'Priority': 'high',
      'Tags': 'white_check_mark,house'
    },
    body: 'Cloudflare can reach your ntfy topic. Website notification connection is working.'
  });

  const body = await r.text();
  if (!r.ok) {
    return new Response(`ntfy request failed: ${r.status} ${body.slice(0, 200)}`, { status: 502 });
  }

  return new Response('TRMM ntfy test sent successfully. Check your phone.', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
