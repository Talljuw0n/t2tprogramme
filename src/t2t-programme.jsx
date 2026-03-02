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
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --forest:#1B3D2F; --forest2:#234D3B; --forest3:#2E6249;
      --sage:#4A7C63; --sage-light:#6B9E84;
      --mint:#C8E6DA; --mint2:#E8F5EF;
      --sand:#F5EFE0; --sand2:#FDF9F3; --cream:#FFFEF9;
      --text:#1A2820; --text2:#3D5449; --text3:#6B7F76;
      --border:#D8E8E0; --border2:#EAF2EC;
      --white:#FFFFFF; --red:#C0392B; --green-ok:#1B7A4A;
      --amber:#B8943F; --amber-bg:#FDF5E0;
    }
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
    .card-hover:hover { transform:translateY(-4px);box-shadow:0 20px 60px rgba(27,61,47,0.12); }
    input,select,textarea { font-family:'Outfit',sans-serif; }
    input:focus,select:focus,textarea:focus { outline:none;border-color:var(--forest) !important;box-shadow:0 0 0 3px rgba(27,61,47,0.08); }
    button { font-family:'Outfit',sans-serif; }
    /* ── MOBILE RESPONSIVE ── */
    @media (max-width: 768px) {
      .hero-section { padding:100px 24px 48px !important; min-height:auto !important; }
      .hero-buttons { flex-direction:column !important; }
      .hero-buttons button { width:100% !important; }
      .overview-card { position:relative !important; right:auto !important; bottom:auto !important; width:100% !important; min-width:unset !important; margin-top:36px !important; box-shadow:none !important; }
      .partners-grid { grid-template-columns:repeat(2,1fr) !important; }
      .stages-grid { grid-template-columns:1fr !important; gap:40px !important; }
      .eligibility-grid { grid-template-columns:1fr !important; }
      .section-pad { padding:60px 24px !important; }
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
      .cta-section { padding:60px 24px !important; }
    }
  `}</style>
);

// ─── PASSWORDS ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "T2T@Admin2026";
const PRESS_PASSWORD = "T2TPress2026";

// ─── DATA STORE ───────────────────────────────────────────────────────────────
const useDataStore = () => {
  const [apps, setApps] = useState(() => { try { return JSON.parse(localStorage.getItem("t2t_apps")||"[]"); } catch { return []; } });
  const [submissions, setSubmissions] = useState(() => { try { return JSON.parse(localStorage.getItem("t2t_press")||"[]"); } catch { return []; } });

  const addApp = (data) => {
    const a = { ...data, id:`T2T-${String(Date.now()).slice(-8)}`, submittedAt:new Date().toISOString(), status:"pending", score:scoreApp(data) };
    const up = [...apps, a]; setApps(up);
    try { localStorage.setItem("t2t_apps", JSON.stringify(up)); } catch {}
    return a;
  };

  const upAppStatus = (id, status) => {
    const up = apps.map(a=>a.id===id?{...a,status}:a); setApps(up);
    try { localStorage.setItem("t2t_apps", JSON.stringify(up)); } catch {}
  };

  const addSubmission = (data) => {
    const s = { ...data, id:`PR-${String(Date.now()).slice(-8)}`, submittedAt:new Date().toISOString(), status:"pending" };
    const up = [...submissions, s]; setSubmissions(up);
    try { localStorage.setItem("t2t_press", JSON.stringify(up)); } catch {}
    return s;
  };

  const upSubStatus = (id, status) => {
    const up = submissions.map(s=>s.id===id?{...s,status}:s); setSubmissions(up);
    try { localStorage.setItem("t2t_press", JSON.stringify(up)); } catch {}
  };

  return { apps, addApp, upAppStatus, submissions, addSubmission, upSubStatus };
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
  const [pw, setPw] = useState("");
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
const Nav = ({ page, setPage, onLogoClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const navLinks = [
    {key:"landing", label:"Home"},
    {key:"newsroom", label:"Newsroom"},
    {key:"press-gate", label:"Press Portal"},
    {key:"register", label:"Apply Now", primary:true},
  ];

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, height:68, background:scrolled||menuOpen?"rgba(255,254,249,0.97)":"transparent", backdropFilter:scrolled||menuOpen?"blur(16px)":"none", borderBottom:scrolled||menuOpen?"1px solid var(--border)":"none", transition:"all 0.3s ease", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>

        {/* Logo */}
        <div onClick={()=>{onLogoClick();setMenuOpen(false);}} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:34, height:34, background:"var(--forest)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily:"Cormorant Garamond", fontWeight:700, fontSize:"1.05rem", color:"var(--forest)" }}>T2T Programme</span>
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
      </nav>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{ position:"fixed", top:68, left:0, right:0, zIndex:999, background:"rgba(255,254,249,0.98)", backdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)", padding:"16px 24px 24px", display:"flex", flexDirection:"column", gap:8 }}>
          {navLinks.map(({key,label,primary})=>(
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
const Landing = ({ setPage }) => {
  const m = useMobile();
  return (
  <div>
    {/* HERO */}
    <section style={{ minHeight: m?"auto":"100vh", background:`radial-gradient(ellipse at 70% 30%, rgba(200,230,218,0.4) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(200,230,218,0.2) 0%, transparent 45%), var(--sand2)`, display:"flex", flexDirection:"column", justifyContent:"center", padding: m?"100px 24px 48px":"140px 80px 80px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.4, backgroundImage:"radial-gradient(circle, rgba(27,61,47,0.06) 1px, transparent 1px)", backgroundSize:"36px 36px" }} />
      {!m && <>
        <div style={{ position:"absolute", right:-120, top:"10%", width:600, height:600, borderRadius:"50%", border:"1px solid rgba(27,61,47,0.08)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:-60, top:"5%", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle, rgba(200,230,218,0.35) 0%, transparent 70%)", pointerEvents:"none" }} />
      </>}

      <div className="fade-up" style={{ maxWidth: m?"100%":760, position:"relative" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--forest)", color:"white", borderRadius:100, padding:"5px 14px 5px 10px", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.04em", marginBottom:32 }}>
          <span className="live-dot" /><span>Applications Open · Deadline March 31, 2026</span>
        </div>
        <h1 style={{ fontSize: m?"2.8rem":"clamp(3rem,6vw,6rem)", fontWeight:700, lineHeight:1.05, color:"var(--forest)", marginBottom:24, letterSpacing:"-0.02em" }}>
          Training to<br /><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--sage)" }}>Transaction.</span>
        </h1>
        <p style={{ fontSize: m?"1rem":"1.15rem", color:"var(--text2)", lineHeight:1.75, maxWidth:560, marginBottom:12, fontWeight:300 }}>
          A structured programme moving African SMEs from business readiness into real commercial transactions across global markets.
        </p>
        <p style={{ fontFamily:"Cormorant Garamond", fontStyle:"italic", fontSize:"1.1rem", color:"var(--sage)", marginBottom: m?32:48 }}>Lagos and Abuja · Commencing April 13, 2026</p>
        <div style={{ display:"flex", flexDirection: m?"column":"row", gap:12 }}>
          <button onClick={()=>setPage("register")} style={{ background:"var(--forest)", color:"white", border:"none", padding:"15px 36px", borderRadius:10, fontSize:"0.95rem", fontWeight:600, cursor:"pointer", boxShadow:"0 8px 32px rgba(27,61,47,0.28)" }}>
            Apply to the Programme
          </button>
          <button onClick={()=>setPage("newsroom")} style={{ background:"transparent", border:"1.5px solid var(--forest)", color:"var(--forest)", padding:"15px 28px", borderRadius:10, fontSize:"0.95rem", fontWeight:500, cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.style.background="var(--forest)";e.currentTarget.style.color="white";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--forest)";}}
          >Press and Media</button>
        </div>
      </div>

      {/* Overview card — absolute on desktop, stacked on mobile */}
      <div style={{ position: m?"relative":"absolute", right: m?"auto":80, bottom: m?"auto":80, marginTop: m?40:0, background:"white", border:"1px solid var(--border)", borderRadius:16, padding:"28px 32px", boxShadow: m?"none":"0 20px 60px rgba(27,61,47,0.1)", width: m?"100%":"auto", minWidth: m?"unset":260 }}>
        <p style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.1em", marginBottom:16 }}>PROGRAMME OVERVIEW</p>
        {[{label:"Delivery Cities",val:"Lagos and Abuja"},{label:"Duration",val:"3 Months"},{label:"Application Deadline",val:"March 31, 2026"},{label:"Commencement",val:"April 13, 2026"},{label:"Target Markets",val:"USA · Canada · Caribbean"}].map(({label,val})=>(
          <div key={label} style={{ marginBottom:12, paddingBottom:12, borderBottom:"1px solid var(--border2)" }}>
            <p style={{ fontSize:"0.7rem", color:"var(--text3)", marginBottom:2 }}>{label}</p>
            <p style={{ fontSize:"0.9rem", fontWeight:600, color:"var(--forest)" }}>{val}</p>
          </div>
        ))}
      </div>
    </section>

    {/* PARTNERS */}
    <section style={{ background:"var(--forest)", padding: m?"40px 24px":"60px 80px" }}>
      <p style={{ fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.12em", color:"rgba(200,230,218,0.55)", marginBottom:32, textAlign:"center" }}>IN PARTNERSHIP WITH</p>
      <div style={{ display:"grid", gridTemplateColumns: m?"repeat(2,1fr)":"repeat(5, 1fr)", gap:12, maxWidth:960, margin:"0 auto" }}>
        {[{name:"Providus Bank",role:"Lead Sponsor",abbr:"PB"},{name:"ECOWAS Parliament",role:"Institutional Backer",abbr:"EP"},{name:"Global African Business Association",role:"GABA",abbr:"GABA"},{name:"Duchess Natural Limited",role:"Implementing Partner",abbr:"DNL"},{name:"Borderless Trade and Investments",role:"Implementing Partner",abbr:"BTI"}].map(({name,role,abbr})=>(
          <div key={name} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(200,230,218,0.15)", borderRadius:12, padding:"16px 12px", textAlign:"center", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
          >
            <div style={{ width:40, height:40, background:"rgba(200,230,218,0.15)", borderRadius:10, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cormorant Garamond", fontWeight:700, color:"var(--mint)", fontSize:"0.85rem" }}>{abbr}</div>
            <p style={{ fontWeight:600, color:"white", fontSize: m?"0.72rem":"0.8rem", marginBottom:3, lineHeight:1.3 }}>{name}</p>
            <p style={{ fontSize:"0.65rem", color:"rgba(200,230,218,0.55)" }}>{role}</p>
          </div>
        ))}
      </div>
    </section>

    {/* STAGES */}
    <section style={{ padding: m?"60px 24px":"100px 80px", background:"var(--cream)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns: m?"1fr":"1fr 1.4fr", gap: m?40:80, alignItems:"start" }}>
        <div>
          <span style={{ display:"inline-block", background:"var(--mint2)", color:"var(--forest)", borderRadius:6, padding:"4px 12px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:20 }}>THE PROGRAMME</span>
          <h2 style={{ fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:600, lineHeight:1.15, color:"var(--forest)", marginBottom:24 }}>From readiness<br />to real deals.</h2>
          <p style={{ color:"var(--text2)", lineHeight:1.8, marginBottom:16, fontWeight:300 }}>The T2T Programme is a structured, institutional initiative that walks market-ready African SMEs through a proven pathway into their first international transactions.</p>
          <p style={{ color:"var(--text2)", lineHeight:1.8, fontWeight:300 }}>Spanning three months, the programme covers export readiness, trade compliance, buyer linkage, and access to trade finance — all designed around real commercial outcomes.</p>
          <button onClick={()=>setPage("register")} style={{ marginTop:32, background:"var(--forest)", color:"white", border:"none", padding:"12px 28px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>Apply to the Programme</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          {[{num:"01",stage:"Stage One",title:"Business and Export Readiness",desc:"Compliance documentation, NAFDAC and product standards, KYC completion, operational assessment",dur:"Lagos: 4 days · Abuja: 2 days"},{num:"02",stage:"Stage Two",title:"Market Access and Buyer Linkage",desc:"Buyer connections, ECOWAS region and US–Canada market access, trade documentation",dur:"Lagos: 4 days · Abuja: 2 days"},{num:"03",stage:"Stage Three",title:"Transaction Execution",desc:"Trade finance solutions, FX access via Providus Bank, pilot transaction guidance, first deal closed",dur:"Lagos: 4 days · Abuja: 2 days"}].map(({num,stage,title,desc,dur})=>(
            <div key={num} style={{ background:"white", border:"1px solid var(--border2)", borderRadius:12, padding:"24px 20px", display:"grid", gridTemplateColumns:"44px 1fr", gap:16, alignItems:"start", transition:"all 0.2s" }}>
              <div style={{ width:44, height:44, background:"var(--forest)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cormorant Garamond", fontWeight:700, color:"var(--mint)", fontSize:"1rem", flexShrink:0 }}>{num}</div>
              <div>
                <p style={{ fontSize:"0.7rem", color:"var(--sage)", fontWeight:600, letterSpacing:"0.08em", marginBottom:4 }}>{stage.toUpperCase()}</p>
                <p style={{ fontFamily:"Cormorant Garamond", fontWeight:600, fontSize:"1.15rem", color:"var(--forest)", marginBottom:6 }}>{title}</p>
                <p style={{ fontSize:"0.85rem", color:"var(--text2)", lineHeight:1.6, marginBottom:10 }}>{desc}</p>
                <span style={{ background:"var(--mint2)", color:"var(--forest3)", padding:"3px 10px", borderRadius:100, fontSize:"0.72rem", fontWeight:500 }}>{dur}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ELIGIBILITY */}
    <section style={{ padding: m?"60px 24px":"80px 80px", background:"var(--sand2)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:6, padding:"4px 12px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:16, display:"inline-block" }}>WHO IT IS FOR</span>
          <h2 style={{ fontSize: m?"2rem":"2.5rem", fontWeight:600, color:"var(--forest)", marginTop:12 }}>Built for Market-Ready African SMEs</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns: m?"1fr":"repeat(3, 1fr)", gap:16 }}>
          {[{icon:"🌾",title:"Agriculture and Agro-Processing",desc:"Grains, spices, legumes, functional powders, nuts, seeds and related processed goods."},{icon:"📋",title:"Verifiable Business Operations",desc:"Registered business with stable operations, production capacity and demonstrable business stability."},{icon:"🤝",title:"Transaction Readiness",desc:"Businesses ready for structured international trade engagement and committed to programme activities."}].map(({icon,title,desc})=>(
            <div key={title} style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, padding:"28px 24px" }}>
              <div style={{ fontSize:"2rem", marginBottom:14 }}>{icon}</div>
              <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.25rem", fontWeight:600, color:"var(--forest)", marginBottom:10 }}>{title}</h3>
              <p style={{ fontSize:"0.875rem", color:"var(--text2)", lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", marginTop:28, fontFamily:"Cormorant Garamond", fontStyle:"italic", fontSize:"1rem", color:"var(--text3)" }}>Prior export experience is considered an advantage but is not mandatory.</p>
      </div>
    </section>

    {/* CTA */}
    <section style={{ background:"var(--forest)", padding: m?"60px 24px":"100px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
      {!m && <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:700, height:700, borderRadius:"50%", border:"1px solid rgba(200,230,218,0.06)", pointerEvents:"none" }} />}
      <div style={{ position:"relative" }}>
        <h2 style={{ fontSize: m?"2rem":"clamp(2.2rem,5vw,4rem)", fontWeight:600, color:"white", lineHeight:1.1, marginBottom:16 }}>
          Applications Close<br /><span style={{ color:"var(--mint)", fontStyle:"italic", fontWeight:400 }}>March 31, 2026</span>
        </h2>
        <p style={{ color:"rgba(200,230,218,0.7)", marginBottom:40, fontSize:"1.05rem", fontWeight:300 }}>Programme commences April 13 in Lagos and Abuja.</p>
        <button onClick={()=>setPage("register")} style={{ background:"white", color:"var(--forest)", border:"none", padding:"16px 44px", borderRadius:10, fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>Begin Your Application</button>
      </div>
    </section>

    {/* FOOTER */}
    <footer style={{ background:"var(--text)", padding: m?"32px 24px":"40px 80px" }}>
      <div style={{ display:"flex", flexDirection: m?"column":"row", justifyContent:"space-between", alignItems: m?"flex-start":"center", gap: m?16:20 }}>
        <div>
          <p style={{ fontFamily:"Cormorant Garamond", fontWeight:700, fontSize:"1.1rem", color:"white", marginBottom:4 }}>T2T Programme</p>
          <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.35)" }}>Training to Transaction · 2026</p>
        </div>
        {!m && <p style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.35)", maxWidth:420, textAlign:"center" }}>Implemented by Duchess NL and Borderless Trade and Investments. Sponsored by Providus Bank.</p>}
        <p style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.35)" }}>media@t2tprogramme.org</p>
      </div>
    </footer>
  </div>
  );
};
// ─── FORM PRIMITIVES ──────────────────────────────────────────────────────────
const FF = ({num,label,hint,children}) => (
  <div>
    <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:hint?4:10 }}>
      <span style={{ background:"var(--forest)", color:"var(--mint)", width:22, height:22, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, flexShrink:0, marginTop:1 }}>{num}</span>
      <label style={{ fontWeight:600, fontSize:"0.93rem", color:"var(--text)", lineHeight:1.4 }}>{label}</label>
    </div>
    {hint&&<p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:10, paddingLeft:32 }}>{hint}</p>}
    {children}
  </div>
);
const TI = ({value,onChange,placeholder}) => <input value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%", background:"white", border:"1.5px solid var(--border)", borderRadius:8, padding:"11px 14px", color:"var(--text)", fontSize:"0.9rem" }} />;
const SI = ({value,onChange,options}) => <select value={value||""} onChange={e=>onChange(e.target.value)} style={{ width:"100%", background:"white", border:"1.5px solid var(--border)", borderRadius:8, padding:"11px 14px", color:value?"var(--text)":"var(--text3)", fontSize:"0.9rem", cursor:"pointer" }}><option value="">Select an option</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
const Rad = ({value,onChange,options}) => <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{options.map(o=><label key={o} onClick={()=>onChange(o)} style={{ display:"flex", alignItems:"center", gap:12, background:value===o?"var(--mint2)":"white", border:`1.5px solid ${value===o?"var(--sage)":"var(--border)"}`, borderRadius:8, padding:"11px 16px", cursor:"pointer", transition:"all 0.15s" }}><div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${value===o?"var(--forest)":"var(--border)"}`, background:value===o?"var(--forest)":"white", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{value===o&&<div style={{ width:6, height:6, borderRadius:"50%", background:"white" }} />}</div><span style={{ fontSize:"0.875rem", color:value===o?"var(--forest)":"var(--text2)", fontWeight:value===o?500:400 }}>{o}</span><input type="radio" checked={value===o} onChange={()=>onChange(o)} style={{ display:"none" }} /></label>)}</div>;
const Chk = ({value=[],onChange,options}) => { const tog=o=>onChange(value.includes(o)?value.filter(v=>v!==o):[...value,o]); return <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{options.map(o=><label key={o} onClick={()=>tog(o)} style={{ display:"flex", alignItems:"center", gap:12, background:value.includes(o)?"var(--mint2)":"white", border:`1.5px solid ${value.includes(o)?"var(--sage)":"var(--border)"}`, borderRadius:8, padding:"11px 16px", cursor:"pointer", transition:"all 0.15s" }}><div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${value.includes(o)?"var(--forest)":"var(--border)"}`, background:value.includes(o)?"var(--forest)":"white", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", color:"white" }}>{value.includes(o)&&"✓"}</div><span style={{ fontSize:"0.875rem", color:value.includes(o)?"var(--forest)":"var(--text2)", fontWeight:value.includes(o)?500:400 }}>{o}</span></label>)}</div>; };
const TA = ({value,onChange,placeholder,rows=3}) => <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width:"100%", background:"white", border:"1.5px solid var(--border)", borderRadius:8, padding:"11px 14px", color:"var(--text)", fontSize:"0.9rem", resize:"vertical" }} />;

// ─── SME REGISTRATION ─────────────────────────────────────────────────────────
const Registration = ({ addApp }) => {
  const [phase,setPhase]=useState(1);
  const [d,setD]=useState({});
  const [done,setDone]=useState(false);
  const [ref,setRef]=useState("");
  const top=useRef(null);
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  const next=()=>{setPhase(p=>p+1);setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),80);};
  const submit=()=>{const a=addApp(d);setRef(a.id);setDone(true);setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),80);};
  const pct=phase===1?33:phase===2?66:100;

  if(done) return (
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
          {phase===1&&<Ph1 d={d} s={set} />}
          {phase===2&&<Ph2 d={d} s={set} />}
          {phase===3&&<Ph3 d={d} s={set} />}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:48, paddingTop:28, borderTop:"1px solid var(--border)" }}>
          {phase>1?<button onClick={()=>setPhase(p=>p-1)} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"11px 24px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer" }}>Back</button>:<div/>}
          {phase<3?<button onClick={next} style={{ background:"var(--forest)", border:"none", color:"white", padding:"13px 32px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>Continue</button>
          :<button onClick={submit} style={{ background:"var(--green-ok)", border:"none", color:"white", padding:"13px 36px", borderRadius:8, fontSize:"0.95rem", fontWeight:600, cursor:"pointer", boxShadow:"0 4px 16px rgba(27,122,74,0.3)" }}>Submit Application</button>}
        </div>
      </div>
    </div>
  );
};

const Ph1=({d,s})=>(<><FF num="1" label="Business Name"><TI value={d.businessName} onChange={v=>s("businessName",v)} placeholder="Your registered business name" /></FF><FF num="2" label="Business Address"><TI value={d.businessAddress} onChange={v=>s("businessAddress",v)} placeholder="Physical business address" /></FF><FF num="3" label="Business Niche"><SI value={d.businessNiche} onChange={v=>s("businessNiche",v)} options={["Grains","Spices","Legumes","Functional Powders","Nuts","Seeds","Others"]} /></FF><FF num="4" label="Business Structure"><Rad value={d.businessStructure} onChange={v=>s("businessStructure",v)} options={["Business Name","Limited Liability","Partnership","None"]} /></FF><FF num="5" label="How long has your business been operating?"><Rad value={d.businessAge} onChange={v=>s("businessAge",v)} options={["Less than 6 months","6 to 12 months","1 to 2 years","2+ years"]} /></FF><FF num="6" label="Your role in the business"><Rad value={d.role} onChange={v=>s("role",v)} options={["Founder / Owner","Co-founder","Manager","Other"]} /></FF><FF num="7" label="Have you ever sold products or services formally outside Nigeria?"><Rad value={d.exportExperience} onChange={v=>s("exportExperience",v)} options={["Yes, currently","Yes, previously","No, but interested","Not sure"]} /></FF><FF num="8" label="Which markets interest you most?" hint="Select all that apply"><Chk value={d.targetMarkets} onChange={v=>s("targetMarkets",v)} options={["ECOWAS countries","USA","Canada","Caribbean","Other African countries","Not sure yet"]} /></FF><FF num="9" label="Best contact details"><div style={{ display:"flex",flexDirection:"column",gap:10 }}><TI value={d.contactPhone} onChange={v=>s("contactPhone",v)} placeholder="Phone number" /><TI value={d.contactEmail} onChange={v=>s("contactEmail",v)} placeholder="Email address" /><SI value={d.contactTime} onChange={v=>s("contactTime",v)} options={["Morning (8am to 12pm)","Afternoon (12pm to 4pm)","Evening (4pm to 7pm)"]} /></div></FF></>);
const Ph2=({d,s})=>(<><FF num="10" label="Current monthly production capacity"><Rad value={d.productionCapacity} onChange={v=>s("productionCapacity",v)} options={["0.1kg to 100kg","101kg to 500kg","501kg to 1 metric ton","Above 1 tonne"]} /></FF><FF num="11" label="Can you scale production if orders increase by 50%?"><Rad value={d.scalability} onChange={v=>s("scalability",v)} options={["Yes, immediately","Yes, within 1 month","Yes, with investment","No","Not sure"]} /></FF><FF num="12" label="Do your products meet any quality standards?" hint="Select all that apply"><Chk value={d.qualityStandards} onChange={v=>s("qualityStandards",v)} options={["NAFDAC","SON","ISO","ECOWAS standards","None yet","Not applicable"]} /></FF><FF num="13" label="Monthly business turnover"><Rad value={d.monthlyTurnover} onChange={v=>s("monthlyTurnover",v)} options={["Below ₦50k","₦50k to ₦200k","₦200k to ₦500k","₦500k to ₦1M","₦1M to ₦5M","₦5M and above"]} /></FF><FF num="14" label="Have you ever received a business loan or grant?"><Rad value={d.loanHistory} onChange={v=>s("loanHistory",v)} options={["Yes, currently repaying","Yes, fully repaid","No, but applied","Never applied"]} /></FF><FF num="15" label="Internet access and digital capability"><Rad value={d.digitalCapability} onChange={v=>s("digitalCapability",v)} options={["Strong internet, use digital tools daily","Regular internet access","Limited access","Minimal digital skills"]} /></FF><FF num="16" label="Are you familiar with export documentation requirements?"><Rad value={d.exportDocsFamiliarity} onChange={v=>s("exportDocsFamiliarity",v)} options={["Yes, experienced","Somewhat familiar","No, but willing to learn","No knowledge"]} /></FF><FF num="17" label="Do you have or can you obtain:" hint="Select all that apply"><Chk value={d.documents} onChange={v=>s("documents",v)} options={["Tax ID","Company letterhead","Product certifications","Export license","None yet"]} /></FF><FF num="18" label="KYC Verification Consent" hint="Full KYC verification is mandatory for participation and access to this programme."><Rad value={d.kycConsent} onChange={v=>s("kycConsent",v)} options={["Yes, I will participate","No","I need further information on the KYC process"]} /></FF></>);
const Ph3=({d,s})=>(<><FF num="19" label="What products or services do you want to export?" hint="Please be as specific as possible."><TA value={d.exportProducts} onChange={v=>s("exportProducts",v)} placeholder="Describe your specific products or services..." /></FF><FF num="20" label="Do you use a shipping company?"><Rad value={d.shippingCompany} onChange={v=>s("shippingCompany",v)} options={["Yes, always","Yes, sometimes","No"]} /></FF><FF num="21" label="Estimated time needed to prepare for your first export"><Rad value={d.exportTimeline} onChange={v=>s("exportTimeline",v)} options={["Ready now","1 to 3 months","3 to 6 months","6 to 12 months","Over 1 year"]} /></FF><FF num="22" label="Biggest challenge in accessing international markets" hint="Select your top 2 challenges"><Chk value={d.challenges} onChange={v=>s("challenges",v)} options={["Finding buyers","Understanding regulations","Pricing","Shipping and logistics","Payment collection","Product certification","Other"]} /></FF><FF num="23" label="What support do you need most from this programme?" hint="Select your top 3 priorities"><Chk value={d.supportNeeded} onChange={v=>s("supportNeeded",v)} options={["Buyer connections","Training","Compliance guidance","Financing","Shipping support","Marketing","Other"]} /></FF><FF num="24" label="Estimated working capital available"><Rad value={d.workingCapital} onChange={v=>s("workingCapital",v)} options={["Below ₦100k","₦100k to ₦500k","₦500k to ₦2M","₦2M and above"]} /></FF><FF num="25" label="Pilot transaction requirement" hint="As a standard requirement, initial engagement will commence with small pilot transactions prior to full-scale deals."><Rad value={d.pilotAgreement} onChange={v=>s("pilotAgreement",v)} options={["Yes, please provide further details on the pilot transaction requirements","No, I will not proceed under this condition"]} /></FF><FF num="26" label="Is there anything else we should know about your business?" hint="Optional"><TA value={d.additionalInfo} onChange={v=>s("additionalInfo",v)} placeholder="Any other relevant information..." rows={4} /></FF></>);

// ─── JOURNALIST PORTAL ────────────────────────────────────────────────────────
const PressPortal = ({ addSubmission, onExit }) => {
  const [d, setD] = useState({});
  const [done, setDone] = useState(false);
  const [refId, setRefId] = useState("");
  const set = (k,v) => setD(p=>({...p,[k]:v}));

  const submit = () => {
    if (!d.name || !d.outlet || !d.email || !d.storyType || !d.headline || !d.content) return;
    const s = addSubmission(d);
    setRefId(s.id);
    setDone(true);
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
          For urgent enquiries contact: <strong>media@t2tprogramme.org</strong>
        </p>
        <button onClick={onExit} style={{ background:"var(--forest)", color:"white", border:"none", padding:"12px 28px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>Back to Newsroom</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", padding:"100px 24px 80px" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>

        {/* Header */}
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

        {/* Form */}
        <div style={{ display:"flex", flexDirection:"column", gap:28 }}>

          {/* Journalist Info */}
          <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:14, padding:"32px 28px" }}>
            <p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--forest)", letterSpacing:"0.1em", marginBottom:24, paddingBottom:12, borderBottom:"1px solid var(--border2)" }}>YOUR DETAILS</p>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div className="press-form-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Full Name</label>
                  <TI value={d.name} onChange={v=>set("name",v)} placeholder="Your full name" />
                </div>
                <div>
                  <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Media Outlet</label>
                  <TI value={d.outlet} onChange={v=>set("outlet",v)} placeholder="Publication or outlet name" />
                </div>
              </div>
              <div className="press-form-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Email Address</label>
                  <TI value={d.email} onChange={v=>set("email",v)} placeholder="Your work email" />
                </div>
                <div>
                  <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Phone Number</label>
                  <TI value={d.phone} onChange={v=>set("phone",v)} placeholder="Contact number" />
                </div>
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Country</label>
                <SI value={d.country} onChange={v=>set("country",v)} options={["Nigeria","Ghana","Senegal","Côte d'Ivoire","Kenya","South Africa","United Kingdom","United States","Canada","Other"]} />
              </div>
            </div>
          </div>

          {/* Story Details */}
          <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:14, padding:"32px 28px" }}>
            <p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--forest)", letterSpacing:"0.1em", marginBottom:24, paddingBottom:12, borderBottom:"1px solid var(--border2)" }}>SUBMISSION DETAILS</p>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Submission Type</label>
                <Rad value={d.storyType} onChange={v=>set("storyType",v)} options={["Press Release","News Story","Feature Article","Opinion / Commentary","Interview Request","Event Coverage"]} />
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Headline / Title</label>
                <TI value={d.headline} onChange={v=>set("headline",v)} placeholder="Proposed headline for your submission" />
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Summary</label>
                <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:8 }}>A brief 1 to 2 sentence summary of your story or pitch.</p>
                <TA value={d.summary} onChange={v=>set("summary",v)} placeholder="Briefly describe your story..." rows={2} />
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Full Content</label>
                <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:8 }}>Paste your full press release, article, or story pitch below.</p>
                <TA value={d.content} onChange={v=>set("content",v)} placeholder="Full content of your submission..." rows={10} />
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Image URL (Optional)</label>
                <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:8 }}>Link to a high-resolution image to accompany the story (must be publicly accessible).</p>
                <TI value={d.imageUrl} onChange={v=>set("imageUrl",v)} placeholder="https://..." />
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Category</label>
                <SI value={d.category} onChange={v=>set("category",v)} options={["PRESS RELEASE","NEWS STORY","PARTNER SPOTLIGHT","PROGRAMME UPDATE","OPINION","MEDIA RESOURCE","EVENT COVERAGE"]} />
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Any additional notes for the editorial team? (Optional)</label>
                <TA value={d.notes} onChange={v=>set("notes",v)} placeholder="Embargo dates, corrections, context, special requests..." rows={3} />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:12, padding:"20px 24px" }}>
            <Chk value={d.declaration||[]} onChange={v=>set("declaration",v)} options={["I confirm this content is accurate and original","I authorise the T2T Programme to publish and edit this submission","I understand this does not guarantee publication"]} />
          </div>

        </div>

        {/* Submit */}
        <div style={{ marginTop:40, paddingTop:28, borderTop:"1px solid var(--border)", display:"flex", justifyContent:"flex-end", gap:12 }}>
          <button onClick={onExit} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"11px 24px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer" }}>Cancel</button>
          <button onClick={submit} style={{ background:"var(--forest)", border:"none", color:"white", padding:"13px 36px", borderRadius:8, fontSize:"0.95rem", fontWeight:600, cursor:"pointer", boxShadow:"0 4px 16px rgba(27,61,47,0.25)" }}>
            Submit for Review
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

  // Merge static + approved journalist submissions
  const approvedAsArticles = approvedSubmissions.map(s => ({
    id: s.id, cat: s.category || "PRESS RELEASE",
    date: new Date(s.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),
    headline: s.headline, summary: s.summary || s.content?.substring(0,180)+"...",
    img: s.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80",
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
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }}>
            {[{name:"Media Enquiries",email:"media@t2tprogramme.org",org:"T2T Programme Office"},{name:"Providus Bank Comms",email:"comms@providusbank.com",org:"Providus Bank"},{name:"Programme Updates",email:"updates@duchessnl.com",org:"Duchess NL and BTI"}].map(c=>(
              <div key={c.email}><p style={{ fontWeight:600, fontSize:"0.875rem", marginBottom:3 }}>{c.name}</p><p style={{ color:"var(--forest)", fontSize:"0.83rem", marginBottom:2 }}>{c.email}</p><p style={{ color:"var(--text3)", fontSize:"0.78rem" }}>{c.org}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", padding:m?"80px 20px 60px":"100px 80px 80px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto 60px", display:"flex", flexDirection:m?"column":"row", justifyContent:"space-between", alignItems:m?"flex-start":"flex-end", paddingBottom:32, borderBottom:"1px solid var(--border)", gap:20 }}>
        <div>
          <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:6, padding:"4px 12px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:12, display:"inline-block" }}>DIGITAL NEWSROOM</span>
          <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"3.2rem", fontWeight:600, color:"var(--forest)", lineHeight:1 }}>Press and Media</h1>
          <p style={{ color:"var(--text3)", marginTop:8 }}>Official communications for media professionals, journalists, and stakeholders.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"flex-end" }}>
          <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:12, padding:"16px 20px" }}>
            <p style={{ fontSize:"0.7rem", color:"var(--text3)", fontWeight:700, letterSpacing:"0.08em", marginBottom:4 }}>PRESS CONTACT</p>
            <p style={{ color:"var(--forest)", fontWeight:600, fontSize:"0.875rem" }}>media@t2tprogramme.org</p>
          </div>
          <button onClick={()=>setPage("press-gate")} style={{ background:"var(--forest)", color:"white", border:"none", padding:"10px 20px", borderRadius:8, fontSize:"0.82rem", fontWeight:600, cursor:"pointer", letterSpacing:"0.02em" }}>
            Submit a Story
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto" }}>
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
              {[{name:"Media Enquiries",email:"media@t2tprogramme.org",org:"T2T Programme Office"},{name:"Providus Bank Comms",email:"comms@providusbank.com",org:"Providus Bank"},{name:"Programme Updates",email:"updates@duchessnl.com",org:"Duchess NL and BTI"}].map(c=>(
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
  const [tab, setTab] = useState("sme");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("score");
  const [exp, setExp] = useState(null);
  const [pressFilter, setPressFilter] = useState("all");
  const [pressExp, setPressExp] = useState(null);

  const list = apps.filter(a=>filter==="all"||a.status===filter).sort((a,b)=>sort==="score"?b.score-a.score:new Date(b.submittedAt)-new Date(a.submittedAt));
  const pressList = submissions.filter(s=>pressFilter==="all"||s.status===pressFilter).sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));

  const counts = { total:apps.length, pending:apps.filter(a=>a.status==="pending").length, approved:apps.filter(a=>a.status==="approved").length, rejected:apps.filter(a=>a.status==="rejected").length, avg:apps.length?Math.round(apps.reduce((s,a)=>s+a.score,0)/apps.length):0 };
  const pCounts = { total:submissions.length, pending:submissions.filter(s=>s.status==="pending").length, approved:submissions.filter(s=>s.status==="approved").length, rejected:submissions.filter(s=>s.status==="rejected").length };

  const ScorePill=({v})=>{const c=v>=70?"#1B7A4A":v>=50?"#B8943F":"#C0392B";const bg=v>=70?"#E8F5EF":v>=50?"#FDF5E0":"#FDECEA";return <span style={{ background:bg,color:c,padding:"3px 10px",borderRadius:100,fontSize:"0.75rem",fontWeight:600,border:`1px solid ${c}30` }}>{v} · {v>=70?"High":v>=50?"Medium":"Low"}</span>;};
  const StPill=({st})=>{const m={pending:{bg:"#FEF9E7",c:"#B8943F"},approved:{bg:"#E8F5EF",c:"#1B7A4A"},rejected:{bg:"#FDECEA",c:"#C0392B"}};const {bg,c}=m[st]||m.pending;return <span style={{ background:bg,color:c,padding:"3px 10px",borderRadius:100,fontSize:"0.75rem",fontWeight:600,textTransform:"capitalize" }}>{st}</span>;};

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", padding:"40px 48px 80px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>

        {/* Admin Header */}
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

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:28, borderBottom:"1px solid var(--border)", paddingBottom:0 }}>
          {[
            {key:"sme", label:`SME Applications`, badge:pCounts.pending===0?null:null},
            {key:"press", label:`Press Submissions`, badge:pCounts.pending},
          ].map(({key,label,badge})=>(
            <button key={key} onClick={()=>setTab(key)} style={{ background:"transparent", border:"none", borderBottom:`2.5px solid ${tab===key?"var(--forest)":"transparent"}`, color:tab===key?"var(--forest)":"var(--text3)", padding:"10px 20px 12px", fontSize:"0.9rem", fontWeight:tab===key?600:400, cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"all 0.15s" }}>
              {label}
              {badge>0 && <span style={{ background:"var(--red)", color:"white", borderRadius:100, padding:"1px 8px", fontSize:"0.7rem", fontWeight:700 }}>{badge}</span>}
            </button>
          ))}
        </div>

        {/* ── SME TAB ── */}
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
                        <div><p style={{ fontWeight:600, fontSize:"0.9rem", color:"var(--forest)" }}>{a.businessName||"Not provided"}</p><p style={{ color:"var(--text3)", fontSize:"0.72rem", marginTop:2 }}>{a.id}</p></div>
                        <div><p style={{ fontSize:"0.85rem" }}>{a.businessNiche||"Not specified"}</p><p style={{ color:"var(--text3)", fontSize:"0.72rem" }}>{a.businessAddress?a.businessAddress.split(",")[0]:"Not provided"}</p></div>
                        <p style={{ fontSize:"0.85rem", color:"var(--text2)" }}>{a.monthlyTurnover||"Not stated"}</p>
                        <ScorePill v={a.score} />
                        <StPill st={a.status} />
                        <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>upAppStatus(a.id,"approved")} style={{ background:"#E8F5EF", border:"1px solid #1B7A4A40", color:"#1B7A4A", padding:"6px 12px", borderRadius:6, fontSize:"0.78rem", cursor:"pointer", fontWeight:600 }}>✓</button>
                          <button onClick={()=>upAppStatus(a.id,"rejected")} style={{ background:"#FDECEA", border:"1px solid #C0392B40", color:"#C0392B", padding:"6px 12px", borderRadius:6, fontSize:"0.78rem", cursor:"pointer", fontWeight:600 }}>✕</button>
                        </div>
                      </div>
                      {exp===a.id && (
                        <div className="fade-up" style={{ padding:"28px 24px 32px", background:"var(--mint2)", borderBottom:"1px solid var(--border)", display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20 }}>
                          {[["Business Name",a.businessName],["Address",a.businessAddress],["Niche",a.businessNiche],["Structure",a.businessStructure],["Operating Since",a.businessAge],["Role",a.role],["Export Experience",a.exportExperience],["Target Markets",(a.targetMarkets||[]).join(", ")],["Contact Email",a.contactEmail],["Phone",a.contactPhone],["Production Capacity",a.productionCapacity],["Monthly Turnover",a.monthlyTurnover],["Working Capital",a.workingCapital],["Export Familiarity",a.exportDocsFamiliarity],["Quality Standards",(a.qualityStandards||[]).join(", ")],["KYC Consent",a.kycConsent],["Export Products",a.exportProducts],["Export Timeline",a.exportTimeline],["Challenges",(a.challenges||[]).join(", ")],["Support Needed",(a.supportNeeded||[]).join(", ")],["Submitted",new Date(a.submittedAt).toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"})]].filter(([,v])=>v&&v!=="").map(([label,value])=>(
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

        {/* ── PRESS TAB ── */}
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
                          <p style={{ color:"var(--text3)", fontSize:"0.72rem", marginTop:2 }}>{s.id} · {new Date(s.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p>
                        </div>
                        <div>
                          <p style={{ fontSize:"0.85rem", fontWeight:500 }}>{s.name||"Unknown"}</p>
                          <p style={{ color:"var(--text3)", fontSize:"0.75rem" }}>{s.outlet||"No outlet"}</p>
                        </div>
                        <span style={{ background:"var(--mint2)", color:"var(--forest3)", padding:"3px 8px", borderRadius:4, fontSize:"0.68rem", fontWeight:600 }}>{s.storyType||"Submission"}</span>
                        <StPill st={s.status} />
                        <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>upSubStatus(s.id,"approved")} title="Publish" style={{ background:"#E8F5EF", border:"1px solid #1B7A4A40", color:"#1B7A4A", padding:"6px 10px", borderRadius:6, fontSize:"0.75rem", cursor:"pointer", fontWeight:700 }}>Publish</button>
                          <button onClick={()=>upSubStatus(s.id,"rejected")} title="Decline" style={{ background:"#FDECEA", border:"1px solid #C0392B40", color:"#C0392B", padding:"6px 10px", borderRadius:6, fontSize:"0.75rem", cursor:"pointer", fontWeight:700 }}>Decline</button>
                        </div>
                      </div>
                      {pressExp===s.id && (
                        <div className="fade-up" style={{ padding:"28px 32px", background:"var(--mint2)", borderBottom:"1px solid var(--border)" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:24 }}>
                            {[["Journalist",s.name],["Outlet",s.outlet],["Email",s.email],["Phone",s.phone],["Country",s.country],["Category",s.category],["Story Type",s.storyType],["Submitted",new Date(s.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})]].filter(([,v])=>v).map(([l,v])=>(
                              <div key={l}><p style={{ fontSize:"0.65rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:3 }}>{l.toUpperCase()}</p><p style={{ fontSize:"0.85rem", color:"var(--text)" }}>{v}</p></div>
                            ))}
                          </div>
                          {s.summary && <div style={{ marginBottom:16 }}><p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:6 }}>SUMMARY</p><p style={{ fontSize:"0.875rem", color:"var(--text)", lineHeight:1.7 }}>{s.summary}</p></div>}
                          {s.content && <div style={{ marginBottom:16 }}><p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:6 }}>FULL CONTENT</p><div style={{ background:"white", border:"1px solid var(--border)", borderRadius:8, padding:"16px 20px", maxHeight:300, overflowY:"auto" }}><p style={{ fontSize:"0.875rem", color:"var(--text)", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{s.content}</p></div></div>}
                          {s.imageUrl && <div style={{ marginBottom:16 }}><p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:6 }}>IMAGE URL</p><p style={{ fontSize:"0.85rem", color:"var(--forest)" }}>{s.imageUrl}</p></div>}
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
  const [page, setPage] = useState("landing");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pressUnlocked, setPressUnlocked] = useState(false);
  const { apps, addApp, upAppStatus, submissions, addSubmission, upSubStatus } = useDataStore();

  const logoClicks = useRef(0);
  const logoTimer = useRef(null);

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

  return (
    <>
      <GlobalStyles />
      {showNav && <Nav page={page} setPage={setPage} onLogoClick={handleLogoClick} />}

      {page==="landing" && <Landing setPage={setPage} />}
      {page==="register" && <Registration addApp={addApp} />}
      {page==="newsroom" && <Newsroom setPage={setPage} approvedSubmissions={approvedSubmissions} />}

      {/* Press portal gate */}
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

      {/* Admin gate */}
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