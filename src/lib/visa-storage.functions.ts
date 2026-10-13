import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { getAdminSessionConfig, type AdminSession } from "./admin-session.server";

export type VisaDocument = {
  name: string;
  type: string;
  dataUrl: string;
};

export type VisaRecord = {
  id: string;
  tracker: string;
  name: string;
  passport: string;
  nationality: string;
  gender: string;
  visaType: string;
  occupation: string;
  birthDate: string;
  issueDate: string;
  expiryDate: string;
  photo?: string | null;
  documents?: VisaDocument[];
};

type Row = {
  id: string;
  tracker: string;
  name: string;
  passport: string;
  nationality: string;
  gender: string;
  visa_type: string;
  occupation: string;
  birth_date: string;
  issue_date: string;
  expiry_date: string;
  photo: string | null;
  documents: unknown;
};

function fromRow(r: Row): VisaRecord {
  const docs = Array.isArray(r.documents) ? (r.documents as VisaDocument[]) : [];
  return {
    id: r.id,
    tracker: r.tracker,
    name: r.name,
    passport: r.passport,
    nationality: r.nationality,
    gender: r.gender,
    visaType: r.visa_type,
    occupation: r.occupation,
    birthDate: r.birth_date,
    issueDate: r.issue_date,
    expiryDate: r.expiry_date,
    photo: r.photo,
    documents: docs,
  };
}


async function requireAdmin() {
  const session = await useSession<AdminSession>(getAdminSessionConfig());
  if (!session.data.authed) {
    throw new Error("Unauthorized: admin sign-in required.");
  }
}

function toRowInsert(r: VisaRecord) {
  return {
    id: r.id,
    tracker: r.tracker,
    name: r.name,
    passport: r.passport,
    nationality: r.nationality,
    gender: r.gender,
    visa_type: r.visaType,
    occupation: r.occupation,
    birth_date: r.birthDate,
    issue_date: r.issueDate,
    expiry_date: r.expiryDate,
    photo: r.photo ?? null,
    documents: (r.documents ?? []) as unknown as import("@/integrations/supabase/types").Json,
  };
}

// Lightweight columns only — photo/documents are large base64 blobs and must
// never be included in list queries (they time out the edge worker: HTTP 522).
const LIST_COLUMNS =
  "id,tracker,name,passport,nationality,gender,visa_type,occupation,birth_date,issue_date,expiry_date";

function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    !key.startsWith("sb_secret_local") &&
    !key.startsWith("sb_publishable_local")
  );
}

export type DbHealthStatus = {
  supabaseConfigured: boolean;
  supabaseConnected: boolean;
  supabaseUrl: string | null;
  tableExists: boolean;
  rowCount: number;
  error: string | null;
  mode: "cloud" | "local_only";
};

// Check health of cloud database
export const getDbHealthFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<DbHealthStatus> => {
    const configured = isSupabaseConfigured();
    if (!configured) {
      return {
        supabaseConfigured: false,
        supabaseConnected: false,
        supabaseUrl: null,
        tableExists: false,
        rowCount: 0,
        error: "Supabase environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY) are missing in Vercel settings.",
        mode: "local_only",
      };
    }

    const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    const maskedUrl = rawUrl ? rawUrl.replace(/https?:\/\//, "").slice(0, 15) + "..." : null;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { count, error } = await supabaseAdmin
        .from("visas")
        .select("id", { count: "exact", head: true });

      if (error) {
        const isMissingTable =
          error.code === "42P01" ||
          error.message?.includes("does not exist") ||
          error.message?.includes("relation \"public.visas\"");

        return {
          supabaseConfigured: true,
          supabaseConnected: !isMissingTable,
          supabaseUrl: maskedUrl,
          tableExists: !isMissingTable,
          rowCount: 0,
          error: isMissingTable
            ? "The 'visas' table does not exist in your Supabase database. Please run SUPABASE_SETUP.sql in Supabase SQL Editor."
            : error.message,
          mode: isMissingTable ? "local_only" : "cloud",
        };
      }

      return {
        supabaseConfigured: true,
        supabaseConnected: true,
        supabaseUrl: maskedUrl,
        tableExists: true,
        rowCount: count ?? 0,
        error: null,
        mode: "cloud",
      };
    } catch (err) {
      return {
        supabaseConfigured: true,
        supabaseConnected: false,
        supabaseUrl: maskedUrl,
        tableExists: false,
        rowCount: 0,
        error: err instanceof Error ? err.message : String(err),
        mode: "local_only",
      };
    }
  },
);

// PUBLIC: look up a visa by its OTP id, tracker, or passport.
export const lookupVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const raw = (data.id ?? "").trim();
    if (!raw) return { record: null as VisaRecord | null };

    const clean = raw.toUpperCase();
    const cleanDigits = raw.replace(/\D/g, "").slice(0, 6);

    // 1. Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // A. Direct primary key / OTP lookup (6 digits)
        if (cleanDigits.length === 6) {
          const { data: rowById, error: errId } = await supabaseAdmin
            .from("visas")
            .select("*")
            .eq("id", cleanDigits)
            .maybeSingle();

          if (!errId && rowById) {
            return { record: fromRow(rowById as unknown as Row) };
          }

          // B. Direct tracker lookup (6 digits)
          const { data: rowByTracker, error: errTrk } = await supabaseAdmin
            .from("visas")
            .select("*")
            .eq("tracker", cleanDigits)
            .maybeSingle();

          if (!errTrk && rowByTracker) {
            return { record: fromRow(rowByTracker as unknown as Row) };
          }
        }

        // C. Exact ID match (if ID is alphanumeric or other format)
        const { data: rowExact, error: errExact } = await supabaseAdmin
          .from("visas")
          .select("*")
          .eq("id", clean)
          .maybeSingle();

        if (!errExact && rowExact) {
          return { record: fromRow(rowExact as unknown as Row) };
        }

        // D. Passport match (case-insensitive)
        const { data: rowPassport, error: errPass } = await supabaseAdmin
          .from("visas")
          .select("*")
          .ilike("passport", clean)
          .maybeSingle();

        if (!errPass && rowPassport) {
          return { record: fromRow(rowPassport as unknown as Row) };
        }

        // E. Tracker match (case-insensitive)
        const { data: rowTrackerRaw, error: errTrkRaw } = await supabaseAdmin
          .from("visas")
          .select("*")
          .ilike("tracker", clean)
          .maybeSingle();

        if (!errTrkRaw && rowTrackerRaw) {
          return { record: fromRow(rowTrackerRaw as unknown as Row) };
        }
      } catch (sbErr) {
        console.warn("[visa-storage] Supabase lookup error, falling back to SQLite:", sbErr);
      }
    }

    // 2. Fallback to SQLite
    try {
      const { sqliteLookupVisa } = await import("./sqlite-storage.server");
      const record = sqliteLookupVisa(raw);
      return { record };
    } catch {
      return { record: null };
    }
  });

// ADMIN-ONLY: list metadata only (no photo/documents blobs).
export const listVisasFn = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();

  // 1. Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("visas")
        .select(LIST_COLUMNS)
        .order("created_at", { ascending: false })
        .limit(500);

      if (!error && data && data.length > 0) {
        return { records: data.map((r) => fromRow(r as unknown as Row)) };
      }
    } catch (sbErr) {
      console.warn("[visa-storage] Supabase list error, falling back to SQLite:", sbErr);
    }
  }

  // 2. Fallback to SQLite
  try {
    const { sqliteListVisas } = await import("./sqlite-storage.server");
    return { records: sqliteListVisas() };
  } catch {
    return { records: [] };
  }
});

export const saveVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { record: VisaRecord }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();

    let sqliteSaved = false;
    let cloudSaved = false;
    let cloudError: string | null = null;

    // 1. Always save to local SQLite first
    try {
      const { sqliteSaveVisa } = await import("./sqlite-storage.server");
      sqliteSaveVisa(data.record);
      sqliteSaved = true;
    } catch (sqlErr) {
      console.warn("[visa-storage] SQLite save error:", sqlErr);
    }

    // 2. Save/upsert to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("visas")
          .upsert(toRowInsert(data.record), { onConflict: "id" });
        if (error) {
          console.error("[visa-storage] Supabase upsert error:", error.message);
          cloudError = error.message;
        } else {
          cloudSaved = true;
        }
      } catch (sbErr) {
        console.error("[visa-storage] Supabase upsert exception:", sbErr);
        cloudError = sbErr instanceof Error ? sbErr.message : String(sbErr);
      }
    } else {
      cloudError = "Supabase cloud database is NOT configured in Vercel environment variables.";
    }

    return { ok: true as const, sqliteSaved, cloudSaved, cloudError };
  });

export const syncBulkVisasFn = createServerFn({ method: "POST" })
  .inputValidator((data: { records: VisaRecord[] }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!data.records || !data.records.length) {
      return { synced: 0, error: null };
    }

    if (!isSupabaseConfigured()) {
      return {
        synced: 0,
        error: "Supabase cloud database is NOT configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const rows = data.records.map((r) => toRowInsert(r));
      const { error } = await supabaseAdmin
        .from("visas")
        .upsert(rows, { onConflict: "id" });

      if (error) {
        return { synced: 0, error: error.message };
      }
      return { synced: data.records.length, error: null };
    } catch (e) {
      return { synced: 0, error: e instanceof Error ? e.message : String(e) };
    }
  });

export const updateVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; record: VisaRecord }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();

    try {
      const { sqliteSaveVisa } = await import("./sqlite-storage.server");
      sqliteSaveVisa(data.record);
    } catch {}

    if (isSupabaseConfigured()) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { id: _omit, photo, documents, ...update } = toRowInsert(data.record);
        void _omit;
        const patch = {
          ...update,
          ...(data.record.photo !== undefined ? { photo } : {}),
          ...(data.record.documents !== undefined ? { documents } : {}),
        };
        await supabaseAdmin.from("visas").update(patch).eq("id", data.id);
      } catch (sbErr) {
        console.warn("[visa-storage] Supabase update error:", sbErr);
      }
    }

    return { ok: true as const };
  });

export const deleteVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();

    try {
      const { sqliteDeleteVisa } = await import("./sqlite-storage.server");
      sqliteDeleteVisa(data.id);
    } catch {}

    if (isSupabaseConfigured()) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("visas").delete().eq("id", data.id);
      } catch (sbErr) {
        console.warn("[visa-storage] Supabase delete error:", sbErr);
      }
    }

    return { ok: true as const };
  });

export const clearAllVisasFn = createServerFn({ method: "POST" })
  .handler(async () => {
    await requireAdmin();

    try {
      const { sqliteClearAllVisas } = await import("./sqlite-storage.server");
      sqliteClearAllVisas();
    } catch {}

    if (isSupabaseConfigured()) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("visas").delete().neq("id", "___NONE___");
      } catch (sbErr) {
        console.warn("[visa-storage] Supabase clear error:", sbErr);
      }
    }

    return { ok: true as const };
  });
