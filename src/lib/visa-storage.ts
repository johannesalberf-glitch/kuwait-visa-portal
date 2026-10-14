import {
  saveVisaOnServer,
  listVisasOnServer,
  findVisaOnServer,
  updateVisaOnServer,
  deleteVisaOnServer,
  clearAllVisasOnServer,
} from "./visa-storage.functions";
import {
  cloudSaveVisa,
  cloudFindVisa,
  cloudListVisas,
  cloudDeleteVisa,
  cloudClearAllVisas,
} from "./cloud-kv";

export interface UploadedDoc {
  name: string;
  type: string;
  dataUrl: string;
}

export interface VisaRecord {
  id: string; // 6-digit OTP code
  tracker: string; // 6-digit Tracking code
  name: string;
  nameAr?: string;
  passport: string;
  nationality: string;
  nationalityAr?: string;
  gender: string;
  visaType: string;
  visaTypeAr?: string;
  occupation: string;
  occupationAr?: string;
  birthDate: string;
  issueDate: string;
  expiryDate: string;
  photo: string | null;
  documents?: UploadedDoc[];
}

export const SAMPLE_VISAS: VisaRecord[] = [
  {
    id: "582914",
    tracker: "847192",
    name: "AHMED MOHAMED HASSAN",
    nameAr: "أحمد محمد حسن",
    passport: "A12948573",
    nationality: "EGYPT",
    nationalityAr: "مصر",
    gender: "M",
    visaType: "WORK VISA - ARTICLE 18",
    visaTypeAr: "تأشيرة عمل - مادة 18",
    occupation: "Civil Engineer",
    occupationAr: "مهندس مدني",
    birthDate: "1990-05-14",
    issueDate: "2025-02-01",
    expiryDate: "2025-05-01",
    photo: null,
    documents: [],
  },
  {
    id: "847192",
    tracker: "582914",
    name: "FATIMA AL-ZAHRA",
    nameAr: "فاطمة الزهراء",
    passport: "N99384712",
    nationality: "JORDAN",
    nationalityAr: "الأردن",
    gender: "F",
    visaType: "FAMILY VISIT VISA",
    visaTypeAr: "تأشيرة زيارة عائلية",
    occupation: "Physician",
    occupationAr: "طبيبة",
    birthDate: "1994-11-22",
    issueDate: "2025-02-10",
    expiryDate: "2025-05-10",
    photo: null,
    documents: [],
  },
];

// ============================================================================
// PORTABLE SHARE LINK ENCODER / DECODER
// ============================================================================

export function encodeVisaToShareString(record: VisaRecord): string {
  try {
    const payload = {
      i: record.id,
      t: record.tracker,
      n: record.name,
      na: record.nameAr || "",
      p: record.passport,
      nat: record.nationality,
      nata: record.nationalityAr || "",
      g: record.gender,
      vt: record.visaType,
      vta: record.visaTypeAr || "",
      o: record.occupation,
      oa: record.occupationAr || "",
      b: record.birthDate,
      is: record.issueDate,
      ex: record.expiryDate,
    };
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let idx = 0; idx < bytes.length; idx++) {
      binary += String.fromCharCode(bytes[idx]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

export function decodeVisaFromShareString(encoded: string): VisaRecord | null {
  try {
    const clean = encoded.trim().replace(/-/g, "+").replace(/_/g, "/");
    const padded = clean + "===".slice((clean.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let idx = 0; idx < binary.length; idx++) {
      bytes[idx] = binary.charCodeAt(idx);
    }
    const json = new TextDecoder().decode(bytes);
    const d = JSON.parse(json);
    if (!d || !d.i || !d.n) return null;
    return {
      id: String(d.i),
      tracker: String(d.t || d.i),
      name: String(d.n),
      nameAr: d.na || undefined,
      passport: String(d.p || ""),
      nationality: String(d.nat || ""),
      nationalityAr: d.nata || undefined,
      gender: String(d.g || "M"),
      visaType: String(d.vt || ""),
      visaTypeAr: d.vta || undefined,
      occupation: String(d.o || ""),
      occupationAr: d.oa || undefined,
      birthDate: String(d.b || ""),
      issueDate: String(d.is || ""),
      expiryDate: String(d.ex || ""),
      photo: null,
      documents: [],
    };
  } catch {
    return null;
  }
}

const LOCAL_STORAGE_KEY = "kw_visa_portal_records_v1";

export function readLocalVisas(): VisaRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VisaRecord[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalVisas(records: VisaRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore quota errors
  }
}

function cleanKey(s: string): string {
  return (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function matchVisaRecord(v: VisaRecord, q: string): boolean {
  const raw = q.trim();
  const clean = cleanKey(raw);
  if (!raw) return false;
  if (v.id === raw || v.tracker === raw) return true;
  if (
    v.id.toUpperCase() === raw.toUpperCase() ||
    v.tracker.toUpperCase() === raw.toUpperCase() ||
    v.passport.toUpperCase() === raw.toUpperCase()
  ) {
    return true;
  }
  if (clean.length >= 4) {
    if (
      cleanKey(v.id) === clean ||
      cleanKey(v.tracker) === clean ||
      cleanKey(v.passport) === clean
    ) {
      return true;
    }
  }
  return false;
}

export async function saveVisa(record: VisaRecord): Promise<{ ok: true }> {
  const normalized: VisaRecord = {
    ...record,
    id: record.id.trim(),
    tracker: (record.tracker || record.id).trim(),
    passport: record.passport.trim().toUpperCase(),
  };

  // Save locally in browser
  const existing = readLocalVisas().filter((v) => v.id !== normalized.id);
  existing.unshift(normalized);
  writeLocalVisas(existing);

  // Save on server (SQLite + Cross-Device Cloud Registry)
  try {
    await saveVisaOnServer({ data: normalized });
  } catch {
    await cloudSaveVisa(normalized);
  }
  return { ok: true };
}

export async function listVisas(): Promise<VisaRecord[]> {
  let serverRecords: VisaRecord[] = [];
  try {
    serverRecords = await listVisasOnServer();
  } catch {
    try {
      serverRecords = await cloudListVisas();
    } catch {
      serverRecords = [];
    }
  }

  const localRecords = readLocalVisas();
  const byId = new Map<string, VisaRecord>();

  for (const r of serverRecords) {
    byId.set(r.id, r);
  }
  for (const r of localRecords) {
    if (!byId.has(r.id)) {
      byId.set(r.id, r);
    }
  }

  const merged = Array.from(byId.values());
  if (merged.length > 0) {
    writeLocalVisas(merged);
    return merged;
  }

  return SAMPLE_VISAS;
}

export async function findVisa(query: string): Promise<VisaRecord | null> {
  const q = query.trim();
  if (!q) return null;

  // 1. Check server (SQLite + Cross-Device Cloud Registry)
  try {
    const serverHit = await findVisaOnServer({ data: { query: q } });
    if (serverHit) {
      const local = readLocalVisas().filter((v) => v.id !== serverHit.id);
      local.unshift(serverHit);
      writeLocalVisas(local);
      return serverHit;
    }
  } catch {
    // Fall through to direct cloud & local lookup
  }

  // 2. Direct cloud lookup fallback
  try {
    const cloudHit = await cloudFindVisa(q);
    if (cloudHit) {
      const local = readLocalVisas().filter((v) => v.id !== cloudHit.id);
      local.unshift(cloudHit);
      writeLocalVisas(local);
      return cloudHit;
    }
  } catch {
    // Fall through to local lookup
  }

  // 3. Check local browser storage
  const localRecords = readLocalVisas();
  const localHit = localRecords.find((v) => matchVisaRecord(v, q));
  if (localHit) {
    return localHit;
  }

  // 4. Check built-in sample visas
  const sampleHit = SAMPLE_VISAS.find((v) => matchVisaRecord(v, q));
  return sampleHit ?? null;
}

export async function updateVisa(
  id: string,
  patch: Partial<Omit<VisaRecord, "id">>,
): Promise<void> {
  const local = readLocalVisas();
  const idx = local.findIndex((v) => v.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...patch, id };
    writeLocalVisas(local);
  }
  try {
    await updateVisaOnServer({ data: { id, patch } });
  } catch {
    if (idx !== -1) {
      await cloudSaveVisa(local[idx]);
    }
  }
}

export async function deleteVisa(id: string): Promise<void> {
  const local = readLocalVisas().filter((v) => v.id !== id);
  writeLocalVisas(local);
  try {
    await deleteVisaOnServer({ data: { id } });
  } catch {
    await cloudDeleteVisa(id);
  }
}

export async function clearAllVisas(): Promise<void> {
  writeLocalVisas([]);
  try {
    await clearAllVisasOnServer();
  } catch {
    await cloudClearAllVisas();
  }
}
