"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { stakingRewards } from "@/lib/crypto";

/* APR compounded forward. The APR/APY distinction is the whole tool:
   platforms advertise whichever is bigger. */

const config = {
  intro: "Enter the amount in coins or currency; the result comes back in the same unit. APR is the advertised simple rate.",
  fields: [
    { key: "amount", label: "Amount staked", default: "1000", min: 0 },
    { key: "apr", label: "APR %", default: "8", min: 0, max: 1000 },
    { key: "years", label: "Years", default: "2", min: 0.1, max: 50 },
    {
      key: "comp", label: "Rewards compound", type: "select", default: "365",
      options: [
        { value: "0", label: "Never, simple interest" },
        { value: "12", label: "Monthly" },
        { value: "52", label: "Weekly" },
        { value: "365", label: "Daily" },
      ],
    },
  ],
  compute(v) {
    const r = stakingRewards({
      amount: num(v.amount), aprPct: num(v.apr), years: num(v.years),
      compoundsPerYear: Number(v.comp) || 0,
    });
    if (!r) return null;
    return {
      stats: [
        { num: fmt(r.final, 2), label: "Final amount" },
        { num: "+" + fmt(r.earned, 2), label: "Rewards earned" },
        { num: fmt(r.effectiveApy, 2) + "%", label: "Effective APY" },
      ],
      notes: [
        `At ${v.apr}% APR compounded ${v.comp === "0" ? "never" : v.comp === "12" ? "monthly" : v.comp === "52" ? "weekly" : "daily"}, the effective APY is ${fmt(r.effectiveApy, 2)}%. When a platform advertises APY but pays you APR, this gap is what they are borrowing for the banner.`,
        "The result is in the unit you entered: stake 1000 coins and it is coins, meaning the currency value still depends on the coin's price. Rewards in a falling asset can be a smaller number than you staked. Arithmetic only, on this device, and not investment advice.",
      ],
    };
  },
};

export default function StakingRewards() {
  return <CalcTool config={config} />;
}
