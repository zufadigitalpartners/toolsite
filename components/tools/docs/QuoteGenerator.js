"use client";

import DocForm from "./DocForm";

/* A quote is an invoice that has not happened yet: same table, different
   promises. The validity date is the field that stops six-month-old
   prices coming back to haunt you. */

const config = {
  title: "QUOTE",
  numberPrefix: "Q",
  numberLabel: "Quote number",
  toLabel: "Prepared for",
  metaFields: [
    { key: "date", label: "Date", type: "date", defaultToday: true },
    { key: "valid", label: "Valid until", type: "date" },
  ],
  prices: true,
  tax: true,
  shipping: false,
  discount: true,
  itemPlaceholder: "Homepage redesign, up to 5 pages",
  notesLabel: "Terms",
  notesPlaceholder: "50% on acceptance, balance on delivery. Two revision rounds included.",
  totalLabel: "Quoted total",
  footer: "This quote is an offer, not an invoice. Prices are firm until the validity date.",
};

export default function QuoteGenerator() {
  return <DocForm config={config} />;
}
