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
      --forest:#1B3D2F; --forest2:#234D3B; --forest3:#2E6249;
      --sage:#4A7C63; --sage-light:#6B9E84;
      --mint:#C8E6DA; --mint2:#E8F5EF;
      --sand:#F5EFE0; --sand2:#FDF9F3; --cream:#FFFEF9;
      --text:#1A2820; --text2:#3D5449; --text3:#6B7F76;
      --border:#D8E8E0; --border2:#EAF2EC;
      --white:#FFFFFF; --red:#C0392B; --green-ok:#1B7A4A;
      --amber:#B8943F; --amber-bg:#FDF5E0;
      --max-w:1440px;
    }
    .wrap { max-width:var(--max-w); margin:0 auto; width:100%; }
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
    .field-error { border-color:var(--red) !important; background:#FEF0EF !important; }
    @keyframes shake { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-6px);} 40%,80%{transform:translateX(6px);} }
    .shake { animation:shake 0.4s ease; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .card-hover { transition:transform 0.25s ease,box-shadow 0.25s ease; }
    .card-hover:hover { transform:translateY(-4px);box-shadow:0 20px 60px rgba(27,61,47,0.12); }
    input,select,textarea { font-family:'Outfit',sans-serif; }
    input:focus,select:focus,textarea:focus { outline:none;border-color:var(--forest) !important;box-shadow:0 0 0 3px rgba(27,61,47,0.08); }
    button { font-family:'Outfit',sans-serif; }
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

// Passwords removed from frontend — verified server-side in Edge Function
// To update: supabase secrets set ADMIN_PASSWORD=... PRESS_PASSWORD=...
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


// Edge Function client — all privileged ops verified server-side
const adminFn = async (action, password, payload = {}) => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON,
      "Authorization": `Bearer ${SUPABASE_ANON}`,
    },
    body: JSON.stringify({ action, password, payload }),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  return res.json();
};
const EMAILJS_SERVICE  = "service_h050sxm";
const EMAILJS_PUBKEY   = "_8-ZOysExnIB07wdD";
const EMAILJS_T_CONFIRM = "template_o9zjxfb";
const EMAILJS_T_STATUS  = "template_zk4tkrr";

const sendEmail = async (templateId, params) => {
  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE,
        template_id: templateId,
        user_id:     EMAILJS_PUBKEY,
        template_params: params,
      }),
    });
  } catch (err) {
    console.warn("EmailJS error:", err);
  }
};

const useDataStore = () => {
  const [apps, setApps]               = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [dbError, setDbError]         = useState(null);
  const [adminPwd, setAdminPwd]       = useState(null);

  // Called once admin password is verified — loads dashboard data via Edge Function
  const loadAdminData = async (password) => {
    setLoading(true);
    try {
      const [a, s, ass] = await Promise.all([
        adminFn("get_applications", password),
        adminFn("get_submissions",  password),
        adminFn("get_assessments",  password),
      ]);
      setApps(Array.isArray(a) ? a : []);
      setSubmissions(Array.isArray(s) ? s : []);
      setAssessments(Array.isArray(ass) ? ass : []);
      setAdminPwd(password);
    } catch (e) {
      console.error("Admin load error:", e);
      setDbError("Could not load admin data. Check your password or network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false); // Public view loads nothing — data fetched on admin login
  }, []);

  const addApp = async (data) => {
    const id    = `T2T-${String(Date.now()).slice(-8)}`;
    const score = scoreApp(data);
    const row   = {
      id, score, status: "pending",
      submitted_at:           new Date().toISOString(),
      business_name:          data.businessName,
      business_address:       data.businessAddress,
      business_niche:         data.businessNiche,
      business_structure:     data.businessStructure,
      business_age:           data.businessAge,
      role:                   data.role,
      export_experience:      data.exportExperience,
      target_markets:         data.targetMarkets,
      contact_phone:          data.contactPhone,
      contact_email:          data.contactEmail,
      contact_time:           data.contactTime,
      production_capacity:    data.productionCapacity,
      scalability:            data.scalability,
      quality_standards:      data.qualityStandards,
      monthly_turnover:       data.monthlyTurnover,
      loan_history:           data.loanHistory,
      digital_capability:     data.digitalCapability,
      export_docs_familiarity:data.exportDocsFamiliarity,
      documents:              data.documents,
      kyc_consent:            data.kycConsent,
      export_products:        data.exportProducts,
      shipping_company:       data.shippingCompany,
      export_timeline:        data.exportTimeline,
      challenges:             data.challenges,
      support_needed:         data.supportNeeded,
      working_capital:        data.workingCapital,
      pilot_agreement:        data.pilotAgreement,
      additional_info:        data.additionalInfo,
      tc_consent:             data.tcConsent || false,
      product_photos:         data.productPhotos || [],
      product_certs:          data.productCerts  || [],
      title:                  data.title,
      first_name:             data.firstName,
      last_name:              data.lastName,
      gender:                 data.gender,
      date_of_birth:          data.dateOfBirth,
      nationality:            data.nationality,
      state_of_residence:     data.stateOfResidence,
      staff_count:            data.staffCount,
      initial_capital:        data.initialCapital,
      capital_source:         data.capitalSource,
      total_investment:       data.totalInvestment,
      last_year_turnover:     data.lastYearTurnover,
      annual_profit:          data.annualProfit,
      nature_of_business:     data.natureOfBusiness,
      innovation:             data.innovation,
      programme_benefit:      data.programmeBenefit,
      product_differentiator: data.productDifferentiator,
      top_competitors:        data.topCompetitors,
      revenue_model:          data.revenueModel,
      training_location:      data.trainingLocation,
      providus_account:       data.providusAccount,
    };

    try {
      await sb("applications", { method:"POST", body:JSON.stringify(row), prefer:"return=minimal" });
      setApps(prev => [{ ...row, submittedAt:row.submitted_at, businessName:data.businessName, contactEmail:data.contactEmail }, ...prev]);
      if (data.contactEmail) {
        const fullName = [data.title, data.firstName, data.lastName].filter(Boolean).join(" ") || data.businessName || "Applicant";
        await sendEmail(EMAILJS_T_CONFIRM, {
          to_email:       data.contactEmail,
          to_name:        fullName,
          applicant_name: fullName,
          reference_id:   id,
        });
      }
    } catch (e) {
      console.error("Supabase insert error:", e);
    }
    return { id, score };
  };

  const upAppStatus = async (id, status) => {
    try {
      await adminFn("update_app_status", adminPwd, { id, status });
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      // Only send email on approval — rejected applicants receive nothing
      if (status === "approved") {
        const app   = apps.find(a => a.id === id);
        const email = app?.contact_email || app?.contactEmail;
        const name  = [app?.title, app?.first_name||app?.firstName, app?.last_name||app?.lastName].filter(Boolean).join(" ") || app?.business_name || app?.businessName || "Applicant";
        if (email) {
          const assessmentLink = `https://t2tprogramme.com?assessment=${id}`;
          await sendEmail(EMAILJS_T_STATUS, {
            to_email:        email,
            to_name:         name,
            applicant_name:  name,
            reference_id:    id,
            assessment_link: assessmentLink,
          });
        }
      }
    } catch (e) {
      console.error("Supabase status update error:", e);
    }
  };

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
      await sb("press_submissions", { method:"POST", body:JSON.stringify(row), prefer:"return=minimal" });
      setSubmissions(prev => [{ ...row, submittedAt:row.submitted_at, storyType:data.storyType, imageUrl:data.imageUrl }, ...prev]);
    } catch (e) {
      console.error("Supabase press insert error:", e);
    }
    return { id };
  };

  const upSubStatus = async (id, status) => {
    try {
      await adminFn("update_sub_status", adminPwd, { id, status });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch (e) {
      console.error("Supabase press status error:", e);
    }
  };

  return { apps, addApp, upAppStatus, submissions, addSubmission, upSubStatus, assessments, loading, dbError, loadAdminData };
};

const validatePhase = (phase, d) => {
  const missing = [];
  if (phase === 1) {
    if (!d.title) missing.push("title");
    if (!d.firstName?.trim()) missing.push("firstName");
    if (!d.lastName?.trim()) missing.push("lastName");
    if (!d.gender) missing.push("gender");
    if (!d.dateOfBirth?.trim()) missing.push("dateOfBirth");
    if (!d.nationality?.trim()) missing.push("nationality");
    if (!d.stateOfResidence?.trim()) missing.push("stateOfResidence");
    if (!d.staffCount) missing.push("staffCount");
    if (!d.initialCapital?.trim()) missing.push("initialCapital");
    if (!d.capitalSource?.trim()) missing.push("capitalSource");
    if (!d.totalInvestment?.trim()) missing.push("totalInvestment");
    if (!d.lastYearTurnover?.trim()) missing.push("lastYearTurnover");
    if (!d.annualProfit?.trim()) missing.push("annualProfit");
    if (!d.natureOfBusiness?.trim()) missing.push("natureOfBusiness");
    if (!d.innovation?.trim()) missing.push("innovation");
    if (!d.programmeBenefit?.trim()) missing.push("programmeBenefit");
    if (!d.productDifferentiator?.trim()) missing.push("productDifferentiator");
    if (!d.topCompetitors?.trim()) missing.push("topCompetitors");
    if (!d.revenueModel?.trim()) missing.push("revenueModel");
    if (!d.trainingLocation) missing.push("trainingLocation");
    if (!d.providusAccount) missing.push("providusAccount");
  }
  if (phase === 2) {
    if (!d.businessName?.trim()) missing.push("businessName");
    if (!d.businessAddress?.trim()) missing.push("businessAddress");
    if (!d.businessNiche) missing.push("businessNiche");
    if (!d.businessStructure) missing.push("businessStructure");
    if (!d.businessAge) missing.push("businessAge");
    if (!d.role) missing.push("role");
    if (!d.exportExperience) missing.push("exportExperience");
    if (!d.productPhotos?.length) missing.push("productPhotos");
    if (!d.targetMarkets?.length) missing.push("targetMarkets");
    if (!d.contactPhone?.trim()) missing.push("contactPhone");
    if (!d.contactEmail?.trim()) missing.push("contactEmail");
    if (!d.contactTime) missing.push("contactTime");
  }
  if (phase === 3) {
    if (!d.productionCapacity) missing.push("productionCapacity");
    if (!d.qualityStandards?.length) missing.push("qualityStandards");
    const certsRequired = d.qualityStandards?.some(s => !["None yet","Not applicable"].includes(s));
    if (certsRequired && !d.productCerts?.length) missing.push("productCerts");
    if (!d.scalability) missing.push("scalability");
    if (!d.monthlyTurnover) missing.push("monthlyTurnover");
    if (!d.loanHistory) missing.push("loanHistory");
    if (!d.digitalCapability) missing.push("digitalCapability");
    if (!d.exportDocsFamiliarity) missing.push("exportDocsFamiliarity");
    if (!d.documents?.length) missing.push("documents");
    if (!d.kycConsent) missing.push("kycConsent");
  }
  if (phase === 4) {
    if (!d.exportProducts?.trim()) missing.push("exportProducts");
    if (!d.shippingCompany) missing.push("shippingCompany");
    if (!d.exportTimeline) missing.push("exportTimeline");
    if (!d.challenges?.length) missing.push("challenges");
    if (!d.supportNeeded?.length) missing.push("supportNeeded");
    if (!d.workingCapital) missing.push("workingCapital");
    if (!d.pilotAgreement) missing.push("pilotAgreement");
    if (!d.tcConsent) missing.push("tcConsent");
  }
  // tcConsent only validated on final phase (4)
  return missing;
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

const staticNews = [
  { id:"s1", cat:"PRESS RELEASE", date:"March 6, 2026", featured:true,
    headline:"ECOWAS Parliament Kicks Off Year-Long Commemorative Programme with the Private Sector",
    summary:"The year-long programme to celebrate 25 years of ECOWAS Parliament has launched in Abuja with authorised partners Duchess NL and Borderless Trade & Investment — the same implementing partners behind the T2T Programme.",
    img:"https://insidebusiness.ng/wp-content/uploads/OVL08358-scaled.jpg",
    source:"Green Savannah Diplomatic Cable",
    externalUrl:"https://greensavannahdiplomaticcable.com/2026/03/ecowas-parliament-kicks-off-year-long-commemorative-programme-with-the-private-sector/" },
  { id:"s2", cat:"MEDIA COVERAGE", date:"March 5, 2026", featured:false,
    headline:"ECOWAS Parliament Seeks Stronger Regional Trade Participation",
    summary:"The ECOWAS Parliament called for stronger participation in regional trade across West Africa, with its Director of Parliamentary Affairs urging that trade and innovation must translate into improved welfare for citizens across the subregion.",
    img:"https://cdn.punchng.com/wp-content/uploads/2025/05/22153016/The-ECOWAS-Parliament-during-the-sitting-in-Abuja-NAN.jpeg",
    source:"Punch",
    externalUrl:"https://punchng.com/ecowas-parliament-seeks-stronger-regional-trade-participation/" },
  { id:"s3", cat:"MEDIA COVERAGE", date:"March 6, 2026", featured:false,
    headline:"ECOWAS Parliament Pushes Stronger Public Engagement, Private Sector Role",
    summary:"The ECOWAS Parliament called for deeper public engagement, stronger youth participation and greater private sector involvement as part of year-long initiatives to commemorate its 25th anniversary.",
    img:"https://blogger.googleusercontent.com/img/a/AVvXsEhHsd8VqjJR6bd2HfBND-nYRBiU-r8kih6yWxyCub31uUm2xNv3IfapaLGYLh80vSDrFJjR6dw6-zOMmvsC4zyfPcqq-PpbXuqWVp4SSuPpprRUGbW3MRK4QxYP-FYqkb5U9WlmF829572YfMlyKr4jqcdk0wRTrsLxtIYX7zqKxCbHze_ZqcEunsgRP3Nl",
    source:"CityBlog News",
    externalUrl:"https://www.cityblognews.com/2026/03/ecowas-parliament-pushes-stronger.html" },
  { id:"s4", cat:"PARTNER SPOTLIGHT", date:"March 5, 2026", featured:false,
    headline:"ECOWAS Parliament, Private Sector Unite to Grow Regional Trade",
    summary:"Victoria Akai (CEO, Duchess Naturals), Kabeer Garba (ECOWAS Parliament), and Olori Boye-Ajayi (Borderless Trade & Investments) came together at a press conference to announce private sector-led initiatives driving regional trade across West Africa.",
    img:"https://insidebusiness.ng/wp-content/uploads/OVL08358-scaled.jpg",
    source:"InsideBusiness",
    externalUrl:"https://insidebusiness.ng/239001/ecowas-parliament-private-sector-unite-to-grow-regional-trade/" },
];


// ─── TERMS & CONDITIONS MODAL ─────────────────────────────────────────────────
const TCModal = ({ onClose }) => (
  <div style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:16, maxWidth:640, width:"100%", maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
      <div style={{ padding:"28px 32px 20px", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.1em", marginBottom:6 }}>T2T PROGRAMME</p>
            <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.6rem", fontWeight:600, color:"var(--forest)", lineHeight:1.1 }}>Terms, Conditions and Data Consent</h2>
          </div>
          <button onClick={onClose} style={{ background:"var(--sand2)", border:"1px solid var(--border)", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:"1rem", color:"var(--text3)", flexShrink:0, marginLeft:16 }}>✕</button>
        </div>
      </div>
      <div style={{ overflowY:"auto", padding:"24px 32px 32px", fontSize:"0.875rem", color:"var(--text2)", lineHeight:1.8 }}>

        <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:24 }}>Last updated: March 2026 · Training-to-Transaction (T2T) Programme</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8, marginTop:0 }}>1. About This Programme</h3>
        <p style={{ marginBottom:20 }}>The Training-to-Transaction (T2T) Programme is a sponsored initiative designed to support African Small and Medium Enterprises (SMEs) in transitioning from business readiness to executing real commercial transactions. The programme is sponsored by Providus Bank as part of the celebration of the ECOWAS Parliament at 25, in collaboration with the Global African Business Association (GABA). It is implemented by Duchess Naturals Limited (DNL) and Borderless Trade & Investments (BTI). The programme aims to equip participating SMEs with the tools, market access, and strategic support needed to secure trade opportunities, close deals, and scale their businesses within regional and international markets. By submitting this application, you confirm that you have read, understood, and agreed to the terms and conditions of the programme.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>2. Eligibility</h3>
        <p style={{ marginBottom:20 }}>The programme is open to registered African SMEs with verifiable operational capacity, business stability, and a readiness for structured trade engagement. Prior export experience is an advantage but is not mandatory. Submission of an application does not guarantee selection in this cohort. All applications will undergo a screening and evaluation process conducted by the implementing partners, Duchess Naturals Limited (DNL) and Borderless Trade & Investments (BTI), in collaboration with Providus Bank. This process is designed to assess each applicant's business readiness, operational capacity, and growth potential in order to determine the most appropriate support stage within the programme. Participation in the programme will be based on the outcome of this evaluation.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>3. Data Collection and Use</h3>
        <p style={{ marginBottom:12 }}>The information you provide in this application will be used solely for the following purposes:</p>
        <ul style={{ paddingLeft:20, marginBottom:20 }}>
          <li style={{ marginBottom:8 }}>Screening and evaluating your suitability for the programme</li>
          <li style={{ marginBottom:8 }}>Contacting you regarding your application status</li>
          <li style={{ marginBottom:8 }}>Onboarding and administering your participation if selected</li>
          <li style={{ marginBottom:8 }}>Compliance and KYC verification as required by Providus Bank</li>
          <li style={{ marginBottom:8 }}>Measuring and reporting programme outcomes and key performance indicators</li>
        </ul>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>4. Third-Party Data Sharing</h3>
        <p style={{ marginBottom:12 }}>By agreeing to these terms, you consent to your application information being shared with the following programme partners for the purposes described above:</p>
        <ul style={{ paddingLeft:20, marginBottom:12 }}>
          <li style={{ marginBottom:6 }}><strong>Providus Bank</strong> — Lead sponsor; trade finance, KYC verification and account services</li>
          <li style={{ marginBottom:6 }}><strong>ECOWAS Parliament</strong> — Institutional backer; regional trade policy and market access support</li>
          <li style={{ marginBottom:6 }}><strong>Global African Business Association (GABA)</strong> — Buyer linkage and international market connections</li>
          <li style={{ marginBottom:6 }}><strong>Duchess Natural Limited (DNL)</strong> — Programme implementation and SME coordination</li>
          <li style={{ marginBottom:6 }}><strong>Borderless Trade & Investments (BTI)</strong> — Programme implementation and trade facilitation</li>
        </ul>
        <p style={{ marginBottom:20 }}>Your data will not be sold, rented, or shared with any organisation outside this programme without your explicit consent. All partners are bound by confidentiality obligations consistent with applicable data protection laws.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>5. KYC Verification</h3>
        <p style={{ marginBottom:20 }}>Full KYC (Know Your Customer) verification is mandatory for all participants accepted into the programme. This is a regulatory requirement under Providus Bank's compliance framework. Failure to complete KYC verification will result in disqualification from the programme regardless of application score.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>6. Pilot Transaction Requirement</h3>
        <p style={{ marginBottom:20 }}>As a standard programme requirement, initial commercial engagement will commence with small pilot transactions prior to full-scale deals. This is designed to validate readiness and build a verifiable transaction record. Applicants who do not agree to this condition will not be eligible for the transaction execution stage of the programme.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>7. Programme Commitment</h3>
        <p style={{ marginBottom:20 }}>Selected participants are expected to commit fully to all programme activities including attendance at training sessions, submission of required compliance documents, and active participation in market access engagements. The programme runs for three months across Lagos and Abuja. Participants who fail to meet attendance and commitment requirements may be removed from the programme.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>8. Accuracy of Information</h3>
        <p style={{ marginBottom:20 }}>By submitting this application you confirm that all information provided is accurate, complete, and truthful. Submission of false or misleading information will result in immediate disqualification and may be reported to relevant authorities where required by law.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>9. No Guarantee of Selection</h3>
        <p style={{ marginBottom:20 }}>Submission of a completed application does not guarantee selection into the programme. All applications will be assessed against the programme's eligibility and scoring criteria. The implementing partners and Providus Bank reserve the right to accept or decline any application at their discretion.</p>

        <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.1rem", fontWeight:600, color:"var(--forest)", marginBottom:8 }}>10. Contact</h3>
        <p style={{ marginBottom:0 }}>For questions regarding these terms or your application, contact the T2T Programme team at <strong>applications@t2tprogramme.com</strong>.</p>

      </div>
    </div>
  </div>
);

const PasswordGate = ({ title, subtitle, action, buttonLabel, onUnlock }) => {
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState(false);
  const [show, setShow]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const attempt = async () => {
    if (!pw.trim()) return;
    setBusy(true);
    try {
      await adminFn(action, pw);
      onUnlock(pw);
      setErr(false);
    } catch (e) {
      setErr(true);
      setPw("");
    } finally {
      setBusy(false);
    }
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
        <button onClick={attempt} disabled={busy} style={{ width:"100%", background:"var(--forest)", color:"white", border:"none", padding:"13px", borderRadius:10, fontSize:"0.95rem", fontWeight:600, cursor:busy?"not-allowed":"pointer", marginTop:err?0:8, boxShadow:"0 4px 16px rgba(27,61,47,0.25)", opacity:busy?0.7:1 }}>
          {busy ? "Verifying…" : buttonLabel}
        </button>
      </div>
    </div>
  );
};

const T2T_LOGO = "/logo.png";

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
  const bg = scrolled || menuOpen ? "rgba(255,254,249,0.97)" : "rgba(255,254,249,0)";
  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, height:72, background:bg, backdropFilter:scrolled||menuOpen?"blur(20px)":"none", borderBottom:scrolled||menuOpen?"1px solid var(--border)":"none", transition:"all 0.3s ease" }}>
        <div className="wrap" style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px" }}>
          <div onClick={()=>{onLogoClick();setMenuOpen(false);}} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
            {T2T_LOGO
              ? <img src={T2T_LOGO} alt="T2T Programme" style={{ height:40, width:"auto", objectFit:"contain" }} />
              : (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
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
              )
            }
          </div>
          {!isMobile && (
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              {[{key:"landing",label:"Home"},{key:"newsroom",label:"Newsroom"}].map(({key,label})=>(
                <button key={key} onClick={()=>setPage(key)} style={{ background:page===key?"var(--mint2)":"transparent", border:"none", color:page===key?"var(--forest)":"var(--text3)", padding:"7px 18px", borderRadius:6, fontSize:"0.875rem", fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}>{label}</button>
              ))}
              <div style={{ width:1, height:20, background:"var(--border)", margin:"0 8px" }} />
              <button onClick={()=>setPage("register")} style={{ background:"var(--forest)", border:"none", color:"white", padding:"9px 22px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer", letterSpacing:"0.02em", boxShadow:"0 4px 16px rgba(27,61,47,0.25)" }}>Apply Now</button>
            </div>
          )}
          {isMobile && (
            <button onClick={()=>setMenuOpen(o=>!o)} style={{ background:"transparent", border:"1.5px solid var(--border)", borderRadius:8, padding:"8px 10px", cursor:"pointer", display:"flex", flexDirection:"column", gap:5, alignItems:"center", justifyContent:"center" }}>
              <span style={{ display:"block", width:20, height:2, background:"var(--forest)", borderRadius:2, transition:"all 0.25s", transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none" }} />
              <span style={{ display:"block", width:20, height:2, background:"var(--forest)", borderRadius:2, transition:"all 0.25s", opacity:menuOpen?0:1 }} />
              <span style={{ display:"block", width:20, height:2, background:"var(--forest)", borderRadius:2, transition:"all 0.25s", transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none" }} />
            </button>
          )}
        </div>
      </nav>
      {isMobile && menuOpen && (
        <div style={{ position:"fixed", top:72, left:0, right:0, zIndex:999, background:"rgba(255,254,249,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", padding:"16px 24px 24px", display:"flex", flexDirection:"column", gap:8 }}>
          {[{key:"landing",label:"Home"},{key:"newsroom",label:"Newsroom"},{key:"register",label:"Apply Now",primary:true}].map(({key,label,primary})=>(
            <button key={key} onClick={()=>{setPage(key);setMenuOpen(false);}} style={{ background:primary?"var(--forest)":page===key?"var(--mint2)":"transparent", border:primary?"none":"1.5px solid var(--border)", color:primary?"white":page===key?"var(--forest)":"var(--text2)", padding:"13px 20px", borderRadius:8, fontSize:"0.95rem", fontWeight:primary?600:500, cursor:"pointer", textAlign:"left", width:"100%" }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const PARTNER_LOGOS = {
  providus:   "/logos/providus.png",
  ecowas:     "/logos/ecowas.png",
  gaba:       "/logos/gaba.png",
  duchess:    "/logos/duchess.png",
  borderless: "/logos/borderless.png",
};

const Landing = ({ setPage }) => {
  const m = useMobile();
  const partners = [
    { key:"providus",   name:"Providus Bank",                        role:"Lead Sponsor",         abbr:"PB"   },
    { key:"ecowas",     name:"ECOWAS Parliament",                    role:"Institutional Backer", abbr:"EP"   },
    { key:"gaba",       name:"Global African Business Assoc.",       role:"GABA",                 abbr:"GABA" },
    { key:"duchess",    name:"Duchess Natural Limited",              role:"Implementing Partner", abbr:"DNL"  },
    { key:"borderless", name:"Borderless Trade & Investments",       role:"Implementing Partner", abbr:"BTI"  },
  ];
  return (
  <div style={{ overflowX:"hidden" }}>
    {/* ── HERO ── */}
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", overflow:"hidden", background:"linear-gradient(135deg, var(--forest) 0%, #234D3B 60%, #2E6249 100%)" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.15, backgroundImage:"radial-gradient(circle, rgba(200,230,218,0.4) 1px, transparent 1px)", backgroundSize:"32px 32px" }} />

      <div className="wrap" style={{ position:"relative", zIndex:2, padding: m?"100px 24px 60px":"130px 80px 100px", width:"100%" }}>

        {/* Desktop: side-by-side layout */}
        {!m && (
          <div style={{ display:"flex", flexDirection:"row", alignItems:"center", gap:60 }}>
            {/* Left content */}
            <div className="fade-up" style={{ flex:1 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(200,230,218,0.15)", border:"1px solid rgba(200,230,218,0.3)", color:"var(--mint)", borderRadius:100, padding:"6px 16px 6px 12px", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.04em", marginBottom:28 }}>
                <span className="live-dot" /><span>Applications Open · Deadline April 13, 2026</span>
              </div>
              <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(3.5rem,6vw,6.5rem)", fontWeight:600, lineHeight:1.0, color:"white", marginBottom:20, letterSpacing:"-0.01em" }}>
                Training<br />to <span style={{ fontStyle:"italic", fontWeight:300, color:"var(--mint)" }}>Transaction.</span>
              </h1>
              <p style={{ fontSize:"1.15rem", color:"rgba(255,255,255,0.75)", lineHeight:1.8, maxWidth:520, marginBottom:16, fontWeight:300 }}>
                A structured programme moving African SMEs from business readiness into real commercial transactions across global markets.
              </p>
              <p style={{ fontFamily:"Cormorant Garamond", fontStyle:"italic", fontSize:"1.05rem", color:"var(--mint)", marginBottom:44, opacity:0.85 }}>
                Lagos and Abuja · Commencing April 20, 2026
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
            {/* Right overview card — desktop only */}
            <div style={{ width:280, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(20px)", border:"1px solid rgba(200,230,218,0.2)", borderRadius:20, padding:"32px 28px", flexShrink:0 }}>
              <p style={{ fontSize:"0.65rem", fontWeight:700, color:"rgba(200,230,218,0.6)", letterSpacing:"0.12em", marginBottom:20 }}>PROGRAMME OVERVIEW</p>
              {[{label:"Delivery Cities",val:"Lagos and Abuja"},{label:"Duration",val:"3 Months"},{label:"Application Deadline",val:"April 13, 2026"},{label:"Commencement",val:"April 20, 2026"},{label:"Target Markets",val:"USA · Canada · Caribbean · Africa"}].map(({label,val},i,arr)=>(
                <div key={label} style={{ marginBottom: i<arr.length-1?16:0, paddingBottom: i<arr.length-1?16:0, borderBottom: i<arr.length-1?"1px solid rgba(200,230,218,0.12)":"none" }}>
                  <p style={{ fontSize:"0.68rem", color:"rgba(200,230,218,0.5)", marginBottom:3 }}>{label}</p>
                  <p style={{ fontSize:"0.9rem", fontWeight:600, color:"white" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: stacked layout — card sits INSIDE the content column, after buttons */}
        {m && (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(200,230,218,0.15)", border:"1px solid rgba(200,230,218,0.3)", color:"var(--mint)", borderRadius:100, padding:"6px 16px 6px 12px", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.04em", marginBottom:28, alignSelf:"flex-start" }}>
              <span className="live-dot" /><span>Applications Open · Deadline April 13, 2026</span>
            </div>
            <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"3rem", fontWeight:600, lineHeight:1.0, color:"white", marginBottom:20, letterSpacing:"-0.01em" }}>
              Training<br />to <span style={{ fontStyle:"italic", fontWeight:300, color:"var(--mint)" }}>Transaction.</span>
            </h1>
            <p style={{ fontSize:"1rem", color:"rgba(255,255,255,0.75)", lineHeight:1.8, marginBottom:16, fontWeight:300 }}>
              A structured programme moving African SMEs from business readiness into real commercial transactions across global markets.
            </p>
            <p style={{ fontFamily:"Cormorant Garamond", fontStyle:"italic", fontSize:"1.05rem", color:"var(--mint)", marginBottom:32, opacity:0.85 }}>
              Lagos and Abuja · Commencing April 20, 2026
            </p>
            {/* Buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
              <button onClick={()=>setPage("register")} style={{ background:"white", color:"var(--forest)", border:"none", padding:"15px 36px", borderRadius:10, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", transition:"all 0.2s" }}>Apply to the Programme</button>
              <button onClick={()=>setPage("newsroom")} style={{ background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.4)", color:"white", padding:"15px 28px", borderRadius:10, fontSize:"0.95rem", fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}>Press and Media</button>
            </div>
            {/* Overview card — mobile, full width, INSIDE the column */}
            <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(20px)", border:"1px solid rgba(200,230,218,0.2)", borderRadius:16, padding:"24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[{label:"Cities",val:"Lagos & Abuja"},{label:"Duration",val:"3 Months"},{label:"Deadline",val:"April 13, 2026"},{label:"Starts",val:"April 20, 2026"}].map(({label,val})=>(
                  <div key={label}>
                    <p style={{ fontSize:"0.65rem", color:"rgba(200,230,218,0.5)", marginBottom:3 }}>{label}</p>
                    <p style={{ fontSize:"0.875rem", fontWeight:600, color:"white" }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>

    <section style={{ background:"white", padding: m?"40px 24px":"56px 0", borderBottom:"1px solid var(--border)" }}>
      <div className="wrap" style={{ padding: m?"0":"0 80px" }}>
        <p style={{ fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.14em", color:"var(--text3)", marginBottom:36, textAlign:"center" }}>IN PARTNERSHIP WITH</p>
        <div style={{ display:"grid", gridTemplateColumns: m?"repeat(2,1fr)":"repeat(5,1fr)", gap: m?24:40, alignItems:"center", maxWidth:1000, margin:"0 auto" }}>
          {partners.map(({key,name,role,abbr})=>(
            <div key={key} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div style={{ width:"100%", maxWidth:140, height:72, background:"var(--sand2)", border:"1.5px dashed var(--border)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                {PARTNER_LOGOS[key]
                  ? <img src={PARTNER_LOGOS[key]} alt={name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }} />
                  : <div style={{ textAlign:"center", padding:8 }}>
                      <p style={{ fontFamily:"Cormorant Garamond", fontWeight:700, fontSize:"1rem", color:"var(--forest)" }}>{abbr}</p>
                      <p style={{ fontSize:"0.55rem", color:"var(--text3)", marginTop:2 }}>ADD LOGO</p>
                    </div>
                }
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontWeight:600, fontSize: m?"0.72rem":"0.78rem", color:"var(--text)", lineHeight:1.3, marginBottom:2 }}>{name}</p>
                <p style={{ fontSize:"0.65rem", color:"var(--text3)" }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ padding: m?"60px 24px":"100px 0", background:"var(--cream)" }}>
      <div className="wrap" style={{ padding: m?"0":"0 80px", maxWidth:1200, margin:"0 auto" }}>
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

    <section style={{ padding: m?"60px 24px":"100px 0", background:"var(--forest)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.08, backgroundImage:"radial-gradient(circle, rgba(200,230,218,0.5) 1px, transparent 1px)", backgroundSize:"28px 28px" }} />
      <div className="wrap" style={{ position:"relative", zIndex:1, padding: m?"0":"0 80px" }}>
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

    <section style={{ padding: m?"60px 24px":"100px 0", background:"var(--sand2)" }}>
      <div className="wrap" style={{ padding: m?"0":"0 80px" }}>
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

    <section style={{ position:"relative", overflow:"hidden", background:"linear-gradient(135deg, var(--forest) 0%, #1a3d2e 100%)" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.1, backgroundImage:"radial-gradient(circle, rgba(200,230,218,0.5) 1px, transparent 1px)", backgroundSize:"28px 28px" }} />
      <div className="wrap" style={{ position:"relative", zIndex:1, padding: m?"60px 24px":"100px 80px", textAlign:"center" }}>
        <h2 style={{ fontFamily:"Cormorant Garamond", fontSize: m?"2.2rem":"clamp(2.5rem,5vw,4.5rem)", fontWeight:600, color:"white", lineHeight:1.05, marginBottom:16 }}>
          Applications Close<br /><span style={{ color:"var(--mint)", fontStyle:"italic", fontWeight:300 }}>April 13, 2026</span>
        </h2>
        <p style={{ color:"rgba(200,230,218,0.7)", marginBottom:44, fontSize: m?"1rem":"1.1rem", fontWeight:300 }}>Programme commences April 20 in Lagos and Abuja.</p>
        <button onClick={()=>setPage("register")} style={{ background:"white", color:"var(--forest)", border:"none", padding:"16px 48px", borderRadius:10, fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--mint)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="white";}}
        >Begin Your Application</button>
      </div>
    </section>

    <footer style={{ background:"var(--text)", padding: m?"32px 24px":"48px 0" }}>
      <div className="wrap" style={{ padding: m?"0":"0 80px" }}>
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
          <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.3)" }}>Implemented by Duchess NL and Borderless Trade and Investments. Sponsored by Providus Bank.</p>
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
      <span style={{ background:hasError?"var(--red)":"var(--forest)", color:"var(--mint)", width:22, height:22, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, flexShrink:0, marginTop:1 }}>{num}</span>
      <label style={{ fontWeight:600, fontSize:"0.93rem", color:hasError?"var(--red)":"var(--text)", lineHeight:1.4 }}>{label}</label>
    </div>
    {hint&&<p style={{ fontSize:"0.78rem", color:hasError?"var(--red)":"var(--text3)", marginBottom:10, paddingLeft:32 }}>{hint}</p>}
    {children}
  </div>
);
const TI = ({value,onChange,placeholder,hasError}) => <input value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%", background:hasError?"#FEF0EF":"white", border:`1.5px solid ${hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 14px", color:"var(--text)", fontSize:"0.9rem" }} />;
const SI = ({value,onChange,options,hasError}) => <select value={value||""} onChange={e=>onChange(e.target.value)} style={{ width:"100%", background:hasError?"#FEF0EF":"white", border:`1.5px solid ${hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 14px", color:value?"var(--text)":"var(--text3)", fontSize:"0.9rem", cursor:"pointer" }}><option value="">Select an option</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
const Rad = ({value,onChange,options,hasError}) => <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{options.map(o=><label key={o} onClick={()=>onChange(o)} style={{ display:"flex", alignItems:"center", gap:12, background:value===o?"var(--mint2)":hasError?"#FEF0EF":"white", border:`1.5px solid ${value===o?"var(--sage)":hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 16px", cursor:"pointer", transition:"all 0.15s" }}><div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${value===o?"var(--forest)":hasError?"var(--red)":"var(--border)"}`, background:value===o?"var(--forest)":"white", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{value===o&&<div style={{ width:6, height:6, borderRadius:"50%", background:"white" }} />}</div><span style={{ fontSize:"0.875rem", color:value===o?"var(--forest)":"var(--text2)", fontWeight:value===o?500:400 }}>{o}</span><input type="radio" checked={value===o} onChange={()=>onChange(o)} style={{ display:"none" }} /></label>)}</div>;
const Chk = ({value=[],onChange,options,hasError}) => { const tog=o=>onChange(value.includes(o)?value.filter(v=>v!==o):[...value,o]); return <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{options.map(o=><label key={o} onClick={()=>tog(o)} style={{ display:"flex", alignItems:"center", gap:12, background:value.includes(o)?"var(--mint2)":hasError?"#FEF0EF":"white", border:`1.5px solid ${value.includes(o)?"var(--sage)":hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 16px", cursor:"pointer", transition:"all 0.15s" }}><div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${value.includes(o)?"var(--forest)":hasError?"var(--red)":"var(--border)"}`, background:value.includes(o)?"var(--forest)":"white", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", color:"white" }}>{value.includes(o)&&"✓"}</div><span style={{ fontSize:"0.875rem", color:value.includes(o)?"var(--forest)":"var(--text2)", fontWeight:value.includes(o)?500:400 }}>{o}</span></label>)}</div>; };
const TA = ({value,onChange,placeholder,rows=3,hasError}) => <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width:"100%", background:hasError?"#FEF0EF":"white", border:`1.5px solid ${hasError?"var(--red)":"var(--border)"}`, borderRadius:8, padding:"11px 14px", color:"var(--text)", fontSize:"0.9rem", resize:"vertical" }} />;

// ─── PRODUCT PHOTO UPLOAD ─────────────────────────────────────────────────────
const ProductPhotoUpload = ({ value = [], onChange, hasError }) => {
  const [uploading, setUploading] = useState([]);
  const [dragOver, setDragOver]   = useState(false);
  const inputRef = useRef(null);
  const MAX_FILES = 2;
  const MAX_BYTES = 2 * 1024 * 1024;

  const uploadFile = async (file) => {
    if (file.size > MAX_BYTES) { alert(`"${file.name}" exceeds the 2 MB limit.`); return null; }
    if (!["image/jpeg","image/png","image/webp"].includes(file.type)) { alert(`"${file.name}" is not supported. Please use JPG, PNG or WEBP.`); return null; }
    const ext = file.name.split(".").pop();
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${filename}`, {
      method:"POST",
      headers:{ "apikey":SUPABASE_ANON, "Authorization":`Bearer ${SUPABASE_ANON}`, "Content-Type":file.type, "x-upsert":"true" },
      body: file,
    });
    if (!res.ok) { console.error("Storage upload error:", await res.text()); alert("Upload failed. Please try again."); return null; }
    return `${SUPABASE_URL}/storage/v1/object/public/product-images/${filename}`;
  };

  const handleFiles = async (files) => {
    const remaining = MAX_FILES - (value||[]).length;
    if (remaining <= 0) return;
    const toProcess = Array.from(files).slice(0, remaining);
    setUploading(toProcess.map(()=>Math.random().toString(36).slice(2)));
    const urls = await Promise.all(toProcess.map(uploadFile));
    onChange([...(value||[]), ...urls.filter(Boolean)]);
    setUploading([]);
  };

  const remove = (url) => onChange((value||[]).filter(u=>u!==url));
  const borderColor = hasError?"var(--red)":dragOver?"var(--forest)":"var(--border)";
  const bgColor     = hasError?"#FEF0EF":dragOver?"var(--mint2)":"white";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {(value||[]).length < MAX_FILES && (
        <div onClick={()=>inputRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);}}
          style={{ border:`2px dashed ${borderColor}`, background:bgColor, borderRadius:10, padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"all 0.2s" }}
        >
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display:"none" }} onChange={e=>handleFiles(e.target.files)} />
          {uploading.length > 0
            ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                <div style={{ width:28, height:28, border:"3px solid var(--border)", borderTop:"3px solid var(--forest)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                <p style={{ fontSize:"0.82rem", color:"var(--text3)" }}>Uploading {uploading.length} photo{uploading.length>1?"s":""}…</p>
              </div>
            : <>
                <p style={{ fontWeight:600, fontSize:"0.875rem", color:hasError?"var(--red)":"var(--text)", marginBottom:4 }}>
                  {(value||[]).length===0?"Click or drag to upload product photos":"Add one more photo"}
                </p>
                <p style={{ fontSize:"0.75rem", color:"var(--text3)" }}>{MAX_FILES-(value||[]).length} remaining · JPG, PNG or WEBP · max 2 MB each</p>
              </>
          }
        </div>
      )}
      {(value||[]).length > 0 && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {(value||[]).map((url,i)=>(
            <div key={url} style={{ position:"relative", width:120, height:120, borderRadius:10, overflow:"hidden", border:"1.5px solid var(--border)", flexShrink:0 }}>
              <img src={url} alt={`Product ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <button onClick={()=>remove(url)} style={{ position:"absolute", top:6, right:6, width:24, height:24, borderRadius:"50%", background:"rgba(0,0,0,0.6)", border:"none", color:"white", fontSize:"0.75rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,0.45)", padding:"4px 8px" }}>
                <p style={{ fontSize:"0.62rem", color:"white", fontWeight:500 }}>Product {i+1}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PRODUCT CERT UPLOAD ──────────────────────────────────────────────────────
const ProductCertUpload = ({ value = [], onChange, hasError }) => {
  const [uploading, setUploading] = useState([]);
  const [dragOver, setDragOver]   = useState(false);
  const inputRef = useRef(null);
  const MAX_FILES = 5;
  const MAX_BYTES = 3 * 1024 * 1024;

  const uploadFile = async (file) => {
    if (file.size > MAX_BYTES) { alert(`"${file.name}" exceeds the 3 MB limit.`); return null; }
    if (!["image/jpeg","image/png","image/webp","application/pdf"].includes(file.type)) { alert(`"${file.name}" is not supported. Please use JPG, PNG, WEBP or PDF.`); return null; }
    const ext = file.name.split(".").pop();
    const filename = `certs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${filename}`, {
      method:"POST",
      headers:{ "apikey":SUPABASE_ANON, "Authorization":`Bearer ${SUPABASE_ANON}`, "Content-Type":file.type, "x-upsert":"true" },
      body: file,
    });
    if (!res.ok) { console.error("Cert upload error:", await res.text()); alert("Upload failed. Please try again."); return null; }
    return { url:`${SUPABASE_URL}/storage/v1/object/public/product-images/${filename}`, name:file.name, type:file.type };
  };

  const handleFiles = async (files) => {
    const remaining = MAX_FILES - (value||[]).length;
    if (remaining <= 0) return;
    const toProcess = Array.from(files).slice(0, remaining);
    setUploading(toProcess.map(()=>Math.random().toString(36).slice(2)));
    const results = await Promise.all(toProcess.map(uploadFile));
    onChange([...(value||[]), ...results.filter(Boolean)]);
    setUploading([]);
  };

  const remove = (url) => onChange((value||[]).filter(f=>f.url!==url));
  const isPdf  = (f)  => f.type==="application/pdf" || f.name?.endsWith(".pdf");
  const borderColor = hasError?"var(--red)":dragOver?"var(--forest)":"var(--border)";
  const bgColor     = hasError?"#FEF0EF":dragOver?"var(--mint2)":"white";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {(value||[]).length < MAX_FILES && (
        <div onClick={()=>inputRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);}}
          style={{ border:`2px dashed ${borderColor}`, background:bgColor, borderRadius:10, padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"all 0.2s" }}
        >
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple style={{ display:"none" }} onChange={e=>handleFiles(e.target.files)} />
          {uploading.length > 0
            ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                <div style={{ width:28, height:28, border:"3px solid var(--border)", borderTop:"3px solid var(--forest)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                <p style={{ fontSize:"0.82rem", color:"var(--text3)" }}>Uploading {uploading.length} file{uploading.length>1?"s":""}…</p>
              </div>
            : <>
                <p style={{ fontWeight:600, fontSize:"0.875rem", color:hasError?"var(--red)":"var(--text)", marginBottom:4 }}>Click or drag to upload certificates</p>
                <p style={{ fontSize:"0.75rem", color:"var(--text3)" }}>{MAX_FILES-(value||[]).length} remaining · JPG, PNG, WEBP or PDF · max 3 MB each</p>
              </>
          }
        </div>
      )}
      {(value||[]).length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(value||[]).map((f,i)=>(
            <div key={f.url} style={{ display:"flex", alignItems:"center", gap:12, background:"var(--sand2)", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 14px" }}>
              <div style={{ width:36, height:36, borderRadius:6, overflow:"hidden", flexShrink:0, background:"var(--mint2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {isPdf(f)
                  ? <span style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--forest)", letterSpacing:"0.04em" }}>PDF</span>
                  : <img src={f.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                }
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:"0.82rem", fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</p>
                <p style={{ fontSize:"0.7rem", color:"var(--text3)" }}>Certificate {i+1}</p>
              </div>
              <a href={f.url} target="_blank" rel="noreferrer" style={{ fontSize:"0.72rem", color:"var(--forest)", fontWeight:600, textDecoration:"none", flexShrink:0 }}>View</a>
              <button onClick={()=>remove(f.url)} style={{ background:"none", border:"none", color:"var(--text3)", cursor:"pointer", fontSize:"0.85rem", flexShrink:0, padding:"0 4px" }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EA = ({id, children}) => <div className={id?"field-error-anchor":""} id={`field-${id}`}>{children}</div>;

const Ph1=({d,s,errors})=>(<>
  <EA id="businessName"><FF num="22" label="Business Name" hasError={errors.includes("businessName")}><TI value={d.businessName} onChange={v=>s("businessName",v)} placeholder="Your registered business name" hasError={errors.includes("businessName")} /></FF></EA>
  <EA id="businessAddress"><FF num="23" label="Business Address" hasError={errors.includes("businessAddress")}><TI value={d.businessAddress} onChange={v=>s("businessAddress",v)} placeholder="Physical business address" hasError={errors.includes("businessAddress")} /></FF></EA>
  <EA id="businessNiche"><FF num="24" label="Business Niche" hasError={errors.includes("businessNiche")}><SI value={d.businessNiche} onChange={v=>s("businessNiche",v)} options={["Grains","Spices","Legumes","Functional Powders","Nuts","Seeds","Others"]} hasError={errors.includes("businessNiche")} /></FF></EA>
  <EA id="businessStructure"><FF num="25" label="Business Structure" hasError={errors.includes("businessStructure")}><Rad value={d.businessStructure} onChange={v=>s("businessStructure",v)} options={["Business Name","Limited Liability","Partnership","None"]} hasError={errors.includes("businessStructure")} /></FF></EA>
  <EA id="businessAge"><FF num="26" label="How long has your business been operating?" hasError={errors.includes("businessAge")}><Rad value={d.businessAge} onChange={v=>s("businessAge",v)} options={["Less than 6 months","6 to 12 months","1 to 2 years","2+ years"]} hasError={errors.includes("businessAge")} /></FF></EA>
  <EA id="role"><FF num="27" label="Your role in the business" hasError={errors.includes("role")}><Rad value={d.role} onChange={v=>s("role",v)} options={["Founder / Owner","Co-founder","Manager","Other"]} hasError={errors.includes("role")} /></FF></EA>
  <EA id="exportExperience"><FF num="28" label="Have you ever sold products or services formally outside Nigeria?" hasError={errors.includes("exportExperience")}><Rad value={d.exportExperience} onChange={v=>s("exportExperience",v)} options={["Yes, currently","Yes, previously","No, but interested","Not sure"]} hasError={errors.includes("exportExperience")} /></FF></EA>
  <EA id="productPhotos"><FF num="29" label="Upload a picture of your export-ready product(s)" hint="Upload up to 2 product photos (JPG, PNG or WEBP · max 2 MB each)" hasError={errors.includes("productPhotos")}>
    <ProductPhotoUpload value={d.productPhotos} onChange={v=>s("productPhotos",v)} hasError={errors.includes("productPhotos")} />
  </FF></EA>
  <EA id="targetMarkets"><FF num="30" label="Which markets interest you most?" hint="Select all that apply" hasError={errors.includes("targetMarkets")}><Chk value={d.targetMarkets} onChange={v=>s("targetMarkets",v)} options={["ECOWAS countries","USA","Canada","Caribbean","Africa","Other African countries","Not sure yet"]} hasError={errors.includes("targetMarkets")} /></FF></EA>
  <EA id="contactPhone"><FF num="31" label="Best contact details" hasError={errors.includes("contactPhone")||errors.includes("contactEmail")||errors.includes("contactTime")}>
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <TI value={d.contactPhone} onChange={v=>s("contactPhone",v)} placeholder="Phone number" hasError={errors.includes("contactPhone")} />
      <TI value={d.contactEmail} onChange={v=>s("contactEmail",v)} placeholder="Email address" hasError={errors.includes("contactEmail")} />
      <SI value={d.contactTime} onChange={v=>s("contactTime",v)} options={["Morning (8am to 12pm)","Afternoon (12pm to 4pm)","Evening (4pm to 7pm)"]} hasError={errors.includes("contactTime")} />
    </div>
  </FF></EA>
</>);

const Ph2=({d,s,errors})=>(<>
  <EA id="productionCapacity"><FF num="32" label="Current monthly production capacity" hasError={errors.includes("productionCapacity")}><Rad value={d.productionCapacity} onChange={v=>s("productionCapacity",v)} options={["0.1kg to 100kg","101kg to 500kg","501kg to 1 metric ton","Above 1 tonne"]} hasError={errors.includes("productionCapacity")} /></FF></EA>
  <EA id="qualityStandards">
    <FF num="33a" label="Do your products meet any quality standards?" hint="Select all that apply" hasError={errors.includes("qualityStandards")}>
      <Chk value={d.qualityStandards} onChange={v=>s("qualityStandards",v)} options={["NAFDAC","SON","ISO","ECOWAS standards","FDA","HACCP","None yet","Not applicable"]} hasError={errors.includes("qualityStandards")} />
    </FF>
    <div style={{ marginTop:20 }}>
      {(() => {
        const certsRequired = d.qualityStandards?.some(s => !["None yet","Not applicable"].includes(s));
        return (
          <FF num="33b" label="Kindly upload product certificates" hint={certsRequired ? "Required — please upload at least one certificate · JPG, PNG, WEBP or PDF · max 3 MB each" : "Optional — upload certificates if available · JPG, PNG, WEBP or PDF · max 3 MB each"} hasError={errors.includes("productCerts")}>
            <ProductCertUpload value={d.productCerts} onChange={v=>s("productCerts",v)} hasError={errors.includes("productCerts")} />
          </FF>
        );
      })()}
    </div>
  </EA>
  <EA id="scalability"><FF num="34" label="Can you scale production if orders increase by 50%?" hasError={errors.includes("scalability")}><Rad value={d.scalability} onChange={v=>s("scalability",v)} options={["Yes, immediately","Yes, within 1 month","Yes, with investment","No","Not sure"]} hasError={errors.includes("scalability")} /></FF></EA>
  <EA id="monthlyTurnover"><FF num="35" label="Monthly business turnover" hasError={errors.includes("monthlyTurnover")}><Rad value={d.monthlyTurnover} onChange={v=>s("monthlyTurnover",v)} options={["Below ₦50k","₦50k to ₦200k","₦200k to ₦500k","₦500k to ₦1M","₦1M to ₦5M","₦5M and above"]} hasError={errors.includes("monthlyTurnover")} /></FF></EA>
  <EA id="loanHistory"><FF num="36" label="Have you ever received a business loan or grant?" hasError={errors.includes("loanHistory")}><Rad value={d.loanHistory} onChange={v=>s("loanHistory",v)} options={["Yes, currently repaying","Yes, fully repaid","No, but applied","Never applied"]} hasError={errors.includes("loanHistory")} /></FF></EA>
  <EA id="digitalCapability"><FF num="37" label="Internet access and digital capability" hasError={errors.includes("digitalCapability")}><Rad value={d.digitalCapability} onChange={v=>s("digitalCapability",v)} options={["Strong internet, use digital tools daily","Regular internet access","Limited access","Minimal digital skills"]} hasError={errors.includes("digitalCapability")} /></FF></EA>
  <EA id="exportDocsFamiliarity"><FF num="38" label="Are you familiar with export documentation requirements?" hasError={errors.includes("exportDocsFamiliarity")}><Rad value={d.exportDocsFamiliarity} onChange={v=>s("exportDocsFamiliarity",v)} options={["Yes, experienced","Somewhat familiar","No, but willing to learn","No knowledge"]} hasError={errors.includes("exportDocsFamiliarity")} /></FF></EA>
  <EA id="documents"><FF num="39" label="Do you have or can you obtain:" hint="Select all that apply" hasError={errors.includes("documents")}><Chk value={d.documents} onChange={v=>s("documents",v)} options={["Tax ID","Company letterhead","Product certifications","Export license","None yet"]} hasError={errors.includes("documents")} /></FF></EA>
  <EA id="kycConsent"><FF num="40" label="KYC Verification Consent" hint="Full KYC verification is mandatory for participation and access to this programme." hasError={errors.includes("kycConsent")}><Rad value={d.kycConsent} onChange={v=>s("kycConsent",v)} options={["Yes, I will participate","No","I need further information on the KYC process"]} hasError={errors.includes("kycConsent")} /></FF></EA>
</>);

const TCConsentCheck = ({ value, onChange, hasError }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && <TCModal onClose={()=>setShowModal(false)} />}
      <label onClick={()=>onChange(!value)} style={{ display:"flex", alignItems:"flex-start", gap:14, cursor:"pointer" }}>
        <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${value?"var(--forest)":hasError?"var(--red)":"var(--border)"}`, background:value?"var(--forest)":"white", flexShrink:0, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", color:"white", transition:"all 0.15s" }}>
          {value && "✓"}
        </div>
        <p style={{ fontSize:"0.875rem", color:hasError?"var(--red)":"var(--text2)", lineHeight:1.7 }}>
          I have read and agree to the{" "}
          <span onClick={e=>{e.stopPropagation();setShowModal(true);}} style={{ color:"var(--forest)", fontWeight:600, textDecoration:"underline", cursor:"pointer" }}>
            Terms, Conditions and Data Consent
          </span>
          {" "}of the T2T Programme, including the sharing of my application data with programme partners for the purpose of screening, onboarding and programme delivery.
        </p>
      </label>
      {hasError && <p style={{ fontSize:"0.78rem", color:"var(--red)", marginTop:10, paddingLeft:34 }}>You must agree to the terms and conditions before submitting your application.</p>}
    </>
  );
};

const Ph3=({d,s,errors})=>(<>
  <EA id="exportProducts"><FF num="41" label="What products or services do you want to export?" hint="Please be as specific as possible." hasError={errors.includes("exportProducts")}><TA value={d.exportProducts} onChange={v=>s("exportProducts",v)} placeholder="Describe your specific products or services..." hasError={errors.includes("exportProducts")} /></FF></EA>
  <EA id="shippingCompany"><FF num="42" label="Do you use a shipping company?" hasError={errors.includes("shippingCompany")}><Rad value={d.shippingCompany} onChange={v=>s("shippingCompany",v)} options={["Yes, always","Yes, sometimes","No"]} hasError={errors.includes("shippingCompany")} /></FF></EA>
  <EA id="exportTimeline"><FF num="43" label="Estimated time needed to prepare for your first export" hasError={errors.includes("exportTimeline")}><Rad value={d.exportTimeline} onChange={v=>s("exportTimeline",v)} options={["Ready now","1 to 3 months","3 to 6 months","6 to 12 months","Over 1 year"]} hasError={errors.includes("exportTimeline")} /></FF></EA>
  <EA id="challenges"><FF num="44" label="Biggest challenge in accessing international markets" hint="Select your top 2 challenges" hasError={errors.includes("challenges")}><Chk value={d.challenges} onChange={v=>s("challenges",v)} options={["Finding buyers","Understanding regulations","Pricing","Shipping and logistics","Payment collection","Product certification","Other"]} hasError={errors.includes("challenges")} /></FF></EA>
  <EA id="supportNeeded"><FF num="45" label="What support do you need most from this programme?" hint="Select your top 3 priorities" hasError={errors.includes("supportNeeded")}><Chk value={d.supportNeeded} onChange={v=>s("supportNeeded",v)} options={["Buyer connections","Training","Compliance guidance","Financing","Shipping support","Marketing","Other"]} hasError={errors.includes("supportNeeded")} /></FF></EA>
  <EA id="workingCapital"><FF num="46" label="Estimated working capital available" hasError={errors.includes("workingCapital")}><Rad value={d.workingCapital} onChange={v=>s("workingCapital",v)} options={["Below ₦100k","₦100k to ₦500k","₦500k to ₦2M","₦2M and above"]} hasError={errors.includes("workingCapital")} /></FF></EA>
  <EA id="pilotAgreement"><FF num="47" label="Pilot transaction requirement" hint="As a standard requirement, initial engagement will commence with small pilot transactions prior to full-scale deals." hasError={errors.includes("pilotAgreement")}><Rad value={d.pilotAgreement} onChange={v=>s("pilotAgreement",v)} options={["Yes, please provide further details on the pilot transaction requirements","No, I will not proceed under this condition"]} hasError={errors.includes("pilotAgreement")} /></FF></EA>
  <FF num="48" label="Is there anything else we should know about your business?" hint="Optional"><TA value={d.additionalInfo} onChange={v=>s("additionalInfo",v)} placeholder="Any other relevant information..." rows={4} /></FF>
  <EA id="tcConsent">
    <div style={{ background:errors.includes("tcConsent")?"#FEF0EF":"var(--mint2)", border:`1.5px solid ${errors.includes("tcConsent")?"var(--red)":"var(--border)"}`, borderRadius:12, padding:"20px 24px" }}>
      <p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--forest)", letterSpacing:"0.08em", marginBottom:12 }}>TERMS AND CONDITIONS</p>
      <TCConsentCheck value={d.tcConsent} onChange={v=>s("tcConsent",v)} hasError={errors.includes("tcConsent")} />
    </div>
  </EA>
</>);


const Ph4=({d,s,errors})=>{
  const ng_states = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];
  return (<>
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
    <EA id="title"><FF num="1" label="Title" hasError={errors.includes("title")}><SI value={d.title} onChange={v=>s("title",v)} options={["Mr","Mrs","Miss","Ms","Dr","Prof","Chief","Alhaji","Alhaja"]} hasError={errors.includes("title")} /></FF></EA>
    <EA id="firstName"><FF num="2" label="First Name" hasError={errors.includes("firstName")}><TI value={d.firstName} onChange={v=>s("firstName",v)} placeholder="First name" hasError={errors.includes("firstName")} /></FF></EA>
    <EA id="lastName"><FF num="3" label="Last Name" hasError={errors.includes("lastName")}><TI value={d.lastName} onChange={v=>s("lastName",v)} placeholder="Last name" hasError={errors.includes("lastName")} /></FF></EA>
  </div>
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
    <EA id="gender"><FF num="4" label="Gender" hasError={errors.includes("gender")}><Rad value={d.gender} onChange={v=>s("gender",v)} options={["Male","Female","Prefer not to say"]} hasError={errors.includes("gender")} /></FF></EA>
    <EA id="dateOfBirth"><FF num="5" label="Date of Birth" hasError={errors.includes("dateOfBirth")}><TI value={d.dateOfBirth} onChange={v=>s("dateOfBirth",v)} placeholder="DD/MM/YYYY" hasError={errors.includes("dateOfBirth")} /></FF></EA>
  </div>
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
    <EA id="nationality"><FF num="6" label="Nationality" hasError={errors.includes("nationality")}><TI value={d.nationality} onChange={v=>s("nationality",v)} placeholder="e.g. Nigerian" hasError={errors.includes("nationality")} /></FF></EA>
    <EA id="stateOfResidence"><FF num="7" label="State of Residence" hasError={errors.includes("stateOfResidence")}><SI value={d.stateOfResidence} onChange={v=>s("stateOfResidence",v)} options={ng_states} hasError={errors.includes("stateOfResidence")} /></FF></EA>
  </div>
  <EA id="staffCount"><FF num="8" label="How many staff do you have?" hasError={errors.includes("staffCount")}><Rad value={d.staffCount} onChange={v=>s("staffCount",v)} options={["1 (Solo)","2 to 5","6 to 10","11 to 20","21 to 50","51 and above"]} hasError={errors.includes("staffCount")} /></FF></EA>
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
    <EA id="initialCapital"><FF num="9" label="Initial Capital" hasError={errors.includes("initialCapital")}><TI value={d.initialCapital} onChange={v=>s("initialCapital",v)} placeholder="e.g. ₦500,000" hasError={errors.includes("initialCapital")} /></FF></EA>
    <EA id="capitalSource"><FF num="10" label="Source of Initial Capital" hasError={errors.includes("capitalSource")}><TI value={d.capitalSource} onChange={v=>s("capitalSource",v)} placeholder="e.g. Personal savings, loan" hasError={errors.includes("capitalSource")} /></FF></EA>
  </div>
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
    <EA id="totalInvestment"><FF num="11" label="Total Investment in Business" hasError={errors.includes("totalInvestment")}><TI value={d.totalInvestment} onChange={v=>s("totalInvestment",v)} placeholder="e.g. ₦2,000,000" hasError={errors.includes("totalInvestment")} /></FF></EA>
    <EA id="lastYearTurnover"><FF num="12" label="Last Year Turnover" hasError={errors.includes("lastYearTurnover")}><TI value={d.lastYearTurnover} onChange={v=>s("lastYearTurnover",v)} placeholder="e.g. ₦5,000,000" hasError={errors.includes("lastYearTurnover")} /></FF></EA>
    <EA id="annualProfit"><FF num="13" label="Annual Profit (Last Year)" hasError={errors.includes("annualProfit")}><TI value={d.annualProfit} onChange={v=>s("annualProfit",v)} placeholder="e.g. ₦1,500,000" hasError={errors.includes("annualProfit")} /></FF></EA>
  </div>
  <EA id="natureOfBusiness"><FF num="14" label="Nature of Business" hint="Describe your business in detail, including your market potential and size. Maximum 250 words." hasError={errors.includes("natureOfBusiness")}><TA value={d.natureOfBusiness} onChange={v=>s("natureOfBusiness",v)} placeholder="Describe your business, products/services, market size and potential..." rows={5} hasError={errors.includes("natureOfBusiness")} /></FF></EA>
  <EA id="innovation"><FF num="15" label="What innovation are you bringing into your sector?" hasError={errors.includes("innovation")}><TA value={d.innovation} onChange={v=>s("innovation",v)} placeholder="Describe what makes your approach innovative..." rows={3} hasError={errors.includes("innovation")} /></FF></EA>
  <EA id="programmeBenefit"><FF num="16" label="How do you think this programme would benefit you and your business?" hasError={errors.includes("programmeBenefit")}><TA value={d.programmeBenefit} onChange={v=>s("programmeBenefit",v)} placeholder="Explain how the T2T Programme would help your business..." rows={3} hasError={errors.includes("programmeBenefit")} /></FF></EA>
  <EA id="productDifferentiator"><FF num="17" label="What makes your product or service different from your competitors?" hasError={errors.includes("productDifferentiator")}><TA value={d.productDifferentiator} onChange={v=>s("productDifferentiator",v)} placeholder="Describe your competitive advantage..." rows={3} hasError={errors.includes("productDifferentiator")} /></FF></EA>
  <EA id="topCompetitors"><FF num="18" label="Mention your top five competitors" hasError={errors.includes("topCompetitors")}><TA value={d.topCompetitors} onChange={v=>s("topCompetitors",v)} placeholder="List your top 5 competitors..." rows={3} hasError={errors.includes("topCompetitors")} /></FF></EA>
  <EA id="revenueModel"><FF num="19" label="Describe your business revenue model" hasError={errors.includes("revenueModel")}><TA value={d.revenueModel} onChange={v=>s("revenueModel",v)} placeholder="How does your business make money..." rows={3} hasError={errors.includes("revenueModel")} /></FF></EA>
  <EA id="trainingLocation"><FF num="20" label="Which location will you attend the training?" hasError={errors.includes("trainingLocation")}><Rad value={d.trainingLocation} onChange={v=>s("trainingLocation",v)} options={["Lagos","Abuja"]} hasError={errors.includes("trainingLocation")} /></FF></EA>
  <EA id="providusAccount">
    <FF num="21" label="Do you have a Providus Bank business account?" hint="Having a Providus Bank account is a mandatory requirement to participate in this programme." hasError={errors.includes("providusAccount")}>
      <Rad value={d.providusAccount} onChange={v=>s("providusAccount",v)} options={["Yes","No — I will open one"]} hasError={errors.includes("providusAccount")} />
      {d.providusAccount === "No — I will open one" && (
        <div style={{ marginTop:12, background:"var(--amber-bg)", border:"1.5px solid var(--amber)", borderRadius:10, padding:"16px 18px", display:"flex", alignItems:"flex-start", gap:12 }}>
          
          <div>
            <p style={{ fontSize:"0.85rem", fontWeight:600, color:"var(--amber)", marginBottom:6 }}>A Providus Bank business account is required</p>
            <p style={{ fontSize:"0.8rem", color:"var(--text2)", marginBottom:10, lineHeight:1.6 }}>Please open your account before the programme commences. You can complete the account opening form online in under 2 minutes.</p>
            <a href="https://oap.providusbank.com/accountopening/" target="_blank" rel="noreferrer" style={{ background:"var(--amber)", color:"white", padding:"8px 18px", borderRadius:7, fontSize:"0.8rem", fontWeight:600, textDecoration:"none", display:"inline-block" }}>Open Providus Account →</a>
          </div>
        </div>
      )}
    </FF>
  </EA>
</>);};

// ─── SME REGISTRATION ─────────────────────────────────────────────────────────
const REG_SAVE_KEY = "t2t_reg_draft";

const Registration = ({ addApp }) => {
  const savedDraft = (() => { try { const s = localStorage.getItem(REG_SAVE_KEY); return s ? JSON.parse(s) : null; } catch { return null; } })();
  const [phase, setPhase]           = useState(savedDraft?.phase || 1);
  const [d, setD]                   = useState(savedDraft?.data || {});
  const [done, setDone]             = useState(false);
  const [ref, setRef]               = useState("");
  const [errors, setErrors]         = useState([]);
  const [shaking, setShaking]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResume, setShowResume] = useState(!!savedDraft);
  const top = useRef(null);

  const set = (k,v) => {
    setD(p => {
      const next = {...p,[k]:v};
      try { localStorage.setItem(REG_SAVE_KEY, JSON.stringify({ phase, data: next })); } catch {}
      return next;
    });
    setErrors(prev=>prev.filter(e=>e!==k));
  };

  const savePhase = (newPhase) => {
    try { localStorage.setItem(REG_SAVE_KEY, JSON.stringify({ phase: newPhase, data: d })); } catch {}
    setPhase(newPhase);
  };

  const clearDraft = () => {
    try { localStorage.removeItem(REG_SAVE_KEY); } catch {}
    setD({});
    setPhase(1);
    setShowResume(false);
  };

  const tryNext = () => {
    const missing = validatePhase(phase, d);
    if (missing.length > 0) {
      setErrors(missing);
      setShaking(true);
      setTimeout(()=>setShaking(false), 500);
      setTimeout(()=>{ const el=document.querySelector(".field-error-anchor"); if(el) el.scrollIntoView({behavior:"smooth",block:"center"}); }, 80);
      return;
    }
    setErrors([]);
    savePhase(phase+1);
    setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),80);
  };

  const submit = async () => {
    const missing = validatePhase(4, d);
    if (missing.length > 0) { setErrors(missing); setShaking(true); setTimeout(()=>setShaking(false),500); return; }
    setSubmitting(true);
    const a = await addApp(d);
    setRef(a.id);
    setDone(true);
    setSubmitting(false);
    try { localStorage.removeItem(REG_SAVE_KEY); } catch {}
    setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),80);
  };

  const pct = phase===1?25:phase===2?50:phase===3?75:100;

  if (done) return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 24px" }}>
      <div className="fade-up" style={{ background:"white", border:"1px solid var(--border)", borderRadius:20, padding:"60px 48px", maxWidth:500, width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(27,61,47,0.1)" }}>
        <div style={{ width:72, height:72, background:"var(--mint2)", borderRadius:"50%", margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
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
        {showResume && (
          <div className="fade-up" style={{ background:"var(--amber-bg)", border:"1.5px solid var(--amber)", borderRadius:12, padding:"16px 20px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <div>
                <p style={{ fontWeight:600, fontSize:"0.875rem", color:"var(--amber)" }}>You have a saved application</p>
                <p style={{ fontSize:"0.78rem", color:"var(--text2)", marginTop:2 }}>Pick up where you left off — your answers have been restored.</p>
              </div>
            </div>
            <button onClick={clearDraft} style={{ background:"transparent", border:"1.5px solid var(--amber)", color:"var(--amber)", padding:"7px 16px", borderRadius:8, fontSize:"0.78rem", fontWeight:600, cursor:"pointer", flexShrink:0 }}>Start Fresh</button>
          </div>
        )}
        <div style={{ marginBottom:48 }}>
          <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:100, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:14, display:"inline-block" }}>Phase {phase} of 4 · {phase===1?"Business Profile and Banking":phase===2?"Business Basics":phase===3?"Compliance and Readiness":"Export Capacity"}</span>
          <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:600, color:"var(--forest)", marginBottom:8, lineHeight:1.15 }}>{phase===1?"Your profile and banking details":phase===2?"Tell us about your business":phase===3?"Compliance and operational readiness":"Export capability and commitment"}</h1>
          <p style={{ color:"var(--text3)", fontSize:"0.875rem" }}>{phase===1?"12 questions · approx. 5 to 6 minutes":phase===2?"10 questions · approx. 5 to 6 minutes":phase===3?"9 questions · approx. 4 to 5 minutes":"8 questions · approx. 2 to 3 minutes"}</p>
          {errors.length > 0 && (
            <div className={shaking?"shake":""} style={{ marginTop:20, background:"#FEF0EF", border:"1.5px solid var(--red)", borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <p style={{ fontSize:"0.85rem", fontWeight:600, color:"var(--red)", marginBottom:3 }}>Please complete all required fields</p>
                <p style={{ fontSize:"0.78rem", color:"#8B2020", lineHeight:1.5 }}>{errors.length} field{errors.length>1?"s":""} {errors.length>1?"are":"is"} missing or incomplete.</p>
              </div>
            </div>
          )}
          <div style={{ marginTop:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              {["Profile & Banking","Business Basics","Compliance","Export Capacity"].map((l,i)=>(<span key={l} style={{ fontSize:"0.65rem", fontWeight:i+1<=phase?600:400, color:i+1<=phase?"var(--forest)":"var(--text3)" }}>{l}</span>))}
            </div>
            <div style={{ background:"var(--border)", height:4, borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg, var(--forest), var(--sage))", borderRadius:4, transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
          {phase===1&&<Ph4 d={d} s={set} errors={errors} />}
          {phase===2&&<Ph1 d={d} s={set} errors={errors} />}
          {phase===3&&<Ph2 d={d} s={set} errors={errors} />}
          {phase===4&&<Ph3 d={d} s={set} errors={errors} />}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:48, paddingTop:28, borderTop:"1px solid var(--border)" }}>
          {phase>1?<button onClick={()=>{savePhase(phase-1);setErrors([]);}} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"11px 24px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer" }}>Back</button>:<div/>}
          {phase<4
            ?<button onClick={tryNext} style={{ background:"var(--forest)", border:"none", color:"white", padding:"13px 32px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>Continue</button>
            :<button onClick={submit} disabled={submitting} style={{ background:submitting?"var(--sage)":"var(--green-ok)", border:"none", color:"white", padding:"13px 36px", borderRadius:8, fontSize:"0.95rem", fontWeight:600, cursor:submitting?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(27,122,74,0.3)", opacity:submitting?0.8:1 }}>{submitting?"Submitting…":"Submit Application"}</button>
          }
        </div>
      </div>
    </div>
  );
};

// ─── JOURNALIST PORTAL ────────────────────────────────────────────────────────
const PressPortal = ({ addSubmission, onExit }) => {
  const [d, setD] = useState({});
  const [done, setDone] = useState(false);
  const [refId, setRefId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const set = (k,v) => setD(p=>({...p,[k]:v}));

  const submit = async () => {
    if (!d.name||!d.outlet||!d.email||!d.storyType||!d.headline||!d.content) return;
    setSubmitting(true);
    const s = await addSubmission(d);
    setRefId(s.id);
    setDone(true);
    setSubmitting(false);
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 24px" }}>
      <div className="fade-up" style={{ background:"white", border:"1px solid var(--border)", borderRadius:20, padding:"60px 48px", maxWidth:520, width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(27,61,47,0.1)" }}>
        <div style={{ width:72, height:72, background:"var(--mint2)", borderRadius:"50%", margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
        <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"2.2rem", color:"var(--forest)", marginBottom:12 }}>Submission Received</h2>
        <p style={{ color:"var(--text2)", lineHeight:1.7, marginBottom:28, fontWeight:300 }}>Your press submission has been received by the T2T Programme communications team. All submissions are reviewed before publication.</p>
        <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:10, padding:"18px 24px", marginBottom:28 }}>
          <p style={{ fontSize:"0.7rem", color:"var(--text3)", fontWeight:700, letterSpacing:"0.08em", marginBottom:6 }}>SUBMISSION REFERENCE</p>
          <p style={{ fontFamily:"Cormorant Garamond", fontSize:"1.5rem", fontWeight:700, color:"var(--forest)" }}>{refId}</p>
        </div>
        <p style={{ fontSize:"0.82rem", color:"var(--text3)", marginBottom:24 }}>For urgent enquiries contact: <strong>applications@t2tprogramme.com</strong></p>
        <button onClick={onExit} style={{ background:"var(--forest)", color:"white", border:"none", padding:"12px 28px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>Back to Newsroom</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", padding:"100px 24px 80px" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ marginBottom:48 }}>
          <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:100, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:14, display:"inline-block" }}>PRESS PORTAL · ACCREDITED JOURNALISTS</span>
          <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:600, color:"var(--forest)", lineHeight:1.1, marginBottom:12 }}>Submit a Story or Press Release</h1>
          <p style={{ color:"var(--text2)", lineHeight:1.7, fontWeight:300, marginBottom:20 }}>Use this portal to submit press releases, story pitches, or editorial contributions for consideration in the T2T Programme Digital Newsroom.</p>
          <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ fontSize:"0.8rem", color:"var(--text2)", lineHeight:1.6 }}>Submissions do not guarantee publication. Response time is typically 2 to 3 business days.</p>
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
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Summary</label><p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:8 }}>A brief 1 to 2 sentence summary.</p><TA value={d.summary} onChange={v=>set("summary",v)} placeholder="Briefly describe your story..." rows={2} /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Full Content</label><TA value={d.content} onChange={v=>set("content",v)} placeholder="Full content of your submission..." rows={10} /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Image URL (Optional)</label><TI value={d.imageUrl} onChange={v=>set("imageUrl",v)} placeholder="https://..." /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Category</label><SI value={d.category} onChange={v=>set("category",v)} options={["PRESS RELEASE","NEWS STORY","PARTNER SPOTLIGHT","PROGRAMME UPDATE","OPINION","MEDIA RESOURCE","EVENT COVERAGE"]} /></div>
              <div><label style={{ display:"block", fontWeight:600, fontSize:"0.875rem", marginBottom:8 }}>Additional notes for editorial team? (Optional)</label><TA value={d.notes} onChange={v=>set("notes",v)} placeholder="Embargo dates, corrections, context..." rows={3} /></div>
            </div>
          </div>
          <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:12, padding:"20px 24px" }}>
            <Chk value={d.declaration||[]} onChange={v=>set("declaration",v)} options={["I confirm this content is accurate and original","I authorise the T2T Programme to publish and edit this submission","I understand this does not guarantee publication"]} />
          </div>
        </div>
        <div style={{ marginTop:40, paddingTop:28, borderTop:"1px solid var(--border)", display:"flex", justifyContent:"flex-end", gap:12 }}>
          <button onClick={onExit} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"11px 24px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer" }}>Cancel</button>
          <button onClick={submit} disabled={submitting} style={{ background:submitting?"var(--sage)":"var(--forest)", border:"none", color:"white", padding:"13px 36px", borderRadius:8, fontSize:"0.95rem", fontWeight:600, cursor:submitting?"not-allowed":"pointer", opacity:submitting?0.8:1 }}>
            {submitting?"Submitting…":"Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── NEWSROOM ─────────────────────────────────────────────────────────────────
const Newsroom = ({ setPage, approvedSubmissions, onPressClick }) => {
  const m = useMobile();
  const [art, setArt] = useState(null);

  const approvedAsArticles = approvedSubmissions.map(s => ({
    id:s.id, cat:s.category||"PRESS RELEASE",
    date:new Date(s.submitted_at||s.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),
    headline:s.headline, summary:s.summary||s.content?.substring(0,180)+"...",
    img:s.image_url||s.imageUrl||"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80",
    source:s.outlet, featured:false, fullContent:s.content,
  }));

  const allArticles = [...staticNews, ...approvedAsArticles];
  const feat = allArticles.find(n=>n.featured)||allArticles[0];
  const rest = allArticles.filter(n=>n.id!==feat.id);

  const handleArticleClick = (a) => {
    if (a.externalUrl) { window.open(a.externalUrl, "_blank", "noreferrer"); }
    else { setArt(a); }
  };

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
              <p style={{ color:"var(--text2)", lineHeight:1.9, fontWeight:300 }}>The Training-to-Transaction (T2T) Programme is a landmark collaboration between Providus Bank, the ECOWAS Parliament, and GABA. Designed to bridge the gap between SME readiness and commercial transactions, the programme runs for three months across Lagos and Abuja.</p>
              <p style={{ color:"var(--text2)", lineHeight:1.9, fontWeight:300, marginTop:16 }}>Selected SMEs gain access to trade finance through Providus Bank, buyer linkage networks, and a pathway into the US, Canada, and Caribbean market pipelines.</p>
            </>
        }
        <div style={{ marginTop:56, background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:16, padding:"36px 40px" }}>
          <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.4rem", color:"var(--forest)", marginBottom:20 }}>Media Contacts</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }}>
            {[{name:"Media Enquiries",email:"applications@t2tprogramme.com",org:"T2T Programme Office"},{name:"Programme Updates",email:"applications@t2tprogramme.com"}].map(c=>(
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
            <p style={{ color:"var(--forest)", fontWeight:600, fontSize:"0.875rem" }}>applications@t2tprogramme.com</p>
          </div>
          <button onClick={onPressClick} style={{ background:"transparent", border:"none", color:"transparent", padding:"10px 20px", borderRadius:8, fontSize:"0.82rem", cursor:"default", userSelect:"none", width:120 }}>&nbsp;</button>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div onClick={()=>handleArticleClick(feat)} className="card-hover" style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", background:"white", borderRadius:16, border:"1px solid var(--border)", overflow:"hidden", marginBottom:40, cursor:"pointer" }}>
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
              <div key={a.id} onClick={()=>handleArticleClick(a)} className="card-hover" style={{ background:"white", borderRadius:14, border:"1px solid var(--border)", overflow:"hidden", cursor:"pointer" }}>
                <div style={{ height:200, overflow:"hidden" }}>
                  <img src={a.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
                </div>
                <div style={{ padding:"22px 22px 24px" }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:"0.65rem", fontWeight:600, letterSpacing:"0.1em", color:"var(--sage)" }}>{a.cat}</span>
                    {a.externalUrl && <span style={{ fontSize:"0.6rem", background:"var(--sand2)", border:"1px solid var(--border)", color:"var(--text3)", padding:"1px 6px", borderRadius:4, fontWeight:500 }}>↗ External</span>}
                  </div>
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
          <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:14, padding:"32px 28px", marginBottom:32, display:"flex", flexDirection:m?"column":"row", alignItems:m?"flex-start":"center", justifyContent:"space-between", gap:24 }}>
            <div>
              <p style={{ fontWeight:600, fontSize:"1rem", color:"var(--forest)", marginBottom:8 }}>Request Press Assets</p>
              <p style={{ fontSize:"0.875rem", color:"var(--text2)", lineHeight:1.7, maxWidth:480, fontWeight:300 }}>Programme fact sheets, partner logos, event photos and background briefings are available on request. Email our communications team with your publication name and deadline and we will respond within one business day.</p>
            </div>
            <a href="mailto:applications@t2tprogramme.com?subject=Media%20Asset%20Request%20%E2%80%94%20T2T%20Programme" style={{ background:"var(--forest)", color:"white", border:"none", padding:"12px 28px", borderRadius:9, fontSize:"0.875rem", fontWeight:600, cursor:"pointer", textDecoration:"none", whiteSpace:"nowrap", flexShrink:0 }}>Request Assets</a>
          </div>
          <div style={{ paddingTop:32, borderTop:"1px solid var(--border)" }}>
            <h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.3rem", fontWeight:600, color:"var(--forest)", marginBottom:16 }}>Press Contacts</h3>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"repeat(3, 1fr)", gap:12 }}>
              {[{name:"Media Enquiries",email:"applications@t2tprogramme.com",org:"T2T Programme Office"},{name:"Programme Updates",email:"applications@t2tprogramme.com"}].map(c=>(
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
const Dashboard = ({ apps, upAppStatus, submissions, upSubStatus, assessments, onExit }) => {
  const [tab, setTab]             = useState("sme");
  const [filter, setFilter]       = useState("all");
  const [sort, setSort]           = useState("score");
  const [exp, setExp]             = useState(null);
  const [pressFilter, setPressFilter] = useState("all");
  const [pressExp, setPressExp]   = useState(null);

  const assessmentMap = Object.fromEntries((assessments||[]).map(a => [a.application_id, a]));
  const list = apps.filter(a=>filter==="all"||a.status===filter).sort((a,b)=>sort==="score"?b.score-a.score:new Date(b.submittedAt)-new Date(a.submittedAt));
  const pressList = submissions.filter(s=>pressFilter==="all"||s.status===pressFilter).sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));

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
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1.4fr 1fr 1fr 1fr 1fr 110px", padding:"12px 24px", background:"var(--sand2)", borderBottom:"1px solid var(--border)", fontSize:"0.68rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em" }}>
                    <span>BUSINESS</span><span>NICHE AND LOCATION</span><span>TURNOVER</span><span>SCORE</span><span>STATUS</span><span>ASSESSMENT</span><span>ACTIONS</span>
                  </div>
                  {list.map((a,i)=>(
                    <div key={a.id}>
                      <div onClick={()=>setExp(exp===a.id?null:a.id)} style={{ display:"grid", gridTemplateColumns:"2fr 1.4fr 1fr 1fr 1fr 1fr 110px", alignItems:"center", padding:"16px 24px", background:exp===a.id?"var(--mint2)":i%2===0?"white":"var(--cream)", borderBottom:"1px solid var(--border2)", cursor:"pointer" }}>
                        <div><p style={{ fontWeight:600, fontSize:"0.9rem", color:"var(--forest)" }}>{a.businessName||a.business_name||"Not provided"}</p><p style={{ color:"var(--text3)", fontSize:"0.72rem", marginTop:2 }}>{a.id}</p></div>
                        <div><p style={{ fontSize:"0.85rem" }}>{a.business_niche||a.businessNiche||"Not specified"}</p><p style={{ color:"var(--text3)", fontSize:"0.72rem" }}>{(a.business_address||a.businessAddress)?(a.business_address||a.businessAddress).split(",")[0]:"Not provided"}</p></div>
                        <p style={{ fontSize:"0.85rem", color:"var(--text2)" }}>{a.monthly_turnover||a.monthlyTurnover||"Not stated"}</p>
                        <ScorePill v={a.score} />
                        <StPill st={a.status} />
                        {(() => { const ass = assessmentMap[a.id]; if (!ass) return <span style={{ fontSize:"0.75rem", color:"var(--text3)" }}>{a.status==="approved" ? "⏳ Pending" : "—"}</span>; const c = ass.category; const col = c==="Advanced"?"#1B7A4A":c==="Intermediate"?"#B8943F":"#C0392B"; const bg = c==="Advanced"?"#E8F5EF":c==="Intermediate"?"#FDF5E0":"#FDECEA"; return <span style={{ background:bg, color:col, padding:"3px 10px", borderRadius:100, fontSize:"0.72rem", fontWeight:600, border:`1px solid ${col}30` }}>✓ {c}</span>; })()}
                        <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>upAppStatus(a.id,"approved")} style={{ background:"#E8F5EF", border:"1px solid #1B7A4A40", color:"#1B7A4A", padding:"6px 12px", borderRadius:6, fontSize:"0.78rem", cursor:"pointer", fontWeight:600 }}>✓</button>
                          <button onClick={()=>upAppStatus(a.id,"rejected")} style={{ background:"#FDECEA", border:"1px solid #C0392B40", color:"#C0392B", padding:"6px 12px", borderRadius:6, fontSize:"0.78rem", cursor:"pointer", fontWeight:600 }}>✕</button>
                        </div>
                      </div>
                      {exp===a.id && (
                        <div className="fade-up" style={{ padding:"28px 24px 32px", background:"var(--mint2)", borderBottom:"1px solid var(--border)" }}>
                          {((a.product_photos||a.productPhotos)||[]).length > 0 && (
                            <div style={{ marginBottom:24, paddingBottom:24, borderBottom:"1px solid var(--border)" }}>
                              <p style={{ fontSize:"0.65rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:12 }}>PRODUCT PHOTOS</p>
                              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                                {((a.product_photos||a.productPhotos)||[]).map((url,idx)=>(
                                  <div key={url} style={{ position:"relative", width:140, height:140, borderRadius:10, overflow:"hidden", border:"2px solid var(--border)", background:"var(--sand2)", flexShrink:0, boxShadow:"0 2px 12px rgba(27,61,47,0.1)" }}>
                                    <img src={url} alt={"Product "+(idx+1)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                    <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(27,61,47,0.7)", padding:"5px 10px" }}>
                                      <p style={{ fontSize:"0.65rem", color:"white", fontWeight:600, letterSpacing:"0.06em" }}>{"PRODUCT "+(idx+1)}</p>
                                    </div>
                                    <a href={url} target="_blank" rel="noreferrer" style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"3px 7px", fontSize:"0.6rem", color:"white", textDecoration:"none", fontWeight:600 }}>View</a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {((a.product_certs||a.productCerts)||[]).length > 0 && (
                            <div style={{ marginBottom:24, paddingBottom:24, borderBottom:"1px solid var(--border)" }}>
                              <p style={{ fontSize:"0.65rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:12 }}>PRODUCT CERTIFICATES</p>
                              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                {((a.product_certs||a.productCerts)||[]).map((f,idx)=>(
                                  <div key={f.url||f} style={{ display:"flex", alignItems:"center", gap:12, background:"white", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 14px" }}>
                                    <div style={{ width:36, height:36, borderRadius:6, overflow:"hidden", flexShrink:0, background:"var(--mint2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                      {(f.type==="application/pdf"||(f.name||"").endsWith(".pdf"))
                                        ? <span style={{ fontSize:"0.58rem", fontWeight:700, color:"var(--forest)", letterSpacing:"0.04em" }}>PDF</span>
                                        : <img src={f.url||f} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                      }
                                    </div>
                                    <p style={{ flex:1, fontSize:"0.82rem", fontWeight:500, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name||("Certificate "+(idx+1))}</p>
                                    <a href={f.url||f} target="_blank" rel="noreferrer" style={{ fontSize:"0.75rem", color:"var(--forest)", fontWeight:600, textDecoration:"none", flexShrink:0 }}>View</a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20 }}>
                            {[["Business Name",a.business_name||a.businessName],["Address",a.business_address||a.businessAddress],["Niche",a.business_niche||a.businessNiche],["Structure",a.business_structure||a.businessStructure],["Operating Since",a.business_age||a.businessAge],["Role",a.role],["Export Experience",a.export_experience||a.exportExperience],["Target Markets",((a.target_markets||a.targetMarkets)||[]).join(", ")],["Contact Email",a.contact_email||a.contactEmail],["Phone",a.contact_phone||a.contactPhone],["Production Capacity",a.production_capacity||a.productionCapacity],["Monthly Turnover",a.monthly_turnover||a.monthlyTurnover],["Working Capital",a.working_capital||a.workingCapital],["Export Familiarity",a.export_docs_familiarity||a.exportDocsFamiliarity],["Quality Standards",((a.quality_standards||a.qualityStandards)||[]).join(", ")],["KYC Consent",a.kyc_consent||a.kycConsent],["Export Products",a.export_products||a.exportProducts],["Export Timeline",a.export_timeline||a.exportTimeline],["Challenges",((a.challenges)||[]).join(", ")],["Support Needed",((a.support_needed||a.supportNeeded)||[]).join(", ")],["Training Location",a.training_location||a.trainingLocation],["Providus Account",a.providus_account||a.providusAccount],["Full Name",[(a.title||""),(a.first_name||a.firstName||""),(a.last_name||a.lastName||"")].filter(Boolean).join(" ")||null],["Gender",a.gender],["Date of Birth",a.date_of_birth||a.dateOfBirth],["Nationality",a.nationality],["State of Residence",a.state_of_residence||a.stateOfResidence],["Staff Count",a.staff_count||a.staffCount],["Initial Capital",a.initial_capital||a.initialCapital],["Capital Source",a.capital_source||a.capitalSource],["Total Investment",a.total_investment||a.totalInvestment],["Last Year Turnover",a.last_year_turnover||a.lastYearTurnover],["Annual Profit",a.annual_profit||a.annualProfit],["Nature of Business",a.nature_of_business||a.natureOfBusiness],["Innovation",a.innovation],["Programme Benefit",a.programme_benefit||a.programmeBenefit],["Product Differentiator",a.product_differentiator||a.productDifferentiator],["Top Competitors",a.top_competitors||a.topCompetitors],["Revenue Model",a.revenue_model||a.revenueModel],["Submitted",new Date(a.submitted_at||a.submittedAt).toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"})]].filter(([,v])=>v&&v!=="").map(([label,value])=>(
                              <div key={label}><p style={{ fontSize:"0.65rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:3 }}>{label.toUpperCase()}</p><p style={{ fontSize:"0.85rem", color:"var(--text)", lineHeight:1.5 }}>{value}</p></div>
                            ))}
                          </div>
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
              ? <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, padding:"80px 40px", textAlign:"center" }}><p style={{ fontSize:"3rem", marginBottom:16 }}>📰</p><h3 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.6rem", color:"var(--forest)", marginBottom:8 }}>No press submissions yet</h3></div>
              : <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"2.5fr 1.5fr 1fr 1fr 120px", padding:"12px 24px", background:"var(--sand2)", borderBottom:"1px solid var(--border)", fontSize:"0.68rem", fontWeight:700, color:"var(--text3)", letterSpacing:"0.08em" }}>
                    <span>HEADLINE</span><span>JOURNALIST AND OUTLET</span><span>TYPE</span><span>STATUS</span><span>ACTIONS</span>
                  </div>
                  {pressList.map((s,i)=>(
                    <div key={s.id}>
                      <div onClick={()=>setPressExp(pressExp===s.id?null:s.id)} style={{ display:"grid", gridTemplateColumns:"2.5fr 1.5fr 1fr 1fr 120px", alignItems:"center", padding:"16px 24px", background:pressExp===s.id?"var(--mint2)":i%2===0?"white":"var(--cream)", borderBottom:"1px solid var(--border2)", cursor:"pointer" }}>
                        <div><p style={{ fontWeight:600, fontSize:"0.88rem", color:"var(--forest)", lineHeight:1.3 }}>{s.headline||"Untitled"}</p><p style={{ color:"var(--text3)", fontSize:"0.72rem", marginTop:2 }}>{s.id}</p></div>
                        <div><p style={{ fontSize:"0.85rem", fontWeight:500 }}>{s.name||"Unknown"}</p><p style={{ color:"var(--text3)", fontSize:"0.75rem" }}>{s.outlet||"No outlet"}</p></div>
                        <span style={{ background:"var(--mint2)", color:"var(--forest3)", padding:"3px 8px", borderRadius:4, fontSize:"0.68rem", fontWeight:600 }}>{s.storyType||s.story_type||"Submission"}</span>
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


// ─── EXPORT READINESS ASSESSMENT ─────────────────────────────────────────────
const ASSESSMENT_SECTIONS = [
  {
    id: "statutory", label: "Statutory Readiness",
    desc: "Your business is statutory compliant",
    questions: [
      "Is your business registered?",
      "Is the information about your business up-to-date: e.g. its directors / members, business address, accounting officer and auditor?",
      "Does your business meet all statutory requirements?",
      "Are your statutory returns and payments up-to-date?",
      "Is your business registered as an exporter?",
      "Is the information about your business (e.g. business name and address) consistent with all the statutory bodies/authorities?",
      "Is your business compliant with the regulations specific to your type of business, e.g. health and environmental regulations?",
    ]
  },
  {
    id: "management", label: "Management Readiness",
    desc: "Your management is committed and geared to plan and implement export ventures",
    questions: [
      "Is your business well-established, stable and achieving success in its domestic market?",
      "Do you have an up-to-date business plan?",
      "Are you open to new ways of doing business?",
      "Do you have a realistic idea of what exporting entails and the timelines for results?",
      "Is exporting part of your business's long-term goals?",
      "Is senior management committed to exporting?",
      "Have you conducted an export-focused SWOT analysis?",
      "Do you have clear, achievable and measurable export objectives?",
      "Do you have an up-to-date export plan?",
      "Have accounting, administrative and communications systems been formalized?",
      "Are you willing to travel and spend significant time developing new markets?",
      "Do you have sufficient financial resources to pursue other markets and are you willing to invest in developing new markets?",
      "Can you obtain enough capital or lines of credit to cover the costs for market development and managing cash flow?",
    ]
  },
  {
    id: "hr", label: "Human Resource Readiness",
    desc: "Your staff is committed and has the skills necessary to implement export ventures",
    questions: [
      "Do you have the capacity to handle the extra demand associated with exporting?",
      "Will you be able to serve both your existing domestic customers and your new foreign clients?",
      "If your domestic demand increases, will you still be able to look after your export customers — and vice versa?",
      "Is there an entrepreneurial spirit within your organization?",
      "Is exporting recognized by the full staff as a priority of the business and is everyone prepared to work towards this goal?",
      "Do you and/or someone within the business have international business experience?",
      "Do you have staff with strong, culturally-sensitive, marketing skills?",
      "Do you have the necessary research and project management skills?",
      "Is someone available within the business who can read, write and speak the official foreign language of your target market?",
      "Is someone available who could be made responsible for planning and implementing the export venture?",
      "Where these necessary skills are not currently available, are you willing and able to find people with the right skills to help you develop your export business?",
    ]
  },
  {
    id: "research", label: "Research Readiness",
    desc: "Your business has the information required to thoughtfully and strategically pursue export ventures",
    questions: [
      "Have you narrowed down your target market(s) to a select few based on comprehensive market research?",
      "Are you aware of the trade agreements or other treaties that are in place with your target market?",
      "Have you undertaken sector research in your target market?",
      "Have you conducted a PEST analysis for your target market?",
      "Are you aware of the market regulations with respect to your product/service in your target market?",
      "Are you aware of the consumer-driven market standards in your target market for your product/service?",
      "Do you have information on import tariffs, taxes, non-tariff barriers, government-imposed terms/conditions/restrictions, licensing requirements, product testing/certification requirements, packaging/labelling requirements and other legal requirements governing the entry of your products/service into your target market?",
      "Are you aware of the cultural standards re. doing business in your target market?",
      "Do you have access to market intelligence in your target market?",
      "Do you have sufficient information on your competitors in your target market?",
      "Do you have sufficient information on your potential customers in your target market?",
      "Do you have sufficient information on your potential partners in your target market?",
      "Are you aware of the trends that influence the supply and demand of your product/service in your target market?",
    ]
  },
  {
    id: "product", label: "Product / Service Readiness",
    desc: "Your products/services are ready for exporting",
    questions: [
      "Have you identified which product/service has the best potential in your target market?",
      "Are you aware of and compliant to any governmental or legal requirements to exporting in your domestic market (e.g. prohibitions, export proceed repatriation)?",
      "Does your product/service meet the technical and regulatory requirements of your target market?",
      "If you are a service provider, will your credentials be recognized in foreign markets?",
      "Do you have the production capacity to meet the demands of your target market?",
      "Do your production processes need to be modified to meet the export market requirements?",
      "Does your product/service meet the consumer-driven voluntary standards expected in your target market?",
      "Are there climatic, geographic or technological factors affecting the use of your product/service in your target market and have you accounted for these?",
      "Is your product design and colour aligned with customs and traditions of the target market?",
      "Does your product meet the labelling and packaging requirements of the target market?",
      "Can your company satisfy any pre- and post-sale service requirements of the target market?",
      "Do you know how to protect your intellectual property in the target market?",
      "Are you aware of your product's/service's position in the domestic market compared to competitive products/services in terms of strengths, weaknesses and uniqueness?",
      "Are you aware of your product's/service's position in the target market compared to competitive products/services in terms of strengths, weaknesses and uniqueness?",
      "Would you be willing/able to change key product/service features in order to meet the requirements, customer expectations and improve competitive positioning in your target market?",
    ]
  },
  {
    id: "marketing", label: "Marketing Readiness",
    desc: "Your marketing material is ready for exporting and you have developed an export marketing strategy",
    questions: [
      "Do you have a marketing strategy in place for your target market?",
      "Do you know the profiles of the customers who use your product/services in your domestic market?",
      "Do you know the profiles of the customers who use your product/services in your target market?",
      "Do you thoroughly understand the needs of your customers in your target market?",
      "Have you developed a value proposition that reflects the needs and desires of your customers in your target market?",
      "Do you know your customers preferred marketing channels in your target market?",
      "Are you currently utilizing these marketing channels in a world-class manner?",
      "Has your marketing message been shaped for the target market, including any cultural considerations?",
      "Do you have world-class and perfectly translated marketing materials available in the language of the target market including brochures, business cards and a website?",
      "Do you have a strategy for promoting export sales through your website?",
      "Is there someone in the target market who can support and monitor your marketing efforts when you are not there?",
      "Do you have the financial resources to adjust your marketing and promotional materials for the target market, including professional translations, if required?",
    ]
  },
  {
    id: "representation", label: "Local Representation",
    desc: "You are able to establish business relationships to support your export ventures",
    questions: [
      "Do you require a local representative for marketing/delivery/distribution/servicing of your product/service?",
      "Do you know how to set up a strategic alliance?",
      "Do you know how a strategic alliance would support your export ventures in the target market?",
      "Do you know where you can find recommendations and information on potential partners?",
    ]
  },
  {
    id: "transactional", label: "Transactional Readiness",
    desc: "You are able to close a deal in your target market",
    questions: [
      "Do you know how to price your product/service for the target market?",
      "Do you have a free on board (FOB) or cost, insurance and freight (CIF) price list for your product, or a rate list for your service?",
      "Have you checked if you can sell or use the trade name associated with your product in your target markets without infringing on existing intellectual property (IP) rights?",
      "Are you able to be easily paid from your target market?",
      "Can your product/service be easily delivered to your target market?",
      "Do you have efficient ways of responding quickly to customer inquiries?",
      "Can you communicate effectively with buyers in your target market?",
      "Can you draft and forward formal price quotations (pro-forma invoices) or proposals that reflect appropriate terms of payment and shipment to prospective buyers in your target market?",
      "Have you established a formal relationship with your banker to assist you in evaluating purchase orders and letters of credit received from a buyer in your target market?",
      "Have you established a formal relationship with a freight forwarder through which you could obtain quotations for freight forwarding costs, and arrange inspection certificates, fumigation certificates and cargo space?",
      "Have you established a formal relationship with an accountant who can provide information on the tax implications of exporting?",
      "Have you established a formal relationship with an attorney who can provide information on the legal implications of exporting?",
      "Can you obtain credit insurance?",
      "Can you obtain marine insurance?",
      "Can you obtain foreign exchange cover?",
      "Can you obtain an exchange control declaration from your central bank if required?",
      "Are you aware of dispute resolution and arbitration mechanisms in exports?",
    ]
  },
  {
    id: "outcomes", label: "Outcomes",
    desc: "You have thoughtfully assessed the potential outcomes of exporting",
    questions: [
      "Have you estimated the present and projected supply and demand trends for your product/service in your export market?",
      "Have you calculated sales forecasts in your target market based on a realistic analysis of supply and demand trends and market share?",
      "Have you prepared an analysis of the fixed and variable costs?",
      "Have you calculated all the costs related to exporting?",
      "Have you prepared a projected cash flow and income statement for export venture?",
      "Have you estimated profits from your export venture?",
    ]
  },
];

const SCORE_MAP = { "yes": 3, "somewhat": 2, "no": 0, "na": null };

const scoreSection = (answers, sectionId, questions) => {
  let total = 0, max = 0;
  questions.forEach((_, i) => {
    const val = answers[`${sectionId}_${i}`];
    const score = SCORE_MAP[val];
    if (score !== null && score !== undefined && val !== "na") {
      total += score;
      max += 3;
    }
  });
  return max === 0 ? 0 : Math.round((total / max) * 100);
};

const getCategory = (scores) => {
  const overall = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  if (scores.transactional < 50) return "Beginner";
  if (overall >= 75 && scores.product >= 70 && scores.marketing >= 70 && scores.transactional >= 75) return "Advanced";
  if (overall >= 50) return "Intermediate";
  return "Beginner";
};

const ASS_SAVE_KEY = (id) => `t2t_assessment_${id}`;

const Assessment = ({ applicationId, onDone }) => {
  const savedAss = (() => { try { const s = localStorage.getItem(ASS_SAVE_KEY(applicationId)); return s ? JSON.parse(s) : null; } catch { return null; } })();
  const [answers, setAnswers]       = useState(savedAss?.answers || {});
  const [section, setSection]       = useState(savedAss?.section || 0);
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory]     = useState(null);
  const [showResume, setShowResume] = useState(!!savedAss);
  const top = useRef(null);
  const m = useMobile();

  const current = ASSESSMENT_SECTIONS[section];
  const totalSections = ASSESSMENT_SECTIONS.length;
  const pct = Math.round(((section) / totalSections) * 100);

  const allAnswered = current.questions.every((_, i) => answers[`${current.id}_${i}`]);

  const saveAnswer = (key, val) => {
    setAnswers(prev => {
      const next = {...prev, [key]: val};
      try { localStorage.setItem(ASS_SAVE_KEY(applicationId), JSON.stringify({ answers: next, section })); } catch {}
      return next;
    });
  };

  const next = () => {
    if (!allAnswered) return;
    if (section < totalSections - 1) {
      const newSection = section + 1;
      setSection(newSection);
      try { localStorage.setItem(ASS_SAVE_KEY(applicationId), JSON.stringify({ answers, section: newSection })); } catch {}
      setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  };

  const prev = () => {
    const newSection = section - 1;
    setSection(newSection);
    try { localStorage.setItem(ASS_SAVE_KEY(applicationId), JSON.stringify({ answers, section: newSection })); } catch {}
    setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const submit = async () => {
    if (!allAnswered) return;
    setSubmitting(true);
    try {
      const scores = {};
      ASSESSMENT_SECTIONS.forEach(sec => {
        scores[sec.id] = scoreSection(answers, sec.id, sec.questions);
      });
      const cat = getCategory(scores);
      const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);
      const id = `ASS-${String(Date.now()).slice(-8)}`;
      await sb("assessments", {
        method: "POST",
        body: JSON.stringify({
          id,
          application_id:      applicationId,
          submitted_at:        new Date().toISOString(),
          statutory_score:     scores.statutory,
          management_score:    scores.management,
          hr_score:            scores.hr,
          research_score:      scores.research,
          product_score:       scores.product,
          marketing_score:     scores.marketing,
          representation_score:scores.representation,
          transactional_score: scores.transactional,
          outcomes_score:      scores.outcomes,
          total_score:         overall,
          category:            cat,
          answers:             answers,
        }),
        prefer: "return=minimal"
      });
      setCategory(cat);
      setSubmitted(true);
      try { localStorage.removeItem(ASS_SAVE_KEY(applicationId)); } catch {}
    } catch (e) {
      console.error("Assessment submit error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, var(--forest) 0%, #234D3B 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div className="fade-up" style={{ background:"white", borderRadius:20, padding:"60px 48px", maxWidth:520, width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ width:72, height:72, background:"var(--mint2)", borderRadius:"50%", margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
        <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"2.2rem", color:"var(--forest)", marginBottom:12 }}>Assessment Complete</h2>
        <p style={{ color:"var(--text2)", lineHeight:1.7, marginBottom:28, fontWeight:300 }}>Thank you for completing the Export Readiness Assessment. The T2T Programme team will review your results and be in touch shortly regarding your participation track.</p>
        <div style={{ background:"var(--mint2)", border:"1px solid var(--border)", borderRadius:10, padding:"18px 24px", marginBottom:28 }}>
          <p style={{ fontSize:"0.7rem", color:"var(--text3)", fontWeight:700, letterSpacing:"0.08em", marginBottom:6 }}>APPLICATION REFERENCE</p>
          <p style={{ fontFamily:"Cormorant Garamond", fontSize:"1.4rem", fontWeight:700, color:"var(--forest)" }}>{applicationId}</p>
        </div>
        <p style={{ fontSize:"0.82rem", color:"var(--text3)" }}>For enquiries contact <strong>applications@t2tprogramme.com</strong></p>
      </div>
    </div>
  );

  const optionStyle = (key, qIdx) => {
    const selected = answers[`${current.id}_${qIdx}`] === key;
    return {
      display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
      borderRadius:8, border:`1.5px solid ${selected ? "var(--sage)" : "var(--border)"}`,
      background: selected ? "var(--mint2)" : "white",
      cursor:"pointer", transition:"all 0.15s", flex:1, justifyContent:"center",
    };
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand2)", padding: m ? "40px 20px 60px" : "60px 24px 80px" }} ref={top}>
      {showResume && (
        <div style={{ maxWidth:760, margin:"0 auto", paddingTop: m?"24px":"40px" }}>
          <div className="fade-up" style={{ background:"var(--amber-bg)", border:"1.5px solid var(--amber)", borderRadius:12, padding:"16px 20px", marginBottom:0, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <div>
                <p style={{ fontWeight:600, fontSize:"0.875rem", color:"var(--amber)" }}>Your progress has been saved</p>
                <p style={{ fontSize:"0.78rem", color:"var(--text2)", marginTop:2 }}>You are on Section {section + 1} of {ASSESSMENT_SECTIONS.length} — continue from where you left off.</p>
              </div>
            </div>
            <button onClick={()=>{ setAnswers({}); setSection(0); setShowResume(false); try { localStorage.removeItem(ASS_SAVE_KEY(applicationId)); } catch {} }} style={{ background:"transparent", border:"1.5px solid var(--amber)", color:"var(--amber)", padding:"7px 16px", borderRadius:8, fontSize:"0.78rem", fontWeight:600, cursor:"pointer", flexShrink:0 }}>Start Over</button>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ maxWidth:760, margin:"0 auto 40px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
          {T2T_LOGO && <img src={T2T_LOGO} alt="T2T" style={{ height:36, objectFit:"contain" }} />}
        </div>
        <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:100, padding:"4px 14px", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", marginBottom:14, display:"inline-block" }}>
          Section {section + 1} of {totalSections}
        </span>
        <h1 style={{ fontFamily:"Cormorant Garamond", fontSize: m ? "1.8rem" : "2.4rem", fontWeight:600, color:"var(--forest)", marginBottom:6, lineHeight:1.15 }}>
          Export Readiness Assessment
        </h1>
        <p style={{ color:"var(--text3)", fontSize:"0.875rem", marginBottom:20 }}>Application Reference: <strong style={{ color:"var(--forest)" }}>{applicationId}</strong></p>
        <div style={{ background:"var(--border)", height:4, borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg, var(--forest), var(--sage))", borderRadius:4, transition:"width 0.5s ease" }} />
        </div>
      </div>

      {/* Section */}
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        <div style={{ background:"white", border:"1px solid var(--border)", borderRadius:16, padding: m ? "24px 20px" : "36px 40px", marginBottom:28 }}>
          <div style={{ marginBottom:28, paddingBottom:20, borderBottom:"1px solid var(--border2)" }}>
            <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:"1.5rem", fontWeight:600, color:"var(--forest)", marginBottom:4 }}>{current.label}</h2>
            <p style={{ fontSize:"0.82rem", color:"var(--text3)", fontStyle:"italic" }}>{current.desc}</p>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            {current.questions.map((q, i) => {
              const key = `${current.id}_${i}`;
              const val = answers[key];
              return (
                <div key={key}>
                  <p style={{ fontSize:"0.9rem", fontWeight:500, color:"var(--text)", marginBottom:12, lineHeight:1.5 }}>
                    <span style={{ background:"var(--forest)", color:"var(--mint)", borderRadius:5, padding:"2px 8px", fontSize:"0.65rem", fontWeight:700, marginRight:10 }}>{i+1}</span>
                    {q}
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)", gap:8 }}>
                    {[["yes","Yes"],["somewhat","Somewhat"],["no","No"],["na","N/A"]].map(([k, label]) => (
                      <div key={k} onClick={() => saveAnswer(key, k)} style={optionStyle(k, i)}>
                        <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${val===k ? "var(--forest)" : "var(--border)"}`, background: val===k ? "var(--forest)" : "white", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {val===k && <div style={{ width:5, height:5, borderRadius:"50%", background:"white" }} />}
                        </div>
                        <span style={{ fontSize:"0.82rem", fontWeight: val===k ? 600 : 400, color: val===k ? "var(--forest)" : "var(--text2)" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          {section > 0
            ? <button onClick={prev} style={{ background:"transparent", border:"1.5px solid var(--border)", color:"var(--text2)", padding:"11px 24px", borderRadius:8, fontSize:"0.875rem", fontWeight:500, cursor:"pointer" }}>Back</button>
            : <div />
          }
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {!allAnswered && <p style={{ fontSize:"0.75rem", color:"var(--text3)" }}>Please answer all questions to continue</p>}
            {section < totalSections - 1
              ? <button onClick={next} disabled={!allAnswered} style={{ background: allAnswered ? "var(--forest)" : "var(--border)", border:"none", color:"white", padding:"13px 32px", borderRadius:8, fontSize:"0.875rem", fontWeight:600, cursor: allAnswered ? "pointer" : "not-allowed", opacity: allAnswered ? 1 : 0.6 }}>Continue</button>
              : <button onClick={submit} disabled={submitting || !allAnswered} style={{ background: allAnswered ? "var(--green-ok)" : "var(--border)", border:"none", color:"white", padding:"13px 36px", borderRadius:8, fontSize:"0.95rem", fontWeight:600, cursor: allAnswered && !submitting ? "pointer" : "not-allowed", opacity: allAnswered ? 1 : 0.6 }}>{submitting ? "Submitting…" : "Submit Assessment"}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const assessmentId = urlParams.get("assessment");
  const [page, setPage]                   = useState(assessmentId ? "assessment" : "landing");
  const [activeAssessmentId, setActiveAssessmentId] = useState(assessmentId || null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pressUnlocked, setPressUnlocked] = useState(false);
  const { apps, addApp, upAppStatus, submissions, addSubmission, upSubStatus, assessments, loading, dbError, loadAdminData } = useDataStore();

  const logoClicks  = useRef(0);
  const logoTimer   = useRef(null);
  const pressClicks = useRef(0);
  const pressTimer  = useRef(null);

  const handleLogoClick = () => {
    logoClicks.current += 1;
    clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(()=>{ logoClicks.current=0; }, 2000);
    if (logoClicks.current >= 5) {
      logoClicks.current = 0;
      setAdminUnlocked(false);
      setPage("admin-gate");
    } else {
      setPage("landing");
    }
  };

  const handlePressClick = () => {
    pressClicks.current += 1;
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(()=>{ pressClicks.current=0; }, 2000);
    if (pressClicks.current >= 5) {
      pressClicks.current = 0;
      setPressUnlocked(false);
      setPage("press-gate");
    }
  };

  const approvedSubmissions = submissions.filter(s=>s.status==="approved");
  const showNav = !["admin-gate","dashboard","assessment"].includes(page);

  const DbBanner = () => dbError ? (
    <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:"#FEF0EF", border:"1.5px solid var(--red)", borderRadius:10, padding:"12px 20px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", maxWidth:480 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <p style={{ fontSize:"0.82rem", color:"var(--red)", fontWeight:500 }}>{dbError}</p>
    </div>
  ) : null;

  if (loading) return (
    <>
      <GlobalStyles />
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, var(--forest) 0%, #234D3B 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20 }}>
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
      {page==="newsroom"  && <Newsroom setPage={setPage} approvedSubmissions={approvedSubmissions} onPressClick={handlePressClick} />}
      {page==="press-gate" && !pressUnlocked && (
        <PasswordGate title="Press Portal" subtitle="This portal is for accredited journalists and media professionals." action="verify_press" buttonLabel="Enter Press Portal" onUnlock={()=>{ setPressUnlocked(true); setPage("press-portal"); }} />
      )}
      {page==="press-portal" && pressUnlocked && (
        <PressPortal addSubmission={addSubmission} onExit={()=>{ setPressUnlocked(false); setPage("newsroom"); }} />
      )}
      {page==="admin-gate" && !adminUnlocked && (
        <PasswordGate title="Admin Access" subtitle="This area is restricted. Enter your admin password to continue." action="verify_admin" buttonLabel="Enter Dashboard" onUnlock={(pwd)=>{ setAdminUnlocked(true); loadAdminData(pwd); setPage("dashboard"); }} />
      )}
      {page==="dashboard" && adminUnlocked && (
        <Dashboard apps={apps} upAppStatus={upAppStatus} submissions={submissions} upSubStatus={upSubStatus} assessments={assessments} onExit={()=>{ setAdminUnlocked(false); setPage("landing"); }} />
      )}
      {page==="assessment" && (
        <Assessment applicationId={activeAssessmentId} onDone={()=>{ window.history.replaceState({}, "", "/"); setPage("landing"); }} />
      )}
    </>
  );
}