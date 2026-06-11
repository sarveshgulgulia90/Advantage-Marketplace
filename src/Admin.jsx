import { useState, useEffect } from "react";

const NAVY = "#0B1F5E";
const RED = "#CC1A1A";
const ADMIN_PASSWORD = "advantage";
const STORAGE_KEY = "advantage_products";

const CATS = ["Laptops", "Desktops", "Printers", "Accessories"];
const ICONS = ["💻", "🖥️", "🖨️", "⌨️", "🖱️", "💾", "🔌", "📱"];

const SPEC_KEYS = {
  Laptops: ["Processor", "RAM", "Storage", "Display", "Graphics", "Operating System", "Battery", "Ports", "Connectivity", "Weight", "Warranty"],
  Desktops: ["Processor", "RAM", "Storage", "Form Factor", "Graphics", "Operating System", "Ports", "Optical Drive", "Connectivity", "Warranty"],
  Printers: ["Type", "Print Technology", "Print Speed", "Print Resolution", "Connectivity", "Scanner", "Paper Size", "Ink / Toner", "Page Yield", "Warranty"],
  Accessories: ["Type", "Connectivity", "Compatibility", "Interface", "Dimensions", "Weight", "Warranty"],
};

const EMPTY_FORM = {
  name: "", 
  cat: "Laptops", 
  price: "", 
  icon: "💻", 
  isNew: false,
  image: "",
  spec: "",
  specs: {},
  highlights: ["", "", "", ""],
};

/* Helpers */
function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveProducts(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* PcPriceRow */
function PcPriceRow({ item, category, saveMsg, onSave, onDelete }) {
  const [price, setPrice] = useState(item.price || 0);
  const [inStock, setInStock] = useState(item.inStock !== false);
  const updated = item.updatedAt
    ? Math.floor((Date.now() - new Date(item.updatedAt)) / (1000 * 60 * 60 * 24)) + " days ago"
    : "—";

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      <td style={{ padding: "10px 14px", fontSize: 13, color: NAVY, fontWeight: 500 }}>{item.name}</td>
      <td style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 13, color: "#555" }}>₹</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ border: "1px solid #ddd", padding: "6px 8px", fontSize: 13, width: 90, outline: "none" }}
          />
        </div>
      </td>
      <td style={{ padding: "10px 14px" }}>
        <button
          onClick={() => setInStock((s) => !s)}
          style={{
            background: inStock ? "#dcfce7" : "#fff0f0",
            color: inStock ? "#16a34a" : RED,
            border: `1px solid ${inStock ? "#86efac" : "#fecaca"}`,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {inStock ? "✓ In Stock" : "✗ Out"}
        </button>
      </td>
      <td style={{ padding: "10px 14px", fontSize: 11, color: "#aaa" }}>{updated}</td>
      <td style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onSave(price, inStock)}
            style={{ background: NAVY, color: "#fff", border: "none", padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            {saveMsg || "Save"}
          </button>
          <button
            onClick={() => window.confirm(`Delete ${item.name}?`) && onDelete(category, item.componentId)}
            style={{ background: "#fff0f0", color: RED, border: "1px solid #fecaca", padding: "5px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

/* Seed Banner */
function SeedBanner({ products }) {
  const [status, setStatus] = useState(null);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = import.meta.env.VITE_ADMIN_TOKEN || "advantage_admin_secret_2025";

  async function seed() {
    setStatus("loading");
    try {
      const res = await fetch(`${API}/products/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(products),
      });
      const data = await res.json();
      setStatus(res.ok ? "done" : data.error?.includes("already") ? "exists" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div style={{ background: "#dcfce7", border: "1px solid #86efac", padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
        <span style={{ color: "#16a34a", fontSize: 18 }}>✓</span>
        <span style={{ fontWeight: 600, color: "#15803d" }}>Products seeded to MongoDB successfully!</span>
      </div>
    );
  }

  if (status === "exists") {
    return (
      <div style={{ background: "#fef9c3", border: "1px solid #fde047", padding: "14px 20px", marginBottom: 24, fontSize: 13, fontWeight: 500, color: "#854d0e" }}>
        ⚠️ Products already exist in the database. Delete all first if you want to re-seed.
      </div>
    );
  }

  return (
    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: NAVY }}>First time setup — Seed products to MongoDB</div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>This pushes all {products.length} products from local storage into the database.</div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {status === "error" && <span style={{ fontSize: 12, color: RED, fontWeight: 600 }}>Failed — is the backend running?</span>}
        <button onClick={seed} disabled={status === "loading"} style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: status === "loading" ? "wait" : "pointer" }}>
          {status === "loading" ? "Seeding..." : "Seed to Database →"}
        </button>
      </div>
    </div>
  );
}

/* Stat Box */
function Stat({ label, value, color = NAVY }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", padding: "20px 24px", flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#aaa", marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* Add Part Form */
function AddPartForm({ onAdd }) {
  const [category, setCategory] = useState("");
  const [componentId, setComponentId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    const ok = await onAdd(category, componentId, name, price);
    if (ok) {
      setCategory(""); setComponentId(""); setName(""); setPrice("");
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", padding: 16, marginBottom: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 1fr auto", gap: 10 }}>
        <input className="adm-inp" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className="adm-inp" placeholder="Component ID" value={componentId} onChange={(e) => setComponentId(e.target.value)} />
        <input className="adm-inp" placeholder="Component Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="adm-inp" placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={handleAdd} style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 16px", cursor: "pointer" }}>
          Add
        </button>
      </div>
    </div>
  );
}

/* ===================== MAIN ADMIN ===================== */
export default function Admin({ defaultProducts, onExit }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [products, setProducts] = useState(() => loadProducts() || defaultProducts);
  const [tab, setTab] = useState("products");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [inquiries, setInquiries] = useState([]);
  const [inqLoading, setInqLoading] = useState(false);

  const [pcPrices, setPcPrices] = useState({});
  const [pcPricesLoading, setPcPricesLoading] = useState(false);
  const [pcSaveMsg, setPcSaveMsg] = useState({});

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BACKEND_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "advantage_admin_secret_2025";

  /* Load Inquiries */
  async function loadInquiries() {
    setInqLoading(true);
    try {
      const res = await fetch(`${API}/inquiries`, { headers: { "x-admin-token": BACKEND_TOKEN } });
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch {
      setInquiries([]);
    }
    setInqLoading(false);
  }

  async function markRead(id) {
    try {
      await fetch(`${API}/inquiries/${id}/read`, { method: "PUT", headers: { "x-admin-token": BACKEND_TOKEN } });
      loadInquiries();
    } catch {}
  }

  async function deleteInquiry(id) {
    try {
      await fetch(`${API}/inquiries/${id}`, { method: "DELETE", headers: { "x-admin-token": BACKEND_TOKEN } });
      loadInquiries();
    } catch {}
  }

  /* PC Prices */
  async function loadPcPrices() {
    setPcPricesLoading(true);
    try {
      const res = await fetch(`${API}/components`);
      if (res.ok) setPcPrices(await res.json());
    } catch {}
    setPcPricesLoading(false);
  }

  async function savePcPrice(category, componentId, price, inStock) {
    try {
      const res = await fetch(`${API}/components/${category}/${componentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": BACKEND_TOKEN },
        body: JSON.stringify({ price: Number(price), inStock, category, componentId }),
      });
      if (res.ok) {
        setPcSaveMsg((m) => ({ ...m, [`${category}:${componentId}`]: "✓ Saved" }));
        setTimeout(() => setPcSaveMsg((m) => ({ ...m, [`${category}:${componentId}`]: "" })), 2000);
        loadPcPrices();
      }
    } catch {}
  }

  async function deletePcPart(category, componentId) {
    try {
      await fetch(`${API}/components/${category}/${componentId}`, {
        method: "DELETE",
        headers: { "x-admin-token": BACKEND_TOKEN },
      });
      loadPcPrices();
    } catch {}
  }

  async function addPcPart(category, componentId, name, price) {
    if (!category || !componentId || !name || !price) return false;
    try {
      const res = await fetch(`${API}/components/${category}/${componentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": BACKEND_TOKEN },
        body: JSON.stringify({ price: Number(price), inStock: true, name, category, componentId }),
      });
      if (res.ok) {
        loadPcPrices();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  async function seedPcPrices() {
    // ← Fill your COMPONENTS_DATA here
    const COMPONENTS_DATA = {}; // Example: { "Processors": [{id: "...", name: "...", price: 15000}, ...] }

    const defaults = [];
    for (const [cat, items] of Object.entries(COMPONENTS_DATA)) {
      for (const item of items) {
        defaults.push({ category: cat, componentId: item.id, name: item.name, price: item.price, inStock: true });
      }
    }

    try {
      const res = await fetch(`${API}/components/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": BACKEND_TOKEN },
        body: JSON.stringify(defaults),
      });
      const data = await res.json();
      showToast(data.message || "Seeded successfully!", "success");
      loadPcPrices();
    } catch {
      showToast("Seed failed", "error");
    }
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function persist(updated) {
    setProducts(updated);
    saveProducts(updated);
  }

  /* Login */
  function login() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwErr(false);
    } else {
      setPwErr(true);
    }
  }

  /* Spec Helpers */
  const specKeys = () => SPEC_KEYS[form.cat] || SPEC_KEYS.Accessories;

  function setSpecVal(key, val) {
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: val } }));
  }

  function setHighlight(i, val) {
    const h = [...form.highlights];
    h[i] = val;
    setForm((f) => ({ ...f, highlights: h }));
  }

  function autoSummary(specs, cat) {
    const keys = SPEC_KEYS[cat] || [];
    return keys.slice(0, 4).map((k) => specs[k]).filter(Boolean).join(" · ");
  }

  /* Save Product */
  function handleSave() {
    if (!form.name.trim() || !form.price.trim()) {
      showToast("Name and Price are required", "error");
      return;
    }
    const summary = form.spec.trim() || autoSummary(form.specs, form.cat);
    const highlights = form.highlights.filter((h) => h.trim());

    let updated;
    if (editId !== null) {
      updated = products.map((p) => (p.id === editId ? { ...form, id: editId, spec: summary, highlights } : p));
      showToast(`"${form.name}" updated`);
    } else {
      const newId = Date.now();
      updated = [...products, { ...form, id: newId, spec: summary, highlights }];
      showToast(`"${form.name}" added`);
    }

    persist(updated);
    setForm(EMPTY_FORM);
    setEditId(null);
    setTab("products");
  }

  function handleEdit(p) {
    setForm({
      name: p.name,
      cat: p.cat,
      price: p.price,
      icon: p.icon,
      isNew: p.isNew || false,
      spec: p.spec || "",
      image: p.image || "",
      specs: p.specs || {},
      highlights: p.highlights || ["", "", "", ""],
    });
    setEditId(p.id);
    setTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    persist(products.filter((p) => p.id !== id));
    setDelConfirm(null);
    showToast("Product deleted", "error");
  }

  function toggleNew(id) {
    persist(products.map((p) => (p.id === id ? { ...p, isNew: !p.isNew } : p)));
  }

  function resetToDefaults() {
    persist(defaultProducts);
    showToast("Reset to default products");
  }

  const filtered = filterCat === "All" ? products : products.filter((p) => p.cat === filterCat);

  /* ===================== RENDER ===================== */
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');* {box-sizing:border-box;margin:0;padding:0;}`}</style>
        {/* Login UI unchanged - kept as original */}
        <div style={{ background: "#fff", width: "100%", maxWidth: 400, padding: "48px 40px", border: "1px solid #e8e8e8" }}>
          {/* ... same login UI as before ... */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
            <div style={{ background: NAVY, padding: "5px 12px", display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>AD</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: RED }}>V</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>ANTAGE</span>
            </div>
            <div style={{ background: "#fff", border: `1px solid ${NAVY}`, padding: "2px 8px", display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: NAVY }}>ADMIN</span>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>Admin Access</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: NAVY, marginBottom: 28 }}>Sign In</h2>
          <input
            type="password"
            placeholder="Admin password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwErr(false); }}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ width: "100%", border: `1.5px solid ${pwErr ? RED : "#ddd"}`, padding: "12px 14px", fontSize: 14, outline: "none", marginBottom: 8 }}
          />
          {pwErr && <div style={{ fontSize: 13, color: RED, marginBottom: 12, fontWeight: 500 }}>Incorrect password.</div>}
          <button onClick={login} style={{ width: "100%", background: NAVY, color: "#fff", border: "none", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Sign In →
          </button>
          <button onClick={onExit} style={{ width: "100%", marginTop: 12, background: "none", border: "none", fontSize: 13, color: "#aaa", cursor: "pointer", padding: "8px 0" }}>← Back to Website</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .adm-inp{width:100%;border:1.5px solid #e0e0e0;padding:10px 13px;font-size:14px;outline:none;background:#fff;transition:border-color .15s;}
        .adm-inp:focus{border-color:${NAVY};}
        .tab-btn{padding:9px 20px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .15s;}
        .tab-btn.active{background:${NAVY};color:#fff;}
        .tab-btn:not(.active){background:#fff;color:#555;border:1.5px solid #e0e0e0;}
        .prod-row{background:#fff;border:1.5px solid #e8e8e8;padding:16px 20px;display:flex;align-items:center;gap:16px;transition:border-color .2s;}
        .prod-row:hover{border-color:${NAVY};}
      `}</style>

      {/* Top Bar */}
      <div style={{ background: NAVY, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 100 }}>
        {/* ... Top bar content (same as before) ... */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ background: "rgba(255,255,255,.1)", padding: "4px 10px" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>AD</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: RED }}>V</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>ANTAGE</span>
            </div>
            <div style={{ background: "rgba(255,255,255,.08)", padding: "2px 8px", borderLeft: `2px solid ${RED}` }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>ADMIN</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>
            {products.length} products • {products.filter((p) => p.isNew).length} new
          </span>
          <button onClick={onExit} style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "rgba(255,255,255,.8)", padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            ← View Website
          </button>
          <button onClick={() => setAuthed(false)} style={{ background: "none", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.4)", padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <Stat label="Total Products" value={products.length} />
          {CATS.map((cat) => (
            <Stat key={cat} label={cat} value={products.filter((p) => p.cat === cat).length} />
          ))}
          <Stat label="NEW Badges" value={products.filter((p) => p.isNew).length} color={RED} />
        </div>

        <SeedBanner products={products} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button className={`tab-btn ${tab === "products" ? "active" : ""}`} onClick={() => { setTab("products"); setForm(EMPTY_FORM); setEditId(null); }}>
            📋 All Products ({products.length})
          </button>
          <button className={`tab-btn ${tab === "add" ? "active" : ""}`} onClick={() => { setTab("add"); if (!editId) setForm(EMPTY_FORM); }}>
            {editId !== null ? "✏️ Edit Product" : "➕ Add Product"}
          </button>
          <button className={`tab-btn ${tab === "inquiries" ? "active" : ""}`} onClick={() => { setTab("inquiries"); loadInquiries(); }}>
            📩 Enquiries {inquiries.filter((i) => !i.read).length > 0 && `(${inquiries.filter((i) => !i.read).length} new)`}
          </button>
          <button className={`tab-btn ${tab === "pcprices" ? "active" : ""}`} onClick={() => { setTab("pcprices"); loadPcPrices(); }}>
            🔧 PC Prices
          </button>
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            {/* Category Filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["All", ...CATS].map((c) => (
                  <button key={c} className={`cat-filter ${filterCat === c ? "on" : ""}`} onClick={() => setFilterCat(c)}>
                    {c}
                  </button>
                ))}
              </div>
              <button onClick={() => window.confirm("Reset all to defaults?") && resetToDefaults()} style={{ background: "none", border: "1.5px solid #e0e0e0", padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "#888", cursor: "pointer" }}>
                ↺ Reset to Defaults
              </button>
            </div>

            {/* Product List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", background: "#fff", border: "1px solid #e8e8e8", color: "#aaa" }}>
                  No products in this category.
                </div>
              ) : (
                filtered.map((p) => (
                  <div key={p.id} className="prod-row">
                    {/* Product row content - same as original */}
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{p.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{p.name}</span>
                        {p.isNew && <span style={{ background: RED, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", letterSpacing: ".06em", textTransform: "uppercase" }}>NEW</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#888", display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ color: RED, fontWeight: 600, textTransform: "uppercase" }}>{p.cat}</span>
                        <span>{p.spec}</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: NAVY }}>{p.price}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button className="toggle" style={{ background: p.isNew ? RED : "#e0e0e0" }} onClick={() => toggleNew(p.id)}>
                        <div className="toggle-knob" style={{ left: p.isNew ? 22 : 3 }} />
                      </button>
                      <button className="action-btn" style={{ background: "#eef2ff", color: NAVY }} onClick={() => handleEdit(p)}>Edit</button>
                      <button className="action-btn" style={{ background: "#fff0f0", color: RED }} onClick={() => setDelConfirm(p.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Tab */}
        {tab === "add" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Left & Right panels - same as original (omitted for brevity, unchanged) */}
            {/* ... keep your existing Add/Edit form ... */}
          </div>
        )}

        {/* PC Prices Tab */}
        {tab === "pcprices" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: NAVY }}>PC Component Prices</div>
                <div style={{ fontSize: 12, color: "#888" }}>Changes reflect in PC Builder instantly.</div>
              </div>
              <button onClick={seedPcPrices} style={{ background: "#eef2ff", color: NAVY, border: "1px solid #dde2f0", padding: "9px 18px", fontSize: 12, fontWeight: 700 }}>
                Seed Defaults
              </button>
            </div>

            <AddPartForm onAdd={addPcPart} />

            {pcPricesLoading && <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Loading...</div>}

            {Object.entries(pcPrices).map(([category, items]) => (
              <div key={category} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: RED, marginBottom: 10 }}>{category}</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f5f7fa" }}>
                      <th style={{ padding: "8px 14px", textAlign: "left" }}>Component</th>
                      <th style={{ padding: "8px 14px", textAlign: "left" }}>Price</th>
                      <th style={{ padding: "8px 14px", textAlign: "left" }}>Stock</th>
                      <th style={{ padding: "8px 14px", textAlign: "left" }}>Updated</th>
                      <th style={{ padding: "8px 14px", textAlign: "left" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <PcPriceRow
                        key={item.componentId}
                        item={item}
                        category={category}
                        saveMsg={pcSaveMsg[`${category}:${item.componentId}`] || ""}
                        onSave={(price, inStock) => savePcPrice(category, item.componentId, price, inStock)}
                        onDelete={deletePcPart}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Inquiries Tab - Now correctly inside container */}
        {tab === "inquiries" && (
          <div>
            {inqLoading && <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Loading enquiries...</div>}
            {!inqLoading && inquiries.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px", background: "#fff", border: "1px solid #e8e8e8", color: "#aaa" }}>
                No enquiries yet.
              </div>
            )}
            {inquiries.map((inq) => (
              <div key={inq.id} style={{ background: "#fff", border: `1.5px solid ${inq.read ? "#e8e8e8" : NAVY}`, padding: "18px 20px", marginBottom: 12, display: "flex", gap: 16 }}>
                {/* Inquiry card content (same as original) */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: NAVY }}>{inq.name}</span>
                    <span>📞 {inq.phone}</span>
                  </div>
                  <div style={{ color: RED, fontWeight: 600 }}>{inq.product}</div>
                  <div style={{ marginTop: 8, lineHeight: 1.5 }}>{inq.message}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href={`https://wa.me/91${inq.phone}`} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", padding: "8px 14px", textDecoration: "none", textAlign: "center" }}>
                    💬 Reply on WhatsApp
                  </a>
                  {!inq.read && <button onClick={() => markRead(inq.id)}>Mark Read</button>}
                  <button onClick={() => deleteInquiry(inq.id)} style={{ color: RED }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {delConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", padding: "40px 32px", maxWidth: 380, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗑️</div>
            <h3>Delete this product?</h3>
            <p style={{ margin: "20px 0" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDelConfirm(null)} style={{ flex: 1, padding: 12 }}>Cancel</button>
              <button onClick={() => handleDelete(delConfirm)} style={{ flex: 1, background: RED, color: "#fff", border: "none", padding: 12 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          background: toast.type === "error" ? RED : NAVY,
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 6,
          zIndex: 3000,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}