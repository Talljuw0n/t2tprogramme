import { useState, useEffect, useRef } from "react";

// ─── MOBILE HOOK ──────────────────────────────────────────────────────────────
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --forest:#0D1147; --forest2:#111660; --forest3:#1A2080;
      --sage:#C8A96E; --sage-light:#D9C08E;
      --mint:#C8A96E; --mint2:#F5EDD8;
      --sand:#F0E8D5; --sand2:#FAF6EE; --cream:#FDFAF5;
      --text:#0D1147; --text2:#2A3060; --text3:#7A7FA8;
      --border:#DDD5C0; --border2:#EDE8D8;
      --white:#FFFFFF; --red:#C0392B; --green-ok:#1B7A4A;
      --amber:#C8A96E; --amber-bg:#F5EDD8;
      --max-w:1440px;
    }
    .wrap { max-width:var(--max-w); margin:0 auto; width:100%; padding:0 80px; box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--text); overflow-x:hidden; }
    h1,h2,h3,h4 { font-family:'Cormorant Garamond',serif; }
    ::-webkit-scrollbar { width:3px; }
    ::-webkit-scrollbar-track { background:var(--sand); }
    ::-webkit-scrollbar-thumb { background:var(--forest); border-radius:2px; }
    .fade-up { animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
    .live-dot { width:7px;height:7px;background:#2ECC71;border-radius:50%;display:inline-block;animation:livePulse 2s infinite; }
    @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,0.4);} 50%{box-shadow:0 0 0 5px rgba(46,204,113,0);} }
    .card-hover { transition:transform 0.25s ease,box-shadow 0.25s ease; }
    .card-hover:hover { transform:translateY(-4px);box-shadow:0 20px 60px rgba(13,17,71,0.12); }
    input,select,textarea { font-family:'Outfit',sans-serif; }
    input:focus,select:focus,textarea:focus { outline:none;border-color:var(--forest) !important;box-shadow:0 0 0 3px rgba(13,17,71,0.08); }
    button { font-family:'Outfit',sans-serif; }
    .field-error { border-color:var(--red) !important; background:#FEF0EF !important; }
    @keyframes shake { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-6px);} 40%,80%{transform:translateX(6px);} }
    .shake { animation:shake 0.4s ease; }
    @keyframes spin { to { transform:rotate(360deg); } }
    /* ── MOBILE RESPONSIVE ── */
    @media (max-width: 768px) {
      .wrap { padding-left:24px !important; padding-right:24px !important; }
      .hero-section { padding:100px 0 48px !important; min-height:auto !important; }
      .hero-buttons { flex-direction:column !important; }
      .hero-buttons button { width:100% !important; }
      .overview-card { position:relative !important; right:auto !important; bottom:auto !important; width:100% !important; min-width:unset !important; margin-top:36px !important; box-shadow:none !important; }
      .partners-grid { grid-template-columns:repeat(2,1fr) !important; }
      .stages-grid { grid-template-columns:1fr !important; gap:40px !important; }
      .eligibility-grid { grid-template-columns:1fr !important; }
      .section-pad { padding:60px 0 !important; }
      .newsroom-featured { grid-template-columns:1fr !important; }
      .newsroom-featured-img { height:220px !important; }
      .newsroom-grid { grid-template-columns:1fr !important; }
      .newsroom-header { flex-direction:column !important; align-items:flex-start !important; }
      .media-resources-grid { grid-template-columns:1fr !important; }
      .press-contacts-grid { grid-template-columns:1fr !important; }
      .press-form-two-col { grid-template-columns:1fr !important; }
      .dash-stats { grid-template-columns:repeat(2,1fr) !important; }
      .dash-detail-grid { grid-template-columns:repeat(2,1fr) !important; }
      .footer-inner { flex-direction:column !important; align-items:flex-start !important; gap:16px !important; }
      .cta-section { padding:60px 0 !important; }
    }
  `}</style>
);

// ─── PASSWORDS ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "T2T@Admin2026";
const PRESS_PASSWORD = "T2TPress2026";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://rgtorhxyznizhjjqsfyt.supabase.co";
const SUPABASE_ANON = "sb_publishable_etlhOo9Wb0Laye683RGJug_iNzG1JJK";

const sb = async (path, opts = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SUPABASE_ANON,
      "Authorization": `Bearer ${SUPABASE_ANON}`,
      "Content-Type": "application/json",
      "Prefer": opts.prefer || "return=representation",
      ...(opts.headers || {}),
    },
    ...opts,
  });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE   = "service_h050sxm";
const EMAILJS_PUBKEY    = "_8-ZOysExnIB07wdD";
const EMAILJS_T_CONFIRM = "template_o9zjxfb";
const EMAILJS_T_STATUS  = "template_zk4tkrr";

const sendEmail = async (templateId, params) => {
  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:      EMAILJS_SERVICE,
        template_id:     templateId,
        user_id:         EMAILJS_PUBKEY,
        template_params: params,
      }),
    });
  } catch (err) {
    console.warn("EmailJS error:", err);
  }
};

// ─── DATA STORE ───────────────────────────────────────────────────────────────
const useDataStore = () => {
  const [apps, setApps]               = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [dbError, setDbError]         = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, s] = await Promise.all([
          sb("applications?select=*&order=submitted_at.desc"),
          sb("press_submissions?select=*&order=submitted_at.desc"),
        ]);
        setApps(a);
        setSubmissions(s);
      } catch (e) {
        console.error("Supabase load error:", e);
        setDbError("Could not connect to database. Please check your network.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── ADD APPLICATION ──
  const addApp = async (data) => {
    const id    = `T2T-${String(Date.now()).slice(-8)}`;
    const score = scoreApp(data);
    const row   = {
      id, score, status: "pending",
      submitted_at:            new Date().toISOString(),
      business_name:           data.businessName,
      business_address:        data.businessAddress,
      business_niche:          data.businessNiche,
      business_structure:      data.businessStructure,
      business_age:            data.businessAge,
      role:                    data.role,
      export_experience:       data.exportExperience,
      target_markets:          data.targetMarkets,
      contact_phone:           data.contactPhone,
      contact_email:           data.contactEmail,
      contact_time:            data.contactTime,
      production_capacity:     data.productionCapacity,
      scalability:             data.scalability,
      quality_standards:       data.qualityStandards,
      monthly_turnover:        data.monthlyTurnover,
      loan_history:            data.loanHistory,
      digital_capability:      data.digitalCapability,
      export_docs_familiarity: data.exportDocsFamiliarity,
      documents:               data.documents,
      kyc_consent:             data.kycConsent,
      export_products:         data.exportProducts,
      shipping_company:        data.shippingCompany,
      export_timeline:         data.exportTimeline,
      challenges:              data.challenges,
      support_needed:          data.supportNeeded,
      working_capital:         data.workingCapital,
      pilot_agreement:         data.pilotAgreement,
      additional_info:         data.additionalInfo,
    };

    try {
      await sb("applications", {
        method: "POST",
        body: JSON.stringify(row),
        prefer: "return=minimal",
      });
      setApps(prev => [{ ...row, submittedAt: row.submitted_at, businessName: data.businessName, contactEmail: data.contactEmail }, ...prev]);

      if (data.contactEmail) {
        await sendEmail(EMAILJS_T_CONFIRM, {
          to_email:       data.contactEmail,
          to_name:        data.businessName || "Applicant",
          applicant_name: data.businessName || "Applicant",
          reference_id:   id,
        });
      }
    } catch (e) {
      console.error("Supabase insert error:", e);
    }
    return { id, score };
  };

  // ── UPDATE APPLICATION STATUS ──
  const upAppStatus = async (id, status) => {
    try {
      await sb(`applications?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        prefer: "return=minimal",
      });
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));

      const app   = apps.find(a => a.id === id);
      const email = app?.contact_email || app?.contactEmail;
      const name  = app?.business_name || app?.businessName || "Applicant";

      if (email) {
        const isApproved = status === "approved";
        await sendEmail(EMAILJS_T_STATUS, {
          to_email:       email,
          to_name:        name,
          applicant_name: name,
          reference_id:   id,
          status:         isApproved ? "Approved" : "Unsuccessful",
          status_message: isApproved
            ? "Congratulations — your application has been shortlisted. Our team will be in touch shortly with next steps."
            : "Thank you for applying. After careful review, we are unable to offer you a place in this cohort. We encourage you to apply again in future cycles.",
        });
      }
    } catch (e) {
      console.error("Supabase status update error:", e);
    }
  };

  // ── ADD PRESS SUBMISSION ──
  const addSubmission = async (data) => {
    const id  = `PR-${String(Date.now()).slice(-8)}`;
    const row = {
      id, status: "pending",
      submitted_at: new Date().toISOString(),
      name:         data.name,
      outlet:       data.outlet,
      email:        data.email,
      phone:        data.phone,
      country:      data.country,
      story_type:   data.storyType,
      headline:     data.headline,
      summary:      data.summary,
      content:      data.content,
      image_url:    data.imageUrl,
      category:     data.category,
      notes:        data.notes,
      declaration:  data.declaration,
    };

    try {
      await sb("press_submissions", {
        method: "POST",
        body: JSON.stringify(row),
        prefer: "return=minimal",
      });
      setSubmissions(prev => [{ ...row, submittedAt: row.submitted_at, storyType: data.storyType, imageUrl: data.imageUrl }, ...prev]);
    } catch (e) {
      console.error("Supabase press insert error:", e);
    }
    return { id };
  };

  // ── UPDATE PRESS STATUS ──
  const upSubStatus = async (id, status) => {
    try {
      await sb(`press_submissions?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        prefer: "return=minimal",
      });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch (e) {
      console.error("Supabase press status error:", e);
    }
  };

  return { apps, addApp, upAppStatus, submissions, addSubmission, upSubStatus, loading, dbError };
};

const scoreApp = (d) => {
  let s = 0;
  s += ({"2+ years":25,"1-2 years":15,"6-12 months":8}[d.businessAge]||0);
  s += ({"Yes, currently":25,"Yes, previously":15,"No, but interested":5}[d.exportExperience]||0);
  s += ({"₦5M and above":20,"₦1M to ₦5M":15,"₦500k to ₦1M":10,"₦200k to ₦500k":5}[d.monthlyTurnover]||0);
  s += ({"Yes, experienced":15,"Somewhat familiar":8}[d.exportDocsFamiliarity]||0);
  s += ({"₦2M and above":15,"₦500k to ₦2M":10,"₦100k to ₦500k":5}[d.workingCapital]||0);
  return Math.min(s,100);
};

// ─── STATIC NEWS ──────────────────────────────────────────────────────────────
const staticNews = [
  { id:"s1", cat:"PRESS RELEASE", date:"March 1, 2026", featured:true,
    headline:"Providus Bank, ECOWAS Parliament and GABA Launch Landmark T2T Programme for African SMEs",
    summary:"The Training-to-Transaction Programme represents a transformative step in connecting West African SMEs to global markets, backed by structured trade finance and institutional support from three leading organisations.",
    img:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80", source:"T2T Programme Office" },
  { id:"s2", cat:"PROGRAMME UPDATE", date:"February 28, 2026", featured:false,
    headline:"Applications Now Open: SMEs to Gain Market Access Across USA, Canada and Caribbean",
    summary:"Selected participants will receive structured guidance on export readiness, trade compliance, buyer access, and trade finance solutions over a three-month intensive programme in Lagos and Abuja.",
    img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80", source:"T2T Programme Office" },
  { id:"s3", cat:"PARTNER SPOTLIGHT", date:"February 25, 2026", featured:false,
    headline:"ECOWAS Parliament Endorses T2T as Flagship SME Trade Initiative for 2026",
    summary:"The ECOWAS Parliament's endorsement signals strong regional commitment to enabling intra-African and global trade for small and medium enterprises across West Africa.",
    img:"https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=900&q=80", source:"T2T Programme Office" },
];

// ─── SHARED GATE COMPONENT ────────────────────────────────────────────────────
const PasswordGate = ({ title, subtitle, password, buttonLabel, onUnlock }) => {
  const [pw, setPw]   = useState("");
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false);

  const attempt = () => {
    if (pw === password) { onUnlock(); setErr(false); }
    else { setErr(true); setPw(""); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div className="fade-up" style={{ background:"white", border:"1px solid var(--border)", borderRadius:20, padding:"56px 48px", maxWidth:420, width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(27,61,47,0.1)" }}>
        <div style={{ width:56, height:56, background:"var(--forest)", borderRadius:14, margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.8rem", color:"var(--forest)", marginBottom:8 }}>{title}</h2>
        <p style={{ color:"var(--text3)", fontSize:"0.875rem", marginBottom:32, fontWeight:300 }}>{subtitle}</p>
        <div style={{ position:"relative", marginBottom:12 }}>
          <input type={show?"text":"password"} value={pw}
            onChange={e=>{setPw(e.target.value);setErr(false);}}
            onKeyDown={e=>e.key==="Enter"&&attempt()}
            placeholder="Enter password"
            style={{ width:"100%", background:err?"#FEF0EF":"var(--sand2)", border:`1.5px solid ${err?"var(--red)":"var(--border)"}`, borderRadius:10, padding:"13px 48px 13px 16px", color:"var(--text)", fontSize:"0.95rem" }}
          />
          <button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text3)", fontSize:"0.8rem" }}>
            {show?"Hide":"Show"}
          </button>
        </div>
        {err && <p style={{ color:"var(--red)", fontSize:"0.8rem", marginBottom:16, textAlign:"left" }}>Incorrect password. Please try again.</p>}
        <button onClick={attempt} style={{ width:"100%", background:"var(--forest)", color:"white", border:"none", padding:"13px", borderRadius:10, fontSize:"0.95rem", fontWeight:600, cursor:"pointer", marginTop:err?0:8, boxShadow:"0 4px 16px rgba(27,61,47,0.25)" }}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const T2T_LOGO = "/logo.png";

const Nav = ({ page, setPage, onLogoClick }) => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const bg = scrolled || menuOpen ? "rgba(255,254,249,0.97)" : "rgba(255,254,249,0)";

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, height:72, background:bg, backdropFilter:scrolled||menuOpen?"blur(20px)":"none", borderBottom:scrolled||menuOpen?"1px solid var(--border)":"none", transition:"all 0.3s ease" }}>
        <div className="wrap" style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          {/* ── LOGO AREA ── */}
          <div onClick={()=>{onLogoClick();setMenuOpen(false);}} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
            {T2T_LOGO
              ? <img src={T2T_LOGO} alt="T2T Programme" style={{ height:40, width:"auto", objectFit:"contain", display:"block" }} onError={e=>{ e.currentTarget.style.display="none"; e.currentTarget.nextSibling.style.display="flex"; }} />
              : null
            }
            <div style={{ display: T2T_LOGO ? "none" : "flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, background:"var(--forest)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"2px dashed rgba(200,230,218,0.4)" }}>
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" fill="white"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily:"Cormorant Garamond", fontWeight:700, fontSize:"1.1rem", color:"var(--forest)", lineHeight:1 }}>T2T Programme</p>
                <p style={{ fontSize:"0.6rem", color:"var(--text3)", letterSpacing:"0.08em", fontWeight:500 }}>TRAINING TO TRANSACTION</p>
              </div>
            </div>
          </div>

          {/* Desktop links */}
          {!isMobile && (
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              {[{key:"landing",label:"Home"},{key:"newsroom",label:"Newsroom"}].map(({key,label})=>(
                <button key={key} onClick={()=>setPage(key)} style={{ background:page===key?"var(--mint2)":"transparent", border:"none", color:page===key?"var(--forest)":"var(--text3)", padding:"7px 18px", borderRadius:6, fontSize:"0.875rem", fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}>{label}</button>
              ))}
              <div style={{ width:1, height:20, background:"var(--border)", margin:"0 8px" }} />
              <button onClick={()=>setPage("press-gate")} style={{ background:"transparent", border:"1.5px solid var(--forest)", color:"var(--forest)", padding:"7px 18px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer", marginRight:6 }}>Press Portal</button>
              <button onClick={()=>setPage("register")} style={{ background:"var(--forest)", border:"none", color:"white", padding:"9px 22px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer", letterSpacing:"0.02em", boxShadow:"0 4px 16px rgba(27,61,47,0.25)" }}>Apply Now</button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={()=>setMenuOpen(o=>!o)} style={{ background:"transparent", border:"1.5px solid var(--border)", borderRadius:8, padding:"8px 10px", cursor:"pointer", display:"flex", flexDirection:"column", gap:5, alignItems:"center", justifyContent:"center" }}>
              <span style={{ display:"block", width:20, height:2, background:"var(--forest)", borderRadius:2, transition:"all 0.25s", transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none" }} />
              <span style={{ display:"block", width:20, height:2, background:"var(--forest)", borderRadius:2, transition:"all 0.25s", opacity:menuOpen?0:1 }} />
              <span style={{ display:"block", width:20, height:2, background:"var(--forest)", borderRadius:2, transition:"all 0.25s", transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none" }} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{ position:"fixed", top:72, left:0, right:0, zIndex:999, background:"rgba(255,254,249,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", padding:"16px 24px 24px", display:"flex", flexDirection:"column", gap:8 }}>
          {[{key:"landing",label:"Home"},{key:"newsroom",label:"Newsroom"},{key:"press-gate",label:"Press Portal"},{key:"register",label:"Apply Now",primary:true}].map(({key,label,primary})=>(
            <button key={key} onClick={()=>{setPage(key);setMenuOpen(false);}} style={{ background:primary?"var(--forest)":page===key?"var(--mint2)":"transparent", border:primary?"none":"1.5px solid var(--border)", color:primary?"white":page===key?"var(--forest)":"var(--text2)", padding:"13px 20px", borderRadius:8, fontSize:"0.95rem", fontWeight:primary?600:500, cursor:"pointer", textAlign:"left", width:"100%" }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

// ─── LANDING ─────────────────────────────────────────────────────────────────
const PARTNER_LOGOS = {
  providus:   "/logos/providus.png",
  ecowas:     "/logos/ecowas.png",
  gaba:       "/logos/gaba.png",
  duchess:    "/logos/duchess.png",
  cmd:        "/logos/CMD.png",
  borderless: "/logos/borderless.png",
};

const Landing = ({ setPage }) => {
  const m = useMobile();

  // 6 partners including CMD Tourism (from v1)
  const partners = [
    { key:"providus",   name:"Providus Bank",                        role:"Lead Sponsor",         abbr:"PB"   },
    { key:"ecowas",     name:"ECOWAS Parliament",                    role:"Institutional Backer", abbr:"EP"   },
    { key:"gaba",       name:"Global African Business Assoc.",       role:"GABA",                 abbr:"GABA" },
    { key:"duchess",    name:"Duchess Natural Limited",              role:"Implementing Partner", abbr:"DNL"  },
    { key:"cmd",        name:"CMD Tourism & Trade Enterprises Ltd",  role:"Implementing Partner", abbr:"CMD"  },
    { key:"borderless", name:"Borderless Trade & Investments",       role:"Implementing Partner", abbr:"BTI"  },
  ];

  return (
  <div style={{ overflowX:"hidden" }}>

    {/* ── HERO ── */}
    <section style={{ position:"relative", overflow:"hidden", background:"linear-gradient(135deg, #0D1147 0%, #111660 60%, #1A2080 100%)", ...(m ? {} : { minHeight:"100vh", display:"flex", alignItems:"center" }) }}>
      <div style={{ position:"absolute", inset:0, opacity:0.15, backgroundImage:"radial-gradient(circle, rgba(200,230,218,0.4) 1px, transparent 1px)", backgroundSize:"32px 32px" }} />
      <div style={{ position:"absolute", right:"-10%", top:"10%", width:"50vw", height:"50vw", maxWidth:700, maxHeight:700, borderRadius:"50%", border:"1px solid rgba(200,230,218,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", right:"5%", top:"20%", width:"30vw", height:"30vw", maxWidth:400, maxHeight:400, borderRadius:"50%", border:"1px solid rgba(200,230,218,0.05)", pointerEvents:"none" }} />

      {/* ── MOBILE HERO ── */}
      {m && (
        <div className="fade-up" style={{ position:"relative", zIndex:2, padding:"112px 24px 48px", display:"flex", flexDirection:"column", gap:24, width:"100%", boxSizing:"border-box" }}>
          {/* Badge */}
          <div style={{ display:"inline-flex", alignSelf:"flex-start", alignItems:"center", gap:8, background:"rgba(200,230,218,0.15)", border:"1px solid rgba(200,230,218,0.3)", color:"var(--mint)", borderRadius:100, padding:"6px 16px 6px 12px", fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.04em" }}>
            <span className="live-dot" /><span>Applications Open · Deadline March 31, 2026</span>
          </div>
          {/* Headline */}
          <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"3rem", fontWeight:600, lineHeight:1.0, color:"white", letterSpacing:"-0.01em" }}>
            Training<br />to <span style={{ fontStyle:"italic", fontWeight:300, color:"var(--mint)" }}>Transaction.</span>
          </h1>
          {/* Body */}
          <p style={{ fontSize:"0.95rem", color:"rgba(255,255,255,0.75)", lineHeight:1.8, fontWeight:300 }}>
            A structured programme moving African SMEs from business readiness into real commercial transactions across global markets.
          </p>
          <p style={{ fontFamily:"Cormorant Garamond", fontStyle:"italic", fontSize:"0.95rem", color:"var(--mint)", opacity:0.85 }}>
            Lagos and Abuja · Commencing April 13, 2026
          </p>
          {/* Buttons */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button onClick={()=>setPage("register")} style={{ background:"white", color:"var(--forest)", border:"none", padding:"14px 24px", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", textAlign:"center" }}>Apply to the Programme</button>
            <button onClick={()=>setPage("newsroom")} style={{ background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.35)", color:"white", padding:"13px 24px", borderRadius:10, fontSize:"0.9rem", fontWeight:500, cursor:"pointer", textAlign:"center" }}>Press and Media</button>
          </div>
          {/* Mobile overview grid — sits cleanly below buttons */}
          <div style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(16px)", border:"1px solid rgba(200,230,218,0.2)", borderRadius:14, padding:"20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[{label:"Cities",val:"Lagos & Abuja"},{label:"Duration",val:"3 Months"},{label:"Deadline",val:"March 31, 2026"},{label:"Starts",val:"April 13, 2026"}].map(({label,val})=>(
                <div key={label}>
                  <p style={{ fontSize:"0.62rem", color:"rgba(200,230,218,0.5)", marginBottom:4, letterSpacing:"0.06em", fontWeight:600 }}>{label.toUpperCase()}</p>
                  <p style={{ fontSize:"0.875rem", fontWeight:600, color:"white", lineHeight:1.3 }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP HERO ── */}
      {!m && (
        <div className="wrap" style={{ position:"relative", zIndex:2, paddingTop:130, paddingBottom:100, display:"flex", flexDirection:"row", alignItems:"center", gap:60 }}>
          {/* Left — headline */}
          <div className="fade-up" style={{ flex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(200,230,218,0.15)", border:"1px solid rgba(200,230,218,0.3)", color:"var(--mint)", borderRadius:100, padding:"6px 16px 6px 12px", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.04em", marginBottom:28 }}>
              <span className="live-dot" /><span>Applications Open · Deadline March 31, 2026</span>
            </div>
            <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(3.5rem,6vw,6.5rem)", fontWeight:600, lineHeight:1.0, color:"white", marginBottom:20, letterSpacing:"-0.01em" }}>
              Training<br />to <span style={{ fontStyle:"italic", fontWeight:300, color:"var(--mint)" }}>Transaction.</span>
            </h1>
            <p style={{ fontSize:"1.15rem", color:"rgba(255,255,255,0.75)", lineHeight:1.8, maxWidth:520, marginBottom:16, fontWeight:300 }}>
              A structured programme moving African SMEs from business readiness into real commercial transactions across global markets.
            </p>
            <p style={{ fontFamily:"Cormorant Garamond", fontStyle:"italic", fontSize:"1.05rem", color:"var(--mint)", marginBottom:44, opacity:0.85 }}>
              Lagos and Abuja · Commencing April 13, 2026
            </p>
            <div style={{ display:"flex", flexDirection:"row", gap:12 }}>
              <button onClick={()=>setPage("register")} style={{ background:"white", color:"var(--forest)", border:"none", padding:"15px 36px", borderRadius:10, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--mint)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="white";}}
              >Apply to the Programme</button>
              <button onClick={()=>setPage("newsroom")} style={{ background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.4)", color:"white", padding:"15px 28px", borderRadius:10, fontSize:"0.95rem", fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.2)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
              >Press and Media</button>
            </div>
          </div>
          {/* Right — overview card */}
          <div style={{ width:280, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(20px)", border:"1px solid rgba(200,230,218,0.2)", borderRadius:20, padding:"32px 28px", flexShrink:0 }}>
            <p style={{ fontSize:"0.65rem", fontWeight:700, color:"rgba(200,230,218,0.6)", letterSpacing:"0.12em", marginBottom:20 }}>PROGRAMME OVERVIEW</p>
            {[{label:"Delivery Cities",val:"Lagos and Abuja"},{label:"Duration",val:"3 Months"},{label:"Application Deadline",val:"March 31, 2026"},{label:"Commencement",val:"April 13, 2026"},{label:"Target Markets",val:"USA · Canada · Caribbean"}].map(({label,val},i,arr)=>(
              <div key={label} style={{ marginBottom: i<arr.length-1?16:0, paddingBottom: i<arr.length-1?16:0, borderBottom: i<arr.length-1?"1px solid rgba(200,230,218,0.12)":"none" }}>
                <p style={{ fontSize:"0.68rem", color:"rgba(200,230,218,0.5)", marginBottom:3 }}>{label}</p>
                <p style={{ fontSize:"0.9rem", fontWeight:600, color:"white" }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>

    {/* ── PARTNERS — 6 partners, 6-col desktop / 2-col mobile ── */}
    <section style={{ background:"white", padding: m?"40px 0":"56px 0", borderBottom:"1px solid var(--border)" }}>
      <div className="wrap">
        <p style={{ fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.14em", color:"var(--text3)", marginBottom:36, textAlign:"center" }}>IN PARTNERSHIP WITH</p>
        <div style={{ display:"grid", gridTemplateColumns: m?"repeat(2,1fr)":"repeat(6,1fr)", gap: m?24:32, alignItems:"center", maxWidth:1100, margin:"0 auto" }}>
          {partners.map(({key,name,role,abbr})=>(
            <div key={key} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div style={{ width:"100%", maxWidth:130, height:68, background:"var(--sand2)", border:"1.5px dashed var(--border)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                {PARTNER_LOGOS[key]
                  ? <img src={PARTNER_LOGOS[key]} alt={name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }} />
                  : <div style={{ textAlign:"center", padding:8 }}>
                      <p style={{ fontFamily:"Cormorant Garamond", fontWeight:700, fontSize:"1rem", color:"var(--forest)" }}>{abbr}</p>
                      <p style={{ fontSize:"0.55rem", color:"var(--text3)", marginTop:2 }}>ADD LOGO</p>
                    </div>
                }
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontWeight:600, fontSize: m?"0.68rem":"0.72rem", color:"var(--text)", lineHeight:1.3, marginBottom:2 }}>{name}</p>
                <p style={{ fontSize:"0.62rem", color:"var(--text3)" }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── ABOUT / IMPACT ── */}
    <section style={{ padding: m?"60px 0":"100px 0", background:"var(--cream)" }}>
      <div className="wrap">
        <div style={{ display:"grid", gridTemplateColumns: m?"1fr":"1fr 1fr", gap: m?32:80, alignItems:"start" }}>
          <div>
            <span style={{ display:"inline-block", background:"var(--mint2)", color:"var(--forest)", borderRadius:6, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:20 }}>THE PROGRAMME</span>
            <h2 style={{ fontFamily:"Cormorant Garamond", fontSize: m?"2.2rem":"clamp(2.2rem,3.5vw,3.2rem)", fontWeight:600, lineHeight:1.1, color:"var(--forest)", marginBottom:24 }}>
              Built to move African businesses into global markets.
            </h2>
            <p style={{ color:"var(--text2)", lineHeight:1.9, marginBottom:16, fontWeight:300, fontSize:"0.95rem" }}>
              The T2T Programme is a structured, institutional initiative that walks market-ready African SMEs through a proven pathway into their first international transactions.
            </p>
            <p style={{ color:"var(--text2)", lineHeight:1.9, fontWeight:300, fontSize:"0.95rem", marginBottom:32 }}>
              Spanning three months across Lagos and Abuja, the programme covers export readiness, trade compliance, buyer linkage, and direct access to trade finance — all designed around real commercial outcomes.
            </p>
            <button onClick={()=>setPage("register")} style={{ background:"var(--forest)", color:"white", border:"none", padding:"13px 32px", borderRadius:9, fontSize:"0.9rem", fontWeight:600, cursor:"pointer", boxShadow:"0 4px 20px rgba(27,61,47,0.25)" }}>Apply to the Programme</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[{num:"3",label:"Month intensive programme"},{num:"2",label:"Delivery cities"},{num:"3",label:"Target global markets"},{num:"50+",label:"SMEs to be selected"}].map(({num,label})=>(
              <div key={label} style={{ background:"var(--sand2)", border:"1px solid var(--border)", borderRadius:12, padding:"24px 20px" }}>
                <p style={{ fontFamily:"Cormorant Garamond", fontSize:"2.5rem", fontWeight:700, color:"var(--forest)", lineHeight:1 }}>{num}</p>
                <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginTop:8, lineHeight:1.4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── STAGES ── */}
    <section style={{ padding: m?"60px 0":"100px 0", background:"var(--forest)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.08, backgroundImage:"radial-gradient(circle, rgba(200,230,218,0.5) 1px, transparent 1px)", backgroundSize:"28px 28px" }} />
      <div className="wrap" style={{ position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom: m?40:64 }}>
          <span style={{ background:"rgba(200,230,218,0.15)", border:"1px solid rgba(200,230,218,0.3)", color:"var(--mint)", borderRadius:6, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", display:"inline-block", marginBottom:16 }}>HOW IT WORKS</span>
          <h2 style={{ fontFamily:"Cormorant Garamond", fontSize: m?"2.2rem":"3rem", fontWeight:600, color:"white", lineHeight:1.1 }}>Three stages. Real outcomes.</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns: m?"1fr":"repeat(3,1fr)", gap: m?20:24 }}>
          {[
            {num:"01",title:"Business and Export Readiness",desc:"Compliance documentation, NAFDAC and product standards, KYC completion, and operational assessment.",dur:"Lagos: 4 days · Abuja: 2 days"},
            {num:"02",title:"Market Access and Buyer Linkage",desc:"Buyer connections, ECOWAS region and US-Canada market access, and full trade documentation.",dur:"Lagos: 4 days · Abuja: 2 days"},
            {num:"03",title:"Transaction Execution",desc:"Trade finance solutions, FX access via Providus Bank, pilot transaction guidance, and first deal closed.",dur:"Lagos: 4 days · Abuja: 2 days"},
          ].map(({num,title,desc,dur})=>(
            <div key={num} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(200,230,218,0.12)", borderRadius:16, overflow:"hidden" }}>
              <div style={{ padding:"28px 24px" }}>
                <div style={{ width:44, height:44, background:"rgba(200,230,218,0.12)", border:"1px solid rgba(200,230,218,0.2)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cormorant Garamond", fontWeight:700, color:"var(--mint)", fontSize:"1.1rem", marginBottom:16 }}>{num}</div>
                <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.3rem", fontWeight:600, color:"white", marginBottom:10, lineHeight:1.2 }}>{title}</h3>
                <p style={{ fontSize:"0.85rem", color:"rgba(200,230,218,0.7)", lineHeight:1.7, marginBottom:16 }}>{desc}</p>
                <span style={{ background:"rgba(200,230,218,0.1)", border:"1px solid rgba(200,230,218,0.2)", color:"var(--mint)", padding:"4px 12px", borderRadius:100, fontSize:"0.7rem", fontWeight:500 }}>{dur}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── WHO IT'S FOR ── */}
    <section style={{ padding: m?"60px 0":"100px 0", background:"var(--sand2)" }}>
      <div className="wrap">
        <div style={{ textAlign:"center", marginBottom: m?40:60 }}>
          <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:6, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", display:"inline-block", marginBottom:16 }}>WHO IT IS FOR</span>
          <h2 style={{ fontFamily:"Cormorant Garamond", fontSize: m?"2.2rem":"3rem", fontWeight:600, color:"var(--forest)", lineHeight:1.1 }}>Built for market-ready<br />African SMEs</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns: m?"1fr":"repeat(3,1fr)", gap: m?20:28 }}>
          {[
            {icon:"🌾", title:"Agriculture and Agro-Processing", desc:"Grains, spices, legumes, functional powders, nuts, seeds and related processed goods ready for export."},
            {icon:"📋", title:"Verifiable Business Operations", desc:"Registered businesses with stable operations, production capacity and demonstrable business stability."},
            {icon:"🤝", title:"Transaction Readiness", desc:"Businesses ready for structured international trade engagement and committed to programme activities."},
          ].map(({icon,title,desc})=>(
            <div key={title} style={{ borderRadius:16, overflow:"hidden", background:"white", border:"1px solid var(--border)", boxShadow:"0 2px 20px rgba(27,61,47,0.06)" }}>
              <div style={{ padding:"28px 24px" }}>
                <div style={{ width:52, height:52, background:"var(--mint2)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem", marginBottom:16 }}>{icon}</div>
                <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.3rem", fontWeight:600, color:"var(--forest)", marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:"0.875rem", color:"var(--text2)", lineHeight:1.7 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", marginTop:32, fontFamily:"Cormorant Garamond", fontStyle:"italic", fontSize:"1rem", color:"var(--text3)" }}>Prior export experience is an advantage but is not mandatory.</p>
      </div>
    </section>

    {/* ── CTA BANNER ── */}
    <section style={{ position:"relative", overflow:"hidden", background:"linear-gradient(135deg, #0D1147 0%, #0A0E3A 100%)" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.1, backgroundImage:"radial-gradient(circle, rgba(200,230,218,0.5) 1px, transparent 1px)", backgroundSize:"28px 28px" }} />
      <div className="wrap" style={{ position:"relative", zIndex:1, paddingTop: m?60:100, paddingBottom: m?60:100, textAlign:"center" }}>
        <h2 style={{ fontFamily:"Cormorant Garamond", fontSize: m?"2.2rem":"clamp(2.5rem,5vw,4.5rem)", fontWeight:600, color:"white", lineHeight:1.05, marginBottom:16 }}>
          Applications Close<br /><span style={{ color:"var(--mint)", fontStyle:"italic", fontWeight:300 }}>March 31, 2026</span>
        </h2>
        <p style={{ color:"rgba(200,230,218,0.7)", marginBottom:44, fontSize: m?"1rem":"1.1rem", fontWeight:300 }}>Programme commences April 13 in Lagos and Abuja.</p>
        <button onClick={()=>setPage("register")} style={{ background:"white", color:"var(--forest)", border:"none", padding:"16px 48px", borderRadius:10, fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--mint)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="white";}}
        >Begin Your Application</button>
      </div>
    </section>

    {/* ── FOOTER ── */}
    <footer style={{ background:"#080B30", padding: m?"32px 0":"48px 0" }}>
      <div className="wrap">
        <div style={{ display:"flex", flexDirection: m?"column":"row", justifyContent:"space-between", alignItems: m?"flex-start":"center", gap: m?20:40, paddingBottom: m?20:32, borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom: m?20:28 }}>
          <div>
            {T2T_LOGO
              ? <img src={T2T_LOGO} alt="T2T Programme" style={{ height:36, width:"auto", objectFit:"contain", marginBottom:8, filter:"brightness(0) invert(1)" }} />
              : <p style={{ fontFamily:"Cormorant Garamond", fontWeight:700, fontSize:"1.3rem", color:"white", marginBottom:4 }}>T2T Programme</p>
            }
            <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.3)" }}>Training to Transaction · 2026</p>
          </div>
          <div style={{ display:"flex", gap: m?16:32, flexWrap:"wrap" }}>
            {[["Home","landing"],["Newsroom","newsroom"],["Apply Now","register"]].map(([l,k])=>(
              <button key={k} onClick={()=>setPage(k)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", cursor:"pointer", fontWeight:400, padding:0 }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection: m?"column":"row", justifyContent:"space-between", alignItems: m?"flex-start":"center", gap:12 }}>
          <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.3)" }}>Implemented by Duchess NL, CMD Tourism & Trade Enterprises Ltd and Borderless Trade and Investments. Sponsored by Providus Bank.</p>
          <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.3)" }}>applications@t2tprogramme.com</p>
        </div>
      </div>
    </footer>
  </div>
  );
};

// ─── FORM PRIMITIVES ──────────────────────────────────────────────────────────
const FF = ({num,label,hint,children,hasError}) => (
  <div>
    <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:hint?4:10 }}>
      <span style={{ background: hasError ? "var(--red)" : "var(--forest)", color:"var(--mint)", width:22, height:22, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, flexShrink:0, marginTop:1, transition:"background 0.2s" }}>{num}</span>
      <label style={{ fontWeight:600, fontSize:"0.93rem", color: hasError ? "var(--red)" : "var(--text)", lineHeight:1.4 }}>{label}{hasError && <span style={{ fontFamily:"Outfit", fontWeight:400, fontSize:"0.78rem", marginLeft:8, color:"var(--red)" }}>· This field is required</span>}</label>
    </div>
    {hint&&<p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:10, paddingLeft:32 }}>{hint}</p>}
    {children}
  </div>
);
const TI = ({value,onChange,placeholder,hasError}) => <input value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%", background: hasError ? "#FEF0EF" : "white", border:`1.5px solid ${hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 14px", color:"var(--text)", fontSize:"0.9rem" }} />;
const SI = ({value,onChange,options,hasError}) => <select value={value||""} onChange={e=>onChange(e.target.value)} style={{ width:"100%", background: hasError ? "#FEF0EF" : "white", border:`1.5px solid ${hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 14px", color:value?"var(--text)":"var(--text3)", fontSize:"0.9rem", cursor:"pointer" }}><option value="">Select an option</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
const Rad = ({value,onChange,options,hasError}) => <div style={{ display:"flex", flexDirection:"column", gap:8, borderRadius:8, outline: hasError ? "2px solid var(--red)" : "none", outlineOffset:4 }}>{options.map(o=><label key={o} onClick={()=>onChange(o)} style={{ display:"flex", alignItems:"center", gap:12, background:value===o?"var(--mint2)":"white", border:`1.5px solid ${value===o?"var(--sage)":"var(--border)"}`, borderRadius:8, padding:"11px 16px", cursor:"pointer", transition:"all 0.15s" }}><div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${value===o?"var(--forest)":"var(--border)"}`, background:value===o?"var(--forest)":"white", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{value===o&&<div style={{ width:6, height:6, borderRadius:"50%", background:"white" }} />}</div><span style={{ fontSize:"0.875rem", color:value===o?"var(--forest)":"var(--text2)", fontWeight:value===o?500:400 }}>{o}</span><input type="radio" checked={value===o} onChange={()=>onChange(o)} style={{ display:"none" }} /></label>)}</div>;
const Chk = ({value=[],onChange,options,hasError}) => { const tog=o=>onChange(value.includes(o)?value.filter(v=>v!==o):[...value,o]); return <div style={{ display:"flex", flexDirection:"column", gap:8, borderRadius:8, outline: hasError ? "2px solid var(--red)" : "none", outlineOffset:4 }}>{options.map(o=><label key={o} onClick={()=>tog(o)} style={{ display:"flex", alignItems:"center", gap:12, background:value.includes(o)?"var(--mint2)":"white", border:`1.5px solid ${value.includes(o)?"var(--sage)":"var(--border)"}`, borderRadius:8, padding:"11px 16px", cursor:"pointer", transition:"all 0.15s" }}><div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${value.includes(o)?"var(--forest)":"var(--border)"}`, background:value.includes(o)?"var(--forest)":"white", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", color:"white" }}>{value.includes(o)&&"✓"}</div><span style={{ fontSize:"0.875rem", color:value.includes(o)?"var(--forest)":"var(--text2)", fontWeight:value.includes(o)?500:400 }}>{o}</span></label>)}</div>; };
const TA = ({value,onChange,placeholder,rows=3,hasError}) => <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width:"100%", background: hasError ? "#FEF0EF" : "white", border:`1.5px solid ${hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 14px", color:"var(--text)", fontSize:"0.9rem", resize:"vertical" }} />;

// ─── VALIDATION HELPERS ───────────────────────────────────────────────────────
const validatePhase = (phase, d) => {
  const missing = [];
  if (phase === 1) {
    if (!d.businessName?.trim()) missing.push("businessName");
    if (!d.businessAddress?.trim()) missing.push("businessAddress");
    if (!d.businessNiche) missing.push("businessNiche");
    if (!d.businessStructure) missing.push("businessStructure");
    if (!d.businessAge) missing.push("businessAge");
    if (!d.role) missing.push("role");
    if (!d.exportExperience) missing.push("exportExperience");
    if (!d.targetMarkets?.length) missing.push("targetMarkets");
    if (!d.contactPhone?.trim()) missing.push("contactPhone");
    if (!d.contactEmail?.trim()) missing.push("contactEmail");
    if (!d.contactTime) missing.push("contactTime");
  }
  if (phase === 2) {
    if (!d.productionCapacity) missing.push("productionCapacity");
    if (!d.scalability) missing.push("scalability");
    if (!d.qualityStandards?.length) missing.push("qualityStandards");
    if (!d.monthlyTurnover) missing.push("monthlyTurnover");
    if (!d.loanHistory) missing.push("loanHistory");
    if (!d.digitalCapability) missing.push("digitalCapability");
    if (!d.exportDocsFamiliarity) missing.push("exportDocsFamiliarity");
    if (!d.documents?.length) missing.push("documents");
    if (!d.kycConsent) missing.push("kycConsent");
  }
  if (phase === 3) {
    if (!d.exportProducts?.trim()) missing.push("exportProducts");
    if (!d.shippingCompany) missing.push("shippingCompany");
    if (!d.exportTimeline) missing.push("exportTimeline");
    if (!d.challenges?.length) missing.push("challenges");
    if (!d.supportNeeded?.length) missing.push("supportNeeded");
    if (!d.workingCapital) missing.push("workingCapital");
    if (!d.pilotAgreement) missing.push("pilotAgreement");
    // additionalInfo is optional
  }
  return missing;
};

// ─── SME REGISTRATION ─────────────────────────────────────────────────────────
const Registration = ({ addApp }) => {
  const [phase, setPhase]       = useState(1);
  const [d, setD]               = useState({});
  const [done, setDone]         = useState(false);
  const [ref, setRef]           = useState("");
  const [errors, setErrors]     = useState([]);
  const [shaking, setShaking]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const top = useRef(null);
  const set = (k,v) => { setD(p=>({...p,[k]:v})); setErrors(prev=>prev.filter(e=>e!==k)); };

  const tryNext = () => {
    const missing = validatePhase(phase, d);
    if (missing.length > 0) {
      setErrors(missing);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => {
        const firstEl = document.querySelector(".field-error-anchor");
        if (firstEl) firstEl.scrollIntoView({ behavior:"smooth", block:"center" });
      }, 80);
      return;
    }
    setErrors([]);
    setPhase(p=>p+1);
    setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),80);
  };

  const submit = async () => {
    const missing = validatePhase(3, d);
    if (missing.length > 0) {
      setErrors(missing);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setSubmitting(true);
    const a = await addApp(d);
    setRef(a.id);
    setDone(true);
    setSubmitting(false);
    setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),80);
  };

  const pct = phase===1?33:phase===2?66:100;

  if (done) return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 24px" }}>
      <div className="fade-up" style={{ background:"white", border:"1px solid var(--border)", borderRadius:20, padding:"60px 48px", maxWidth:500, width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(27,61,47,0.1)" }}>
        <div style={{ width:72, height:72, background:"var(--mint2)", borderRadius:"50%", margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem" }}>✓</div>
        <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"2.2rem", color:"var(--forest)", marginBottom:12 }}>Application Received</h2>
        <p style={{ color:"var(--text2)", lineHeight:1.7, marginBottom:28, fontWeight:300 }}>Your application has been successfully received and will be reviewed as part of the screening and selection process. Shortlisted applicants will be contacted via the details provided.</p>
        <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:10, padding:"18px 24px", marginBottom:28 }}>
          <p style={{ fontSize:"0.7rem", color:"var(--text3)", fontWeight:700, letterSpacing:"0.08em", marginBottom:6 }}>YOUR REFERENCE ID</p>
          <p style={{ fontFamily:"Cormorant Garamond", fontSize:"1.5rem", fontWeight:700, color:"var(--forest)" }}>{ref}</p>
        </div>
        <p style={{ fontSize:"0.82rem", color:"var(--text3)" }}>Please ensure your email and phone remain accessible. We look forward to working with you.</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:"var(--sand2)", minHeight:"100vh", padding:"100px 24px 80px" }} ref={top}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ marginBottom:48 }}>
          <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:100, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:14, display:"inline-block" }}>Phase {phase} of 3 · {phase===1?"Business Basics":phase===2?"Compliance and Readiness":"Export Capacity"}</span>
          <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:600, color:"var(--forest)", marginBottom:8, lineHeight:1.15 }}>{phase===1?"Tell us about your business":phase===2?"Compliance and operational readiness":"Export capability and commitment"}</h1>
          <p style={{ color:"var(--text3)", fontSize:"0.875rem" }}>{phase===1?"9 questions · approx. 4 to 5 minutes":phase===2?"9 questions · approx. 4 to 5 minutes":"8 questions · approx. 2 to 3 minutes"}</p>

          {/* Validation error banner */}
          {errors.length > 0 && (
            <div className={shaking ? "shake" : ""} style={{ marginTop:20, background:"#FEF0EF", border:"1.5px solid var(--red)", borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ fontSize:"1rem", flexShrink:0 }}>⚠️</span>
              <div>
                <p style={{ fontSize:"0.85rem", fontWeight:600, color:"var(--red)", marginBottom:3 }}>Please complete all required fields</p>
                <p style={{ fontSize:"0.78rem", color:"#8B2020", lineHeight:1.5 }}>
                  {errors.length} field{errors.length > 1 ? "s" : ""} {errors.length > 1 ? "are" : "is"} missing or incomplete. All questions must be answered before continuing.
                </p>
              </div>
            </div>
          )}

          <div style={{ marginTop:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              {["Business Basics","Compliance","Export Capacity"].map((l,i)=>(<span key={l} style={{ fontSize:"0.72rem", fontWeight:i+1<=phase?600:400, color:i+1<=phase?"var(--forest)":"var(--text3)" }}>{l}</span>))}
            </div>
            <div style={{ background:"var(--border)", height:4, borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg, var(--forest), var(--sage))", borderRadius:4, transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
          {phase===1&&<Ph1 d={d} s={set} errors={errors} />}
          {phase===2&&<Ph2 d={d} s={set} errors={errors} />}
          {phase===3&&<Ph3 d={d} s={set} errors={errors} />}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:48, paddingTop:28, borderTop:"1px solid var(--border)" }}>
          {phase>1?<button onClick={()=>{setPhase(p=>p-1);setErrors([]);}} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"11px 24px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer" }}>Back</button>:<div/>}
          {phase<3
            ?<button onClick={tryNext} style={{ background:"var(--forest)", border:"none", color:"white", padding:"13px 32px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>Continue</button>
            :<button onClick={submit} disabled={submitting} style={{ background:submitting?"var(--sage)":"var(--green-ok)", border:"none", color:"white", padding:"13px 36px", borderRadius:8, fontSize:"0.95rem", fontWeight:600, cursor:submitting?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(27,122,74,0.3)", opacity:submitting?0.8:1 }}>{submitting?"Submitting…":"Submit Application"}</button>
          }
        </div>
      </div>
    </div>
  );
};

// Helper: wraps a field with an anchor for scrolling to errors
const EA = ({id, children}) => <div className={id ? "field-error-anchor" : ""} id={`field-${id}`}>{children}</div>;

const Ph1=({d,s,errors})=>(<>
  <EA id="businessName"><FF num="1" label="Business Name" hasError={errors.includes("businessName")}><TI value={d.businessName} onChange={v=>s("businessName",v)} placeholder="Your registered business name" hasError={errors.includes("businessName")} /></FF></EA>
  <EA id="businessAddress"><FF num="2" label="Business Address" hasError={errors.includes("businessAddress")}><TI value={d.businessAddress} onChange={v=>s("businessAddress",v)} placeholder="Physical business address" hasError={errors.includes("businessAddress")} /></FF></EA>
  <EA id="businessNiche"><FF num="3" label="Business Niche" hasError={errors.includes("businessNiche")}><SI value={d.businessNiche} onChange={v=>s("businessNiche",v)} options={["Grains","Spices","Legumes","Functional Powders","Nuts","Seeds","Others"]} hasError={errors.includes("businessNiche")} /></FF></EA>
  <EA id="businessStructure"><FF num="4" label="Business Structure" hasError={errors.includes("businessStructure")}><Rad value={d.businessStructure} onChange={v=>s("businessStructure",v)} options={["Business Name","Limited Liability","Partnership","None"]} hasError={errors.includes("businessStructure")} /></FF></EA>
  <EA id="businessAge"><FF num="5" label="How long has your business been operating?" hasError={errors.includes("businessAge")}><Rad value={d.businessAge} onChange={v=>s("businessAge",v)} options={["Less than 6 months","6 to 12 months","1 to 2 years","2+ years"]} hasError={errors.includes("businessAge")} /></FF></EA>
  <EA id="role"><FF num="6" label="Your role in the business" hasError={errors.includes("role")}><Rad value={d.role} onChange={v=>s("role",v)} options={["Founder / Owner","Co-founder","Manager","Other"]} hasError={errors.includes("role")} /></FF></EA>
  <EA id="exportExperience"><FF num="7" label="Have you ever sold products or services formally outside Nigeria?" hasError={errors.includes("exportExperience")}><Rad value={d.exportExperience} onChange={v=>s("exportExperience",v)} options={["Yes, currently","Yes, previously","No, but interested","Not sure"]} hasError={errors.includes("exportExperience")} /></FF></EA>
  <EA id="targetMarkets"><FF num="8" label="Which markets interest you most?" hint="Select all that apply" hasError={errors.includes("targetMarkets")}><Chk value={d.targetMarkets} onChange={v=>s("targetMarkets",v)} options={["ECOWAS countries","USA","Canada","Caribbean","Other African countries","Not sure yet"]} hasError={errors.includes("targetMarkets")} /></FF></EA>
  <EA id="contactPhone"><FF num="9" label="Best contact details" hasError={errors.includes("contactPhone")||errors.includes("contactEmail")||errors.includes("contactTime")}>
    <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
      <TI value={d.contactPhone} onChange={v=>s("contactPhone",v)} placeholder="Phone number" hasError={errors.includes("contactPhone")} />
      <TI value={d.contactEmail} onChange={v=>s("contactEmail",v)} placeholder="Email address" hasError={errors.includes("contactEmail")} />
      <SI value={d.contactTime} onChange={v=>s("contactTime",v)} options={["Morning (8am to 12pm)","Afternoon (12pm to 4pm)","Evening (4pm to 7pm)"]} hasError={errors.includes("contactTime")} />
    </div>
  </FF></EA>
</>);

const Ph2=({d,s,errors})=>(<>
  <EA id="productionCapacity"><FF num="10" label="Current monthly production capacity" hasError={errors.includes("productionCapacity")}><Rad value={d.productionCapacity} onChange={v=>s("productionCapacity",v)} options={["0.1kg to 100kg","101kg to 500kg","501kg to 1 metric ton","Above 1 tonne"]} hasError={errors.includes("productionCapacity")} /></FF></EA>
  <EA id="scalability"><FF num="11" label="Can you scale production if orders increase by 50%?" hasError={errors.includes("scalability")}><Rad value={d.scalability} onChange={v=>s("scalability",v)} options={["Yes, immediately","Yes, within 1 month","Yes, with investment","No","Not sure"]} hasError={errors.includes("scalability")} /></FF></EA>
  <EA id="qualityStandards"><FF num="12" label="Do your products meet any quality standards?" hint="Select all that apply" hasError={errors.includes("qualityStandards")}><Chk value={d.qualityStandards} onChange={v=>s("qualityStandards",v)} options={["NAFDAC","SON","ISO","ECOWAS standards","None yet","Not applicable"]} hasError={errors.includes("qualityStandards")} /></FF></EA>
  <EA id="monthlyTurnover"><FF num="13" label="Monthly business turnover" hasError={errors.includes("monthlyTurnover")}><Rad value={d.monthlyTurnover} onChange={v=>s("monthlyTurnover",v)} options={["Below ₦50k","₦50k to ₦200k","₦200k to ₦500k","₦500k to ₦1M","₦1M to ₦5M","₦5M and above"]} hasError={errors.includes("monthlyTurnover")} /></FF></EA>
  <EA id="loanHistory"><FF num="14" label="Have you ever received a business loan or grant?" hasError={errors.includes("loanHistory")}><Rad value={d.loanHistory} onChange={v=>s("loanHistory",v)} options={["Yes, currently repaying","Yes, fully repaid","No, but applied","Never applied"]} hasError={errors.includes("loanHistory")} /></FF></EA>
  <EA id="digitalCapability"><FF num="15" label="Internet access and digital capability" hasError={errors.includes("digitalCapability")}><Rad value={d.digitalCapability} onChange={v=>s("digitalCapability",v)} options={["Strong internet, use digital tools daily","Regular internet access","Limited access","Minimal digital skills"]} hasError={errors.includes("digitalCapability")} /></FF></EA>
  <EA id="exportDocsFamiliarity"><FF num="16" label="Are you familiar with export documentation requirements?" hasError={errors.includes("exportDocsFamiliarity")}><Rad value={d.exportDocsFamiliarity} onChange={v=>s("exportDocsFamiliarity",v)} options={["Yes, experienced","Somewhat familiar","No, but willing to learn","No knowledge"]} hasError={errors.includes("exportDocsFamiliarity")} /></FF></EA>
  <EA id="documents"><FF num="17" label="Do you have or can you obtain:" hint="Select all that apply" hasError={errors.includes("documents")}><Chk value={d.documents} onChange={v=>s("documents",v)} options={["Tax ID","Company letterhead","Product certifications","Export license","None yet"]} hasError={errors.includes("documents")} /></FF></EA>
  <EA id="kycConsent"><FF num="18" label="KYC Verification Consent" hint="Full KYC verification is mandatory for participation and access to this programme." hasError={errors.includes("kycConsent")}><Rad value={d.kycConsent} onChange={v=>s("kycConsent",v)} options={["Yes, I will participate","No","I need further information on the KYC process"]} hasError={errors.includes("kycConsent")} /></FF></EA>
</>);

const Ph3=({d,s,errors})=>(<>
  <EA id="exportProducts"><FF num="19" label="What products or services do you want to export?" hint="Please be as specific as possible." hasError={errors.includes("exportProducts")}><TA value={d.exportProducts} onChange={v=>s("exportProducts",v)} placeholder="Describe your specific products or services..." hasError={errors.includes("exportProducts")} /></FF></EA>
  <EA id="shippingCompany"><FF num="20" label="Do you use a shipping company?" hasError={errors.includes("shippingCompany")}><Rad value={d.shippingCompany} onChange={v=>s("shippingCompany",v)} options={["Yes, always","Yes, sometimes","No"]} hasError={errors.includes("shippingCompany")} /></FF></EA>
  <EA id="exportTimeline"><FF num="21" label="Estimated time needed to prepare for your first export" hasError={errors.includes("exportTimeline")}><Rad value={d.exportTimeline} onChange={v=>s("exportTimeline",v)} options={["Ready now","1 to 3 months","3 to 6 months","6 to 12 months","Over 1 year"]} hasError={errors.includes("exportTimeline")} /></FF></EA>
  <EA id="challenges"><FF num="22" label="Biggest challenge in accessing international markets" hint="Select your top 2 challenges" hasError={errors.includes("challenges")}><Chk value={d.challenges} onChange={v=>s("challenges",v)} options={["Finding buyers","Understanding regulations","Pricing","Shipping and logistics","Payment collection","Product certification","Other"]} hasError={errors.includes("challenges")} /></FF></EA>
  <EA id="supportNeeded"><FF num="23" label="What support do you need most from this programme?" hint="Select your top 3 priorities" hasError={errors.includes("supportNeeded")}><Chk value={d.supportNeeded} onChange={v=>s("supportNeeded",v)} options={["Buyer connections","Training","Compliance guidance","Financing","Shipping support","Marketing","Other"]} hasError={errors.includes("supportNeeded")} /></FF></EA>
  <EA id="workingCapital"><FF num="24" label="Estimated working capital available" hasError={errors.includes("workingCapital")}><Rad value={d.workingCapital} onChange={v=>s("workingCapital",v)} options={["Below ₦100k","₦100k to ₦500k","₦500k to ₦2M","₦2M and above"]} hasError={errors.includes("workingCapital")} /></FF></EA>
  <EA id="pilotAgreement"><FF num="25" label="Pilot transaction requirement" hint="As a standard requirement, initial engagement will commence with small pilot transactions prior to full-scale deals." hasError={errors.includes("pilotAgreement")}><Rad value={d.pilotAgreement} onChange={v=>s("pilotAgreement",v)} options={["Yes, please provide further details on the pilot transaction requirements","No, I will not proceed under this condition"]} hasError={errors.includes("pilotAgreement")} /></FF></EA>
  <FF num="26" label="Is there anything else we should know about your business?" hint="Optional"><TA value={d.additionalInfo} onChange={v=>s("additionalInfo",v)} placeholder="Any other relevant information..." rows={4} /></FF>
</>);

// ─── JOURNALIST PORTAL ────────────────────────────────────────────────────────
const PressPortal = ({ addSubmission, onExit }) => {
  const [d, setD]               = useState({});
  const [done, setDone]         = useState(false);
  const [refId, setRefId]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const set = (k,v) => setD(p=>({...p,[k]:v}));

  const submit = async () => {
    if (!d.name || !d.outlet || !d.email || !d.storyType || !d.headline || !d.content) return;
    setSubmitting(true);
    const s = await addSubmission(d);
    setRefId(s.id);
    setDone(true);
    setSubmitting(false);
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 24px" }}>
      <div className="fade-up" style={{ background:"white", border:"1px solid var(--border)", borderRadius:20, padding:"60px 48px", maxWidth:520, width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(27,61,47,0.1)" }}>
        <div style={{ width:72, height:72, background:"var(--mint2)", borderRadius:"50%", margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem" }}>📰</div>
        <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"2.2rem", color:"var(--forest)", marginBottom:12 }}>Submission Received</h2>
        <p style={{ color:"var(--text2)", lineHeight:1.7, marginBottom:28, fontWeight:300 }}>
          Your press submission has been received by the T2T Programme communications team. All submissions are reviewed before publication. You will be contacted at the email address provided if your submission is selected.
        </p>
        <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:10, padding:"18px 24px", marginBottom:28 }}>
          <p style={{ fontSize:"0.7rem", color:"var(--text3)", fontWeight:700, letterSpacing:"0.08em", marginBottom:6 }}>SUBMISSION REFERENCE</p>
          <p style={{ fontFamily:"Cormorant Garamond", fontSize:"1.5rem", fontWeight:700, color:"var(--forest)" }}>{refId}</p>
        </div>
        <p style={{ fontSize:"0.82rem", color:"var(--text3)", marginBottom:24 }}>
          For urgent enquiries contact: <strong>applications@t2tprogramme.com</strong>
        </p>
        <button onClick={onExit} style={{ background:"var(--forest)", color:"white", border:"none", padding:"12px 28px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>Back to Newsroom</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", padding:"100px 24px 80px" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ marginBottom:48 }}>
          <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:100, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:14, display:"inline-block" }}>
            PRESS PORTAL · ACCREDITED JOURNALISTS
          </span>
          <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:600, color:"var(--forest)", lineHeight:1.1, marginBottom:12 }}>
            Submit a Story or Press Release
          </h1>
          <p style={{ color:"var(--text2)", lineHeight:1.7, fontWeight:300, marginBottom:20 }}>
            Use this portal to submit press releases, story pitches, or editorial contributions for consideration in the T2T Programme Digital Newsroom. All submissions are reviewed by the communications team before publication.
          </p>
          <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:10 }}>
            <span style={{ fontSize:"1rem", flexShrink:0, marginTop:1 }}>ℹ️</span>
            <p style={{ fontSize:"0.8rem", color:"var(--text2)", lineHeight:1.6 }}>
              Submissions do not guarantee publication. The T2T Programme reserves the right to edit, withhold, or decline any submission. Response time is typically 2 to 3 business days.
            </p>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
          <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:14, padding:"32px 28px" }}>
            <p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--forest)", letterSpacing:"0.1em", marginBottom:24, paddingBottom:12, borderBottom:"1px solid var(--border2)" }}>YOUR DETAILS</p>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div className="press-form-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Full Name</label><TI value={d.name} onChange={v=>set("name",v)} placeholder="Your full name" /></div>
                <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Media Outlet</label><TI value={d.outlet} onChange={v=>set("outlet",v)} placeholder="Publication or outlet name" /></div>
              </div>
              <div className="press-form-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Email Address</label><TI value={d.email} onChange={v=>set("email",v)} placeholder="Your work email" /></div>
                <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Phone Number</label><TI value={d.phone} onChange={v=>set("phone",v)} placeholder="Contact number" /></div>
              </div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Country</label><SI value={d.country} onChange={v=>set("country",v)} options={["Nigeria","Ghana","Senegal","Côte d'Ivoire","Kenya","South Africa","United Kingdom","United States","Canada","Other"]} /></div>
            </div>
          </div>
          <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:14, padding:"32px 28px" }}>
            <p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--forest)", letterSpacing:"0.1em", marginBottom:24, paddingBottom:12, borderBottom:"1px solid var(--border2)" }}>SUBMISSION DETAILS</p>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Submission Type</label><Rad value={d.storyType} onChange={v=>set("storyType",v)} options={["Press Release","News Story","Feature Article","Opinion / Commentary","Interview Request","Event Coverage"]} /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Headline / Title</label><TI value={d.headline} onChange={v=>set("headline",v)} placeholder="Proposed headline for your submission" /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Summary</label><p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:8 }}>A brief 1 to 2 sentence summary of your story or pitch.</p><TA value={d.summary} onChange={v=>set("summary",v)} placeholder="Briefly describe your story..." rows={2} /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Full Content</label><p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:8 }}>Paste your full press release, article, or story pitch below.</p><TA value={d.content} onChange={v=>set("content",v)} placeholder="Full content of your submission..." rows={10} /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Image URL (Optional)</label><p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:8 }}>Link to a high-resolution image to accompany the story (must be publicly accessible).</p><TI value={d.imageUrl} onChange={v=>set("imageUrl",v)} placeholder="https://..." /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Category</label><SI value={d.category} onChange={v=>set("category",v)} options={["PRESS RELEASE","NEWS STORY","PARTNER SPOTLIGHT","PROGRAMME UPDATE","OPINION","MEDIA RESOURCE","EVENT COVERAGE"]} /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Any additional notes for the editorial team? (Optional)</label><TA value={d.notes} onChange={v=>set("notes",v)} placeholder="Embargo dates, corrections, context, special requests..." rows={3} /></div>
            </div>
          </div>
          <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:12, padding:"20px 24px" }}>
            <Chk value={d.declaration||[]} onChange={v=>set("declaration",v)} options={["I confirm this content is accurate and original","I authorise the T2T Programme to publish and edit this submission","I understand this does not guarantee publication"]} />
          </div>
        </div>
        <div style={{ marginTop:40, paddingTop:28, borderTop:"1px solid var(--border)", display:"flex", justifyContent:"flex-end", gap:12 }}>
          <button onClick={onExit} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"11px 24px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer" }}>Cancel</button>
          <button onClick={submit} disabled={submitting} style={{ background:submitting?"var(--sage)":"var(--forest)", border:"none", color:"white", padding:"13px 36px", borderRadius:8, fontSize:"0.95rem", fontWeight:600, cursor:submitting?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(27,61,47,0.25)", opacity:submitting?0.8:1 }}>
            {submitting ? "Submitting…" : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── NEWSROOM ─────────────────────────────────────────────────────────────────
const Newsroom = ({ setPage, approvedSubmissions }) => {
  const m = useMobile();
  const [art, setArt] = useState(null);

  const approvedAsArticles = approvedSubmissions.map(s => ({
    id: s.id, cat: s.category || "PRESS RELEASE",
    date: new Date(s.submitted_at || s.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),
    headline: s.headline, summary: s.summary || s.content?.substring(0,180)+"...",
    img: s.image_url || s.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80",
    source: s.outlet, featured: false, fullContent: s.content,
  }));

  const allArticles = [...staticNews, ...approvedAsArticles];
  const feat = allArticles.find(n=>n.featured) || allArticles[0];
  const rest = allArticles.filter(n=>n.id!==feat.id);

  if (art) return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", padding:m?"80px 20px 60px":"100px 80px 80px", maxWidth:900, margin:"0 auto" }}>
      <button onClick={()=>setArt(null)} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"8px 18px", borderRadius:8, fontSize:"0.8rem", fontWeight:500, cursor:"pointer", marginBottom:40 }}>Back to Newsroom</button>
      <div className="fade-up">
        <span style={{ background:"var(--forest)", color:"var(--mint)", padding:"3px 12px", borderRadius:4, fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.1em" }}>{art.cat}</span>
        <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"2.6rem", fontWeight:600, color:"var(--forest)", marginTop:16, marginBottom:10, lineHeight:1.2 }}>{art.headline}</h1>
        <div style={{ display:"flex", gap:16, marginBottom:32, alignItems:"center" }}>
          <p style={{ color:"var(--text3)", fontSize:"0.85rem" }}>{art.date}</p>
          {art.source && <span style={{ background:"var(--mint2)", color:"var(--forest3)", padding:"2px 10px", borderRadius:100, fontSize:"0.72rem", fontWeight:500 }}>{art.source}</span>}
        </div>
        <div style={{ height:320, borderRadius:16, overflow:"hidden", marginBottom:48 }}>
          <img src={art.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <p style={{ color:"var(--text)", lineHeight:1.9, fontSize:"1.05rem", marginBottom:20, fontWeight:300 }}>{art.summary}</p>
        {art.fullContent
          ? <p style={{ color:"var(--text2)", lineHeight:1.9, fontWeight:300, whiteSpace:"pre-wrap" }}>{art.fullContent}</p>
          : <>
              <p style={{ color:"var(--text2)", lineHeight:1.9, fontWeight:300 }}>The Training-to-Transaction (T2T) Programme is a landmark collaboration between Providus Bank, the ECOWAS Parliament, and the Global African Business Association (GABA). Designed to bridge the gap between SME readiness and commercial transactions, the programme runs for three months across Lagos and Abuja.</p>
              <p style={{ color:"var(--text2)", lineHeight:1.9, fontWeight:300, marginTop:16 }}>Selected SMEs gain access to trade finance through Providus Bank, buyer linkage networks, and a pathway into the US, Canada, and Caribbean market pipelines. Up to 50 companies will be selected for direct market access programmes following performance assessment.</p>
            </>
        }
        <div style={{ marginTop:56, background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:16, padding:"36px 40px" }}>
          <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.4rem", color:"var(--forest)", marginBottom:20 }}>Media Contacts</h3>
          <div style={{ display:"grid", gridTemplateColumns: m?"1fr":"repeat(3, 1fr)", gap:20 }}>
            {[{name:"Media Enquiries",email:"applications@t2tprogramme.com",org:"T2T Programme Office"},{name:"Providus Bank Comms",email:"applications@t2tprogramme.com",org:"Providus Bank"},{name:"Programme Updates",email:"applications@t2tprogramme.com",org:"Duchess NL and BTI"}].map(c=>(
              <div key={c.email}><p style={{ fontWeight:600, fontSize:"0.875rem", marginBottom:3 }}>{c.name}</p><p style={{ color:"var(--forest)", fontSize:"0.83rem", marginBottom:2 }}>{c.email}</p><p style={{ color:"var(--text3)", fontSize:"0.78rem" }}>{c.org}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", paddingTop: m?80:100, paddingBottom: m?60:80 }}>
      <div className="wrap">
        <div style={{ marginBottom:60, display:"flex", flexDirection:m?"column":"row", justifyContent:"space-between", alignItems:m?"flex-start":"flex-end", paddingBottom:32, borderBottom:"1px solid var(--border)", gap:20 }}>
          <div>
            <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:6, padding:"4px 12px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:12, display:"inline-block" }}>DIGITAL NEWSROOM</span>
            <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"3.2rem", fontWeight:600, color:"var(--forest)", lineHeight:1 }}>Press and Media</h1>
            <p style={{ color:"var(--text3)", marginTop:8 }}>Official communications for media professionals, journalists, and stakeholders.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems: m?"flex-start":"flex-end" }}>
            <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:12, padding:"16px 20px" }}>
              <p style={{ fontSize:"0.7rem", color:"var(--text3)", fontWeight:700, letterSpacing:"0.08em", marginBottom:4 }}>PRESS CONTACT</p>
              <p style={{ color:"var(--forest)", fontWeight:600, fontSize:"0.875rem" }}>applications@t2tprogramme.com</p>
            </div>
            <button onClick={()=>setPage("press-gate")} style={{ background:"var(--forest)", color:"white", border:"none", padding:"10px 20px", borderRadius:8, fontSize:"0.82rem", fontWeight:600, cursor:"pointer", letterSpacing:"0.02em" }}>Submit a Story</button>
          </div>
        </div>

        <div onClick={()=>setArt(feat)} className="card-hover" style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", background:"white", borderRadius:16, border:"1px solid var(--border)", overflow:"hidden", marginBottom:40, cursor:"pointer" }}>
          <div style={{ height:m?220:380, overflow:"hidden" }}>
            <img src={feat.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }} onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
          </div>
          <div style={{ padding:"44px 40px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
              <span style={{ background:"var(--forest)", color:"var(--mint)", padding:"3px 12px", borderRadius:4, fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.08em" }}>FEATURED</span>
              <span style={{ background:"var(--mint2)", color:"var(--forest3)", padding:"3px 12px", borderRadius:4, fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.08em" }}>{feat.cat}</span>
            </div>
            <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.7rem", fontWeight:600, color:"var(--forest)", lineHeight:1.2, marginBottom:14 }}>{feat.headline}</h2>
            <p style={{ color:"var(--text2)", lineHeight:1.7, fontSize:"0.875rem", marginBottom:20, fontWeight:300 }}>{feat.summary}</p>
            <p style={{ color:"var(--text3)", fontSize:"0.78rem" }}>{feat.date}</p>
          </div>
        </div>

        {rest.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"repeat(3, 1fr)", gap:16, marginBottom:60 }}>
            {rest.map(a=>(
              <div key={a.id} onClick={()=>setArt(a)} className="card-hover" style={{ background:"white", borderRadius:14, border:"1px solid var(--border)", overflow:"hidden", cursor:"pointer" }}>
                <div style={{ height:200, overflow:"hidden" }}>
                  <img src={a.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
                </div>
                <div style={{ padding:"22px 22px 24px" }}>
                  <span style={{ fontSize:"0.65rem", fontWeight:600, letterSpacing:"0.1em", color:"var(--sage)", display:"inline-block", marginBottom:8 }}>{a.cat}</span>
                  <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.15rem", fontWeight:600, color:"var(--forest)", lineHeight:1.3, marginBottom:8 }}>{a.headline}</h3>
                  <p style={{ fontSize:"0.82rem", color:"var(--text2)", lineHeight:1.6, marginBottom:12 }}>{a.summary?.substring(0,110)}...</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <p style={{ color:"var(--text3)", fontSize:"0.75rem" }}>{a.date}</p>
                    {a.source && <span style={{ background:"var(--mint2)", color:"var(--forest3)", padding:"2px 8px", borderRadius:100, fontSize:"0.65rem", fontWeight:500 }}>{a.source}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:20, padding:m?"28px 20px":"48px" }}>
          <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.8rem", fontWeight:600, color:"var(--forest)", marginBottom:6 }}>Media Resources</h2>
          <p style={{ color:"var(--text3)", marginBottom:32, fontSize:"0.875rem" }}>Official assets for press use</p>
          <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"repeat(3, 1fr)", gap:12, marginBottom:32 }}>
            {[{icon:"📄",title:"Programme Fact Sheet",type:"PDF · 2 pages"},{icon:"🎨",title:"Partner Logos Pack",type:"ZIP · Brand assets"},{icon:"📑",title:"Programme Overview",type:"PDF · 8 pages"}].map(({icon,title,type})=>(
              <div key={title} style={{ background:"white", border:"1px solid var(--border)", borderRadius:12, padding:"20px", display:"flex", alignItems:"center", gap:14, cursor:"pointer", transition:"all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(27,61,47,0.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{ fontSize:"1.5rem" }}>{icon}</div>
                <div><p style={{ fontWeight:600, fontSize:"0.875rem", marginBottom:2 }}>{title}</p><p style={{ color:"var(--text3)", fontSize:"0.75rem" }}>{type}</p></div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop:32, borderTop:"1px solid var(--border)" }}>
            <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.3rem", fontWeight:600, color:"var(--forest)", marginBottom:16 }}>Press Contacts</h3>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"repeat(3, 1fr)", gap:12 }}>
              {[{name:"Media Enquiries",email:"applications@t2tprogramme.com",org:"T2T Programme Office"},{name:"Providus Bank Comms",email:"applications@t2tprogramme.com",org:"Providus Bank"},{name:"Programme Updates",email:"applications@t2tprogramme.com",org:"Duchess NL and BTI"}].map(c=>(
                <div key={c.email} style={{ background:"white", border:"1px solid var(--border)", borderRadius:10, padding:"16px 18px" }}>
                  <p style={{ fontWeight:600, fontSize:"0.875rem", marginBottom:3 }}>{c.name}</p>
                  <p style={{ color:"var(--forest)", fontSize:"0.82rem", marginBottom:2 }}>{c.email}</p>
                  <p style={{ color:"var(--text3)", fontSize:"0.75rem" }}>{c.org}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const Dashboard = ({ apps, upAppStatus, submissions, upSubStatus, onExit }) => {
  const [tab, setTab]                 = useState("sme");
  const [filter, setFilter]           = useState("all");
  const [sort, setSort]               = useState("score");
  const [exp, setExp]                 = useState(null);
  const [pressFilter, setPressFilter] = useState("all");
  const [pressExp, setPressExp]       = useState(null);

  const list = apps.filter(a=>filter==="all"||a.status===filter).sort((a,b)=>sort==="score"?b.score-a.score:new Date(b.submitted_at||b.submittedAt)-new Date(a.submitted_at||a.submittedAt));
  const pressList = submissions.filter(s=>pressFilter==="all"||s.status===pressFilter).sort((a,b)=>new Date(b.submitted_at||b.submittedAt)-new Date(a.submitted_at||a.submittedAt));

  const counts = { total:apps.length, pending:apps.filter(a=>a.status==="pending").length, approved:apps.filter(a=>a.status==="approved").length, rejected:apps.filter(a=>a.status==="rejected").length, avg:apps.length?Math.round(apps.reduce((s,a)=>s+a.score,0)/apps.length):0 };
  const pCounts = { total:submissions.length, pending:submissions.filter(s=>s.status==="pending").length, approved:submissions.filter(s=>s.status==="approved").length, rejected:submissions.filter(s=>s.status==="rejected").length };

  const ScorePill=({v})=>{const c=v>=70?"#1B7A4A":v>=50?"#B8943F":"#C0392B";const bg=v>=70?"#E8F5EF":v>=50?"#FDF5E0":"#FDECEA";return <span style={{ background:bg,color:c,padding:"3px 10px",borderRadius:100,fontSize:"0.75rem",fontWeight:600,border:`1px solid ${c}30` }}>{v} · {v>=70?"High":v>=50?"Medium":"Low"}</span>;};
  const StPill=({st})=>{const m={pending:{bg:"#FEF9E7",c:"#B8943F"},approved:{bg:"#E8F5EF",c:"#1B7A4A"},rejected:{bg:"#FDECEA",c:"#C0392B"}};const {bg,c}=m[st]||m.pending;return <span style={{ background:bg,color:c,padding:"3px 10px",borderRadius:100,fontSize:"0.75rem",fontWeight:600,textTransform:"capitalize" }}>{st}</span>;};

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", padding:"40px 48px 80px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:36, flexWrap:"wrap", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:40, height:40, background:"var(--forest)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <p style={{ fontSize:"0.7rem", color:"var(--text3)", fontWeight:600, letterSpacing:"0.08em" }}>ADMIN DASHBOARD</p>
              <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.8rem", fontWeight:600, color:"var(--forest)", lineHeight:1 }}>T2T Programme Control Panel</h1>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><span className="live-dot" /><span style={{ fontSize:"0.82rem", color:"var(--text3)" }}>Live</span></div>
            <button onClick={onExit} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text3)", padding:"7px 16px", borderRadius:8, fontSize:"0.8rem", fontWeight:500, cursor:"pointer" }}>Exit Admin</button>
          </div>
        </div>

        <div style={{ display:"flex", gap:4, marginBottom:28, borderBottom:"1px solid var(--border)" }}>
          {[{key:"sme",label:"SME Applications"},{key:"press",label:"Press Submissions",badge:pCounts.pending}].map(({key,label,badge})=>(
            <button key={key} onClick={()=>setTab(key)} style={{ background:"transparent", border:"none", borderBottom:`2.5px solid ${tab===key?"var(--forest)":"transparent"}`, color:tab===key?"var(--forest)":"var(--text3)", padding:"10px 20px 12px", fontSize:"0.9rem", fontWeight:tab===key?600:400, cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"all 0.15s" }}>
              {label}
              {badge>0 && <span style={{ background:"var(--red)", color:"white", borderRadius:100, padding:"1px 8px", fontSize:"0.7rem", fontWeight:700 }}>{badge}</span>}
            </button>
          ))}
        </div>

        {tab==="sme" && (
          <>
            <div className="dash-stats" style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:14, marginBottom:28 }}>
              {[{label:"Total Received",val:counts.total,acc:"var(--forest)"},{label:"Pending Review",val:counts.pending,acc:"#B8943F"},{label:"Approved",val:counts.approved,acc:"#1B7A4A"},{label:"Rejected",val:counts.rejected,acc:"#C0392B"},{label:"Average Score",val:`${counts.avg}/100`,acc:"var(--forest)"}].map(({label,val,acc})=>(
                <div key={label} style={{ background:"white", border:"1px solid var(--border)", borderRadius:12, padding:"20px", borderTop:`3px solid ${acc}` }}>
                  <p style={{ fontSize:"0.72rem", color:"var(--text3)", fontWeight:500, marginBottom:8 }}>{label}</p>
                  <p style={{ fontFamily:"Cormorant Garamond", fontSize:"1.9rem", fontWeight:700, color:acc }}>{val}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
              {["all","pending","approved","rejected"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?"var(--forest)":"white", border:`1.5px solid ${filter===f?"var(--forest)":"var(--border)"}`, color:filter===f?"white":"var(--text2)", padding:"7px 18px", borderRadius:8, fontSize:"0.82rem", fontWeight:500, cursor:"pointer", textTransform:"capitalize" }}>
                  {f==="all"?"All Applications":f}
                </button>
              ))}
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{ marginLeft:"auto", background:"white", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"7px 16px", borderRadius:8, fontSize:"0.82rem", cursor:"pointer" }}>
                <option value="score">Sort by Score</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
            {apps.length===0
              ? <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, padding:"80px 40px", textAlign:"center" }}><p style={{ fontSize:"3rem", marginBottom:16 }}>📋</p><h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.6rem", color:"var(--forest)", marginBottom:8 }}>No applications yet</h3><p style={{ color:"var(--text3)" }}>Applications will appear here as SMEs register.</p></div>
              : <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1.4fr 1fr 1fr 1fr 110px", padding:"12px 24px", background:"var(--sand2)", borderBottom:"1px solid var(--border)", fontSize:"0.68rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em" }}>
                    <span>BUSINESS</span><span>NICHE AND LOCATION</span><span>TURNOVER</span><span>SCORE</span><span>STATUS</span><span>ACTIONS</span>
                  </div>
                  {list.map((a,i)=>(
                    <div key={a.id}>
                      <div onClick={()=>setExp(exp===a.id?null:a.id)} style={{ display:"grid", gridTemplateColumns:"2fr 1.4fr 1fr 1fr 1fr 110px", alignItems:"center", padding:"16px 24px", background:exp===a.id?"var(--mint2)":i%2===0?"white":"var(--cream)", borderBottom:"1px solid var(--border2)", cursor:"pointer" }}>
                        <div><p style={{ fontWeight:600, fontSize:"0.9rem", color:"var(--forest)" }}>{a.business_name||a.businessName||"Not provided"}</p><p style={{ color:"var(--text3)", fontSize:"0.72rem", marginTop:2 }}>{a.id}</p></div>
                        <div><p style={{ fontSize:"0.85rem" }}>{a.business_niche||a.businessNiche||"Not specified"}</p><p style={{ color:"var(--text3)", fontSize:"0.72rem" }}>{(a.business_address||a.businessAddress)?(a.business_address||a.businessAddress).split(",")[0]:"Not provided"}</p></div>
                        <p style={{ fontSize:"0.85rem", color:"var(--text2)" }}>{a.monthly_turnover||a.monthlyTurnover||"Not stated"}</p>
                        <ScorePill v={a.score} />
                        <StPill st={a.status} />
                        <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>upAppStatus(a.id,"approved")} style={{ background:"#E8F5EF", border:"1px solid #1B7A4A40", color:"#1B7A4A", padding:"6px 12px", borderRadius:6, fontSize:"0.78rem", cursor:"pointer", fontWeight:600 }}>✓</button>
                          <button onClick={()=>upAppStatus(a.id,"rejected")} style={{ background:"#FDECEA", border:"1px solid #C0392B40", color:"#C0392B", padding:"6px 12px", borderRadius:6, fontSize:"0.78rem", cursor:"pointer", fontWeight:600 }}>✕</button>
                        </div>
                      </div>
                      {exp===a.id && (
                        <div className="fade-up" style={{ padding:"28px 24px 32px", background:"var(--mint2)", borderBottom:"1px solid var(--border)", display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20 }}>
                          {[["Business Name",a.business_name||a.businessName],["Address",a.business_address||a.businessAddress],["Niche",a.business_niche||a.businessNiche],["Structure",a.business_structure||a.businessStructure],["Operating Since",a.business_age||a.businessAge],["Role",a.role],["Export Experience",a.export_experience||a.exportExperience],["Target Markets",((a.target_markets||a.targetMarkets)||[]).join(", ")],["Contact Email",a.contact_email||a.contactEmail],["Phone",a.contact_phone||a.contactPhone],["Production Capacity",a.production_capacity||a.productionCapacity],["Monthly Turnover",a.monthly_turnover||a.monthlyTurnover],["Working Capital",a.working_capital||a.workingCapital],["Export Familiarity",a.export_docs_familiarity||a.exportDocsFamiliarity],["Quality Standards",((a.quality_standards||a.qualityStandards)||[]).join(", ")],["KYC Consent",a.kyc_consent||a.kycConsent],["Export Products",a.export_products||a.exportProducts],["Export Timeline",a.export_timeline||a.exportTimeline],["Challenges",((a.challenges)||[]).join(", ")],["Support Needed",((a.support_needed||a.supportNeeded)||[]).join(", ")],["Submitted",new Date(a.submitted_at||a.submittedAt).toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"})]].filter(([,v])=>v&&v!=="").map(([label,value])=>(
                            <div key={label}><p style={{ fontSize:"0.65rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:3 }}>{label.toUpperCase()}</p><p style={{ fontSize:"0.85rem", color:"var(--text)", lineHeight:1.5 }}>{value}</p></div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            }
          </>
        )}

        {tab==="press" && (
          <>
            <div className="dash-stats" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, marginBottom:28 }}>
              {[{label:"Total Submissions",val:pCounts.total,acc:"var(--forest)"},{label:"Awaiting Review",val:pCounts.pending,acc:"#B8943F"},{label:"Published",val:pCounts.approved,acc:"#1B7A4A"},{label:"Declined",val:pCounts.rejected,acc:"#C0392B"}].map(({label,val,acc})=>(
                <div key={label} style={{ background:"white", border:"1px solid var(--border)", borderRadius:12, padding:"20px", borderTop:`3px solid ${acc}` }}>
                  <p style={{ fontSize:"0.72rem", color:"var(--text3)", fontWeight:500, marginBottom:8 }}>{label}</p>
                  <p style={{ fontFamily:"Cormorant Garamond", fontSize:"1.9rem", fontWeight:700, color:acc }}>{val}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {["all","pending","approved","rejected"].map(f=>(
                <button key={f} onClick={()=>setPressFilter(f)} style={{ background:pressFilter===f?"var(--forest)":"white", border:`1.5px solid ${pressFilter===f?"var(--forest)":"var(--border)"}`, color:pressFilter===f?"white":"var(--text2)", padding:"7px 18px", borderRadius:8, fontSize:"0.82rem", fontWeight:500, cursor:"pointer", textTransform:"capitalize" }}>
                  {f==="all"?"All Submissions":f==="approved"?"Published":f==="rejected"?"Declined":f}
                </button>
              ))}
            </div>
            {submissions.length===0
              ? <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, padding:"80px 40px", textAlign:"center" }}><p style={{ fontSize:"3rem", marginBottom:16 }}>📰</p><h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.6rem", color:"var(--forest)", marginBottom:8 }}>No press submissions yet</h3><p style={{ color:"var(--text3)" }}>Journalist submissions will appear here for review.</p></div>
              : <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"2.5fr 1.5fr 1fr 1fr 120px", padding:"12px 24px", background:"var(--sand2)", borderBottom:"1px solid var(--border)", fontSize:"0.68rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em" }}>
                    <span>HEADLINE</span><span>JOURNALIST AND OUTLET</span><span>TYPE</span><span>STATUS</span><span>ACTIONS</span>
                  </div>
                  {pressList.map((s,i)=>(
                    <div key={s.id}>
                      <div onClick={()=>setPressExp(pressExp===s.id?null:s.id)} style={{ display:"grid", gridTemplateColumns:"2.5fr 1.5fr 1fr 1fr 120px", alignItems:"center", padding:"16px 24px", background:pressExp===s.id?"var(--mint2)":i%2===0?"white":"var(--cream)", borderBottom:"1px solid var(--border2)", cursor:"pointer" }}>
                        <div>
                          <p style={{ fontWeight:600, fontSize:"0.88rem", color:"var(--forest)", lineHeight:1.3 }}>{s.headline||"Untitled"}</p>
                          <p style={{ color:"var(--text3)", fontSize:"0.72rem", marginTop:2 }}>{s.id} · {new Date(s.submitted_at||s.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p>
                        </div>
                        <div>
                          <p style={{ fontSize:"0.85rem", fontWeight:500 }}>{s.name||"Unknown"}</p>
                          <p style={{ color:"var(--text3)", fontSize:"0.75rem" }}>{s.outlet||"No outlet"}</p>
                        </div>
                        <span style={{ background:"var(--mint2)", color:"var(--forest3)", padding:"3px 8px", borderRadius:4, fontSize:"0.68rem", fontWeight:600 }}>{s.story_type||s.storyType||"Submission"}</span>
                        <StPill st={s.status} />
                        <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>upSubStatus(s.id,"approved")} style={{ background:"#E8F5EF", border:"1px solid #1B7A4A40", color:"#1B7A4A", padding:"6px 10px", borderRadius:6, fontSize:"0.75rem", cursor:"pointer", fontWeight:700 }}>Publish</button>
                          <button onClick={()=>upSubStatus(s.id,"rejected")} style={{ background:"#FDECEA", border:"1px solid #C0392B40", color:"#C0392B", padding:"6px 10px", borderRadius:6, fontSize:"0.75rem", cursor:"pointer", fontWeight:700 }}>Decline</button>
                        </div>
                      </div>
                      {pressExp===s.id && (
                        <div className="fade-up" style={{ padding:"28px 32px", background:"var(--mint2)", borderBottom:"1px solid var(--border)" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:24 }}>
                            {[["Journalist",s.name],["Outlet",s.outlet],["Email",s.email],["Phone",s.phone],["Country",s.country],["Category",s.category],["Story Type",s.story_type||s.storyType],["Submitted",new Date(s.submitted_at||s.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})]].filter(([,v])=>v).map(([l,v])=>(
                              <div key={l}><p style={{ fontSize:"0.65rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:3 }}>{l.toUpperCase()}</p><p style={{ fontSize:"0.85rem", color:"var(--text)" }}>{v}</p></div>
                            ))}
                          </div>
                          {s.summary && <div style={{ marginBottom:16 }}><p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:6 }}>SUMMARY</p><p style={{ fontSize:"0.875rem", color:"var(--text)", lineHeight:1.7 }}>{s.summary}</p></div>}
                          {s.content && <div style={{ marginBottom:16 }}><p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:6 }}>FULL CONTENT</p><div style={{ background:"white", border:"1px solid var(--border)", borderRadius:8, padding:"16px 20px", maxHeight:300, overflowY:"auto" }}><p style={{ fontSize:"0.875rem", color:"var(--text)", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{s.content}</p></div></div>}
                          {(s.image_url||s.imageUrl) && <div style={{ marginBottom:16 }}><p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:6 }}>IMAGE URL</p><p style={{ fontSize:"0.85rem", color:"var(--forest)" }}>{s.image_url||s.imageUrl}</p></div>}
                          {s.notes && <div><p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:6 }}>EDITORIAL NOTES</p><p style={{ fontSize:"0.85rem", color:"var(--text)", lineHeight:1.6 }}>{s.notes}</p></div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            }
          </>
        )}
      </div>
    </div>
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]                   = useState("landing");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pressUnlocked, setPressUnlocked] = useState(false);
  const { apps, addApp, upAppStatus, submissions, addSubmission, upSubStatus, loading, dbError } = useDataStore();

  const logoClicks = useRef(0);
  const logoTimer  = useRef(null);

  const handleLogoClick = () => {
    logoClicks.current += 1;
    clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(() => { logoClicks.current = 0; }, 2000);
    if (logoClicks.current >= 5) {
      logoClicks.current = 0;
      setAdminUnlocked(false);
      setPage("admin-gate");
    } else {
      setPage("landing");
    }
  };

  const approvedSubmissions = submissions.filter(s => s.status === "approved");
  const showNav = !["admin-gate","dashboard"].includes(page);

  // ── DB error banner (non-blocking) ──
  const DbBanner = () => dbError ? (
    <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:"#FEF0EF", border:"1.5px solid var(--red)", borderRadius:10, padding:"12px 20px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", maxWidth:480 }}>
      <span>⚠️</span>
      <p style={{ fontSize:"0.82rem", color:"var(--red)", fontWeight:500 }}>{dbError}</p>
    </div>
  ) : null;

  // ── Loading screen ──
  if (loading) return (
    <>
      <GlobalStyles />
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #0D1147 0%, #111660 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20 }}>
        <div style={{ width:48, height:48, border:"3px solid rgba(200,230,218,0.2)", borderTop:"3px solid var(--mint)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <p style={{ color:"rgba(200,230,218,0.7)", fontSize:"0.875rem", fontWeight:300 }}>Loading T2T Programme…</p>
      </div>
    </>
  );

  return (
    <>
      <GlobalStyles />
      <DbBanner />
      {showNav && <Nav page={page} setPage={setPage} onLogoClick={handleLogoClick} />}

      {page==="landing"   && <Landing setPage={setPage} />}
      {page==="register"  && <Registration addApp={addApp} />}
      {page==="newsroom"  && <Newsroom setPage={setPage} approvedSubmissions={approvedSubmissions} />}

      {page==="press-gate" && !pressUnlocked && (
        <PasswordGate
          title="Press Portal"
          subtitle="This portal is for accredited journalists and media professionals. Enter your press credentials to continue."
          password={PRESS_PASSWORD}
          buttonLabel="Enter Press Portal"
          onUnlock={() => { setPressUnlocked(true); setPage("press-portal"); }}
        />
      )}
      {page==="press-portal" && pressUnlocked && (
        <PressPortal addSubmission={addSubmission} onExit={() => { setPressUnlocked(false); setPage("newsroom"); }} />
      )}

      {page==="admin-gate" && !adminUnlocked && (
        <PasswordGate
          title="Admin Access"
          subtitle="This area is restricted. Enter your admin password to continue."
          password={ADMIN_PASSWORD}
          buttonLabel="Enter Dashboard"
          onUnlock={() => { setAdminUnlocked(true); setPage("dashboard"); }}
        />
      )}
      {page==="dashboard" && adminUnlocked && (
        <Dashboard apps={apps} upAppStatus={upAppStatus} submissions={submissions} upSubStatus={upSubStatus} onExit={() => { setAdminUnlocked(false); setPage("landing"); }} />
      )}
    </>
  );
}