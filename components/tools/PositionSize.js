"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";

/* The risk arithmetic that keeps trading accounts alive: risk a fixed
   fraction of the account, derive the size from the stop distance. */

const config = {
  intro: "Enter your account, the percent of it you are willing to lose on this one trade, and your entry and stop prices.",
  fields: [
    { key: "account", label: "Account size", default: "10000", min: 0 },
    { key: "riskPct", label: "Risk per trade %", default: "1", min: 0.05, max: 100 },
    { key: "entry", label: "Entry price", default: "", min: 0, placeholder: "100" },
    { key: "stop", label: "Stop-loss price", default: "", min: 0, placeholder: "95" },
    { key: "target", label: "Target price, optional", default: "", min: 0 },
  ],
  compute(v) {
    const account = num(v.account), riskPct = num(v.riskPct);
    const entry = num(v.entry), stop = num(v.stop), target = num(v.target);
    if (!(account > 0) || !(entry > 0) || !(stop > 0)) return null;
    if (stop === entry) return { error: "The stop cannot equal the entry: the risk per unit would be zero and the size infinite." };
    const riskMoney = account * (riskPct / 100);
    const perUnit = Math.abs(entry - stop);
    const units = riskMoney / perUnit;
    const positionValue = units * entry;
    const short = stop > entry;
    const stats = [
      { num: fmt(units, units < 10 ? 4 : 2), label: "Position size, units" },
      { num: fmt(positionValue, 2), label: "Position value" },
      { num: fmt(riskMoney, 2), label: "Money at risk" },
    ];
    const notes = [
      `This is a ${short ? "short" : "long"} setup risking ${riskPct}% of the account. If the stop is hit, the loss is ${fmt(riskMoney, 2)}, no more, provided the stop executes. Position value ${positionValue > account ? "exceeds the account, which means leverage of " + fmt(positionValue / account, 2) + "x is required" : "fits inside the account without leverage"}.`,
    ];
    if (target > 0) {
      const reward = Math.abs(target - entry) * units;
      const rr = reward / riskMoney;
      stats.push({ num: fmt(rr, 2) + " : 1", label: "Reward to risk" });
      notes.push(`At the target, the win is ${fmt(reward, 2)}, a ${fmt(rr, 2)}:1 reward for the risk. Below roughly 1.5:1, a strategy must win most of its trades just to stand still; the ratio is the honest filter for taking the setup at all.`);
    }
    notes.push("Works identically for stocks, crypto and forex, because it is arithmetic, not advice. Nothing you type is stored or sent.");
    return { stats, notes };
  },
};

export default function PositionSize() {
  return <CalcTool config={config} />;
}
