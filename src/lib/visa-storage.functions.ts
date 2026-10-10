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
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && key && key !== "sb_secret_local_dev_key" && !key.startsWith("sb_secret_local"));
}

// PUBLIC: look up a visa by its OTP id or passport.
export const lookupVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const id = data.id.trim();
    if (!id) return { record: null as VisaRecord | null };

    if (!isSupabaseConfigured()) {
      const { sqliteLookupVisa } = await import("./sqlite-storage.server");
      const record = sqliteLookupVisa(id);
      return { record };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("visas")
      .select("*")
      .eq("id", id.slice(0, 6))
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { record: row ? fromRow(row as unknown as Row) : null };
  });

// ADMIN-ONLY: list metadata only (no photo/documents blobs).
export const listVisasFn = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();

  if (!isSupabaseConfigured()) {
    const { sqliteListVisas } = await import("./sqlite-storage.server");
    return { records: sqliteListVisas() };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("visas")
    .select(LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return { records: (data ?? []).map((r) => fromRow(r as unknown as Row)) };
});

export const saveVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { record: VisaRecord }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();

    if (!isSupabaseConfigured()) {
      const { sqliteSaveVisa } = await import("./sqlite-storage.server");
      sqliteSaveVisa(data.record);
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("visas").insert(toRowInsert(data.record));
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const updateVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; record: VisaRecord }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();

    if (!isSupabaseConfigured()) {
      const { sqliteSaveVisa } = await import("./sqlite-storage.server");
      sqliteSaveVisa(data.record);
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id: _omit, photo, documents, ...update } = toRowInsert(data.record);
    void _omit;
    const patch = {
      ...update,
      ...(data.record.photo !== undefined ? { photo } : {}),
      ...(data.record.documents !== undefined ? { documents } : {}),
    };
    const { error } = await supabaseAdmin.from("visas").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteVisaFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();

    if (!isSupabaseConfigured()) {
      const { sqliteDeleteVisa } = await import("./sqlite-storage.server");
      sqliteDeleteVisa(data.id);
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("visas").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const clearAllVisasFn = createServerFn({ method: "POST" })
  .handler(async () => {
    await requireAdmin();

    if (!isSupabaseConfigured()) {
      const { sqliteClearAllVisas } = await import("./sqlite-storage.server");
      sqliteClearAllVisas();
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("visas").delete().neq("id", "");
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
