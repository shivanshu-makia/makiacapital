import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;
const C = { navy: "#0f1a4e", gold: "#c8a86e", light: "#7a8fa6", page: "#f7f9fb", white: "#fff", steel: "#3a5f8a", red: "#c0392b", green: "#27ae60" };

const STATUS_COLORS = {
  new: { bg: "#e8f4fd", text: "#2980b9" },
  reviewed: { bg: "#fef9e7", text: "#f39c12" },
  contacted: { bg: "#eafaf1", text: "#27ae60" },
  qualified: { bg: "#e8f8f5", text: "#1abc9c" },
  rejected: { bg: "#fdedec", text: "#c0392b" },
};

function StatCard({ label, value, color }) {
  return (
    <div data-testid={`stat-${label.toLowerCase()}`} style={{ background: C.white, padding: "24px 20px", borderTop: `3px solid ${color}`, flex: 1, minWidth: 120 }}>
      <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.light, marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 500, color: C.navy }}>{value}</p>
    </div>
  );
}

function LeadRow({ lead, onStatusChange, onExpand, expanded }) {
  const statusOpts = ["new", "reviewed", "contacted", "qualified", "rejected"];
  const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.new;

  return (
    <>
      <tr data-testid={`lead-row-${lead.id}`} onClick={() => onExpand(lead.id)} style={{ cursor: "pointer", background: expanded ? C.page : C.white, transition: "background .2s" }}>
        <td style={tdStyle}><strong style={{ color: C.navy }}>{lead.company}</strong></td>
        <td style={tdStyle}>{lead.name}</td>
        <td style={tdStyle}><a href={`mailto:${lead.email}`} style={{ color: C.steel, textDecoration: "none" }}>{lead.email}</a></td>
        <td style={tdStyle}>{lead.phone}</td>
        <td style={tdStyle}>{lead.sector || "—"}</td>
        <td style={tdStyle}>
          <select data-testid={`status-select-${lead.id}`} value={lead.status}
            onClick={e => e.stopPropagation()}
            onChange={e => { e.stopPropagation(); onStatusChange(lead.id, e.target.value); }}
            style={{ padding: "4px 8px", fontSize: 11, border: `1px solid ${sc.text}30`, background: sc.bg, color: sc.text, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, cursor: "pointer", outline: "none" }}>
            {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </td>
        <td style={tdStyle}>{new Date(lead.created_at).toLocaleDateString()}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} style={{ padding: "16px 20px", background: C.page, borderBottom: `1px solid rgba(58,95,138,.08)` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 13 }}>
              <div><span style={detailLabel}>Website</span><span style={detailVal}>{lead.website || "—"}</span></div>
              <div><span style={detailLabel}>Pitch Mode</span><span style={detailVal}>{lead.pitch_mode}</span></div>
              <div><span style={detailLabel}>Deck</span><span style={detailVal}>{lead.deck_filename || "—"}</span></div>
              <div><span style={detailLabel}>Revenue</span><span style={detailVal}>{lead.revenue ? `INR ${lead.revenue} Cr` : "—"}</span></div>
              <div><span style={detailLabel}>EBITDA</span><span style={detailVal}>{lead.ebitda ? `INR ${lead.ebitda} Cr` : "—"}</span></div>
              <div><span style={detailLabel}>Raise Amount</span><span style={detailVal}>{lead.raise_amount ? `INR ${lead.raise_amount} Cr` : "—"}</span></div>
              <div><span style={detailLabel}>Services</span><span style={detailVal}>{lead.services?.length ? lead.services.join(", ") : "—"}</span></div>
              <div><span style={detailLabel}>FY</span><span style={detailVal}>{lead.fy || "—"}</span></div>
              <div><span style={detailLabel}>Run Rate</span><span style={detailVal}>{lead.run_rate || "—"}</span></div>
              {lead.what_do && <div style={{ gridColumn: "1/-1" }}><span style={detailLabel}>What They Do</span><span style={detailVal}>{lead.what_do}</span></div>}
              {lead.biz_model && <div style={{ gridColumn: "1/-1" }}><span style={detailLabel}>Business Model</span><span style={detailVal}>{lead.biz_model}</span></div>}
              {lead.problem && <div style={{ gridColumn: "1/-1" }}><span style={detailLabel}>Problem Solved</span><span style={detailVal}>{lead.problem}</span></div>}
              {lead.differentiator && <div style={{ gridColumn: "1/-1" }}><span style={detailLabel}>Differentiator</span><span style={detailVal}>{lead.differentiator}</span></div>}
              {lead.notes && <div style={{ gridColumn: "1/-1" }}><span style={detailLabel}>Notes</span><span style={detailVal}>{lead.notes}</span></div>}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const tdStyle = { padding: "12px 14px", fontSize: 13, color: "#2a3a5a", borderBottom: "0.5px solid rgba(58,95,138,.06)", fontWeight: 300 };
const thStyle = { padding: "10px 14px", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.light, fontWeight: 500, textAlign: "left", borderBottom: `1px solid rgba(58,95,138,.1)`, background: C.page };
const detailLabel = { display: "block", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.light, marginBottom: 4 };
const detailVal = { display: "block", color: C.navy, fontWeight: 400 };

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("makia_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${API}/api/auth/me`, { headers: getAuthHeaders(), withCredentials: true });
        setUser(data);
      } catch {
        navigate("/admin/login");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate, getAuthHeaders]);

  const fetchData = useCallback(async () => {
    const headers = getAuthHeaders();
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/leads${filter ? `?status=${filter}` : ""}`, { headers, withCredentials: true }),
        axios.get(`${API}/api/leads/stats/summary`, { headers, withCredentials: true }),
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/admin/login");
    }
  }, [filter, navigate, getAuthHeaders]);

  useEffect(() => { if (user) fetchData(); }, [user, fetchData]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axios.patch(`${API}/api/leads/${leadId}`, { status: newStatus }, { headers: getAuthHeaders(), withCredentials: true });
      fetchData();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem("makia_token");
    localStorage.removeItem("makia_user");
    navigate("/admin/login");
  };

  if (loading) {
    return <div style={{ minHeight: "100vh", background: C.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: C.light }}>Loading...</p>
    </div>;
  }

  return (
    <div data-testid="admin-dashboard" style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", background: C.page }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Admin Nav */}
      <header data-testid="admin-nav" style={{ background: C.navy, padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/images/logo-white.png" alt="Makia Capital" style={{ height: 28 }} />
          </Link>
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.gold, borderLeft: "1px solid rgba(255,255,255,.15)", paddingLeft: 16 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{user?.email}</span>
          <button data-testid="admin-logout-btn" onClick={handleLogout} style={{ background: "none", border: "0.5px solid rgba(255,255,255,.2)", color: "rgba(255,255,255,.6)", padding: "6px 16px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        {stats && (
          <div data-testid="lead-stats" style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
            <StatCard label="Total" value={stats.total} color={C.navy} />
            <StatCard label="New" value={stats.new} color="#2980b9" />
            <StatCard label="Reviewed" value={stats.reviewed} color="#f39c12" />
            <StatCard label="Contacted" value={stats.contacted} color="#27ae60" />
            <StatCard label="Qualified" value={stats.qualified} color="#1abc9c" />
            <StatCard label="Rejected" value={stats.rejected} color="#c0392b" />
          </div>
        )}

        {/* Filter + Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: C.navy }}>
            Lead Submissions
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {["", "new", "reviewed", "contacted", "qualified", "rejected"].map(f => (
              <button key={f} data-testid={`filter-${f || "all"}`} onClick={() => setFilter(f)}
                style={{ padding: "6px 14px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", border: `0.5px solid ${filter === f ? C.gold : "rgba(58,95,138,.12)"}`, background: filter === f ? `${C.gold}10` : C.white, color: filter === f ? C.gold : C.light, cursor: "pointer" }}>
                {f || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: C.white, border: "0.5px solid rgba(58,95,138,.08)", overflowX: "auto" }}>
          <table data-testid="leads-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Sector</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.light, fontSize: 14 }}>No leads found{filter ? ` with status "${filter}"` : ""}.</td></tr>
              ) : leads.map(lead => (
                <LeadRow key={lead.id} lead={lead} onStatusChange={handleStatusChange} onExpand={id => setExpandedId(expandedId === id ? null : id)} expanded={expandedId === lead.id} />
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 11, color: C.light, marginTop: 16, textAlign: "right" }}>{leads.length} lead{leads.length !== 1 ? "s" : ""} shown</p>
      </div>
    </div>
  );
}
