// Crypto arithmetic. No prices are fetched anywhere in this file: every
// number comes from the user, which is what keeps these tools honest and
// offline. Fees are percentages per side, the way exchanges charge them.

import { round2 } from "@/lib/finance";

/* Profit on a position after both fees. Buy fee inflates the cost of
   acquiring the coins; sell fee shaves the proceeds. */
export function cryptoProfit({ amountSpent, buyPrice, sellPrice, buyFeePct = 0, sellFeePct = 0 }) {
  if (amountSpent <= 0 || buyPrice <= 0) return null;
  const coins = (amountSpent * (1 - buyFeePct / 100)) / buyPrice;
  const proceeds = coins * sellPrice * (1 - sellFeePct / 100);
  const profit = proceeds - amountSpent;
  // sell price at which proceeds exactly repay the spend
  const breakeven = amountSpent / (coins * (1 - sellFeePct / 100));
  return {
    coins,
    proceeds: round2(proceeds),
    profit: round2(profit),
    roiPct: round2((profit / amountSpent) * 100),
    breakeven,
  };
}

/* Average cost basis across many buys, with break-even and P/L at a
   price you name. Sells reduce holdings at average cost (the common
   portfolio convention, stated in the UI). */
export function averageCost(entries, currentPrice = 0) {
  // entries: [{type: 'buy'|'sell', amount (coins), price}]
  let coins = 0;
  let cost = 0;
  let realized = 0;
  for (const e of entries) {
    if (!(e.amount > 0) || !(e.price >= 0)) continue;
    if (e.type === "sell") {
      const sellCoins = Math.min(e.amount, coins);
      const avg = coins > 0 ? cost / coins : 0;
      realized += sellCoins * (e.price - avg);
      cost -= sellCoins * avg;
      coins -= sellCoins;
    } else {
      coins += e.amount;
      cost += e.amount * e.price;
    }
  }
  const avg = coins > 0 ? cost / coins : 0;
  const value = coins * currentPrice;
  return {
    coins,
    totalCost: round2(cost),
    avgCost: avg,
    realized: round2(realized),
    value: round2(value),
    unrealized: round2(value - cost),
    unrealizedPct: cost > 0 ? round2(((value - cost) / cost) * 100) : 0,
  };
}

/* Impermanent loss for a 50/50 pool, the standard closed form:
   IL = 2·sqrt(r) / (1 + r) − 1, where r is the price ratio change.
   Known values: r=1.25 → −0.6%, r=2 → −5.72%, r=4 → −20%. */
export function impermanentLoss(priceRatio) {
  if (priceRatio <= 0) return null;
  return (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
}

/* What a 50/50 LP position is worth vs holding, given deposit value and
   the ratio change, ignoring trading fees earned (stated in UI). */
export function lpVsHold({ deposit, priceRatio }) {
  const il = impermanentLoss(priceRatio);
  if (il === null || deposit <= 0) return null;
  // hold value: half stays flat, half moves with price
  const hold = deposit * (0.5 + 0.5 * priceRatio);
  const lp = hold * (1 + il);
  return { hold: round2(hold), lp: round2(lp), ilPct: round2(il * 100), lost: round2(hold - lp) };
}

/* Staking with compounding. APR compounded n times a year; also accepts
   "none" for simple interest, because plenty of staking pays simply. */
export function stakingRewards({ amount, aprPct, years, compoundsPerYear }) {
  if (amount <= 0 || years <= 0) return null;
  const r = aprPct / 100;
  let final;
  if (!compoundsPerYear) final = amount * (1 + r * years);
  else final = amount * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years);
  const effectiveApy = compoundsPerYear
    ? (Math.pow(1 + r / compoundsPerYear, compoundsPerYear) - 1) * 100
    : aprPct;
  return { final: round2(final), earned: round2(final - amount), effectiveApy: round2(effectiveApy) };
}

/* Bitcoin units. Exact in satoshi (integers), so 0.1 + 0.2 style float
   drift can never show up in the sat line. */
export const SATS_PER_BTC = 100_000_000;

export function btcConvert({ value, unit }) {
  let sats;
  if (unit === "btc") sats = Math.round(value * SATS_PER_BTC);
  else if (unit === "mbtc") sats = Math.round(value * 100_000);
  else if (unit === "ubtc") sats = Math.round(value * 100);
  else sats = Math.round(value);
  return {
    sats,
    btc: sats / SATS_PER_BTC,
    mbtc: sats / 100_000,
    ubtc: sats / 100,
  };
}
