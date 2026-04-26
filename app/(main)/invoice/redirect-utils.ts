const MAX_REDIRECT_DEPTH = 6;

function isAllowedPathname(pathname: string): boolean {
  if (!pathname || pathname.includes("//")) return false;
  return (
    pathname === "/home" ||
    pathname === "/invoice" ||
    pathname.startsWith("/invoice/")
  );
}

/**
 * Validates a post-save redirect path from a hidden form field or query param.
 * Only same-origin relative paths under /home or /invoice are allowed.
 * A single `returnTo` query param is preserved when the nested value also validates.
 */
function parseRedirect(raw: string, depth: number): string | null {
  if (depth > MAX_REDIRECT_DEPTH) return null;

  const noHash = raw.split("#")[0] ?? "";
  if (
    !noHash.startsWith("/") ||
    noHash.startsWith("//") ||
    noHash.includes("\\")
  )
    return null;

  const qIdx = noHash.indexOf("?");
  const pathname = qIdx === -1 ? noHash : noHash.slice(0, qIdx);

  if (!isAllowedPathname(pathname)) return null;

  if (qIdx === -1) return pathname;

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(noHash.slice(qIdx + 1));
  } catch {
    return pathname;
  }

  const keys = [...new Set(params.keys())];
  if (keys.length !== 1 || keys[0] !== "returnTo") return pathname;

  const values = params.getAll("returnTo");
  if (values.length !== 1) return pathname;

  let inner = values[0]!;
  try {
    inner = decodeURIComponent(inner);
  } catch {
    return pathname;
  }

  const nested = parseRedirect(inner, depth + 1);
  if (nested === null) return pathname;
  return `${pathname}?returnTo=${encodeURIComponent(nested)}`;
}

export function safePostSaveRedirect(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (raw == null || typeof raw !== "string") return fallback;
  return parseRedirect(raw.trim(), 0) ?? fallback;
}

/** Pathname plus optional validated `returnTo` (for “resume here” links like company → back to new invoice). */
export function resumePathWithOptionalReturn(
  pathname: string,
  rawReturnTo: string | null | undefined,
): string {
  const rt = rawReturnTo?.trim();
  if (!rt) return pathname;
  return (
    parseRedirect(`${pathname}?returnTo=${encodeURIComponent(rt)}`, 0) ??
    pathname
  );
}
