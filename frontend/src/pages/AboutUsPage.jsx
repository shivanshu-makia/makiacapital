import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, v] = useInView();
  const map = {
    up:    [v ? "translateY(0)"  : "translateY(24px)",  v],
    left:  [v ? "translateX(0)"  : "translateX(-24px)", v],
    right: [v ? "translateX(0)"  : "translateX(24px)",  v],
  };
  const [tr, op] = map[direction] || map.up;
  return (
    <div ref={ref} style={{ opacity: op ? 1 : 0, transform: tr, transition: `opacity 0.95s cubic-bezier(.22,.61,.36,1) ${delay}s, transform 0.95s cubic-bezier(.22,.61,.36,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Tag({ number, label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"22px" }}>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"2.5px", color:"#c8a86e" }}>[{number}]</span>
      <span style={{ width:"32px", height:"0.5px", background:"linear-gradient(90deg,#c8a86e,#3a5f8a)", display:"inline-block" }} />
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#7a8fa6" }}>{label}</span>
    </div>
  );
}

function SweepHeading({ children, gold = false }) {
  const [ref, v] = useInView(0.3);
  return (
    <span ref={ref} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"inherit", fontWeight:"inherit", fontStyle: gold ? "italic" : "normal", color: gold ? "#c8a86e" : "#0d1b2a", display:"inline", backgroundImage: v ? "linear-gradient(90deg,transparent 0%,rgba(200,168,110,.17) 42%,rgba(200,168,110,.17) 58%,transparent 100%)" : "none", backgroundSize:"200% 100%", backgroundRepeat:"no-repeat", backgroundClip:"text", WebkitBackgroundClip:"text", animation: v ? "gradientSweep 1.6s cubic-bezier(.22,.61,.36,1) forwards" : "none" }}>
      {children}
    </span>
  );
}

function Line({ dark = false, style = {} }) {
  return <div style={{ width:"100%", height:"0.5px", background: dark ? "rgba(255,255,255,.07)" : "rgba(58,95,138,.08)", ...style }} />;
}

function FounderCard({ name, title, linkedIn, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("");
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ border:`0.5px solid ${hov ? "rgba(58,95,138,.22)" : "rgba(58,95,138,.09)"}`, transition:"all .5s cubic-bezier(.22,.61,.36,1)", transform: hov ? "translateY(-5px)" : "translateY(0)", boxShadow: hov ? "0 20px 56px rgba(15,26,78,.07)" : "none", background:"#fff", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"2px", background:"linear-gradient(90deg,transparent,#3a5f8a,#c8a86e,transparent)", transform: hov ? "scaleX(1)" : "scaleX(0)", transformOrigin:"left", transition:"transform .55s cubic-bezier(.22,.61,.36,1)" }} />
        <div style={{ width:"100%", aspectRatio:"4/3", overflow:"hidden", background:"#e8edf2" }}>
          <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#1b2858 0%,#3a5f8a 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:300, color:"rgba(200,168,110,.45)", letterSpacing:"4px" }}>{initials}</span>
          </div>
        </div>
        <div style={{ padding:"32px 36px 36px" }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontWeight:500, color:"#0d1b2a", margin:"0 0 5px" }}>{name}</h3>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#c8a86e", margin:"0 0 18px", fontWeight:500 }}>{title}</p>
          <Line style={{ marginBottom:"18px" }} />
          <a href={linkedIn || "#"} target="_blank" rel="noopener noreferrer" onMouseEnter={e => { e.currentTarget.style.color="#c8a86e"; }} onMouseLeave={e => { e.currentTarget.style.color="#3a5f8a"; }} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:400, color:"#3a5f8a", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"8px", transition:"color .3s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            View LinkedIn Profile
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function DisclosureRow({ label, href = "#" }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} download onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding: hov ? "18px 8px" : "18px 0", borderBottom:"0.5px solid rgba(58,95,138,.08)", textDecoration:"none", transition:"all .3s", background: hov ? "rgba(58,95,138,.025)" : "transparent", cursor:"pointer" }}>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:400, color: hov ? "#0d1b2a" : "#3a4f65", transition:"color .3s", letterSpacing:".2px" }}>{label}</span>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color: hov ? "#c8a86e" : "#7a8fa6", fontWeight:500, transition:"color .3s", display:"flex", alignItems:"center", gap:"6px" }}>
        Download
        <svg width="10" height="11" viewBox="0 0 10 11" fill="none"><path d="M5 1v7M2 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    </a>
  );
}

export default function MakiaAboutUs() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const C = { navy:"#0f1a4e", deep:"#1b2858", steel:"#3a5f8a", gold:"#c8a86e", light:"#7a8fa6", page:"#f7f9fb", white:"#fff" };

  const thesis = [
    { n:"01", t:"Smart Entry",     text:"We deploy capital at inflection points — when a company's unit economics are proven and the path to public markets becomes clear." },
    { n:"02", t:"India First",      text:"Every investment thesis is built on a deep understanding of India's structural growth drivers. We don't follow global playbooks — we write our own." },
    { n:"03", t:"Inflection Point", text:"We look for businesses on the cusp of a step-change — in revenue, profitability, or market position. Timing is everything." },
    { n:"04", t:"Aligned Capital",  text:"We invest alongside our portfolio companies, putting our own capital where our conviction is. No principal-agent conflicts." },
    { n:"05", t:"Governance First", text:"Strong boards, clean cap tables, audited financials — we insist on institutional-grade governance long before the IPO clock starts ticking." },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.white, color:C.navy, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        ::selection{background:rgba(58,95,138,.15);color:#0d1b2a}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gradientSweep{from{background-position:120% 0}to{background-position:-20% 0}}
        @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes haloFloat{0%,100%{opacity:.2}50%{opacity:.4}}
        .nl{color:rgba(255,255,255,.65);text-decoration:none;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;transition:color .3s;font-weight:400}.nl:hover{color:#c8a86e}
        .nld{color:#7a8fa6}.nld:hover{color:#c8a86e}
        @media(max-width:768px){
          .two-col,.three-col,.backing-grid{grid-template-columns:1fr!important}
          .hero-h{font-size:32px!important}
          .hide-mob{display:none!important}
          .mob-menu-btn{display:flex!important}
          .mob-menu{display:flex!important}
          .a-sp{padding:48px 20px!important}
          .a-sp-lg{padding:60px 20px!important}
          .a-header{padding:0 16px!important}
          .a-cta-h{font-size:30px!important}
          .a-persp-border{border-left:none!important;padding-left:0!important;border-top:0.5px solid rgba(58,95,138,.06)!important;padding-top:24px!important;margin-top:16px!important}
          .a-process-border{border-right:none!important;border-bottom:0.5px solid rgba(58,95,138,.07)!important;padding-bottom:24px!important;margin-bottom:24px!important}
          .a-process-pad{padding:0!important}
          .a-section-h{font-size:30px!important}
          .a-lead-panel{min-height:240px!important}
          .a-lead-pad{padding:32px 24px!important}
        }
        @media(min-width:769px){.mob-menu-btn{display:none!important}.mob-menu{display:none!important}}
      `}</style>

      {menuOpen && <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100vh", background:"rgba(15,26,78,1)", zIndex:999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"32px" }} onClick={()=>setMenuOpen(false)}>
        {[{l:"Home",h:"/"},{l:"About Us",h:"/about"},{l:"Insights",h:"/insights"}].map(n=><a key={n.l} href={n.h} style={{ color:"#fff", textDecoration:"none", fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:300, letterSpacing:"2px" }}>{n.l}</a>)}
        <a href="/pitch" style={{color:"#c8a86e", textDecoration:"none", fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:300, letterSpacing:"2px"}}>Pitch to Us</a>
      </div>}

      {/* HEADER */}
      <header className="a-header" style={{ position:"fixed", top:0, left:0, width:"100%", zIndex:500, height:"72px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px", background: solid ? "rgba(247,249,251,.97)" : "transparent", backdropFilter: solid ? "blur(18px)" : "none", borderBottom: solid ? "0.5px solid rgba(58,95,138,.07)" : "none", transition:"all .5s" }}>
        <a href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
          <img src={solid ? "/images/makia_hero.png" : "/images/logo-white.png"} alt="Makia Capital" style={{ height:"38px", width:"auto", transition:"opacity .3s" }} />
        </a>
        <nav className="hide-mob" style={{ display:"flex", gap:"36px", alignItems:"center" }}>
          {[{l:"About Us",h:"/about"},{l:"Services",h:"/#services"},{l:"Insights",h:"/insights"},{l:"Career",h:"/#career"}].map(n => (
            <a key={n.l} href={n.h} className={`nl ${solid ? "nld" : ""}`}>{n.l}</a>
          ))}
          <a href="/pitch" style={{ padding:"8px 22px", border:`0.5px solid ${solid ? C.gold : "rgba(255,255,255,.3)"}`, color: solid ? C.gold : "#fff", textDecoration:"none", fontSize:"12px", letterSpacing:"1.5px", textTransform:"uppercase", transition:"all .35s", fontWeight:500 }}>Pitch to Us</a>
        </nav>
        <button className="mob-menu-btn" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px", display:"none" }}>
          <div style={{ width:"24px", display:"flex", flexDirection:"column", gap:"5px" }}>
            <span style={{ height:"1px", background:solid?C.navy:"#fff", display:"block" }} />
            <span style={{ height:"1px", background:solid?C.navy:"#fff", display:"block", width:"16px", marginLeft:"auto" }} />
          </div>
        </button>
      </header>

      {/* HERO */}
      <section style={{ position:"relative", height:"100vh", minHeight:"580px", display:"flex", alignItems:"center", justifyContent:"center", background:C.navy, overflow:"hidden" }}>
        <div style={{ position:"absolute", left:"40%", top:"36%", width:"520px", height:"520px", borderRadius:"50%", background:"radial-gradient(circle,rgba(58,95,138,.2) 0%,transparent 68%)", animation:"haloFloat 8s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", left:"54%", top:"48%", width:"370px", height:"370px", borderRadius:"50%", background:"radial-gradient(circle,rgba(200,168,110,.09) 0%,transparent 68%)", animation:"haloFloat 10s ease-in-out infinite 2.5s", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(15,26,78,.18) 0%,rgba(15,26,78,.58) 100%)" }} />
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"72px", left:0, width:"100%", height:"0.5px", background:"rgba(255,255,255,.04)" }} />
          <div style={{ position:"absolute", left:"48px", top:"72px", width:"0.5px", height:"calc(100% - 72px)", background:"rgba(255,255,255,.035)" }} />
          <div style={{ position:"absolute", right:"48px", top:"72px", width:"0.5px", height:"calc(100% - 72px)", background:"rgba(255,255,255,.035)" }} />
        </div>
        <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 24px", maxWidth:"860px" }}>
          <div style={{ animation:"fadeInUp 1s ease-out .3s both" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"4px", textTransform:"uppercase", color:C.gold, fontWeight:400 }}>About Makia Capital</span>
          </div>
          <h1 className="hero-h" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"56px", fontWeight:300, color:"#fff", lineHeight:1.18, margin:"28px 0", animation:"fadeInUp 1s ease-out .6s both" }}>
            Built on first-principles investing<br />and <span style={{ fontStyle:"italic", color:C.gold }}>uncompromising integrity</span>
          </h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"16px", color:"rgba(200,215,230,.5)", lineHeight:1.75, maxWidth:"500px", margin:"0 auto 40px", fontWeight:300, animation:"fadeInUp 1s ease-out .9s both" }}>
            At Makia Capital, we invest early, engage deeply, and support companies through their next phase of growth.
          </p>
          <div style={{ width:"64px", height:"1px", background:`linear-gradient(90deg,${C.steel},${C.gold})`, margin:"0 auto", animation:"lineGrow 1.1s ease-out 1.2s both", transformOrigin:"center" }} />
        </div>
        <div style={{ position:"absolute", bottom:"38px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", animation:"fadeInUp 1s ease-out 1.5s both" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"2.5px", color:"rgba(200,215,230,.25)", textTransform:"uppercase" }}>Scroll</span>
          <div style={{ width:"1px", height:"34px", background:`linear-gradient(180deg,${C.steel}60,transparent)` }} />
        </div>
      </section>

      {/* OUR PERSPECTIVE */}
      <section className="a-sp-lg" style={{ padding:"108px 48px", background:C.white }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Line style={{ marginBottom:"68px" }} />
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"88px", alignItems:"center" }}>
            <div>
              <Reveal><Tag number="01" label="Our Perspective" /></Reveal>
              <Reveal delay={0.1}>
                <h2 className="a-section-h" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, lineHeight:1.22, marginBottom:"32px" }}>
                  <SweepHeading>We work with ambitious founders</SweepHeading><br />
                  <SweepHeading gold>building for scale</SweepHeading>
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"15px", lineHeight:1.85, color:C.light, fontWeight:300, marginBottom:"22px" }}>
                  We help ambitious founders access the right capital and the right relationships at critical moments in their journey.
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"15px", lineHeight:1.85, color:C.light, fontWeight:300 }}>
                  Our team brings 110+ years of cumulative experience across investment banking, private equity, and capital markets. We deploy that insight on behalf of every founder we back.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.18} direction="right">
              <div className="a-persp-border" style={{ borderLeft:"0.5px solid rgba(58,95,138,.07)", paddingLeft:"52px" }}>
                {[["₹250 Cr+","AIF Fund Size"],["110+","Years Cumulative Experience"],["70+","Clients Served"],["2 Decades","Capital Markets Track Record"]].map(([v,l],i,a) => (
                  <div key={i} style={{ paddingBottom:"26px", marginBottom:"26px", borderBottom: i < a.length-1 ? "0.5px solid rgba(58,95,138,.06)" : "none" }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"36px", fontWeight:300, color:C.navy, lineHeight:1.1 }}>{v}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:C.light, marginTop:"5px", opacity:.65 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* INVESTMENT THESIS — Horizontal card grid instead of vertical list */}
      <section className="a-sp-lg" style={{ padding:"108px 48px", background:C.page }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Line style={{ marginBottom:"68px" }} />
          <Reveal><Tag number="02" label="Investment Thesis" /></Reveal>
          <Reveal delay={0.1}>
            <h2 className="a-section-h" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, lineHeight:1.22, marginBottom:"52px" }}>
              Five principles that <span style={{ fontStyle:"italic", color:C.gold }}>guide every decision</span>
            </h2>
          </Reveal>

          {/* Top row: 3 cards */}
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"24px", marginBottom:"24px" }}>
            {thesis.slice(0, 3).map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background:C.white, border:"0.5px solid rgba(58,95,138,.08)", padding:"36px 32px", height:"100%", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"2.5px", color:C.gold, textTransform:"uppercase", opacity:.7 }}>{t.n}</span>
                    <span style={{ width:"24px", height:"0.5px", background:"linear-gradient(90deg,#c8a86e,#3a5f8a)", display:"inline-block" }} />
                  </div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontWeight:500, color:C.navy, margin:"0 0 14px" }}>{t.t}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", lineHeight:1.78, color:C.light, margin:0, fontWeight:300, flex:1 }}>{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom row: 2 cards + quote */}
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"24px" }}>
            {thesis.slice(3).map((t, i) => (
              <Reveal key={i} delay={(i + 3) * 0.08}>
                <div style={{ background:C.white, border:"0.5px solid rgba(58,95,138,.08)", padding:"36px 32px", height:"100%", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"2.5px", color:C.gold, textTransform:"uppercase", opacity:.7 }}>{t.n}</span>
                    <span style={{ width:"24px", height:"0.5px", background:"linear-gradient(90deg,#c8a86e,#3a5f8a)", display:"inline-block" }} />
                  </div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontWeight:500, color:C.navy, margin:"0 0 14px" }}>{t.t}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", lineHeight:1.78, color:C.light, margin:0, fontWeight:300, flex:1 }}>{t.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <div style={{ background:`linear-gradient(145deg,${C.deep},#0f1a4e)`, padding:"36px 32px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"120px", height:"120px", borderRadius:"50%", border:"0.5px solid rgba(200,168,110,.07)", pointerEvents:"none" }} />
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", color:C.gold, lineHeight:1, marginBottom:"16px", opacity:.3 }}>"</div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", fontStyle:"italic", lineHeight:1.72, color:"rgba(255,255,255,.8)", margin:0 }}>
                  We invest with discipline, not momentum — focusing on businesses where fundamentals lead valuation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="a-sp-lg" style={{ padding:"108px 48px", background:C.white }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Line style={{ marginBottom:"68px" }} />
          <Reveal><Tag number="03" label="Founders" /></Reveal>
          <Reveal delay={0.1}>
            <h2 className="a-section-h" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, marginBottom:"64px", lineHeight:1.22 }}>
              The people behind<br /><span style={{ fontStyle:"italic", color:C.gold }}>the conviction</span>
            </h2>
          </Reveal>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"36px" }}>
            <FounderCard name="Shivanshu Birla" title="Founding Partner" linkedIn="https://www.linkedin.com/in/shivanshubirla/" delay={0} />
            <FounderCard name="Sanchit Vijay" title="Founding Partner" linkedIn="https://www.linkedin.com/in/sanchitvijay/" delay={0.14} />
          </div>
        </div>
      </section>

      {/* HEAD OF IC COMMITTEE — side-by-side aligned layout */}
      <section className="a-sp-lg" style={{ padding:"108px 48px", background:C.page }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Line style={{ marginBottom:"68px" }} />
          <Reveal><Tag number="04" label="Leadership" /></Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, lineHeight:1.22, marginBottom:"52px" }}>
              Backed by<br /><span style={{ fontStyle:"italic", color:C.gold }}>deep institutional roots</span>
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0", border:"0.5px solid rgba(58,95,138,.08)", background:C.white, overflow:"hidden" }}>
              {/* Left — visual panel */}
              <div className="a-lead-panel" style={{ background:`linear-gradient(145deg,${C.deep} 0%,#0d1635 60%,#162040 100%)`, position:"relative", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"40px 44px", minHeight:"380px" }}>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"96px", fontWeight:300, color:"rgba(200,168,110,.08)", letterSpacing:"6px" }}>PKV</span>
                </div>
                <div style={{ position:"relative", zIndex:2 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"26px", fontWeight:300, color:"rgba(255,255,255,.7)", letterSpacing:"1px" }}>Pavan Kumar Vijay</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:C.gold, marginTop:"6px", opacity:.75 }}>Head of IC Committee</div>
                </div>
              </div>
              {/* Right — text panel */}
              <div className="a-lead-pad" style={{ padding:"48px 44px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", lineHeight:1.9, color:C.light, fontWeight:300, marginBottom:"22px" }}>
                  Makia Capital is backed by <strong style={{ color:C.navy, fontWeight:500 }}>Pavan Kumar Vijay</strong>, Founder of Corporate Professionals — a leading institution in corporate advisory and capital markets.
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", lineHeight:1.9, color:C.light, fontWeight:300, marginBottom:"22px" }}>
                  With 35+ years of experience across merchant banking, IPOs, capital markets, corporate restructuring, and transaction advisory, he has played a defining role in shaping institutional finance practices in India.
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", lineHeight:1.9, color:C.light, fontWeight:300 }}>
                  He previously served as Managing Director of BLB Limited and was among the youngest Presidents of the Institute of Company Secretaries of India (ICSI).
                </p>
                <Line style={{ margin:"28px 0 22px" }} />
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {["Founder, Corporate Professionals","Former MD, BLB Limited","Former President, ICSI"].map((c,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:C.gold, flexShrink:0 }} />
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#3a4f65", fontWeight:400 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ENGAGEMENT PROCESS */}
      <section className="a-sp-lg" style={{ padding:"108px 48px", background:C.white }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Line style={{ marginBottom:"68px" }} />
          <Reveal><Tag number="05" label="Engagement Process" /></Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, marginBottom:"64px", lineHeight:1.22 }}>
              How we work<br /><span style={{ fontStyle:"italic", color:C.gold }}>with founders</span>
            </h2>
          </Reveal>
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
            {[
              { n:"I",   t:"Initial Dialogue",      text:"We begin with an open conversation — understanding your business, ambitions, and readiness for the next phase of growth." },
              { n:"II",  t:"Diligence & Alignment", text:"A rigorous evaluation of your unit economics, governance posture, and the strategic roadmap to your inflection point." },
              { n:"III", t:"Capital & Partnership",  text:"We commit capital and activate our network. IPO readiness, investor positioning, and institutional introductions." },
            ].map((s,i) => (
              <div key={i} style={{ borderRight: i < 2 ? "0.5px solid rgba(58,95,138,.07)" : "none" }}>
                <Reveal delay={i * 0.1}>
                  <div style={{ textAlign:"center", padding:"0 36px" }}>
                    <div style={{ width:"46px", height:"46px", borderRadius:"50%", border:"0.5px solid rgba(200,168,110,.32)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", color:C.gold, fontWeight:300 }}>{s.n}</span>
                    </div>
                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"19px", fontWeight:500, color:C.navy, marginBottom:"12px" }}>{s.t}</h3>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", lineHeight:1.75, color:C.light, fontWeight:300, margin:0 }}>{s.text}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY DISCLOSURES */}
      <section className="a-sp-lg" style={{ padding:"108px 48px", background:C.page }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Line style={{ marginBottom:"68px" }} />
          <Reveal><Tag number="06" label="Key Disclosures" /></Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, color:C.navy, marginBottom:"52px", lineHeight:1.22 }}>
              Regulatory<br /><span style={{ fontStyle:"italic", color:C.gold }}>documentation</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ borderTop:"0.5px solid rgba(58,95,138,.08)" }}>
              <DisclosureRow label="Risk Management Policy"      href="#" />
              <DisclosureRow label="KYC and AML Policy"         href="#" />
              <DisclosureRow label="Conflict of Interest Policy" href="#" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING STATEMENT */}
      <section className="a-sp" style={{ padding:"120px 48px", background:C.navy, position:"relative", overflow:"hidden", textAlign:"center" }}>
        <Line dark style={{ position:"absolute", top:0, left:0 }} />
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.05 }}>
          <div style={{ position:"absolute", left:"20%", top:0, width:"0.5px", height:"100%", background:`linear-gradient(180deg,transparent,${C.steel},transparent)` }} />
          <div style={{ position:"absolute", left:"80%", top:0, width:"0.5px", height:"100%", background:`linear-gradient(180deg,transparent,${C.gold},transparent)` }} />
        </div>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%,rgba(58,95,138,.08) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:2, maxWidth:"680px", margin:"0 auto" }}>
          <Reveal>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"4px", textTransform:"uppercase", color:C.gold, marginBottom:"28px" }}>The Long View</div>
            <h2 className="a-cta-h" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"46px", fontWeight:300, color:"#fff", lineHeight:1.22, marginBottom:"24px" }}>
              We are not just capital.<br /><span style={{ fontStyle:"italic", color:C.gold }}>We are a commitment.</span>
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"15px", color:"rgba(200,215,230,.38)", lineHeight:1.85, fontWeight:300, marginBottom:"48px" }}>
              The most important companies in India's next decade will be built by founders who had the right partners at the right time. We intend to be that partner — not just for a transaction, but for the journey.
            </p>
            <div style={{ width:"64px", height:"1px", background:`linear-gradient(90deg,${C.steel},${C.gold})`, margin:"0 auto 40px" }} />
            <a href="/pitch"
              style={{ display:"inline-block", padding:"13px 46px", border:`0.5px solid ${C.gold}`, color:C.gold, textDecoration:"none", fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", transition:"all .45s", fontWeight:500 }}
              onMouseEnter={e => { e.currentTarget.style.background=`linear-gradient(135deg,${C.steel},${C.gold})`; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="transparent"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.gold; e.currentTarget.style.borderColor=C.gold; }}
            >Pitch to Us</a>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="a-sp" style={{ background:C.navy, padding:"52px 48px 32px", borderTop:"0.5px solid rgba(58,95,138,.1)" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ marginBottom:"32px", paddingBottom:"28px", borderBottom:"0.5px solid rgba(58,95,138,.09)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"8px 40px", marginBottom:"16px" }}>
              {[
                ["Makia Capital Trust",   null],
                ["SEBI Reg No.",           "IN/AIF1/24-25/1666"],
                ["Investment Manager",     "Makia Partners LLP"],
                ["Scored ID",              "AIFN00222"],
              ].map(([k,val],i) => (
                <div key={i}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", color:"rgba(200,215,230,.26)", letterSpacing:".3px" }}>
                    {val ? <>{k}: {val}</> : k}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", lineHeight:1.7, color:"rgba(200,215,230,.18)", maxWidth:"680px" }}>
              Investments in Alternative Investment Funds involve risk. Past performance is not indicative of future results. This material is for informational purposes only and does not constitute an offer or solicitation.
            </p>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
            <a href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
              <img src="/images/logo-white.png" alt="Makia Capital" style={{ height:"30px", width:"auto", opacity:.85 }} />
            </a>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", color:"rgba(200,215,230,.17)", letterSpacing:".5px" }}>
              © 2026 Makia Capital. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
