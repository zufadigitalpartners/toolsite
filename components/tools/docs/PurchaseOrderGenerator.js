"use client";

import DocForm from "./DocForm";

/* The buyer's document: what you are ordering, from whom, at what agreed
   price. The PO number is the thread every later invoice hangs on. */

const config = {
  title: "PURCHASE ORDER",
  numberPrefix: "PO",
  numberLabel: "PO number",
  fromLabel: "Ordered by",
  toLabel: "Supplier",
  metaFields: [
    { key: "date", label: "Order date", type: "date", defaultToday: true },
    { key: "delivery", label: "Deliver by", type: "date" },
  ],
  prices: true,
  tax: true,
  shipping: true,
  discount: false,
  itemPlaceholder: "Kraft boxes, 20x20x10 cm",
  notesLabel: "Delivery and terms",
  notesPlaceholder: "Deliver to the address above. Invoice must reference this PO number.",
  totalLabel: "Order total",
  footer: "Please confirm acceptance of this order and quote the PO number on all paperwork.",
};

export default function PurchaseOrderGenerator() {
  return <DocForm config={config} />;
}
