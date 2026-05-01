import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POSTS, GEO_ITEMS, INSIGHTS_COLORS as C, TYPE_COLORS } from "../data/insightsData";

function useInView() {
  const ref = useRef(null), [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.07 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return [ref, v];
}

function Fade({ children, delay = 0 }) {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(18px)", transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms` }}>{children}</div>;
}

function Pill({ type }) {
  return <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: TYPE_COLORS[type], borderLeft: `2px solid ${TYPE_COLORS[type]}`, paddingLeft: 9 }}>{type}</span>;
}

function DataTable({ heading, headers, rows, note }) {
  return (
    <div style={{ marginBottom: 44 }}>
      {heading && <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 400, color: C.navy, marginBottom: 14, paddingBottom: 10, borderBottom: `0.5px solid ${C.line}` }}>{heading}</h2>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.navy }}>
              {headers.map(h => <th key={h} style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,.7)", padding: "11px 13px", textAlign: "left", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? C.white : C.page }}>
                {row.map((cell, ci) => {
                  const neg = cell.startsWith("\u2013") || cell.startsWith("-");
                  const pos = cell.startsWith("+");
                  return <td key={ci} style={{ fontFamily: "DM Sans,sans-serif", fontSize: 12, color: neg ? C.red : pos ? "#27ae60" : C.navy, padding: "11px 13px", border: `0.5px solid ${C.line}`, fontWeight: neg || pos ? 500 : 300 }}>{cell}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.light, lineHeight: 1.6, marginTop: 8, fontStyle: "italic" }}>{note}</p>}
    </div>
  );
}

function GeoGrid() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 400, color: C.navy, marginBottom: 6, paddingBottom: 10, borderBottom: `0.5px solid ${C.line}` }}>Global & Geopolitical Developments — March 2026</h2>
      <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.light, marginBottom: 16 }}>Tap any item to expand the India impact.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.line }} className="i-geo-grid">
        {GEO_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} onClick={() => setOpen(isOpen ? null : i)} style={{ background: isOpen ? C.navy : C.white, cursor: "pointer", padding: "16px 18px", transition: "background .2s" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 13, color: isOpen ? C.gold : C.light, flexShrink: 0, minWidth: 22 }}>{item.n}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: 500, color: isOpen ? C.white : C.navy, lineHeight: 1.4, marginBottom: isOpen ? 8 : 0 }}>{item.title}</p>
                  {isOpen && <>
                    <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.6, marginBottom: 8, fontWeight: 300 }}>{item.body}</p>
                    <div style={{ borderTop: "0.5px solid rgba(255,255,255,.15)", paddingTop: 8, display: "flex", gap: 8 }}>
                      <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: C.gold, flexShrink: 0, marginTop: 2 }}>India</span>
                      <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.gold, lineHeight: 1.5, fontWeight: 300 }}>{item.india}</p>
                    </div>
                  </>}
                </div>
                <span style={{ color: isOpen ? "rgba(255,255,255,.4)" : C.light, fontSize: 18, transition: "transform .2s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PitchBlock() {
  return (
    <div className="i-pitch-block" style={{ margin: "44px 0", background: C.navy, padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
      <div>
        <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>Building Something?</p>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 300, color: C.white, lineHeight: 1.3, maxWidth: 400 }}>If this research speaks to the market you're building in — <em style={{ color: C.gold }}>we'd like to hear from you.</em></h3>
      </div>
      <div>
        <Link to="/pitch" data-testid="insights-pitch-cta" style={{ display: "block", fontFamily: "DM Sans,sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.navy, background: C.gold, padding: "13px 26px", textDecoration: "none", fontWeight: 500, marginBottom: 8 }}>Pitch to Makia →</Link>
        <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, color: "rgba(255,255,255,.3)" }}>We reply to every submission — even if it's a no.</p>
      </div>
    </div>
  );
}

function renderBlock(b, i) {
  switch (b.kind) {
    case "table": return <DataTable key={i} heading={b.heading} headers={b.headers} rows={b.rows} note={b.note} />;
    case "geo":   return <GeoGrid key={i} />;
    case "pitch": return <PitchBlock key={i} />;
    case "case":
    case "text":  return (
      <div key={i} style={{ marginBottom: 40 }}>
        {b.heading && <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 400, color: C.navy, marginBottom: 14, paddingBottom: 10, borderBottom: `0.5px solid ${C.line}` }}>{b.heading}</h2>}
        {b.kind === "case" && <div style={{ background: C.page, borderTop: `2px solid ${C.gold}`, border: `0.5px solid ${C.line}`, padding: "6px 14px", marginBottom: 12, display: "inline-block" }}><span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>Case Study</span></div>}
        {b.text && b.text.split("\n\n").map((p, pi) => <p key={pi} style={{ fontFamily: "DM Sans,sans-serif", fontSize: 15, color: "#2a3a5a", lineHeight: 1.8, fontWeight: 300, marginBottom: 14 }}>{p}</p>)}
        {b.callout && <div style={{ borderLeft: `3px solid ${C.gold}`, padding: "16px 20px", margin: "20px 0", background: C.goldBg }}><p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 19, fontStyle: "italic", color: C.navy, lineHeight: 1.5 }}>{b.callout}</p></div>}
      </div>
    );
    case "bullets": return (
      <div key={i} style={{ marginBottom: 40 }}>
        {b.heading && <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 400, color: C.navy, marginBottom: 14, paddingBottom: 10, borderBottom: `0.5px solid ${C.line}` }}>{b.heading}</h2>}
        {b.bullets.map((bl, bi) => <div key={bi} style={{ display: "flex", gap: 14, marginBottom: 16 }}><span style={{ color: C.gold, fontFamily: "Cormorant Garamond,serif", fontSize: 18, flexShrink: 0, marginTop: 2 }}>—</span><p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 15, color: "#2a3a5a", lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{bl}</p></div>)}
      </div>
    );
    case "disclaimer": return (
      <div key={i} style={{ marginTop: 40, borderTop: `0.5px solid ${C.line}`, paddingTop: 20 }}>
        <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.light, lineHeight: 1.65, fontStyle: "italic" }}>This document is prepared by Makia Capital (Makia Partners LLP) for informational purposes only and does not constitute investment advice. SEBI Reg. AIF – IN/AIF1/24-25/1666.</p>
      </div>
    );
    default: return null;
  }
}

function Card({ post, onClick, i }) {
  const [hov, setHov] = useState(false);
  return (
    <Fade delay={i * 70}>
      <div data-testid={`insight-card-${post.id}`} onClick={() => onClick(post)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        className="i-card-grid" style={{ borderTop: `0.5px solid ${C.line}`, padding: "28px 0", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <Pill type={post.type} />
            <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.light }}>{post.date} · {post.readTime} read</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 23, fontWeight: 400, color: hov ? C.gold : C.navy, lineHeight: 1.25, marginBottom: 10, transition: "color .2s", maxWidth: 680 }}>{post.title}</h2>
          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 13, color: C.light, lineHeight: 1.7, fontWeight: 300, maxWidth: 640 }}>{post.excerpt}</p>
          <div style={{ display: "flex", gap: 7, marginTop: 12, flexWrap: "wrap" }}>
            {post.tags.map(t => <span key={t} style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: C.light, border: `0.5px solid ${C.line}`, padding: "4px 10px" }}>{t}</span>)}
          </div>
        </div>
        <span style={{ color: hov ? C.gold : C.steel, fontFamily: "DM Sans,sans-serif", fontSize: 13, transition: "color .2s", whiteSpace: "nowrap" }}>Read →</span>
      </div>
    </Fade>
  );
}

function BlogCard({ post, i }) {
  const [hov, setHov] = useState(false);
  const nav = useNavigate();
  return (
    <Fade delay={i * 70}>
      <div data-testid={`blog-card-${post.slug}`} onClick={() => nav(`/insights/${post.slug}`)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        className="i-card-grid" style={{ borderTop: `0.5px solid ${C.line}`, padding: "28px 0", cursor: "pointer", display: "grid", gridTemplateColumns: post.coverImage ? "120px 1fr auto" : "1fr auto", gap: 24, alignItems: "start" }}>
        {post.coverImage && <div style={{ width: 120, height: 80, background: `url(${post.coverImage}) center/cover no-repeat`, borderRadius: 2, flexShrink: 0 }} />}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.steel, borderLeft: `2px solid ${C.steel}`, paddingLeft: 9 }}>{post.category}</span>
            <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.light }}>{post.date}</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 23, fontWeight: 400, color: hov ? C.gold : C.navy, lineHeight: 1.25, marginBottom: 10, transition: "color .2s", maxWidth: 680 }}>{post.title}</h2>
          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 13, color: C.light, lineHeight: 1.7, fontWeight: 300, maxWidth: 640 }}>{post.excerpt}</p>
          <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: C.light, border: `0.5px solid ${C.line}`, padding: "4px 10px", display: "inline-block", marginTop: 10 }}>{post.author}</span>
        </div>
        <span style={{ color: hov ? C.gold : C.steel, fontFamily: "DM Sans,sans-serif", fontSize: 13, transition: "color .2s", whiteSpace: "nowrap" }}>Read →</span>
      </div>
    </Fade>
  );
}

function InsightNav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setSolid(window.scrollY > 40); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  const LOGO_DARK = "/images/makia_hero.png";
  const navLinks = [{ l: "Home", h: "/" }, { l: "About Us", h: "/about" }, { l: "Insights", h: "/insights" }];

  return (
    <>
      <style>{`
        @media(max-width:768px){
          .i-nav{padding:0 16px!important}
          .i-nav-links{display:none!important}
          .i-mob-btn{display:flex!important}
          .i-sp{padding-left:20px!important;padding-right:20px!important}
          .i-card-grid{grid-template-columns:1fr!important}
          .i-stat-grid{grid-template-columns:repeat(2,1fr)!important}
          .i-geo-grid{grid-template-columns:1fr!important}
          .i-pitch-block{flex-direction:column!important;padding:28px 24px!important;text-align:center}
          .i-tabs{overflow-x:auto!important;justify-content:flex-start!important;-webkit-overflow-scrolling:touch}
          .i-tabs button{padding:11px 14px!important;font-size:10px!important;white-space:nowrap}
          .i-footer-sub{flex-direction:column!important;gap:8px!important;text-align:center}
          .i-detail-body{padding:40px 20px 60px!important}
          .i-hero-h{font-size:clamp(28px,4.5vw,44px)!important}
        }
        @media(min-width:769px){.i-mob-btn{display:none!important}}
      `}</style>
      {menuOpen && <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100vh", background:"rgba(15,26,78,1)", zIndex:999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"32px" }} onClick={()=>setMenuOpen(false)}>
        {navLinks.map(n=><Link key={n.l} to={n.h} style={{ color:"#fff", textDecoration:"none", fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:300, letterSpacing:"2px" }}>{n.l}</Link>)}
        <Link to="/pitch" style={{color:C.gold, textDecoration:"none", fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:300, letterSpacing:"2px"}}>Pitch to Us</Link>
      </div>}
      <header data-testid="insights-nav" className="i-nav" style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 500, padding: "0 48px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .4s", background: "rgba(247,249,251,.97)", backdropFilter: "blur(20px)", borderBottom: "0.5px solid rgba(58,95,138,.08)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={LOGO_DARK} alt="Makia Capital" style={{ height: "34px", width: "auto" }} />
        </Link>
        <nav className="i-nav-links" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {navLinks.map(n => <Link key={n.l} to={n.h} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: n.l === "Insights" ? C.gold : C.light, textDecoration: "none", fontWeight: 400, borderBottom: n.l === "Insights" ? `1px solid ${C.gold}` : "1px solid transparent", paddingBottom: 2 }}>{n.l}</Link>)}
          <Link to="/pitch" style={{ padding: "8px 20px", border: `0.5px solid ${C.gold}`, color: C.gold, textDecoration: "none", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>Pitch to Us</Link>
        </nav>
        <button className="i-mob-btn" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px", display:"none" }}>
          <div style={{ width:"24px", display:"flex", flexDirection:"column", gap:"5px" }}>
            <span style={{ height:"1px", background:C.navy, display:"block" }} />
            <span style={{ height:"1px", background:C.navy, display:"block", width:"16px", marginLeft:"auto" }} />
          </div>
        </button>
      </header>
    </>
  );
}

function InsightFooter() {
  const [em, setEm] = useState(""), [done, setDone] = useState(false);
  return (
    <footer data-testid="insights-footer" style={{ background: C.navy }}>
      <div style={{ padding: "64px 5%", borderBottom: "0.5px solid rgba(255,255,255,.07)", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 14 }}>Stay in the loop</p>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 300, color: C.white, lineHeight: 1.2, marginBottom: 10 }}>Makia's research and insights, <em style={{ color: C.gold }}>in your inbox.</em></h3>
          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 12, color: "rgba(255,255,255,.33)", marginBottom: 24, fontWeight: 300 }}>Weekly dispatches · Monthly deep-dives · Unsubscribe anytime</p>
          {done ? <p style={{ color: C.gold, fontFamily: "DM Sans,sans-serif", fontSize: 14, padding: "16px 0" }}>You're in. Welcome to the Makia network.</p> : (
            <div style={{ display: "flex", maxWidth: 380, margin: "0 auto" }}>
              <input data-testid="newsletter-email-input" type="email" placeholder="your@email.com" value={em} onChange={e => setEm(e.target.value)} style={{ flex: 1, padding: "13px 16px", background: "rgba(255,255,255,.07)", border: "0.5px solid rgba(255,255,255,.14)", borderRight: "none", color: C.white, fontFamily: "DM Sans,sans-serif", fontSize: 13, outline: "none" }} />
              <button data-testid="newsletter-subscribe-btn" onClick={() => em && setDone(true)} style={{ padding: "13px 20px", background: C.gold, border: "none", color: C.navy, fontFamily: "DM Sans,sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}>Subscribe</button>
            </div>
          )}
        </div>
      </div>
      <div className="i-footer-sub" style={{ padding: "24px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/images/logo-white.png" alt="Makia Capital" style={{ height: "28px", width: "auto", opacity: 0.85 }} />
        </Link>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[{l:"Home",h:"/"},{l:"About",h:"/about"},{l:"Insights",h:"/insights"},{l:"Pitch to Us",h:"/pitch"}].map(n => (
            <Link key={n.l} to={n.h} style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 1, color: "rgba(255,255,255,.3)", textDecoration: "none", textTransform: "uppercase" }}>{n.l}</Link>
          ))}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, color: "rgba(255,255,255,.18)", lineHeight: 1.7 }}>&copy; 2026 Makia Capital (Makia Partners LLP)</p>
          <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, color: "rgba(255,255,255,.18)" }}>SEBI Reg. AIF – IN/AIF1/24-25/1666</p>
        </div>
      </div>
    </footer>
  );
}

function List({ onOpen }) {
  const [tab, setTab] = useState("All");
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetch("/content/blog-index.json")
      .then(r => r.json())
      .then(posts => setBlogPosts(posts.filter(p => p.published)))
      .catch(() => {});
  }, []);

  const richSorted = [...POSTS].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  const richShown = tab === "All" || tab !== "Blog" ? (tab === "All" ? richSorted : richSorted.filter(p => p.type === tab)) : [];
  const blogsShown = tab === "All" || tab === "Blog" ? blogPosts : [];

  // Merge and sort all items by date
  const allItems = [
    ...richShown.map(p => ({ kind: "rich", data: p, date: p.isoDate })),
    ...blogsShown.map(p => ({ kind: "blog", data: p, date: p.date })),
  ].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return (
    <>
      <section data-testid="insights-hero" className="i-sp" style={{ paddingTop: 132, paddingBottom: 60, background: C.white, borderBottom: `0.5px solid ${C.line}`, textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 5%" }}>
          <Fade><p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 18 }}>Knowledge & Research</p></Fade>
          <Fade delay={80}><h1 className="i-hero-h" style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 300, color: C.navy, lineHeight: 1.12, marginBottom: 20 }}>Insights from<br /><em style={{ color: C.gold }}>the Makia desk.</em></h1></Fade>
          <Fade delay={150}><p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 15, color: C.light, lineHeight: 1.75, fontWeight: 300, maxWidth: 480, margin: "0 auto" }}>Market intelligence, capital markets research, and original thinking on India's investment landscape.</p></Fade>
          <Fade delay={220}>
            <div data-testid="insights-tabs" className="i-tabs" style={{ display: "flex", justifyContent: "center", marginTop: 48, borderBottom: `0.5px solid ${C.line}` }}>
              {["All","Newsletter","Research","Blog"].map(t => (
                <button key={t} data-testid={`tab-${t.toLowerCase()}`} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: tab === t ? C.navy : C.light, padding: "11px 22px", borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent", marginBottom: -0.5, transition: "all .2s" }}>{t}</button>
              ))}
            </div>
          </Fade>
        </div>
      </section>
      <section data-testid="insights-list" className="i-sp" style={{ background: C.white, padding: "0 5%" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {allItems.map((item, i) =>
            item.kind === "rich"
              ? <Card key={item.data.id} post={item.data} onClick={onOpen} i={i} />
              : <BlogCard key={item.data.slug} post={item.data} i={i} />
          )}
          <div style={{ borderTop: `0.5px solid ${C.line}` }} />
        </div>
      </section>
      <div style={{ height: 80, background: C.white }} />
    </>
  );
}

function Detail({ post, onBack }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  const stats = (post.keyStats || []).filter(s => s.value);
  const cols = Math.min(stats.length, 3);
  return (
    <>
      <section data-testid="insight-detail-hero" style={{ paddingTop: 100, paddingBottom: 52, background: C.white, borderBottom: `0.5px solid ${C.line}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 5%", textAlign: "center" }}>
          <Fade>
            <button data-testid="back-to-insights-btn" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.light, marginBottom: 36, display: "inline-flex", alignItems: "center", gap: 6 }}>&larr; Back to Insights</button>
          </Fade>
          <Fade delay={60}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
              <Pill type={post.type} />
              <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.light }}>{post.label} · {post.date} · {post.readTime} read</span>
            </div>
          </Fade>
          <Fade delay={110}><h1 data-testid="insight-detail-title" style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, color: C.navy, lineHeight: 1.18, marginBottom: 18 }}>{post.title}</h1></Fade>
          <Fade delay={170}><p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 14, color: C.light, lineHeight: 1.75, fontWeight: 300, maxWidth: 560, margin: "0 auto 24px" }}>{post.excerpt}</p></Fade>
          <Fade delay={210}><div style={{ display: "flex", justifyContent: "center", gap: 7, flexWrap: "wrap" }}>{post.tags.map(t => <span key={t} style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: C.light, border: `0.5px solid ${C.line}`, padding: "4px 10px" }}>{t}</span>)}</div></Fade>
        </div>
      </section>

      {stats.length > 0 && (
        <div data-testid="insight-key-stats" className="i-stat-grid" style={{ background: C.navy, display: "grid", gridTemplateColumns: `repeat(${cols},1fr)` }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: C.navy, padding: "26px 20px", textAlign: "center", borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,.08)" : "none" }}>
              <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 7 }}>{s.label}</p>
              <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 500, color: C.gold, lineHeight: 1, marginBottom: 5 }}>{s.value}</p>
              <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: "rgba(255,255,255,.33)", fontWeight: 300 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      <article data-testid="insight-detail-body" className="i-detail-body" style={{ background: C.white, padding: "60px 5% 80px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {post.body.map((b, i) => renderBlock(b, i))}
        </div>
      </article>

      <div style={{ background: C.page, padding: "44px 5%", borderTop: `0.5px solid ${C.line}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.light, marginBottom: 5 }}>Continue reading</p>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: C.navy, fontWeight: 300 }}>More from the Makia desk</p>
          </div>
          <button data-testid="all-insights-btn" onClick={onBack} style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.white, background: C.navy, padding: "12px 26px", border: "none", cursor: "pointer" }}>&larr; All Insights</button>
        </div>
      </div>
    </>
  );
}

export default function InsightsPage() {
  const [post, setPost] = useState(null);
  const open = p => { setPost(p); window.scrollTo({ top: 0 }); };
  const back = () => { setPost(null); window.scrollTo({ top: 0 }); };

  return (
    <div data-testid="insights-page" style={{ background: C.page, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`}</style>
      <InsightNav />
      {!post ? <List onOpen={open} /> : <Detail post={post} onBack={back} />}
      <InsightFooter />
    </div>
  );
}
