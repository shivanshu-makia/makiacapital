import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LOGO_WHITE = "/images/logo-white.png";
const LOGO_DARK = "/images/makia_hero.png";
const LOGO_ICON = "/images/makia_office.png";


const SECTORS = ["Technology & SaaS","Financial Services","Healthcare & Pharma","EV & Clean Energy","Infrastructure & Real Estate","Consumer & Retail","Industrial Manufacturing","Logistics & Supply Chain","Aerospace & Defence","Chemicals & Materials","Agriculture & Food","Education & EdTech","Media & Entertainment","Hospitality & Tourism"];
const FY_OPTIONS = ["FY24","FY25","FY26"];
const SERVICES = ["Pre-IPO","Private Placement (VC/PE)","IPO Advisory","Debt Syndication"];

export default function PitchToUs() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [pitchMode, setPitchMode] = useState("upload"); // "upload" or "questions"
  const [form, setForm] = useState({
    company:"", website:"", sector:"", name:"", email:"", phone:"",
    deckFile:null,
    whatDo:"", bizModel:"", customers:"", problem:"", differentiator:"",
    revenue:"", ebitda:"", fy:"FY25", runRate:"monthly",
    services:[], raiseAmount:""
  });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleService = (s) => setForm(p=>({...p, services: p.services.includes(s) ? p.services.filter(x=>x!==s) : [...p.services, s]}));
  const canNext = () => {
    if(step===1) return form.company && form.name && form.email && form.phone;
    if(step===2) return pitchMode==="upload" ? true : (form.whatDo && form.bizModel);
    if(step===3) return form.revenue && form.ebitda;
    return form.services.length>0;
  };

  const handleSubmit = async () => {
    if (!canNext()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        company: form.company,
        website: form.website || null,
        sector: form.sector || null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        pitch_mode: pitchMode,
        deck_filename: form.deckFile ? form.deckFile.name : null,
        what_do: form.whatDo || null,
        biz_model: form.bizModel || null,
        customers: form.customers || null,
        problem: form.problem || null,
        differentiator: form.differentiator || null,
        revenue: form.revenue || null,
        ebitda: form.ebitda || null,
        fy: form.fy || null,
        run_rate: form.runRate || null,
        services: form.services,
        raise_amount: form.raiseAmount || null,
      };
      await axios.post(`${API}/leads`, payload);
      // Also send to Formspree for email notification
      try {
        await axios.post("https://formspree.io/f/xbdwjejg", {
          _subject: `New Pitch: ${payload.company}`,
          company: payload.company,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          sector: payload.sector || "N/A",
          website: payload.website || "N/A",
          pitch_mode: payload.pitch_mode,
          services: (payload.services || []).join(", "),
          revenue: payload.revenue || "N/A",
          ebitda: payload.ebitda || "N/A",
          raise_amount: payload.raise_amount || "N/A",
          what_do: payload.what_do || "N/A",
          biz_model: payload.biz_model || "N/A",
          differentiator: payload.differentiator || "N/A",
        });
      } catch (formspreeErr) {
        console.warn("Formspree notification failed (lead still saved):", formspreeErr);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const C = { navy:"#0f1a4e", deep:"#1b2858", mid:"#2d4a6f", steel:"#3a5f8a", light:"#7a8fa6", gold:"#c8a86e", page:"#f7f9fb", white:"#fff" };

  const inputStyle = { width:"100%", padding:"12px 16px", border:"0.5px solid rgba(58,95,138,.15)", background:C.white, fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:C.navy, outline:"none", borderRadius:0 };
  const labelStyle = { fontFamily:"'DM Sans',sans-serif", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", color:C.light, display:"block", marginBottom:"8px" };
  const textareaStyle = { ...inputStyle, minHeight:"80px", resize:"vertical" };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.white, color:C.navy, minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:rgba(58,95,138,.2)}
        input:focus,select:focus,textarea:focus{border-color:${C.gold}!important}
        .step-dot{width:8px;height:8px;border-radius:50%;transition:all .3s}
        .step-dot.active{background:${C.gold};width:24px;border-radius:4px}
        .step-dot.done{background:${C.steel}}
        .step-dot.pending{background:rgba(58,95,138,.15)}
        .pill{padding:8px 16px;border:0.5px solid rgba(58,95,138,.12);font-size:13px;cursor:pointer;transition:all .2s;background:${C.white};color:${C.light}}
        .pill.active{border-color:${C.gold};color:${C.gold};background:rgba(200,168,110,.05)}
        .pill:hover{border-color:${C.steel}}
        @media(max-width:768px){
          .p-sp{padding-left:20px!important;padding-right:20px!important}
          .p-header{padding:20px 16px!important}
          .p-hero-h{font-size:30px!important}
          .p-grid-2{grid-template-columns:1fr!important}
          .p-promise{flex-direction:column!important;gap:24px!important}
          .p-promise-left{flex:none!important}
          .p-promise-border{border-left:none!important;padding-left:0!important;border-top:0.5px solid rgba(58,95,138,.08)!important;padding-top:20px!important}
          .p-form-wrap{padding:40px 20px!important}
          .p-footer-grid{grid-template-columns:1fr!important;text-align:center}
          .p-footer{padding:40px 20px 24px!important}
          .p-cta-h{font-size:30px!important}
        }
      `}</style>

      {/* Header */}
      <header className="p-header" style={{ padding:"20px 48px", borderBottom:"0.5px solid rgba(58,95,138,.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <img src={LOGO_DARK} alt="Makia Capital" style={{ height:"32px" }} />
        <a href="/" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", letterSpacing:"1.5px", textTransform:"uppercase", color:C.light, textDecoration:"none" }}>← Back to Home</a>
      </header>

      {/* Hero */}
      <section className="p-sp" style={{ padding:"80px 48px 60px", textAlign:"center", borderBottom:"0.5px solid rgba(58,95,138,.06)" }}>
        <h1 className="p-hero-h" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"44px", fontWeight:300, color:C.navy, marginBottom:"16px" }}>
          Pitch Your Company to <span style={{ color:C.gold, fontStyle:"italic" }}>Makia Capital</span>
        </h1>
        <p style={{ fontSize:"15px", color:C.light, maxWidth:"520px", margin:"0 auto 32px", lineHeight:1.6, fontWeight:300 }}>
          For founders building scalable businesses and preparing for institutional capital or public markets.
        </p>
        <a href="#form" style={{ display:"inline-block", padding:"12px 36px", background:C.navy, color:C.white, textDecoration:"none", fontSize:"13px", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:500 }}>Start Your Submission</a>
      </section>

      {/* What We Look For */}
      <section className="p-sp" style={{ padding:"60px 48px", borderBottom:"0.5px solid rgba(58,95,138,.06)" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:C.gold, marginBottom:"20px" }}>What We Look For</div>
          <div className="p-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px 48px" }}>
            {[
              "Inflection-stage companies with visible, scalable growth ahead",
              "Strong governance and disciplined financial practices",
              "Promoters we can build with, aligned for the long term",
              "Aligned towards public market readiness (SME or mainboard)"
            ].map((t,i) => (
              <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"16px 0", borderTop:"0.5px solid rgba(58,95,138,.06)" }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", color:C.gold, opacity:.6, marginTop:"2px" }}>0{i+1}</span>
                <p style={{ fontSize:"14px", lineHeight:1.6, color:C.navy, fontWeight:400 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Promise */}
      <section className="p-sp" style={{ padding:"48px 48px", background:C.page, borderBottom:"0.5px solid rgba(58,95,138,.06)" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div className="p-promise" style={{ display:"flex", gap:"48px", alignItems:"center" }}>
            <div className="p-promise-left" style={{ flex:"0 0 200px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"48px", fontWeight:300, color:C.gold, lineHeight:1 }}>24h</div>
              <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:C.light, marginTop:"8px" }}>Response Time</div>
            </div>
            <div className="p-promise-border" style={{ flex:1, borderLeft:"0.5px solid rgba(58,95,138,.08)", paddingLeft:"40px" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:400, color:C.navy, lineHeight:1.5, marginBottom:"8px" }}>Most founders never hear back from investors. We actually reply within 24 hours.</p>
              <p style={{ fontSize:"14px", color:C.light, fontWeight:300, lineHeight:1.6 }}>Even if it's a no, you'll know why. Every submission gets a thoughtful review — no ghosting, no black holes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form / Success */}
      <section id="form" className="p-sp" style={{ padding:"60px 48px 80px" }}>
        {submitted ? (
          <div data-testid="pitch-success" style={{ maxWidth:"560px", margin:"0 auto", textAlign:"center" }}>
            <div style={{ marginBottom:"24px" }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="27" stroke="#c8a86e" strokeWidth="1"/>
                <path d="M18 28L25 35L38 21" stroke="#c8a86e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"32px", fontWeight:300, color:C.navy, marginBottom:"16px" }}>Your pitch is with our team</h2>
            <div style={{ width:"60px", height:"0.5px", background:C.gold, margin:"0 auto 24px" }} />
            <p style={{ fontSize:"15px", lineHeight:1.7, color:C.navy, fontWeight:400, marginBottom:"8px" }}>
              Expect a response at <strong>{form.email}</strong> within 24 hours.
            </p>
            <p style={{ fontSize:"14px", lineHeight:1.7, color:C.light, fontWeight:300, marginBottom:"40px" }}>
              Even if it's a no, you'll know why. We review every submission thoughtfully.
            </p>
            <div style={{ borderTop:"0.5px solid rgba(58,95,138,.06)", paddingTop:"32px" }}>
              <p style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:C.gold, marginBottom:"12px" }}>In the meantime</p>
              <p style={{ fontSize:"14px", color:C.light, fontWeight:300, lineHeight:1.6, marginBottom:"24px" }}>Catch our latest Capital Markets webinar — 250+ episodes on IPO readiness, macro themes, and investment frameworks.</p>
              <a href="#" style={{ display:"inline-block", padding:"12px 36px", border:`0.5px solid ${C.navy}`, color:C.navy, textDecoration:"none", fontSize:"13px", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:500 }}>Watch Latest Episode →</a>
            </div>
          </div>
        ) : (
        <div style={{ maxWidth:"640px", margin:"0 auto" }}>
          {/* Confidentiality */}
          <div style={{ textAlign:"center", marginBottom:"32px", padding:"12px 0", borderBottom:"0.5px solid rgba(58,95,138,.06)" }}>
            <p style={{ fontSize:"12px", color:C.light, opacity:.7, letterSpacing:".5px" }}>Your information is confidential and shared only with the Makia review team.</p>
          </div>
          {/* Progress */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"48px" }}>
            {[1,2,3,4].map(s => (
              <div key={s} className={`step-dot ${s===step?"active":s<step?"done":"pending"}`} />
            ))}
            <span style={{ marginLeft:"12px", fontSize:"12px", color:C.light }}>Step {step} of 4</span>
          </div>

          {/* Step 1: Basic Info */}
          {step===1 && (
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:400, color:C.navy, marginBottom:"32px" }}>Basic Information</h2>
              <div style={{ display:"grid", gap:"20px" }}>
                <div><label style={labelStyle}>Company Name *</label><input data-testid="input-company" style={inputStyle} value={form.company} onChange={e=>set("company",e.target.value)} /></div>
                <div><label style={labelStyle}>Website (optional)</label><input data-testid="input-website" style={inputStyle} value={form.website} onChange={e=>set("website",e.target.value)} placeholder="https://" /></div>
                <div>
                  <label style={labelStyle}>Sector *</label>
                  <select style={inputStyle} value={form.sector} onChange={e=>set("sector",e.target.value)}>
                    <option value="">Select sector</option>
                    {SECTORS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ borderTop:"0.5px solid rgba(58,95,138,.06)", paddingTop:"20px" }}>
                  <label style={labelStyle}>Your Name *</label><input data-testid="input-name" style={inputStyle} value={form.name} onChange={e=>set("name",e.target.value)} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                  <div><label style={labelStyle}>Email *</label><input data-testid="input-email" style={inputStyle} type="email" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
                  <div><label style={labelStyle}>Phone *</label><input data-testid="input-phone" style={inputStyle} type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Overview */}
          {step===2 && (
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:400, color:C.navy, marginBottom:"24px" }}>Business Overview</h2>
              <div style={{ display:"flex", gap:"12px", marginBottom:"32px" }}>
                <button className={`pill ${pitchMode==="upload"?"active":""}`} onClick={()=>setPitchMode("upload")}>Upload Pitch Deck</button>
                <button className={`pill ${pitchMode==="questions"?"active":""}`} onClick={()=>setPitchMode("questions")}>Answer Questions</button>
              </div>
              {pitchMode==="upload" ? (
                <div style={{ border:"0.5px dashed rgba(58,95,138,.2)", padding:"48px 24px", textAlign:"center" }}>
                  <p style={{ fontSize:"14px", color:C.light, marginBottom:"12px" }}>Drag & drop your pitch deck or click to browse</p>
                  <p style={{ fontSize:"12px", color:C.light, opacity:.6 }}>PDF, PPT, PPTX — Max 25MB</p>
                </div>
              ) : (
                <div style={{ display:"grid", gap:"20px" }}>
                  <div><label style={labelStyle}>What does your company do? *</label><textarea style={textareaStyle} maxLength={300} value={form.whatDo} onChange={e=>set("whatDo",e.target.value)} /></div>
                  <div><label style={labelStyle}>What is your business model? *</label><textarea style={textareaStyle} maxLength={300} value={form.bizModel} onChange={e=>set("bizModel",e.target.value)} /></div>
                  <div><label style={labelStyle}>Who are your customers?</label><textarea style={textareaStyle} maxLength={200} value={form.customers} onChange={e=>set("customers",e.target.value)} /></div>
                  <div><label style={labelStyle}>What problem are you solving?</label><textarea style={textareaStyle} maxLength={200} value={form.problem} onChange={e=>set("problem",e.target.value)} /></div>
                  <div><label style={labelStyle}>What differentiates you?</label><textarea style={textareaStyle} maxLength={200} value={form.differentiator} onChange={e=>set("differentiator",e.target.value)} /></div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Financial Snapshot */}
          {step===3 && (
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:400, color:C.navy, marginBottom:"32px" }}>Financial Snapshot</h2>
              <div style={{ display:"grid", gap:"20px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                  <div><label style={labelStyle}>Revenue (INR Cr) *</label><input style={inputStyle} type="number" value={form.revenue} onChange={e=>set("revenue",e.target.value)} placeholder="e.g. 50" /></div>
                  <div><label style={labelStyle}>EBITDA (INR Cr) *</label><input style={inputStyle} type="number" value={form.ebitda} onChange={e=>set("ebitda",e.target.value)} placeholder="e.g. 8" /></div>
                </div>
                <div>
                    <label style={labelStyle}>Financial Year</label>
                    <select style={inputStyle} value={form.fy} onChange={e=>set("fy",e.target.value)}>
                      {FY_OPTIONS.map(f=><option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
              </div>
            </div>
          )}

          {/* Step 4: Fundraise Intent */}
          {step===4 && (
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:400, color:C.navy, marginBottom:"32px" }}>Fundraise Intent</h2>
              <div style={{ display:"grid", gap:"24px" }}>
                <div>
                  <label style={labelStyle}>Services Required (select all that apply) *</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginTop:"4px" }}>
                    {SERVICES.map(s=>(
                      <button key={s} className={`pill ${form.services.includes(s)?"active":""}`} onClick={()=>toggleService(s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div><label style={labelStyle}>Target Fundraise Amount (INR Cr)</label><input style={inputStyle} type="number" value={form.raiseAmount} onChange={e=>set("raiseAmount",e.target.value)} placeholder="e.g. 100" /></div>
                <div>
                  <label style={labelStyle}>How did you hear about us?</label>
                  <select style={inputStyle} value={form.referral||""} onChange={e=>set("referral",e.target.value)}>
                    <option value="">Select</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Anything else you'd like us to know?</label><textarea style={textareaStyle} maxLength={500} value={form.comments||""} onChange={e=>set("comments",e.target.value)} placeholder="Context, timeline, specific asks — whatever helps us understand your story better." /></div>
              </div>

              {/* Trust Builder */}
              <div style={{ marginTop:"48px", padding:"24px 0", borderTop:"0.5px solid rgba(58,95,138,.06)" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:C.gold, marginBottom:"16px" }}>What Happens Next?</div>
                <p style={{ fontSize:"14px", lineHeight:1.7, color:C.navy, fontWeight:400, marginBottom:"12px" }}>Most founders never hear back from investors. We actually reply within 24 hours.</p>
                <p style={{ fontSize:"14px", lineHeight:1.7, color:C.light, fontWeight:300 }}>Even if it's a no, you'll know why. Our team reviews every submission and will get in touch with you, regardless of fit or outcome.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"40px", paddingTop:"24px", borderTop:"0.5px solid rgba(58,95,138,.06)" }}>
            {step>1 ? (
              <button onClick={()=>setStep(s=>s-1)} style={{ background:"none", border:"none", fontSize:"13px", color:C.light, cursor:"pointer", letterSpacing:"1px", textTransform:"uppercase" }}>← Back</button>
            ) : <div />}
            {step<4 ? (
              <button
                disabled={!canNext()}
                onClick={()=>setStep(s=>s+1)}
                data-testid="continue-btn"
                style={{ padding:"12px 36px", background:canNext()?C.navy:"rgba(58,95,138,.15)", color:canNext()?C.white:C.light, border:"none", fontSize:"13px", letterSpacing:"1.5px", textTransform:"uppercase", cursor:canNext()?"pointer":"not-allowed", fontWeight:500 }}
              >Continue →</button>
            ) : (
              <button
                disabled={!canNext() || submitting}
                onClick={handleSubmit}
                data-testid="submit-pitch-btn"
                style={{ padding:"12px 48px", background:canNext()&&!submitting?C.gold:"rgba(200,168,110,.3)", color:canNext()&&!submitting?C.white:C.light, border:"none", fontSize:"13px", letterSpacing:"1.5px", textTransform:"uppercase", cursor:canNext()&&!submitting?"pointer":"not-allowed", fontWeight:600 }}
              >{submitting ? "Submitting..." : "Submit Pitch"}</button>
            )}
          </div>
          {submitError && <p style={{ textAlign:"right", fontSize:"12px", color:"#c0392b", marginTop:"8px" }}>{submitError}</p>}
          {step===4 && <p style={{ textAlign:"right", fontSize:"11px", color:C.light, marginTop:"8px", opacity:.6 }}>Takes less than 5 minutes</p>}
        </div>
        )}
      </section>

      {/* Footer */}
      <footer className="p-header" style={{ padding:"24px 48px", borderTop:"0.5px solid rgba(58,95,138,.06)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
        <span style={{ fontSize:"12px", color:C.light, opacity:.5 }}>© 2026 Makia Capital</span>
        <span style={{ fontSize:"12px", color:C.light, opacity:.5 }}>info@makiacapital.com</span>
      </footer>
    </div>
  );
}
