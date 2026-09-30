function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}
function consented(value) { return value === true || value === 'true' || value === 'on' || value === 'yes'; }
const SIGNATURE = `\n\nJahar Asad, BPA\nThe Realtor & Mortgage Man™\nOne Expert. One Solution.™ Buy • Sell • Finance.\n919-200-3359\nJaharAsad.com`;
const DAYS = [1,3,5,7,10,14];
const TRACKS = {
  'first-time-homebuyer': [
    ['Your first-home plan starts with the numbers', `Thanks again for reaching out about buying your first home. The first step is understanding your budget, available funds, credit profile, timeline, and possible financing or assistance programs. You do not have to know everything before we talk.`],
    ['Preapproval is more than a price range', `A useful preapproval looks at income, debts, credit, assets, likely cash to close and the loan programs that may fit. It also helps us build a realistic home-search strategy before you make an offer.`],
    ['Do not assume you need 20% down', `Depending on eligibility, property and location, buyers may have FHA, VA, USDA, conventional or down-payment-assistance options. Programs and qualifications vary, so the goal is to review your actual situation rather than eliminate yourself too early.`],
    ['From house hunting to a strong offer', `Once financing is understood, the real-estate strategy matters too: property condition, price, seller concessions, due diligence, inspections and appraisal can all affect the transaction. I can help coordinate both sides.`],
    ['Quick question about your homebuying timeline', `Where are you now?\n\nA. Ready to buy now.\nB. Within 3 months.\nC. 3–6 months.\nD. I am researching or preparing.\n\nReply A, B, C or D.`],
    ['Ready when you are', `This is the last message in this initial first-time-homebuyer follow-up. When you are ready, I can help you move from financing preparation through the home search, offer and closing with one coordinated strategy.`]
  ],
  'reverse-mortgage': [
    ['Your reverse mortgage / HECM request', `Thanks again for reaching out about reverse mortgage / HECM options. These loans have specific age, property, equity, counseling, financial-assessment and occupancy requirements. The right starting point is understanding your goals and the property involved.`],
    ['What do you want your home equity to do?', `Reverse mortgage planning is not only about a loan amount. It starts with your goals: remaining in the home, addressing an existing mortgage, improving monthly cash flow, or purchasing another home.`],
    ['HECM for Purchase is another path to understand', `A reverse mortgage may also be used by eligible borrowers to purchase a home. The required borrower contribution, available proceeds, property eligibility, counseling and other requirements depend on the specific transaction.`],
    ['Responsibilities do not disappear with a reverse mortgage', `A reverse mortgage generally does not eliminate homeowner responsibilities. Property taxes, homeowners insurance, required property charges, occupancy and property maintenance remain important. Costs and available proceeds also need a complete review.`],
    ['Quick question about your reverse mortgage goal', `Which best describes your goal?\n\nA. Stay in my current home.\nB. Pay off or replace an existing mortgage.\nC. Purchase another home using HECM for Purchase.\nD. I am researching.\n\nReply A, B, C or D.`],
    ['A reverse mortgage should fit the plan', `This is the last message in this initial reverse-mortgage follow-up. If you want to review the numbers, costs, responsibilities, alternatives and long-term plan, call, text or reply. No loan result or available proceeds are guaranteed.`]
  ]
};
const ALIASES = {
  'first-time-homebuyer-masterclass': 'first-time-homebuyer',
  'homebuying-101-masterclass': 'first-time-homebuyer',
  'reverse-mortgage-masterclass': 'reverse-mortgage',
  'reverse-mortgage-hecm': 'reverse-mortgage'
};
function resolveTrack(campaign) {
  const original = clean(campaign, 80);
  const key = ALIASES[original] || original;
  return TRACKS[key] ? { key, messages: TRACKS[key] } : null;
}
async function send(env, to, subject, text, scheduledAt) {
  const from = clean(env.EMAIL_FROM, 200) || 'TRMM <onboarding@resend.dev>';
  const payload = { from, to: [to], subject, text };
  if (scheduledAt) payload.scheduled_at = scheduledAt;
  const r = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json' }, body:JSON.stringify(payload) });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0,300)}`);
}
export function hasPriorityNurture(campaign) { return !!resolveTrack(campaign); }
export async function schedulePriorityNurture(env, lead) {
  const track = resolveTrack(lead.campaign);
  const email = clean(lead.email,200).toLowerCase();
  if (!track || !email || !consented(lead.consent) || !env.RESEND_API_KEY) return { skipped:true };
  const first = clean(lead.first_name || lead.name,80) || 'there';
  const now = Date.now();
  const jobs = track.messages.map((m,i)=>send(env,email,m[0],`Hi ${first},\n\n${m[1]}${SIGNATURE}\n\nYou are receiving this follow-up because you requested information from TRMM. To change your follow-up preference, contact Jahar directly at 919-200-3359.`,new Date(now + DAYS[i]*86400000).toISOString()));
  const results = await Promise.allSettled(jobs);
  const failed = results.filter(r=>r.status==='rejected');
  failed.forEach(r=>console.error('Priority nurture scheduling failed',String(r.reason)));
  const scheduled = results.length-failed.length;
  const owner = clean(env.NOTIFY_EMAIL,200);
  if (owner) { try { await send(env,owner,`TRMM nurture status — ${track.key} — ${scheduled}/${results.length} scheduled`,`Nurture scheduling status\nCampaign: ${track.key}\nScheduled: ${scheduled}\nFailed: ${failed.length}`); } catch(e) { console.error('Priority nurture status failed',String(e)); } }
  return { scheduled, failed:failed.length, track:track.key };
}
