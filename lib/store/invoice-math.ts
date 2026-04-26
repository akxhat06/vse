export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type InvoiceCalcInput = {
  baseAmount: number;
  gstPercent: number;
  cashDiscountPercent: number;
  cashDiscountAmountInput: number | null | undefined;
  commissionPercent: number;
};

export function computeInvoiceAmounts(input: InvoiceCalcInput) {
  const base = Math.max(0, input.baseAmount);
  let cd = 0;
  const amtIn = input.cashDiscountAmountInput;
  if (amtIn != null && amtIn > 0) {
    cd = round2(Math.min(amtIn, base));
  } else if (input.cashDiscountPercent > 0) {
    cd = round2((base * input.cashDiscountPercent) / 100);
    cd = round2(Math.min(cd, base));
  }

  const taxableAmount = round2(base - cd);
  const gstAmount = round2((taxableAmount * (input.gstPercent || 0)) / 100);
  const invoiceAmount = round2(base - cd + gstAmount);
  const commissionAmount = round2((base * (input.commissionPercent || 0)) / 100);

  return {
    cashDiscountApplied: cd,
    taxableAmount,
    gstAmount,
    invoiceAmount,
    commissionAmount,
  };
}
