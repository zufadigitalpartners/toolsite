"use client";

import DocForm from "@/components/tools/docs/DocForm";

/* The invoice now rides the shared document engine, which is what added
   the logo, per-line discounts and a shipping row without this file
   growing. Your saved details carry over: the form reads the old storage
   key as a fallback, so nobody retypes anything. */

const config = {
  title: "INVOICE",
  numberPrefix: "INV",
  numberLabel: "Invoice number",
  toLabel: "Bill to",
  metaFields: [
    { key: "date", label: "Date", type: "date", defaultToday: true },
    { key: "due", label: "Due date", type: "date" },
  ],
  prices: true,
  tax: true,
  shipping: true,
  discount: true,
  itemPlaceholder: "Homepage redesign",
  notesLabel: "Notes on the invoice",
  notesPlaceholder: "Payment within 14 days to IBAN ...",
  totalLabel: "Total due",
  footer: "Thank you for your business.",
};

export default function InvoiceGenerator() {
  return <DocForm config={config} />;
}
