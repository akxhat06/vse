import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AppStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

export function emptyStore(): AppStore {
  return {
    companies: [],
    retailers: [],
    invoices: [],
    payments: [],
    creditNotes: [],
  };
}

export async function loadStore(): Promise<AppStore> {
  try {
    const raw = await readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as AppStore;
    return {
      companies: parsed.companies ?? [],
      retailers: parsed.retailers ?? [],
      invoices: parsed.invoices ?? [],
      payments: parsed.payments ?? [],
      creditNotes: parsed.creditNotes ?? [],
    };
  } catch {
    return emptyStore();
  }
}

export async function saveStore(store: AppStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function updateStore(
  updater: (draft: AppStore) => void,
): Promise<AppStore> {
  const store = await loadStore();
  updater(store);
  await saveStore(store);
  return store;
}
