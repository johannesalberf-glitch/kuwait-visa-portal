import { createServerFn } from "@tanstack/react-start";

export type VisaDocument = {
  name: string;
  type: string;
  dataUrl: string;
};

export type VisaRecord = {
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
  photo?: string | null;
  documents?: VisaDocument[];
};

// PUBLIC: look up a visa by its OTP code (id), tracking code (tracker), or passport number.
export const lookupVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const raw = (data.id ?? "").trim();
    if (!raw) return { record: null as VisaRecord | null };

    try {
      const { sqliteLookupVisa } = await import("./sqlite-storage.server");
      const record = sqliteLookupVisa(raw);
      return { record };
    } catch (err) {
      console.error("[visa-storage] SQLite lookup error:", err);
      return { record: null };
    }
  });

// List all saved visa records from local SQLite database.
export const listVisasFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const { sqliteListVisas } = await import("./sqlite-storage.server");
    return { records: sqliteListVisas() };
  } catch (err) {
    console.error("[visa-storage] SQLite list error:", err);
    return { records: [] };
  }
});

// Save a newly generated or updated visa record to SQLite.
export const saveVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { record: VisaRecord }) => data)
  .handler(async ({ data }) => {
    let sqliteSaved = false;
    try {
      const { sqliteSaveVisa } = await import("./sqlite-storage.server");
      sqliteSaveVisa(data.record);
      sqliteSaved = true;
    } catch (sqlErr) {
      console.warn("[visa-storage] SQLite save error:", sqlErr);
    }

    return { ok: true as const, sqliteSaved };
  });

// Update an existing visa record in SQLite.
export const updateVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; record: VisaRecord }) => data)
  .handler(async ({ data }) => {
    try {
      const { sqliteSaveVisa, sqliteDeleteVisa } = await import("./sqlite-storage.server");
      if (data.id !== data.record.id) {
        sqliteDeleteVisa(data.id);
      }
      sqliteSaveVisa(data.record);
    } catch (err) {
      console.warn("[visa-storage] SQLite update error:", err);
    }

    return { ok: true as const };
  });

// Delete a visa record by ID.
export const deleteVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { sqliteDeleteVisa } = await import("./sqlite-storage.server");
      sqliteDeleteVisa(data.id);
    } catch (err) {
      console.warn("[visa-storage] SQLite delete error:", err);
    }

    return { ok: true as const };
  });

// Clear all visa records.
export const clearAllVisasFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const { sqliteClearAllVisas } = await import("./sqlite-storage.server");
    sqliteClearAllVisas();
  } catch (err) {
    console.warn("[visa-storage] SQLite clear error:", err);
  }

  return { ok: true as const };
});
