function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function consented(value) {
  return value === true || value === 'true' || value === 'on' || value === 'yes';
}

const SIGNATURE = `\n\nJahar Asad, BPA\nThe Realtor & Mortgage Man™\nOne Expert. One Solution.™ Buy • Sell • Finance.\n919-200-3359\nJaharAsad.com`;

const TRACKS = {
  'rent-vs-own': [
    { day: 1, subject: 'Your rent payment tells only part of the story', body: `Thanks again for requesting your Rent vs. Own analysis.\n\nWhen I compare renting and owning, I don't want to simply ask which monthly payment is lower. We also need to look at how long you expect to stay, available funds, financing options, estimated ownership expenses, and the potential to build equity over time.\n\nSometimes renting still makes sense. Sometimes the numbers show that homeownership is worth exploring. The goal is to look at your situation, not a generic calculator.\n\nIf you have a question, call or text me at 919-200-3359.` },
    { day: 3, subject: `Let's talk about your Rent vs. Own numbers`, body: `You requested a Rent vs. Own analysis because you wanted to know whether continuing to rent or exploring homeownership makes sense for you.\n\nA calculator can give you numbers. A conversation helps us understand what those numbers actually mean for your situation.\n\nCALL ME: 919-200-3359\n\nLet's spend a few minutes talking about your current rent, your goals, potential financing options, and what you would need to do if you wanted to become a homeowner. You do not have to be ready to buy today. The purpose is to help you understand your options so you can decide what makes sense for you.` },
    { day: 5, subject: 'What happens to your housing payment over time?', body: `Here is another question worth considering: what is your housing payment doing for you over the next several years?\n\nRent provides housing, but it generally does not create ownership in the property. With homeownership, part of a mortgage payment may reduce principal and build equity. A home's value may also rise or fall over time; appreciation is not guaranteed.\n\nThat is why your Rent vs. Own analysis should compare the costs, benefits, and risks of both choices.\n\nWant to talk through yours? Call or text me at 919-200-3359.` },
    { day: 7, subject: 'You may not need 20% down', body: `One of the biggest misconceptions I hear is, “I need 20% down before I can buy a home.”\n\nThere are multiple financing paths, including FHA, VA and USDA where eligible, conventional financing, and down-payment-assistance programs that may be available depending on the borrower, property, and location.\n\nThat does not mean every program works for everyone. It means do not eliminate yourself before we look at the options.\n\nCall or text me at 919-200-3359 and we can determine what may be worth exploring.` },
    { day: 10, subject: 'Quick question about your homeownership plans', body: `I wanted to check back on your Rent vs. Own request. Where would you say you are right now?\n\nA. I am interested in buying soon.\nB. Maybe within the next 6–12 months.\nC. I want to buy, but something is holding me back.\nD. I am just trying to understand my options.\n\nJust reply A, B, C, or D. I will take it from there.` },
    { day: 14, subject: `I'm here when you're ready`, body: `I do not want to fill your inbox, so this is the last message in this initial Rent vs. Own series.\n\nIf homeownership is something you would like to explore, you do not have to figure out the real estate side and mortgage side separately. That is the reason behind TRMM: One Expert. One Solution.™ Buy • Sell • Finance.\n\nWhen you are ready, call or text me at 919-200-3359, or simply reply to this email and tell me where you are in the process.` }
  ],
  'manufactured-homes': [
    { day: 1, subject: 'Your manufactured-home financing request', body: `Thanks again for reaching out about manufactured-home financing. These transactions can depend on the home, land, title, foundation, age, property classification, loan program, and your overall qualifications.\n\nMy goal is to help you identify the path that fits the property and your situation rather than assume every manufactured home finances the same way. Call or text me at 919-200-3359 if you already have a property in mind.` },
    { day: 3, subject: `Let's talk about the manufactured home you're considering`, body: `If you are actively looking at a manufactured home, call me at 919-200-3359. A short conversation about the home, land, location, and your goals can help us determine what needs to be reviewed next.` },
    { day: 7, subject: 'Manufactured homes: property details matter', body: `Financing can vary based on whether land is included, how the home is titled and attached, and the requirements of the loan program. If you have a listing or property address, reply to this email or call/text 919-200-3359 so we can review the situation.` },
    { day: 14, subject: 'Still exploring manufactured-home options?', body: `If manufactured-home ownership is still part of your plan, I am here to help you work through both the real estate and financing sides. Reply to this email or call/text 919-200-3359 when you are ready.` }
  ],
  'first-time-homebuyer': [
    { day: 1, subject: 'Your first-home plan starts with the numbers', body: `Thanks again for reaching out about buying your first home. The first step is understanding your budget, available funds, credit profile, timeline, and possible financing or assistance programs.\n\nYou do not have to know everything before we talk. Call or text me at 919-200-3359 with your biggest homebuying question.` },
    { day: 3, subject: `Let's talk about your first-home goal`, body: `Buying your first home involves both the mortgage and the real estate strategy. Call me at 919-200-3359 and let's talk through where you are now, what may be holding you back, and the next practical step.` },
    { day: 7, subject: 'Do not assume you need 20% down', body: `Depending on eligibility, property, and location, buyers may have FHA, VA, USDA, conventional, or down-payment-assistance options. Programs and qualifications vary. Call or text 919-200-3359 and we can explore which paths may apply to you.` },
    { day: 14, subject: 'Ready for your next homebuying step?', body: `Whether you are ready now or preparing for later, I can help you build a clear path forward. Reply to this email or call/text me at 919-200-3359.` }
  ],
  'reverse-mortgage': [
    { day: 1, subject: 'Your reverse mortgage / HECM request', body: `Thanks again for reaching out about reverse mortgage / HECM options. These loans have specific age, property, equity, counseling, financial-assessment, and occupancy requirements. The right starting point is understanding your goals and the property involved.\n\nCall or text me at 919-200-3359 if you would like to discuss your situation.` },
    { day: 3, subject: `Let's talk about what you want your home equity to do`, body: `Reverse mortgage planning is not only about a loan amount. It starts with your goals: remaining in the home, purchasing another home, managing an existing mortgage, or improving monthly cash flow.\n\nCall me at 919-200-3359 and we can discuss which questions need to be answered for your situation.` },
    { day: 7, subject: 'Reverse mortgage decisions deserve a complete review', body: `Costs, available proceeds, existing liens, property charges, counseling, and long-term plans all matter. If you are still exploring, reply to this email or call/text 919-200-3359.` },
    { day: 14, subject: 'Still considering a reverse mortgage?', body: `If you are still considering a reverse mortgage or HECM purchase, I am available to help you understand the process and available options. Reply here or call/text 919-200-3359.` }
  ],
  'pre-foreclosure': [
    { day: 1, subject: 'Do not ignore your mortgage timeline', body: `Thanks again for reaching out about pre-foreclosure help. Timing can matter, so gather any recent mortgage statements, notices, or correspondence from your servicer.\n\nCall me at 919-200-3359 so we can discuss the property, your goals, and where you are in the process. I am not your attorney and this is not legal advice; if you have received court or legal papers, consider speaking with a qualified attorney promptly.` },
    { day: 3, subject: 'Your options depend on where you are in the process', body: `Depending on your circumstances, the next step may involve working with your servicer, reviewing sale/equity options, or obtaining legal or housing-counseling guidance.\n\nCALL ME: 919-200-3359. The sooner we understand the timeline and your goal for the property, the better we can identify what information you need next.` },
    { day: 5, subject: 'Have your mortgage notices available', body: `If you have received notices from your mortgage servicer, keep them together and note any dates or deadlines shown. Do not rely on an email sequence when a formal deadline is approaching. Call me at 919-200-3359, and seek appropriate legal or housing-counseling help when needed.` },
    { day: 7, subject: 'Still need help with the property?', body: `If you still need help understanding real-estate options for the property, reply to this email or call/text me at 919-200-3359. If your situation involves a legal deadline or foreclosure proceeding, contact an appropriate attorney or housing counselor as well.` }
  ],
  general: [
    { day: 1, subject: 'Following up on your TRMM request', body: `Thanks again for contacting me. I wanted to make sure you have a direct way to reach me. Reply to this email or call/text 919-200-3359 and tell me what you would most like help with.` },
    { day: 3, subject: `Let's talk about your real estate or mortgage goal`, body: `A short conversation can often clarify the next step. Call me at 919-200-3359 and we can discuss your goal, timeline, and what information you need.` },
    { day: 7, subject: 'Still need help?', body: `If your real estate or mortgage goal is still active, reply to this email or call/text 919-200-3359. I am here when you are ready.` }
  ]
};

const ALIASES = {
  'reverse-mortgage-hecm': 'reverse-mortgage',
  'pre-foreclosure-solutions': 'pre-foreclosure'
};

function trackFor(campaign) {
  const key = ALIASES[clean(campaign, 80)] || clean(campaign, 80);
  return { key, messages: TRACKS[key] || TRACKS.general };
}

async function sendResend(env, { to, subject, text, scheduledAt }) {
  if (!env.RESEND_API_KEY || !to) return { skipped: true };
  const from = clean(env.EMAIL_FROM, 200) || 'TRMM <onboarding@resend.dev>';
  const payload = { from, to: [to], subject, text };
  if (scheduledAt) payload.scheduled_at = scheduledAt;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json().catch(() => ({ ok: true }));
}

export async function scheduleNurture(env, lead) {
  const email = clean(lead.email, 200).toLowerCase();
  if (!email || !consented(lead.consent)) return { skipped: true };
  const first = clean(lead.first_name || lead.name, 80) || 'there';
  const { key, messages } = trackFor(lead.campaign);
  const now = Date.now();
  const jobs = messages.map(message => sendResend(env, {
    to: email,
    subject: message.subject,
    text: `Hi ${first},\n\n${message.body}${SIGNATURE}\n\nYou are receiving this follow-up because you requested information from TRMM. To change your follow-up preference, contact Jahar directly at 919-200-3359.`,
    scheduledAt: new Date(now + message.day * 24 * 60 * 60 * 1000).toISOString()
  }));
  const results = await Promise.allSettled(jobs);
  const failures = results.filter(r => r.status === 'rejected');
  failures.forEach(r => console.error('Nurture scheduling failed', String(r.reason)));
  const scheduled = results.length - failures.length;

  const owner = clean(env.NOTIFY_EMAIL, 200);
  if (owner) {
    try {
      await sendResend(env, {
        to: owner,
        subject: `TRMM nurture status — ${key || 'general'} — ${scheduled}/${results.length} scheduled`,
        text: `Nurture scheduling status\nCampaign: ${key || 'general'}\nScheduled: ${scheduled}\nFailed: ${failures.length}\n\nThis operational message confirms whether Resend accepted the follow-up schedule for the latest successful website lead.`
      });
    } catch (error) {
      console.error('Nurture status notification failed', String(error));
    }
  }

  return { scheduled, failed: failures.length, track: key || 'general' };
}
