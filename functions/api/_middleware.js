function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function campaignLabel(value) {
  const key = clean(value, 80);
  const labels = {
    'first-time-homebuyer': 'First-Time Homebuyer',
    'down-payment-assistance': 'Down Payment Assistance',
    'reverse-mortgage': 'Reverse Mortgage / HECM',
    'reverse-mortgage-hecm': 'Reverse Mortgage / HECM',
    'usda': 'USDA Financing',
    'usda-0-down': 'USDA Financing',
    'manufactured-homes': 'Manufactured Homes',
    'new-construction': 'New Construction',
    'condo-financing': 'Condo Financing',
    'pre-foreclosure': 'Pre-Foreclosure Help',
    'pre-foreclosure-solutions': 'Pre-Foreclosure Help',
    'rent-vs-own': 'Rent vs. Own',
    'seller-strategy': 'Home Sale Options',
    'sell-equity-finance-next-home': 'Sell • Equity • Finance • Next Home'
  };
  return labels[key] || key || 'TRMM Website';
}

async function sendResend(env, { to, subject, text }) {
  if (!env.RESEND_API_KEY || !to) return { skipped: true };
  const from = clean(env.EMAIL_FROM, 200) || 'TRMM <onboarding@resend.dev>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to: [to], subject, text })
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return { ok: true };
}

async function notifyLead(env, lead) {
  const first = clean(lead.first_name || lead.name, 80) || 'there';
  const last = clean(lead.last_name, 80);
  const fullName = `${first}${last ? ` ${last}` : ''}`;
  const email = clean(lead.email, 200).toLowerCase();
  const campaign = campaignLabel(lead.campaign);
  const state = clean(lead.state, 10);
  const timeframe = clean(lead.timeframe || lead.timeline, 100);
  const question = clean(lead.primary_obstacle || lead.primary_question || lead.message || lead.goal, 300);
  const pageUrl = clean(lead.page_url, 500);

  const customerEmail = email ? sendResend(env, {
    to: email,
    subject: `We received your ${campaign} request`,
    text: `Hi ${first},\n\nThank you for reaching out to Jahar Asad — The Realtor & Mortgage Man™. I received your ${campaign} request and will review the information you submitted.\n\nYou can call or text me directly at 919-200-3359 if you need immediate assistance.\n\nJahar Asad, BPA\nThe Realtor & Mortgage Man™\nOne Expert. One Solution.™ Buy • Sell • Finance.\nJaharAsad.com\n\nThis is a confirmation of your website inquiry.`
  }) : Promise.resolve({ skipped: true });

  const alertLines = [
    `Campaign: ${campaign}`,
    `Name: ${fullName}`,
    email ? `Email: ${email}` : '',
    state ? `State: ${state}` : '',
    timeframe ? `Timeframe: ${timeframe}` : '',
    question ? `Question/Goal: ${question}` : '',
    pageUrl ? `Landing page: ${pageUrl}` : ''
  ].filter(Boolean);

  const ownerEmail = clean(env.NOTIFY_EMAIL, 200) ? sendResend(env, {
    to: clean(env.NOTIFY_EMAIL, 200),
    subject: `New TRMM lead — ${campaign} — ${fullName}`,
    text: `NEW TRMM WEBSITE LEAD\n${alertLines.join('\n')}\n\nOpen your CRM to review the full lead record.`
  }) : Promise.resolve({ skipped: true });

  const results = await Promise.allSettled([customerEmail, ownerEmail]);
  results.forEach((result, i) => {
    if (result.status === 'rejected') console.error('Lead notification failed', i, String(result.reason));
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method !== 'POST' || url.pathname !== '/api/lead') {
    return context.next();
  }

  let lead = {};
  try {
    const clone = request.clone();
    const type = (clone.headers.get('content-type') || '').toLowerCase();
    if (type.includes('application/json')) {
      lead = await clone.json();
    } else {
      const fd = await clone.formData();
      lead = Object.fromEntries(fd.entries());
    }
  } catch (error) {
    console.error('Could not parse lead for notifications', String(error));
  }

  const response = await context.next();

  if (response.ok) {
    context.waitUntil(notifyLead(env, lead));
  }

  return response;
}
