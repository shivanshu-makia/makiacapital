import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;
const C = { navy: "#0f1a4e", gold: "#c8a86e", light: "#7a8fa6", page: "#f7f9fb", white: "#fff", steel: "#3a5f8a" };

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, { email, password }, { withCredentials: true });
      localStorage.setItem("makia_token", data.token);
      localStorage.setItem("makia_user", JSON.stringify(data));
      navigate("/admin");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") setError(detail);
      else if (Array.isArray(detail)) setError(detail.map(e => e.msg || JSON.stringify(e)).join(" "));
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page" style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ width: "100%", maxWidth: 400, padding: "48px 40px", background: C.white, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", background: `linear-gradient(90deg, ${C.steel}, ${C.gold})` }} />
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src="/images/makia_hero.png" alt="Makia Capital" style={{ height: 36, marginBottom: 20 }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: C.navy, marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: C.light, fontWeight: 300 }}>Sign in to manage leads & insights</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.light, display: "block", marginBottom: 6 }}>Email</label>
            <input data-testid="admin-email-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: "100%", padding: "12px 14px", border: `0.5px solid rgba(58,95,138,.15)`, fontSize: 14, color: C.navy, outline: "none", boxSizing: "border-box" }}
              placeholder="admin@makiacapital.com" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.light, display: "block", marginBottom: 6 }}>Password</label>
            <input data-testid="admin-password-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: "100%", padding: "12px 14px", border: `0.5px solid rgba(58,95,138,.15)`, fontSize: 14, color: C.navy, outline: "none", boxSizing: "border-box" }}
              placeholder="Enter password" />
          </div>

          {error && <p data-testid="login-error" style={{ fontSize: 13, color: "#c0392b", marginBottom: 16, textAlign: "center" }}>{error}</p>}

          <button data-testid="admin-login-btn" type="submit" disabled={loading}
            style={{ width: "100%", padding: "13px", background: loading ? C.light : C.navy, color: C.white, border: "none", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: "center", borderTop: `0.5px solid rgba(58,95,138,.08)`, paddingTop: 20 }}>
          <a href="/" style={{ fontSize: 12, color: C.light, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>&larr; Back to Website</a>
        </div>
      </div>
    </div>
  );
}
