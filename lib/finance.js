// The money math for every finance tool, in one place, with no UI in it.
// Pure functions only, so the whole file runs under node for known-answer
// testing before any component touches it. Rates come in as annual
// percentages (6 means 6%), money as plain numbers, terms in months.

export const round2 = (n) => Math.round(n * 100) / 100;

/* Standard annuity payment. The r === 0 branch matters: a 0% promotional
   loan divides by zero in the closed form. */
export function emi(principal, annualRatePct, months) {
  const r = annualRatePct / 100 / 12;
  if (months <= 0 || principal <= 0) return 0;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/* Month-by-month amortization. extraMonthly goes to principal every month;
   lumpSum lands once at lumpMonth. Returns the schedule and the totals a
   person actually asks for: interest paid, months taken, and both compared
   to the no-extra baseline. */
export function amortize(principal, annualRatePct, months, extraMonthly = 0, lumpSum = 0, lumpMonth = 0) {
  const r = annualRatePct / 100 / 12;
  const basePayment = emi(principal, annualRatePct, months);
  const rows = [];
  let bal = principal;
  let totalInterest = 0;
  let m = 0;
  while (bal > 0.005 && m < months * 3 + 600) {
    m++;
    const interest = bal * r;
    let principalPart = basePayment - interest;
    let extra = extraMonthly + (m === lumpMonth ? lumpSum : 0);
    // Final payment: never overpay past zero.
    if (principalPart + extra >= bal) {
      extra = Math.max(0, bal - principalPart);
      if (principalPart > bal) { principalPart = bal; extra = 0; }
    }
    bal = bal - principalPart - extra;
    totalInterest += interest;
    rows.push({
      month: m,
      payment: round2(principalPart + interest + extra),
      interest: round2(interest),
      principal: round2(principalPart),
      extra: round2(extra),
      balance: round2(Math.max(bal, 0)),
    });
    if (principalPart <= 0 && extra <= 0) break; // payment does not cover interest
  }
  return {
    payment: round2(basePayment),
    months: m,
    totalInterest: round2(totalInterest),
    totalPaid: round2(principal + totalInterest),
    rows,
    coversInterest: basePayment > principal * r,
  };
}

/* Debt payoff: snowball pays smallest balance first, avalanche pays highest
   rate first. All minimums are always paid; the extra budget and every
   freed-up minimum roll into the current target. Returns per-debt payoff
   months and the overall cost. */
export function payoffPlan(debts, extraMonthly, strategy) {
  // debts: [{name, balance, ratePct, min}]
  const ds = debts
    .map((d, i) => ({ ...d, i, bal: d.balance }))
    .filter((d) => d.bal > 0);
  const order = (list) =>
    strategy === "avalanche"
      ? [...list].sort((a, b) => b.ratePct - a.ratePct || a.bal - b.bal)
      : [...list].sort((a, b) => a.bal - b.bal || b.ratePct - a.ratePct);
  let month = 0;
  let totalInterest = 0;
  const paidOff = [];
  const MAX = 1200;
  while (ds.some((d) => d.bal > 0.005) && month < MAX) {
    month++;
    // interest accrues on everything first
    for (const d of ds) {
      if (d.bal <= 0.005) continue;
      const int = (d.bal * d.ratePct) / 100 / 12;
      d.bal += int;
      totalInterest += int;
    }
    // minimums
    let budgetExtra = extraMonthly;
    for (const d of ds) {
      if (d.bal <= 0.005) { budgetExtra += d.min; continue; } // freed minimum rolls on
      const pay = Math.min(d.min, d.bal);
      d.bal -= pay;
    }
    // extra to the target, cascading if the target dies mid-month
    let live = order(ds.filter((d) => d.bal > 0.005));
    while (budgetExtra > 0.005 && live.length) {
      const t = live[0];
      const pay = Math.min(budgetExtra, t.bal);
      t.bal -= pay;
      budgetExtra -= pay;
      live = order(ds.filter((d) => d.bal > 0.005));
    }
    for (const d of ds) {
      if (d.bal <= 0.005 && !paidOff.some((p) => p.i === d.i)) {
        paidOff.push({ i: d.i, name: d.name, month });
      }
    }
  }
  return {
    months: month,
    finished: !ds.some((d) => d.bal > 0.005),
    totalInterest: round2(totalInterest),
    paidOff,
  };
}

/* Future value of a starting pot plus a monthly contribution. Contributions
   land at the end of each month, which matches how people actually save. */
export function futureValue(start, monthly, annualRatePct, months) {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return start + monthly * months;
  const f = Math.pow(1 + r, months);
  return start * f + monthly * ((f - 1) / r);
}

/* Monthly amount needed to reach target in `months`, from `start`. Inverse
   of futureValue in the monthly term. */
export function monthlyForGoal(target, start, annualRatePct, months) {
  const r = annualRatePct / 100 / 12;
  if (months <= 0) return Infinity;
  if (r === 0) return (target - start) / months;
  const f = Math.pow(1 + r, months);
  return (target - start * f) / ((f - 1) / r);
}

/* Months until futureValue reaches target. Closed form exists but the
   simulation is clearer, immune to log-domain edge cases, and instant at
   these sizes. */
export function monthsToGoal(target, start, monthly, annualRatePct) {
  if (start >= target) return 0;
  const r = annualRatePct / 100 / 12;
  let bal = start;
  for (let m = 1; m <= 1200; m++) {
    bal = bal * (1 + r) + monthly;
    if (bal >= target) return m;
  }
  return Infinity;
}

/* VAT / GST, both directions. Removing is the one people get wrong:
   the tax inside 118 at 18% is 18, not 21.24, because the 18% was charged
   on the net 100, not on the gross. */
export function vatAdd(net, ratePct) {
  const tax = (net * ratePct) / 100;
  return { net: round2(net), tax: round2(tax), gross: round2(net + tax) };
}
export function vatRemove(gross, ratePct) {
  const net = gross / (1 + ratePct / 100);
  return { net: round2(net), tax: round2(gross - net), gross: round2(gross) };
}

/* Break-even: units where revenue covers fixed + variable costs. */
export function breakEven(fixedCosts, pricePerUnit, variablePerUnit) {
  const contribution = pricePerUnit - variablePerUnit;
  if (contribution <= 0) return { possible: false, contribution: round2(contribution) };
  const units = fixedCosts / contribution;
  return {
    possible: true,
    contribution: round2(contribution),
    contributionPct: round2((contribution / pricePerUnit) * 100),
    units: Math.ceil(units),
    unitsExact: round2(units),
    revenue: round2(Math.ceil(units) * pricePerUnit),
  };
}

/* Salary conversions through one canonical value: yearly. */
export function salaryFrom(kind, amount, hoursPerWeek, weeksPerYear) {
  const toYear = {
    hourly: amount * hoursPerWeek * weeksPerYear,
    daily: amount * 5 * weeksPerYear, // informational; day-based entry uses daysPerWeek in the UI
    weekly: amount * weeksPerYear,
    monthly: amount * 12,
    yearly: amount,
  };
  const year = toYear[kind];
  return {
    hourly: year / (hoursPerWeek * weeksPerYear),
    weekly: year / weeksPerYear,
    monthly: year / 12,
    yearly: year,
  };
}

/* Freelance day/hour rate from an income goal. Rounds up: quoting below
   the computed floor defeats the purpose. */
export function freelanceRate({ targetIncome, annualCosts, billableHoursPerWeek, weeksWorked }) {
  const billableHours = billableHoursPerWeek * weeksWorked;
  if (billableHours <= 0) return null;
  const needed = targetIncome + annualCosts;
  const hourly = needed / billableHours;
  return {
    billableHours: Math.round(billableHours),
    hourly: Math.ceil(hourly),
    day: Math.ceil(hourly * 8),
    revenueNeeded: round2(needed),
  };
}

/* Zakat. Nisab thresholds are the classical constants: 87.48 g gold or
   612.36 g silver. Zakat is 2.5% of net zakatable wealth at or above nisab. */
export const NISAB_GOLD_GRAMS = 87.48;
export const NISAB_SILVER_GRAMS = 612.36;

export function zakat({ cash, goldGrams, goldPricePerGram, silverGrams, silverPricePerGram, business, receivables, investments, liabilities, nisabBasis }) {
  const goldValue = goldGrams * goldPricePerGram;
  const silverValue = silverGrams * silverPricePerGram;
  const assets = cash + goldValue + silverValue + business + receivables + investments;
  const net = assets - liabilities;
  const nisab = nisabBasis === "gold"
    ? NISAB_GOLD_GRAMS * goldPricePerGram
    : NISAB_SILVER_GRAMS * silverPricePerGram;
  const due = net >= nisab && nisab > 0;
  return {
    assets: round2(assets),
    net: round2(net),
    nisab: round2(nisab),
    due,
    amount: due ? round2(net * 0.025) : 0,
    goldValue: round2(goldValue),
    silverValue: round2(silverValue),
  };
}
