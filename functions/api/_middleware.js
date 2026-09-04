function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return '';
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

async function sendTwilio(env, { to, body }) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER || !to) {
    return { skipped: true };
  }
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const params = new URLSearchParams();
  params.set('To', to);
  params.set('From', env.TWILIO_FROM_NUMBER);
  params.set('Body', body);
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  if (!r.ok) throw new Error(`Twilio ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return { ok: true };
}

async function notifyLead(env, lead) {
  const first = clean(lead.first_name || lead.name, 80) || 'there';
  const last = clean(lead.last_name, 80);
  const fullName = `${first}${last ? ` ${last}` : ''}`;
  const email = clean(lead.email, 200).toLowerCase();
  const phone = normalizePhone(lead.phone);
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

  const customerSms = phone ? sendTwilio(env, {
    to: phone,
    body: `Hi ${first}, this is Jahar Asad — The Realtor & Mortgage Man™. I received your ${campaign} request and will be in touch. Need me sooner? Call/text 919-200-3359. Reply STOP to opt out.`
  }) : Promise.resolve({ skipped: true });

  const alertLines = [
    'NEW TRMM WEBSITE LEAD',
    `Campaign: ${campaign}`,
    `Name: ${fullName}`,
    email ? `Email: ${email}` : '',
    phone ? `Phone: ${phone}` : '',
    state ? `State: ${state}` : '',
    timeframe ? `Timeframe: ${timeframe}` : '',
    question ? `Question/Goal: ${question}` : '',
    pageUrl ? `Landing page: ${pageUrl}` : ''
  ].filter(Boolean);

  const ownerEmail = clean(env.NOTIFY_EMAIL, 200) ? sendResend(env, {
    to: clean(env.NOTIFY_EMAIL, 200),
    subject: `New TRMM lead — ${campaign} — ${fullName}`,
    text: `${alertLines.join('\n')}\n\nOpen your CRM to review the full lead record.`
  }) : Promise.resolve({ skipped: true });

  const ownerPhone = normalizePhone(env.NOTIFY_PHONE);
  const ownerSms = ownerPhone ? sendTwilio(env, {
    to: ownerPhone,
    body: `NEW TRMM LEAD: ${campaign} — ${fullName}${phone ? ` — ${phone}` : ''}${state ? ` — ${state}` : ''}. Check CRM for details.`
  }) : Promise.resolve({ skipped: true });

  const tasks = [customerEmail, customerSms, ownerEmail, ownerSms];
  const results = await Promise.allSettled(tasks);
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
