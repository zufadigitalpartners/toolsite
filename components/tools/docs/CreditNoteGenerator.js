"use client";

import DocForm from "./DocForm";

/* The formal way to un-invoice: a credit note references the original
   invoice and states what is being returned or corrected. Bookkeepers
   need this document, not a deleted invoice. */

const config = {
  title: "CREDIT NOTE",
  numberPrefix: "CN",
  numberLabel: "Credit note number",
  toLabel: "Issued to",
  metaFields: [
    { key: "date", label: "Date", type: "date", defaultToday: true },
    { key: "invoice", label: "Against invoice no.", type: "text" },
  ],
  prices: true,
  tax: true,
  shipping: false,
  discount: false,
  itemPlaceholder: "Returned: 2 of 5 lamps, damaged in transit",
  notesLabel: "Reason",
  notesPlaceholder: "Goods returned damaged. Amount will be refunded within 7 days.",
  totalLabel: "Credit total",
  footer: "This credit note reduces the amount owed against the referenced invoice.",
};

export default function CreditNoteGenerator() {
  return <DocForm config={config} />;
}
