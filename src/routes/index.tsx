import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { findVisa, type VisaRecord } from "@/lib/visa-storage";
import { VisaResult } from "@/components/VisaResult";

export const Route = createFileRoute("/")({
  component: KuwaitVisaPortalLanding,
  head: () => ({
    meta: [
      { title: "Kuwait Visa Portal — State of Kuwait" },
      {
        name: "description",
        content:
          "Official Electronic Visa Portal of the State of Kuwait — Ministry of Interior.",
      },
    ],
    links: [
      { rel: "stylesheet", href: "/styles-LVM4KISH.css" },
      { rel: "stylesheet", href: "/css/component-styles.css" },
    ],
  }),
});

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    const parts = iso.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : iso;
  }
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
    (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "<").padEnd(38, "<").slice(0, 38);
  const nat = (nationality || "KWT").slice(0, 3).toUpperCase().padEnd(3, "X");
  const d = (iso: string) => {
    if (!iso) return "000000";
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) {
      const c = iso.replace(/\D/g, "");
      return c.length >= 6 ? c.slice(-6) : "000000";
    }
    return `${(dt.getFullYear() % 100).toString().padStart(2, "0")}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`;
  };
  const isFemale =
    gender === "F" ||
    (gender || "").toLowerCase().includes("female") ||
    (gender || "").includes("أنثى");
  const g = isFemale ? "F" : "M";
  const l1 = `V<MLS<${clean(name)}`.slice(0, 44).padEnd(44, "<");
  const l2 = `${(passport || "").toUpperCase().padEnd(9, "<").slice(0, 9)}0${nat}${d(dob)}0${g}${d(expiry)}0<<<<<<<<<<<<<<`
    .slice(0, 44)
    .padEnd(44, "<");
  return [l1, l2];
}

const VISA_TABS = [
  {
    title: "Tourist Visa",
    desc: "Select the type of visa you wish to apply to visit Kuwait. To enter the State of Kuwait for tourism and leisure.",
    icon: "/assets/images/dashboard/tourist.png",
  },
  {
    title: "Family Visit Visa",
    desc: "Issued for visitors joining family members residing legally in Kuwait. Subject to first- and second-degree sponsorship rules.",
    icon: "/assets/images/dashboard/family.png",
  },
  {
    title: "Business Visa",
    desc: "Designed for commercial visits, business meetings, and professional missions sponsored by an authorized Kuwaiti entity.",
    icon: "/assets/images/dashboard/business.png",
  },
  {
    title: "Government Visa",
    desc: "Official entry permits processed for state delegations, ministries, and diplomatic mission representatives.",
    icon: "/assets/images/dashboard/government.png",
  },
];

const FAQS = [
  {
    q: "What types of visas are available for entry into Kuwait?",
    a: "We offer various types of visas, including Tourist Visa (for tourism and leisure), Family Visit Visa (for relatives), Business Visa (commercial activities), and Government Visa (diplomatic and official state missions). Please select the appropriate visa type based on your travel purpose.",
  },
  {
    q: "What are the requirements for obtaining a Kuwait tourist visa?",
    a: "Requirements vary by nationality. Generally, you need a passport valid for at least 6 months, a recent passport-sized photo on a white background, confirmed return flight tickets, and a completed online application through this portal.",
  },
  {
    q: "Can I apply for a visa online?",
    a: "Yes! Eligible nationalities, GCC residents, and holders of valid US, UK, or Schengen visas can apply directly online through this portal and receive their approved eVisa by email.",
  },
  {
    q: "How long does it take to process a visa application?",
    a: "Electronic visa applications are usually processed within 1 to 3 business days (Sunday through Thursday, Kuwait official working hours). You can check your application status anytime using your 6-digit OTP code.",
  },
  {
    q: "Can I extend my visa while in Kuwait?",
    a: "Certain visit visas can be extended through the General Administration of Residence Affairs before expiration. An extension fee applies. Overstaying incurs official administrative penalties.",
  },
];

function KuwaitVisaPortalLanding() {
  const navigate = useNavigate();
  const [topInput, setTopInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeRecord, setActiveRecord] = useState<VisaRecord | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Theme & Language
  const [isDark, setIsDark] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

  // Interactive Tabs
  const [activeTab, setActiveTab] = useState(0);
  const [entryType, setEntryType] = useState<"single" | "multiple">("single");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Modals
  const [modal, setModal] = useState<"apply" | "verify" | "pay" | null>(null);
  const [modalInput, setModalInput] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Eligibility Checker
  const [eligNat, setEligNat] = useState("USA");
  const [eligCat, setEligCat] = useState("Valid_Tourist");

  // Contact form
  const [contactSuccess, setContactSuccess] = useState(false);

  const trackerResultRef = useRef<HTMLDivElement>(null);

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("phoenixTheme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-bs-theme", "dark");
    }
  }, []);

  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("phoenixTheme", "dark");
    } else {
      document.documentElement.removeAttribute("data-bs-theme");
      localStorage.setItem("phoenixTheme", "light");
    }
  }

  function toggleLanguage() {
    const nextAr = !isArabic;
    setIsArabic(nextAr);
    if (nextAr) {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }

  async function handleSearch(codeToSearch?: string) {
    const query = (codeToSearch ?? topInput).trim();
    if (!query) return;

    setLoading(true);
    setSearchError(null);

    const cleanOtp = query.replace(/\D/g, "").slice(0, 6);

    try {
      // 1. First attempt exact 6-digit OTP search in Supabase database
      let res: VisaRecord | null = null;
      if (cleanOtp.length === 6) {
        res = await findVisa(cleanOtp);
      }

      if (res) {
        setActiveRecord(res);
        setShowResult(true);
        setTimeout(() => {
          trackerResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else {
        // Fallback: If not found in DB with that specific code, show clear guidance
        setSearchError(
          `No visa record found for code "${query}". Please check the 6-digit OTP number or create one in the Admin portal.`,
        );
        setShowResult(false);
      }
    } catch {
      setSearchError("Unable to verify visa at this time. Please check your connection and try again.");
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  }

  function onFormSubmit(e: FormEvent) {
    e.preventDefault();
    handleSearch();
  }

  async function handleModalVerify(e: FormEvent) {
    e.preventDefault();
    const query = modalInput.trim();
    if (!query) return;

    setModalLoading(true);
    setModalError(null);
    const cleanOtp = query.replace(/\D/g, "").slice(0, 6);

    try {
      if (cleanOtp.length === 6) {
        const res = await findVisa(cleanOtp);
        if (res) {
          setActiveRecord(res);
          setShowResult(true);
          setModal(null);
          setTimeout(() => {
            trackerResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
          return;
        }
      }
      setModalError(`No record found for "${query}". Please check the 6-digit OTP number.`);
    } catch {
      setModalError("Verification service temporarily unavailable.");
    } finally {
      setModalLoading(false);
    }
  }

  const gccCountries = ["SAU", "ARE", "QAT", "BHR", "OMN"];
  const eVisas = ["USA", "GBR", "CAN", "FRA", "DEU", "ITA", "ESP", "JPN", "AUS"];
  const isEligible = gccCountries.includes(eligNat) || eVisas.includes(eligNat) || eligCat === "Valid_Tourist";

  return (
    <div className={`kuwait-portal ${isDark ? "theme-dark" : "theme-light"}`}>
      <style>{portalCss}</style>

      {/* HEADER */}
      <header className="header">
        <div className="container-fluid d-flex justify-content-center px-3 px-xl-5">
          <div className="d-flex justify-content-between align-items-center w-100 py-2.5" style={{ maxWidth: 1300 }}>
            {/* Logo */}
            <div className="d-flex align-items-center gap-2">
              <img src="/assets/icons/kuwait-visa-logo.svg" className="logo" alt="Kuwait Visa Logo" />
              <div className="d-flex flex-column leading-none">
                <span className="ibm-bold heading-4 text-blue-1" style={{ fontSize: "1.45rem", color: "#0C568C", fontWeight: 800 }}>
                  Kuwait
                </span>
                <span className="ibm-regular heading-4 text-blue-2" style={{ fontSize: "1.45rem", color: "#1C75BC", marginTop: -6 }}>
                  Visa
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center gap-3">
              {/* Language Switch */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 c-pointer hover"
              >
                <span className="text-2 ibm-medium text-blue-1 mb-0" style={{ fontWeight: 600, color: "#0C568C" }}>
                  {isArabic ? "English" : "العربية"}
                </span>
                <img src="/assets/icons/globe.svg" className="action-icon" alt="Language" />
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-link text-decoration-none p-1 d-flex align-items-center c-pointer hover"
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                <img
                  src={isDark ? "/assets/icons/night-theme.svg" : "/assets/icons/day-theme.svg"}
                  alt="Theme"
                  className="action-icon"
                />
              </button>

              {/* Admin Sign-In */}
              <Link
                to="/admin"
                className="d-flex align-items-center c-pointer hover text-decoration-none"
                style={{
                  background: "rgba(0, 169, 233, 0.08)",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "2rem",
                }}
                title="Go to Admin Portal"
              >
                <img src="/assets/icons/enter.svg" className="action-icon" alt="Sign-in" />
                <span className="text-1 ibm-medium text-blue-1 ms-2" style={{ fontWeight: 600, color: "#0C568C" }}>
                  Admin
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="d-flex justify-content-center">
        <div id="main-content" className="main-content mx-3 mx-xl-0 overflow-hidden" style={{ minHeight: "85vh" }}>
          <div className="dashboard-container mb-8 mb-lg-13">

            {/* ==============================================
                 TOP CODE TRACKER BAR & RESULT DISPLAY AREA
                 ============================================== */}
            <div className="top-tracker-container mb-6 p-4 p-md-5 rounded-5 evisa-bg-white shadow-sm" style={{ border: "2px solid #009FDB33", background: "#ffffff" }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                <div>
                  <h4 className="mb-0 text-blue-1 ibm-bold" style={{ fontSize: "1.4rem", color: "#0C568C", fontWeight: 800 }}>
                    Electronic Visa &amp; Code Tracker
                  </h4>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.95rem" }}>
                    Enter any 6-digit OTP number or passport code to verify official visa records and view issued electronic card
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <span
                    className="badge rounded-pill px-3 py-2 text-xs font-semibold"
                    style={{ background: "rgba(37, 176, 3, 0.1)", color: "#1C6C09", border: "1px solid #90D67F", fontSize: "0.9rem" }}
                  >
                    ✓ Real-time Verified System
                  </span>
                </div>
              </div>

              {/* Tracker Form */}
              <form onSubmit={onFormSubmit} className="d-flex flex-column flex-sm-row gap-2 mt-2">
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    value={topInput}
                    onChange={(e) => setTopInput(e.target.value)}
                    className="form-control px-4 py-3 rounded-4 font-monospace"
                    style={{
                      border: "2px solid #009FDB",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                    placeholder="Enter 6-Digit OTP Number (e.g. 582914, 847192)..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-1 px-5 py-3 rounded-4 d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: "1.15rem", fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  <span>{loading ? "Verifying…" : "Track Visa"}</span>
                  <img
                    src="/assets/icons/right-circle-arrow.svg"
                    style={{ width: 22, filter: "brightness(0) invert(1)" }}
                    alt=""
                  />
                </button>
              </form>

              {/* Error Alert */}
              {searchError && (
                <div className="mt-4 p-3 rounded-3 alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <span>⚠️</span>
                  <span>{searchError}</span>
                </div>
              )}

              {/* ==============================================
                   RESULT DISPLAY AREA (AUTHENTIC GENERATED EVISA)
                   ============================================== */}
              {showResult && activeRecord && (
                <div ref={trackerResultRef} id="trackerResultArea" className="mt-5 pt-4 border-top" style={{ borderColor: "#d8e2ef" }}>
                  <VisaResult record={activeRecord} celebrate={true} />
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn-1 px-5 py-2.5 rounded-4 d-flex align-items-center gap-2"
                      style={{ fontWeight: 700 }}
                    >
                      <span>🖨 Print Official Visa Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/visa/$id", params: { id: activeRecord.id } })}
                      className="btn btn-outline-primary px-4 py-2.5 rounded-4 font-bold"
                    >
                      Full Details View ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResult(false)}
                      className="btn btn-secondary px-4 py-2.5 rounded-4"
                    >
                      Close Result
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ==============================================
                 1. APP-TILE-1 (HERO WITH BACKGROUND VIDEO & STEPS)
                 ============================================== */}
            <div className="rounded-5 evisa-bg-white overflow-hidden tile-1 d-flex justify-content-center align-items-end p-6 p-sm-12 py-12 position-relative">
              <div className="overlay"></div>
              <video
                playsInline
                autoPlay
                loop
                muted
                preload="auto"
                poster="/assets/video/tile1-bg-thumb.png"
                className="w-100 position-absolute inset-0 h-100"
                style={{ objectFit: "cover", zIndex: 0 }}
              >
                <source src="/assets/video/tile1-bg-video.mp4" type="video/mp4" />
              </video>
              <div className="position-relative z-3 text-center w-100">
                <p className="text-white heading mb-7 d-flex justify-content-center">
                  <span className="ibm-bold" style={{ fontWeight: 700, fontSize: "2.1rem", textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>
                    Apply for your visa in a few simple steps..
                  </span>
                </p>
                <div className="steps d-flex flex-column align-items-start text-start mx-auto" style={{ maxWidth: 550 }}>
                  <div className="text-white sub-points d-flex align-items-center mb-2.5">
                    <span className="liquid-glass-icon"><img src="/assets/icons/profile-white.svg" alt="" /></span>
                    <span className="mx-2" style={{ fontSize: "1.25rem", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                      1. Create your account
                    </span>
                  </div>
                  <div className="text-white sub-points d-flex align-items-center mb-2.5">
                    <span className="liquid-glass-icon"><img src="/assets/icons/doc-white.svg" alt="" /></span>
                    <span className="mx-2" style={{ fontSize: "1.25rem", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                      2. Complete your profile
                    </span>
                  </div>
                  <div className="text-white sub-points d-flex align-items-center mb-2.5">
                    <span className="liquid-glass-icon"><img src="/assets/icons/doc-success-white.svg" alt="" /></span>
                    <span className="mx-2" style={{ fontSize: "1.25rem", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                      3. Submit your visa application
                    </span>
                  </div>
                  <div className="text-white sub-points d-flex align-items-center mb-2.5">
                    <span className="liquid-glass-icon"><img src="/assets/icons/bell-white.svg" alt="" /></span>
                    <span className="mx-2" style={{ fontSize: "1.25rem", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                      4. Track real-time updates
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-center flex-wrap gap-3 mt-6">
                  <button
                    type="button"
                    className="liquid-glass-button text-white px-4 py-2"
                    onClick={() => setModal("apply")}
                  >
                    <span className="mx-2 ibm-semibold mb-1" style={{ fontSize: "1.15rem" }}>Apply for eVisa</span>
                    <img src="/assets/icons/double-arrow-white.svg" style={{ rotate: "180deg", width: 18 }} alt="" />
                  </button>
                  <button
                    type="button"
                    className="liquid-glass-button text-white px-4 py-2"
                    onClick={() => setModal("verify")}
                  >
                    <span className="mx-2 ibm-semibold mb-1" style={{ fontSize: "1.15rem" }}>Verify eVisa Status</span>
                    <img src="/assets/icons/doc-white.svg" style={{ width: 18 }} alt="" />
                  </button>
                  <button
                    type="button"
                    className="liquid-glass-button text-white px-4 py-2"
                    onClick={() => setModal("pay")}
                  >
                    <span className="mx-2 ibm-semibold mb-1" style={{ fontSize: "1.15rem" }}>Pay Visa Fees</span>
                    <img src="/assets/icons/doc-success-white.svg" style={{ width: 18 }} alt="" />
                  </button>
                </div>
              </div>
            </div>

            {/* ==============================================
                 2. APP-VISA-COUNTS (STATISTICS TILES)
                 ============================================== */}
            <div className="mt-8 mt-md-14">
              <div className="grid-container">
                <div className="grid-item evisa-bg-white rounded-5 d-flex flex-column align-items-center py-7 shadow-sm">
                  <div className="icon mb-2"><img src="/assets/images/dashboard/tourist.png" alt="Tourist Visa" /></div>
                  <p className="ibm-semibold heading-4 text-blue-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>Tourist Visa</p>
                  <div className="d-flex">
                    <p className="linear-gradient-text ibm-bold heading-2 mx-2" style={{ fontSize: 40, fontWeight: 800 }}>2.4</p>
                    <p className="text-3 align-self-end ibm-semibold text-blue-3" style={{ marginBottom: "12px", fontSize: "1.1rem", fontWeight: 700 }}>Million</p>
                  </div>
                  <p className="text-1 text-blue-2 ibm-regular" style={{ color: "#748194" }}>Total Issued Visas</p>
                </div>

                <div className="grid-item evisa-bg-white rounded-5 d-flex flex-column align-items-center py-7 shadow-sm">
                  <div className="icon mb-2"><img src="/assets/images/dashboard/family.png" alt="Family Visit Visa" /></div>
                  <p className="ibm-semibold heading-4 text-blue-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>Family Visit Visa</p>
                  <div className="d-flex">
                    <p className="linear-gradient-text ibm-bold heading-2 mx-2" style={{ fontSize: 40, fontWeight: 800 }}>850</p>
                    <p className="text-3 align-self-end ibm-semibold text-blue-3" style={{ marginBottom: "12px", fontSize: "1.1rem", fontWeight: 700 }}>Thousand</p>
                  </div>
                  <p className="text-1 text-blue-2 ibm-regular" style={{ color: "#748194" }}>Total Issued Visas</p>
                </div>

                <div className="grid-item evisa-bg-white rounded-5 d-flex flex-column align-items-center py-7 shadow-sm">
                  <div className="icon mb-2"><img src="/assets/images/dashboard/business.png" alt="Business Visa" /></div>
                  <p className="ibm-semibold heading-4 text-blue-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>Business Visa</p>
                  <div className="d-flex">
                    <p className="linear-gradient-text ibm-bold heading-2 mx-2" style={{ fontSize: 40, fontWeight: 800 }}>320</p>
                    <p className="text-3 align-self-end ibm-semibold text-blue-3" style={{ marginBottom: "12px", fontSize: "1.1rem", fontWeight: 700 }}>Thousand</p>
                  </div>
                  <p className="text-1 text-blue-2 ibm-regular" style={{ color: "#748194" }}>Total Issued Visas</p>
                </div>

                <div className="grid-item evisa-bg-white rounded-5 d-flex flex-column align-items-center py-7 shadow-sm">
                  <div className="icon mb-2"><img src="/assets/images/dashboard/government.png" alt="Government Visa" /></div>
                  <p className="ibm-semibold heading-4 text-blue-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>Government Visa</p>
                  <div className="d-flex">
                    <p className="linear-gradient-text ibm-bold heading-2 mx-2" style={{ fontSize: 40, fontWeight: 800 }}>110</p>
                    <p className="text-3 align-self-end ibm-semibold text-blue-3" style={{ marginBottom: "12px", fontSize: "1.1rem", fontWeight: 700 }}>Thousand</p>
                  </div>
                  <p className="text-1 text-blue-2 ibm-regular" style={{ color: "#748194" }}>Total Issued Visas</p>
                </div>
              </div>
            </div>

            {/* ==============================================
                 3. APP-VISA-TYPES (ELIGIBILITY CHECKER)
                 ============================================== */}
            <div className="visa-types-tab rounded-5 mt-8 mt-md-14 evisa-bg-white p-4 p-md-8 shadow-sm">
              <div className="tabs">
                <ul className="px-0 mb-0 d-flex flex-row justify-content-between align-items-end" style={{ listStyle: "none" }}>
                  {VISA_TABS.map((tab, idx) => (
                    <li
                      key={tab.title}
                      className="tab-item text-center flex-grow-1"
                      onClick={() => setActiveTab(idx)}
                    >
                      <div className={`tab-header py-3 d-flex align-items-center justify-content-center flex-column flex-sm-row ${activeTab === idx ? "active" : ""}`}>
                        <img src={tab.icon} style={{ width: 32, height: 32, margin: "0 0.5rem" }} alt="" />
                        <span className="heading-3 ibm-semibold" style={{ color: "#0C568C" }}>{tab.title}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="slider" style={{ transform: `translateX(${activeTab * 100}%)` }}>
                  <div className="indicator evisa-blue-filter-4"></div>
                </div>

                <div className="tab-content d-flex justify-content-center px-4 px-lg-0 mt-6">
                  <div className="col-12 col-sm-10 col-md-8 col-lg-6 py-5 py-md-8">
                    <div className="sub-visa-selector">
                      <div
                        className="sub-visa-type p-6 p-lg-8 rounded-5"
                        style={{ border: "2px solid #009FDB", background: "rgba(0, 169, 233, 0.04)" }}
                      >
                        <p className="mb-3 heading-2 linear-gradient-text ibm-semibold" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                          {VISA_TABS[activeTab].title}
                        </p>
                        <p className="mb-0 text-2 text-blue-2" style={{ color: "#4F5362", lineHeight: 1.6 }}>
                          {VISA_TABS[activeTab].desc}
                        </p>
                      </div>
                    </div>

                    {/* Eligibility Form */}
                    <div className="check-eligibility-form px-lg-4 w-100 mx-auto mt-6">
                      <div className="mt-4">
                        <label className="form-label text-blue-2 ibm-medium" style={{ fontWeight: 600, color: "#0C568C", marginBottom: "0.5rem", display: "block" }}>
                          Select Nationality
                        </label>
                        <select
                          value={eligNat}
                          onChange={(e) => setEligNat(e.target.value)}
                          className="form-select form-control px-4 py-3 rounded-4"
                          style={{ border: "1px solid #009FDB80", width: "100%", fontSize: "1.05rem", height: 48 }}
                        >
                          <option value="USA">United States of America</option>
                          <option value="GBR">United Kingdom</option>
                          <option value="CAN">Canada</option>
                          <option value="FRA">France</option>
                          <option value="DEU">Germany</option>
                          <option value="ITA">Italy</option>
                          <option value="ESP">Spain</option>
                          <option value="JPN">Japan</option>
                          <option value="AUS">Australia</option>
                          <option value="SAU">Saudi Arabia (GCC)</option>
                          <option value="ARE">United Arab Emirates (GCC)</option>
                          <option value="QAT">Qatar (GCC)</option>
                          <option value="BHR">Bahrain (GCC)</option>
                          <option value="OMN">Oman (GCC)</option>
                          <option value="TUR">Turkey</option>
                          <option value="IND">India</option>
                          <option value="PAK">Pakistan</option>
                          <option value="PHL">Philippines</option>
                          <option value="EGY">Egypt</option>
                          <option value="ETH">Ethiopia</option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <label className="form-label text-blue-2 ibm-medium" style={{ fontWeight: 600, color: "#0C568C", marginBottom: "0.5rem", display: "block" }}>
                          Select Region / Category
                        </label>
                        <select
                          value={eligCat}
                          onChange={(e) => setEligCat(e.target.value)}
                          className="form-select form-control px-4 py-3 rounded-4"
                          style={{ border: "1px solid #009FDB80", width: "100%", fontSize: "1.05rem", height: 48 }}
                        >
                          <option value="Valid_Tourist">US, UK, or Schengen valid visa holder</option>
                          <option value="GCC">GCC Resident / Profession</option>
                          <option value="Others">Others / Direct eVisa</option>
                        </select>
                      </div>

                      {/* Result Box */}
                      <div className="py-4">
                        <div
                          className="p-4 rounded-4 text-center"
                          style={{
                            background: isEligible ? "rgba(37, 176, 3, 0.08)" : "rgba(229, 120, 11, 0.08)",
                            border: isEligible ? "1px solid #90D67F" : "1px solid #FFCC85",
                          }}
                        >
                          <p
                            className="mb-0 text-2 eligibility-status ibm-semibold"
                            style={{ color: isEligible ? "#1C6C09" : "#BC3803", fontSize: "1.15rem" }}
                          >
                            {isEligible
                              ? "✓ Applicant is eligible for applying visa on arrival or online e-visa"
                              : "ℹ Online eVisa requires sponsor or valid US/UK/Schengen visa. You may apply through the Kuwait embassy."}
                          </p>
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setModal("apply")}
                          className="btn-1 p-3 px-6 rounded-5 mt-2 w-100 d-flex align-items-center justify-content-center"
                          style={{ fontSize: "1.25rem" }}
                        >
                          <span>Apply Now</span>
                          <img
                            src="/assets/icons/right-circle-arrow.svg"
                            className="right-arrow ms-2"
                            style={{ width: 24, filter: "brightness(0) invert(1)" }}
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==============================================
                 4. APP-ENTRY-TYPES (VISA INSTRUCTIONS)
                 ============================================== */}
            <div className="p-5 px-4 px-xl-7 py-xl-8 evisa-bg-white rounded-5 visa-instructions-container mt-8 mt-md-14 shadow-sm">
              <p className="heading-2 ibm-semibold pb-4 linear-gradient-text" style={{ fontSize: "2rem", fontWeight: 700 }}>
                Visa Instructions
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                <button
                  type="button"
                  className={`tab-button py-2 rounded-5 px-5 ${entryType === "single" ? "btn-1" : "btn-secondary"}`}
                  onClick={() => setEntryType("single")}
                >
                  Single Entry
                </button>
                <button
                  type="button"
                  className={`tab-button py-2 rounded-5 px-5 ${entryType === "multiple" ? "btn-1" : "btn-secondary"}`}
                  onClick={() => setEntryType("multiple")}
                >
                  Multiple Entry
                </button>
              </div>

              <div className="gap-5 mt-4 sub-items-container d-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", width: "100%" }}>
                <div className="sub-item p-4 rounded-5" style={{ border: "2px solid #009fdb2b", background: "#fbfdff" }}>
                  <p className="heading-3 linear-gradient-text ibm-bold my-2" style={{ fontSize: "1.35rem", fontWeight: 700 }}>Tourism Visa Instructions</p>
                  <ul className="text-3 text-blue-2 ibm-regular line-7 ps-4" style={{ lineHeight: 1.8, color: "#0C568C" }}>
                    <li>Passport validity: No less than 6 months</li>
                    <li>Entry permit validity: 30 days from issuance</li>
                    <li>Stay duration: No more than 90 days from entry</li>
                    <li>Number of entries: {entryType === "single" ? "Single entry" : "Multiple entries allowed"}</li>
                    <li>Work strictly prohibited during visit period</li>
                  </ul>
                </div>

                <div className="sub-item p-4 rounded-5" style={{ border: "2px solid #009fdb2b", background: "#fbfdff" }}>
                  <p className="heading-3 linear-gradient-text ibm-bold my-2" style={{ fontSize: "1.35rem", fontWeight: 700 }}>Family Visit Visa Instructions</p>
                  <ul className="text-3 text-blue-2 ibm-regular line-7 ps-4" style={{ lineHeight: 1.8, color: "#0C568C" }}>
                    <li>Passport validity: No less than 6 months</li>
                    <li>Entry permit validity: 30 days from issuance</li>
                    <li>Stay duration: 30 days from date of entry</li>
                    <li>Sponsor must be first- or second-degree relative</li>
                    <li>Return ticket mandatory upon arrival</li>
                  </ul>
                </div>

                <div className="sub-item p-4 rounded-5" style={{ border: "2px solid #009fdb2b", background: "#fbfdff" }}>
                  <p className="heading-3 linear-gradient-text ibm-bold my-2" style={{ fontSize: "1.35rem", fontWeight: 700 }}>Business Visit Instructions</p>
                  <ul className="text-3 text-blue-2 ibm-regular line-7 ps-4" style={{ lineHeight: 1.8, color: "#0C568C" }}>
                    <li>Passport validity: No less than 6 months</li>
                    <li>Valid commercial invitation letter required</li>
                    <li>Official company sponsorship verified</li>
                    <li>Authorized for business and trade purposes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ==============================================
                 5. APP-DISCOVER-MORE (VIDEO BANNER)
                 ============================================== */}
            <div className="rounded-5 evisa-bg-white mt-8 mt-md-14 overflow-hidden discover-more shadow-sm position-relative">
              <p className="heading-2 text-white ibm-bold pb-5 learn-more-text text-center position-relative z-2 pt-6" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>
                Learn more about Kuwait..
              </p>
              <div className="video-container" style={{ minHeight: 380 }}>
                <video
                  playsInline
                  autoPlay
                  loop
                  muted
                  preload="auto"
                  poster="/assets/video/thumbs/en-1.png"
                  className="w-100"
                  style={{ objectFit: "cover", maxHeight: 500 }}
                >
                  <source src="/assets/video/full-video-en.webm" type="video/webm" />
                </video>
              </div>
            </div>

            {/* ==============================================
                 6. APP-FAQ (ACCORDION)
                 ============================================== */}
            <div className="my-8 my-xl-13 evisa-bg-white rounded-5 faq-container shadow-sm p-4 p-md-8">
              <p className="heading-3 ibm-medium linear-gradient-text p-4" style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                Frequently Asked Questions
              </p>
              <div className="table-responsive">
                <table className="w-100" style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    {FAQS.map((faq, i) => (
                      <tr key={i} className="border-bottom">
                        <td className="p-3 px-4">
                          <div
                            className="d-flex justify-content-between align-items-center c-pointer"
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          >
                            <p className="text-1 text-blue-2 ibm-medium my-0" style={{ fontSize: "1.15rem", fontWeight: 600 }}>
                              {faq.q}
                            </p>
                            <img
                              src="/assets/icons/dropdown-open.svg"
                              className="action-icon"
                              style={{
                                transform: openFaq === i ? "rotate(180deg)" : "none",
                                transition: "transform 0.2s ease",
                              }}
                              alt=""
                            />
                          </div>
                          {openFaq === i && (
                            <div className="mt-3 text-2 text-muted" style={{ lineHeight: 1.7, fontSize: "1.05rem" }}>
                              {faq.a}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ==============================================
                 7. APP-CONTACT-US
                 ============================================== */}
            <div className="my-8 my-lg-13 p-5 p-md-12 evisa-bg-white rounded-5 contact-us-landing shadow-sm">
              <p className="heading-2 ibm-semibold pb-2 linear-gradient-text" style={{ fontSize: "2rem", fontWeight: 700 }}>
                Contact Us
              </p>
              <div className="row justify-content-between align-items-center">
                <div className="col-12 col-lg-6">
                  {contactSuccess ? (
                    <div className="p-4 rounded-4 bg-success-subtle text-success">
                      ✓ Thank you! Your inquiry has been submitted. Our support team will respond shortly.
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setContactSuccess(true);
                      }}
                    >
                      <div className="mb-3">
                        <label className="form-label text-blue-2 ibm-medium" style={{ fontWeight: 600, color: "#0C568C" }}>Name</label>
                        <input type="text" className="form-control px-4 py-3 rounded-4" style={{ border: "1px solid #009FDB80" }} placeholder="Your Name" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-blue-2 ibm-medium" style={{ fontWeight: 600, color: "#0C568C" }}>Email</label>
                        <input type="email" className="form-control px-4 py-3 rounded-4" style={{ border: "1px solid #009FDB80" }} placeholder="your.email@example.com" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-blue-2 ibm-medium" style={{ fontWeight: 600, color: "#0C568C" }}>Message</label>
                        <textarea className="form-control px-4 py-3 rounded-4" rows={4} style={{ border: "1px solid #009FDB80", resize: "none" }} placeholder="Write your inquiry here..." required></textarea>
                      </div>
                      <button type="submit" className="btn-1 w-50 p-3 rounded-5" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                        Submit Inquiry
                      </button>
                    </form>
                  )}
                </div>

                <div className="col-12 col-lg-5 mt-5 mt-lg-0">
                  <div className="p-5 rounded-5" style={{ background: "rgba(0, 169, 233, 0.05)", border: "1px solid #009fdb2b" }}>
                    <h4 className="text-blue-1 ibm-bold mb-3" style={{ fontSize: "1.3rem", color: "#0C568C" }}>
                      General Administration of Residence Affairs
                    </h4>
                    <p className="text-blue-2 mb-3" style={{ lineHeight: 1.7, color: "#4F5362" }}>
                      Electronic Services Department – Dajeej area, State of Kuwait.<br />
                      Online services available 24/7.
                    </p>
                    <p className="text-blue-2 mb-2" style={{ fontWeight: 600, color: "#0C568C" }}>
                      Working hours (In-person):<br />
                      Sunday – Thursday: 8:00 AM – 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==============================================
                 8. APP-TILE-3 (APP PROMOTION)
                 ============================================== */}
            <div className="tile3-container mt-8 mt-md-14 rounded-5 overflow-hidden evisa-bg-white shadow-sm p-6 p-md-10">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                <div>
                  <h3 className="heading-2 linear-gradient-text ibm-bold" style={{ fontSize: "2.3rem", fontWeight: 800 }}>
                    Download Kuwait Visa App
                  </h3>
                  <p className="text-muted mt-2" style={{ fontSize: "1.15rem" }}>
                    Check your visa status, scan QR verification, and receive real-time notifications on iPhone and Android.
                  </p>
                  <div className="d-flex align-items-center gap-4 mt-4">
                    <img
                      src="/assets/images/qr-code.png"
                      alt="QR Code"
                      style={{ borderRadius: "1rem", border: "1px solid #4F5362", width: 110, height: 110, background: "#fff", padding: 6 }}
                    />
                    <div className="d-flex flex-column gap-2">
                      <a href="https://apps.apple.com/app/kuwait-visa/id1662792755" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/images/dashboard/get-on-app-store.svg" alt="App Store" style={{ width: 160 }} />
                      </a>
                      <a href="https://play.google.com/store/apps/details?id=com.visacheckin" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/images/dashboard/get-on-play-store.svg" alt="Google Play" style={{ width: 160 }} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#fff", borderTop: "1px solid #d8e2ef", padding: "3rem 0 1.5rem" }}>
        <div className="container" style={{ maxWidth: 1300 }}>
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-4 pb-6" style={{ borderBottom: "1px solid #e3e6ed" }}>
            <div>
              <div className="d-flex align-items-center gap-3">
                <img src="/assets/icons/kuwait-visa-logo.svg" style={{ height: 48 }} alt="Kuwait Visa Logo" />
                <div>
                  <p className="linear-gradient-text heading-4 ibm-bold mb-0 d-flex flex-column">
                    <span style={{ fontSize: "1.4rem", color: "#0C568C", fontWeight: 800 }}>Kuwait</span>
                    <span style={{ fontSize: "1.4rem", color: "#1C75BC", marginTop: -6 }}>Visa</span>
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <span className="badge rounded-pill bg-light text-dark px-3 py-2 border">Official eVisa System</span>
              </div>
            </div>

            <div className="d-flex gap-5 flex-wrap">
              <div>
                <p className="ibm-bold mb-3 text-blue-3" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0C568C" }}>Support</p>
                <p className="text-muted mb-1 c-pointer hover">Terms of Use</p>
                <p className="text-muted mb-1 c-pointer hover">Privacy Policy</p>
                <p className="text-muted mb-1 c-pointer hover">FAQ</p>
              </div>
              <div>
                <p className="ibm-bold mb-3 text-blue-3" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0C568C" }}>Information</p>
                <p className="text-muted mb-1 c-pointer hover">About Kuwait</p>
                <p className="text-muted mb-1 c-pointer hover">Visa Instructions</p>
                <Link to="/admin" className="text-decoration-none text-muted mb-1 d-block hover">Admin Portal</Link>
              </div>
            </div>
          </div>

          <div className="pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-muted" style={{ fontSize: "0.9rem" }}>
            <span>Developed and Operated by Ministry of Interior — State of Kuwait</span>
            <span>All rights reserved © {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* ==============================================
           MODALS (APPLY / VERIFY / PAY)
           ============================================== */}
      {modal && (
        <div
          className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 22, 40, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 10000,
          }}
          onClick={() => setModal(null)}
        >
          <div
            className="modal-card rounded-5 p-5 shadow-2xl bg-white w-100"
            style={{ maxWidth: 600, border: "2px solid #009FDB" }}
            onClick={(e) => e.stopPropagation()}
          >
            {modal === "apply" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0 text-blue-1 ibm-bold" style={{ color: "#0C568C" }}>Apply for Kuwait eVisa</h3>
                  <button type="button" className="btn-close" onClick={() => setModal(null)}>✕</button>
                </div>
                <p className="text-muted">
                  New applications are submitted directly through the eVisa portal. To issue and manage authorized visas, sign in to the Admin console.
                </p>
                <div className="mt-4 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary rounded-4 px-4" onClick={() => setModal(null)}>Cancel</button>
                  <Link to="/admin" className="btn-1 rounded-4 px-4 py-2 text-decoration-none font-bold">Sign in as Admin</Link>
                </div>
              </div>
            )}

            {modal === "verify" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0 text-blue-1 ibm-bold" style={{ color: "#0C568C" }}>Verify eVisa Status</h3>
                  <button type="button" className="btn-close" onClick={() => setModal(null)}>✕</button>
                </div>
                <p className="text-muted">
                  Enter your 6-digit OTP code below to look up your visa record.
                </p>
                <form onSubmit={handleModalVerify} className="mt-3">
                  <input
                    type="text"
                    value={modalInput}
                    onChange={(e) => setModalInput(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 847192)..."
                    className="form-control px-4 py-3 rounded-4 font-monospace font-bold mb-3"
                    style={{ border: "2px solid #009FDB", fontSize: "1.1rem" }}
                    required
                  />
                  {modalError && (
                    <div className="alert alert-danger py-2 px-3 text-sm rounded-3 mb-3">{modalError}</div>
                  )}
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary rounded-4 px-4" onClick={() => setModal(null)}>Close</button>
                    <button type="submit" disabled={modalLoading} className="btn-1 rounded-4 px-4 py-2 font-bold">
                      {modalLoading ? "Checking…" : "Verify Status"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modal === "pay" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0 text-blue-1 ibm-bold" style={{ color: "#0C568C" }}>Pay Visa Fees</h3>
                  <button type="button" className="btn-close" onClick={() => setModal(null)}>✕</button>
                </div>
                <p className="text-muted">
                  Visa fee payment (3 KWD) is available through KNET electronic payment gateway upon visa approval.
                </p>
                <div className="p-3 rounded-4 bg-light text-center my-4 font-bold text-blue-1">
                  KNET Official Government Gateway • بوابة الدفع الإلكتروني الحكومية
                </div>
                <div className="d-flex justify-content-end">
                  <button type="button" className="btn-1 rounded-4 px-4 py-2" onClick={() => setModal(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const portalCss = `
  @charset "UTF-8";
  .kuwait-portal {
    --dashboard-background-color: #f5f7fa;
    --dashboard-header-backgorund-color: #FFFFFFB2;
    --dashboard--header-border-color: #D8E2EF;
    --evisa-bg-white: #ffffff;
    --evisa-text-blue-1: #0d4e80;
    --evisa-text-blue-2: #0d4e80;
    --evisa-text-blue-3: #1C75BC;
    background-color: var(--dashboard-background-color);
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .theme-dark {
    --dashboard-background-color: #121E2D;
    --dashboard-header-backgorund-color: #121E2DB2;
    --dashboard--header-border-color: #223247;
    --evisa-bg-white: #17263a;
    --evisa-text-blue-1: #45cbe8;
    --evisa-text-blue-2: #96d9ff;
    --evisa-text-blue-3: #60c6ff;
  }
  .header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--dashboard-header-backgorund-color);
    -webkit-backdrop-filter: blur(25px);
    backdrop-filter: blur(25px);
    z-index: 1000;
    border-bottom: 1px solid var(--dashboard--header-border-color);
  }
  .main-content {
    padding-top: 2rem;
    width: 100%;
    max-width: 1300px;
  }
  .c-pointer { cursor: pointer; }
  .action-icon {
    vertical-align: middle;
    height: 24px;
    padding: 2px;
  }
  .logo { height: 48px; }
  .hover:hover { opacity: 0.8; }
  .btn-1 {
    background: linear-gradient(90deg, #0C568C 0%, #009FDB 100%);
    color: #fff;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-1:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    color: #fff;
  }
  .tab-header {
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.6;
  }
  .tab-header.active {
    opacity: 1 !important;
  }
  .slider {
    position: relative;
    width: 25%;
    transition: transform .33s cubic-bezier(.38,.8,.32,1.07);
  }
  .slider .indicator {
    max-width: 100%;
    margin: 0 auto;
    height: 3px;
    background-color: #0C568C;
    border-radius: 2px;
  }
  .tile-1 {
    min-height: 480px;
    position: relative;
  }
  .tile-1 .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(12, 86, 140, 0.45) 0%, rgba(13, 61, 102, 0.8) 100%);
    z-index: 1;
  }
  .liquid-glass-icon {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .liquid-glass-button {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(12px);
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    border-radius: 30px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .liquid-glass-button:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  .linear-gradient-text {
    background: linear-gradient(90deg, #0C568C 0%, #009FDB 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
