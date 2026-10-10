import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type { VisaRecord } from "./visa-storage.functions";

let dbInstance: DatabaseSync | null = null;

function resolveDbPath(): string {
  if (process.env.SQLITE_DB_PATH) {
    return process.env.SQLITE_DB_PATH;
  }

  // 1. Try local project directory (permanent for local dev and self-hosted)
  try {
    const cwdDb = path.join(process.cwd(), "visa_portal.db");
    if (fs.existsSync(cwdDb)) return cwdDb;
    fs.appendFileSync(cwdDb, "");
    return cwdDb;
  } catch {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }

  const localDb = "/home/deck/kuwaitvisa.moi.gov.kw/backend/visa_portal.db";
  try {
    if (fs.existsSync(localDb)) return localDb;
    const localDir = path.dirname(localDb);
    if (fs.existsSync(localDir)) return localDb;
  } catch {
    // ignore
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

    try {
      dbInstance.exec("ALTER TABLE visas ADD COLUMN documents TEXT DEFAULT '[]'");
    } catch {
      // Column already exists
    }
  }
  return dbInstance;
}

export function sqliteLookupVisa(id: string): VisaRecord | null {
  try {
    const db = getSqliteDb();
    if (!db) return null;
    const clean = id.trim();
    const row = db
      .prepare("SELECT * FROM visas WHERE UPPER(id) = ? OR UPPER(passport) = ? OR UPPER(tracker) = ? LIMIT 1")
      .get(clean.toUpperCase()) as Record<string, unknown> | undefined;

    if (!row) return null;

    let docs: unknown[] = [];
    if (typeof row.documents === "string") {
      try {
        docs = JSON.parse(row.documents);
      } catch {
        docs = [];
      }
    }

    return {
      id: String(row.id ?? ""),
      tracker: String(row.tracker ?? ""),
      name: String(row.name ?? ""),
      passport: String(row.passport ?? ""),
      nationality: String(row.nationality ?? ""),
      gender: String(row.gender ?? "M"),
      visaType: String(row.visa_type ?? "B - Private Sector Work Visa"),
      occupation: String(row.occupation ?? ""),
      birthDate: String(row.birth_date ?? ""),
      issueDate: String(row.issue_date ?? ""),
      expiryDate: String(row.expiry_date ?? ""),
      photo: row.photo ? String(row.photo) : null,
      documents: docs as any,
    };
  } catch (err) {
    console.error("[SQLite] Lookup error:", err);
    return null;
  }
}

export function sqliteListVisas(): VisaRecord[] {
  try {
    const db = getSqliteDb();
    if (!db) return [];
    const rows = db
      .prepare(
        "SELECT id, tracker, name, passport, nationality, gender, visa_type, occupation, birth_date, issue_date, expiry_date FROM visas ORDER BY created_at DESC LIMIT 500",
      )
      .all() as Record<string, unknown>[];

    return rows.map((row) => ({
      id: String(row.id ?? ""),
      tracker: String(row.tracker ?? ""),
      name: String(row.name ?? ""),
      passport: String(row.passport ?? ""),
      nationality: String(row.nationality ?? ""),
      gender: String(row.gender ?? "M"),
      visaType: String(row.visa_type ?? "B - Private Sector Work Visa"),
      occupation: String(row.occupation ?? ""),
      birthDate: String(row.birth_date ?? ""),
      issueDate: String(row.issue_date ?? ""),
      expiryDate: String(row.expiry_date ?? ""),
    }));
  } catch (err) {
    console.error("[SQLite] List error:", err);
    return [];
  }
}

export function sqliteSaveVisa(r: VisaRecord): void {
  try {
    const db = getSqliteDb();
    if (!db) return;
    try {
      db.prepare(`
        INSERT OR REPLACE INTO visas (id, tracker, name, passport, nationality, gender, visa_type, occupation, birth_date, issue_date, expiry_date, photo, documents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        r.id,
        r.tracker,
        r.name,
        r.passport,
        r.nationality,
        r.gender,
        r.visaType,
        r.occupation,
        r.birthDate,
        r.issueDate,
        r.expiryDate,
        r.photo ?? null,
        r.documents ? JSON.stringify(r.documents) : "[]",
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("no column named documents")) {
        try {
          db.exec("ALTER TABLE visas ADD COLUMN documents TEXT DEFAULT '[]'");
          sqliteSaveVisa(r);
          return;
        } catch {
          db.prepare(`
            INSERT OR REPLACE INTO visas (id, tracker, name, passport, nationality, gender, visa_type, occupation, birth_date, issue_date, expiry_date, photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            r.id,
            r.tracker,
            r.name,
            r.passport,
            r.nationality,
            r.gender,
            r.visaType,
            r.occupation,
            r.birthDate,
            r.issueDate,
            r.expiryDate,
            r.photo ?? null,
          );
          return;
        }
      }
      throw err;
    }
  } catch (err) {
    console.error("[SQLite] Save error:", err);
  }
}

export function sqliteDeleteVisa(id: string): void {
  try {
    const db = getSqliteDb();
    if (!db) return;
    db.prepare("DELETE FROM visas WHERE id = ?").run(id);
  } catch (err) {
    console.error("[SQLite] Delete error:", err);
  }
}

export function sqliteClearAllVisas(): void {
  try {
    const db = getSqliteDb();
    if (!db) return;
    db.prepare("DELETE FROM visas").run();
    try {
      db.prepare("DELETE FROM applications").run();
    } catch {
      // optional table
    }
    try {
      db.prepare("DELETE FROM contacts").run();
    } catch {
      // optional table
    }
  } catch (err) {
    console.error("[SQLite] Clear error:", err);
  }
}
