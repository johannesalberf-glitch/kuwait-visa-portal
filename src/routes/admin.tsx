import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  X as XIcon,
  Save,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AdminGate } from "@/components/AdminGate";
import { VisaResult } from "@/components/VisaResult";
import {
  saveVisa,
  listVisas,
  updateVisa,
  deleteVisa,
  clearAllVisas,
  checkDbHealth,
  syncAllLocalVisasToCloud,
  readLocalVisas,
  type VisaRecord,
  type DbHealthStatus,
  type SaveVisaResult,
} from "@/lib/visa-storage";
const emblemAsset = { url: "/images/kuwait-emblem.webp" };


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Kuwait Ministry of Interior" },
      { name: "description", content: "Internal admin portal to issue new visas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPanelGated,
});

function AdminPanelGated() {
  return (
    <AdminGate>
      {(logout) => (
        <>
          <div className="flex justify-between items-center bg-[#0a1628] border-b border-[rgba(201,168,76,0.2)] px-6 py-3">
            <span className="text-[var(--mls-gold)] font-bold tracking-wider text-xs sm:text-sm">
              STATE OF KUWAIT · MINISTRY OF INTERIOR ADMIN
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-[rgba(201,168,76,0.4)] bg-[rgba(255,255,255,0.06)] px-3.5 py-1.5 text-xs font-semibold text-[#f5f0e6] hover:bg-[rgba(201,168,76,0.15)] transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
          <AdminPanel />
        </>
      )}
    </AdminGate>
  );
}

const NATIONALITIES: { en: string; ar: string }[] = [
  { en: "ETHIOPIA", ar: "إثيوبيا" },
  { en: "INDIA", ar: "الهند" },
  { en: "PHILIPPINES", ar: "الفلبين" },
  { en: "BANGLADESH", ar: "بنغلاديش" },
  { en: "PAKISTAN", ar: "باكستان" },
  { en: "EGYPT", ar: "مصر" },
  { en: "SRI LANKA", ar: "سريلانكا" },
  { en: "NEPAL", ar: "نيبال" },
  { en: "KENYA", ar: "كينيا" },
  { en: "UGANDA", ar: "أوغندا" },
  { en: "OTHER", ar: "أخرى" },
];

const VISA_TYPES: { en: string; ar: string }[] = [
  { en: "B - Private Sector Work Visa", ar: "سمة دخول عمل أهلي" },
  { en: "18 - Government Work Visa", ar: "سمة دخول عمل حكومي" },
  { en: "14 - Visit Visa", ar: "سمة زيارة" },
  { en: "20 - Family Visit", ar: "زيارة عائلية" },
  { en: "22 - Tourist Visa", ar: "تأشيرة سياحية" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function generateVisaNumber() {
  // 6-digit OTP number
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function generateTracker() {
  // 6-digit database tracker
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function buildMRZ(name: string, passport: string, nationality: string, dob: string, gender: string, expiry: string) {
  const clean = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "<").padEnd(30, "<").slice(0, 30);
  const nat = nationality.slice(0, 3).toUpperCase().padEnd(3, "X");
  const d = (iso: string) => {
    if (!iso) return "000000";
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) return "000000";
    return `${(dt.getFullYear() % 100).toString().padStart(2, "0")}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`;
  };
  const g = gender === "M" ? "M" : gender === "F" ? "F" : "X";
  const l1 = `V<MLS${clean(name)}`.slice(0, 44).padEnd(44, "<");
  const l2 = `${(passport || "").toUpperCase().padEnd(9, "<").slice(0, 9)}0${nat}${d(dob)}0${g}${d(expiry)}0<<<<<<<<<<<<<<`.slice(0, 44).padEnd(44, "<");
  return [l1, l2];
}

type Preview = VisaRecord & {
  nameAr: string;
  occupationAr: string;
  nationalityAr: string;
  visaTypeAr: string;
  reference: string;
  mrz: string[];
};

type UploadedDoc = { name: string; type: string; dataUrl: string };

function AdminPanel() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [nameAr, setNameAr] = useState("");
  const [occupationAr, setOccupationAr] = useState("");
  const [translating, setTranslating] = useState<"name" | "occupation" | null>(null);
  const [otpCode, setOtpCode] = useState<string>(() => generateVisaNumber());
  const [trackerCode, setTrackerCode] = useState<string>(() => generateTracker());
  const [refreshKey, setRefreshKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const docsRef = useRef<HTMLInputElement>(null);

  function onPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : null;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setPhoto(src);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        setPhoto(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = () => setPhoto(src);
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  function onDocsChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    Promise.all(
      files.map(
        (file) =>
          new Promise<UploadedDoc | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const src = typeof reader.result === "string" ? reader.result : null;
              if (!src) return resolve(null);
              resolve({ name: file.name, type: file.type || "application/octet-stream", dataUrl: src });
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          }),
      ),
    ).then((results) => {
      const clean = results.filter((r): r is UploadedDoc => !!r);
      setDocuments((prev) => [...prev, ...clean]);
    });
  }

  function removeDoc(idx: number) {
    setDocuments((prev) => prev.filter((_, i) => i !== idx));
  }

  async function translateToArabic(text: string): Promise<string> {
    const q = text.trim();
    if (!q) return "";
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|ar`,
      );
      const data = await res.json();
      return (data?.responseData?.translatedText as string) ?? "";
    } catch {
      return "";
    }
  }

  async function handleAutoTranslate(field: "name" | "occupation", value: string) {
    if (!value.trim()) return;
    setTranslating(field);
    const ar = await translateToArabic(value);
    if (ar) {
      if (field === "name") setNameAr(ar);
      else setOccupationAr(ar);
    }
    setTranslating(null);
  }

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [health, setHealth] = useState<DbHealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [cloudNotice, setCloudNotice] = useState<{ type: "success" | "warning"; message: string } | null>(null);
  const [syncingLocal, setSyncingLocal] = useState(false);
  const [localCount, setLocalCount] = useState(0);

  async function runHealthCheck() {
    setHealthLoading(true);
    try {
      const h = await checkDbHealth();
      setHealth(h);
    } catch {
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
    setLocalCount(readLocalVisas().length);
  }

  useEffect(() => {
    void runHealthCheck();
  }, [refreshKey]);

  async function handleSyncLocalToCloud() {
    setSyncingLocal(true);
    setCloudNotice(null);
    try {
      const res = await syncAllLocalVisasToCloud();
      if (res.error) {
        setCloudNotice({
          type: "warning",
          message: `Sync failed: ${res.error}. Please verify Supabase configuration in Vercel.`,
        });
      } else {
        setCloudNotice({
          type: "success",
          message: `Successfully synced ${res.synced} visa record(s) to Supabase Cloud Database! They are now visible from all phones.`,
        });
        void runHealthCheck();
        setRefreshKey((k) => k + 1);
      }
    } finally {
      setSyncingLocal(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = otpCode.replace(/\D/g, "").slice(0, 6);
    const tracker = trackerCode.replace(/\D/g, "").slice(0, 6);
    if (id.length !== 6 || tracker.length !== 6) {
      setSaveError("OTP and Tracker must be exactly 6 digits.");
      return;
    }
    const reference =
      "KWT" +
      Math.floor(100000 + Math.random() * 900000).toString() +
      String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const nationality = String(fd.get("nationality") ?? "");
    const visaType = String(fd.get("visaType") ?? "");
    const record: VisaRecord = {
      id,
      tracker,
      name: String(fd.get("name") ?? ""),
      passport: String(fd.get("passport") ?? ""),
      nationality,
      gender: String(fd.get("gender") ?? ""),
      visaType,
      occupation: String(fd.get("occupation") ?? ""),
      birthDate: String(fd.get("birthDate") ?? ""),
      issueDate: String(fd.get("issueDate") ?? ""),
      expiryDate: String(fd.get("expiryDate") ?? ""),
      photo,
      documents,
    };
    setSaving(true);
    setSaveError(null);
    setCloudNotice(null);
    let saveResult: SaveVisaResult | null = null;
    try {
      saveResult = await saveVisa(record);
    } catch (err) {
      setSaving(false);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save visa. Please try again.",
      );
      return;
    }
    setSaving(false);
    if (saveResult && saveResult.cloudSaved) {
      setCloudNotice({
        type: "success",
        message: `✅ Visa #${record.id} saved to Supabase Cloud Database! Available immediately across all devices & phones.`,
      });
    } else {
      setCloudNotice({
        type: "warning",
        message: `⚠️ Visa #${record.id} saved to THIS BROWSER ONLY. Cloud database sync is OFFLINE (${saveResult?.cloudError || "Supabase not connected"}). Other phones will say "User Not Found" until Supabase is configured in Vercel.`,
      });
    }
    const mrz = buildMRZ(record.name, record.passport, record.nationality, record.birthDate, record.gender, record.expiryDate);
    setPreview({
      ...record,
      nameAr,
      occupationAr,
      nationalityAr: NATIONALITIES.find((n) => n.en === nationality)?.ar ?? "",
      visaTypeAr: VISA_TYPES.find((v) => v.en === visaType)?.ar ?? "",
      reference,
      mrz,
    });
    setRefreshKey((k) => k + 1);
    setTimeout(() => {
      document.getElementById("visa-card-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function resetAll() {
    setPreview(null);
    setPhoto(null);
    setDocuments([]);
    setNameAr("");
    setOccupationAr("");
    setOtpCode(generateVisaNumber());
    setTrackerCode(generateTracker());
    if (fileRef.current) fileRef.current.value = "";
    if (docsRef.current) docsRef.current.value = "";
  }

  return (
    <div className="mols-admin min-h-screen py-8 px-4">
      <style>{css}</style>

      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--mls-gold)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* CLOUD DATABASE HEALTH STATUS BANNER */}
        {health && (
          <div className="mb-6">
            {health.supabaseConnected ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-200 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <div>
                      <p className="font-bold text-sm text-emerald-100">
                        🟢 Cloud Database Online (Supabase) · Cross-Device Sync Active
                      </p>
                      <p className="text-xs text-emerald-300/80">
                        All devices and phones share the same live database ({health.rowCount} visa record{health.rowCount !== 1 ? "s" : ""} saved).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void runHealthCheck()}
                      disabled={healthLoading}
                      className="rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 px-3 py-1.5 text-xs font-semibold text-emerald-200 border border-emerald-500/30 transition disabled:opacity-50"
                    >
                      {healthLoading ? "Checking..." : "Refresh Status"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/50 p-5 text-amber-200 shadow-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-amber-100">
                        ⚠️ Cloud Database Disconnected — Visas Only Saved on This Phone/Browser!
                      </h4>
                      <div className="flex items-center gap-2">
                        {localCount > 0 && (
                          <button
                            type="button"
                            onClick={handleSyncLocalToCloud}
                            disabled={syncingLocal}
                            className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 text-xs font-bold transition shadow disabled:opacity-50"
                          >
                            {syncingLocal ? "Syncing..." : `Sync ${localCount} Local Visa${localCount > 1 ? "s" : ""} to Cloud`}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => void runHealthCheck()}
                          disabled={healthLoading}
                          className="rounded-lg bg-amber-900/60 hover:bg-amber-800/80 px-3 py-1 text-xs font-medium text-amber-200 border border-amber-500/40 transition disabled:opacity-50"
                        >
                          {healthLoading ? "Checking..." : "Check Again"}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      <strong>Why other phones say "User Not Found":</strong> This Vercel deployment does not have Supabase credentials connected yet. Generated visas are temporarily stored in this browser only.
                    </p>
                    <div className="rounded-lg bg-slate-950/70 border border-amber-500/30 p-3.5 text-xs space-y-1.5 font-mono text-amber-100/90">
                      <div className="font-bold text-yellow-300">How to fix in 2 minutes so all phones work:</div>
                      <div>1. Open your <strong>Supabase Dashboard</strong> → SQL Editor → Paste & Run <code className="text-yellow-300">SUPABASE_SETUP.sql</code></div>
                      <div>2. Open <strong>Vercel Settings → Environment Variables</strong> and add:</div>
                      <div className="pl-4 text-emerald-300">• <code className="text-white">SUPABASE_URL</code> = your Supabase project URL</div>
                      <div className="pl-4 text-emerald-300">• <code className="text-white">SUPABASE_SERVICE_ROLE_KEY</code> = your secret service role key (or anon key)</div>
                      <div>3. Redeploy in Vercel, then click <strong>"Sync Local Visas to Cloud"</strong> above!</div>
                    </div>
                    {health.error && (
                      <p className="text-xs text-red-300 font-mono">
                        Error detail: {health.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="generator-section">
          <h1 className="generator-title">Kuwait Ministry of Interior — وزارة الداخلية الكويتية</h1>
          <p className="generator-subtitle">
            Electronic Visa ID Generator · مولّد بطاقة التأشيرة الإلكترونية
          </p>

          <form onSubmit={onSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>OTP Number · رمز التحقق (6 digits)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit OTP"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setOtpCode(generateVisaNumber())}
                    className="btn-reset"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Random
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Database Tracker · معرّف قاعدة البيانات (6 digits)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={trackerCode}
                    onChange={(e) => setTrackerCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit tracker"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setTrackerCode(generateTracker())}
                    className="btn-reset"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Random
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Full Name (English)</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. MOHAMMED AHMED ALI"
                  onBlur={(e) => handleAutoTranslate("name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>
                  Full Name (Arabic) · الاسم بالعربية
                  {translating === "name" && <span style={{ marginLeft: 8, opacity: 0.7 }}>translating…</span>}
                </label>
                <input
                  name="nameAr"
                  type="text"
                  dir="rtl"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: محمد أحمد علي (يُملأ تلقائيًا)"
                />
              </div>
              <div className="form-group">
                <label>Nationality · الجنسية</label>
                <select name="nationality" defaultValue="ETHIOPIA" required>
                  {NATIONALITIES.map((n) => (
                    <option key={n.en} value={n.en}>{n.en} — {n.ar}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Passport Number · رقم الجواز</label>
                <input name="passport" type="text" required placeholder="e.g. A12345678" />
              </div>
              <div className="form-group">
                <label>Date of Birth · تاريخ الميلاد</label>
                <input name="birthDate" type="date" required />
              </div>
              <div className="form-group">
                <label>Gender · الجنس</label>
                <select name="gender" defaultValue="F" required>
                  <option value="F">Female — أنثى</option>
                  <option value="M">Male — ذكر</option>
                </select>
              </div>
              <div className="form-group">
                <label>Visa Type · نوع التأشيرة</label>
                <select name="visaType" defaultValue={VISA_TYPES[0].en} required>
                  {VISA_TYPES.map((t) => (
                    <option key={t.en} value={t.en}>{t.en} — {t.ar}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Occupation (English)</label>
                <input
                  name="occupation"
                  type="text"
                  required
                  placeholder="e.g. Software Engineer / Consultant"
                  onBlur={(e) => handleAutoTranslate("occupation", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>
                  Occupation (Arabic) · المهنة
                  {translating === "occupation" && <span style={{ marginLeft: 8, opacity: 0.7 }}>translating…</span>}
                </label>
                <input
                  name="occupationAr"
                  type="text"
                  dir="rtl"
                  value={occupationAr}
                  onChange={(e) => setOccupationAr(e.target.value)}
                  placeholder="مثال: مهندس برمجيات / استشاري (يُملأ تلقائيًا)"
                />
              </div>
              <div className="form-group">
                <label>Issue Date · تاريخ الإصدار</label>
                <input name="issueDate" type="date" required />
              </div>
              <div className="form-group">
                <label>Expiry Date · تاريخ الانتهاء</label>
                <input name="expiryDate" type="date" required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Photo Upload · الصورة</label>
              <label className="photo-upload" htmlFor="photo">
                <span className="photo-upload-text">
                  {photo ? "Photo selected — click to replace" : "Click to upload passport photo"}
                </span>
                <input
                  ref={fileRef}
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={onPhotoChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Documents / Files · المستندات (Images, PDFs)</label>
              <label className="photo-upload" htmlFor="docs">
                <span className="photo-upload-text">
                  {documents.length
                    ? `${documents.length} file${documents.length === 1 ? "" : "s"} attached — click to add more`
                    : "Click to upload supporting documents (multi-select)"}
                </span>
                <input
                  ref={docsRef}
                  id="docs"
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={onDocsChange}
                  style={{ display: "none" }}
                />
              </label>
              {documents.length > 0 && (
                <div className="doc-chips">
                  {documents.map((d, i) => (
                    <div key={i} className="doc-chip">
                      {d.type.startsWith("image/") ? (
                        <img src={d.dataUrl} alt={d.name} />
                      ) : (
                        <span className="doc-chip-icon">📄</span>
                      )}
                      <span className="doc-chip-name" title={d.name}>{d.name}</span>
                      <button
                        type="button"
                        className="doc-chip-remove"
                        onClick={() => removeDoc(i)}
                        aria-label={`Remove ${d.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="submit"
                className="btn-generate"
                disabled={saving}
                style={saving ? { opacity: 0.6, cursor: "wait" } : undefined}
              >
                {saving ? "Saving to Database…" : "Generate eVisa Card"}
              </button>
              {preview && (
                <button type="button" className="btn-reset" onClick={resetAll}>
                  Reset
                </button>
              )}
              {saveError && (
                <span style={{ color: "#fca5a5", fontSize: "0.85rem" }}>
                  {saveError}
                </span>
              )}
              {cloudNotice && (
                <div
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: "0.85rem",
                    marginTop: 8,
                    background:
                      cloudNotice.type === "success"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                    border:
                      cloudNotice.type === "success"
                        ? "1px solid rgba(16, 185, 129, 0.4)"
                        : "1px solid rgba(245, 158, 11, 0.4)",
                    color: cloudNotice.type === "success" ? "#6ee7b7" : "#fcd34d",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {cloudNotice.message}
                </div>
              )}
            </div>
          </form>
        </div>

        {preview && (
          <div id="visa-card-preview" className="my-8">
            <VisaResult record={preview} celebrate={true} />
            <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn-print" onClick={() => window.print()}>
                Print Visa Card
              </button>
              <div className="issued-badge">
                OTP: <strong>{preview.id}</strong> · Database Tracker: <strong>{preview.tracker}</strong>
              </div>
            </div>
          </div>
        )}

        <VisaManager
          refreshKey={refreshKey}
          onClearAll={() => setPreview(null)}
        />
      </div>
    </div>
  );
}

type EditFields = {
  name: string;
  nameAr?: string;
  passport: string;
  nationality: string;
  gender: string;
  visaType: string;
  occupation: string;
  occupationAr?: string;
  birthDate: string;
  issueDate: string;
  expiryDate: string;
};

function VisaManager({
  refreshKey,
  onClearAll,
}: {
  refreshKey?: number;
  onClearAll?: () => void;
}) {
  const [rows, setRows] = useState<VisaRecord[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<VisaRecord | null>(null);
  const [form, setForm] = useState<EditFields | null>(null);
  const [filter, setFilter] = useState("");
  const [confirmDeleteRecord, setConfirmDeleteRecord] = useState<VisaRecord | null>(null);
  const [showConfirmClearAll, setShowConfirmClearAll] = useState(false);

  async function refresh() {
    try {
      setErr(null);
      const data = await listVisas();
      setRows(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load issued visas.");
    }
  }

  useEffect(() => {
    void refresh();
  }, [refreshKey]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  function openEdit(r: VisaRecord) {
    setEditing(r);
    setForm({
      name: r.name,
      passport: r.passport,
      nationality: r.nationality,
      gender: r.gender,
      visaType: r.visaType,
      occupation: r.occupation,
      birthDate: r.birthDate,
      issueDate: r.issueDate,
      expiryDate: r.expiryDate,
    });
  }

  async function saveEdit() {
    if (!editing || !form) return;
    setBusyId(editing.id);
    setErr(null);
    try {
      await updateVisa(editing.id, { ...editing, ...form });
      setEditing(null);
      setForm(null);
      setSuccessMsg(`Visa #${editing.id} (${form.name}) updated successfully.`);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to update visa record.");
    } finally {
      setBusyId(null);
    }
  }

  async function executeDelete(r: VisaRecord) {
    setBusyId(r.id);
    setErr(null);
    try {
      await deleteVisa(r.id);
      setConfirmDeleteRecord(null);
      setSuccessMsg(`Visa #${r.id} for ${r.name} has been deleted.`);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to delete visa record.");
    } finally {
      setBusyId(null);
    }
  }

  async function executeClearAll() {
    setBusyId("all");
    setErr(null);
    try {
      await clearAllVisas();
      setShowConfirmClearAll(false);
      setSuccessMsg("All issued visa records and applicant data have been permanently cleared.");
      onClearAll?.();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to clear all visas.");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = (rows ?? []).filter((r) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.passport && r.passport.toLowerCase().includes(q)) ||
      (r.nationality && r.nationality.toLowerCase().includes(q)) ||
      (r.visaType && r.visaType.toLowerCase().includes(q)) ||
      (r.occupation && r.occupation.toLowerCase().includes(q))
    );
  });

  return (
    <div id="manage-visas-section" className="generator-section" style={{ marginTop: 24 }}>
      {/* Section Header & Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="generator-title" style={{ fontSize: "1.25rem", margin: 0 }}>
            Saved Visas · التأشيرات المحفوظة
          </h2>
          <p className="generator-subtitle" style={{ margin: "4px 0 0" }}>
            Manage all issued visa records — edit or delete.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--mls-gold)] opacity-70 pointer-events-none" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search OTP / name / passport…"
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-[rgba(201,168,76,0.3)] bg-[rgba(10,22,40,0.6)] text-[#f5f0e6] text-xs sm:text-sm outline-none focus:border-[var(--mls-gold)] focus:ring-1 focus:ring-[var(--mls-gold)] transition"
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Clear filter"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={rows === null || busyId !== null}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.06)] text-[var(--mls-cream)] text-xs font-semibold hover:bg-[rgba(201,168,76,0.15)] transition cursor-pointer disabled:opacity-50"
            title="Refresh records list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${rows === null ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Clear All Button */}
          {(rows ?? []).length > 0 && (
            <button
              type="button"
              onClick={() => setShowConfirmClearAll(true)}
              disabled={busyId !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs font-semibold hover:bg-red-900/60 hover:text-white transition shadow-sm cursor-pointer disabled:opacity-50"
              title="Delete all issued visa records"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
              <span>{busyId === "all" ? "Clearing…" : "Clear All"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Info Tag */}
      {filter && rows !== null && (
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--mls-silver)] px-1">
          <span>
            Showing <strong>{filtered.length}</strong> of <strong>{rows.length}</strong> visa records
          </span>
          <button
            type="button"
            onClick={() => setFilter("")}
            className="text-[var(--mls-gold-bright)] hover:underline"
          >
            Reset search
          </button>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="mt-3.5 flex items-center justify-between gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Banner */}
      {err && (
        <div className="mt-3.5 flex items-center justify-between gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{err}</span>
          </div>
          <button
            type="button"
            onClick={() => setErr(null)}
            className="text-red-400 hover:text-white text-xs cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {rows === null && (
        <div className="my-10 flex items-center justify-center gap-3 text-sm text-[var(--mls-gold-bright)]">
          <RefreshCw className="h-5 w-5 animate-spin text-[var(--mls-gold)]" />
          <span>Loading issued visas from database…</span>
        </div>
      )}

      {/* Empty State: No Records in Database */}
      {rows !== null && rows.length === 0 && (
        <div className="my-6 py-12 px-6 text-center rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[rgba(10,22,40,0.5)] shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] flex items-center justify-center mx-auto mb-3 text-2xl">
            🛡️
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--mls-gold)] font-serif">
            No Issued Visa Records in Database
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-1.5 max-w-md mx-auto leading-relaxed">
            All user records have been cleaned. Use the official generator above to issue new Kuwait electronic visas.
          </p>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[var(--mls-gold)] to-[var(--mls-gold-bright)] hover:opacity-90 transition shadow cursor-pointer"
          >
            ↑ Issue New Visa
          </button>
        </div>
      )}

      {/* Empty State: Search yielded no matches */}
      {rows !== null && rows.length > 0 && filtered.length === 0 && (
        <div className="my-6 py-10 px-4 text-center rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[rgba(10,22,40,0.4)]">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="text-base font-bold text-[var(--mls-gold)] font-serif">
            No Visas Match Your Search
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-md mx-auto">
            No visa matching "{filter}". Try searching by another OTP number, applicant name, or passport.
          </p>
          <button
            type="button"
            onClick={() => setFilter("")}
            className="mt-3 text-xs font-semibold text-[var(--mls-gold-bright)] underline hover:text-white cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Visas Found: Mobile Card View (screens < 768px) and Desktop Table View (screens >= 768px) */}
      {rows !== null && filtered.length > 0 && (
        <>
          {/* Mobile Card View (< 768px) */}
          <div className="block md:hidden mt-4 space-y-3.5">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-[rgba(201,168,76,0.25)] bg-[rgba(10,22,40,0.6)] shadow-lg hover:border-[rgba(201,168,76,0.4)] transition"
              >
                {/* Header: OTP & Status */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold text-[var(--mls-gold-bright)] bg-[rgba(201,168,76,0.15)] px-2.5 py-1 rounded-md border border-[rgba(201,168,76,0.3)]">
                    OTP: {r.id}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    APPROVED
                  </span>
                </div>

                {/* Name */}
                <div className="font-bold text-base text-[#f5f0e6] leading-tight break-words mt-1">
                  {r.name}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs text-gray-300 bg-[rgba(255,255,255,0.03)] p-2.5 rounded-lg border border-[rgba(255,255,255,0.05)]">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Passport</span>
                    <strong className="font-mono text-[#f5f0e6]">{r.passport}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Nationality</span>
                    <span className="text-[#f5f0e6] truncate block">{r.nationality}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Visa Type</span>
                    <span className="text-amber-200 truncate block">{r.visaType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Occupation</span>
                    <span className="text-gray-200 truncate block">{r.occupation || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Expires</span>
                    <span className="font-mono text-amber-300">{fmtDate(r.expiryDate)}</span>
                  </div>
                </div>

                {/* Card Actions Toolbar */}
                <div className="flex justify-end items-center gap-2 mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.08)]">
                  <Link
                    to="/visa/$id"
                    params={{ id: r.id }}
                    className="min-h-[38px] inline-flex items-center gap-1 text-xs font-semibold text-[var(--mls-gold-bright)] hover:underline px-3 py-1.5 rounded-lg bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] transition"
                  >
                    View ↗
                  </Link>
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    disabled={busyId === r.id}
                    className="min-h-[38px] inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white px-3 py-1.5 rounded-lg bg-blue-900/40 border border-blue-500/40 hover:bg-blue-800/60 transition cursor-pointer"
                    aria-label={`Edit visa ${r.id}`}
                  >
                    <Pencil className="h-3.5 w-3.5 text-blue-300" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteRecord(r)}
                    disabled={busyId === r.id}
                    className="min-h-[38px] inline-flex items-center gap-1.5 text-xs font-semibold text-red-200 hover:text-white px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-500/40 hover:bg-red-800/60 transition cursor-pointer"
                    aria-label={`Delete visa ${r.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block mt-4 overflow-x-auto rounded-xl border border-[rgba(201,168,76,0.25)] bg-[rgba(10,22,40,0.4)]">
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#f5f0e6", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--mls-gold)", borderBottom: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.06)" }}>
                  <th style={{ padding: "12px 10px" }}>OTP</th>
                  <th style={{ padding: "12px 10px" }}>Applicant Name</th>
                  <th style={{ padding: "12px 10px" }}>Passport</th>
                  <th style={{ padding: "12px 10px" }}>Nationality</th>
                  <th style={{ padding: "12px 10px" }}>Visa Type</th>
                  <th style={{ padding: "12px 10px" }}>Expiry Date</th>
                  <th style={{ padding: "12px 10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[rgba(201,168,76,0.05)] transition"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <td style={{ padding: "12px 10px", fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "var(--mls-gold-bright)" }}>
                      {r.id}
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: "12px 10px", fontFamily: "ui-monospace, monospace" }}>{r.passport}</td>
                    <td style={{ padding: "12px 10px" }}>{r.nationality}</td>
                    <td style={{ padding: "12px 10px", color: "#fde68a" }}>{r.visaType}</td>
                    <td style={{ padding: "12px 10px", fontFamily: "ui-monospace, monospace" }}>{fmtDate(r.expiryDate)}</td>
                    <td style={{ padding: "12px 10px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <Link
                        to="/visa/$id"
                        params={{ id: r.id }}
                        style={{ color: "var(--mls-gold-bright)", marginRight: 14, fontSize: "0.82rem", fontWeight: 600 }}
                      >
                        View ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 text-blue-300 hover:text-white px-2 py-1 rounded bg-blue-900/30 border border-blue-500/30 mr-2 cursor-pointer"
                        aria-label={`Edit ${r.id}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="text-xs">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteRecord(r)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 text-red-300 hover:text-white px-2 py-1 rounded bg-red-900/30 border border-red-500/30 cursor-pointer"
                        aria-label={`Delete ${r.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="text-xs">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Confirmation Modal: Delete Single Record */}
      {confirmDeleteRecord && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDeleteRecord(null);
          }}
        >
          <div className="bg-[#0f1c30] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#f5f0e6]">
            <div className="flex items-center gap-3 mb-3 text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold font-serif m-0 text-red-300">
                Delete Visa Record?
              </h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Are you sure you want to permanently delete visa record for{" "}
              <strong className="text-white">{confirmDeleteRecord.name}</strong> (OTP:{" "}
              <span className="font-mono font-bold text-amber-300">{confirmDeleteRecord.id}</span>)?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="btn-reset"
                onClick={() => setConfirmDeleteRecord(null)}
                disabled={busyId === confirmDeleteRecord.id}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void executeDelete(confirmDeleteRecord)}
                disabled={busyId === confirmDeleteRecord.id}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60"
              >
                {busyId === confirmDeleteRecord.id ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Clear All Records */}
      {showConfirmClearAll && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirmClearAll(false);
          }}
        >
          <div className="bg-[#0f1c30] border border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#f5f0e6]">
            <div className="flex items-center gap-3 mb-3 text-red-400">
              <Trash2 className="h-6 w-6" />
              <h3 className="text-lg font-bold font-serif m-0 text-red-300">
                Delete ALL Issued Visas?
              </h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              This action will permanently delete <strong>all issued visa records</strong> and applicant info from the database.
              The database will be wiped clean.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="btn-reset"
                onClick={() => setShowConfirmClearAll(false)}
                disabled={busyId === "all"}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void executeClearAll()}
                disabled={busyId === "all"}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 shadow-lg"
              >
                {busyId === "all" ? "Clearing Database…" : "Confirm & Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visa Modal */}
      {editing && form && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditing(null);
              setForm(null);
            }
          }}
        >
          <div className="bg-[#0f1c30] border border-[rgba(201,168,76,0.35)] rounded-2xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl text-[#f5f0e6] max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[rgba(201,168,76,0.2)]">
              <div>
                <h3 className="m-0 text-base sm:text-lg font-bold text-[var(--mls-gold)] font-serif">
                  Edit Visa · OTP: <span className="font-mono text-amber-300">{editing.id}</span>
                </h3>
                <p className="text-xs text-gray-400 m-0 mt-0.5">
                  Update official visa records in the database.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(null);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group sm:col-span-2">
                <label>Full Name (English)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Passport */}
              <div className="form-group">
                <label>Passport Number</label>
                <input
                  type="text"
                  value={form.passport}
                  onChange={(e) => setForm({ ...form, passport: e.target.value })}
                  required
                />
              </div>

              {/* Nationality Dropdown */}
              <div className="form-group">
                <label>Nationality</label>
                <select
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  required
                >
                  {NATIONALITIES.map((n) => (
                    <option key={n.en} value={n.en}>
                      {n.en} — {n.ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visa Type Dropdown */}
              <div className="form-group sm:col-span-2">
                <label>Visa Type</label>
                <select
                  value={form.visaType}
                  onChange={(e) => setForm({ ...form, visaType: e.target.value })}
                  required
                >
                  {VISA_TYPES.map((t) => (
                    <option key={t.en} value={t.en}>
                      {t.en} — {t.ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occupation */}
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  required
                />
              </div>

              {/* Gender */}
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  required
                >
                  <option value="F">Female — أنثى</option>
                  <option value="M">Male — ذكر</option>
                </select>
              </div>

              {/* Birth Date */}
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  required
                />
              </div>

              {/* Issue Date */}
              <div className="form-group">
                <label>Issue Date</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  required
                />
              </div>

              {/* Expiry Date */}
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end pt-3 border-t border-[rgba(255,255,255,0.08)]">
              <button
                type="button"
                className="btn-reset"
                onClick={() => {
                  setEditing(null);
                  setForm(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-generate inline-flex items-center gap-2"
                onClick={saveEdit}
                disabled={busyId === editing.id}
                style={busyId === editing.id ? { opacity: 0.6, cursor: "wait" } : undefined}
              >
                <Save className="h-4 w-4" />
                <span>{busyId === editing.id ? "Saving Changes…" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `

.mols-admin {
  --mls-blue: #1a5f9e;
  --mls-blue-dark: #0d3d66;
  --mls-blue-light: #e8f1f8;
  --mls-gold: #c9a84c;
  --mls-gold-bright: #e8c96e;
  --mls-gold-dim: #8a7340;
  --mls-cream: #f5f0e6;
  --mls-green: #2e7d32;
  --mls-silver: #a0a8b0;
  --mls-border: #d4c9b0;
  background: linear-gradient(160deg, #0a1628 0%, #1a2a40 30%, #0f1c30 70%, #0a1628 100%);
  color: #333;
  font-family: 'Inter', 'Noto Sans Arabic', system-ui, sans-serif;
}
.mols-admin .generator-section {
  background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
  padding: 32px;
  margin-bottom: 40px;
  border: 1px solid rgba(201,168,76,0.15);
  backdrop-filter: blur(10px);
}
.mols-admin .generator-title {
  color: var(--mls-gold);
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.mols-admin .generator-title::before { content: "◆ "; }
.mols-admin .generator-subtitle {
  color: var(--mls-silver);
  font-size: 0.9rem;
  margin-bottom: 26px;
}
.mols-admin .form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}
.mols-admin .form-group { display: flex; flex-direction: column; }
.mols-admin .form-group label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--mls-gold-dim);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
.mols-admin .form-group input,
.mols-admin .form-group select {
  padding: 12px 14px;
  background: rgba(10,22,40,0.6);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--mls-cream);
  transition: all 0.3s ease;
}
.mols-admin .form-group input:focus,
.mols-admin .form-group select:focus {
  outline: none;
  border-color: var(--mls-gold);
  box-shadow: 0 0 0 3px rgba(201,168,76,0.15);
  background: rgba(10,22,40,0.8);
}
.mols-admin .form-group option { background: #0a1628; color: var(--mls-cream); }
.mols-admin .btn-generate {
  background: linear-gradient(135deg, var(--mls-gold) 0%, var(--mls-gold-dim) 100%);
  color: var(--mls-blue-dark);
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(201,168,76,0.3);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Cinzel', Georgia, serif;
}
.mols-admin .btn-generate:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.5); }
.mols-admin .btn-reset {
  background: rgba(255,255,255,0.08);
  color: var(--mls-cream);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 14px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.85rem;
}
.mols-admin .photo-upload {
  border: 2px dashed rgba(201,168,76,0.3);
  border-radius: 10px;
  padding: 18px;
  text-align: center;
  cursor: pointer;
  background: rgba(10,22,40,0.4);
  display: block;
  transition: all 0.3s ease;
}
.mols-admin .photo-upload:hover { border-color: var(--mls-gold); background: rgba(201,168,76,0.08); }
.mols-admin .photo-upload-text { font-size: 0.85rem; color: var(--mls-silver); }

.mols-admin .visa-card-wrapper { margin-top: 20px; }
.mols-admin .visa-card-wrapper.active { animation: molsFadeUp 0.7s cubic-bezier(0.22,1,0.36,1); }
@keyframes molsFadeUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: none; } }

.mols-admin .visa-card {
  background: linear-gradient(165deg, #faf7f0 0%, #f5f0e6 40%, #ede8db 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.3);
  overflow: hidden;
  border: 1px solid var(--mls-border);
  position: relative;
  color: #333;
}
.mols-admin .visa-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--mls-blue) 0%, var(--mls-gold) 35%, var(--mls-gold-bright) 50%, var(--mls-gold) 65%, var(--mls-blue) 100%);
  z-index: 10;
}
.mols-admin .ovi-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; border-radius: 20px; }
.mols-admin .ovi-sheen {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.08) 15deg, rgba(0,191,255,0.06) 30deg, transparent 90deg, transparent 360deg);
  animation: molsOviRotate 10s linear infinite;
  mix-blend-mode: overlay; pointer-events: none;
}
@keyframes molsOviRotate { to { transform: rotate(360deg); } }
.mols-admin .ovi-grid {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,168,76,0.04) 2px, rgba(201,168,76,0.04) 3px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(10,22,40,0.03) 2px, rgba(10,22,40,0.03) 3px);
  pointer-events: none;
}
.mols-admin .ovi-guilloche {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 15% 25%, rgba(201,168,76,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 75%, rgba(10,22,40,0.05) 0%, transparent 50%);
  pointer-events: none;
}
.mols-admin .ovi-kinegram {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-family: 'Cinzel', 'Noto Sans Arabic', Georgia, serif;
  font-size: 3.5rem; font-weight: 900; letter-spacing: 16px;
  color: rgba(201,168,76,0.06);
  white-space: nowrap; pointer-events: none; z-index: 1; user-select: none;
}

.mols-admin .card-header {
  background: linear-gradient(135deg, var(--mls-blue-light) 0%, #d4e6f1 100%);
  padding: 22px 32px;
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  border-bottom: 2px solid var(--mls-gold);
  position: relative; z-index: 2;
}
.mols-admin .header-left h2 {
  font-family: 'Cinzel', Georgia, serif;
  color: var(--mls-blue);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
}
.mols-admin .header-left p {
  color: #5a7a94;
  font-size: 0.72rem;
  margin-top: 3px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.mols-admin .header-right { text-align: right; }
.mols-admin .header-right h2 {
  font-family: 'Noto Sans Arabic', system-ui, sans-serif;
  color: var(--mls-blue);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}
.mols-admin .header-right p {
  font-family: 'Noto Sans Arabic', system-ui, sans-serif;
  color: #5a7a94;
  font-size: 0.85rem;
  margin-top: 3px;
}
.mols-admin .emblem {
  width: 96px; height: 72px;
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 2;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
}
.mols-admin .emblem-img {
  width: 100%; height: 100%; object-fit: contain;
  background: radial-gradient(circle at 50% 50%, rgba(13,61,102,0.9), rgba(13,61,102,0.7));
  padding: 6px; border-radius: 10px;
  border: 1px solid rgba(201,168,76,0.4);
}

.mols-admin .card-body { padding: 28px 32px; position: relative; z-index: 2; }
.mols-admin .watermark { display: none; }
.mols-admin .info-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 22px;
  position: relative; z-index: 3;
}
@media (max-width: 768px) { .mols-admin .info-grid { grid-template-columns: 1fr; gap: 14px; } }
@media (max-width: 640px) {
  .mols-admin { padding-left: 10px; padding-right: 10px; }
  .mols-admin .generator-section { padding: 18px; border-radius: 14px; }
  .mols-admin .generator-title { font-size: 1.05rem; letter-spacing: 1px; }
  .mols-admin .visa-card { border-radius: 14px; }
  .mols-admin .card-header { padding: 14px 14px; gap: 8px; }
  .mols-admin .header-left h2, .mols-admin .header-right h2 { font-size: 0.85rem; letter-spacing: 1px; }
  .mols-admin .header-left p, .mols-admin .header-right p { font-size: 0.6rem; letter-spacing: 1px; }
  .mols-admin .emblem { width: 56px; height: 46px; }
  .mols-admin .card-body { padding: 18px 14px; }
  .mols-admin .ovi-kinegram { font-size: 2.2rem; letter-spacing: 8px; }
  .mols-admin .photo-qr-section { gap: 8px; }
  .mols-admin .photo-box { width: 88px; height: 110px; }
  .mols-admin .qr-box { width: 88px; height: 88px; }
  .mols-admin .info-value { font-size: 0.88rem; }
  .mols-admin .info-value.highlight { font-size: 0.95rem; letter-spacing: 0.5px; }
  .mols-admin .mrz-section { padding: 10px 12px; }
  .mols-admin .mrz-line { font-size: 0.6rem; letter-spacing: 1px; word-break: break-all; overflow-wrap: anywhere; }
  .mols-admin .card-footer { padding: 12px 14px; }
  .mols-admin .card-footer p { font-size: 0.6rem; letter-spacing: 1px; }
}
.mols-admin .info-section { display: flex; flex-direction: column; gap: 14px; }
.mols-admin .info-item { display: flex; flex-direction: column; }
.mols-admin .info-label {
  font-size: 0.65rem; font-weight: 700; color: #5a7a94;
  text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px;
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}
.mols-admin .info-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.95rem; font-weight: 600; color: var(--mls-blue-dark);
  word-break: break-word;
}
.mols-admin .info-value.ar {
  font-family: 'Noto Sans Arabic', system-ui, sans-serif;
  font-size: 0.9rem; margin-top: 2px; color: var(--mls-blue);
}
.mols-admin .info-value.highlight {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 1.05rem; font-weight: 700; color: var(--mls-blue); letter-spacing: 1px;
}
.mols-admin .info-value.date-block {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.9rem; font-weight: 600;
}
.mols-admin .photo-qr-section { display: flex; gap: 12px; margin-bottom: 6px; }
.mols-admin .photo-box {
  width: 100px; height: 125px;
  background: linear-gradient(145deg, #f0ebe0 0%, #e8e3d8 100%);
  border: 2px solid #c8dce8; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);
}
.mols-admin .photo-box img { width: 100%; height: 100%; object-fit: cover; }
.mols-admin .photo-placeholder { font-size: 2.5rem; }
.mols-admin .photo-label {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(90deg, var(--mls-blue) 0%, var(--mls-blue-dark) 100%);
  color: white; font-family: 'JetBrains Mono', 'Noto Sans Arabic', monospace;
  font-size: 0.55rem; text-align: center; padding: 3px;
  letter-spacing: 1px; font-weight: 600;
}
.mols-admin .qr-box {
  width: 100px; height: 100px; background: white;
  border: 2px solid #c8dce8; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; padding: 4px;
}
.mols-admin .qr-box img { width: 100%; height: 100%; }
.mols-admin .mrz-section {
  background: linear-gradient(90deg, #f0f4f8 0%, #e8f1f8 50%, #f0f4f8 100%);
  padding: 14px 20px; border-radius: 10px; margin-top: 18px;
  border: 1px solid #d0e3f0; position: relative; z-index: 3;
}
.mols-admin .mrz-line {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem; font-weight: 700; color: var(--mls-blue-dark);
  letter-spacing: 2px; line-height: 1.8; word-break: break-all;
}
.mols-admin .card-footer {
  background: linear-gradient(135deg, #f5f9fc 0%, #e8f1f8 100%);
  padding: 14px 32px; border-top: 2px solid var(--mls-gold);
  display: flex; justify-content: space-between; align-items: center;
  position: relative; z-index: 2; flex-wrap: wrap; gap: 10px;
}
.mols-admin .card-footer p {
  font-size: 0.72rem; color: #5a7a94; letter-spacing: 1.5px; margin: 0;
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}
.mols-admin .status-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: var(--mls-green); padding: 6px 14px; border-radius: 25px;
  font-size: 0.75rem; font-weight: 700; border: 1px solid #a5d6a7; letter-spacing: 1px;
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}
.mols-admin .status-badge::before {
  content: ""; width: 8px; height: 8px; background: var(--mls-green);
  border-radius: 50%; animation: molsPulseDot 2s infinite; box-shadow: 0 0 8px rgba(46,125,50,0.5);
}
@keyframes molsPulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
.mols-admin .btn-print {
  background: linear-gradient(135deg, var(--mls-green) 0%, #1b5e20 100%);
  color: white; border: none; padding: 12px 26px; border-radius: 10px;
  font-weight: 700; cursor: pointer; letter-spacing: 1px;
  font-family: 'Cinzel', Georgia, serif; text-transform: uppercase;
}
.mols-admin .btn-print:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(46,125,50,0.3); }
.mols-admin .issued-badge {
  display: inline-flex; align-items: center; padding: 12px 20px;
  background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.4);
  border-radius: 10px; color: var(--mls-cream); font-size: 0.9rem; letter-spacing: 1px;
}
.mols-admin .issued-badge strong {
  color: var(--mls-gold-bright); margin-left: 8px;
  font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 1.05rem;
}
@media print {
  .mols-admin { background: white; padding: 0; }
  .mols-admin .generator-section, .mols-admin .btn-print, .mols-admin .issued-badge { display: none !important; }
  .mols-admin .visa-card { box-shadow: none; border: 1px solid #ccc; }
}

/* Holographic emblem guilloche background — tiled Kuwait emblem */
.mols-admin .ovi-emblem-pattern {
  position: absolute; inset: 0;
  background-repeat: repeat;
  background-size: 78px 78px;
  opacity: 0.09;
  mix-blend-mode: multiply;
  animation: molsEmblemHue 14s linear infinite;
  pointer-events: none;
  z-index: 1;
}
@keyframes molsEmblemHue {
  0% { filter: hue-rotate(0deg) saturate(1.1); }
  50% { filter: hue-rotate(180deg) saturate(1.3); }
  100% { filter: hue-rotate(360deg) saturate(1.1); }
}

/* Document upload chips (admin form) */
.mols-admin .doc-chips {
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;
}
.mols-admin .doc-chip {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(10,22,40,0.6);
  border: 1px solid rgba(201,168,76,0.35);
  padding: 6px 10px; border-radius: 8px;
  color: var(--mls-cream); font-size: 0.78rem;
  max-width: 220px;
}
.mols-admin .doc-chip img {
  width: 28px; height: 28px; object-fit: cover; border-radius: 4px;
  border: 1px solid rgba(201,168,76,0.3);
}
.mols-admin .doc-chip-icon { font-size: 1.1rem; }
.mols-admin .doc-chip-name {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;
}
.mols-admin .doc-chip-remove {
  background: transparent; border: none; color: #fca5a5;
  font-size: 1.1rem; cursor: pointer; padding: 0 2px; line-height: 1;
}

/* Attached documents panel below visa card */
.mols-admin .attachments-panel {
  margin-top: 22px;
  background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 16px;
  padding: 18px 20px;
}
.mols-admin .attachments-title {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.95rem; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--mls-gold); margin: 0 0 14px;
}
.mols-admin .attachments-title::before { content: "◆ "; }
.mols-admin .attachments-grid {
  display: grid; gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}
.mols-admin .attachment-img,
.mols-admin .attachment-file {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: rgba(10,22,40,0.5);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 10px; padding: 8px; text-decoration: none;
  color: var(--mls-cream); font-size: 0.72rem;
  transition: all 0.25s ease;
}
.mols-admin .attachment-img:hover,
.mols-admin .attachment-file:hover {
  border-color: var(--mls-gold);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(201,168,76,0.15);
}
.mols-admin .attachment-img img {
  width: 100%; height: 110px; object-fit: cover; border-radius: 6px;
  border: 1px solid rgba(201,168,76,0.2);
}
.mols-admin .attachment-icon { font-size: 2.5rem; padding: 18px 0 6px; }
.mols-admin .attachment-name {
  width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  text-align: center; letter-spacing: 0.3px;
}
`;
