function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}
function consented(value) { return value === true || value === 'true' || value === 'on' || value === 'yes'; }
const SIGNATURE = `\n\nJahar Asad, BPA\nThe Realtor & Mortgage Man™\nOne Expert. One Solution.™ Buy • Sell • Finance.\n919-200-3359\nJaharAsad.com`;
const DAYS = [1,3,5,7,10,14];
const TRACKS = {
  'down-payment-assistance': [
    ['Your down payment may not have to come from one place', `Thanks again for requesting information about down payment assistance. Assistance programs vary by location, income, household, loan program, property, occupancy and other requirements. Some assistance may be a grant, while other programs may involve a second mortgage, deferred repayment or forgiveness conditions.\n\nLet's review what may actually fit your situation instead of assuming you qualify—or assuming you do not.`],
    ['What does “down payment assistance” really mean?', `Down payment assistance is not one single program. The amount, source, repayment terms and eligibility can vary significantly. We also need to look at your mortgage qualification, closing costs and available funds.\n\nCall or text me and we can identify which questions need to be answered first.`],
    ['Cash to close is bigger than the down payment', `Your homebuying budget can include more than the required down payment. Closing costs, prepaid items, inspections and other transaction expenses can matter too. Assistance may help in some situations, but the complete cash-to-close picture should be reviewed.`],
    ['You do not have to figure out DPA alone', `If cash to close is the main thing holding you back from homeownership, let's look at the numbers and available paths. Program availability and qualification vary, so the goal is to build a realistic plan for you.`],
    ['Quick question about your DPA goal', `Where are you right now?\n\nA. Ready to buy soon.\nB. Planning for the next 3–6 months.\nC. I need help with credit or savings first.\nD. I am just researching assistance.\n\nReply A, B, C or D.`],
    ['Ready when you are', `This is the last message in this initial DPA follow-up. When you are ready, I can help you review both the financing and real-estate sides of your homebuying plan. Assistance is subject to program availability and eligibility.`]
  ],
  'usda': [
    ['Your USDA home financing request', `Thanks again for asking about USDA financing. Eligible USDA transactions may offer 100% financing, but borrower, household income, property location, property condition and program requirements all matter. Closing costs and prepaid items can still apply.`],
    ['USDA is about more than “rural”', `USDA property eligibility is location-specific, and many eligible areas can include communities outside what people traditionally think of as rural. We also need to review household and borrower eligibility. If you have an address in mind, send it to me.`],
    ['What USDA underwriting looks at', `USDA qualification can involve income, debts, credit, household information, property eligibility and program-specific underwriting. The strongest next step is reviewing your actual situation rather than relying on a generic 0%-down headline.`],
    ['USDA property condition matters too', `The property itself must meet applicable requirements. If you are already shopping, involve me early so we can look at financing and property considerations together before you get too far into a transaction.`],
    ['Quick USDA question', `Where are you now?\n\nA. I have a property in mind.\nB. I am actively searching.\nC. I want to know whether I qualify.\nD. I am researching for later.\n\nReply A, B, C or D.`],
    ['Your USDA path when you are ready', `This is the last message in this initial USDA follow-up. If 100% financing may fit your situation, I can help you review the eligibility, property and mortgage pieces together. No financing result is guaranteed.`]
  ],
  'usda-0-down': 'usda',
  'sell-equity-finance-next-home': [
    ['Your Sell • Equity • Finance • Next Home strategy', `Thanks again for reaching out. Moving from one home to the next can involve several connected decisions: what your current home may sell for, estimated equity after selling costs and liens, how much cash you want to carry forward, and how the next-home financing fits.`],
    ['Start with the equity picture', `Before choosing the next home, it helps to understand the estimated net proceeds from the current one. Market value is only one part of the equation; liens, selling expenses and transaction terms can affect the amount available for the next move.`],
    ['Sell first, buy first, or coordinate both?', `There is no one sequence that works for every homeowner. Timing, qualification, available funds, market conditions and your comfort with carrying two properties can all influence the strategy. Let's map the order that fits your situation.`],
    ['Your next mortgage and current home are connected', `Your current housing obligation, expected sale proceeds and next-home goals can affect financing strategy. Coordinating the real-estate and mortgage sides early can help identify issues before you are under pressure.`],
    ['Quick question about your move', `Which best describes you?\n\nA. I need to sell and buy soon.\nB. I am considering a move this year.\nC. I want to know my equity first.\nD. I am researching options.\n\nReply A, B, C or D.`],
    ['When you are ready for the next move', `This is the last message in this initial follow-up. When you are ready, I can help you look at the sale, equity and next-home financing as one coordinated strategy.`]
  ],
  'sell-and-buy': 'sell-equity-finance-next-home',
  'seller-strategy': 'sell-equity-finance-next-home',
  'new-construction': [
    ['Your new-construction home plan', `Thanks again for reaching out about new construction. Builder contracts, deposits, design selections, completion timelines, incentives, appraisals and financing can work differently from a typical resale transaction. I can help you look at the real-estate and mortgage sides together.`],
    ['Builder incentives deserve a full comparison', `An incentive can be valuable, but it should be evaluated with the full transaction—price, upgrades, closing costs, rate options and lender requirements. No builder or lender incentive should be assumed until it is documented and confirmed.`],
    ['Deposits and design selections matter', `New-construction transactions may involve deposits and upgrade/design funds before closing. How those funds are treated can depend on the contract and financing. Review the structure before making assumptions about what will count toward cash to close.`],
    ['Do not wait until the house is finished to review financing', `Credit, income, assets, interest-rate strategy and property completion can all change during a long build. Staying connected throughout construction can help reduce last-minute surprises.`],
    ['Where are you in the build process?', `A. Comparing builders.\nB. Choosing a lot or floor plan.\nC. Already under contract.\nD. Building now and reviewing financing.\n\nReply A, B, C or D.`],
    ['Ready for your new-construction next step', `This is the last message in this initial new-construction follow-up. When you are ready, I can help coordinate the home search/build process and financing strategy. Terms and eligibility remain subject to the applicable builder, lender and underwriting requirements.`]
  ],
  'condo-financing': [
    ['Your condo financing request', `Thanks again for reaching out about condo financing. Condo approval can involve both you as the borrower and the condominium project itself. Loan program, occupancy, project characteristics, insurance and lender requirements can all matter.`],
    ['The condo project matters to financing', `A buyer can be financially qualified while a particular project still requires additional review. If you have a condo address or listing, send it to me early so we can identify the financing questions that may apply.`],
    ['Condo dues are part of the housing picture', `Monthly association dues can affect the total housing obligation used in qualification. Special assessments and project documentation may also matter depending on the transaction and program.`],
    ['Before you make the condo offer', `If possible, review the financing path before getting too far into a condo purchase. Borrower, unit and project eligibility can vary by loan program and lender.`],
    ['Quick condo question', `A. I have a condo picked out.\nB. I am actively searching.\nC. I own a condo and want to refinance.\nD. I am researching.\n\nReply A, B, C or D.`],
    ['When the right condo comes along', `This is the last message in this initial condo-financing follow-up. Send me the property when you are ready and we can review both your financing and the project considerations. Approval is subject to borrower, unit, project, program and lender requirements.`]
  ],
  'we-buy-homes': [
    ['Your home-sale options request', `Thanks again for reaching out about your home-sale options. The goal is to understand your priorities—timing, property condition, convenience, estimated equity and whether a traditional listing or another path may fit better. No purchase offer or outcome is guaranteed.`],
    ['Convenience versus market exposure', `Different sale paths can involve different tradeoffs. A quicker or as-is option may prioritize convenience, while broader market exposure may pursue a different pricing strategy. We can compare the options without assuming one path is right for every homeowner.`],
    ['Know the numbers before deciding', `Before choosing a sale strategy, it helps to understand estimated value, liens, selling expenses, needed repairs and your timeline. That gives you a better basis for comparing options.`],
    ['What matters most in your sale?', `Is your priority speed, maximizing market exposure, avoiding repairs, coordinating another purchase, or simply understanding what the property may be worth? Reply and tell me the most important outcome for you.`],
    ['Quick question about your property', `A. I need to sell quickly.\nB. I want to compare sale options.\nC. I need to know my equity/value first.\nD. I am just researching.\n\nReply A, B, C or D.`],
    ['Your options stay open', `This is the last message in this initial home-sale-options follow-up. When you are ready, I can help you compare the available real-estate paths and decide which one fits your goals. No direct or third-party purchase offer is guaranteed.`]
  ],
  'fire-your-landlord': [
    ['Ready to explore life beyond renting?', `Thanks for reaching out. Moving from renting toward homeownership starts with understanding your current rent, credit, income, available funds, timeline and possible financing paths—not with assuming you are or are not ready.`],
    ['What is actually holding you back?', `For some renters it is cash to close. For others it is credit, debt, uncertainty about monthly payment or simply not knowing where to start. Tell me your biggest obstacle and we can build the next step around it.`],
    ['You may have more financing paths than you think', `Depending on eligibility, property and location, several mortgage and assistance options may be worth exploring. Programs vary, and qualification is not guaranteed, but you do not need to eliminate yourself before reviewing the numbers.`],
    ['Renting versus owning is a personal calculation', `Homeownership is not automatically the right answer for everyone. Timeline, costs, maintenance, financing and your goals matter. I can help you compare the choices using your situation.`],
    ['Quick question about your timeline', `A. I want to buy now.\nB. Within 3–6 months.\nC. Within 6–12 months.\nD. I am just researching.\n\nReply A, B, C or D.`],
    ['When you are ready to explore homeownership', `This is the last message in this initial follow-up. When you want to know what buying could look like for you, call, text or reply and we can start with the numbers.`]
  ],
  'right-sizing': [
    ['Your right-sizing home strategy', `Thanks for reaching out about your next-home strategy. Right-sizing can mean downsizing, upsizing or simply choosing a home that fits the next chapter better. The plan should consider your current home's equity, next-home needs, timing and financing.`],
    ['Start with what your current home can do for you', `Understanding estimated value, liens and likely net proceeds can help frame the next move. From there we can look at how much equity you may want to use and what financing options may fit.`],
    ['Your next home should fit the next chapter', `Space, accessibility, location, maintenance, family needs and monthly housing goals can all matter. The right move is not necessarily smaller or larger—it is the one aligned with your priorities.`],
    ['Coordinate the sale and purchase', `Selling one home while purchasing another can create timing and financing questions. Planning both sides together can help identify choices before deadlines force them.`],
    ['What does right-sizing mean for you?', `A. Downsizing.\nB. Upsizing.\nC. Relocating.\nD. I am not sure yet.\n\nReply A, B, C or D.`],
    ['Ready for your next chapter', `This is the last message in this initial right-sizing follow-up. When you are ready, I can help you evaluate the current home, next-home search and financing strategy together.`]
  ]
};
function resolveTrack(campaign) {
  const key = clean(campaign, 80);
  const raw = TRACKS[key];
  if (typeof raw === 'string') return { key, messages: TRACKS[raw] };
  return raw ? { key, messages: raw } : null;
}
async function send(env, to, subject, text, scheduledAt) {
  const from = clean(env.EMAIL_FROM, 200) || 'TRMM <onboarding@resend.dev>';
  const payload = { from, to: [to], subject, text };
  if (scheduledAt) payload.scheduled_at = scheduledAt;
  const r = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json' }, body:JSON.stringify(payload) });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0,300)}`);
}
export function hasDedicatedCampaignNurture(campaign) { return !!resolveTrack(campaign); }
export async function scheduleCampaignNurture(env, lead) {
  const track = resolveTrack(lead.campaign);
  const email = clean(lead.email,200).toLowerCase();
  if (!track || !email || !consented(lead.consent) || !env.RESEND_API_KEY) return { skipped:true };
  const first = clean(lead.first_name || lead.name,80) || 'there';
  const now = Date.now();
  const jobs = track.messages.map((m,i)=>send(env,email,m[0],`Hi ${first},\n\n${m[1]}${SIGNATURE}\n\nYou are receiving this follow-up because you requested information from TRMM. To change your follow-up preference, contact Jahar directly at 919-200-3359.`,new Date(now + DAYS[i]*86400000).toISOString()));
  const results = await Promise.allSettled(jobs);
  const failed = results.filter(r=>r.status==='rejected');
  failed.forEach(r=>console.error('Campaign nurture scheduling failed',String(r.reason)));
  const scheduled = results.length-failed.length;
  const owner = clean(env.NOTIFY_EMAIL,200);
  if (owner) { try { await send(env,owner,`TRMM nurture status — ${track.key} — ${scheduled}/${results.length} scheduled`,`Nurture scheduling status\nCampaign: ${track.key}\nScheduled: ${scheduled}\nFailed: ${failed.length}\n\nThis operational message confirms whether Resend accepted the follow-up schedule for the latest successful website lead.`); } catch(e) { console.error('Campaign nurture status failed',String(e)); } }
  return { scheduled, failed:failed.length, track:track.key };
}