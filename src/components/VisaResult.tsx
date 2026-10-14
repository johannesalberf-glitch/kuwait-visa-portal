import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import type { VisaRecord } from "@/lib/visa-storage";
const emblemAsset = { url: "/images/kuwait-emblem.webp" };

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function buildMRZ(
  name: string,
  passport: string,
  nationality: string,
  dob: string,
  gender: string,
  expiry: string,
) {
  const clean = (s: string) =>
    s.toUpperCase().replace(/[^A-Z0-9]/g, "<").padEnd(30, "<").slice(0, 30);
  const nat = nationality.slice(0, 3).toUpperCase().padEnd(3, "X");
  const d = (iso: string) => {
    if (!iso) return "000000";
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) return "000000";
    return `${(dt.getFullYear() % 100)
      .toString()
      .padStart(2, "0")}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`;
  };
  const g = gender === "M" ? "M" : gender === "F" ? "F" : "X";
  const l1 = `V<MLS${clean(name)}`.slice(0, 44).padEnd(44, "<");
  const l2 = `${(passport || "")
    .toUpperCase()
    .padEnd(9, "<")
    .slice(0, 9)}0${nat}${d(dob)}0${g}${d(expiry)}0<<<<<<<<<<<<<<`
    .slice(0, 44)
    .padEnd(44, "<");
  return [l1, l2];
}

export function VisaResult({
  record,
  celebrate = true,
  showStatusPanel = false,
}: {
  record: VisaRecord;
  celebrate?: boolean;
  showStatusPanel?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!celebrate) return;
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ["#0d3d66", "#1a5f9e", "#c9a84c", "#e8c96e", "#2e7d32"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1, y: 0.7 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors });
  }, [celebrate]);

  const nameUpper = (record.name || "").toUpperCase();
  const mrz = buildMRZ(
    record.name,
    record.passport,
    record.nationality,
    record.birthDate,
    record.gender,
    record.expiryDate,
  );
  const qrData = encodeURIComponent(
    `MOLS-EVISA-OTP:${record.id}-TRK:${record.tracker || record.id}-${record.passport}-${nameUpper}`,
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;
  const genderText =
    record.gender === "M" ? "Male / ذكر" : record.gender === "F" ? "Female / أنثى" : record.gender;

  return (
    <div ref={cardRef} className="mx-auto w-full max-w-2xl animate-in fade-in zoom-in-95 pt-4 duration-500">
      {showStatusPanel && <VisaStatusPanel record={record} />}

      <div className="mb-4 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-bold"
          style={{ background: "#e8f5e9", color: "#2e7d32", border: "1.5px solid #a5d6a7", fontSize: "1.05rem" }}
        >
          <span>✓</span> Approved &amp; Active · معتمدة وسارية
        </div>
        <p className="mt-3 mb-1 font-semibold text-[#009FDB]" style={{ fontSize: "1.2rem" }}>
          Congratulations · تهانينا
        </p>
        <h2 className="text-2xl font-extrabold text-[#0b2a6b]">
          Visa Information Found · تم العثور على بيانات التأشيرة
        </h2>
        <div className="mt-2 inline-flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <span className="rounded-md bg-blue-50 border border-blue-200 px-3 py-1 font-bold text-[#0b2a6b]">
            OTP Code: {record.id}
          </span>
          {record.tracker && (
            <span className="rounded-md bg-amber-50 border border-amber-200 px-3 py-1 font-bold text-amber-900">
              Tracking Code: {record.tracker}
            </span>
          )}
        </div>
      </div>

      {record.documents && record.documents.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow ring-1 ring-black/5">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-700">Attached Documents · المستندات المرفقة</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
            {record.documents.map((d, i) =>
              d.type.startsWith("image/") ? (
                <a key={i} href={d.dataUrl} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md">
                  <img src={d.dataUrl} alt={d.name} className="h-28 w-full object-cover" />
                  <span className="block truncate px-2 py-1 text-xs text-gray-600">{d.name}</span>
                </a>
              ) : (
                <a key={i} href={d.dataUrl} download={d.name} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:shadow-md">
                  <span>📄</span>
                  <span className="truncate">{d.name}</span>
                </a>
              ),
            )}
          </div>
        </div>
      )}

      <div className="mols-admin mols-user mt-2" style={{ background: "transparent", padding: 0 }}>
        <style>{css}</style>
        <ScaleToFit>
          <div className="visa-card-wrapper active">
            <div className="visa-card">
              <div className="ovi-overlay">
                <div className="ovi-sheen" />
                <div className="ovi-grid" />
                <div className="ovi-guilloche" />
                <div className="ovi-emblem-pattern" style={{ backgroundImage: `url(${emblemAsset.url})` }} />
                <div className="ovi-kinegram">MOI · وزارة الداخلية</div>
              </div>
              <div className="card-header">
                <div className="header-left">
                  <h2>KUWAIT MINISTRY</h2>
                  <p>Of Interior · Electronic Visa</p>
                </div>
                <div className="emblem">
                  <img src={emblemAsset.url} alt="Kuwait emblem" className="emblem-img" />
                </div>
                <div className="header-right">
                  <h2>وزارة الداخلية الكويتية</h2>
                  <p>التأشيرة الإلكترونية</p>
                </div>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-section">
                    <div className="info-item">
                      <span className="info-label">Full Name · الاسم الكامل</span>
                      <span className="info-value">{nameUpper}</span>
                      {record.nameAr && (
                        <span className="info-value" dir="rtl" style={{ fontSize: "0.88rem", color: "#1a5f9e" }}>
                          {record.nameAr}
                        </span>
                      )}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Nationality · الجنسية</span>
                      <span className="info-value">{record.nationality}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Passport No. · رقم الجواز</span>
                      <span className="info-value highlight">{(record.passport || "").toUpperCase()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Occupation · المهنة</span>
                      <span className="info-value">{record.occupation}</span>
                      {record.occupationAr && (
                        <span className="info-value" dir="rtl" style={{ fontSize: "0.85rem", color: "#1a5f9e" }}>
                          {record.occupationAr}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="info-section">
                    <div className="photo-qr-section">
                      <div className="photo-box">
                        {record.photo ? <img src={record.photo} alt="Applicant" /> : <span className="photo-placeholder">👤</span>}
                        <div className="photo-label">OFFICIAL · رسمي</div>
                      </div>
                      <div className="qr-box">
                        <img src={qrUrl} alt="QR" />
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Visa Type · نوع التأشيرة</span>
                      <span className="info-value">{record.visaType}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">OTP / Visa No. · رقم التأشيرة</span>
                      <span className="info-value highlight" style={{ color: "#0d3d66" }}>{record.id}</span>
                    </div>
                    {record.tracker && (
                      <div className="info-item">
                        <span className="info-label">Tracking Code · رقم التتبع</span>
                        <span className="info-value highlight" style={{ color: "#1a5f9e" }}>{record.tracker}</span>
                      </div>
                    )}
                  </div>
                  <div className="info-section">
                    <div className="info-item">
                      <span className="info-label">Date of Birth · تاريخ الميلاد</span>
                      <span className="info-value date-block">{fmtDate(record.birthDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender · الجنس</span>
                      <span className="info-value">{genderText}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Issue Date · تاريخ الإصدار</span>
                      <span className="info-value date-block">{fmtDate(record.issueDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Expiry Date · تاريخ الانتهاء</span>
                      <span className="info-value date-block" style={{ color: "#b45309" }}>{fmtDate(record.expiryDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="mrz-section">
                  <div className="mrz-line">{mrz[0]}</div>
                  <div className="mrz-line">{mrz[1]}</div>
                </div>
              </div>
              <div className="card-footer">
                <p>KUWAIT MINISTRY OF INTERIOR · وزارة الداخلية الكويتية</p>
                <span className="status-badge">APPROVED · معتمدة</span>
              </div>
            </div>
          </div>
        </ScaleToFit>
      </div>
    </div>
  );
}

function VisaStatusPanel({ record }: { record: VisaRecord }) {
  const nameUpper = (record.name || "").toUpperCase();
  const genderText =
    record.gender === "M" ? "Male / ذكر" : record.gender === "F" ? "Female / أنثى" : record.gender;
  const Field = ({ en, ar, value, accent }: { en: string; ar: string; value: string; accent?: string }) => (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
      <div className="text-[11px] text-slate-500">
        {en} / <span dir="rtl">{ar}</span>
      </div>
      <div className={`mt-1 text-sm font-bold ${accent ?? "text-slate-900"}`}>{value}</div>
    </div>
  );
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-black/5">
      <div className="bg-gradient-to-br from-[#1a5f9e] to-[#0d3d66] px-6 py-6 text-white">
        <h2 className="text-2xl font-extrabold tracking-tight">Visa Application Status</h2>
        <p className="mt-1 text-sm text-blue-100">Official State of Kuwait eVisa Portal</p>
      </div>
      <div className="p-5">
        <div className="mb-5 flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-blue-200 bg-slate-100">
            {record.photo ? (
              <img src={record.photo} alt={nameUpper} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">👤</div>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-extrabold text-slate-900">{nameUpper}</div>
            <div className="text-xs text-slate-500">
              Nationality: <span className="font-semibold text-slate-700">{record.nationality}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field en="OTP / Visa Number" ar="رقم التأشيرة" value={record.id} accent="text-blue-700" />
          <Field en="Tracking Code" ar="رقم التتبع" value={record.tracker || record.id} accent="text-amber-700" />
          <Field en="Passport" ar="رقم الجواز" value={(record.passport || "").toUpperCase()} />
          <Field en="Gender" ar="الجنس" value={genderText} />
          <div className="sm:col-span-2">
            <Field en="Visa Type" ar="نوع التأشيرة" value={record.visaType} />
          </div>
          <div className="sm:col-span-2">
            <Field en="Occupation" ar="المهنة" value={record.occupation} />
          </div>
          <Field en="Birth Date" ar="تاريخ الميلاد" value={record.birthDate} />
          <Field en="Issue Date" ar="تاريخ الإصدار" value={record.issueDate} />
          <Field en="Expiry Date" ar="تاريخ الانتهاء" value={record.expiryDate} accent="text-amber-600" />
        </div>
        <div className="mt-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            ✓ Approved &amp; Active
          </span>
        </div>
      </div>
    </div>
  );
}

function ScaleToFit({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const DESIGN_WIDTH = 720;
    const sync = () => {
      const card = inner.querySelector(".visa-card") as HTMLElement | null;
      if (!card) return;
      const available = outer.clientWidth;
      const scale = Math.min(1, available / DESIGN_WIDTH);
      card.style.transformOrigin = "top left";
      card.style.transform = scale < 1 ? `scale(${scale})` : "";
      (card.parentElement as HTMLElement).style.width = DESIGN_WIDTH + "px";
      outer.style.height = card.offsetHeight * scale + "px";
    };
    const ro = new ResizeObserver(sync);
    ro.observe(outer);
    const card = inner.querySelector(".visa-card");
    if (card) ro.observe(card);
    window.addEventListener("resize", sync);
    sync();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);
  return (
    <div ref={outerRef} className="mols-scale-outer" style={{ width: "100%", overflow: "hidden" }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

const css = `
.mols-admin { --mls-blue: #1a5f9e; --mls-blue-dark: #0d3d66; --mls-blue-light: #e8f1f8; --mls-gold: #c9a84c; --mls-gold-bright: #e8c96e; --mls-cream: #f5f0e6; --mls-green: #2e7d32; --mls-border: #d4c9b0; color: #333; font-family: 'Inter', 'Noto Sans Arabic', system-ui, sans-serif; }
.mols-admin .visa-card-wrapper { margin-top: 12px; }
.mols-admin .visa-card-wrapper.active { animation: molsFadeUp 0.7s cubic-bezier(0.22,1,0.36,1); }
@keyframes molsFadeUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: none; } }
.mols-admin .visa-card { background: linear-gradient(165deg, #faf7f0 0%, #f5f0e6 40%, #ede8db 100%); border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.3); overflow: hidden; border: 1px solid var(--mls-border); position: relative; color: #333; width: 100%; }
.mols-admin .visa-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, var(--mls-blue) 0%, var(--mls-gold) 35%, var(--mls-gold-bright) 50%, var(--mls-gold) 65%, var(--mls-blue) 100%); z-index: 10; }
.mols-admin .ovi-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; border-radius: 20px; }
.mols-admin .ovi-sheen { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.08) 15deg, rgba(0,191,255,0.06) 30deg, transparent 90deg, transparent 360deg); animation: molsOviRotate 10s linear infinite; mix-blend-mode: overlay; pointer-events: none; }
@keyframes molsOviRotate { to { transform: rotate(360deg); } }
.mols-admin .ovi-grid { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,168,76,0.04) 2px, rgba(201,168,76,0.04) 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(10,22,40,0.03) 2px, rgba(10,22,40,0.03) 3px); pointer-events: none; }
.mols-admin .ovi-guilloche { position: absolute; inset: 0; background: radial-gradient(ellipse at 15% 25%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(10,22,40,0.05) 0%, transparent 50%); pointer-events: none; }
.mols-admin .ovi-kinegram { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-family: 'Cinzel', Georgia, serif; font-size: 3.5rem; font-weight: 900; letter-spacing: 16px; color: rgba(201,168,76,0.06); white-space: nowrap; pointer-events: none; z-index: 1; user-select: none; }
.mols-admin .card-header { background: linear-gradient(135deg, var(--mls-blue-light) 0%, #d4e6f1 100%); padding: 22px 32px; display: flex; justify-content: space-between; align-items: center; gap: 16px; border-bottom: 2px solid var(--mls-gold); position: relative; z-index: 2; }
.mols-admin .header-left h2 { font-family: 'Cinzel', Georgia, serif; color: var(--mls-blue); font-size: 1.2rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
.mols-admin .header-left p { color: #5a7a94; font-size: 0.72rem; margin-top: 3px; letter-spacing: 2px; text-transform: uppercase; }
.mols-admin .header-right { text-align: right; }
.mols-admin .header-right h2 { color: var(--mls-blue); font-size: 1.3rem; font-weight: 700; margin: 0; }
.mols-admin .header-right p { color: #5a7a94; font-size: 0.85rem; margin-top: 3px; }
.mols-admin .emblem { width: 96px; height: 72px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
.mols-admin .emblem-img { width: 100%; height: 100%; object-fit: contain; background: radial-gradient(circle at 50% 50%, rgba(13,61,102,0.9), rgba(13,61,102,0.7)); padding: 6px; border-radius: 10px; border: 1px solid rgba(201,168,76,0.4); }
.mols-admin .card-body { padding: 28px 32px; position: relative; z-index: 2; }
.mols-admin .watermark { display: none; }
.mols-admin .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 22px; position: relative; z-index: 3; }
.mols-admin .info-section { display: flex; flex-direction: column; gap: 10px; }
.mols-admin .info-item { display: flex; flex-direction: column; }
.mols-admin .info-label { font-size: 0.65rem; font-weight: 700; color: #5a7a94; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; }
.mols-admin .info-value { font-family: 'Playfair Display', Georgia, serif; font-size: 0.95rem; font-weight: 600; color: var(--mls-blue-dark); word-break: break-word; }
.mols-admin .info-value.highlight { font-family: ui-monospace, monospace; font-size: 1.05rem; font-weight: 700; color: var(--mls-blue); letter-spacing: 1px; background: transparent !important; padding: 0 !important; }
.mols-admin .info-value.date-block { font-family: ui-monospace, monospace; font-size: 0.9rem; }
.mols-admin .photo-qr-section { display: flex; gap: 12px; margin-bottom: 6px; }
.mols-admin .photo-box { width: 100px; height: 125px; background: #f0ebe0; border: 2px solid #c8dce8; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.mols-admin .photo-box img { width: 100%; height: 100%; object-fit: cover; }
.mols-admin .photo-placeholder { font-size: 2.5rem; }
.mols-admin .photo-label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(90deg, var(--mls-blue), var(--mls-blue-dark)); color: white; font-size: 0.55rem; text-align: center; padding: 3px; letter-spacing: 1px; font-weight: 600; }
.mols-admin .qr-box { width: 100px; height: 100px; background: white; border: 2px solid #c8dce8; border-radius: 10px; padding: 4px; }
.mols-admin .qr-box img { width: 100%; height: 100%; }
.mols-admin .mrz-section { background: linear-gradient(90deg, #f0f4f8, #e8f1f8, #f0f4f8); padding: 14px 20px; border-radius: 10px; margin-top: 18px; border: 1px solid #d0e3f0; z-index: 3; position: relative; }
.mols-admin .mrz-line { font-family: ui-monospace, monospace; font-size: 0.78rem; font-weight: 700; color: var(--mls-blue-dark); letter-spacing: 2px; line-height: 1.8; word-break: break-all; }
.mols-admin .card-footer { background: linear-gradient(135deg, #f5f9fc, #e8f1f8); padding: 14px 32px; border-top: 2px solid var(--mls-gold); display: flex; justify-content: space-between; align-items: center; z-index: 2; position: relative; flex-wrap: wrap; gap: 10px; }
.mols-admin .card-footer p { font-size: 0.72rem; color: #5a7a94; letter-spacing: 1.5px; margin: 0; }
.mols-admin .status-badge { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); color: var(--mls-green); padding: 6px 14px; border-radius: 25px; font-size: 0.75rem; font-weight: 700; border: 1px solid #a5d6a7; letter-spacing: 1px; }
.mols-admin .status-badge::before { content: ""; width: 8px; height: 8px; background: var(--mls-green); border-radius: 50%; }
.mols-admin .ovi-emblem-pattern { position: absolute; inset: 0; background-repeat: repeat; background-size: 78px 78px; opacity: 0.09; mix-blend-mode: multiply; pointer-events: none; z-index: 1; }
`;
