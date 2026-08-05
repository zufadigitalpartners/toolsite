// Property math. The models here are deliberately explainable: every
// simulation is a plain year loop a reader could reproduce in a
// spreadsheet, because housing decisions deserve arithmetic you can audit.

import { emi, round2 } from "@/lib/finance";

/* Rent vs buy, simulated yearly.

   Renting: pay rent (growing), invest what buying would have cost extra
   is NOT modelled (kept out on purpose; it doubles the assumptions).
   Buying: mortgage payment + upkeep + buying costs once, minus the equity
   you build and the appreciation you gain. The comparison is net cost of
   each path over time; break-even is the year buying's net cost drops
   below renting's. */
export function rentVsBuy({
  monthlyRent, rentGrowthPct,
  price, downPct, ratePct, termYears,
  buyCostsPct, upkeepPct, appreciationPct,
  years = 30,
}) {
  const down = price * (downPct / 100);
  const loan = price - down;
  const months = termYears * 12;
  const payment = emi(loan, ratePct, months);
  const mr = ratePct / 100 / 12;

  let rentTotal = 0;
  let rent = monthlyRent;
  let bal = loan;
  let ownOutlay = down + price * (buyCostsPct / 100);
  let value = price;
  const rows = [];
  let breakEvenYear = null;

  for (let y = 1; y <= years; y++) {
    rentTotal += rent * 12;
    rent *= 1 + rentGrowthPct / 100;

    for (let m = 0; m < 12 && bal > 0; m++) {
      const interest = bal * mr;
      const principal = Math.min(payment - interest, bal);
      bal -= principal;
      ownOutlay += interest + principal;
    }
    ownOutlay += price * (upkeepPct / 100);
    value *= 1 + appreciationPct / 100;

    const equity = value - bal;
    const ownNet = ownOutlay - equity; // money gone after counting what you own
    rows.push({ year: y, rentTotal: round2(rentTotal), ownNet: round2(ownNet), equity: round2(equity) });
    if (breakEvenYear === null && ownNet < rentTotal) breakEvenYear = y;
  }
  return { payment: round2(payment), rows, breakEvenYear };
}

/* Affordability by the lending ratios banks actually apply: housing
   payment within frontPct of gross monthly income, and all debt within
   backPct. The binding one wins, then the payment converts to a price
   through the mortgage formula. */
export function affordability({
  monthlyIncome, monthlyDebts, ratePct, termYears, downPayment,
  frontPct = 28, backPct = 36,
}) {
  const front = monthlyIncome * (frontPct / 100);
  const back = monthlyIncome * (backPct / 100) - monthlyDebts;
  const maxPayment = Math.max(0, Math.min(front, back));
  const n = termYears * 12;
  const r = ratePct / 100 / 12;
  const loan = r === 0 ? maxPayment * n : (maxPayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  return {
    maxPayment: round2(maxPayment),
    maxLoan: round2(loan),
    maxPrice: round2(loan + downPayment),
    limitedBy: front < back ? "housing ratio" : "total debt ratio",
  };
}

/* Rental yield three ways, because listings quote whichever flatters.
   Gross: rent/price. Net: after costs. Cash-on-cash: net cash flow after
   mortgage over the cash actually invested. */
export function rentalYield({
  price, monthlyRent, annualCosts, vacancyPct = 0,
  downPct = 100, ratePct = 0, termYears = 25, buyCostsPct = 0,
}) {
  const annualRent = monthlyRent * 12 * (1 - vacancyPct / 100);
  const gross = (monthlyRent * 12 / price) * 100;
  const noi = annualRent - annualCosts;
  const net = (noi / price) * 100;
  const down = price * (downPct / 100);
  const loan = price - down;
  const debtService = loan > 0 ? emi(loan, ratePct, termYears * 12) * 12 : 0;
  const cashInvested = down + price * (buyCostsPct / 100);
  const cashFlow = noi - debtService;
  return {
    gross: round2(gross),
    net: round2(net),
    noi: round2(noi),
    cashFlow: round2(cashFlow),
    cashOnCash: cashInvested > 0 ? round2((cashFlow / cashInvested) * 100) : 0,
    monthlyCashFlow: round2(cashFlow / 12),
    debtService: round2(debtService),
  };
}

/* Vehicle depreciation: steep first year, steady after. Both rates
   editable; the defaults are the industry's rule of thumb. */
export function depreciation({ price, firstYearPct = 20, laterYearsPct = 15, years = 10 }) {
  const rows = [];
  let value = price;
  for (let y = 1; y <= years; y++) {
    value *= 1 - (y === 1 ? firstYearPct : laterYearsPct) / 100;
    rows.push({ year: y, value: round2(value), lost: round2(price - value) });
  }
  return rows;
}

/* Fair rent split: by room area with shared space divided equally, or
   proportional to income. Both published as methods flatmates accept. */
export function rentSplit({ totalRent, method, people }) {
  // people: [{name, roomSize | income}]
  const n = people.length;
  if (!n || totalRent <= 0) return null;
  if (method === "equal") {
    return people.map((p) => ({ name: p.name, share: round2(totalRent / n) }));
  }
  const key = method === "income" ? "income" : "roomSize";
  const total = people.reduce((a, p) => a + (Number(p[key]) || 0), 0);
  if (total <= 0) return null;
  return people.map((p) => ({
    name: p.name,
    share: round2((totalRent * (Number(p[key]) || 0)) / total),
    pct: round2(((Number(p[key]) || 0) / total) * 100),
  }));
}
