import {
  lookupVisaFn,
  listVisasFn,
  saveVisaFn,
  syncBulkVisasFn,
  getDbHealthFn,
  updateVisaFn,
  deleteVisaFn,
  clearAllVisasFn,
  type VisaRecord,
  type VisaDocument,
  type DbHealthStatus,
} from "./visa-storage.functions";

export type { VisaRecord, VisaDocument, DbHealthStatus };

export type SaveVisaResult = {
  ok: boolean;
  cloudSaved: boolean;
  cloudError: string | null;
  sqliteSaved: boolean;
};

const LOCAL_STORAGE_KEY = "kuwait_visa_portal_records_v1";

export function readLocalVisas(): VisaRecord[] {
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

export function writeLocalVisas(records: VisaRecord[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn("[visa-storage] Failed writing local storage cache:", e);
  }
}

export async function checkDbHealth(): Promise<DbHealthStatus> {
  try {
    return await getDbHealthFn();
  } catch (e) {
    return {
      supabaseConfigured: false,
      supabaseConnected: false,
      supabaseUrl: null,
      tableExists: false,
      rowCount: 0,
      error: e instanceof Error ? e.message : "Health check failed",
      mode: "local_only",
    };
  }
}

export async function syncAllLocalVisasToCloud(): Promise<{ synced: number; error: string | null }> {
  const local = readLocalVisas();
  if (!local.length) return { synced: 0, error: null };
  try {
    return await syncBulkVisasFn({ data: { records: local } });
  } catch (e) {
    return { synced: 0, error: e instanceof Error ? e.message : "Bulk sync failed" };
  }
}

export async function saveVisa(record: VisaRecord): Promise<SaveVisaResult> {
  // 1. Immediately persist to browser localStorage so records are NEVER lost when app/tab is closed
  const existing = readLocalVisas().filter((v) => v.id !== record.id);
  existing.unshift(record);
  writeLocalVisas(existing);

  // 2. Persist to server / cloud database
  try {
    const res = await saveVisaFn({ data: { record } });
    return {
      ok: true,
      cloudSaved: !!res?.cloudSaved,
      cloudError: res?.cloudError ?? null,
      sqliteSaved: !!res?.sqliteSaved,
    };
  } catch (err) {
    console.warn("[visa-storage] Server save warning, retained in local persistence:", err);
    return {
      ok: true,
      cloudSaved: false,
      cloudError: err instanceof Error ? err.message : "Server save error",
      sqliteSaved: false,
    };
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

/**
 * Encode a visa record into a URL-safe string for instant direct-link verification.
 * Does not require any database or serverless state!
 */
export function encodeVisaToShareString(record: VisaRecord): string {
  try {
    const json = JSON.stringify(record);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (e) {
    console.error("[visa-storage] Failed encoding visa share link:", e);
    return "";
  }
}

/**
 * Decode a visa record from a URL-safe share string.
 */
export function decodeVisaFromShareString(str: string): VisaRecord | null {
  try {
    let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) {
      b64 += "=";
    }
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object" && parsed.id && parsed.name) {
      return parsed as VisaRecord;
    }
    return null;
  } catch (e) {
    console.warn("[visa-storage] Failed decoding visa share link:", e);
    return null;
  }
}
