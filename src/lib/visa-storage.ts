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

export type SaveVisaResult = {
  ok: boolean;
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

function matchesQuery(record: VisaRecord, rawQuery: string): boolean {
  const clean = rawQuery.trim();
  if (!clean) return false;
  const upper = clean.toUpperCase();
  const digits = clean.replace(/\D/g, "");

  const idUpper = (record.id ?? "").trim().toUpperCase();
  const trackerUpper = (record.tracker ?? "").trim().toUpperCase();
  const passportUpper = (record.passport ?? "").trim().toUpperCase();

  if (idUpper && idUpper === upper) return true;
  if (trackerUpper && trackerUpper === upper) return true;
  if (passportUpper && passportUpper === upper) return true;

  if (digits.length === 6) {
    if (idUpper === digits || trackerUpper === digits) return true;
  }

  return false;
}

export async function saveVisa(record: VisaRecord): Promise<SaveVisaResult> {
  const normalized: VisaRecord = {
    ...record,
    id: (record.id ?? "").trim(),
    tracker: (record.tracker ?? "").trim(),
    passport: (record.passport ?? "").trim(),
  };

  // 1. Immediately persist to browser localStorage
  const existing = readLocalVisas().filter((v) => v.id !== normalized.id);
  existing.unshift(normalized);
  writeLocalVisas(existing);

  // 2. Persist to server SQLite database
  try {
    const res = await saveVisaFn({ data: { record: normalized } });
    return {
      ok: true,
      sqliteSaved: !!res?.sqliteSaved,
    };
  } catch (err) {
    console.warn("[visa-storage] Server save warning, retained in local persistence:", err);
    return {
      ok: true,
      sqliteSaved: false,
    };
  }
}

export async function findVisa(query: string): Promise<VisaRecord | null> {
  const clean = (query ?? "").trim();
  if (!clean) return null;

  // 1. Check local cache first for immediate responsiveness and to preserve full blobs
  const localList = readLocalVisas();
  const localMatch = localList.find((v) => matchesQuery(v, clean)) ?? null;

  // 2. Query server SQLite database
  try {
    const res = await lookupVisaFn({ data: { id: clean } });
    if (res?.record) {
      const mergedRecord: VisaRecord = {
        ...localMatch,
        ...res.record,
        photo: res.record.photo || localMatch?.photo || null,
        documents:
          res.record.documents && res.record.documents.length > 0
            ? res.record.documents
            : (localMatch?.documents ?? []),
      };
      const existing = localList.filter((v) => v.id !== mergedRecord.id);
      existing.unshift(mergedRecord);
      writeLocalVisas(existing);
      return mergedRecord;
    }
  } catch (err) {
    console.warn("[visa-storage] Server lookup error, using local cache:", err);
  }

  // 3. If found in local storage but server didn't have it, sync it back to server
  if (localMatch) {
    saveVisaFn({ data: { record: localMatch } }).catch(() => {});
    return localMatch;
  }

  return null;
}

export async function listVisas(): Promise<VisaRecord[]> {
  let serverRecords: VisaRecord[] = [];
  let serverOk = false;

  try {
    const res = await listVisasFn();
    serverRecords = res.records || [];
    serverOk = true;
  } catch (err) {
    console.warn("[visa-storage] Server list error, loading from local cache:", err);
  }

  const localRecords = readLocalVisas();
  const localMap = new Map<string, VisaRecord>();
  for (const r of localRecords) {
    if (r && r.id) localMap.set(r.id, r);
  }

  const mergedMap = new Map<string, VisaRecord>();

  // Add server records, preserving any richer local fields (photo/documents)
  for (const r of serverRecords) {
    if (r && r.id) {
      const loc = localMap.get(r.id);
      mergedMap.set(r.id, {
        ...loc,
        ...r,
        photo: r.photo || loc?.photo || null,
        documents:
          r.documents && r.documents.length > 0
            ? r.documents
            : (loc?.documents ?? []),
      });
    }
  }

  // Add any local records not yet on server and push them to server
  for (const r of localRecords) {
    if (r && r.id && !mergedMap.has(r.id)) {
      mergedMap.set(r.id, r);
      if (serverOk) {
        saveVisaFn({ data: { record: r } }).catch(() => {});
      }
    }
  }

  const merged = Array.from(mergedMap.values());
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
 */
export function encodeVisaToShareString(record: VisaRecord): string {
  try {
    const { photo: _omitPhoto, documents: _omitDocs, ...lightRecord } = record;
    void _omitPhoto;
    void _omitDocs;
    const json = JSON.stringify(lightRecord);
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
