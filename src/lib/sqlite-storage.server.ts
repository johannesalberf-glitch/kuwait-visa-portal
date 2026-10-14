import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type { VisaRecord, VisaDocument } from "./visa-storage.functions";

let dbInstance: DatabaseSync | null = null;
const memoryFallbackMap = new Map<string, VisaRecord>();

function resolveDbPath(): string {
  if (process.env.SQLITE_DB_PATH) {
    return process.env.SQLITE_DB_PATH;
  }

  try {
    const cwdDb = path.join(process.cwd(), "visa_portal.db");
    if (fs.existsSync(cwdDb)) return cwdDb;
    fs.appendFileSync(cwdDb, "");
    return cwdDb;
  } catch {
    // Read-only filesystem in serverless environments
  }

  try {
    return path.join(os.tmpdir(), "visa_portal.db");
  } catch {
    return ":memory:";
  }
}

export function getSqliteDb(): DatabaseSync | null {
  if (!dbInstance) {
    try {
      const dbPath = resolveDbPath();
      dbInstance = new DatabaseSync(dbPath);
    } catch (err) {
      console.warn("[SQLite] Failed to open database file, falling back to in-memory DB:", err);
      try {
        dbInstance = new DatabaseSync(":memory:");
      } catch (memErr) {
        console.error("[SQLite] Failed to initialize in-memory SQLite:", memErr);
        return null;
      }
    }

    try {
      dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS visas (
          id TEXT PRIMARY KEY,
          tracker TEXT,
          name TEXT,
          name_ar TEXT,
          passport TEXT,
          nationality TEXT,
          nationality_ar TEXT,
          visa_type TEXT,
          visa_type_ar TEXT,
          occupation TEXT,
          occupation_ar TEXT,
          gender TEXT,
          birth_date TEXT,
          issue_date TEXT,
          expiry_date TEXT,
          photo TEXT,
          documents TEXT,
          status TEXT DEFAULT 'APPROVED',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch {
      // Table already exists
    }

    const extraColumns = [
      "ALTER TABLE visas ADD COLUMN documents TEXT DEFAULT '[]'",
      "ALTER TABLE visas ADD COLUMN name_ar TEXT DEFAULT ''",
      "ALTER TABLE visas ADD COLUMN nationality_ar TEXT DEFAULT ''",
      "ALTER TABLE visas ADD COLUMN visa_type_ar TEXT DEFAULT ''",
      "ALTER TABLE visas ADD COLUMN occupation_ar TEXT DEFAULT ''",
    ];
    for (const sql of extraColumns) {
      try {
        dbInstance.exec(sql);
      } catch {
        // Column already exists
      }
    }
  }
  return dbInstance;
}

function rowToVisaRecord(row: Record<string, unknown>): VisaRecord {
  let docs: VisaDocument[] = [];
  if (typeof row.documents === "string") {
    try {
      const parsed = JSON.parse(row.documents);
      if (Array.isArray(parsed)) docs = parsed;
    } catch {
      docs = [];
    }
  } else if (Array.isArray(row.documents)) {
    docs = row.documents as VisaDocument[];
  }

  return {
    id: String(row.id ?? ""),
    tracker: String(row.tracker ?? ""),
    name: String(row.name ?? ""),
    nameAr: row.name_ar ? String(row.name_ar) : undefined,
    passport: String(row.passport ?? ""),
    nationality: String(row.nationality ?? ""),
    nationalityAr: row.nationality_ar ? String(row.nationality_ar) : undefined,
    gender: String(row.gender ?? "M"),
    visaType: String(row.visa_type ?? "B - Private Sector Work Visa"),
    visaTypeAr: row.visa_type_ar ? String(row.visa_type_ar) : undefined,
    occupation: String(row.occupation ?? ""),
    occupationAr: row.occupation_ar ? String(row.occupation_ar) : undefined,
    birthDate: String(row.birth_date ?? ""),
    issueDate: String(row.issue_date ?? ""),
    expiryDate: String(row.expiry_date ?? ""),
    photo: row.photo ? String(row.photo) : null,
    documents: docs,
  };
}

export function sqliteLookupVisa(query: string): VisaRecord | null {
  const clean = (query ?? "").trim();
  if (!clean) return null;
  const upper = clean.toUpperCase();
  const digits = clean.replace(/\D/g, "");

  // 1. Check SQLite
  try {
    const db = getSqliteDb();
    if (db) {
      let row: Record<string, unknown> | undefined;
      if (digits.length === 6) {
        row = db
          .prepare(
            `SELECT * FROM visas
             WHERE UPPER(TRIM(id)) = ?
                OR UPPER(TRIM(tracker)) = ?
                OR UPPER(TRIM(passport)) = ?
                OR TRIM(id) = ?
                OR TRIM(tracker) = ?
             LIMIT 1`
          )
          .get(upper, upper, upper, digits, digits) as Record<string, unknown> | undefined;
      } else {
        row = db
          .prepare(
            `SELECT * FROM visas
             WHERE UPPER(TRIM(id)) = ?
                OR UPPER(TRIM(tracker)) = ?
                OR UPPER(TRIM(passport)) = ?
             LIMIT 1`
          )
          .get(upper, upper, upper) as Record<string, unknown> | undefined;
      }

      if (row) {
        return rowToVisaRecord(row);
      }
    }
  } catch (err) {
    console.error("[SQLite] Lookup error:", err);
  }

  // 2. Check in-memory fallback map
  for (const r of memoryFallbackMap.values()) {
    if (
      r.id.trim().toUpperCase() === upper ||
      r.tracker.trim().toUpperCase() === upper ||
      r.passport.trim().toUpperCase() === upper ||
      (digits.length === 6 && (r.id.trim() === digits || r.tracker.trim() === digits))
    ) {
      return r;
    }
  }

  return null;
}

export function sqliteListVisas(): VisaRecord[] {
  try {
    const db = getSqliteDb();
    if (db) {
      const rows = db
        .prepare("SELECT * FROM visas ORDER BY created_at DESC LIMIT 500")
        .all() as Record<string, unknown>[];

      if (rows.length > 0) {
        return rows.map(rowToVisaRecord);
      }
    }
  } catch (err) {
    console.error("[SQLite] List error:", err);
  }

  return Array.from(memoryFallbackMap.values());
}

export function sqliteSaveVisa(r: VisaRecord): void {
  const cleanRecord: VisaRecord = {
    ...r,
    id: (r.id ?? "").trim(),
    tracker: (r.tracker ?? "").trim(),
    passport: (r.passport ?? "").trim(),
  };
  memoryFallbackMap.set(cleanRecord.id, cleanRecord);

  try {
    const db = getSqliteDb();
    if (!db) return;
    db.prepare(`
      INSERT OR REPLACE INTO visas (
        id, tracker, name, name_ar, passport, nationality, nationality_ar,
        visa_type, visa_type_ar, occupation, occupation_ar, gender,
        birth_date, issue_date, expiry_date, photo, documents
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      cleanRecord.id,
      cleanRecord.tracker,
      cleanRecord.name,
      cleanRecord.nameAr ?? "",
      cleanRecord.passport,
      cleanRecord.nationality,
      cleanRecord.nationalityAr ?? "",
      cleanRecord.visaType,
      cleanRecord.visaTypeAr ?? "",
      cleanRecord.occupation,
      cleanRecord.occupationAr ?? "",
      cleanRecord.gender,
      cleanRecord.birthDate,
      cleanRecord.issueDate,
      cleanRecord.expiryDate,
      cleanRecord.photo ?? null,
      cleanRecord.documents ? JSON.stringify(cleanRecord.documents) : "[]",
    );
  } catch (err) {
    console.error("[SQLite] Save error:", err);
  }
}

export function sqliteDeleteVisa(id: string): void {
  memoryFallbackMap.delete(id);
  try {
    const db = getSqliteDb();
    if (!db) return;
    db.prepare("DELETE FROM visas WHERE id = ? OR tracker = ?").run(id, id);
  } catch (err) {
    console.error("[SQLite] Delete error:", err);
  }
}

export function sqliteClearAllVisas(): void {
  memoryFallbackMap.clear();
  try {
    const db = getSqliteDb();
    if (!db) return;
    db.prepare("DELETE FROM visas").run();
  } catch (err) {
    console.error("[SQLite] Clear error:", err);
  }
}
