"use client";

import DocForm from "./DocForm";

/* Proof that money changed hands: what was paid, for what, by which
   method. The document people ask for after paying cash. */

const config = {
  title: "RECEIPT",
  numberPrefix: "R",
  numberLabel: "Receipt number",
  toLabel: "Received from",
  metaFields: [
    { key: "date", label: "Payment date", type: "date", defaultToday: true },
    { key: "method", label: "Payment method", type: "text" },
  ],
  prices: true,
  tax: true,
  shipping: false,
  discount: false,
  itemPlaceholder: "Deposit for October wedding photography",
  notesLabel: "Notes",
  notesPlaceholder: "Remaining balance of 500 due on the day.",
  totalLabel: "Amount received",
  footer: "Thank you. This receipt confirms payment of the amount shown.",
};

export default function ReceiptMaker() {
  return <DocForm config={config} />;
}
