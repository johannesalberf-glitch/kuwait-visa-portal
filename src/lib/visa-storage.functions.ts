import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  sqliteListVisas,
  sqliteFindVisa,
  sqliteUpsertVisa,
  sqliteUpdateVisa,
  sqliteDeleteVisa,
  sqliteClearAllVisas,
} from "./sqlite-storage.server";
import {
  cloudSaveVisa,
  cloudFindVisa,
  cloudListVisas,
  cloudDeleteVisa,
  cloudClearAllVisas,
} from "./cloud-kv";
import type { VisaRecord } from "./visa-storage";

const DocSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataUrl: z.string(),
});

const VisaRecordSchema = z.object({
  id: z.string().min(1).max(32),
  tracker: z.string().min(1).max(32),
  name: z.string().min(1).max(200),
  nameAr: z.string().max(200).optional(),
  passport: z.string().min(1).max(50),
  nationality: z.string().min(1).max(100),
  nationalityAr: z.string().max(100).optional(),
  gender: z.string().min(1).max(10),
  visaType: z.string().min(1).max(200),
  visaTypeAr: z.string().max(200).optional(),
  occupation: z.string().min(1).max(200),
  occupationAr: z.string().max(200).optional(),
  birthDate: z.string().min(1).max(40),
  issueDate: z.string().min(1).max(40),
  expiryDate: z.string().min(1).max(40),
  photo: z.string().nullable(),
  documents: z.array(DocSchema).optional(),
});

export const saveVisaOnServer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => VisaRecordSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const normalized: VisaRecord = {
      ...data,
      id: data.id.trim(),
      tracker: (data.tracker || data.id).trim(),
      passport: data.passport.trim().toUpperCase(),
    };
    sqliteUpsertVisa(normalized);
    await cloudSaveVisa(normalized);
    return { ok: true };
  });

export const listVisasOnServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<VisaRecord[]> => {
    const localRows = sqliteListVisas();
    const cloudRows = await cloudListVisas();

    const byId = new Map<string, VisaRecord>();
    for (const r of cloudRows) {
      byId.set(r.id, r);
      try {
        sqliteUpsertVisa(r);
      } catch {
        // Ignore
      }
    }
    for (const r of localRows) {
      if (!byId.has(r.id)) {
        byId.set(r.id, r);
      } else {
        const existing = byId.get(r.id)!;
        if (!existing.photo && r.photo) {
          byId.set(r.id, { ...existing, photo: r.photo, documents: r.documents });
        }
      }
    }
    return Array.from(byId.values());
  },
);

const FindInputSchema = z.object({ query: z.string().min(1).max(100) });

export const findVisaOnServer = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => FindInputSchema.parse(data))
  .handler(async ({ data }): Promise<VisaRecord | null> => {
    const q = data.query.trim();
    if (!q) return null;

    // 1. Check local SQLite first
    const localHit = sqliteFindVisa(q);

    // 2. Check cross-instance cloud registry if not in local SQLite
    if (!localHit) {
      const cloudHit = await cloudFindVisa(q);
      if (cloudHit) {
        try {
          sqliteUpsertVisa(cloudHit);
        } catch {
          // Ignore
        }
        return cloudHit;
      }
      return null;
    }

    return localHit;
  });

const UpdateInputSchema = z.object({
  id: z.string().min(1).max(32),
  patch: VisaRecordSchema.partial().omit({ id: true }),
});

export const updateVisaOnServer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => UpdateInputSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const existing = sqliteFindVisa(data.id) ?? (await cloudFindVisa(data.id));
    sqliteUpdateVisa(data.id, data.patch);
    const updated = sqliteFindVisa(data.id) ?? (existing ? { ...existing, ...data.patch, id: data.id } : null);
    if (updated) {
      await cloudSaveVisa(updated);
    }
    return { ok: true };
  });

const DeleteInputSchema = z.object({ id: z.string().min(1).max(32) });

export const deleteVisaOnServer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DeleteInputSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    sqliteDeleteVisa(data.id);
    await cloudDeleteVisa(data.id);
    return { ok: true };
  });

export const clearAllVisasOnServer = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: true }> => {
    sqliteClearAllVisas();
    await cloudClearAllVisas();
    return { ok: true };
  },
);
