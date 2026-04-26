/** 10-digit Indian mobile without +91 */
export function normalizePhone10(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^91/, "").slice(0, 10);
}

export function isValidPhone10(p: string): boolean {
  return /^\d{10}$/.test(p);
}

export function normalizeGst15(raw: string): string {
  return raw.replace(/\s/g, "").toUpperCase().slice(0, 15);
}

export function isValidGst15(g: string): boolean {
  return /^[0-9A-Z]{15}$/.test(g);
}

export function isValidPan(p: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(p.replace(/\s/g, "").toUpperCase());
}
