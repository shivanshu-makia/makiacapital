import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const C = {
  navy: "#0f1a4e", steel: "#3a5f8a", light: "#7a8fa6", gold: "#c8a86e",
  page: "#f7f9fb", white: "#fff", line: "rgba(15,26,78,0.09)",
};

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

function BlogNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [{ l: "Home", h: "/" }, { l: "About Us", h: "/about" }, { l: "Insights", h: "/insights" }];

  return (
    <>
      <style>{`
        @media(max-width:768px){
          .bn-nav{padding:0 16px!important}
          .bn-links{display:none!important}
          .bn-mob{display:flex!important}
        }
        @media(min-width:769px){.bn-mob{display:none!important}}
      `}</style>
      {menuOpen && <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100vh", background:"rgba(15,26,78,1)", zIndex:999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"32px" }} onClick={()=>setMenuOpen(false)}>
        {navLinks.map(n=><Link key={n.l} to={n.h} style={{ color:"#fff", textDecoration:"none", fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:300, letterSpacing:"2px" }}>{n.l}</Link>)}
        <Link to="/pitch" style={{color:C.gold, textDecoration:"none", fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:300, letterSpacing:"2px"}}>Pitch to Us</Link>
      </div>}
      <header data-testid="blog-nav" className="bn-nav" style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 500, padding: "0 48px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(247,249,251,.97)", backdropFilter: "blur(20px)", borderBottom: "0.5px solid rgba(58,95,138,.08)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/images/makia_hero.png" alt="Makia Capital" style={{ height: "34px", width: "auto" }} />
        </Link>
        <nav className="bn-links" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {navLinks.map(n => <Link key={n.l} to={n.h} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: n.l === "Insights" ? C.gold : C.light, textDecoration: "none", fontWeight: 400, borderBottom: n.l === "Insights" ? `1px solid ${C.gold}` : "1px solid transparent", paddingBottom: 2 }}>{n.l}</Link>)}
          <Link to="/pitch" style={{ padding: "8px 20px", border: `0.5px solid ${C.gold}`, color: C.gold, textDecoration: "none", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>Pitch to Us</Link>
        </nav>
        <button className="bn-mob" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px", display:"none" }}>
          <div style={{ width:"24px", display:"flex", flexDirection:"column", gap:"5px" }}>
            <span style={{ height:"1px", background:C.navy, display:"block" }} />
            <span style={{ height:"1px", background:C.navy, display:"block", width:"16px", marginLeft:"auto" }} />
          </div>
        </button>
      </header>
    </>
  );
}

const mdComponents = {
  h1: ({ children }) => <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 400, color: C.navy, margin: "40px 0 16px", lineHeight: 1.25 }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 400, color: C.navy, margin: "36px 0 14px", paddingBottom: 10, borderBottom: `0.5px solid ${C.line}`, lineHeight: 1.3 }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 500, color: C.navy, margin: "28px 0 10px", lineHeight: 1.35 }}>{children}</h3>,
  p: ({ children }) => <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#2a3a5a", lineHeight: 1.85, fontWeight: 300, margin: "0 0 18px" }}>{children}</p>,
  blockquote: ({ children }) => <div style={{ borderLeft: `3px solid ${C.gold}`, padding: "16px 24px", margin: "28px 0", background: "rgba(200,168,110,0.06)" }}><div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontStyle: "italic", color: C.navy, lineHeight: 1.5 }}>{children}</div></div>,
  ul: ({ children }) => <ul style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#2a3a5a", lineHeight: 1.85, fontWeight: 300, margin: "0 0 18px", paddingLeft: 24 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#2a3a5a", lineHeight: 1.85, fontWeight: 300, margin: "0 0 18px", paddingLeft: 24 }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 8 }}>{children}</li>,
  strong: ({ children }) => <strong style={{ fontWeight: 500, color: C.navy }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: "italic", color: C.steel }}>{children}</em>,
  hr: () => <hr style={{ border: "none", borderTop: `0.5px solid ${C.line}`, margin: "32px 0" }} />,
  a: ({ href, children }) => <a href={href} style={{ color: C.steel, textDecoration: "underline", textUnderlineOffset: "3px" }}>{children}</a>,
  table: ({ children }) => <div style={{ overflowX: "auto", margin: "20px 0" }}><table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>{children}</table></div>,
  th: ({ children }) => <th style={{ background: C.navy, color: "rgba(255,255,255,.7)", padding: "10px 14px", textAlign: "left", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: "10px 14px", border: `0.5px solid ${C.line}`, color: C.navy }}>{children}</td>,
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const meta = {};
  match[1].split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val === "true") val = true;
      else if (val === "false") val = false;
      meta[key] = val;
    }
  });
  return { meta, content: match[2] };
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetch(`/content/blogs/${slug}.md`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.text(); })
      .then(raw => {
        const { meta, content } = parseFrontmatter(raw);
        setPost({ ...meta, content });
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) return <div style={{ minHeight: "100vh", background: C.page, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.light, fontSize: 14 }}>Loading...</p></div>;
  if (error || !post) return <div style={{ minHeight: "100vh", background: C.page, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}><p style={{ color: C.navy, fontSize: 18, fontFamily: "Cormorant Garamond,serif" }}>Post not found</p><Link to="/insights" style={{ color: C.gold, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase" }}>&larr; Back to Insights</Link></div>;

  return (
    <div data-testid="blog-post-page" style={{ background: C.page, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        @media(max-width:768px){.bp-hero{padding:100px 20px 40px!important}.bp-cover{height:280px!important}.bp-body{padding:32px 20px 60px!important}.bp-title{font-size:28px!important}}
      `}</style>
      <BlogNav />

      {/* Cover Image */}
      {post.coverImage && (
        <div className="bp-cover" style={{ width: "100%", height: 400, background: `url(${post.coverImage}) center/cover no-repeat`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,26,78,.1), rgba(15,26,78,.5))" }} />
        </div>
      )}

      {/* Hero */}
      <section className="bp-hero" data-testid="blog-hero" style={{ padding: post.coverImage ? "48px 5% 40px" : "120px 5% 40px", background: C.white, borderBottom: `0.5px solid ${C.line}`, textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Fade>
            <Link to="/insights" data-testid="back-to-insights" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.light, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>&larr; Back to Insights</Link>
          </Fade>
          <Fade delay={60}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.steel, borderLeft: `2px solid ${C.steel}`, paddingLeft: 9 }}>{post.category}</span>
              <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, color: C.light }}>{post.date}</span>
            </div>
          </Fade>
          <Fade delay={110}>
            <h1 className="bp-title" data-testid="blog-post-title" style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 40, fontWeight: 300, color: C.navy, lineHeight: 1.2, marginBottom: 16 }}>{post.title}</h1>
          </Fade>
          <Fade delay={160}>
            <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 14, color: C.light, lineHeight: 1.7, fontWeight: 300, maxWidth: 560, margin: "0 auto" }}>{post.excerpt}</p>
          </Fade>
        </div>
      </section>

      {/* Body */}
      <article className="bp-body" data-testid="blog-post-body" style={{ background: C.white, padding: "52px 5% 80px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {post.content}
          </ReactMarkdown>

          {/* Author */}
          <div style={{ marginTop: 48, paddingTop: 28, borderTop: `0.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.gold, fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 500 }}>{(post.author || "M")[0]}</span>
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: C.navy, margin: 0 }}>{post.author}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.light, margin: 0 }}>Makia Capital</p>
            </div>
          </div>
        </div>
      </article>

      {/* Back bar */}
      <div style={{ background: C.page, padding: "40px 5%", borderTop: `0.5px solid ${C.line}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.light, marginBottom: 5 }}>Continue reading</p>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: C.navy, fontWeight: 300 }}>More from the Makia desk</p>
          </div>
          <Link to="/insights" data-testid="all-insights-link" style={{ fontFamily: "DM Sans,sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.white, background: C.navy, padding: "12px 26px", textDecoration: "none" }}>&larr; All Insights</Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: C.navy, padding: "24px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/images/logo-white.png" alt="Makia Capital" style={{ height: 24, opacity: 0.85 }} />
        </Link>
        <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: 10, color: "rgba(255,255,255,.18)" }}>&copy; 2026 Makia Capital (Makia Partners LLP) · SEBI Reg. AIF – IN/AIF1/24-25/1666</p>
      </footer>
    </div>
  );
}
