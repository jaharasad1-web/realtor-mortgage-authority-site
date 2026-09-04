export async function onRequestGet({ env }) {
  const topic = typeof env.NTFY_TOPIC === 'string' ? env.NTFY_TOPIC.trim() : '';
  if (!topic) {
    return new Response('NTFY_TOPIC is not configured in this deployment.', { status: 500 });
  }

  const server = (typeof env.NTFY_SERVER === 'string' && env.NTFY_SERVER.trim()
    ? env.NTFY_SERVER.trim()
    : 'https://ntfy.sh').replace(/\/$/, '');

  try {
    const r = await fetch(server, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        title: 'TRMM Website Test',
        message: 'Cloudflare can reach your ntfy topic. Website notification connection is working.',
        priority: 4,
        tags: ['white_check_mark', 'house']
      })
    });

    const body = await r.text();
    return new Response(
      r.ok ? 'TRMM ntfy test sent successfully. Check your phone.' : `ntfy request failed: ${r.status} ${body.slice(0, 300)}`,
      {
        status: r.ok ? 200 : 502,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
      }
    );
  } catch (error) {
    return new Response(`ntfy fetch threw: ${String(error)}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
}
