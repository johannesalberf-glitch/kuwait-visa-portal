import type { VisaRecord } from "./visa-storage";

const IMMANUEL_APP_KEY = "winze2x0";
const IMMANUEL_BASE = `https://keyvalue.immanuel.co/api/KeyVal`;
const RESTFUL_OBJECT_ID = "ff808181a09d98f701a13994a0e25c14";
const RESTFUL_URL = `https://api.restful-api.dev/objects/${RESTFUL_OBJECT_ID}`;

interface CloudIndexEntry {
  id: string;
  tracker: string;
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
  dpasteId?: string;
  bytebinKey?: string;
  updatedAt: number;
}

interface CloudRegistryData {
  records: Record<string, CloudIndexEntry>;
}

function cleanAlphaNum(s: string): string {
  return (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = 6000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function uploadToDpaste(record: VisaRecord): Promise<string> {
  try {
    const res = await fetchWithTimeout(
      "https://dpaste.com/api/v2/",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          content: JSON.stringify(record),
          syntax: "json",
          expiry_days: "365",
        }),
      },
      7000,
    );
    if (!res.ok) return "";
    const text = (await res.text()).trim();
    const match = text.match(/dpaste\.com\/([A-Z0-9]+)/i);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

async function uploadToBytebin(payload: unknown): Promise<string> {
  try {
    const res = await fetchWithTimeout(
      "https://bytebin.lucko.me/post",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      7000,
    );
    if (!res.ok) return "";
    const data = (await res.json()) as { key?: string };
    return data?.key || "";
  } catch {
    return "";
  }
}

async function fetchFromPointer(
  dpasteId?: string,
  bytebinKey?: string,
): Promise<VisaRecord | null> {
  if (dpasteId && dpasteId !== "none") {
    try {
      const res = await fetchWithTimeout(`https://dpaste.com/${dpasteId}.txt`, undefined, 5000);
      if (res.ok) {
        const data = (await res.json()) as VisaRecord;
        if (data && data.id) return data;
      }
    } catch {
      // Fall through to bytebin
    }
  }
  if (bytebinKey && bytebinKey !== "none") {
    try {
      const res = await fetchWithTimeout(`https://bytebin.lucko.me/${bytebinKey}`, undefined, 5000);
      if (res.ok) {
        const data = (await res.json()) as VisaRecord;
        if (data && data.id) return data;
      }
    } catch {
      // Ignore
    }
  }
  return null;
}

async function setImmanuelKey(key: string, value: string): Promise<void> {
  if (!key || !value) return;
  try {
    const safeKey = encodeURIComponent(key.slice(0, 40));
    const safeVal = encodeURIComponent(value.slice(0, 120));
    await fetchWithTimeout(
      `${IMMANUEL_BASE}/UpdateValue/${IMMANUEL_APP_KEY}/${safeKey}/${safeVal}`,
      { method: "POST" },
      4500,
    );
  } catch {
    // Ignore
  }
}

async function getImmanuelKey(key: string): Promise<string> {
  if (!key) return "";
  try {
    const safeKey = encodeURIComponent(key.slice(0, 40));
    const res = await fetchWithTimeout(
      `${IMMANUEL_BASE}/GetValue/${IMMANUEL_APP_KEY}/${safeKey}`,
      undefined,
      4500,
    );
    if (!res.ok) return "";
    const text = await res.text();
    return text.replace(/^"|"$/g, "").trim();
  } catch {
    return "";
  }
}

async function readRestfulRegistry(): Promise<CloudRegistryData> {
  try {
    const res = await fetchWithTimeout(RESTFUL_URL, undefined, 5000);
    if (res.ok) {
      const obj = (await res.json()) as { data?: CloudRegistryData };
      if (obj?.data?.records && typeof obj.data.records === "object") {
        return { records: { ...obj.data.records } };
      }
    }
  } catch {
    // Fallback to Immanuel index pointer
  }

  try {
    const idxPtr = await getImmanuelKey("idx_registry");
    if (idxPtr) {
      const [dpasteId, bytebinKey] = idxPtr.split("~");
      if (bytebinKey && bytebinKey !== "none") {
        const r = await fetchWithTimeout(`https://bytebin.lucko.me/${bytebinKey}`, undefined, 4500);
        if (r.ok) {
          const parsed = (await r.json()) as CloudRegistryData;
          if (parsed?.records) return parsed;
        }
      }
      if (dpasteId && dpasteId !== "none") {
        const r = await fetchWithTimeout(`https://dpaste.com/${dpasteId}.txt`, undefined, 4500);
        if (r.ok) {
          const parsed = (await r.json()) as CloudRegistryData;
          if (parsed?.records) return parsed;
        }
      }
    }
  } catch {
    // Ignore
  }

  return { records: {} };
}

async function writeRestfulRegistry(registry: CloudRegistryData): Promise<void> {
  await Promise.allSettled([
    fetchWithTimeout(
      RESTFUL_URL,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "kuwait_mols_evisa_registry_v1",
          data: registry,
        }),
      },
      5500,
    ),
    (async () => {
      const bKey = await uploadToBytebin(registry);
      if (bKey) {
        await setImmanuelKey("idx_registry", `none~${bKey}`);
      }
    })(),
  ]);
}

function entryToRecord(entry: CloudIndexEntry): VisaRecord {
  return {
    id: entry.id,
    tracker: entry.tracker || entry.id,
    name: entry.name,
    nameAr: entry.nameAr,
    passport: entry.passport,
    nationality: entry.nationality,
    nationalityAr: entry.nationalityAr,
    gender: entry.gender,
    visaType: entry.visaType,
    visaTypeAr: entry.visaTypeAr,
    occupation: entry.occupation,
    occupationAr: entry.occupationAr,
    birthDate: entry.birthDate,
    issueDate: entry.issueDate,
    expiryDate: entry.expiryDate,
    photo: null,
    documents: [],
  };
}

export async function cloudSaveVisa(record: VisaRecord): Promise<void> {
  const normalized: VisaRecord = {
    ...record,
    id: (record.id || "").trim(),
    tracker: (record.tracker || record.id || "").trim(),
    passport: (record.passport || "").trim().toUpperCase(),
  };

  const [dpasteId, bytebinKey, registry] = await Promise.all([
    uploadToDpaste(normalized),
    uploadToBytebin(normalized),
    readRestfulRegistry(),
  ]);

  const ptr = `${dpasteId || "none"}~${bytebinKey || "none"}`;

  const entry: CloudIndexEntry = {
    id: normalized.id,
    tracker: normalized.tracker,
    name: normalized.name,
    nameAr: normalized.nameAr,
    passport: normalized.passport,
    nationality: normalized.nationality,
    nationalityAr: normalized.nationalityAr,
    gender: normalized.gender,
    visaType: normalized.visaType,
    visaTypeAr: normalized.visaTypeAr,
    occupation: normalized.occupation,
    occupationAr: normalized.occupationAr,
    birthDate: normalized.birthDate,
    issueDate: normalized.issueDate,
    expiryDate: normalized.expiryDate,
    dpasteId: dpasteId || undefined,
    bytebinKey: bytebinKey || undefined,
    updatedAt: Date.now(),
  };

  registry.records[normalized.id] = entry;

  const cleanPassport = cleanAlphaNum(normalized.passport);
  await Promise.allSettled([
    setImmanuelKey(`otp_${normalized.id}`, ptr),
    setImmanuelKey(`trk_${normalized.tracker}`, ptr),
    cleanPassport ? setImmanuelKey(`psp_${cleanPassport}`, ptr) : Promise.resolve(),
    writeRestfulRegistry(registry),
  ]);
}

export async function cloudFindVisa(query: string): Promise<VisaRecord | null> {
  const raw = (query || "").trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  const clean = cleanAlphaNum(raw);

  // 1. Check direct pointer keys and full registry in parallel
  const [otpPtr, trkPtr, pspPtr, registry] = await Promise.all([
    digits.length === 6 ? getImmanuelKey(`otp_${digits}`) : getImmanuelKey(`otp_${raw}`),
    digits.length === 6 ? getImmanuelKey(`trk_${digits}`) : getImmanuelKey(`trk_${raw}`),
    clean ? getImmanuelKey(`psp_${clean}`) : Promise.resolve(""),
    readRestfulRegistry(),
  ]);

  // Check if registry has a matching record by OTP (id), Tracking code (tracker), or Passport
  const entries = Object.values(registry.records || {});
  const matchedEntry = entries.find(
    (e) =>
      e.id === raw ||
      e.tracker === raw ||
      (digits.length === 6 && (e.id === digits || e.tracker === digits)) ||
      (clean.length >= 4 &&
        (cleanAlphaNum(e.passport) === clean ||
          cleanAlphaNum(e.id) === clean ||
          cleanAlphaNum(e.tracker) === clean)),
  );

  // Try pointer from matchedEntry first, then direct Immanuel pointers
  const pointersToTry: Array<[string | undefined, string | undefined]> = [];
  if (matchedEntry?.dpasteId || matchedEntry?.bytebinKey) {
    pointersToTry.push([matchedEntry.dpasteId, matchedEntry.bytebinKey]);
  }
  for (const p of [otpPtr, trkPtr, pspPtr]) {
    if (p && p.includes("~") && p !== "DELETED~DELETED") {
      const [dId, bKey] = p.split("~");
      pointersToTry.push([dId, bKey]);
    }
  }

  for (const [dId, bKey] of pointersToTry) {
    const fullRecord = await fetchFromPointer(dId, bKey);
    if (fullRecord) {
      return fullRecord;
    }
  }

  if (matchedEntry) {
    return entryToRecord(matchedEntry);
  }

  return null;
}

export async function cloudListVisas(): Promise<VisaRecord[]> {
  const registry = await readRestfulRegistry();
  const entries = Object.values(registry.records || {}).sort(
    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
  );
  if (entries.length === 0) return [];

  const hydrated = await Promise.all(
    entries.map(async (entry) => {
      const full = await fetchFromPointer(entry.dpasteId, entry.bytebinKey);
      return full ?? entryToRecord(entry);
    }),
  );
  return hydrated;
}

export async function cloudDeleteVisa(id: string): Promise<void> {
  const cleanId = (id || "").trim();
  if (!cleanId) return;
  const registry = await readRestfulRegistry();
  const existing = registry.records[cleanId];
  delete registry.records[cleanId];

  await Promise.allSettled([
    setImmanuelKey(`otp_${cleanId}`, "DELETED~DELETED"),
    existing?.tracker
      ? setImmanuelKey(`trk_${existing.tracker}`, "DELETED~DELETED")
      : Promise.resolve(),
    existing?.passport
      ? setImmanuelKey(`psp_${cleanAlphaNum(existing.passport)}`, "DELETED~DELETED")
      : Promise.resolve(),
    writeRestfulRegistry(registry),
  ]);
}

export async function cloudClearAllVisas(): Promise<void> {
  await writeRestfulRegistry({ records: {} });
}
