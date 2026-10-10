import {
  lookupVisaFn,
  listVisasFn,
  saveVisaFn,
  updateVisaFn,
  deleteVisaFn,
  clearAllVisasFn,
  type VisaRecord,
  type VisaDocument,
} from "./visa-storage.functions";

export type { VisaRecord, VisaDocument };

const LOCAL_STORAGE_KEY = "kuwait_visa_portal_records_v1";

function readLocalVisas(): VisaRecord[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("[visa-storage] Failed reading local storage cache:", e);
    return [];
  }
}

function writeLocalVisas(records: VisaRecord[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn("[visa-storage] Failed writing local storage cache:", e);
  }
}

export async function saveVisa(record: VisaRecord): Promise<void> {
  // 1. Immediately persist to browser localStorage so records are NEVER lost when app/tab is closed
  const existing = readLocalVisas().filter((v) => v.id !== record.id);
  existing.unshift(record);
  writeLocalVisas(existing);

  // 2. Persist to server / cloud database
  try {
    await saveVisaFn({ data: { record } });
  } catch (err) {
    console.warn("[visa-storage] Server save warning, retained in local persistence:", err);
  }
}

export async function findVisa(id: string): Promise<VisaRecord | null> {
  const clean = id.trim().toUpperCase();

  // 1. Query server first
  try {
    const res = await lookupVisaFn({ data: { id: clean } });
    if (res?.record) {
      // Sync found record into local cache
      const existing = readLocalVisas().filter((v) => v.id !== res.record!.id);
      existing.unshift(res.record);
      writeLocalVisas(existing);
      return res.record;
    }
  } catch (err) {
    console.warn("[visa-storage] Server lookup error, falling back to local cache:", err);
  }

  // 2. Fallback to local storage (e.g. if server container reset)
  const localList = readLocalVisas();
  const match = localList.find((v) => {
    return (
      (v.id && v.id.toUpperCase() === clean) ||
      (v.passport && v.passport.toUpperCase() === clean) ||
      (v.tracker && v.tracker.toUpperCase() === clean)
    );
  });

  return match ?? null;
}

export async function listVisas(): Promise<VisaRecord[]> {
  let serverRecords: VisaRecord[] = [];
  let serverOk = false;

  // 1. Fetch from server
  try {
    const res = await listVisasFn();
    serverRecords = res.records || [];
    serverOk = true;
  } catch (err) {
    console.warn("[visa-storage] Server list error, loading from local cache:", err);
  }

  // 2. Merge with browser localStorage so records are preserved across app close / serverless restart
  const localRecords = readLocalVisas();
  const map = new Map<string, VisaRecord>();

  // Add server records
  for (const r of serverRecords) {
    if (r && r.id) map.set(r.id, r);
  }

  // Add any local records that the server may have lost
  for (const r of localRecords) {
    if (r && r.id && !map.has(r.id)) {
      map.set(r.id, r);
      // Background sync: push back to server to restore database
      if (serverOk) {
        saveVisaFn({ data: { record: r } }).catch(() => {});
      }
    }
  }

  const merged = Array.from(map.values());
  writeLocalVisas(merged);
  return merged;
}

export async function updateVisa(id: string, record: VisaRecord): Promise<void> {
  const existing = readLocalVisas().map((v) => (v.id === id ? record : v));
  writeLocalVisas(existing);

  try {
    await updateVisaFn({ data: { id, record } });
  } catch (err) {
    console.warn("[visa-storage] Server update error, retained in local cache:", err);
  }
}

export async function deleteVisa(id: string): Promise<void> {
  const filtered = readLocalVisas().filter((v) => v.id !== id);
  writeLocalVisas(filtered);

  try {
    await deleteVisaFn({ data: { id } });
  } catch (err) {
    console.warn("[visa-storage] Server delete error:", err);
  }
}

export async function clearAllVisas(): Promise<void> {
  writeLocalVisas([]);

  try {
    await clearAllVisasFn();
  } catch (err) {
    console.warn("[visa-storage] Server clear error:", err);
  }
}
