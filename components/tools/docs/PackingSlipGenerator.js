"use client";

import DocForm from "./DocForm";

/* Goes in the box: what is inside, no prices. The no-prices part is the
   entire reason it is a separate document from the invoice, and why gift
   orders need one. */

const config = {
  title: "PACKING SLIP",
  numberPrefix: "PS",
  numberLabel: "Slip number",
  fromLabel: "Shipped by",
  toLabel: "Ship to",
  metaFields: [
    { key: "date", label: "Ship date", type: "date", defaultToday: true },
    { key: "order", label: "Order number", type: "text" },
  ],
  prices: false,
  tax: false,
  shipping: false,
  discount: false,
  itemPlaceholder: "Ceramic mug, blue glaze",
  notesLabel: "Notes",
  notesPlaceholder: "Fragile: glass items wrapped individually.",
  footer: "Check the contents against this slip. Questions? Contact the sender above.",
};

export default function PackingSlipGenerator() {
  return <DocForm config={config} />;
}
