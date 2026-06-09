import { useState, useEffect } from "react";

const NAVY = "#0B1F5E";
const RED  = "#CC1A1A";
const ADMIN_PASSWORD = "advantage";
const STORAGE_KEY    = "advantage_products";

const CATS  = ["Laptops","Desktops","Printers","Accessories","CCTV & Security"];
const ICONS = ["💻","🖥️","🖨️","⌨️","🖱️","💾","🔌","📱"];

/* Default spec keys per category — admin sees these as input fields */
const SPEC_KEYS = {
  Laptops:     ["Processor","RAM","Storage","Display","Graphics","Operating System","Battery","Ports","Connectivity","Weight","Warranty"],
  Desktops:    ["Processor","RAM","Storage","Form Factor","Graphics","Operating System","Ports","Optical Drive","Connectivity","Warranty"],
  Printers:    ["Type","Print Technology","Print Speed","Print Resolution","Connectivity","Scanner","Paper Size","Ink / Toner","Page Yield","Warranty"],
  Accessories: ["Type","Connectivity","Compatibility","Interface","Dimensions","Weight","Warranty"],
  "CCTV & Security": ["Type","Brand","Resolution","Storage","Connectivity","Warranty"],
};

const EMPTY_FORM = {
  name:"", cat:"Laptops", price:"", icon:"💻", isNew:false,
  image:"",       /* base64 or URL */
  spec:"",        /* short summary shown on card */
  specs:{},       /* full key-value spec table  */
  highlights:["","","",""],
};

/* ══ helpers ══ */
function loadProducts(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null"); }
  catch { return null; }
}
function saveProducts(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

/* ══ Seed Banner ══ */
function SeedBanner({ products }){
  const[status,setStatus]=useState(null); // null | "loading" | "done" | "error" | "exists"
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = import.meta.env.VITE_ADMIN_TOKEN || "advantage_admin_secret_2025";

  async function seed(){
    setStatus("loading");
    try{
      const res = await fetch(`${API}/products/seed`,{
        method:"POST",
        headers:{"Content-Type":"application/json","x-admin-token":token},
        body: JSON.stringify(products),
      });
      const data = await res.json();
      if(!res.ok){
        setStatus(data.error?.includes("already")?"exists":"error");
      } else {
        setStatus("done");
      }
    } catch {
      setStatus("error");
    }
  }

  if(status==="done") return(
    <div style={{background:"#dcfce7",border:"1px solid #86efac",padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:12,fontSize:13}}>
      <span style={{color:"#16a34a",fontSize:18}}>✓</span>
      <span style={{fontWeight:600,color:"#15803d"}}>Products seeded to MongoDB successfully! The website now loads from the database.</span>
    </div>
  );

  if(status==="exists") return(
    <div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"14px 20px",marginBottom:24,fontSize:13,fontWeight:500,color:"#854d0e"}}>
      ⚠️ Products already exist in the database. Delete all first if you want to re-seed.
    </div>
  );

  return(
    <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
      <div>
        <div style={{fontWeight:700,fontSize:14,color:NAVY}}>First time setup — Seed products to MongoDB</div>
        <div style={{fontSize:12,color:"#555",marginTop:3}}>This pushes all {products.length} products from local storage into the database. Run once.</div>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {status==="error"&&<span style={{fontSize:12,color:RED,fontWeight:600}}>Failed — is the backend running?</span>}
        <button onClick={seed} disabled={status==="loading"}
          style={{background:NAVY,color:"#fff",border:"none",padding:"10px 22px",fontSize:13,fontWeight:700,cursor:status==="loading"?"wait":"pointer",letterSpacing:".04em",textTransform:"uppercase",opacity:status==="loading"?0.7:1}}>
          {status==="loading"?"Seeding...":"Seed to Database →"}
        </button>
      </div>
    </div>
  );
}

/* ══ Stat box ══ */
function Stat({label,value,color="#0B1F5E"}){
  return(
    <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:"20px 24px",flex:1,minWidth:120}}>
      <div style={{fontSize:28,fontWeight:800,color,lineHeight:1}}>{value}</div>
      <div style={{fontSize:11,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginTop:6}}>{label}</div>
    </div>
  );
}

/* ══ Main Admin Component ══ */
export default function Admin({ defaultProducts, onExit }){
  const[authed,  setAuthed ] = useState(false);
  const[pw,      setPw     ] = useState("");
  const[pwErr,   setPwErr  ] = useState(false);
  const[products,setProducts] = useState(()=>loadProducts() || defaultProducts);
  const[tab,     setTab    ] = useState("products"); /* products | add | inquiries */
  const[form,    setForm   ] = useState(EMPTY_FORM);
  const[editId,  setEditId ] = useState(null);
  const[toast,   setToast  ] = useState(null);
  const[delConfirm,setDelConfirm] = useState(null);
  const[filterCat,setFilterCat] = useState("All");
  const[inquiries,setInquiries] = useState([]);
  const[inqLoading,setInqLoading] = useState(false);
  /* PC Prices tab state */
  const[componentPrices, setComponentPrices] = useState({}); // category -> array of components
  const[componentCategories, setComponentCategories] = useState([]); // array of category names
  const[pcPricesLoading, setPcPricesLoading] = useState(false); // loading state for fetching prices

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BACKEND_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "advantage_admin_secret_2025";

  async function loadInquiries(){
    setInqLoading(true);
    try{
      const res = await fetch(API+"/inquiries",{
        headers:{"x-admin-token": BACKEND_TOKEN}
      });
      const data = await res.json();
      setInquiries(Array.isArray(data)?data:[]);
    } catch(e){ setInquiries([]); }
    setInqLoading(false);
  }

  async function markRead(id){
    try{
      await fetch(API+"/inquiries/"+id+"/read",{method:"PUT",headers:{"x-admin-token":BACKEND_TOKEN}});
      loadInquiries();
    } catch(e){}
  }

  async function deleteInquiry(id){
    try{
      await fetch(API+"/inquiries/"+id,{method:"DELETE",headers:{"x-admin-token":BACKEND_TOKEN}});
      loadInquiries();
    } catch(e){}
  }

  function showToast(msg, type="success"){
    setToast({msg,type});
    setTimeout(()=>setToast(null), 2800);
  }

  function persist(updated){ setProducts(updated); saveProducts(updated); }

  /* ── PC Prices tab functions ── */
  useEffect(() => {
    // Fetch component prices when the PC Prices tab is opened
    if (tab === "pcPrices") {
      fetchComponentPrices();
    }
  }, [tab]);

  // Fetch all component prices from the API
  async function fetchComponentPrices(){
    setPcPricesLoading(true);
    try{
      const res = await fetch(API+"/components",{
        headers:{"x-admin-token": BACKEND_TOKEN}
      });
      if(res.ok){
        const data = await res.json();
        // data is already grouped by category from our API
        setComponentPrices(data);
        setComponentCategories(Object.keys(data));
      } else {
        console.error("Failed to fetch component prices");
        setComponentPrices({});
        setComponentCategories([]);
      }
    } catch(e){
      console.error("Error fetching component prices:", e);
      setComponentPrices({});
      setComponentCategories([]);
    } finally {
      setPcPricesLoading(false);
    }
  }

  // Handle price input change
  function handlePriceChange(category, componentId, value){
    setComponentPrices(prev => ({
      ...prev,
      [category]: prev[category]?.map(comp =>
        comp.componentId === componentId
          ? {...comp, price: value === "" ? 0 : parseFloat(value) || 0}
          : comp
      ) || []
    }));
  }

  // Handle stock checkbox change
  function handleStockChange(category, componentId, checked){
    setComponentPrices(prev => ({
      ...prev,
      [category]: prev[category]?.map(comp =>
        comp.componentId === componentId
          ? {...comp, inStock: checked}
          : comp
      ) || []
    }));
  }

  // Save a single component price
  async function saveComponentPrice(category, componentId){
    // Find the component in our state
    const componentList = componentPrices[category];
    if (!componentList) return;

    const component = componentList.find(comp => comp.componentId === componentId);
    if (!component) return;

    try{
      const res = await fetch(`${API}/components/${category}/${componentId}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "x-admin-token": BACKEND_TOKEN
        },
        body: JSON.stringify({
          price: component.price,
          inStock: component.inStock,
          note: component.note || ""
        })
      });

      if(res.ok){
        showToast("Component price updated successfully");
        // Refresh the data to get the updated timestamp
        fetchComponentPrices();
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.message || "Failed to update component price"}`, "error");
      }
    } catch(e){
      console.error("Error saving component price:", e);
      showToast("Failed to update component price", "error");
    }
  }

  // Seed default prices from PCBuilder data
  async function seedDefaultPrices(){
    try{
      const res = await fetch(`${API}/components/seed`,{
        method:"POST",
        headers:{"x-admin-token": BACKEND_TOKEN}
      });
      if(res.ok){
        const data = await res.json();
        showToast(data.message || "Default prices seeded successfully");
        // Refresh the data
        fetchComponentPrices();
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.message || "Failed to seed default prices"}`, "error");
      }
    } catch(e){
      console.error("Error seeding default prices:", e);
      showToast("Failed to seed default prices", "error");
    }
  }

  /* ── login ── */
  function login(){
    if(pw===ADMIN_PASSWORD){ setAuthed(true); setPwErr(false); }
    else setPwErr(true);
  }

  /* ── spec helpers ── */
  function specKeys(){ return SPEC_KEYS[form.cat]||SPEC_KEYS.Accessories; }

  function setSpecVal(key,val){
    setForm(f=>({...f, specs:{...f.specs,[key]:val}}));
  }

  function setHighlight(i,val){
    const h=[...form.highlights];
    h[i]=val;
    setForm(f=>({...f,highlights:h}));
  }

  /* auto-generate short spec summary from specs object */
  function autoSummary(specs, cat){
    const keys = SPEC_KEYS[cat]||[];
    return keys.slice(0,4).map(k=>specs[k]).filter(Boolean).join(" · ");
  }

  /* ── save product ── */
  function handleSave(){
    if(!form.name.trim()||!form.price.trim()){
      showToast("Name and Price are required","error"); return;
    }
    const summary = form.spec.trim() || autoSummary(form.specs, form.cat);
    const highlights = form.highlights.filter(h=>h.trim());
    let updated;
    if(editId!==null){
      updated = products.map(p=>p.id===editId ? {...form,id:editId,spec:summary,highlights} : p);
      showToast(`"${form.name}" updated`);
    } else {
      const newId = Date.now();
      updated = [...products, {...form,id:newId,spec:summary,highlights}];
      showToast(`"${form.name}" added`);
    }
    persist(updated);
    setForm(EMPTY_FORM); setEditId(null); setTab("products");
  }

  /* ── edit ── */
  function handleEdit(p){
    setForm({
      name:p.name, cat:p.cat, price:p.price, icon:p.icon,
      isNew:p.isNew||false, spec:p.spec||"",
      image:p.image||"",
      specs:p.specs||{}, highlights:p.highlights||["","","",""],
    });
    setEditId(p.id);
    setTab("add");
    window.scrollTo({top:0,behavior:"smooth"});
  }

  /* ── delete ── */
  function handleDelete(id){
    const updated=products.filter(p=>p.id!==id);
    persist(updated); setDelConfirm(null);
    showToast("Product deleted","error");
  }

  /* ── toggle NEW ── */
  function toggleNew(id){
    const updated=products.map(p=>p.id===id?{...p,isNew:!p.isNew}:p);
    persist(updated);
  }

  /* ── reset to defaults ── */
  function resetToDefaults(){
    persist(defaultProducts);
    showToast("Reset to default products");
  }

  const filtered = filterCat==="All" ? products : products.filter(p=>p.cat===filterCat);

  /* ══════════════════════════════════════════════
     LOGIN SCREEN
  ══════════════════════════════════════════════ */
  if(!authed) return(
    <div style={{minHeight:"100vh",background:"#f0f2f8",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'DM Sans',sans-serif;}`}</style>
      <div style={{background:"#fff",width:"100%",maxWidth:400,padding:"48px 40px",border:"1px solid #e8e8e8"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:32}}>
          <div style={{background:NAVY,padding:"5px 12px",display:"flex",alignItems:"center"}}>
            <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>AD</span>
            <span style={{fontSize:18,fontWeight:800,color:RED}}>V</span>
            <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>ANTAGE</span>
          </div>
          <div style={{background:"#fff",border:`1px solid ${NAVY}`,padding:"2px 8px",alignSelf:"stretch",display:"flex",alignItems:"center"}}>
            <span style={{fontSize:8,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:NAVY}}>ADMIN</span>
          </div>
        </div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:6}}>Admin Access</div>
        <h2 style={{fontSize:24,fontWeight:800,color:NAVY,marginBottom:28}}>Sign In</h2>
        <input type="password" placeholder="Admin password" value={pw}
          onChange={e=>{setPw(e.target.value);setPwErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&login()}
          style={{width:"100%",border:`1.5px solid ${pwErr?RED:"#ddd"}`,padding:"12px 14px",fontSize:14,outline:"none",marginBottom:8,fontFamily:"inherit",transition:"border-color .15s"}}
          onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=pwErr?RED:"#ddd"}/>
        {pwErr&&<div style={{fontSize:13,color:RED,marginBottom:12,fontWeight:500}}>Incorrect password.</div>}
        <button onClick={login}
          style={{width:"100%",background:NAVY,color:"#fff",border:"none",padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",transition:"background .15s",marginTop:pwErr?0:8}}
          onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
          Sign In →
        </button>
        <button onClick={onExit} style={{width:"100%",marginTop:12,background:"none",border:"none",fontSize:13,color:"#aaa",cursor:"pointer",padding:"8px 0"}}>← Back to Website</button>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════
     ADMIN PANEL
  ══════════════════════════════════════════════ */
  return(
    <div style={{minHeight:"100vh",background:"#f5f7fa",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:#f5f7fa;}
        button,input,textarea,select{font-family:inherit;}

        .adm-inp{width:100%;border:1.5px solid #e0e0e0;padding:10px 13px;font-size:14px;outline:none;background:#fff;transition:border-color .15s;color:#111;}
        .adm-inp:focus{border-color:${NAVY};}
        select.adm-inp{cursor:pointer;}
        textarea.adm-inp{resize:vertical;}

        .tab-btn{padding:9px 20px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .15s;letter-spacing:.02em;}
        .tab-btn.active{background:${NAVY};color:#fff;}
        .tab-btn:not(.active){background:#fff;color:#555;border:1.5px solid #e0e0e0;}
        .tab-btn:not(.active):hover{border-color:${NAVY};color:${NAVY};}

        .prod-row{background:#fff;border:1.5px solid #e8e8e8;padding:16px 20px;display:flex;align-items:center;gap:16px;transition:border-color .2s;}
        .prod-row:hover{border-color:${NAVY};}

        .action-btn{padding:7px 14px;font-size:12px;font-weight:600;border:none;cursor:pointer;letter-spacing:.03em;transition:all .15s;}

        .cat-filter{padding:7px 16px;font-size:12px;font-weight:600;border:1.5px solid #e0e0e0;background:#fff;cursor:pointer;transition:all .15s;color:#555;}
        .cat-filter.on{background:${NAVY};color:#fff;border-color:${NAVY};}
        .cat-filter:not(.on):hover{border-color:${NAVY};color:${NAVY};}

        .spec-row{display:grid;grid-template-columns:180px 1fr;gap:10px;align-items:center;margin-bottom:8px;}
        .spec-label{font-size:12px;font-weight:600;color:#555;letter-spacing:.03em;}

        .toggle{width:44px;height:24px;border-radius:12px;position:relative;cursor:pointer;transition:background .2s;border:none;flex-shrink:0;}
        .toggle-knob{position:absolute;top:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.2);}
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{background:NAVY,height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:0}}>
            <div style={{background:"rgba(255,255,255,.1)",padding:"4px 10px",display:"flex",alignItems:"center"}}>
              <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>AD</span>
              <span style={{fontSize:16,fontWeight:800,color:RED}}>V</span>
              <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>ANTAGE</span>
            </div>
            <div style={{background:"rgba(255,255,255,.08)",padding:"2px 8px",alignSelf:"stretch",display:"flex",alignItems:"center",borderLeft:`2px solid ${RED}`}}>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>ADMIN</span>
            </div>
          </div>
          <span style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>Store Management Panel</span>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>
            {products.length} products · {products.filter(p=>p.isNew).length} new
          </span>
          <button onClick={onExit}
            style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.8)",padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>
            ← View Website
          </button>
          <button onClick={()=>setAuthed(false)}
            style={{background:"none",border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.4)",padding:"7px 14px",fontSize:12,cursor:"pointer"}}>
            Logout
          </button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 24px"}}>

        {/* ── STATS ROW ── */}
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
          <Stat label="Total Products" value={products.length}/>
          <Stat label="Laptops"        value={products.filter(p=>p.cat==="Laptops").length}    color={NAVY}/>
          <Stat label="Desktops"       value={products.filter(p=>p.cat==="Desktops").length}   color={NAVY}/>
          <Stat label="Printers"       value={products.filter(p=>p.cat==="Printers").length}   color={NAVY}/>
          <Stat label="Accessories"    value={products.filter(p=>p.cat==="Accessories").length} color={NAVY}/>
          <Stat label="NEW Badges"     value={products.filter(p=>p.isNew).length} color={RED}/>
        </div>

        {/* ── SEED BANNER ── */}
        <SeedBanner products={products}/>

        {/* ── TABS ── */}
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          <button className={`tab-btn ${tab==="products"?"active":""}`} onClick={()=>{setTab("products");setForm(EMPTY_FORM);setEditId(null);}}>
            📋 All Products ({products.length})
          </button>
          <button className={`tab-btn ${tab==="add"?"active":""}`} onClick={()=>{setTab("add");if(!editId){setForm(EMPTY_FORM);}}}>
            {editId!==null?"✏️ Edit Product":"➕ Add Product"}
          </button>
          <button className={`tab-btn ${tab==="pcPrices"?"active":""}`} onClick={()=>{setTab("pcPrices");}}>
            🔧 PC Prices
          </button>
          <button className={`tab-btn ${tab==="inquiries"?"active":""}`} onClick={()=>{setTab("inquiries");loadInquiries();}}>
            📩 Enquiries {inquiries.filter(i=>!i.read).length>0?"("+inquiries.filter(i=>!i.read).length+" new)":""}
          </button>
          {editId!==null&&(
            <button className="tab-btn" style={{color:RED,borderColor:RED}}
              onClick={()=>{setForm(EMPTY_FORM);setEditId(null);setTab("products");}}>
              ✕ Cancel Edit
            </button>
          )}
        </div>

        {/* ════════════════════════════════
            TAB: ALL PRODUCTS
        ════════════════════════════════ */}
        {tab==="products"&&(
          <div>
            {/* Category filter */}
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["All",...CATS].map(c=>(
                  <button key={c} className={`cat-filter ${filterCat===c?"on":""}`} onClick={()=>setFilterCat(c)}>{c}</button>
                ))}
              </div>
              <button onClick={()=>{if(window.confirm("Reset all products to defaults? This cannot be undone."))resetToDefaults();}}
                style={{background:"none",border:"1.5px solid #e0e0e0",padding:"7px 14px",fontSize:12,fontWeight:600,color:"#888",cursor:"pointer"}}>
                ↺ Reset to Defaults
              </button>
            </div>

            {/* Product list */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.length===0&&(
                <div style={{textAlign:"center",padding:"48px",background:"#fff",border:"1px solid #e8e8e8",color:"#aaa",fontSize:14}}>
                  No products in this category.
                  <button onClick={()=>{setTab("add");setForm({...EMPTY_FORM,cat:filterCat==="All"?"Laptops":filterCat});}}
                    style={{marginLeft:12,background:NAVY,color:"#fff",border:"none",padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                    + Add One
                  </button>
                </div>
              )}
              {filtered.map(p=>(
                <div key={p.id} className="prod-row">
                  <span style={{fontSize:28,flexShrink:0}}>{p.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                      <span style={{fontWeight:700,fontSize:15,color:NAVY}}>{p.name}</span>
                      {p.isNew&&<span style={{background:RED,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",letterSpacing:".06em",textTransform:"uppercase"}}>NEW</span>}
                    </div>
                    <div style={{fontSize:11,color:"#888",display:"flex",gap:12,flexWrap:"wrap"}}>
                      <span style={{color:RED,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>{p.cat}</span>
                      <span>{p.spec}</span>
                    </div>
                  </div>
                  <div style={{fontWeight:800,fontSize:16,color:NAVY,flexShrink:0}}>{p.price}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                    {/* NEW toggle */}
                    <button className="toggle"
                      style={{background:p.isNew?RED:"#e0e0e0"}}
                      onClick={()=>toggleNew(p.id)}
                      title={p.isNew?"Remove NEW badge":"Mark as NEW"}>
                      <div className="toggle-knob" style={{left:p.isNew?22:3}}/>
                    </button>
                    <span style={{fontSize:11,color:p.isNew?RED:"#aaa",fontWeight:600,minWidth:32}}>{p.isNew?"NEW":"—"}</span>
                    <button className="action-btn"
                      style={{background:"#eef2ff",color:NAVY}}
                      onMouseEnter={e=>{e.target.style.background=NAVY;e.target.style.color="#fff";}}
                      onMouseLeave={e=>{e.target.style.background="#eef2ff";e.target.style.color=NAVY;}}
                      onClick={()=>handleEdit(p)}>
                      Edit
                    </button>
                    <button className="action-btn"
                      style={{background:"#fff0f0",color:RED}}
                      onClick={()=>setDelConfirm(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            TAB: ADD / EDIT PRODUCT
        ════════════════════════════════ */}
        {tab==="add"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>

            {/* ── LEFT: Basic info ── */}
            <div style={{background:"#fff",border:"1.5px solid #e8e8e8",padding:"28px"}}>
              <h3 style={{fontWeight:800,fontSize:18,color:NAVY,marginBottom:4}}>{editId!==null?"Edit Product":"Add New Product"}</h3>
              <p style={{fontSize:13,color:"#888",marginBottom:24}}>Basic information shown on product card.</p>

              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {/* Name */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777",display:"block",marginBottom:6}}>Product Name *</label>
                  <input className="adm-inp" placeholder="e.g. HP Pavilion 15 Laptop" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
                </div>

                {/* Category + Price */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777",display:"block",marginBottom:6}}>Category *</label>
                    <select className="adm-inp" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value,specs:{}}))}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777",display:"block",marginBottom:6}}>Price *</label>
                    <input className="adm-inp" placeholder="₹52,990" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
                  </div>
                </div>

                {/* Icon — fallback only when no image uploaded */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777",display:"block",marginBottom:8}}>
                    Fallback Icon <span style={{fontWeight:400,color:"#aaa",textTransform:"none",letterSpacing:0}}>(used only if no image uploaded)</span>
                  </label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {ICONS.map(ic=>(
                      <button key={ic} onClick={()=>setForm(f=>({...f,icon:ic}))}
                        style={{fontSize:24,padding:"8px 10px",border:`2px solid ${form.icon===ic?NAVY:"#e0e0e0"}`,background:form.icon===ic?"#eef2ff":"#fff",cursor:"pointer",transition:"all .15s"}}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Image Upload */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777",display:"block",marginBottom:8}}>
                    Product Image <span style={{fontWeight:400,color:"#aaa",textTransform:"none",letterSpacing:0}}>(upload or paste URL)</span>
                  </label>

                  {/* Upload button */}
                  <div style={{border:"2px dashed #dde2f0",padding:"20px",textAlign:"center",background:"#f9fbff",marginBottom:10,position:"relative",cursor:"pointer"}}
                    onClick={()=>document.getElementById("img-upload").click()}
                    onDragOver={e=>e.preventDefault()}
                    onDrop={e=>{
                      e.preventDefault();
                      const file=e.dataTransfer.files[0];
                      if(file&&file.type.startsWith("image/")){
                        const reader=new FileReader();
                        reader.onload=ev=>setForm(f=>({...f,image:ev.target.result}));
                        reader.readAsDataURL(file);
                      }
                    }}>
                    <input id="img-upload" type="file" accept="image/*" style={{display:"none"}}
                      onChange={e=>{
                        const file=e.target.files[0];
                        if(file){
                          const reader=new FileReader();
                          reader.onload=ev=>setForm(f=>({...f,image:ev.target.result}));
                          reader.readAsDataURL(file);
                        }
                      }}/>
                    {form.image ? (
                      <div style={{position:"relative",display:"inline-block"}}>
                        <img src={form.image} alt="" style={{maxHeight:120,maxWidth:"100%",objectFit:"contain",display:"block",margin:"0 auto"}}/>
                        <button onClick={e=>{e.stopPropagation();setForm(f=>({...f,image:""}));}}
                          style={{position:"absolute",top:-8,right:-8,background:RED,color:"#fff",border:"none",width:22,height:22,borderRadius:"50%",fontSize:12,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          ×
                        </button>
                      </div>
                    ):(
                      <div>
                        <div style={{fontSize:28,marginBottom:8}}>📷</div>
                        <div style={{fontSize:13,fontWeight:600,color:NAVY}}>Click to upload or drag & drop</div>
                        <div style={{fontSize:11,color:"#aaa",marginTop:4}}>JPG, PNG, WebP — recommend 600×400px</div>
                      </div>
                    )}
                  </div>

                  {/* OR paste URL */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{flex:1,height:1,background:"#e8e8e8"}}/>
                    <span style={{fontSize:11,color:"#aaa",fontWeight:600}}>OR</span>
                    <div style={{flex:1,height:1,background:"#e8e8e8"}}/>
                  </div>
                  <input className="adm-inp" placeholder="Paste image URL (https://...)" value={form.image.startsWith("data:")?"":(form.image||"")}
                    onChange={e=>setForm(f=>({...f,image:e.target.value}))}/>
                </div>

                {/* Short spec summary */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777",display:"block",marginBottom:6}}>
                    Short Spec Summary <span style={{color:"#aaa",fontWeight:400,textTransform:"none",letterSpacing:0}}>(shown on card — auto-generated if left blank)</span>
                  </label>
                  <input className="adm-inp" placeholder="Intel i5 · 8GB RAM · 512GB SSD · Win 11" value={form.spec} onChange={e=>setForm(f=>({...f,spec:e.target.value}))}/>
                </div>

                {/* NEW badge toggle */}
                <div style={{display:"flex",alignItems:"center",gap:12,paddingTop:4}}>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777"}}>Mark as NEW</label>
                  <button className="toggle" style={{background:form.isNew?RED:"#e0e0e0"}} onClick={()=>setForm(f=>({...f,isNew:!f.isNew}))}>
                    <div className="toggle-knob" style={{left:form.isNew?22:3}}/>
                  </button>
                  <span style={{fontSize:13,fontWeight:600,color:form.isNew?RED:"#aaa"}}>{form.isNew?"Shows NEW badge":"No badge"}</span>
                </div>

                {/* Key Highlights */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#777",display:"block",marginBottom:8}}>Key Highlights <span style={{fontWeight:400,color:"#aaa",textTransform:"none",letterSpacing:0}}>(up to 4)</span></label>
                  {form.highlights.map((h,i)=>(
                    <input key={i} className="adm-inp" style={{marginBottom:8}} placeholder={`Highlight ${i+1}`}
                      value={h} onChange={e=>setHighlight(i,e.target.value)}/>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Full Specs ── */}
            <div>
              <div style={{background:"#fff",border:"1.5px solid #e8e8e8",padding:"28px",marginBottom:16}}>
                <h3 style={{fontWeight:800,fontSize:18,color:NAVY,marginBottom:4}}>Full Specifications</h3>
                <p style={{fontSize:13,color:"#888",marginBottom:24}}>These appear in the full specs table on the product page.</p>
                {specKeys().map(key=>(
                  <div key={key} className="spec-row">
                    <div className="spec-label">{key}</div>
                    <input className="adm-inp" placeholder={`Enter ${key}`}
                      value={form.specs[key]||""}
                      onChange={e=>setSpecVal(key,e.target.value)}/>
                  </div>
                ))}
              </div>

              {/* Preview card */}
              {form.name&&(
                <div style={{background:"#fff",border:"1.5px solid #e8e8e8",padding:"20px",marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:14}}>Card Preview</div>
                  <div style={{background:"#f5f5f5",height:100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,marginBottom:14,position:"relative",overflow:"hidden"}}>
                    {form.isNew&&<span style={{position:"absolute",top:8,left:8,background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",letterSpacing:".08em",textTransform:"uppercase"}}>NEW</span>}
                    {form.image
                      ? <img src={form.image} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                      : form.icon
                    }
                  </div>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:RED,marginBottom:4}}>{form.cat}</div>
                  <div style={{fontWeight:700,fontSize:15,color:NAVY,marginBottom:4}}>{form.name}</div>
                  <div style={{fontSize:11,color:"#888",marginBottom:8}}>{form.spec||autoSummary(form.specs,form.cat)||"Specs will appear here"}</div>
                  <div style={{fontWeight:800,fontSize:18,color:NAVY}}>{form.price||"Price"}</div>
                </div>
              )}

              {/* Save button */}
              <button onClick={handleSave}
                style={{width:"100%",background:NAVY,color:"#fff",border:"none",padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",transition:"background .15s"}}
                onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                {editId!==null?"✓ Update Product":"✓ Save Product"}
              </button>
              {editId!==null&&(
                <button onClick={()=>{setForm(EMPTY_FORM);setEditId(null);setTab("products");}}
                  style={{width:"100%",marginTop:8,background:"#fff",border:"1.5px solid #e0e0e0",color:"#555",padding:"12px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* ════ INQUIRIES TAB ════ */}
        {tab==="inquiries"&&(
          <div>
            {inqLoading&&<div style={{textAlign:"center",padding:40,color:"#888",fontSize:14}}>Loading enquiries...</div>}
            {!inqLoading&&inquiries.length===0&&(
              <div style={{textAlign:"center",padding:"48px 20px",background:"#fff",border:"1px solid #e8e8e8",color:"#aaa",fontSize:14}}>
                No enquiries yet. When customers submit the form, they'll appear here.
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {inquiries.map(inq=>(
                <div key={inq.id} style={{background:"#fff",border:"1.5px solid "+(inq.read?"#e8e8e8":NAVY),padding:"18px 20px",display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:15,color:NAVY}}>{inq.name}</span>
                      <span style={{fontSize:12,color:"#888"}}>📞 {inq.phone}</span>
                      {inq.email&&<span style={{fontSize:12,color:"#888"}}>✉️ {inq.email}</span>}
                      {!inq.read&&<span style={{background:RED,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",letterSpacing:".04em",textTransform:"uppercase"}}>NEW</span>}
                    </div>
                    <div style={{fontSize:12,color:RED,fontWeight:600,marginBottom:6}}>{inq.product}</div>
                    <div style={{fontSize:13,color:"#444",lineHeight:1.6}}>{inq.message}</div>
                    <div style={{fontSize:11,color:"#aaa",marginTop:8}}>{new Date(inq.createdAt).toLocaleString("en-IN")}</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexShrink:0,flexDirection:"column"}}>
                    <a href={"https://wa.me/91"+inq.phone+"?text="+encodeURIComponent("Hi "+inq.name+", regarding your enquiry about "+inq.product+"...")} target="_blank" rel="noreferrer"
                      style={{background:"#25D366",color:"#fff",padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",textDecoration:"none",display:"block",textAlign:"center"}}>
                      💬 Reply
                    </a>
                    {!inq.read&&<button onClick={()=>markRead(inq.id)} style={{background:"#eef2ff",color:NAVY,border:"none",padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Mark Read</button>}
                    <button onClick={()=>deleteInquiry(inq.id)} style={{background:"#fff0f0",color:RED,border:"none",padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ PC PRICES TAB ════ */}
        {tab==="pcPrices"&&(
          <div>
            {/* Loading state for fetching component prices */}
            {pcPricesLoading && (
              <div style={{textAlign:"center",padding:40,color:"#888",fontSize:14}}>
                Loading PC component prices...
              </div>
            )}

            {/* Button to seed default prices */}
            <div style={{marginBottom:20}}>
              <button onClick={seedDefaultPrices}
                style={{background:NAVY,color:"#fff",border:"none",padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e=>e.target.style.background=RED}
                onMouseLeave={e=>e.target.style.background=NAVY}>
                Seed Defaults
              </button>
            </div>

            {/* Component prices list */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {componentCategories.map((category, index) => (
                <div key={index} style={{border:"1.5px solid #e8e8e8",borderRadius:4,overflow:"hidden"}}>
                  <div style={{background:"#f0f2f8",padding:"12px 16px",fontWeight:600,color:NAVY}}>
                    {category}
                  </div>
                  <div style={{padding:"16px"}}>
                    {componentPrices[category] && componentPrices[category].length > 0 ? (
                      <div style={{display:"flex",flexDirection:"column",gap:12}}>
                        {componentPrices[category].map((component, compIndex) => (
                          <div key={compIndex} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px",borderBottom:compIndex < componentPrices[category].length - 1 ? "1px solid #f0f2f8" : "none"}}>
                            <div>
                              <div style={{fontWeight:600,color:NAVY}}>{component.name}</div>
                              <div style={{fontSize:12,color:"#666"}}>{component.componentId}</div>
                            </div>
                            <div style={{display:"flex",gap:12,alignItems:"center"}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <input
                                  type="number"
                                  value={component.price || ""}
                                  onChange={(e) => handlePriceChange(category, component.componentId, e.target.value)}
                                  style={{width:100,padding:"8px",border:"1.5px solid #e0e0e0"}}
                                />
                                <span style={{color:"#666"}}>₹</span>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <label style={{cursor:"pointer"}}>
                                  <input
                                    type="checkbox"
                                    checked={component.inStock !== false}
                                    onChange={(e) => handleStockChange(category, component.componentId, e.target.checked)}
                                  />
                                  <span>In Stock</span>
                                </label>
                              </div>
                              <button
                                onClick={() => saveComponentPrice(category, component.componentId)}
                                style={{background:NAVY,color:"#fff",border:"none",padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"background .15s"}}
                                onMouseEnter={e=>e.target.style.background=RED}
                                onMouseLeave={e=>e.target.style.background=NAVY}>
                                Save
                              </button>
                            </div>
                            <div style={{fontSize:11,color:"#999"}}>
                              Last updated: {component.updatedAt ?
                                (() => {
                                  const diffTime = Math.abs(new Date() - new Date(component.updatedAt));
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  return diffDays === 0 ? "Today" : `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
                                })() : "Never"}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{textAlign:"center",padding:"20px",color:"#888"}}>
                        No components found for {category}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {delConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",maxWidth:380,width:"100%",padding:"40px 32px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>🗑️</div>
            <div style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:8}}>Delete this product?</div>
            <p style={{fontSize:14,color:"#666",lineHeight:1.6,marginBottom:28}}>This will remove it from the website immediately. This cannot be undone.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDelConfirm(null)}
                style={{flex:1,background:"#fff",border:"1.5px solid #e0e0e0",padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancel</button>
              <button onClick={()=>handleDelete(delConfirm)}
                style={{flex:1,background:RED,color:"#fff",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?RED:NAVY,color:"#fff",padding:"12px 24px",fontSize:14,fontWeight:600,zIndex:3000,boxShadow:"0 4px 20px rgba(0,0,0,.2)",whiteSpace:"nowrap"}}>
          {toast.type==="error"?"⚠️":"✓"} {toast.msg}
        </div>
      )}
    </div>
  );
}