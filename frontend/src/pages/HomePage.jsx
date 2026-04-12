import { useState, useEffect, useRef } from "react";
import { POSTS, TYPE_COLORS } from "../data/insightsData";

const LOGO_WHITE = "/images/logo-white.png";
const LOGO_DARK = "/images/makia_hero.png";
const LOGO_ICON = "/images/makia_office.png";

function useInView(opt = {}) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12, ...opt });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

function Anim({ children, className = "", delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(36px)", transition: `opacity .8s cubic-bezier(.25,.46,.45,.94) ${delay}s, transform .8s cubic-bezier(.25,.46,.45,.94) ${delay}s`, ...style }}>{children}</div>;
}

function FineLine({ style = {}, dark = false }) {
  return <div style={{ width:"100%", height:"0.5px", background: dark ? "rgba(255,255,255,.06)" : "rgba(58,95,138,.08)", ...style }} />;
}

function Tag({ number, label }) {
  return <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#7a8fa6" }}><span style={{ color: "#c8a86e" }}>[ {number} ]</span><span style={{ width: "40px", height: "0.5px", background: "linear-gradient(90deg,#c8a86e,#3a5f8a)", display: "inline-block" }} /><span>{label}</span></div>;
}

function Counter({ end, suffix = "", dur = 2000 }) {
  const [c, setC] = useState(0);
  const [ref, v] = useInView();
  const done = useRef(false);
  useEffect(() => {
    if (!v || done.current) return; done.current = true;
    const t0 = Date.now();
    const id = setInterval(() => { const p = Math.min((Date.now()-t0)/dur,1); setC(Math.floor((1-Math.pow(1-p,3))*end)); if(p>=1) clearInterval(id); },16);
    return () => clearInterval(id);
  }, [v,end,dur]);
  return <span ref={ref}>{c}{suffix}</span>;
}

function FAQ({ question, answer, isOpen, onClick }) {
  return <div style={{ borderBottom: "0.5px solid rgba(58,95,138,.15)", cursor: "pointer" }} onClick={onClick}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" }}>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 500, color: "#0d1b2a", flex: 1 }}>{question}</span>
      <span style={{ fontSize: "24px", fontWeight: 300, color: "#c8a86e", marginLeft: "20px", transition: "transform .3s", transform: isOpen ? "rotate(45deg)" : "rotate(0)", lineHeight: 1 }}>+</span>
    </div>
    <div style={{ maxHeight: isOpen ? "1200px" : "0", overflow: "hidden", transition: "max-height .5s cubic-bezier(.25,.46,.45,.94)" }}>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a6d80", paddingBottom: "24px", margin: 0 }}>{answer}</div>
    </div>
  </div>;
}

function StageDiagram() {
  const [ref, v] = useInView();
  const [h, setH] = useState(null);
  const S = [
    { id:"g", label:"Growth Stage", icon:"\u2197", desc:"Scaling businesses with proven unit economics seeking institutional capital", color:"#3a6fa0" },
    { id:"p", label:"Pre-IPO", icon:"\u25C8", desc:"Companies preparing for public markets \u2014 DRHP structuring, SEBI compliance, investor positioning", color:"#4a7faa" },
    { id:"l", label:"Listed Companies", icon:"\u25C9", desc:"Post-listing capital strategies, QIPs, and strategic investor relations", color:"#c8a86e" },
    { id:"f", label:"Follow-On Offerings", icon:"\u2B21", desc:"QIB placements, preferential issues, PIPE transactions, and rights issues for listed companies", color:"#b8985e" },
  ];
  return <div ref={ref} style={{ padding:"8px 0" }}><div style={{ display:"flex", flexDirection:"column" }}>
    {S.map((s,i) => { const a=h===s.id; return <div key={s.id} onMouseEnter={()=>setH(s.id)} onMouseLeave={()=>setH(null)} style={{ display:"flex", alignItems:"stretch", opacity:v?1:0, transform:v?"translateX(0)":"translateX(-30px)", transition:`all .7s cubic-bezier(.25,.46,.45,.94) ${i*.15+.2}s`, cursor:"default" }}>
      <div style={{ width:"48px", display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
        {i>0 && <div style={{ width:"0.5px", height:"14px", background:`linear-gradient(180deg,${S[i-1].color}44,${s.color}44)` }} />}
        <div style={{ width:a?"36px":"30px", height:a?"36px":"30px", borderRadius:"50%", border:`1px solid ${s.color}`, background:a?`${s.color}18`:"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:s.color, transition:"all .3s", flexShrink:0, zIndex:2 }}>
          <span style={{ fontSize:a?"15px":"13px", transition:"font-size .3s" }}>{s.icon}</span>
        </div>
        {i<S.length-1 && <div style={{ width:"0.5px", flex:1, minHeight:"14px", background:`${s.color}33` }} />}
      </div>
      <div style={{ flex:1, padding:"8px 20px", marginLeft:"8px", background:a?`${s.color}08`:"transparent", borderLeft:a?`2px solid ${s.color}`:"2px solid transparent", transition:"all .3s" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:"10px", marginBottom:"4px" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"2px", color:s.color, textTransform:"uppercase", opacity:.7 }}>0{i+1}</span>
          <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:a?"20px":"18px", fontWeight:500, color:"#0d1b2a", margin:0, transition:"font-size .3s" }}>{s.label}</h4>
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", lineHeight:1.5, color:"#7a8fa6", margin:0, maxHeight:a?"60px":"0", overflow:"hidden", opacity:a?1:0, transition:"all .4s", fontWeight:300 }}>{s.desc}</p>
      </div>
    </div>; })}
  </div></div>;
}

function Testimonial({ quote, name, title, active }) {
  return <div style={{ minWidth:"100%", padding:"0 10px", boxSizing:"border-box", opacity:active?1:.3, transition:"opacity .6s" }}>
    <div className="m-test-wrap" style={{ background:"linear-gradient(135deg,#f4f7fa,#edf2f7)", borderRadius:"2px", padding:"48px", border:"0.5px solid rgba(58,95,138,.12)", maxWidth:"800px", margin:"0 auto" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", color:"#c8a86e", lineHeight:1, marginBottom:"24px", opacity:.4 }}>"</div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", lineHeight:1.8, color:"#1b2838", fontStyle:"italic", marginBottom:"32px" }}>{quote}</p>
      <FineLine style={{ marginBottom:"20px", opacity:.15 }} />
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, color:"#0d1b2a", margin:"0 0 4px" }}>{name}</p>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#7a8fa6", margin:0 }}>{title}</p>
    </div>
  </div>;
}

// ═══ SECTORS MARQUEE ═══
function SectorsMarquee() {
  const sectors = [
    "Technology & SaaS", "Financial Services", "Healthcare & Pharma", "EV & Clean Energy",
    "Infrastructure & Real Estate", "Consumer & Retail", "Industrial Manufacturing", "Logistics & Supply Chain",
    "Aerospace & Defence", "Chemicals & Materials", "Agriculture & Food", "Education & EdTech",
    "Media & Entertainment", "Hospitality & Tourism"
  ];
  const doubled = [...sectors, ...sectors];
  return (
    <div style={{ overflow: "hidden", padding: "24px 0", position: "relative" }}>
      <div style={{ position:"absolute", left:0, top:0, width:"100px", height:"100%", background:`linear-gradient(90deg,#0f1a4e,transparent)`, zIndex:2 }} />
      <div style={{ position:"absolute", right:0, top:0, width:"100px", height:"100%", background:`linear-gradient(270deg,#0f1a4e,transparent)`, zIndex:2 }} />
      <div style={{ display:"flex", gap:"8px", animation:"sectorScroll 35s linear infinite", width:"fit-content" }}>
        {doubled.map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", whiteSpace:"nowrap", flexShrink:0 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", fontWeight:300, color:"rgba(255,255,255,.55)", letterSpacing:"1px", transition:"color .3s" }}>{s}</span>
            <span style={{ color:"#c8a86e", fontSize:"8px", opacity:.5 }}>{"\u25C6"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function MakiaBlueGoldV3() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [aT, setAT] = useState(0);
  const [solid, setSolid] = useState(false);

  useEffect(() => { const h=()=>setSolid(window.scrollY>80); window.addEventListener("scroll",h,{passive:true}); return()=>window.removeEventListener("scroll",h); }, []);
  useEffect(() => { const t=setInterval(()=>setAT(p=>(p+1)%4),6000); return()=>clearInterval(t); }, []);

  const navLinks = [{ l:"About Us", h:"/about" },{ l:"Services", h:"#services" },{ l:"Insights", h:"/insights" },{ l:"Career", h:"#career" }];

  const offerings = [
    { icon:"\u039B", t:"SEBI Registered AIF", d:"INR 250 Cr AIF to invest in high-conviction, growth-stage investments across India\u2019s most promising sectors." },
    { icon:"\u0394", t:"IPO Advisory & Execution", d:"Helping private companies navigate public markets through end-to-end advisory, DRHP structuring, acting as lead institutional investor, book building strategy, and IR/PR." },
    { icon:"\u039E", t:"Debt Syndication", d:"Structured financing solutions across term loans, working capital, and mezzanine instruments tailored to growth trajectories." },
    { icon:"\u03A6", t:"Follow-On Issues", d:"Investing in already listed companies through QIB placements, preferential issues, PIPE transactions, and rights issues." },
  ];

  const testimonials = [
    { q:"Our co-investing journey with Makia has been remarkable. Their team\u2019s sharp investment acumen and ability to make informed decisions with a long-term perspective have been invaluable.", n:"Co-Investor", t:"Investment Partner" },
    { q:"I\u2019ve known the Makia Team a long time now, and their passion, commitment, and strong ethics continue to inspire confidence in every partnership we build.", n:"Industry Partner", t:"Strategic Advisor" },
    { q:"Makia has been a tremendous pillar of support to our portfolio companies, helping them achieve significant milestones and unlock their true potential.", n:"Portfolio Company", t:"Growth-Stage Enterprise" },
    { q:"Makia has been instrumental in enabling access to highly lucrative investment opportunities that are typically out of reach for most investors.", n:"Investor", t:"AIF Limited Partner" },
  ];

  const B = ({children}) => <ul style={{margin:"10px 0 10px 8px",padding:0,listStyle:"none"}}>{children}</ul>;
  const Li = ({children}) => <li style={{padding:"3px 0",display:"flex",gap:"8px"}}><span style={{color:"#c8a86e",flexShrink:0}}>•</span><span>{children}</span></li>;
  const Sub = ({children}) => <p style={{fontWeight:500,color:"#3a5f8a",margin:"14px 0 6px",fontSize:"14px"}}>{children}</p>;

  const faqs = [
    { q:"What does Makia Capital specialize in?", a:<>
      <p style={{margin:"0 0 8px"}}>Our core focus areas include:</p>
      <B><Li>Pre-IPO and SME IPO investments</Li><Li>Anchor and strategic investments</Li><Li>Private market deals</Li><Li>IPO advisory and execution support</Li><Li>Family Office and wealth advisory</Li><Li>Debt syndication</Li></B>
      <p style={{margin:"10px 0 0"}}>We combine capital, advisory, and investor access into a single integrated platform.</p>
    </>},
    { q:"What kind of companies does Makia Capital invest in?", a:<>
      <p style={{margin:"0 0 8px"}}>We invest in high-growth, fundamentally strong companies that are on a clear path to public markets.</p>
      <p style={{margin:"8px 0 4px"}}>Our focus is on:</p>
      <B><Li>Early to growth-stage companies with established profitability or near-term visibility</Li><Li>Businesses demonstrating strong revenue traction and scalability</Li><Li>Companies targeting an IPO within the next 2–3 years</Li><Li>Founders committed to strong corporate governance and transparency</Li></B>
      <p style={{margin:"10px 0 0"}}>We work with a select set of companies where we can meaningfully contribute to their IPO journey.</p>
    </>},
    { q:"What all does Makia Capital help with in IPO advisory?", a:<>
      <p style={{margin:"0 0 8px"}}>Makia Capital offers an end-to-end, integrated IPO support model:</p>
      <Sub>Merchant Banking & Regulatory Execution</Sub>
      <p style={{margin:"0 0 4px",fontSize:"14px"}}>Through our associated SEBI-registered merchant banking entity:</p>
      <B><Li>DRHP drafting and filings</Li><Li>SEBI and stock exchange coordination</Li><Li>End-to-end regulatory compliance</Li></B>
      <Sub>Capital & Anchor Participation</Sub>
      <B><Li>Our in-house fund, Makia Venture Fund, participates as a lead or anchor investor</Li><Li>We facilitate participation from AIFs, institutional investors, and QIBs</Li></B>
      <Sub>Strategic Positioning & Readiness</Sub>
      <B><Li>IPO positioning and valuation strategy</Li><Li>Business and financial readiness assessment</Li><Li>Structuring for public markets</Li></B>
      <Sub>Investor Relations & Market Visibility</Sub>
      <B><Li>Pre-IPO investor outreach</Li><Li>IR and PR strategy</Li><Li>Institutional investor engagement</Li></B>
    </>},
    { q:"Do you hold a Merchant Banking license?", a:<>
      <p>Makia Capital operates as an investment and advisory platform. For regulated merchant banking activities, we work through our associated SEBI-registered entity to ensure full compliance and seamless execution.</p>
    </>},
    { q:"How can investors participate in your opportunities?", a:<>
      <p>Select investors can access curated opportunities across pre-IPO, anchor, and private market deals. Participation is subject to eligibility, regulatory requirements, and deal-specific criteria.</p>
    </>},
    { q:"Who typically works with Makia Capital?", a:<>
      <p style={{margin:"0 0 4px"}}>We work with:</p>
      <B><Li>High Net Worth and Ultra HNI investors</Li><Li>Family Offices</Li><Li>SME promoters and founders</Li><Li>Institutional investors and intermediaries</Li></B>
    </>},
    { q:"What differentiates Makia Capital?", a:<>
      <p style={{margin:"0 0 8px"}}>Our differentiation lies in combining capital, advisory, and investor access:</p>
      <B><Li>In-house investment capability through Makia Venture Fund</Li><Li>Integrated IPO execution via merchant banking partnerships</Li><Li>Strong network of AIFs, QIBs, and institutional investors</Li><Li>Hands-on involvement in positioning companies for public markets</Li></B>
      <p style={{margin:"10px 0 0"}}>We don't just advise — we invest, structure, and scale alongside our partners.</p>
    </>},
    { q:"How can I get in touch or explore opportunities?", a:<>
      <p>You can reach us at <a href="mailto:team@makiacapital.com" style={{color:"#3a5f8a",textDecoration:"none",fontWeight:500}} onClick={e=>e.stopPropagation()}>team@makiacapital.com</a>, or through our website or request a callback. Our team will connect with you to understand your requirements and explore relevant opportunities.</p>
    </>},
  ];

  const portcos = ["Portfolio Co. 1","Portfolio Co. 2","Portfolio Co. 3","Portfolio Co. 4","Portfolio Co. 5","Portfolio Co. 6"];
  const C = { navy:"#0f1a4e", deep:"#1b2858", mid:"#2d4a6f", steel:"#3a5f8a", light:"#7a8fa6", gold:"#c8a86e", page:"#f7f9fb", white:"#fff" };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.white, color:C.navy, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        ::selection{background:rgba(58,95,138,.2);color:#0f1a4e}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes sectorScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes haloGlow{
          0%{opacity:.3;transform:scale(1) translate(-50%,-50%)}
          50%{opacity:.6;transform:scale(1.15) translate(-50%,-50%)}
          100%{opacity:.3;transform:scale(1) translate(-50%,-50%)}
        }
        @keyframes haloDrift{
          0%{transform:translate(-50%,-50%) translate(0,0)}
          33%{transform:translate(-50%,-50%) translate(30px,-20px)}
          66%{transform:translate(-50%,-50%) translate(-20px,15px)}
          100%{transform:translate(-50%,-50%) translate(0,0)}
        }
        @keyframes haloDrift2{
          0%{transform:translate(-50%,-50%) translate(0,0)}
          33%{transform:translate(-50%,-50%) translate(-25px,20px)}
          66%{transform:translate(-50%,-50%) translate(20px,-25px)}
          100%{transform:translate(-50%,-50%) translate(0,0)}
        }
        .nl{color:rgba(255,255,255,.75);text-decoration:none;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;transition:color .3s;font-weight:400}.nl:hover{color:#c8a86e}.nld{color:#7a8fa6}.nld:hover{color:#c8a86e}
        .pb{position:fixed;right:-52px;top:50%;transform:translateY(-50%) rotate(-90deg);background:linear-gradient(135deg,#3a5f8a,#c8a86e);color:#fff;border:none;padding:10px 28px;font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;z-index:100;transition:right .3s,box-shadow .3s;font-weight:500}.pb:hover{right:-48px;box-shadow:0 4px 20px rgba(58,95,138,.3)}
        .oc{padding:40px;border:0.5px solid rgba(58,95,138,.1);background:#fff;transition:all .4s cubic-bezier(.25,.46,.45,.94);cursor:default;position:relative;overflow:hidden}
        .oc::before{content:'';position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,transparent,#3a5f8a,#c8a86e,transparent);transform:scaleX(0);transition:transform .5s}.oc:hover::before{transform:scaleX(1)}.oc:hover{border-color:rgba(58,95,138,.2);transform:translateY(-4px);box-shadow:0 20px 60px rgba(15,26,78,.06)}
        .fl{color:rgba(255,255,255,.45);text-decoration:none;font-size:14px;transition:color .3s;display:block;margin-bottom:12px}.fl:hover{color:#c8a86e}
        .mm{position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(15,26,78,1);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px}
        .mm a{color:#fff;text-decoration:none;font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;letter-spacing:2px;transition:color .3s}.mm a:hover{color:#c8a86e}
        .kc{padding:32px;border:0.5px solid rgba(58,95,138,.1);background:#fff;transition:all .4s;cursor:default}.kc:hover{border-color:rgba(58,95,138,.25);transform:translateY(-3px);box-shadow:0 12px 40px rgba(15,26,78,.05)}
        @media(max-width:768px){
          .dn{display:none!important}
          .mt{display:flex!important}
          .ht{font-size:32px!important;line-height:1.2!important}
          .st{font-size:26px!important}
          .og{grid-template-columns:1fr!important;gap:32px 0!important}
          .fg{grid-template-columns:1fr!important;text-align:center;gap:32px!important}
          .pb{display:none}
          .il{flex-direction:column!important;gap:32px!important}
          .kg{grid-template-columns:1fr!important;gap:0!important}
          .ng{grid-template-columns:1fr!important}
          .m-sp{padding:48px 20px!important}
          .m-sp-sm{padding:40px 20px!important}
          .m-header{padding:0 16px!important}
          .m-blines{display:none!important}
          .m-test-wrap{padding:24px!important}
          .m-cta-h{font-size:30px!important}
          .m-invest-border{border-left:none!important;padding-left:0!important;border-top:0.5px solid rgba(58,95,138,.08)!important;padding-top:24px!important}
          .m-hero-sub{font-size:14px!important}
        }
        @media(min-width:769px){.mt{display:none!important}}
      `}</style>

      <a href="/pitch" className="pb" style={{ textDecoration:"none" }}>Pitch to Us</a>
      {menuOpen && <div className="mm" onClick={()=>setMenuOpen(false)}>{navLinks.map(n=><a key={n.l} href={n.h}>{n.l}</a>)}<a href="/pitch" style={{color:C.gold}}>Pitch to Us</a></div>}

      {/* HEADER */}
      <header style={{ position:"fixed", top:0, left:0, width:"100%", zIndex:500, padding:"0 48px", height:"72px", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all .4s", background:solid?"rgba(247,249,251,.96)":"transparent", backdropFilter:solid?"blur(20px)":"none", borderBottom:solid?"0.5px solid rgba(58,95,138,.08)":"none" }}>
        <a href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
          <img src={solid ? LOGO_DARK : LOGO_WHITE} alt="Makia Capital" style={{ height:"38px", width:"auto", transition:"opacity .3s" }} />
        </a>
        <nav className="dn" style={{ display:"flex", gap:"36px", alignItems:"center" }}>
          {navLinks.map(n=><a key={n.l} href={n.h} className={`nl ${solid?"nld":""}`}>{n.l}</a>)}
          <a href="/pitch" style={{ padding:"8px 24px", border:`0.5px solid ${solid?C.gold:"rgba(255,255,255,.4)"}`, color:solid?C.gold:"#fff", textDecoration:"none", fontSize:"12px", letterSpacing:"1.5px", textTransform:"uppercase", transition:"all .3s", fontWeight:500 }}>Pitch to Us</a>
        </nav>
        <button className="mt" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px" }}>
          <div style={{ width:"24px", display:"flex", flexDirection:"column", gap:"5px" }}>
            <span style={{ height:"1px", background:solid?C.navy:"#fff", display:"block" }} />
            <span style={{ height:"1px", background:solid?C.navy:"#fff", display:"block", width:"16px", marginLeft:"auto" }} />
          </div>
        </button>
      </header>

      {/* ═══ HERO WITH HALO EFFECT ═══ */}
      <section style={{ position:"relative", height:"100vh", minHeight:"600px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", background:C.navy }}>
        {/* Base gradient */}
        <div style={{ position:"absolute", inset:0, zIndex:0, background:C.navy }} />

        {/* HALO EFFECTS — animated glowing orbs */}
        <div style={{ position:"absolute", left:"45%", top:"40%", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle, rgba(58,95,138,.25) 0%, rgba(58,95,138,.08) 40%, transparent 70%)", zIndex:1, transformOrigin:"center center", animation:"haloGlow 6s ease-in-out infinite, haloDrift 12s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", left:"55%", top:"50%", width:"450px", height:"450px", borderRadius:"50%", background:"radial-gradient(circle, rgba(200,168,110,.12) 0%, rgba(200,168,110,.04) 40%, transparent 70%)", zIndex:1, transformOrigin:"center center", animation:"haloGlow 8s ease-in-out infinite 2s, haloDrift2 15s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", left:"35%", top:"55%", width:"350px", height:"350px", borderRadius:"50%", background:"radial-gradient(circle, rgba(45,74,111,.2) 0%, rgba(45,74,111,.06) 40%, transparent 70%)", zIndex:1, transformOrigin:"center center", animation:"haloGlow 7s ease-in-out infinite 1s, haloDrift 10s ease-in-out infinite 3s", pointerEvents:"none" }} />

        {/* Animated subtle noise texture */}
        <div style={{ position:"absolute", inset:0, zIndex:1, opacity:.08, background:"url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }} />

        {/* Overlay */}
        <div style={{ position:"absolute", inset:0, zIndex:2, background:`linear-gradient(180deg, rgba(15,26,78,.3) 0%, rgba(15,26,78,.5) 50%, rgba(15,26,78,.8) 100%)` }} />

        {/* 3 white boundary lines: horizontal below header + left/right verticals */}
        <div style={{ position:"absolute", inset:0, zIndex:3, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"72px", left:0, width:"100%", height:"0.5px", background:"rgba(255,255,255,.06)" }} />
          <div style={{ position:"absolute", left:"48px", top:"72px", width:"0.5px", height:"calc(100% - 72px)", background:"rgba(255,255,255,.05)" }} />
          <div style={{ position:"absolute", right:"48px", top:"72px", width:"0.5px", height:"calc(100% - 72px)", background:"rgba(255,255,255,.05)" }} />
        </div>

        {/* Hero content */}
        <div style={{ position:"relative", zIndex:4, textAlign:"center", padding:"0 24px", maxWidth:"900px" }}>
          <div style={{ animation:"fadeInUp 1s ease-out .3s both" }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", letterSpacing:"4px", textTransform:"uppercase", color:C.gold, marginBottom:"28px", fontWeight:400 }}>Asset Management · Investment Banking</div>
          </div>
          <h1 className="ht" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"58px", fontWeight:300, lineHeight:1.15, color:"#fff", letterSpacing:"-.5px", marginBottom:"28px", animation:"fadeInUp 1s ease-out .6s both" }}>
            Partnering with companies<br />building for <span style={{ color:C.gold, fontStyle:"italic" }}>tomorrow's India</span>
          </h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"16px", color:"rgba(200,215,230,.6)", lineHeight:1.7, maxWidth:"560px", margin:"0 auto 40px", fontWeight:300, animation:"fadeInUp 1s ease-out .9s both" }}>
            SEBI Reg. AIF | IPO Advisory | Debt Syndication
          </p>
          <div style={{ width:"80px", height:"1px", background:`linear-gradient(90deg,${C.steel},${C.gold})`, margin:"0 auto", animation:"lineGrow 1s ease-out 1.2s both", transformOrigin:"center" }} />
        </div>

        <div style={{ position:"absolute", bottom:"40px", left:"50%", transform:"translateX(-50%)", zIndex:4, display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", animation:"fadeInUp 1s ease-out 1.5s both" }}>
          <span style={{ fontSize:"11px", letterSpacing:"2px", color:"rgba(200,215,230,.35)", textTransform:"uppercase" }}>Scroll</span>
          <div style={{ width:"1px", height:"40px", background:`linear-gradient(180deg,${C.steel}80,transparent)` }} />
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ background:C.navy, padding:0 }}>
        <div className="ng" style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
          {[{v:250,s:" Cr+",l:"Fund Size (INR)"},{v:110,s:"+",l:"Years Cumulative Experience"},{v:70,s:"+",l:"Clients Served"}].map((s,i) => (
            <div key={i} style={{ textAlign:"center", padding:"48px 24px", borderRight:i<2?"0.5px solid rgba(58,95,138,.2)":"none" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.gold, lineHeight:1.2 }}><Counter end={s.v} suffix={s.s} /></div>
              <div style={{ fontSize:"11px", color:C.light, letterSpacing:"2px", textTransform:"uppercase", marginTop:"10px", opacity:.6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTORS MARQUEE */}
      <section style={{ background:C.navy, borderTop:"0.5px solid rgba(58,95,138,.12)" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"16px 48px 0" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:C.gold, opacity:.6, marginBottom:"4px" }}>Sectors of Interest</div>
        </div>
        <SectorsMarquee />
      </section>

      {/* PORTFOLIO */}
      <section style={{ padding:"64px 0", background:C.white, position:"relative" }}>
        <FineLine />
        <Anim><div style={{ textAlign:"center", padding:"48px 24px 32px" }}><Tag number="01" label="Portfolio" /><p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", letterSpacing:"2px", textTransform:"uppercase", color:C.light }}>Investments and Advisory</p></div></Anim>
        <div style={{ overflow:"hidden", padding:"20px 0 48px", position:"relative" }}>
          <div style={{ position:"absolute", left:0, top:0, width:"120px", height:"100%", background:`linear-gradient(90deg,${C.white},transparent)`, zIndex:2 }} />
          <div style={{ position:"absolute", right:0, top:0, width:"120px", height:"100%", background:`linear-gradient(270deg,${C.white},transparent)`, zIndex:2 }} />
          <div style={{ display:"flex", gap:"60px", alignItems:"center", animation:"marquee 20s linear infinite", width:"fit-content" }}>
            {[...portcos,...portcos].map((n,i)=><div key={i} style={{ minWidth:"180px", height:"80px", border:"0.5px solid rgba(58,95,138,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:C.light, letterSpacing:"1px", background:C.page }}>{n}</div>)}
          </div>
        </div>
        <FineLine />
      </section>

      {/* INVESTMENT FOCUS */}
      <section className="m-sp-sm" style={{ padding:"72px 48px", background:C.page, position:"relative" }}>
        <FineLine />
        <div style={{ maxWidth:"1100px", margin:"0 auto", paddingTop:"40px" }}>
          <Anim><Tag number="02" label="Investment Focus" /></Anim>
          <Anim delay={.1}>
            <h2 className="st" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, lineHeight:1.2, color:C.navy, marginBottom:"36px", maxWidth:"600px" }}>Backing growth-stage companies with <span style={{ color:C.gold, fontStyle:"italic" }}>conviction</span></h2>
          </Anim>

          <div className="il" style={{ display:"flex", gap:"60px", alignItems:"flex-start" }}>
            {/* Left: Three thesis pillars stacked */}
            <Anim delay={.15} style={{ flex:1 }}>
              {[
                { num:"01", title:"Inflection Point", text:"We focus on companies at the inflection point \u2014 businesses with proven unit economics, strong founding teams, and the ambition to access India\u2019s public markets." },
                { num:"02", title:"High Standards of Corporate Governance", text:"We back promoters who prioritise transparency, board independence, and compliance readiness long before the IPO clock starts ticking." },
                { num:"03", title:"We Partner & Invest", text:"We don\u2019t just advise from the sidelines. We co-invest alongside our portfolio companies, aligning our capital with conviction at every stage." },
              ].map((p,i) => (
                <div key={i} style={{ padding:"20px 0", borderTop: i>0 ? "0.5px solid rgba(58,95,138,.08)" : "none" }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:"12px", marginBottom:"8px" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"2px", color:C.gold, textTransform:"uppercase", opacity:.6 }}>{p.num}</span>
                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"19px", fontWeight:500, color:C.navy, margin:0 }}>{p.title}</h3>
                  </div>
                  <p style={{ fontSize:"13px", lineHeight:1.6, color:C.light, fontWeight:300, marginLeft:"32px" }}>{p.text}</p>
                </div>
              ))}
            </Anim>

            {/* Right: Investment Stage Diagram */}
            <Anim delay={.3} style={{ flex:0.85 }}>
              <div className="m-invest-border" style={{ borderLeft:"0.5px solid rgba(58,95,138,.08)", paddingLeft:"40px" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:C.steel, marginBottom:"20px", fontWeight:500 }}>Investment Stage</div>
                <StageDiagram />
              </div>
            </Anim>
          </div>
        </div>
      </section>

      {/* OFFERINGS */}
      <section id="services" className="m-sp" style={{ padding:"100px 48px", background:C.white }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Anim><Tag number="03" label="Services" /><h2 className="st" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, marginBottom:"60px" }}>Our Key <span style={{ color:C.gold, fontStyle:"italic" }}>Offerings</span></h2></Anim>
          <div className="og" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px 60px" }}>
            {offerings.map((o,i) => <Anim key={i} delay={i*.1}>
              <div style={{ borderTop:"0.5px solid rgba(58,95,138,.1)", paddingTop:"28px" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", color:i<2?C.steel:C.gold, marginBottom:"16px", opacity:.5, fontWeight:300 }}>{o.icon}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontWeight:500, color:C.navy, marginBottom:"12px" }}>{o.t}</h3>
                <p style={{ fontSize:"14px", lineHeight:1.7, color:C.light, fontWeight:300 }}>{o.d}</p>
              </div>
            </Anim>)}
          </div>
        </div>
        <FineLine style={{ marginTop:"60px" }} />
      </section>

      {/* TESTIMONIALS */}
      <section className="m-sp" style={{ padding:"80px 48px 100px", background:C.white }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Anim><Tag number="04" label="Testimonials" /><h2 className="st" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, marginBottom:"60px" }}>What Our <span style={{ color:C.gold, fontStyle:"italic" }}>Partners Say</span></h2></Anim>
          <div style={{ overflow:"hidden" }}>
            <div style={{ display:"flex", transition:"transform .6s cubic-bezier(.25,.46,.45,.94)", transform:`translateX(-${aT*100}%)` }}>
              {testimonials.map((t,i)=><Testimonial key={i} quote={t.q} name={t.n} title={t.t} active={i===aT} />)}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:"12px", marginTop:"40px" }}>
            {testimonials.map((_,i)=><button key={i} onClick={()=>setAT(i)} style={{ width:i===aT?"32px":"8px", height:"3px", background:i===aT?`linear-gradient(90deg,${C.steel},${C.gold})`:"#dde4ec", border:"none", cursor:"pointer", transition:"all .4s", borderRadius:0 }} />)}
          </div>
        </div>
      </section>

      {/* KNOWLEDGE */}
      <section id="knowledge" className="m-sp" style={{ padding:"100px 48px", background:C.page }}>
        <FineLine style={{ marginBottom:"60px" }} />
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Anim>
            <Tag number="05" label="Knowledge Hub" />
            <h2 className="st" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, marginBottom:"16px" }}>Sharing What We <span style={{ color:C.gold, fontStyle:"italic" }}>Learn</span></h2>
            <p style={{ fontSize:"15px", lineHeight:1.7, color:C.light, maxWidth:"600px", fontWeight:300, marginBottom:"48px" }}>From our weekly Capital Markets webinars reaching 1.5 lakh+ professionals to long-form writing on investing — we believe knowledge shared freely compounds the most.</p>
          </Anim>
          {[...POSTS].sort((a, b) => b.isoDate.localeCompare(a.isoDate)).map((post,i)=><Anim key={post.id} delay={i*.1}>
            <a href="/insights" className="kg" style={{ textDecoration:"none", display:"grid", gridTemplateColumns:"280px 1fr 120px", alignItems:"center", padding:"20px 0", borderTop:"0.5px solid rgba(58,95,138,.1)", gap:"32px", cursor:"pointer" }}>
              <div>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:TYPE_COLORS[post.type] || C.steel, fontWeight:500, display:"block", marginBottom:"6px" }}>{post.type}</span>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"19px", fontWeight:500, color:C.navy, margin:0 }}>{post.title}</h3>
              </div>
              <p style={{ fontSize:"13px", lineHeight:1.6, color:C.light, fontWeight:300, margin:0 }}>{post.excerpt.length > 140 ? post.excerpt.slice(0, 140) + "..." : post.excerpt}</p>
              <span style={{ fontSize:"12px", letterSpacing:"1.5px", textTransform:"uppercase", color:C.gold, fontWeight:500, textAlign:"right" }}>Read →</span>
            </a>
          </Anim>)}
          <div style={{ borderTop:"0.5px solid rgba(58,95,138,.1)", paddingTop:"32px", textAlign:"center" }}>
            <a href="/insights" style={{ display:"inline-block", padding:"12px 36px", border:`0.5px solid ${C.gold}`, color:C.gold, textDecoration:"none", fontSize:"13px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", transition:"all .4s", fontWeight:500 }}>View All Insights →</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="m-sp" style={{ padding:"100px 48px", background:C.white }}>
        <FineLine style={{ marginBottom:"60px" }} />
        <div style={{ maxWidth:"800px", margin:"0 auto" }}>
          <Anim><Tag number="06" label="FAQs" /><h2 className="st" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, marginBottom:"60px" }}>Frequently Asked <span style={{ color:C.gold, fontStyle:"italic" }}>Questions</span></h2></Anim>
          <Anim delay={.2}><div style={{ borderTop:"0.5px solid rgba(58,95,138,.12)" }}>{faqs.map((f,i)=><FAQ key={i} question={f.q} answer={f.a} isOpen={openFAQ===i} onClick={()=>setOpenFAQ(openFAQ===i?null:i)} />)}</div></Anim>
        </div>
      </section>

      {/* CTA */}
      <section id="pitch" className="m-sp" style={{ padding:"120px 48px", background:C.navy, position:"relative", textAlign:"center", overflow:"hidden" }}>
        <FineLine dark style={{ position:"absolute", top:0, left:0 }} />
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.08 }}>
          <div style={{ position:"absolute", left:"20%", top:0, width:"0.5px", height:"100%", background:`linear-gradient(180deg,transparent,${C.steel},transparent)` }} />
          <div style={{ position:"absolute", left:"80%", top:0, width:"0.5px", height:"100%", background:`linear-gradient(180deg,transparent,${C.gold},transparent)` }} />
          <div style={{ position:"absolute", top:"50%", left:0, width:"100%", height:"0.5px", background:`linear-gradient(90deg,transparent,${C.steel},${C.gold},transparent)` }} />
        </div>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%, rgba(58,95,138,.1) 0%, transparent 60%)", pointerEvents:"none" }} />
        <Anim>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", letterSpacing:"4px", textTransform:"uppercase", color:C.gold, marginBottom:"28px" }}>Get Started</div>
          <h2 className="m-cta-h" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"48px", fontWeight:300, color:"#fff", marginBottom:"20px", lineHeight:1.2 }}>Ready to Build<br />Something Extraordinary?</h2>
          <p style={{ fontSize:"15px", color:"rgba(200,215,230,.5)", maxWidth:"500px", margin:"0 auto 48px", lineHeight:1.7, fontWeight:300 }}>Whether you're preparing for an IPO, raising growth capital, or looking for a long-term investment partner — we'd love to hear your story.</p>
          <a href="/pitch" style={{ display:"inline-block", padding:"14px 48px", border:`0.5px solid ${C.gold}`, color:C.gold, textDecoration:"none", fontSize:"13px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", transition:"all .4s", fontWeight:500 }}
            onMouseEnter={e=>{e.target.style.background=`linear-gradient(135deg,${C.steel},${C.gold})`;e.target.style.color="#fff";e.target.style.borderColor="transparent"}}
            onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=C.gold;e.target.style.borderColor=C.gold}}
          >Pitch to Us</a>
        </Anim>
      </section>

      {/* FOOTER */}
      <footer className="m-sp" style={{ background:C.navy, padding:"80px 48px 40px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div className="fg" style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:"48px", marginBottom:"60px" }}>
            <div>
              <img src={LOGO_WHITE} alt="Makia Capital" style={{ height:"34px", width:"auto", marginBottom:"16px", opacity:.85 }} />
              <p style={{ fontSize:"14px", color:"rgba(200,215,230,.35)", lineHeight:1.6, fontWeight:300 }}>SEBI-registered Asset Management<br />& Investment Banking</p>
            </div>
            <div><div style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:C.gold, marginBottom:"20px", fontWeight:500 }}>About Us</div><a href="/about" className="fl">Our Thesis</a><a href="/about" className="fl">Our Team</a><a href="/about" className="fl">Transactions</a></div>
            <div><div style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:C.gold, marginBottom:"20px", fontWeight:500 }}>Services</div><a href="#" className="fl">AIF</a><a href="#" className="fl">IPO Advisory</a><a href="#" className="fl">Debt Syndication</a><a href="#" className="fl">Follow-On Issues</a></div>
            <div><div style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:C.gold, marginBottom:"20px", fontWeight:500 }}>Get in Touch</div><p style={{ fontSize:"14px", color:"rgba(200,215,230,.35)", lineHeight:1.7, fontWeight:300 }}>New Delhi, India<br /><a href="mailto:info@makiacapital.com" style={{ color:"rgba(200,215,230,.45)", textDecoration:"none" }}>info@makiacapital.com</a></p></div>
          </div>
          <div style={{ borderTop:"0.5px solid rgba(58,95,138,.12)", paddingTop:"24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
            <span style={{ fontSize:"12px", color:"rgba(200,215,230,.25)", letterSpacing:"1px" }}>© 2026 Makia Capital. All rights reserved.</span>
            <div style={{ display:"flex", gap:"24px" }}><a href="#" className="fl" style={{ marginBottom:0, fontSize:"12px" }}>Privacy Policy</a><a href="#" className="fl" style={{ marginBottom:0, fontSize:"12px" }}>Terms of Use</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
