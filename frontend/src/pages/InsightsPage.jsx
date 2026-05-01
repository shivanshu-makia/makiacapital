import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POSTS, INSIGHTS_COLORS as C, TYPE_COLORS } from "../data/insightsData";

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

function Card({ post, i }) {
  const [hov, setHov] = useState(false);
  const nav = useNavigate();
  return (
    <Fade delay={i * 70}>
      <div data-testid={`insight-card-${post.id}`} onClick={() => nav(`/insights/${post.slug}`)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
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

function List() {
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
              ? <Card key={item.data.id} post={item.data} i={i} />
              : <BlogCard key={item.data.slug} post={item.data} i={i} />
          )}
          <div style={{ borderTop: `0.5px solid ${C.line}` }} />
        </div>
      </section>
      <div style={{ height: 80, background: C.white }} />
    </>
  );
}

export default function InsightsPage() {
  return (
    <div data-testid="insights-page" style={{ background: C.page, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`}</style>
      <InsightNav />
      <List />
      <InsightFooter />
    </div>
  );
}
