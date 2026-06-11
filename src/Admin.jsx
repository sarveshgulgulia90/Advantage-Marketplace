import { useState, useEffect } from "react";

const NAVY = "#0B1F5E";
const RED  = "#CC1A1A";
const ADMIN_PASSWORD = "advantage1995";
const STORAGE_KEY    = "advantage_products";
const API  = import.meta.env.VITE_API_URL   || "http://localhost:5000/api";
const BTKN = import.meta.env.VITE_ADMIN_TOKEN || "advantage_admin_secret_2025";

const CATS = ["Laptops","Desktops","Printers","Accessories","Security & CCTV"];
const ICONS= ["💻","🖥️","🖨️","⌨️","🖱️","💾","🔌","📷","🎥","🔐"];

const SPEC_KEYS = {
  Laptops:       ["Processor","RAM","Storage","Display","Graphics","Operating System","Battery","Ports","Connectivity","Weight","Warranty"],
  Desktops:      ["Processor","RAM","Storage","Form Factor","Graphics","Operating System","Ports","Connectivity","Warranty"],
  Printers:      ["Type","Print Technology","Print Speed","Print Resolution","Connectivity","Scanner","Paper Size","Page Yield","Warranty"],
  Accessories:   ["Type","Connectivity","Compatibility","Interface","Weight","Warranty"],
  "Security & CCTV":["Type","Resolution","Connectivity","Storage","Power","IR Range","Warranty"],
};

const EMPTY = {name:"",cat:"Laptops",price:"",icon:"💻",isNew:false,inStock:true,image:"",spec:"",specs:{},highlights:["","","",""]};

function ls(){ try{ const s=localStorage.getItem(STORAGE_KEY); return s?JSON.parse(s):null; }catch{return null;} }
function ss(a){ localStorage.setItem(STORAGE_KEY,JSON.stringify(a)); }

// ── PC Price Row ──────────────────────────────────────────────────
function PcPriceRow({item,category,saveMsg,onSave,onDelete}){
  const[price,setPrice]=useState(item.price||0);
  const[inStock,setInStock]=useState(item.inStock!==false);
  const days=item.updatedAt?Math.floor((Date.now()-new Date(item.updatedAt))/(864e5))+" d ago":"—";
  return(
    <tr style={{borderBottom:"1px solid #f0f0f0"}}>
      <td style={{padding:"10px 14px",fontSize:13,color:NAVY,fontWeight:500}}>{item.name}</td>
      <td style={{padding:"10px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:13,color:"#555"}}>₹</span>
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)}
            style={{border:"1px solid #ddd",padding:"6px 8px",fontSize:13,width:90,outline:"none",fontFamily:"inherit"}}/>
        </div>
      </td>
      <td style={{padding:"10px 14px"}}>
        <button onClick={()=>setInStock(s=>!s)}
          style={{background:inStock?"#dcfce7":"#fff0f0",color:inStock?"#16a34a":RED,border:"1px solid "+(inStock?"#86efac":"#fecaca"),padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
          {inStock?"✓ In Stock":"✗ Out"}
        </button>
      </td>
      <td style={{padding:"10px 14px",fontSize:11,color:"#aaa"}}>{days}</td>
      <td style={{padding:"10px 14px"}}>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>onSave(price,inStock)}
            style={{background:saveMsg?"#16a34a":NAVY,color:"#fff",border:"none",padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",transition:"background .2s"}}>
            {saveMsg||"Save"}
          </button>
          <button onClick={()=>window.confirm("Delete "+item.name+"?")&&onDelete(category,item.componentId)}
            style={{background:"#fff0f0",color:RED,border:"1px solid #fecaca",padding:"5px 8px",fontSize:11,cursor:"pointer"}}>🗑️</button>
        </div>
      </td>
    </tr>
  );
}

// ── Add Part Form ─────────────────────────────────────────────────
function AddPartForm({onAdd}){
  const[cat,setCat]=useState("CPU");
  const[cid,setCid]=useState("");
  const[nm,setNm]=useState("");
  const[pr,setPr]=useState("");
  const[msg,setMsg]=useState("");
  async function go(){
    if(!cat||!cid||!nm||!pr){setMsg("All fields required");return;}
    const ok=await onAdd(cat,cid,nm,pr);
    if(ok){setCid("");setNm("");setPr("");setMsg("✓ Added");}
    else setMsg("Failed");
    setTimeout(()=>setMsg(""),2000);
  }
  const inp={border:"1.5px solid #e0e0e0",padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",width:"100%"};
  return(
    <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:16,marginBottom:20}}>
      <div style={{fontSize:12,fontWeight:700,color:NAVY,letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Add New Component</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr 1fr auto",gap:10,alignItems:"end"}}>
        <div>
          <div style={{fontSize:11,color:"#888",marginBottom:4}}>Category</div>
          <input style={inp} placeholder="e.g. CPU" value={cat} onChange={e=>setCat(e.target.value)}/>
        </div>
        <div>
          <div style={{fontSize:11,color:"#888",marginBottom:4}}>Component ID</div>
          <input style={inp} placeholder="e.g. i5-12400" value={cid} onChange={e=>setCid(e.target.value)}/>
        </div>
        <div>
          <div style={{fontSize:11,color:"#888",marginBottom:4}}>Name</div>
          <input style={inp} placeholder="Full component name" value={nm} onChange={e=>setNm(e.target.value)}/>
        </div>
        <div>
          <div style={{fontSize:11,color:"#888",marginBottom:4}}>Price ₹</div>
          <input style={inp} type="number" placeholder="0" value={pr} onChange={e=>setPr(e.target.value)}/>
        </div>
        <button onClick={go} style={{background:NAVY,color:"#fff",border:"none",padding:"10px 18px",fontSize:13,fontWeight:700,cursor:"pointer",height:40}}>Add</button>
      </div>
      {msg&&<div style={{marginTop:8,fontSize:12,color:msg.startsWith("✓")?"#16a34a":RED,fontWeight:600}}>{msg}</div>}
    </div>
  );
}

// ── Seed Banner ───────────────────────────────────────────────────
function SeedBanner({products}){
  const[status,setStatus]=useState(null);
  async function seed(){
    setStatus("loading");
    try{
      const res=await fetch(API+"/products/seed",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":BTKN},body:JSON.stringify(products)});
      const d=await res.json();
      setStatus(res.ok?"done":d.error?.includes("already")?"exists":"error");
    }catch{setStatus("error");}
  }
  if(status==="done") return <div style={{background:"#dcfce7",border:"1px solid #86efac",padding:"14px 20px",marginBottom:24,fontSize:13,fontWeight:600,color:"#15803d"}}>✓ Products seeded to MongoDB!</div>;
  if(status==="exists") return <div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"14px 20px",marginBottom:24,fontSize:13,color:"#854d0e"}}>⚠️ Already seeded. Delete all first to re-seed.</div>;
  return(
    <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
      <div>
        <div style={{fontWeight:700,fontSize:14,color:NAVY}}>First time setup — Seed products to MongoDB</div>
        <div style={{fontSize:12,color:"#555",marginTop:3}}>Pushes {products.length} products from local list into the database. Run once.</div>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {status==="error"&&<span style={{fontSize:12,color:RED,fontWeight:600}}>Failed — is backend running?</span>}
        <button onClick={seed} disabled={status==="loading"}
          style={{background:NAVY,color:"#fff",border:"none",padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer",opacity:status==="loading"?.7:1}}>
          {status==="loading"?"Seeding...":"Seed to Database →"}
        </button>
      </div>
    </div>
  );
}

// ── Stat ──────────────────────────────────────────────────────────
function Stat({label,value,color=NAVY}){
  return(
    <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:"18px 22px",flex:1,minWidth:110}}>
      <div style={{fontSize:26,fontWeight:800,color,lineHeight:1}}>{value}</div>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginTop:6}}>{label}</div>
    </div>
  );
}

// ── MAIN ADMIN ────────────────────────────────────────────────────
export default function Admin({defaultProducts,onExit}){
  const[authed,setAuthed]=useState(false);
  const[pw,setPw]=useState("");
  const[pwErr,setPwErr]=useState(false);
  const[products,setProducts]=useState(()=>ls()||defaultProducts);
  const[tab,setTab]=useState("products");
  const[form,setForm]=useState(EMPTY);
  const[editId,setEditId]=useState(null);
  const[toast,setToast]=useState(null);
  const[delConfirm,setDelConfirm]=useState(null);
  const[filterCat,setFilterCat]=useState("All");
  const[inquiries,setInquiries]=useState([]);
  const[inqLoading,setInqLoading]=useState(false);
  const[pcPrices,setPcPrices]=useState({});
  const[pcLoading,setPcLoading]=useState(false);
  const[pcSaveMsg,setPcSaveMsg]=useState({});

  function showToast(msg,type="success"){ setToast({msg,type}); setTimeout(()=>setToast(null),2800); }
  function persist(arr){ setProducts(arr); ss(arr); }

  // ── Inquiries ──
  async function loadInquiries(){
    setInqLoading(true);
    try{
      const res=await fetch(API+"/inquiries",{headers:{"x-admin-token":BTKN}});
      const d=await res.json();
      if(!res.ok) throw new Error(d.error||"Error "+res.status);
      setInquiries(Array.isArray(d)?d:[]);
    }catch(e){ showToast("Enquiries: "+e.message,"error"); setInquiries([]); }
    setInqLoading(false);
  }
  async function markRead(id){
    try{ await fetch(API+"/inquiries/"+id+"/read",{method:"PUT",headers:{"x-admin-token":BTKN}}); loadInquiries(); }catch{}
  }
  async function deleteInquiry(id){
    try{ await fetch(API+"/inquiries/"+id,{method:"DELETE",headers:{"x-admin-token":BTKN}}); loadInquiries(); }catch{}
  }

  // ── PC Prices ──
  async function loadPcPrices(){
    setPcLoading(true);
    try{ const res=await fetch(API+"/components"); if(res.ok)setPcPrices(await res.json()); }catch{}
    setPcLoading(false);
  }
  async function savePcPrice(cat,cid,price,inStock,name){
    try{
      const res=await fetch(API+"/components/"+cat+"/"+cid,{
        method:"PUT",headers:{"Content-Type":"application/json","x-admin-token":BTKN},
        body:JSON.stringify({price:Number(price),inStock,name,category:cat,componentId:cid})
      });
      if(res.ok){
        setPcSaveMsg(m=>({...m,[cat+":"+cid]:"✓"}));
        setTimeout(()=>setPcSaveMsg(m=>({...m,[cat+":"+cid]:""})),2000);
        loadPcPrices();
      }
    }catch{}
  }
  async function deletePcPart(cat,cid){
    try{ await fetch(API+"/components/"+cat+"/"+cid,{method:"DELETE",headers:{"x-admin-token":BTKN}}); loadPcPrices(); }catch{}
  }
  async function addPcPart(cat,cid,name,price){
    if(!cat||!cid||!name||!price) return false;
    try{
      const res=await fetch(API+"/components/"+cat+"/"+cid,{
        method:"PUT",headers:{"Content-Type":"application/json","x-admin-token":BTKN},
        body:JSON.stringify({price:Number(price),inStock:true,name,category:cat,componentId:cid})
      });
      if(res.ok){loadPcPrices();return true;}
    }catch{}
    return false;
  }
  async function seedPcPrices(){
    const defaults=[
      {category:"CPU",componentId:"i3-12100",name:"Intel Core i3-12100",price:8500,inStock:true},
      {category:"CPU",componentId:"i5-12400",name:"Intel Core i5-12400",price:13000,inStock:true},
      {category:"CPU",componentId:"i5-13600k",name:"Intel Core i5-13600K",price:21000,inStock:true},
      {category:"CPU",componentId:"i7-12700",name:"Intel Core i7-12700",price:26000,inStock:true},
      {category:"CPU",componentId:"r5-5600",name:"AMD Ryzen 5 5600",price:11500,inStock:true},
      {category:"CPU",componentId:"r7-7700x",name:"AMD Ryzen 7 7700X",price:28000,inStock:true},
      {category:"Motherboard",componentId:"h610m",name:"MSI H610M Pro-S",price:6500,inStock:true},
      {category:"Motherboard",componentId:"b660m",name:"MSI B660M Pro-A",price:9500,inStock:true},
      {category:"Motherboard",componentId:"b550m",name:"MSI B550M Pro-VDH",price:8500,inStock:true},
      {category:"Motherboard",componentId:"b650m",name:"MSI B650M Pro-A",price:12500,inStock:true},
      {category:"RAM",componentId:"8d4",name:"8GB DDR4 3200MHz",price:2200,inStock:true},
      {category:"RAM",componentId:"16d4",name:"16GB DDR4 3200MHz",price:3800,inStock:true},
      {category:"RAM",componentId:"32d4",name:"32GB DDR4 3200MHz",price:7500,inStock:true},
      {category:"RAM",componentId:"16d5",name:"16GB DDR5 4800MHz",price:5500,inStock:true},
      {category:"Storage",componentId:"256ssd",name:"256GB NVMe SSD",price:2500,inStock:true},
      {category:"Storage",componentId:"512ssd",name:"512GB NVMe SSD",price:3500,inStock:true},
      {category:"Storage",componentId:"1tssd",name:"1TB NVMe SSD",price:6500,inStock:true},
      {category:"Storage",componentId:"1thdd",name:"1TB HDD 7200RPM",price:3200,inStock:true},
      {category:"GPU",componentId:"1650",name:"NVIDIA GTX 1650 4GB",price:14000,inStock:true},
      {category:"GPU",componentId:"3060",name:"NVIDIA RTX 3060 12GB",price:25000,inStock:true},
      {category:"GPU",componentId:"4060",name:"NVIDIA RTX 4060 8GB",price:32000,inStock:true},
      {category:"GPU",componentId:"rx6600",name:"AMD RX 6600 8GB",price:22000,inStock:true},
      {category:"Cabinet",componentId:"basic",name:"Basic ATX Cabinet",price:2500,inStock:true},
      {category:"Cabinet",componentId:"mid",name:"Mid Tower ATX",price:4500,inStock:true},
      {category:"Cabinet",componentId:"midglass",name:"Mid Tower with Glass",price:5500,inStock:true},
      {category:"PSU",componentId:"450w",name:"450W 80+ Standard",price:3000,inStock:true},
      {category:"PSU",componentId:"550wb",name:"550W 80+ Bronze",price:4500,inStock:true},
      {category:"PSU",componentId:"650wg",name:"650W 80+ Gold",price:6500,inStock:true},
      {category:"Cooler",componentId:"stock",name:"Stock Cooler",price:0,inStock:true},
      {category:"Cooler",componentId:"hm212",name:"Cooler Master Hyper 212",price:2500,inStock:true},
      {category:"Cooler",componentId:"aio240",name:"240mm AIO Liquid Cooler",price:6000,inStock:true},
    ];
    try{
      const res=await fetch(API+"/components/seed",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":BTKN},body:JSON.stringify(defaults)});
      const d=await res.json();
      showToast(d.message||"Seeded!");
      loadPcPrices();
    }catch{ showToast("Seed failed","error"); }
  }

  // ── Products ──
  function handleSave(){
    if(!form.name.trim()||!form.price.trim()){showToast("Name and Price required","error");return;}
    const spec=form.spec.trim()||Object.values(form.specs).filter(Boolean).slice(0,4).join(" · ");
    const highlights=form.highlights.filter(h=>h.trim());
    if(editId!==null){
      persist(products.map(p=>p.id===editId?{...form,id:editId,spec,highlights}:p));
      showToast(`"${form.name}" updated`);
    }else{
      persist([...products,{...form,id:Date.now(),spec,highlights}]);
      showToast(`"${form.name}" added`);
    }
    setForm(EMPTY); setEditId(null); setTab("products");
  }
  function handleEdit(p){
    setForm({name:p.name,cat:p.cat,price:p.price,icon:p.icon,isNew:p.isNew||false,inStock:p.inStock!==false,image:p.image||"",spec:p.spec||"",specs:p.specs||{},highlights:p.highlights?.length?p.highlights:["","","",""]});
    setEditId(p.id); setTab("add"); window.scrollTo({top:0,behavior:"smooth"});
  }
  function handleDelete(id){ persist(products.filter(p=>p.id!==id)); setDelConfirm(null); showToast("Deleted","error"); }
  function toggleNew(id){ persist(products.map(p=>p.id===id?{...p,isNew:!p.isNew}:p)); }
  function toggleStock(id){ persist(products.map(p=>p.id===id?{...p,inStock:p.inStock===false?true:false}:p)); }

  const filtered=filterCat==="All"?products:products.filter(p=>p.cat===filterCat);
  const newCount=inquiries.filter(i=>!i.read).length;

  const inp={width:"100%",border:"1.5px solid #e0e0e0",padding:"10px 13px",fontSize:14,outline:"none",fontFamily:"inherit",transition:"border-color .15s",color:"#111"};
  const foc=e=>e.target.style.borderColor=NAVY;
  const blr=e=>e.target.style.borderColor="#e0e0e0";

  // ── Login ──
  if(!authed) return(
    <div style={{minHeight:"100vh",background:"#f0f2f8",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}"}</style>
      <div style={{background:"#fff",width:"100%",maxWidth:380,padding:"48px 40px",border:"1px solid #e8e8e8"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:32}}>
          <div style={{background:NAVY,padding:"5px 12px",display:"flex",alignItems:"center"}}>
            <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>AD</span><span style={{fontSize:18,fontWeight:800,color:RED}}>V</span><span style={{fontSize:18,fontWeight:800,color:"#fff"}}>ANTAGE</span>
          </div>
          <div style={{background:"#fff",border:"1px solid "+NAVY,padding:"2px 8px",display:"flex",alignItems:"center"}}>
            <span style={{fontSize:8,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:NAVY}}>ADMIN</span>
          </div>
        </div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:6}}>Admin Access</div>
        <h2 style={{fontSize:24,fontWeight:800,color:NAVY,marginBottom:28}}>Sign In</h2>
        <input type="password" placeholder="Admin password" value={pw}
          onChange={e=>{setPw(e.target.value);setPwErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&(pw===ADMIN_PASSWORD?(setAuthed(true)):setPwErr(true))}
          style={{...inp,borderColor:pwErr?RED:"#ddd",marginBottom:8}}/>
        {pwErr&&<div style={{fontSize:13,color:RED,marginBottom:12,fontWeight:500}}>Incorrect password.</div>}
        <button onClick={()=>pw===ADMIN_PASSWORD?(setAuthed(true)):setPwErr(true)}
          style={{width:"100%",background:NAVY,color:"#fff",border:"none",padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          Sign In →
        </button>
        <button onClick={onExit} style={{width:"100%",marginTop:12,background:"none",border:"none",fontSize:13,color:"#aaa",cursor:"pointer",padding:"8px 0",fontFamily:"inherit"}}>← Back to Website</button>
      </div>
    </div>
  );

  // ── Main ──
  return(
    <div style={{minHeight:"100vh",background:"#f5f7fa",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .adm-inp{width:100%;border:1.5px solid #e0e0e0;padding:10px 13px;font-size:14px;outline:none;background:#fff;transition:border-color .15s;font-family:inherit;color:#111;}
        .adm-inp:focus{border-color:${NAVY};}
        .tab-btn{padding:9px 20px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .15s;font-family:inherit;letter-spacing:.02em;}
        .tab-btn.active{background:${NAVY};color:#fff;}
        .tab-btn:not(.active){background:#fff;color:#555;border:1.5px solid #e0e0e0;}
        .prod-row{background:#fff;border:1.5px solid #e8e8e8;padding:14px 18px;display:flex;align-items:center;gap:14px;transition:border-color .2s;}
        .prod-row:hover{border-color:${NAVY};}
        .cf-btn{padding:6px 14px;border:1.5px solid #e0e0e0;background:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;color:#555;transition:all .15s;}
        .cf-btn.on{background:${NAVY};color:#fff;border-color:${NAVY};}
        .act-btn{padding:6px 14px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.02em;transition:all .15s;}
      `}</style>

      {/* Top Bar */}
      <div style={{background:NAVY,height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{background:"rgba(255,255,255,.1)",padding:"4px 10px"}}>
              <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>AD</span><span style={{fontSize:16,fontWeight:800,color:RED}}>V</span><span style={{fontSize:16,fontWeight:800,color:"#fff"}}>ANTAGE</span>
            </div>
            <div style={{background:"rgba(255,255,255,.08)",padding:"2px 8px",borderLeft:"2px solid "+RED}}>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>ADMIN</span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{products.length} products</span>
          <button onClick={onExit} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.8)",padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← View Website</button>
          <button onClick={()=>setAuthed(false)} style={{background:"none",border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.4)",padding:"7px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Logout</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 24px"}}>

        {/* Stats */}
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
          <Stat label="Total" value={products.length}/>
          {CATS.map(c=><Stat key={c} label={c.replace(" & CCTV","")} value={products.filter(p=>p.cat===c).length}/>)}
          <Stat label="NEW" value={products.filter(p=>p.isNew).length} color={RED}/>
          <Stat label="Out of Stock" value={products.filter(p=>p.inStock===false).length} color="#d97706"/>
        </div>

        <SeedBanner products={products}/>

        {/* Tabs */}
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
          <button className={`tab-btn${tab==="products"?" active":""}`} onClick={()=>{setTab("products");setForm(EMPTY);setEditId(null);}}>📋 Products ({products.length})</button>
          <button className={`tab-btn${tab==="add"?" active":""}`} onClick={()=>{setTab("add");if(!editId)setForm(EMPTY);}}>{editId!==null?"✏️ Edit":"➕ Add Product"}</button>
          <button className={`tab-btn${tab==="inquiries"?" active":""}`} onClick={()=>{setTab("inquiries");loadInquiries();}}>📩 Enquiries{newCount>0?" ("+newCount+" new)":""}</button>
          <button className={`tab-btn${tab==="pcprices"?" active":""}`} onClick={()=>{setTab("pcprices");loadPcPrices();}}>🔧 PC Prices</button>
        </div>

        {/* ══ PRODUCTS TAB ══ */}
        {tab==="products"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["All",...CATS].map(c=><button key={c} className={`cf-btn${filterCat===c?" on":""}`} onClick={()=>setFilterCat(c)}>{c}</button>)}
              </div>
              <button onClick={()=>window.confirm("Reset to defaults?")&&persist(defaultProducts)} style={{background:"none",border:"1.5px solid #e0e0e0",padding:"7px 14px",fontSize:12,fontWeight:600,color:"#888",cursor:"pointer",fontFamily:"inherit"}}>↺ Reset</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.length===0&&<div style={{textAlign:"center",padding:"48px",background:"#fff",border:"1px solid #e8e8e8",color:"#aaa"}}>No products.</div>}
              {filtered.map(p=>(
                <div key={p.id} className="prod-row">
                  {p.image?<img src={p.image} alt="" style={{width:48,height:48,objectFit:"contain",flexShrink:0}}/>:<span style={{fontSize:28,flexShrink:0}}>{p.icon}</span>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                      <span style={{fontWeight:700,fontSize:15,color:NAVY}}>{p.name}</span>
                      {p.isNew&&<span style={{background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",letterSpacing:".06em",textTransform:"uppercase"}}>NEW</span>}
                      {p.inStock===false&&<span style={{background:"#d97706",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",letterSpacing:".06em",textTransform:"uppercase"}}>OUT OF STOCK</span>}
                    </div>
                    <div style={{fontSize:11,color:"#888",display:"flex",gap:12,flexWrap:"wrap"}}>
                      <span style={{color:RED,fontWeight:600,textTransform:"uppercase"}}>{p.cat}</span>
                      <span>{p.spec}</span>
                    </div>
                  </div>
                  <div style={{fontWeight:800,fontSize:15,color:NAVY,flexShrink:0}}>{p.price}</div>
                  <div style={{display:"flex",gap:6,flexShrink:0,flexWrap:"wrap"}}>
                    <button className="act-btn" onClick={()=>toggleNew(p.id)} style={{background:p.isNew?"#fef2f2":"#f0f2f8",color:p.isNew?RED:NAVY,fontSize:11}}>
                      {p.isNew?"★ NEW":"☆ NEW"}
                    </button>
                    <button className="act-btn" onClick={()=>toggleStock(p.id)} style={{background:p.inStock===false?"#fef9c3":"#f0fdf4",color:p.inStock===false?"#854d0e":"#16a34a",fontSize:11}}>
                      {p.inStock===false?"✗ Stock":"✓ Stock"}
                    </button>
                    <button className="act-btn" onClick={()=>handleEdit(p)} style={{background:"#eef2ff",color:NAVY}}>Edit</button>
                    <button className="act-btn" onClick={()=>setDelConfirm(p.id)} style={{background:"#fff0f0",color:RED}}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ADD / EDIT TAB ══ */}
        {tab==="add"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"start"}}>
            {/* Left — Form */}
            <div style={{display:"flex",flexDirection:"column",gap:18}}>

              {/* Basic */}
              <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:24}}>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:16}}>Basic Info</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <input className="adm-inp" placeholder="Product Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <div style={{fontSize:11,color:"#888",marginBottom:6}}>Category</div>
                      <select className="adm-inp" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value,specs:{}}))}>
                        {CATS.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{fontSize:11,color:"#888",marginBottom:6}}>Price *</div>
                      <input className="adm-inp" placeholder="₹0,000" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                    <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500,color:NAVY}}>
                      <input type="checkbox" checked={form.isNew} onChange={e=>setForm(f=>({...f,isNew:e.target.checked}))} style={{accentColor:RED,width:16,height:16}}/>
                      Mark as NEW
                    </label>
                    <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500,color:"#16a34a"}}>
                      <input type="checkbox" checked={form.inStock!==false} onChange={e=>setForm(f=>({...f,inStock:e.target.checked}))} style={{accentColor:"#16a34a",width:16,height:16}}/>
                      In Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:24}}>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:16}}>Product Image</div>
                <div style={{border:"2px dashed #dde2f0",padding:20,textAlign:"center",background:"#f9fbff",cursor:"pointer",position:"relative"}}
                  onClick={()=>document.getElementById("img-up").click()}
                  onDragOver={e=>e.preventDefault()}
                  onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.type.startsWith("image/")){const r=new FileReader();r.onload=ev=>setForm(fm=>({...fm,image:ev.target.result}));r.readAsDataURL(f);}}}>
                  <input id="img-up" type="file" accept="image/*" style={{display:"none"}}
                    onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setForm(fm=>({...fm,image:ev.target.result}));r.readAsDataURL(f);}}}/>
                  {form.image?(
                    <div style={{position:"relative",display:"inline-block"}}>
                      <img src={form.image} alt="" style={{maxHeight:120,maxWidth:"100%",objectFit:"contain",display:"block",margin:"0 auto"}}/>
                      <button onClick={e=>{e.stopPropagation();setForm(f=>({...f,image:""}));}} style={{position:"absolute",top:-8,right:-8,background:RED,color:"#fff",border:"none",width:22,height:22,borderRadius:"50%",fontSize:12,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                    </div>
                  ):(
                    <>
                      <div style={{fontSize:28,marginBottom:8}}>📷</div>
                      <div style={{fontSize:13,fontWeight:600,color:NAVY}}>Click or drag & drop</div>
                      <div style={{fontSize:11,color:"#aaa",marginTop:4}}>JPG, PNG, WebP</div>
                    </>
                  )}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 0 4px"}}>
                  <div style={{flex:1,height:1,background:"#e8e8e8"}}/><span style={{fontSize:11,color:"#aaa",fontWeight:600}}>OR</span><div style={{flex:1,height:1,background:"#e8e8e8"}}/>
                </div>
                <input className="adm-inp" placeholder="Paste image URL" value={form.image.startsWith("data:")?"":(form.image||"")} onChange={e=>setForm(f=>({...f,image:e.target.value}))}/>
              </div>

              {/* Icon */}
              <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:24}}>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:12}}>Fallback Icon <span style={{fontWeight:400,color:"#aaa",textTransform:"none"}}>(if no image)</span></div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {ICONS.map(ic=>(
                    <button key={ic} onClick={()=>setForm(f=>({...f,icon:ic}))}
                      style={{fontSize:22,padding:"8px 10px",border:"2px solid "+(form.icon===ic?NAVY:"#e0e0e0"),background:form.icon===ic?"#eef2ff":"#fff",cursor:"pointer",transition:"all .15s"}}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:24}}>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:16}}>Specifications</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(SPEC_KEYS[form.cat]||SPEC_KEYS.Accessories).map(k=>(
                    <div key={k} style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:600,color:"#555",letterSpacing:".03em"}}>{k}</span>
                      <input className="adm-inp" value={form.specs[k]||""} onChange={e=>setForm(f=>({...f,specs:{...f.specs,[k]:e.target.value}}))} placeholder={"Enter "+k.toLowerCase()}/>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:16}}>
                  <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:8}}>Short Summary (auto-generated if blank)</div>
                  <input className="adm-inp" value={form.spec} onChange={e=>setForm(f=>({...f,spec:e.target.value}))} placeholder="e.g. Intel i5 · 8GB · 512GB SSD"/>
                </div>
              </div>

              {/* Highlights */}
              <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:24}}>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:12}}>Key Highlights</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[0,1,2,3].map(i=>(
                    <input key={i} className="adm-inp" placeholder={"Highlight "+(i+1)} value={form.highlights[i]||""}
                      onChange={e=>{const h=[...form.highlights];h[i]=e.target.value;setForm(f=>({...f,highlights:h}));}}/>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div style={{display:"flex",gap:12}}>
                <button onClick={handleSave}
                  style={{flex:1,background:NAVY,color:"#fff",border:"none",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                  onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                  {editId!==null?"Update Product ✓":"Add Product +"}
                </button>
                <button onClick={()=>{setForm(EMPTY);setEditId(null);setTab("products");}}
                  style={{padding:"14px 24px",background:"none",border:"1.5px solid #ddd",color:"#666",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  Cancel
                </button>
              </div>
            </div>

            {/* Right — Preview */}
            <div style={{background:"#fff",border:"1px solid #e8e8e8",padding:20,position:"sticky",top:72}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:14}}>Preview</div>
              <div style={{background:"#f5f5f5",height:140,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,overflow:"hidden",position:"relative"}}>
                {form.isNew&&<span style={{position:"absolute",top:8,left:8,background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",letterSpacing:".06em",textTransform:"uppercase"}}>NEW</span>}
                {form.inStock===false&&<span style={{position:"absolute",top:8,right:8,background:"#d97706",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",letterSpacing:".06em",textTransform:"uppercase"}}>OUT OF STOCK</span>}
                {form.image?<img src={form.image} alt="" style={{maxHeight:140,maxWidth:"100%",objectFit:"contain",padding:8}}/>:<span style={{fontSize:56}}>{form.icon}</span>}
              </div>
              <div style={{fontSize:10,color:RED,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>{form.cat}</div>
              <div style={{fontWeight:700,fontSize:16,color:NAVY,marginBottom:4,lineHeight:1.2}}>{form.name||"Product Name"}</div>
              <div style={{fontSize:12,color:"#888",marginBottom:8}}>{form.spec||Object.values(form.specs).filter(Boolean).slice(0,3).join(" · ")||"Specifications"}</div>
              <div style={{fontWeight:800,fontSize:20,color:NAVY}}>{form.price||"₹0,000"}</div>
              <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:4}}>
                {form.highlights.filter(h=>h.trim()).map((h,i)=>(
                  <div key={i} style={{fontSize:12,color:"#444",display:"flex",gap:6,alignItems:"flex-start"}}>
                    <span style={{color:RED,fontWeight:700,flexShrink:0}}>✓</span>{h}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ ENQUIRIES TAB ══ */}
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
                <div key={inq._id||inq.id} style={{background:"#fff",border:"1.5px solid "+(inq.read?"#e8e8e8":NAVY),padding:"18px 20px",display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:15,color:NAVY}}>{inq.name}</span>
                      <span style={{fontSize:12,color:"#888"}}>📞 {inq.phone}</span>
                      {inq.email&&<span style={{fontSize:12,color:"#888"}}>✉️ {inq.email}</span>}
                      {!inq.read&&<span style={{background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",letterSpacing:".04em",textTransform:"uppercase"}}>NEW</span>}
                    </div>
                    <div style={{fontSize:12,color:RED,fontWeight:600,marginBottom:6}}>{inq.product}</div>
                    <div style={{fontSize:13,color:"#444",lineHeight:1.6,whiteSpace:"pre-line"}}>{inq.message}</div>
                    <div style={{fontSize:11,color:"#aaa",marginTop:8}}>{new Date(inq.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexShrink:0,flexDirection:"column"}}>
                    <a href={"https://wa.me/91"+inq.phone.replace(/[^0-9]/g,"")+"?text="+encodeURIComponent("Hi "+inq.name+", regarding your enquiry about "+inq.product+"...")}
                      target="_blank" rel="noreferrer"
                      style={{background:"#25D366",color:"#fff",padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",textDecoration:"none",display:"block",textAlign:"center"}}>
                      💬 WhatsApp
                    </a>
                    {!inq.read&&<button onClick={()=>markRead(inq._id||inq.id)} style={{background:"#eef2ff",color:NAVY,border:"none",padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✓ Mark Read</button>}
                    <button onClick={()=>deleteInquiry(inq._id||inq.id)} style={{background:"#fff0f0",color:RED,border:"none",padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PC PRICES TAB ══ */}
        {tab==="pcprices"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontWeight:700,fontSize:16,color:NAVY}}>PC Component Prices</div>
                <div style={{fontSize:12,color:"#888",marginTop:2}}>Edit prices and stock status. Changes reflect in PC Builder immediately.</div>
              </div>
              <button onClick={seedPcPrices} style={{background:"#eef2ff",color:NAVY,border:"1px solid #dde2f0",padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                Seed Default Prices (First Time)
              </button>
            </div>

            <AddPartForm onAdd={addPcPart}/>

            {pcLoading&&<div style={{textAlign:"center",padding:40,color:"#888"}}>Loading prices...</div>}
            {!pcLoading&&Object.keys(pcPrices).length===0&&(
              <div style={{background:"#fff3cd",border:"1px solid #ffe69c",padding:"14px 18px",fontSize:13,color:"#856404",marginBottom:20}}>
                No prices in DB yet. Click <strong>"Seed Default Prices"</strong> to get started, then edit them here.
              </div>
            )}
            {Object.entries(pcPrices).map(([category,items])=>(
              <div key={category} style={{marginBottom:24}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:RED,marginBottom:10,padding:"6px 0",borderBottom:"2px solid #dde2f0"}}>{category}</div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"#f5f7fa"}}>
                      {["Component","Price (₹)","Stock","Updated","Actions"].map(h=>(
                        <td key={h} style={{padding:"8px 14px",fontSize:11,fontWeight:700,color:"#777",textTransform:"uppercase",letterSpacing:".06em"}}>{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item=>(
                      <PcPriceRow key={item.componentId} item={item} category={category}
                        saveMsg={pcSaveMsg[category+":"+item.componentId]||""}
                        onSave={(price,inStock)=>savePcPrice(category,item.componentId,price,inStock,item.name)}
                        onDelete={deletePcPart}/>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {delConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",maxWidth:360,width:"100%",padding:"40px 32px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>🗑️</div>
            <div style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:8}}>Delete this product?</div>
            <p style={{fontSize:14,color:"#666",marginBottom:28}}>This cannot be undone.</p>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setDelConfirm(null)} style={{flex:1,background:"#f5f5f5",border:"none",padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
              <button onClick={()=>handleDelete(delConfirm)} style={{flex:1,background:RED,color:"#fff",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast&&(
        <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?RED:NAVY,color:"#fff",padding:"12px 24px",fontSize:14,fontWeight:600,zIndex:3000,boxShadow:"0 4px 20px rgba(0,0,0,.2)",whiteSpace:"nowrap"}}>
          {toast.type==="error"?"⚠️":"✓"} {toast.msg}
        </div>
      )}
    </div>
  );
}