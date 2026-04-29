"use client";

// Subnav is no longer needed — sidebar handles all invoice section navigation.
// This file is kept as a no-op export so existing imports don't break.

export type InvoiceNavCounts = {
  companies: number;
  retailers: number;
  invoices: number;
  payments: number;
  creditNotes: number;
};

export function InvoiceSubNav(_props: { counts: InvoiceNavCounts }) {
  return null;
}
