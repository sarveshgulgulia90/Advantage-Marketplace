import { useState, useEffect, useRef } from "react";
import Admin from "./Admin";
import PCBuilder from "./PCBuilder";

const NAVY = "#0B1F5E";
const RED  = "#CC1A1A";
const API  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function useProducts(defaults) {
  const [products, setProducts] = useState(() => {
    try { const s = localStorage.getItem("advantage_products"); return s ? JSON.parse(s) : defaults; }
    catch { return defaults; }
  });
  useEffect(() => {
    const fn = () => {
      try { const s = localStorage.getItem("advantage_products"); if (s) setProducts(JSON.parse(s)); }
      catch {}
    };
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);
  return products;
}

const PRODUCTS = [
  { id:1,  name:"HP Pavilion 15",           cat:"Laptops",    icon:"💻", isNew:false, price:"₹52,990",
    spec:"Intel i5-1235U · 8GB RAM · 512GB SSD · Win 11", image:"",
    specs:{"Processor":"Intel Core i5-1235U (12th Gen, 10 Cores)","RAM":"8GB DDR4 (Expandable to 16GB)","Storage":"512GB NVMe SSD","Display":"15.6\" FHD IPS Anti-Glare (1920×1080)","Graphics":"Intel Iris Xe Graphics","Operating System":"Windows 11 Home","Battery":"41Wh, Up to 7 Hours","Ports":"2× USB-A, 1× USB-C, HDMI, SD Card, 3.5mm","Connectivity":"Wi-Fi 6, Bluetooth 5.0","Weight":"1.75 kg","Warranty":"1 Year On-site"},
    highlights:["12th Gen Intel Processor","Fast NVMe SSD","FHD IPS Display","Windows 11 Pre-installed"] },
  { id:2,  name:"Lenovo IdeaPad Slim 3",    cat:"Laptops",    icon:"💻", isNew:true,  price:"₹46,500",
    spec:"AMD Ryzen 5 · 16GB RAM · 512GB SSD · Win 11", image:"",
    specs:{"Processor":"AMD Ryzen 5 7520U (4 Cores, up to 4.3GHz)","RAM":"16GB LPDDR5 (Soldered)","Storage":"512GB NVMe SSD","Display":"15.6\" FHD IPS (1920×1080, 300 Nits)","Graphics":"AMD Radeon 610M Integrated","Operating System":"Windows 11 Home","Battery":"47Wh, Up to 9 Hours","Ports":"2× USB-A 3.2, 1× USB-C, HDMI 1.4, 3.5mm","Connectivity":"Wi-Fi 6, Bluetooth 5.1","Weight":"1.62 kg","Warranty":"1 Year On-site"},
    highlights:["AMD Ryzen 5 Processor","16GB RAM — Best Value","9 Hr Battery Life","Slim & Lightweight"] },
  { id:3,  name:"Asus VivoBook 15 OLED",    cat:"Laptops",    icon:"💻", isNew:false, price:"₹44,990",
    spec:"Intel i3-1215U · 8GB RAM · 512GB SSD · OLED", image:"",
    specs:{"Processor":"Intel Core i3-1215U (12th Gen, 6 Cores)","RAM":"8GB DDR4 (Expandable to 12GB)","Storage":"512GB M.2 NVMe SSD","Display":"15.6\" FHD OLED (1920×1080, 600 Nits, VESA HDR)","Graphics":"Intel UHD Graphics","Operating System":"Windows 11 Home","Battery":"42Wh, Up to 6 Hours","Ports":"1× USB-A 3.2, 2× USB-A 2.0, 1× USB-C, HDMI, 3.5mm","Connectivity":"Wi-Fi 6E, Bluetooth 5.0","Weight":"1.80 kg","Warranty":"1 Year On-site"},
    highlights:["OLED Display — Vivid Colours","12th Gen Intel Core i3","512GB Fast SSD","TÜV Rheinland Eye Care"] },
  { id:4,  name:"Dell Inspiron 15",          cat:"Laptops",    icon:"💻", isNew:false, price:"₹55,000",
    spec:"Intel i5 · 16GB RAM · 1TB HDD + 256GB SSD", image:"",
    specs:{"Processor":"Intel Core i5-1235U (12th Gen)","RAM":"16GB DDR4 (2 Slots, Expandable to 32GB)","Storage":"256GB SSD + 1TB HDD","Display":"15.6\" FHD WVA Anti-Glare (1920×1080)","Graphics":"Intel UHD Graphics","Operating System":"Windows 11 Home","Battery":"54Wh, Up to 8 Hours","Ports":"2× USB-A, 1× USB-C, HDMI, SD Card, RJ-45, 3.5mm","Connectivity":"Wi-Fi 6, Bluetooth 5.2","Weight":"1.86 kg","Warranty":"1 Year On-site"},
    highlights:["Dual Storage — SSD + HDD","16GB RAM Standard","RJ-45 Ethernet Port","Dell Reliability"] },
  { id:5,  name:"HP 280 Pro G9 Desktop",    cat:"Desktops",   icon:"🖥️", isNew:false, price:"₹36,000",
    spec:"Core i3-12100 · 8GB · 1TB HDD · Win 11", image:"",
    specs:{"Processor":"Intel Core i3-12100 (12th Gen, 4 Cores, up to 4.3GHz)","RAM":"8GB DDR4 (Expandable to 64GB)","Storage":"1TB SATA HDD","Form Factor":"Micro Tower","Graphics":"Intel UHD Graphics 730","Operating System":"Windows 11 Pro","Ports":"USB-A 3.2, USB-C, DisplayPort, VGA, RJ-45","Connectivity":"Intel Gigabit Ethernet","Warranty":"1 Year On-site"},
    highlights:["12th Gen Intel Core i3","Windows 11 Pro Included","Easily Upgradeable","Ideal for Office"] },
  { id:6,  name:"Dell Vostro 3020",          cat:"Desktops",   icon:"🖥️", isNew:true,  price:"₹42,500",
    spec:"Core i5 · 8GB · 512GB SSD · Win 11 Pro", image:"",
    specs:{"Processor":"Intel Core i5-12400 (12th Gen, 6 Cores, up to 4.4GHz)","RAM":"8GB DDR4 (Expandable to 64GB)","Storage":"512GB M.2 NVMe SSD","Form Factor":"Small Form Factor (SFF)","Graphics":"Intel UHD Graphics 730","Operating System":"Windows 11 Pro","Ports":"4× USB-A, 1× USB-C, HDMI, DisplayPort, RJ-45","Connectivity":"Gigabit Ethernet, Bluetooth 5.0, Wi-Fi 6","Warranty":"1 Year ProSupport On-site"},
    highlights:["Core i5 12th Gen SFF PC","512GB NVMe SSD","Win 11 Pro for Business","Dell ProSupport"] },
  { id:7,  name:"Canon PIXMA G3770",         cat:"Printers",   icon:"🖨️", isNew:false, price:"₹14,499",
    spec:"Wireless · All-in-One · Color Ink Tank", image:"",
    specs:{"Type":"Ink Tank All-in-One (Print, Scan, Copy)","Print Technology":"FINE Inkjet","Print Speed":"Up to 11 ipm (Black), 6 ipm (Color)","Print Resolution":"4800 × 1200 dpi","Connectivity":"Wi-Fi, USB","Scanner":"Flatbed CIS, 600 × 1200 dpi","Paper Size":"A4, A5, B5, Letter, Legal","Page Yield":"Approx. 6,000 (Black), 7,700 (Color)","Warranty":"1 Year On-site"},
    highlights:["High-Yield Ink Tank","Wi-Fi Direct Printing","Low Cost Per Page","Print + Scan + Copy"] },
  { id:8,  name:"HP LaserJet 107a",          cat:"Printers",   icon:"🖨️", isNew:false, price:"₹8,299",
    spec:"Mono Laser · 20ppm · USB · Compact", image:"",
    specs:{"Type":"Mono Laser Printer","Print Speed":"20 ppm","Print Resolution":"600 × 600 dpi (up to 1200 × 1200)","First Page Out":"7.8 seconds","Connectivity":"USB 2.0","Paper Capacity":"150 Sheet Input Tray","Toner Cartridge":"HP 106A Black (~1,000 pages)","Warranty":"1 Year On-site"},
    highlights:["Fast 20ppm Speed","Compact Office Design","Low Running Cost","HP Laser Quality"] },
  { id:9,  name:"Logitech MK235 Combo",      cat:"Accessories",icon:"⌨️", isNew:false, price:"₹1,499",
    spec:"Wireless Keyboard & Mouse Combo · USB", image:"",
    specs:{"Type":"Wireless Keyboard + Mouse Combo","Connectivity":"2.4GHz Wireless via USB Nano Receiver","Keyboard Layout":"Full Size, Indian Layout","Keyboard Battery":"2× AAA (up to 36 Months)","Mouse Type":"Optical, 1000 DPI","Mouse Battery":"1× AA (up to 12 Months)","Range":"Up to 10 Meters","Compatibility":"Windows 7/8/10/11","Warranty":"3 Years"},
    highlights:["Long Battery Life","Nano USB Receiver","Full-Size Layout","3-Year Warranty"] },
  { id:10, name:"Dell 21.5\" Monitor",       cat:"Accessories",icon:"🖥️", isNew:false, price:"₹12,800",
    spec:"FHD IPS · HDMI · VGA · Eye Care · Tilt", image:"",
    specs:{"Screen Size":"21.5 Inches","Panel Type":"IPS","Resolution":"1920 × 1080 (Full HD)","Brightness":"250 cd/m²","Refresh Rate":"75 Hz","Response Time":"8ms (GtG)","Ports":"1× HDMI, 1× VGA","Stand":"Tilt Adjustable","Eye Care":"ComfortView, Flicker-Free","Warranty":"3 Years"},
    highlights:["IPS Panel — Wide Viewing Angle","75Hz Refresh Rate","Flicker-Free & Low Blue Light","HDMI + VGA"] },
  { id:11, name:"HP 27\" FHD Monitor",       cat:"Accessories",icon:"🖥️", isNew:true,  price:"₹18,500",
    spec:"Full HD IPS · HDMI · Low Blue Light · 75Hz", image:"",
    specs:{"Screen Size":"27 Inches","Panel Type":"IPS","Resolution":"1920 × 1080 (Full HD)","Brightness":"300 cd/m²","Refresh Rate":"75 Hz","Response Time":"5ms (GtG)","Ports":"1× HDMI, 1× VGA, 1× Audio Out","Stand":"Tilt (-5° to +22°)","Eye Care":"HP Eye Ease, Low Blue Light (TÜV Certified)","Warranty":"3 Years"},
    highlights:["Large 27\" Display","TÜV Low Blue Light","75Hz Smooth Display","For Work & Study"] },
  { id:12, name:"Seagate 1TB External HDD",  cat:"Accessories",icon:"💾", isNew:false, price:"₹3,999",
    spec:"USB 3.0 · Portable · Windows & Mac", image:"",
    specs:{"Capacity":"1TB","Interface":"USB 3.0 (USB 2.0 Compatible)","Form Factor":"2.5\" Portable","Transfer Speed":"Up to 120 MB/s","Compatibility":"Windows, Mac, PS4, Xbox","Power":"Bus Powered (No adapter)","Weight":"159 g","Warranty":"2 Years"},
    highlights:["1TB Portable Storage","USB 3.0 Fast Transfer","Works with PC, Mac & Consoles","Bus Powered"] },
];

const MEGA_MENU = {
  Laptops: { sections:[
    { head:"By Use",    items:["For Home","For Students","For Work","For Gaming"] },
    { head:"By Brand",  items:["HP Laptops","Dell Laptops","Lenovo Laptops","Asus Laptops","Acer Laptops","MSI Laptops"] },
    { head:"By Budget", items:["Under ₹30,000","₹30,000–₹50,000","₹50,000–₹80,000","Above ₹80,000"] },
  ]},
  Desktops: { sections:[
    { head:"Type",  items:["Tower PCs","All-in-One PCs","Mini PCs","Workstations"] },
    { head:"Brand", items:["HP Desktops","Dell Desktops","Lenovo Desktops"] },
  ]},
  Printers: { sections:[
    { head:"Type",  items:["Inkjet Printers","Laser Printers","All-in-One Printers","Ink Tank Printers"] },
    { head:"Brand", items:["HP Printers","Canon Printers","Epson Printers"] },
  ]},
  Accessories: { sections:[
    { head:"Input",             items:["Keyboards","Mouse","Combos","Webcams"] },
    { head:"Display & Storage", items:["Monitors","External HDDs","Pen Drives","SSDs"] },
    { head:"Connectivity",      items:["USB Hubs","HDMI Cables","Networking","Adapters"] },
  ]},
  "Security & CCTV": { sections:[
    { head:"Cameras",      items:["IP Cameras","CCTV Cameras","PTZ Cameras","Dome Cameras","Bullet Cameras"] },
    { head:"Systems",      items:["DVR Systems","NVR Systems","Complete CCTV Kits","Video Door Phones"] },
    { head:"Access Control",items:["Biometric Attendance","Door Access Systems","Electric Locks","Video Intercoms"] },
    { head:"Brands",       items:["CP Plus","Hikvision","Dahua","Godrej"] },
  ]},
  "Repair & Service": { sections:[
    { head:"Device",       items:["Laptop Repair","Desktop Repair","Printer Service","Screen Replacement"] },
    { head:"Service Type", items:["Carry-in Service","Onsite Visit","OS Installation"] },
  ]},
};

const HERO_SLIDES = [
  { tag:"New Arrivals",            title:"Laptops Built\nFor Every Need",  sub:"Intel 12th Gen · AMD Ryzen · Starting ₹29,999", cta1:"Shop Laptops",  cta2:"Get Quote", cat:"Laptops",  bg:"linear-gradient(135deg,#0B1F5E 0%,#071240 100%)", icon:"💻" },
  { tag:"Expert Service",          title:"Repair Done\nRight. Fast.",      sub:"Laptops · Desktops · Printers · All Brands",     cta1:"Book Enquiry",  cta2:"Call Us",   cat:"Repair",   bg:"linear-gradient(135deg,#0a0a14 0%,#0B1F5E 100%)", icon:"🔧" },
  { tag:"Desktops & Workstations", title:"Power That\nMeans Business",     sub:"Assembled PCs · Branded Desktops · Upgrades",    cta1:"Shop Desktops", cta2:"Get Quote", cat:"Desktops", bg:"linear-gradient(135deg,#07122e 0%,#0d1e50 100%)", icon:"🖥️" },
];

const CATEGORIES = [
  { icon:"💻", label:"Laptops",   sub:"HP, Dell, Lenovo, Asus, Acer" },
  { icon:"🖥️", label:"Desktops",  sub:"Tower, AIO, Mini PCs" },
  { icon:"🖨️", label:"Printers",  sub:"Inkjet, Laser, Ink Tank" },
  { icon:"⌨️", label:"Keyboards", sub:"Wired, Wireless, Mechanical" },
  { icon:"🖱️", label:"Mouse",     sub:"Wired, Wireless, Gaming" },
  { icon:"🖥️", label:"Monitors",  sub:"FHD, QHD, Gaming Displays" },
  { icon:"💾", label:"Storage",   sub:"HDD, SSD, Pen Drives" },
  { icon:"🔧", label:"Services",  sub:"Carry-in & Onsite Service" },
];

const SERVICES_LIST = [
  { icon:"💻", title:"Laptop Repair",   items:["Screen replacement","Battery & keyboard","Motherboard repair","Hinge & port fix"] },
  { icon:"🖥️", title:"Desktop Service", items:["Custom PC assembly","Hardware upgrades","Virus removal","Data recovery"] },
  { icon:"🖨️", title:"Printer Service", items:["Cartridge & ink refill","Print head cleaning","Network printer setup","Hardware faults"] },
  { icon:"🏠", title:"Onsite Support",  items:["Home & office visits","LAN & WiFi setup","OS installation","Annual maintenance"] },
];

const BRANDS = ["HP","Dell","Lenovo","Asus","Acer","Canon","Epson","Logitech","Intel","AMD","TP-Link"];

// ─── HELPERS ───────────────────────────────────────────────────────
function useScrollY(){ const[y,setY]=useState(0); useEffect(()=>{const fn=()=>setY(window.scrollY);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);return y; }
function useInView(t=0.12){ const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[t]);return[ref,v]; }
function Fade({children,delay=0}){ const[ref,v]=useInView();return <div ref={ref} style={{opacity:v?1:0,transform:v?"none":"translateY(16px)",transition:"opacity .5s ease "+delay+"s,transform .5s ease "+delay+"s"}}>{children}</div>; }

// ─── QUOTE MODAL ───────────────────────────────────────────────────
function QuoteModal({product,onClose}){
  const isContact = product==="contact";
  const[form,setForm]=useState({name:"",phone:"",email:"",msg:!isContact&&product?"Hi, I'm interested in "+product.name+" ("+product.price+"). Please share availability and best price.":""});
  const[sent,setSent]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  useEffect(()=>{ const fn=e=>{if(e.key==="Escape")onClose();}; window.addEventListener("keydown",fn); document.body.style.overflow="hidden"; return()=>{window.removeEventListener("keydown",fn);document.body.style.overflow="";}; },[onClose]);
  async function submit(){
    if(!form.name||!form.phone)return;
    setLoading(true);
    try{ await fetch(API+"/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,phone:form.phone,email:form.email,product:!isContact&&product?product.name:"General",message:form.msg})}); }
    catch(e){}
    setLoading(false); setSent(true);
  }
  const inp={border:"1px solid #ddd",padding:"11px 13px",fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",transition:"border-color .15s",color:"#111"};
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",width:"100%",maxWidth:460}}>
        {!sent?(
          <>
            <div style={{padding:"24px 28px 18px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#999",marginBottom:4}}>{isContact?"Contact Us":"Request a Quote"}</div>
                <div style={{fontWeight:700,fontSize:20,color:NAVY,lineHeight:1.2}}>{isContact?"Get in Touch":product.name}</div>
                {!isContact&&<div style={{fontSize:13,color:RED,fontWeight:600,marginTop:2}}>{product.price}</div>}
              </div>
              <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#aaa",lineHeight:1}}>×</button>
            </div>
            <div style={{padding:"22px 28px 28px",display:"flex",flexDirection:"column",gap:12}}>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your Name *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email (optional)" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              <textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} rows={3} style={{...inp,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              {error&&<div style={{background:"#fff0f0",border:"1px solid #fecaca",padding:"10px 14px",fontSize:13,color:"#dc2626",fontWeight:500}}>⚠️ {error}</div>}
              <button disabled={!form.name||!form.phone||loading} onClick={submit}
                style={{background:form.name&&form.phone?NAVY:"#ccc",color:"#fff",border:"none",padding:"13px",fontSize:14,fontWeight:700,fontFamily:"inherit",cursor:form.name&&form.phone?"pointer":"not-allowed",letterSpacing:".04em",textTransform:"uppercase"}}>
                {loading?"Sending...":"Submit Enquiry"}
              </button>
              <button onClick={()=>window.open("https://wa.me/919435070738?text="+encodeURIComponent(form.msg||"Hi, I want to enquire."),"_blank")}
                style={{background:"#25D366",color:"#fff",border:"none",padding:"12px",fontSize:14,fontWeight:600,fontFamily:"inherit",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span>💬</span> Send via WhatsApp
              </button>
            </div>
          </>
        ):(
          <div style={{padding:"48px 28px",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:16,color:RED}}>✓</div>
            <div style={{fontWeight:700,fontSize:20,color:NAVY,marginBottom:8}}>Enquiry Received!</div>
            <p style={{fontSize:14,color:"#666",lineHeight:1.7,marginBottom:28}}>We'll call <strong>{form.phone}</strong> shortly.<br/>Or call us at <strong style={{color:RED}}>9435070738</strong>.</p>
            <button onClick={onClose} style={{background:NAVY,color:"#fff",border:"none",padding:"12px 32px",fontSize:14,fontWeight:600,cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",fontFamily:"inherit"}}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ──────────────────────────────────────────────────
function ProductCard({p,onQuote,onView,onCompare,compareList=[],delay}){
  const[hov,setHov]=useState(false);
  const inCmp=compareList.some(c=>c.id===p.id);
  return(
    <Fade delay={delay}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{background:"#fff",border:"1px solid "+(hov?NAVY:"#e8e8e8"),transition:"border-color .2s",position:"relative",height:"100%"}}>
        {p.isNew&&<div style={{position:"absolute",top:12,left:12,background:RED,color:"#fff",fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"3px 10px",zIndex:1}}>NEW</div>}
        <div style={{position:"absolute",top:12,right:12,zIndex:1}}>
          <button onClick={e=>{e.stopPropagation();onCompare&&onCompare(p);}}
            style={{background:inCmp?NAVY:"rgba(255,255,255,.9)",color:inCmp?"#fff":"#888",border:"1.5px solid "+(inCmp?NAVY:"#ddd"),padding:"3px 8px",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",transition:"all .15s"}}>
            {inCmp?"✓ Added":"+ Compare"}
          </button>
        </div>
        <div style={{background:"#f5f5f5",height:200,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden"}} onClick={()=>onView(p)}>
          {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain",padding:12}}/>:<span style={{fontSize:80}}>{p.icon}</span>}
        </div>
        <div style={{padding:"16px 18px 20px"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:RED,marginBottom:5}}>{p.cat}</div>
          <div style={{fontWeight:700,fontSize:17,color:NAVY,marginBottom:6,lineHeight:1.2,cursor:"pointer"}} onClick={()=>onView(p)}>{p.name}</div>
          <div style={{fontSize:12,color:"#888",lineHeight:1.55,marginBottom:12,minHeight:36}}>{p.spec}</div>
          <div style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:14}}>{p.price}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onView(p)}
              style={{flex:1,background:"#fff",color:NAVY,border:"1.5px solid "+NAVY,padding:"9px 0",fontSize:12,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>{e.target.style.background=NAVY;e.target.style.color="#fff";}} onMouseLeave={e=>{e.target.style.background="#fff";e.target.style.color=NAVY;}}>
              View
            </button>
            <button onClick={()=>onQuote(p)}
              style={{flex:1,background:NAVY,color:"#fff",border:"none",padding:"10px 0",fontSize:12,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
              onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
              Enquire
            </button>
            <button onClick={()=>window.open("https://wa.me/919435070738?text=Hi%2C+I'm+interested+in+"+encodeURIComponent(p.name)+"_at_"+encodeURIComponent(p.price),"_blank")}
              style={{width:40,background:"#fff",border:"1px solid #e8e8e8",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .15s"}}
              onMouseEnter={e=>e.target.style.borderColor=NAVY} onMouseLeave={e=>e.target.style.borderColor="#e8e8e8"}>
              💬
            </button>
          </div>
        </div>
      </div>
    </Fade>
  );
}

// ─── REPAIR BOOKING MODAL ──────────────────────────────────────────
function RepairModal({onClose}){
  const[form,setForm]=useState({deviceType:"Laptop",brand:"",model:"",issue:"",serviceType:"Carry-in",date:"",name:"",phone:""});
  const[sent,setSent]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const[jobId,setJobId]=useState("");
  useEffect(()=>{ document.body.style.overflow="hidden"; return()=>{document.body.style.overflow="";}; },[]);

  async function submit(){
    if(!form.name||!form.phone||!form.issue) return;
    setLoading(true); setError("");
    try{
      // Step 1 — create inquiry
      await fetch(API+"/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        name:form.name, phone:form.phone,
        product:"Repair: "+form.deviceType+(form.brand?" "+form.brand:""),
        message:"Device: "+form.deviceType+" "+form.brand+" "+form.model+
                "\nIssue: "+form.issue+
                "\nService: "+form.serviceType+
                (form.date?"\nDate: "+form.date:"")
      })});

      // Step 2 — create service job, get Job ID
      const svcRes=await fetch(API+"/service/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        customerName:form.name, phone:form.phone,
        deviceType:form.deviceType, brand:form.brand,
        model:form.model, issue:form.issue,
        serviceType:form.serviceType,
      })});
      const svcData=await svcRes.json();
      if(svcData.jobId) setJobId(svcData.jobId);

      setSent(true);
    }catch(e){ setError("Failed to send. Please use WhatsApp below."); }
    setLoading(false);
  }

  const waMsg=encodeURIComponent(
    "Hi, I need "+form.serviceType+" repair service.\n"+
    "Device: "+form.deviceType+" "+form.brand+" "+form.model+"\n"+
    "Issue: "+form.issue+
    (form.date?"\nPreferred Date: "+form.date:"")+
    "\nName: "+form.name+" | Phone: "+form.phone
  );

  const inp={border:"1px solid #ddd",padding:"10px 13px",fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",transition:"border-color .15s",color:"#111"};
  const radioStyle={display:"flex",gap:12,flexWrap:"wrap"};
  const RadioBtn=({val,group})=>(
    <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:14,fontWeight:500,color:form[group]===val?NAVY:"#555"}}>
      <input type="radio" name={group} checked={form[group]===val} onChange={()=>setForm({...form,[group]:val})} style={{accentColor:NAVY}}/>{val}
    </label>
  );

  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
      <div style={{background:"#fff",width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto"}}>
        {!sent?(
          <>
            <div style={{padding:"20px 28px 16px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"sticky",top:0,background:"#fff",zIndex:1}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#999",marginBottom:4}}>Book a Service</div>
                <div style={{fontWeight:700,fontSize:20,color:NAVY}}>Repair Request</div>
              </div>
              <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#aaa",lineHeight:1}}>×</button>
            </div>
            <div style={{padding:"20px 28px 28px",display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>Device Type *</div>
                <div style={radioStyle}>
                  {["Laptop","Desktop","Printer","Other"].map(v=><RadioBtn key={v} val={v} group="deviceType"/>)}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Brand</div>
                  <input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} placeholder="e.g. HP, Dell, Canon" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Model</div>
                  <input value={form.model} onChange={e=>setForm({...form,model:e.target.value})} placeholder="e.g. Pavilion 15" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Issue Description *</div>
                <textarea value={form.issue} onChange={e=>setForm({...form,issue:e.target.value})} rows={3} placeholder="Describe the problem — e.g. Screen cracked, not turning on..." style={{...inp,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>Service Type *</div>
                <div style={radioStyle}>
                  <RadioBtn val="Carry-in" group="serviceType"/>
                  <RadioBtn val="Onsite Visit" group="serviceType"/>
                </div>
                <div style={{fontSize:11,color:"#888",marginTop:6}}>
                  {form.serviceType==="Carry-in"?"Bring your device to Anand Arcade, Opp. Civil Hospital, Silchar":"Our technician will visit your home/office"}
                </div>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Preferred Date</div>
                <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} min={new Date().toISOString().split("T")[0]} style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Your Name *</div>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full Name" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Phone *</div>
                  <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
              </div>
              {error&&<div style={{background:"#fff0f0",border:"1px solid #fecaca",padding:"10px 14px",fontSize:13,color:"#dc2626",fontWeight:500}}>⚠️ {error}</div>}
              <button disabled={!form.name||!form.phone||!form.issue||loading} onClick={submit}
                style={{background:form.name&&form.phone&&form.issue?NAVY:"#ccc",color:"#fff",border:"none",padding:"13px",fontSize:14,fontWeight:700,cursor:form.name&&form.phone&&form.issue?"pointer":"not-allowed",letterSpacing:".04em",textTransform:"uppercase",fontFamily:"inherit"}}>
                {loading?"Booking...":"Book Repair Service"}
              </button>
              <button onClick={()=>window.open("https://wa.me/919435070738?text="+waMsg,"_blank")}
                style={{background:"#25D366",color:"#fff",border:"none",padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit"}}>
                💬 Book via WhatsApp
              </button>
            </div>
          </>
        ):(
          <div style={{padding:"40px 28px",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:12,color:"#16a34a"}}>✓</div>
            <div style={{fontWeight:700,fontSize:20,color:NAVY,marginBottom:8}}>Service Booked!</div>
            <p style={{fontSize:14,color:"#666",lineHeight:1.7,marginBottom:16}}>We'll call <strong>{form.phone}</strong> to confirm the appointment.</p>

            {jobId&&(
              <div style={{background:"#f0f2f8",border:"2px solid "+NAVY,padding:"20px",marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#888",marginBottom:8}}>Your Job ID — save this!</div>
                <div style={{fontSize:32,fontWeight:800,color:NAVY,letterSpacing:".04em",fontFamily:"monospace"}}>{jobId}</div>
                <div style={{fontSize:12,color:"#888",marginTop:8}}>Use this ID to track your repair status on our website</div>
              </div>
            )}

            <div style={{background:"#f5f7fa",border:"1px solid #dde2f0",padding:"14px 18px",textAlign:"left",marginBottom:20,fontSize:13}}>
              <div style={{fontWeight:700,color:NAVY,marginBottom:8}}>📋 Your Booking</div>
              {[
                ["Device", form.deviceType+" "+form.brand+" "+form.model],
                ["Issue", form.issue],
                ["Service", form.serviceType],
                form.date&&["Date", form.date],
                ["Contact", form.name+" · "+form.phone],
              ].filter(Boolean).map(([k,v])=>(
                <div key={k} style={{display:"flex",gap:10,padding:"4px 0",borderBottom:"1px solid #eee",fontSize:12}}>
                  <span style={{fontWeight:600,color:"#555",minWidth:65}}>{k}</span>
                  <span style={{color:NAVY}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>{
                const html=`<!DOCTYPE html><html><head><title>Repair Receipt</title>
                <style>body{font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto;}
                h2{color:#0B1F5E;}.jobid{font-size:28px;font-weight:900;color:#0B1F5E;font-family:monospace;background:#f0f2f8;padding:12px 16px;display:inline-block;margin:12px 0;}
                table{width:100%;border-collapse:collapse;margin-top:12px;}td{padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;}td:first-child{font-weight:bold;color:#555;width:100px;}
                .footer{margin-top:20px;font-size:11px;color:#aaa;border-top:1px solid #ddd;padding-top:12px;}@media print{button{display:none;}}</style></head>
                <body>
                <div style="border-left:4px solid #CC1A1A;padding-left:16px;margin-bottom:20px;">
                  <h2>ADVANTAGE SILCHAR</h2>
                  <p style="margin:0;font-size:12px;color:#666;">Anand Arcade, Opp. Civil Hospital, Silchar – 788001 | 📞 9435070738</p>
                </div>
                <h3 style="color:#CC1A1A;margin-bottom:4px;">REPAIR SERVICE RECEIPT</h3>
                ${jobId?'<p style="font-size:13px;color:#555;margin:0;">Job ID:</p><div class="jobid">'+jobId+'</div>':''}
                <table>
                  <tr><td>Device</td><td>${form.deviceType} ${form.brand} ${form.model}</td></tr>
                  <tr><td>Issue</td><td>${form.issue}</td></tr>
                  <tr><td>Service</td><td>${form.serviceType}</td></tr>
                  ${form.date?'<tr><td>Date</td><td>'+form.date+'</td></tr>':''}
                  <tr><td>Name</td><td>${form.name}</td></tr>
                  <tr><td>Phone</td><td>${form.phone}</td></tr>
                </table>
                <div class="footer">
                  <p>Track your repair status online using Job ID: <strong>${jobId}</strong></p>
                  <p>Advantage Silchar — Est. 1995 | Mon–Sat, 10AM–8PM</p>
                </div>
                <button onclick="window.print()" style="margin-top:16px;background:#0B1F5E;color:#fff;border:none;padding:10px 24px;font-size:13px;cursor:pointer;">🖨️ Print Receipt</button>
                </body></html>`;
                const w=window.open("","_blank");
                w.document.write(html);
                w.document.close();
                setTimeout(()=>w.print(),500);
              }} style={{background:NAVY,color:"#fff",border:"none",padding:"11px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                📄 Download Receipt
              </button>
              <button onClick={onClose} style={{background:"none",border:"1.5px solid "+NAVY,color:NAVY,padding:"11px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SERVICE TRACKER ──────────────────────────────────────────────
function ServiceTracker({onClose}){
  const[jobId,setJobId]=useState("");
  const[result,setResult]=useState(null);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const API=import.meta.env.VITE_API_URL||"http://localhost:5000/api";

  async function track(){
    if(!jobId.trim())return;
    setLoading(true);setResult(null);setError("");
    try{
      const res=await fetch(API+"/service/track/"+jobId.trim().toUpperCase());
      const d=await res.json();
      if(!res.ok)throw new Error(d.error||"Job not found");
      setResult(d);
    }catch(e){setError(e.message||"Job ID not found. Please check and try again.");}
    setLoading(false);
  }

  const STATUS_COLORS={"Received":"#d97706","Diagnosed":"#0891b2","In Progress":"#7c3aed","Ready for Pickup":"#16a34a","Completed":"#16a34a","Cancelled":"#dc2626"};

  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",width:"100%",maxWidth:480}}>
        <div style={{padding:"20px 28px 16px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#999",marginBottom:4}}>Repair Status</div>
            <div style={{fontWeight:700,fontSize:20,color:NAVY}}>Track Your Service</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#aaa"}}>×</button>
        </div>
        <div style={{padding:"22px 28px 28px"}}>
          <div style={{fontSize:13,color:"#666",marginBottom:16}}>Enter your Job ID received at the time of service booking.</div>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            <input value={jobId} onChange={e=>setJobId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&track()}
              placeholder="e.g. ADV-2026-001"
              style={{flex:1,border:"1.5px solid #ddd",padding:"11px 14px",fontSize:14,fontFamily:"inherit",outline:"none",color:"#111"}}
              onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
            <button onClick={track} disabled={!jobId.trim()||loading}
              style={{background:jobId.trim()?NAVY:"#ccc",color:"#fff",border:"none",padding:"11px 20px",fontSize:13,fontWeight:700,cursor:jobId.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>
              {loading?"...":"Track"}
            </button>
          </div>
          {error&&<div style={{background:"#fff0f0",border:"1px solid #fecaca",padding:"12px 16px",fontSize:13,color:"#dc2626",marginBottom:16}}>⚠️ {error}</div>}
          {result&&(
            <div style={{background:"#f5f7fa",border:"1px solid #dde2f0",padding:"20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16,color:NAVY}}>{result.deviceType} — {result.brand} {result.model}</div>
                  <div style={{fontSize:12,color:"#888",marginTop:3}}>Job ID: <strong>{result.jobId}</strong></div>
                </div>
                <span style={{background:STATUS_COLORS[result.status]||"#888",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 12px",letterSpacing:".04em",textTransform:"uppercase"}}>
                  {result.status}
                </span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {result.timeline?.map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:i===result.timeline.length-1?NAVY:"#ddd",flexShrink:0,marginTop:4}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:NAVY}}>{t.status}</div>
                      <div style={{fontSize:11,color:"#888"}}>{new Date(t.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                      {t.note&&<div style={{fontSize:12,color:"#555",marginTop:2}}>{t.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
              {result.estimatedCost&&<div style={{marginTop:14,padding:"10px 14px",background:"#fff",border:"1px solid #e8e8e8",fontSize:13}}><strong>Estimated Cost:</strong> ₹{result.estimatedCost}</div>}
              {result.status==="Ready for Pickup"&&<div style={{marginTop:10,padding:"10px 14px",background:"#f0fdf4",border:"1px solid #86efac",fontSize:13,color:"#15803d",fontWeight:600}}>✅ Your device is ready! Visit us to collect it.</div>}
            </div>
          )}
          <div style={{marginTop:20,padding:"12px 16px",background:"#f0f2f8",fontSize:12,color:"#555"}}>
            📞 <strong>Questions?</strong> Call us at <strong style={{color:NAVY}}>9435070738</strong> with your Job ID.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BULK QUOTE FORM ──────────────────────────────────────────────
function BulkQuoteModal({onClose}){
  const[form,setForm]=useState({org:"",orgType:"School",contact:"",phone:"",email:"",products:"",qty:"",budget:"Under ₹1 Lakh"});
  const[sent,setSent]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const API=import.meta.env.VITE_API_URL||"http://localhost:5000/api";
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  const inp={border:"1px solid #ddd",padding:"10px 13px",fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",color:"#111",transition:"border-color .15s"};
  async function submit(){
    if(!form.org||!form.contact||!form.phone||!form.products)return;
    setLoading(true);setError("");
    try{
      const res=await fetch(API+"/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        name:form.contact,phone:form.phone,email:form.email,
        product:"Bulk Enquiry: "+form.org,
        message:"Organisation: "+form.org+" ("+form.orgType+")\nContact: "+form.contact+"\nPhone: "+form.phone+"\nEmail: "+form.email+"\nProducts Needed: "+form.products+"\nQuantity: "+form.qty+"\nBudget: "+form.budget
      })});
      if(!res.ok)throw new Error("Failed");
      setSent(true);
    }catch(e){setError("Failed to send. Please call 9435070738 directly.");}
    setLoading(false);
  }
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
      <div style={{background:"#fff",width:"100%",maxWidth:540}}>
        {!sent?(
          <>
            <div style={{background:NAVY,padding:"20px 28px"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:4}}>Institutional Orders</div>
              <div style={{fontWeight:800,fontSize:20,color:"#fff"}}>Bulk / Institutional Quote</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:4}}>For schools, colleges, offices, government departments</div>
              <button onClick={onClose} style={{position:"absolute",top:16,right:20,background:"none",border:"none",fontSize:22,cursor:"pointer",color:"rgba(255,255,255,.6)",lineHeight:1}}>×</button>
            </div>
            <div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Organisation Name *</div>
                  <input style={inp} value={form.org} onChange={e=>setForm(f=>({...f,org:e.target.value}))} placeholder="e.g. Silchar Medical College" onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Type</div>
                  <select style={inp} value={form.orgType} onChange={e=>setForm(f=>({...f,orgType:e.target.value}))}>
                    {["School","College","Office","Government","NGO","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Contact Person *</div>
                  <input style={inp} value={form.contact} onChange={e=>setForm(f=>({...f,contact:e.target.value}))} placeholder="Full Name" onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Phone *</div>
                  <input style={inp} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone Number" onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Email</div>
                <input style={inp} type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@organisation.com" onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Products Needed *</div>
                <textarea style={{...inp,resize:"vertical"}} rows={3} value={form.products} onChange={e=>setForm(f=>({...f,products:e.target.value}))} placeholder="e.g. 20 laptops with i5 processor, 5 laser printers, 2 projectors" onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Approx. Quantity</div>
                  <input style={inp} type="number" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))} placeholder="e.g. 25" onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Budget Range</div>
                  <select style={inp} value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))}>
                    {["Under ₹1 Lakh","₹1–5 Lakhs","₹5–10 Lakhs","₹10–25 Lakhs","Above ₹25 Lakhs"].map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              {error&&<div style={{background:"#fff0f0",border:"1px solid #fecaca",padding:"10px 14px",fontSize:13,color:"#dc2626"}}>{error}</div>}
              <div style={{display:"flex",gap:12,marginTop:4}}>
                <button onClick={submit} disabled={!form.org||!form.contact||!form.phone||!form.products||loading}
                  style={{flex:2,background:form.org&&form.contact&&form.phone&&form.products?NAVY:"#ccc",color:"#fff",border:"none",padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                  onMouseEnter={e=>{if(!loading)e.target.style.background=RED;}} onMouseLeave={e=>e.target.style.background=NAVY}>
                  {loading?"Sending...":"Submit Bulk Enquiry"}
                </button>
                <button onClick={()=>window.open("https://wa.me/919435070738?text="+encodeURIComponent("Hi, I represent "+form.org+" ("+form.orgType+"). We need: "+form.products+" — Budget: "+form.budget),"_blank")}
                  style={{flex:1,background:"#25D366",color:"#fff",border:"none",padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </>
        ):(
          <div style={{padding:"48px 28px",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:12}}>✅</div>
            <div style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:8}}>Bulk Enquiry Received!</div>
            <p style={{fontSize:14,color:"#666",lineHeight:1.7,marginBottom:24}}>Our team will contact <strong>{form.contact}</strong> at <strong style={{color:RED}}>{form.phone}</strong> within 24 hours with a detailed quote.</p>
            <button onClick={onClose} style={{background:NAVY,color:"#fff",border:"none",padding:"12px 32px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPARE BAR ───────────────────────────────────────────────────
function CompareBar({list,onRemove,onClear,onCompare}){
  if(list.length===0)return null;
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:800,background:"#fff",borderTop:"3px solid "+NAVY,boxShadow:"0 -4px 24px rgba(11,31,94,.15)",padding:"14px 32px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:NAVY,flexShrink:0}}>Compare ({list.length})</div>
      <div style={{display:"flex",gap:10,flex:1,flexWrap:"wrap"}}>
        {list.map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,background:"#f0f2f8",border:"1px solid #dde2f0",padding:"6px 12px 6px 8px"}}>
            <span style={{fontSize:18}}>{p.icon}</span>
            <span style={{fontSize:13,fontWeight:600,color:NAVY}}>{p.name}</span>
            <button onClick={()=>onRemove(p.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16,lineHeight:1,padding:0,marginLeft:4}} onMouseEnter={e=>e.target.style.color=RED} onMouseLeave={e=>e.target.style.color="#aaa"}>×</button>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,flexShrink:0}}>
        <button onClick={onClear} style={{background:"none",border:"1.5px solid #ddd",color:"#666",padding:"9px 18px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Clear All</button>
        <button onClick={onCompare} disabled={list.length<2}
          style={{background:list.length>=2?NAVY:"#ccc",color:"#fff",border:"none",padding:"9px 24px",fontSize:13,fontWeight:700,cursor:list.length>=2?"pointer":"not-allowed",letterSpacing:".04em",textTransform:"uppercase",transition:"background .15s"}}
          onMouseEnter={e=>{if(list.length>=2)e.target.style.background=RED;}} onMouseLeave={e=>{if(list.length>=2)e.target.style.background=NAVY;}}>
          Compare Now →
        </button>
      </div>
    </div>
  );
}

// ─── COMPARE MODAL ─────────────────────────────────────────────────
function CompareModal({list,onClose,onQuote}){
  const[useCase,setUseCase]=useState("");
  const[aiResult,setAiResult]=useState(null);
  const[aiLoading,setAiLoading]=useState(false);
  const[aiError,setAiError]=useState("");
  useEffect(()=>{ document.body.style.overflow="hidden"; return()=>{document.body.style.overflow="";}; },[]);

  const SUGGESTIONS=["Gaming","Office & Work","College/Student","Video Editing","Budget Buy","Best Battery Life","Programming","Everyday Home Use"];

  async function askAI(q){
    const query=(q||useCase).toLowerCase().trim();
    if(!query)return;
    setAiLoading(true); setAiResult(null); setAiError("");

    // ── Local smart recommendation — no API key needed ──
    setTimeout(()=>{
      // Score each product based on use case keywords
      const scores=list.map(p=>{
        let score=0; const sp=p.specs||{};
        const ram=parseRAM(sp["RAM"]||"")||0;
        const storage=parseStorage(sp["Storage"]||"")||0;
        const battery=parseGeneric(sp["Battery"]||"")||0;
        const weight=parseGeneric(sp["Weight"]||"")||9999;
        const price=parseGeneric(p.price||"")||9999999;
        const hasOLED=(sp["Display"]||"").toLowerCase().includes("oled");
        const hasDedicatedGPU=(sp["Graphics"]||"").toLowerCase().includes("rtx")||(sp["Graphics"]||"").toLowerCase().includes("gtx")||(sp["Graphics"]||"").toLowerCase().includes("rx ");
        const isLaptop=p.cat==="Laptops";
        const isDesktop=p.cat==="Desktops";
        const isPrinter=p.cat==="Printers";

        if(query.includes("gaming")){
          if(hasDedicatedGPU)score+=80;
          else score-=50; // penalise heavily — can't game without GPU
          if(ram>=16)score+=20; if(ram>=32)score+=10;
          if(storage>=512)score+=10;
          if(isDesktop)score+=20; // desktops better for gaming
        }
        if(query.includes("office")||query.includes("work")||query.includes("business")){
          if(battery>=7)score+=20; if(battery>=9)score+=10;
          if(weight<1.8)score+=15;
          if(ram>=8)score+=10; if(ram>=16)score+=10;
          if(price<50000)score+=15;
        }
        if(query.includes("student")||query.includes("college")||query.includes("school")){
          if(price<45000)score+=25; if(price<35000)score+=15;
          if(battery>=8)score+=20;
          if(weight<1.7)score+=15;
          if(ram>=8)score+=10;
        }
        if(query.includes("video")||query.includes("editing")||query.includes("creative")||query.includes("design")){
          if(ram>=16)score+=25; if(ram>=32)score+=20;
          if(storage>=1024)score+=20;
          if(hasOLED)score+=20;
          if(hasDedicatedGPU)score+=15;
        }
        if(query.includes("budget")||query.includes("cheap")||query.includes("affordable")||query.includes("low cost")){
          if(price<35000)score+=40; else if(price<50000)score+=20; else if(price<70000)score+=5;
        }
        if(query.includes("battery")||query.includes("travel")||query.includes("portable")){
          score+=battery*3;
          if(weight<1.7)score+=20; if(weight<1.6)score+=15;
        }
        if(query.includes("programming")||query.includes("coding")||query.includes("developer")){
          if(ram>=16)score+=25; if(ram>=32)score+=10;
          if(storage>=512)score+=10;
          if(p.name.toLowerCase().includes("thinkpad")||p.name.toLowerCase().includes("macbook"))score+=10;
        }
        if(query.includes("home")||query.includes("everyday")||query.includes("family")){
          if(price<50000)score+=15;
          if(ram>=8)score+=10;
          if(storage>=512)score+=10;
        }
        if(query.includes("print")||query.includes("printer")){
          if(isPrinter)score+=60;
        }
        if(query.includes("desktop")||query.includes("workstation")){
          if(isDesktop)score+=40;
        }
        // General bonus for specs
        score+=ram*0.5;
        score+=Math.min(storage/100,10);
        score-=price/10000;
        return{p,score};
      });

      scores.sort((a,b)=>b.score-a.score);
      const winner=scores[0].p;

      // Generate verdict for each product
      const verdicts=scores.map(({p,score})=>{
        const rank=scores.indexOf(scores.find(s=>s.p.id===p.id));
        const rating=rank===0?"Excellent":rank===1?"Good":rank===2?"Average":"Not Recommended";
        // Build one-line verdict
        const sp=p.specs||{};
        let verdict="";
        if(rating==="Excellent") verdict="Best choice for "+query+" — strong specs at this price point.";
        else if(rating==="Good") verdict="Solid option, slightly behind in key areas for "+query+".";
        else if(rating==="Average") verdict="Usable for "+query+" but not optimised for it.";
        else verdict="Not the right fit for "+query+".";
        return{name:p.name,verdict,rating};
      });

      const hasGoodFit=scores[0].score>0;

      // Generate reason for winner
      const wsp=winner.specs||{};
      const reasonParts=[];
      if(parseRAM(wsp["RAM"]||"")>=16)reasonParts.push("16GB+ RAM for smooth multitasking");
      if(parseStorage(wsp["Storage"]||"")>=512)reasonParts.push("fast SSD storage");
      if(parseGeneric(wsp["Battery"]||"")>=8)reasonParts.push("long "+parseGeneric(wsp["Battery"]||"")+" hour battery");
      if(parseGeneric(winner.price||"")===Math.min(...list.map(x=>parseGeneric(x.price||"")||999999)))reasonParts.push("lowest price in this group");

      const gamingProducts=list.filter(p=>{
        const g=(p.specs||{})["Graphics"]||"";
        return g.toLowerCase().includes("rtx")||g.toLowerCase().includes("gtx")||g.toLowerCase().includes("rx ");
      });

      let reason="";
      if(query.includes("gaming")&&gamingProducts.length===0){
        reason="⚠️ None of the selected products have a dedicated GPU. Gaming requires a dedicated graphics card (like NVIDIA RTX or AMD RX series). "+winner.name+" has the best overall specs among these, but for actual gaming you should look at dedicated gaming laptops. Ask at the store for gaming options.";
      } else {
        reason=winner.name+" is the top pick for "+query+". "+(reasonParts.length>0?"It offers "+reasonParts.join(", ")+". ":"")+"Based on your need, this gives the best overall value.";
      }

      const tipMap={
        gaming:"None of these laptops have a dedicated GPU. Visit the store and ask specifically for gaming laptops with NVIDIA RTX graphics.",
        office:"Ask about Microsoft Office bundling — sometimes included free with new laptops.",
        work:"Ask about Microsoft Office bundling — sometimes included free with new laptops.",
        student:"Ask if there is a student discount. Also check if the college requires any specific specs.",
        college:"Check your college's recommended spec list before buying.",
        budget:"Prices shown are MRP. Visit the store — you can often negotiate a better deal.",
        video:"For video editing, 16GB RAM minimum is important. Ask if RAM upgrade is possible later.",
        editing:"Ask about RAM upgrade options — video editing benefits greatly from 32GB.",
        battery:"Ask the store to show real battery backup with screen-on time.",
        programming:"Ask about SSD upgrade options. An NVMe SSD makes a huge difference for coding.",
        home:"Ask for a demo at the store before buying — see how it feels in hand.",
      };
      const tip=Object.keys(tipMap).find(k=>query.includes(k))
        ? tipMap[Object.keys(tipMap).find(k=>query.includes(k))]
        : "Visit Advantage Silchar — Anand Arcade, Opp. Civil Hospital. Try before you buy.";

      setAiResult({winner:winner.name,reason,verdicts,tip});
      setAiLoading(false);
    },800); // small delay so it feels like it's thinking
  }

  // ── Smart comparison helpers ──
  function parseStorage(str){
    if(!str||str==="—")return null;
    const s=str.toUpperCase();
    let total=0;
    const tb=s.match(/(\d+\.?\d*)\s*TB/);
    const gb=s.match(/(\d+\.?\d*)\s*GB/);
    if(tb)total+=parseFloat(tb[1])*1024;
    if(gb)total+=parseFloat(gb[1]);
    return total>0?total:null;
  }
  function parseRAM(str){
    if(!str||str==="—")return null;
    const m=str.toUpperCase().match(/(\d+)\s*GB/);
    return m?parseInt(m[1]):null;
  }
  function parseGeneric(str){
    if(!str||str==="—")return null;
    const m=str.match(/[\d,]+\.?\d*/);
    return m?parseFloat(m[0].replace(/,/g,"")):null;
  }
  function extractVal(str,key){
    if(key==="Storage"||key==="Capacity")return parseStorage(str);
    if(key==="RAM")return parseRAM(str);
    return parseGeneric(str);
  }

  const higherBetter=["RAM","Storage","Battery","Print Speed","Refresh Rate","Transfer Speed","Capacity","Page Yield","Brightness"];
  const lowerBetter=["Weight","Response Time"];

  function getWinner(key){
    const vals=list.map(p=>({p,num:extractVal((p.specs||{})[key]||"",key)})).filter(v=>v.num!==null);
    if(vals.length<2)return null;
    const isHigher=higherBetter.some(k=>key.toLowerCase().includes(k.toLowerCase()));
    const isLower=lowerBetter.some(k=>key.toLowerCase().includes(k.toLowerCase()));
    if(!isHigher&&!isLower)return null;
    return(isHigher?vals.reduce((a,b)=>a.num>b.num?a:b):vals.reduce((a,b)=>a.num<b.num?a:b)).p.id;
  }
  function getPriceWinner(){
    const vals=list.map(p=>({p,num:parseGeneric(p.price||"")})).filter(v=>v.num!==null);
    return vals.length<2?null:vals.reduce((a,b)=>a.num<b.num?a:b).p.id;
  }
  function getBadges(p){
    const badges=[];const sp=p.specs||{};
    const prices=list.map(x=>parseGeneric(x.price||"")).filter(Boolean);
    const rams=list.map(x=>parseRAM((x.specs||{})["RAM"]||"")).filter(Boolean);
    const stores=list.map(x=>parseStorage((x.specs||{})["Storage"]||"")).filter(Boolean);
    const batts=list.map(x=>parseGeneric((x.specs||{})["Battery"]||"")).filter(Boolean);
    const weights=list.map(x=>parseGeneric((x.specs||{})["Weight"]||"")).filter(Boolean);
    const price=parseGeneric(p.price||"");
    const ram=parseRAM(sp["RAM"]||"");
    const storage=parseStorage(sp["Storage"]||"");
    const battery=parseGeneric(sp["Battery"]||"");
    const weight=parseGeneric(sp["Weight"]||"");
    if(price&&prices.length>1&&price===Math.min(...prices))badges.push({label:"Best Value",color:"#16a34a"});
    if(ram&&rams.length>1&&ram===Math.max(...rams))badges.push({label:"Best Performance",color:"#7c3aed"});
    if(storage&&stores.length>1&&storage===Math.max(...stores))badges.push({label:"Most Storage",color:"#0057b8"});
    if(battery&&batts.length>1&&battery===Math.max(...batts))badges.push({label:"Best Battery",color:"#d97706"});
    if(weight&&weights.length>1&&weight===Math.min(...weights))badges.push({label:"Most Portable",color:"#0891b2"});
    return badges;
  }

  const allKeys=[...new Set(list.flatMap(p=>Object.keys(p.specs||{})))];
  const priceWinner=getPriceWinner();
  const ratingColor={"Excellent":"#16a34a","Good":"#0891b2","Average":"#d97706","Not Recommended":"#dc2626"};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:2000,display:"flex",flexDirection:"column"}}>
      <div style={{background:NAVY,padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontWeight:800,fontSize:18,color:"#fff"}}>Compare Products</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,.4)",background:"rgba(255,255,255,.1)",padding:"3px 10px"}}>{list.length} products</span>
        </div>
        <button onClick={onClose} style={{background:"none",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.7)",fontSize:14,fontWeight:600,cursor:"pointer",padding:"6px 14px",fontFamily:"inherit"}}>✕ Close</button>
      </div>

      <div style={{flex:1,overflowY:"auto",background:"#f5f7fa"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 24px"}}>

          {/* AI Section */}
          <div style={{background:"#fff",border:"2px solid "+NAVY,padding:"24px 28px",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:20}}>🤖</span>
              <span style={{fontWeight:800,fontSize:17,color:NAVY}}>AI-Powered Recommendation</span>
              <span style={{fontSize:11,background:"#eef2ff",color:NAVY,padding:"2px 8px",fontWeight:600}}>Powered by Gemini</span>
            </div>
            <p style={{fontSize:13,color:"#666",marginBottom:16}}>Tell us what you need — AI will recommend the best product for you.</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {SUGGESTIONS.map(s=>(
                <button key={s} onClick={()=>{setUseCase(s);askAI(s);}}
                  style={{background:useCase===s?NAVY:"#f0f2f8",color:useCase===s?"#fff":"#444",border:"1px solid "+(useCase===s?NAVY:"#dde2f0"),padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <input value={useCase} onChange={e=>setUseCase(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&askAI()}
                placeholder="Or describe your need — e.g. 'laptop for video calls and Excel'"
                style={{flex:1,border:"1.5px solid #dde2f0",padding:"11px 14px",fontSize:14,fontFamily:"inherit",outline:"none",color:"#111"}}
                onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#dde2f0"}/>
              <button onClick={()=>askAI()} disabled={!useCase.trim()||aiLoading}
                style={{background:useCase.trim()&&!aiLoading?RED:"#ccc",color:"#fff",border:"none",padding:"11px 24px",fontSize:13,fontWeight:700,cursor:useCase.trim()&&!aiLoading?"pointer":"not-allowed",letterSpacing:".04em",textTransform:"uppercase",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                {aiLoading?"Analysing...":"Ask AI →"}
              </button>
            </div>
            {aiLoading&&<div style={{marginTop:16,padding:"14px",background:"#f0f2f8",textAlign:"center",fontSize:13,color:NAVY,fontWeight:600}}>🔍 Analysing products for "{useCase}"...</div>}
            {aiError&&<div style={{marginTop:12,padding:"12px 16px",background:"#fff0f0",border:"1px solid #fecaca",fontSize:13,color:"#dc2626",fontWeight:500}}>⚠️ {aiError}</div>}
            {aiResult&&!aiLoading&&(
              <div style={{marginTop:20}}>
                <div style={{background:NAVY,color:"#fff",padding:"16px 20px",marginBottom:12,display:"flex",alignItems:"center",gap:14}}>
                  <span style={{fontSize:28}}>🏆</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:4}}>Best for "{useCase}"</div>
                    <div style={{fontWeight:800,fontSize:18}}>{aiResult.winner}</div>
                  </div>
                </div>
                <div style={{background:"#f0fdf4",border:"1px solid #86efac",padding:"14px 18px",marginBottom:12,fontSize:14,color:"#15803d",lineHeight:1.7,fontWeight:500}}>{aiResult.reason}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat("+Math.min(list.length,3)+",1fr)",gap:10,marginBottom:12}}>
                  {(aiResult.verdicts||[]).map((v,i)=>(
                    <div key={i} style={{background:"#fff",border:"1px solid #e8e8e8",padding:"14px 16px"}}>
                      <div style={{fontWeight:700,fontSize:13,color:NAVY,marginBottom:5}}>{v.name}</div>
                      <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:8}}>{v.verdict}</div>
                      <span style={{background:ratingColor[v.rating]||"#888",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 10px",letterSpacing:".04em",textTransform:"uppercase"}}>{v.rating}</span>
                    </div>
                  ))}
                </div>
                {aiResult.tip&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",padding:"12px 16px",fontSize:13,color:"#92400e",display:"flex",gap:10,alignItems:"flex-start"}}><span>💡</span><span><strong>Buying Tip:</strong> {aiResult.tip}</span></div>}
              </div>
            )}
          </div>

          {/* Verdict Cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat("+Math.min(list.length,4)+",1fr)",gap:12,marginBottom:24}}>
            {list.map(p=>{
              const badges=getBadges(p);
              const isAiWin=aiResult&&aiResult.winner===p.name;
              const aiV=aiResult&&(aiResult.verdicts||[]).find(v=>v.name===p.name);
              return(
                <div key={p.id} style={{background:"#fff",border:"2px solid "+(isAiWin?RED:badges.length>0?NAVY:"#e8e8e8"),padding:"20px 18px",textAlign:"center",position:"relative"}}>
                  {isAiWin&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:RED,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 14px",letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>🏆 AI PICK</div>}
                  {!isAiWin&&badges.length>0&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:badges[0].color,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 14px",letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>★ {badges[0].label}</div>}
                  <div style={{marginTop:isAiWin||badges.length>0?16:0}}>
                    <div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,overflow:"hidden"}}>
                      {p.image?<img src={p.image} alt={p.name} style={{maxHeight:"100%",maxWidth:"100%",objectFit:"contain"}}/>:<span style={{fontSize:44}}>{p.icon}</span>}
                    </div>
                    <div style={{fontSize:10,fontWeight:700,color:RED,letterSpacing:".06em",textTransform:"uppercase",marginBottom:3}}>{p.cat}</div>
                    <div style={{fontWeight:800,fontSize:14,color:NAVY,marginBottom:4,lineHeight:1.3}}>{p.name}</div>
                    <div style={{fontWeight:800,fontSize:18,color:priceWinner===p.id?"#16a34a":NAVY,marginBottom:6}}>{p.price}</div>
                    {aiV&&<div style={{fontSize:11,background:ratingColor[aiV.rating]||"#888",color:"#fff",padding:"2px 8px",marginBottom:8,display:"inline-block",fontWeight:700,letterSpacing:".04em",textTransform:"uppercase"}}>{aiV.rating}</div>}
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:10}}>
                      {badges.map((b,i)=><span key={i} style={{background:b.color,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px"}}>{b.label}</span>)}
                    </div>
                    <button onClick={()=>{onClose();onQuote(p);}}
                      style={{width:"100%",background:NAVY,color:"#fff",border:"none",padding:"8px 0",fontSize:11,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                      onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                      Enquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spec Table */}
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",background:"#fff",border:"1px solid #e8e8e8",minWidth:600}}>
              <thead>
                <tr style={{background:NAVY}}>
                  <td style={{padding:"12px 20px",fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",width:"20%",minWidth:130}}>Specification</td>
                  {list.map(p=><td key={p.id} style={{padding:"12px 18px",textAlign:"center",borderLeft:"1px solid rgba(255,255,255,.1)",fontWeight:700,fontSize:12,color:"#fff"}}>{p.name}</td>)}
                </tr>
              </thead>
              <tbody>
                <tr style={{background:"#f0f2f8",borderBottom:"2px solid #dde2f0"}}>
                  <td style={{padding:"14px 20px",fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"#555"}}>Price</td>
                  {list.map(p=>(
                    <td key={p.id} style={{padding:"14px 18px",textAlign:"center",borderLeft:"1px solid #e8e8e8",fontWeight:800,fontSize:17,color:priceWinner===p.id?"#16a34a":NAVY}}>
                      {p.price}
                      {priceWinner===p.id&&<div style={{fontSize:9,color:"#16a34a",fontWeight:700,marginTop:2}}>BEST PRICE</div>}
                    </td>
                  ))}
                </tr>
                {allKeys.map((key,i)=>{
                  const winnerId=getWinner(key);
                  const vals=list.map(p=>(p.specs||{})[key]||"—");
                  const allSame=vals.every(v=>v===vals[0]);
                  return(
                    <tr key={key} style={{borderBottom:"1px solid #f0f0f0",background:i%2===0?"#fff":"#fafafa"}}>
                      <td style={{padding:"12px 20px",fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"#777",verticalAlign:"top"}}>{key}</td>
                      {list.map(p=>{
                        const val=(p.specs||{})[key]||"—";
                        const isWin=winnerId===p.id;
                        return(
                          <td key={p.id} style={{padding:"12px 18px",textAlign:"center",borderLeft:"1px solid #e8e8e8",fontSize:12,lineHeight:1.55,verticalAlign:"top",fontWeight:isWin?700:400,color:isWin?"#15803d":NAVY,background:isWin?"#f0fdf4":(!allSame&&val!=="—"?"#fffbeb":"transparent")}}>
                            {val}
                            {isWin&&val!=="—"&&<div style={{fontSize:9,color:"#16a34a",fontWeight:700,marginTop:2}}>✓ BEST</div>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr style={{borderBottom:"1px solid #e8e8e8",background:"#f9f9fb"}}>
                  <td style={{padding:"13px 20px",fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"#777",verticalAlign:"top"}}>Key Highlights</td>
                  {list.map(p=>(
                    <td key={p.id} style={{padding:"13px 18px",textAlign:"left",borderLeft:"1px solid #e8e8e8",verticalAlign:"top"}}>
                      {(p.highlights||[]).filter(Boolean).map((h,i)=>(
                        <div key={i} style={{fontSize:11,color:"#444",marginBottom:4,display:"flex",gap:5,alignItems:"flex-start"}}>
                          <span style={{color:RED,fontWeight:700,flexShrink:0}}>✓</span>{h}
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
                <tr style={{background:NAVY}}>
                  <td style={{padding:"14px 20px",fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"rgba(255,255,255,.5)"}}>Overall Pick</td>
                  {list.map(p=>{
                    const badges=getBadges(p);
                    const isAiWin=aiResult&&aiResult.winner===p.name;
                    return(
                      <td key={p.id} style={{padding:"14px 18px",textAlign:"center",borderLeft:"1px solid rgba(255,255,255,.1)"}}>
                        {isAiWin
                          ?<span style={{background:RED,color:"#fff",fontSize:10,fontWeight:700,padding:"4px 12px",letterSpacing:".04em",textTransform:"uppercase"}}>🏆 AI Pick</span>
                          :badges.length>0
                            ?<span style={{background:badges[0].color,color:"#fff",fontSize:10,fontWeight:700,padding:"4px 12px",letterSpacing:".04em",textTransform:"uppercase"}}>★ {badges[0].label}</span>
                            :<span style={{fontSize:12,color:"rgba(255,255,255,.3)"}}>—</span>
                        }
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{marginTop:12,fontSize:11,color:"#aaa",textAlign:"center"}}>
            🟢 Green = best in category &nbsp;·&nbsp; 🟡 Yellow = values differ &nbsp;·&nbsp; 🏆 AI Pick = recommended for your use case
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT PAGE ──────────────────────────────────────────────────
function ProductPage({p,onBack,onQuote,onViewRelated}){
  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[p.id]);
  const related=PRODUCTS.filter(r=>r.cat===p.cat&&r.id!==p.id).slice(0,4);
  return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:"#f0f2f8",borderBottom:"1px solid #dde2f0",padding:"12px 32px"}}>
        <div style={{maxWidth:1340,margin:"0 auto",display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#888",flexWrap:"wrap"}}>
          <span style={{cursor:"pointer",color:NAVY,fontWeight:600}} onClick={onBack}>Home</span>
          <span>›</span>
          <span style={{cursor:"pointer",color:NAVY,fontWeight:600}} onClick={onBack}>{p.cat}</span>
          <span>›</span>
          <span style={{color:"#444"}}>{p.name}</span>
        </div>
      </div>
      <div style={{maxWidth:1340,margin:"0 auto",padding:"48px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>
          <div>
            <div style={{background:"#f5f5f5",border:"1px solid #e8e8e8",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",minHeight:320,overflow:"hidden"}}>
              {p.isNew&&<div style={{position:"absolute",top:16,left:16,background:RED,color:"#fff",fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"5px 14px",zIndex:1}}>NEW</div>}
              {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain",padding:32,maxHeight:380}}/>:<span style={{fontSize:160,padding:"40px 32px",display:"block"}}>{p.icon}</span>}
            </div>
            {p.image&&(
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <div style={{flex:1,background:"#f5f5f5",border:"1.5px solid "+NAVY,height:72,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                  <img src={p.image} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:4}}/>
                </div>
              </div>
            )}
            <div style={{marginTop:16,background:"#f0f2f8",border:"1px solid #dde2f0",padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:12}}>Store Info</div>
              {[{icon:"📍",text:"Anand Arcade, Opposite Civil Hospital, Silchar – 788001"},{icon:"📞",text:"03842-230952 · 9435070738"},{icon:"🕙",text:"Mon – Sat · 10:00 AM – 8:00 PM"},{icon:"✅",text:"In-store demo available on request"}].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:10,fontSize:12,color:"#444",marginBottom:7,fontWeight:500,alignItems:"flex-start"}}><span style={{flexShrink:0}}>{item.icon}</span><span>{item.text}</span></div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:RED,marginBottom:8}}>{p.cat}</div>
            <h1 style={{fontSize:"clamp(22px,3vw,34px)",fontWeight:800,color:NAVY,lineHeight:1.1,marginBottom:16,letterSpacing:"-.01em"}}>{p.name}</h1>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
              {p.spec.split("·").map((s,i)=><span key={i} style={{background:"#f0f2f8",border:"1px solid #dde2f0",padding:"5px 12px",fontSize:12,fontWeight:500,color:"#444"}}>{s.trim()}</span>)}
            </div>
            <div style={{fontSize:42,fontWeight:800,color:NAVY,letterSpacing:"-.02em",lineHeight:1,marginBottom:6}}>{p.price}</div>
            <div style={{fontSize:13,color:"#888",marginBottom:28}}>💬 Walk in or call us to check current availability and get the best price.</div>
            <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap"}}>
              <button onClick={()=>onQuote(p)}
                style={{flex:1,minWidth:150,background:NAVY,color:"#fff",border:"none",padding:"14px 0",fontSize:14,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                Enquire Now
              </button>
              <button onClick={()=>window.open("https://wa.me/919435070738?text=Hi%2C+I'm+interested+in+"+encodeURIComponent(p.name)+"_"+encodeURIComponent(p.price)+". Please confirm availability.","_blank")}
                style={{flex:1,minWidth:150,background:"#25D366",color:"#fff",border:"none",padding:"14px 0",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span>💬</span>WhatsApp
              </button>
              <button onClick={()=>{
                const html=`<!DOCTYPE html><html><head><title>Quote — ${p.name}</title>
                <style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;}
                h2{color:#0B1F5E;margin-bottom:4px;}
                .red{color:#CC1A1A;}
                table{width:100%;border-collapse:collapse;margin-top:16px;}
                td{padding:10px 14px;border-bottom:1px solid #eee;font-size:14px;}
                td:first-child{font-weight:bold;color:#555;width:140px;}
                .price{font-size:28px;font-weight:900;color:#0B1F5E;margin:16px 0;}
                .footer{margin-top:32px;font-size:12px;color:#888;border-top:1px solid #ddd;padding-top:16px;}
                .highlights{list-style:none;padding:0;}
                .highlights li::before{content:"✓ ";color:#CC1A1A;font-weight:bold;}
                @media print{button{display:none!important;}}</style></head>
                <body>
                <div style="border-left:5px solid #CC1A1A;padding-left:16px;margin-bottom:24px;">
                  <h2>ADVANTAGE SILCHAR</h2>
                  <p style="margin:0;font-size:13px;color:#666;">Anand Arcade, Opp. Civil Hospital, Hospital Road, Silchar – 788001<br/>📞 9435070738 &nbsp;|&nbsp; ✉️ advantage.it@gmail.com</p>
                </div>
                <div style="background:#f5f7fa;padding:16px 20px;border-radius:4px;margin-bottom:20px;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#CC1A1A;margin-bottom:6px;">${p.cat}</div>
                  <h3 style="color:#0B1F5E;font-size:22px;margin:0 0 6px 0;">${p.name}</h3>
                  <div style="font-size:13px;color:#666;">${p.spec}</div>
                  <div class="price">${p.price}</div>
                  <div style="font-size:12px;color:#888;">*Price valid as of ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}. Subject to change. Contact for best deal.</div>
                </div>
                ${p.highlights&&p.highlights.length>0?"<div style='margin-bottom:20px;'><div style='font-size:11px;font-weight:700;text-transform:uppercase;color:#555;margin-bottom:10px;'>Key Highlights</div><ul class='highlights'>"+p.highlights.map(h=>"<li>"+h+"</li>").join("")+"</ul></div>":""}
                <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#555;margin-bottom:10px;">Specifications</div>
                <table>
                  ${Object.entries(p.specs||{}).map(([k,v])=>"<tr><td>"+k+"</td><td>"+v+"</td></tr>").join("")}
                  <tr><td>Availability</td><td style="color:#16a34a;font-weight:600;">✓ In Store — Silchar</td></tr>
                </table>
                <div style="margin-top:20px;background:#fff3cd;border:1px solid #ffe69c;padding:12px 16px;font-size:13px;color:#856404;">
                  <strong>For best price:</strong> Visit us at Anand Arcade or call <strong>9435070738</strong>. We offer EMI, exchange, and bulk discounts.
                </div>
                <div class="footer">
                  <p>Advantage Silchar — Est. 1995. Mon–Sat, 10AM–8PM</p>
                  <p>This is a system-generated quotation and not a tax invoice.</p>
                </div>
                <button onclick="window.print()" style="margin-top:20px;background:#0B1F5E;color:#fff;border:none;padding:12px 28px;font-size:14px;cursor:pointer;font-family:Arial;">🖨️ Print / Save as PDF</button>
                </body></html>`;
                const w=window.open("","_blank");
                w.document.write(html);
                w.document.close();
                setTimeout(()=>w.print(),600);
              }} style={{background:"#f0f2f8",color:NAVY,border:"1.5px solid #dde2f0",padding:"14px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=NAVY+";color:#fff"}
                onMouseLeave={e=>e.currentTarget.style.background="#f0f2f8"}>
                📄 Quote
              </button>
            </div>
            {p.highlights&&p.highlights.length>0&&(
              <div style={{borderTop:"1px solid #e8e8e8",paddingTop:20,marginBottom:24}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:12}}>Key Highlights</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {p.highlights.map((h,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:13,color:"#333"}}>
                      <span style={{color:RED,fontWeight:800,flexShrink:0,marginTop:1}}>✓</span><span style={{fontWeight:500}}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{borderTop:"1px solid #e8e8e8",paddingTop:20}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:12}}>Quick Specs</div>
              {Object.entries(p.specs||{}).slice(0,5).map(([k,v],i)=>(
                <div key={i} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                  <span style={{fontWeight:600,color:"#555",minWidth:110,flexShrink:0}}>{k}</span>
                  <span style={{color:NAVY,fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{marginTop:56,borderTop:"2px solid #dde2f0",paddingTop:40}}>
          <h2 style={{fontSize:22,fontWeight:800,color:NAVY,marginBottom:6,letterSpacing:"-.01em"}}>Full Specifications</h2>
          <p style={{fontSize:13,color:"#888",marginBottom:24}}>Complete technical details for {p.name}</p>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <tbody>
              {Object.entries(p.specs||{}).map(([k,v],i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f0f0f0",background:i%2===0?"#f9f9fb":"#fff"}}>
                  <td style={{padding:"14px 24px",width:"28%",fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"#777",verticalAlign:"top"}}>{k}</td>
                  <td style={{padding:"14px 24px",fontSize:14,color:NAVY,fontWeight:500,lineHeight:1.5}}>{v}</td>
                </tr>
              ))}
              <tr style={{background:Object.keys(p.specs||{}).length%2===0?"#f9f9fb":"#fff",borderBottom:"1px solid #f0f0f0"}}>
                <td style={{padding:"14px 24px",fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"#777"}}>Availability</td>
                <td style={{padding:"14px 24px",fontSize:14,fontWeight:700,color:"#16a34a"}}>✓ Available — Anand Arcade, Silchar</td>
              </tr>
              <tr>
                <td style={{padding:"14px 24px",fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"#777"}}>Price</td>
                <td style={{padding:"14px 24px",fontSize:16,fontWeight:800,color:RED}}>{p.price} <span style={{fontSize:12,fontWeight:400,color:"#888"}}>— Contact for best deal</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {related.length>0&&(
          <div style={{marginTop:56,borderTop:"2px solid #dde2f0",paddingTop:40}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
              <h2 style={{fontSize:22,fontWeight:800,color:NAVY,letterSpacing:"-.01em"}}>More {p.cat}</h2>
              <span style={{fontSize:13,fontWeight:600,color:RED,cursor:"pointer"}} onClick={onBack}>View All →</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"#dde2f0",border:"1px solid #dde2f0"}}>
              {related.map((r,i)=><ProductCard key={r.id} p={r} onQuote={onQuote} onView={onViewRelated} onCompare={()=>{}} compareList={[]} delay={i*.05}/>)}
            </div>
          </div>
        )}
        <div style={{marginTop:48,paddingTop:32,borderTop:"1px solid #e8e8e8"}}>
          <button onClick={onBack}
            style={{background:"none",border:"1.5px solid "+NAVY,color:NAVY,padding:"11px 28px",fontSize:13,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=NAVY;}}>
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────
export default function App(){
  const scrollY=useScrollY();
  const[adminOpen,setAdminOpen]=useState(false);
  const[pcBuilderOpen,setPcBuilderOpen]=useState(false);
  const[repairOpen,setRepairOpen]=useState(false);
  const[serviceTrackerOpen,setServiceTrackerOpen]=useState(false);
  const[bulkQuoteOpen,setBulkQuoteOpen]=useState(false);
  const[pwaPrompt,setPwaPrompt]=useState(null);
  const[pwaInstalled,setPwaInstalled]=useState(false);
  const[mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const[compareList,setCompareList]=useState([]);
  const[compareOpen,setCompareOpen]=useState(false);
  const[filterTag,setFilterTag]=useState(""); // e.g. "brand:HP" or "price:30000-50000"
  const[activeMenu,setActiveMenu]=useState(null);
  const[slide,setSlide]=useState(0);
  const[activeCat,setActiveCat]=useState("All");
  const[modal,setModal]=useState(null);
  const[selectedProduct,setSelectedProduct]=useState(null);
  const[searchOpen,setSearchOpen]=useState(false);
  const[searchQuery,setSearchQuery]=useState("");
  const menuRef=useRef(null);
  const searchRef=useRef(null);
  const liveProducts=useProducts(PRODUCTS);

  useEffect(()=>{const t=setInterval(()=>setSlide(s=>(s+1)%HERO_SLIDES.length),5000);return()=>clearInterval(t);},[]);
  useEffect(()=>{const fn=e=>{if(menuRef.current&&!menuRef.current.contains(e.target))setActiveMenu(null);};document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);},[]);
  useEffect(()=>{if(searchOpen)setTimeout(()=>searchRef.current?.focus(),50);},[searchOpen]);
  useEffect(()=>{
    if(window.location.hash==="#admin")setAdminOpen(true);
    const fn=()=>{if(window.location.hash==="#admin")setAdminOpen(true);};
    window.addEventListener("hashchange",fn);
    return()=>window.removeEventListener("hashchange",fn);
  },[]);

  // PWA install prompt
  useEffect(()=>{
    const handler=e=>{e.preventDefault();setPwaPrompt(e);};
    window.addEventListener("beforeinstallprompt",handler);
    window.addEventListener("appinstalled",()=>{setPwaInstalled(true);setPwaPrompt(null);});
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);

  const q=searchQuery.trim().toLowerCase();
  const displayed=(()=>{
    let base=activeCat==="All"?liveProducts:liveProducts.filter(p=>p.cat===activeCat);
    if(q) base=liveProducts.filter(p=>p.name.toLowerCase().includes(q)||p.spec.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q));
    if(filterTag&&!q){
      if(filterTag.startsWith("brand:")){
        const brand=filterTag.replace("brand:","").toLowerCase();
        base=base.filter(p=>p.name.toLowerCase().includes(brand));
      } else if(filterTag.startsWith("price:")){
        const[mn,mx]=filterTag.replace("price:","").split("-").map(Number);
        base=base.filter(p=>{ const pr=parseFloat((p.price||"").replace(/[₹,]/g,"")); return pr>=mn&&(mx===0||pr<=mx); });
      } else if(filterTag.startsWith("use:")){
        const use=filterTag.replace("use:","").toLowerCase();
        if(use==="gaming") base=base.filter(p=>{ const g=(p.specs?.Graphics||"").toLowerCase(); return g.includes("rtx")||g.includes("gtx")||g.includes("rx ")||p.spec.toLowerCase().includes("gaming"); });
        else if(use==="student"||use==="home") base=base.filter(p=>{ const pr=parseFloat((p.price||"").replace(/[₹,]/g,"")); return pr<50000; });
        else if(use==="work") base=base.filter(p=>p.cat==="Laptops"||p.cat==="Desktops");
      }
    }
    return base;
  })();
  const cur=HERO_SLIDES[slide];
  function scroll(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}
  function handleCompare(p){setCompareList(l=>l.some(c=>c.id===p.id)?l.filter(c=>c.id!==p.id):[...l,p]);}

  // ── Admin view ──
  if(adminOpen)return(
    <Admin defaultProducts={PRODUCTS} onExit={()=>{setAdminOpen(false);history.pushState("","",window.location.pathname);}}/>
  );

  // ── Product page view ──
  if(selectedProduct)return(
    <>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}body{font-family:'DM Sans',sans-serif;background:#fff;-webkit-font-smoothing:antialiased;}button,input{font-family:inherit;}a{text-decoration:none;color:inherit;}@media(max-width:768px){.pp-grid{grid-template-columns:1fr!important;gap:32px!important;}}"}</style>
      <div style={{position:"sticky",top:0,zIndex:1000,background:"#fff",borderBottom:"3px solid "+NAVY,boxShadow:"0 2px 12px rgba(11,31,94,.1)"}}>
        <div style={{maxWidth:1340,margin:"0 auto",padding:"0 32px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="#" onClick={e=>{e.preventDefault();setSelectedProduct(null);window.scrollTo({top:0});}} style={{display:"flex",alignItems:"center",textDecoration:"none"}}>
            <div style={{background:NAVY,padding:"6px 14px",display:"flex",alignItems:"center"}}>
              <span style={{fontSize:20,fontWeight:800,color:"#fff"}}>AD</span><span style={{fontSize:20,fontWeight:800,color:RED}}>V</span><span style={{fontSize:20,fontWeight:800,color:"#fff"}}>ANTAGE</span>
            </div>
            <div style={{background:"#fff",border:"1px solid "+NAVY,padding:"2px 8px",alignSelf:"stretch",display:"flex",alignItems:"center"}}>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:NAVY}}>SILCHAR</span>
            </div>
          </a>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{setSelectedProduct(null);window.scrollTo({top:0});}}
              style={{background:"none",border:"1.5px solid "+NAVY,color:NAVY,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=NAVY;}}>
              ← All Products
            </button>
            <button onClick={()=>setModal(selectedProduct)}
              style={{background:RED,color:"#fff",border:"none",padding:"9px 20px",fontSize:13,fontWeight:700,letterSpacing:".03em",cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
              onMouseEnter={e=>e.target.style.background="#a81515"} onMouseLeave={e=>e.target.style.background=RED}>
              Enquire
            </button>
          </div>
        </div>
      </div>
      <ProductPage p={selectedProduct} onBack={()=>{setSelectedProduct(null);window.scrollTo({top:0});}} onQuote={setModal} onViewRelated={p=>{setSelectedProduct(p);window.scrollTo({top:0});}}/>
      <button style={{position:"fixed",bottom:24,right:24,zIndex:1500,background:"#25D366",color:"#fff",border:"none",borderRadius:3,padding:"11px 20px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(37,211,102,.4)",fontFamily:"inherit"}}
        onClick={()=>window.open("https://wa.me/919435070738?text=Hi%2C+I'm+interested+in+"+encodeURIComponent(selectedProduct.name),"_blank")}>
        💬 WhatsApp
      </button>
      {modal&&<QuoteModal product={modal} onClose={()=>setModal(null)}/>}
    </>
  );

  // ── Homepage ──
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;background:#fff;color:#111;-webkit-font-smoothing:antialiased;}
        button,input,textarea{font-family:inherit;}
        a{text-decoration:none;color:inherit;}
        .util-bar{background:#f0f2f8;border-bottom:1px solid #dde2f0;height:34px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;font-size:11px;color:#555;font-weight:500;}
        .util-bar a{color:#555;transition:color .15s;}.util-bar a:hover{color:${NAVY};}
        .util-divider{color:#ccc;margin:0 8px;}
        .nav-wrap{position:sticky;top:0;z-index:1000;background:#fff;border-bottom:3px solid ${NAVY};transition:box-shadow .2s;}
        .nav-wrap.elevated{box-shadow:0 2px 16px rgba(11,31,94,.12);}
        .nav-inner{max-width:1340px;margin:0 auto;padding:0 32px;display:flex;align-items:center;height:58px;}
        .nav-logo{display:flex;align-items:center;text-decoration:none;flex-shrink:0;}
        .logo-box{background:${NAVY};padding:6px 14px;display:flex;align-items:center;}
        .logo-ad{font-size:22px;font-weight:800;color:#fff;letter-spacing:-.01em;line-height:1;}
        .logo-v{font-size:22px;font-weight:800;color:${RED};letter-spacing:-.01em;line-height:1;}
        .logo-antage{font-size:22px;font-weight:800;color:#fff;letter-spacing:-.01em;line-height:1;}
        .logo-sub{background:#fff;border:1px solid ${NAVY};padding:3px 8px;align-self:stretch;display:flex;align-items:center;}
        .logo-sub span{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${NAVY};}
        .nav-cats{display:flex;margin-left:40px;height:100%;align-items:stretch;}
        .nav-cat-btn{padding:0 15px;font-size:13px;font-weight:600;color:#333;border:none;background:none;cursor:pointer;height:100%;display:flex;align-items:center;gap:4px;border-bottom:3px solid transparent;margin-bottom:-3px;transition:color .15s,border-color .15s;white-space:nowrap;}
        .nav-cat-btn:hover,.nav-cat-btn.open{color:${NAVY};border-bottom-color:${RED};}
        .nav-cat-btn .arr{font-size:9px;opacity:.4;transition:transform .2s;}
        .nav-cat-btn.open .arr{transform:rotate(180deg);}
        .nav-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
        .nav-icon-btn{background:none;border:none;cursor:pointer;padding:8px;border-radius:3px;font-size:16px;color:#333;transition:background .15s;}
        .nav-icon-btn:hover{background:#f0f2f8;}
        .nav-cta{background:${RED};color:#fff;border:none;padding:9px 20px;font-size:13px;font-weight:700;letter-spacing:.03em;cursor:pointer;transition:background .15s;white-space:nowrap;}
        .nav-cta:hover{background:#a81515;}
        .mega-wrap{position:relative;}
        .mega-menu{position:absolute;top:100%;left:0;right:0;background:#fff;border-top:2px solid ${RED};border-bottom:1px solid #e8e8e8;box-shadow:0 8px 32px rgba(11,31,94,.14);z-index:999;display:none;padding:32px;}
        .mega-menu.visible{display:flex;gap:48px;max-width:1340px;margin:0 auto;}
        .mega-section h4{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${RED};margin-bottom:14px;}
        .mega-section a{display:block;font-size:13px;color:#444;padding:4px 0;transition:color .15s;cursor:pointer;}
        .mega-section a:hover{color:${NAVY};}
        .hero{width:100%;min-height:480px;display:flex;align-items:center;position:relative;overflow:hidden;transition:background .8s ease;}
        .hero-inner{max-width:1340px;margin:0 auto;padding:72px 32px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:40px;}
        .hero-tag{display:inline-block;border:1px solid ${RED};color:${RED};background:rgba(204,26,26,.08);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:5px 14px;margin-bottom:20px;}
        .hero-title{font-size:clamp(44px,6vw,80px);font-weight:800;line-height:1;color:#fff;letter-spacing:-.02em;white-space:pre-line;margin-bottom:16px;}
        .hero-sub{font-size:15px;color:rgba(255,255,255,.55);margin-bottom:32px;}
        .hero-btns{display:flex;gap:12px;flex-wrap:wrap;}
        .hero-btn-red{background:${RED};color:#fff;border:none;padding:12px 28px;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;transition:background .15s;}
        .hero-btn-red:hover{background:#a81515;}
        .hero-btn-outline{background:none;color:#fff;border:1px solid rgba(255,255,255,.4);padding:12px 24px;font-size:13px;font-weight:600;cursor:pointer;transition:border-color .2s;}
        .hero-btn-outline:hover{border-color:rgba(255,255,255,.8);}
        .hero-icon{font-size:180px;line-height:1;flex-shrink:0;opacity:.85;}
        .hero-dots{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:8px;}
        .hero-dot{width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.3);border:none;cursor:pointer;transition:all .3s;padding:0;}
        .hero-dot.active{width:24px;background:${RED};}
        .quick-links{background:#f0f2f8;border-bottom:1px solid #dde2f0;overflow-x:auto;scrollbar-width:none;}
        .quick-links::-webkit-scrollbar{display:none;}
        .quick-links-inner{max-width:1340px;margin:0 auto;padding:0 32px;display:flex;align-items:center;min-width:max-content;}
        .quick-link{padding:0 18px;height:44px;display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:#444;letter-spacing:.03em;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap;}
        .quick-link:hover{color:${NAVY};}
        .quick-link.ql-active{border-bottom-color:${RED};color:${RED};}
        .section{max-width:1340px;margin:0 auto;padding:64px 32px;}
        .section-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;}
        .section-title{font-size:clamp(22px,3vw,30px);font-weight:800;letter-spacing:-.01em;color:${NAVY};}
        .section-view-all{font-size:13px;font-weight:600;color:${RED};cursor:pointer;}
        .section-view-all:hover{text-decoration:underline;}
        .cat-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:1px;background:#dde2f0;border:1px solid #dde2f0;}
        .cat-tile{background:#fff;padding:24px 12px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:background .15s;text-align:center;}
        .cat-tile:hover{background:#f0f2f8;}
        .cat-tile .ct-icon{font-size:32px;}.cat-tile .ct-label{font-size:12px;font-weight:700;color:${NAVY};letter-spacing:.02em;}
        .cat-tile .ct-sub{font-size:10px;color:#999;line-height:1.4;}
        .product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#dde2f0;border:1px solid #dde2f0;}
        .srv-section{background:${NAVY};}
        .srv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);}
        .srv-tile{background:${NAVY};padding:36px 28px;}
        .srv-tile .st-icon{font-size:32px;margin-bottom:16px;}.srv-tile .st-title{font-size:17px;font-weight:700;color:#fff;margin-bottom:12px;}
        .srv-tile .st-list{list-style:none;}
        .srv-tile .st-list li{font-size:13px;color:rgba(255,255,255,.5);padding:4px 0;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:6px;}
        .srv-tile .st-list li::before{content:"—";color:${RED};font-size:10px;flex-shrink:0;}
        .srv-cta{display:flex;align-items:center;justify-content:space-between;padding:28px 32px;background:rgba(0,0,0,.25);border-top:1px solid rgba(255,255,255,.1);}
        .about-grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid #dde2f0;}
        .about-left{padding:56px 48px;border-right:1px solid #dde2f0;}
        .about-right{display:grid;grid-template-columns:1fr;background:#dde2f0;gap:1px;}
        .stat-tile{background:#fff;padding:32px 28px;}
        .stat-val{font-size:40px;font-weight:800;letter-spacing:-.02em;color:${NAVY};line-height:1;}
        .stat-lbl{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#aaa;margin-top:8px;}
        .brands-section{background:#f0f2f8;border-top:1px solid #dde2f0;border-bottom:1px solid #dde2f0;}
        .brands-inner{max-width:1340px;margin:0 auto;padding:32px;}
        .brands-label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin-bottom:20px;}
        .brands-row{display:grid;grid-template-columns:repeat(11,1fr);gap:1px;background:#dde2f0;border:1px solid #dde2f0;}
        .brand-item{background:#f0f2f8;padding:14px 10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#aaa;transition:all .15s;cursor:default;}
        .brand-item:hover{background:#fff;color:${NAVY};}
        .info-bar{border-top:1px solid #dde2f0;border-bottom:1px solid #dde2f0;}
        .info-bar-inner{max-width:1340px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
        .info-item{padding:28px 32px;border-right:1px solid #dde2f0;display:flex;gap:14px;align-items:flex-start;}
        .info-item:last-child{border-right:none;}
        .info-item .ii-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
        .info-item .ii-label{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${RED};margin-bottom:4px;}
        .info-item .ii-val{font-size:13px;font-weight:600;color:${NAVY};line-height:1.55;white-space:pre-line;}
        .footer{background:${NAVY};color:rgba(255,255,255,.5);}
        .footer-top-strip{background:${RED};height:3px;}
        .footer-main{max-width:1340px;margin:0 auto;padding:52px 32px 36px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;}
        .footer-brand .fb-name{font-size:20px;font-weight:800;color:#fff;}
        .footer-brand .fb-v{color:${RED};}
        .footer-brand .fb-tagline{font-size:12px;color:rgba(255,255,255,.35);margin-top:10px;line-height:1.7;max-width:260px;}
        .footer-col h4{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${RED};margin-bottom:16px;}
        .footer-col a{display:block;font-size:13px;color:rgba(255,255,255,.4);margin-bottom:10px;transition:color .15s;cursor:pointer;}
        .footer-col a:hover{color:#fff;}
        .footer-bottom{border-top:1px solid rgba(255,255,255,.1);}
        .footer-bottom-inner{max-width:1340px;margin:0 auto;padding:18px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
        .footer-bottom span{font-size:11px;}
        .wa-float{position:fixed;right:24px;z-index:1500;background:#25D366;color:#fff;border:none;border-radius:3px;padding:11px 20px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(37,211,102,.4);display:flex;align-items:center;gap:8px;letter-spacing:.02em;transition:transform .2s,bottom .2s;}
        .wa-float:hover{transform:translateY(-2px);}
        .search-bar-wrap{display:flex;align-items:center;}
        .search-expand{display:flex;align-items:center;overflow:hidden;transition:width .25s ease;background:#f0f2f8;border:1.5px solid transparent;height:34px;}
        .search-expand.open{width:240px;border-color:#dde2f0;}
        .search-expand.closed{width:0;border-color:transparent;}
        .search-inp{border:none;background:transparent;outline:none;font-size:13px;font-family:inherit;color:#111;padding:0 10px;width:100%;height:100%;}
        .search-inp::placeholder{color:#aaa;}
        .search-clear{background:none;border:none;cursor:pointer;padding:0 8px;color:#aaa;font-size:16px;line-height:1;flex-shrink:0;}
        .search-clear:hover{color:#111;}
        .search-banner{background:#fff3cd;border-bottom:1px solid #ffe69c;padding:10px 32px;display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:500;color:#664d03;}
        .search-banner strong{color:${NAVY};}
        .search-banner button{background:none;border:none;cursor:pointer;font-size:13px;font-weight:600;color:${RED};padding:0;}
        .hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px;margin-left:8px;}
        .hamburger span{display:block;width:22px;height:2px;background:${NAVY};transition:all .25s;border-radius:2px;}
        .hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
        .hamburger.open span:nth-child(2){opacity:0;}
        .hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
        .mobile-drawer{position:fixed;top:0;left:0;right:0;bottom:0;background:#fff;z-index:1100;overflow-y:auto;transform:translateX(100%);transition:transform .3s ease;}
        .mobile-drawer.open{transform:translateX(0);}
        .mob-cat{display:block;padding:16px 24px;font-size:15px;font-weight:600;color:#111;border-bottom:1px solid #f0f0f0;cursor:pointer;transition:background .15s;}
        .mob-cat:hover{background:#f5f7fa;}
        .mob-sub{padding:10px 24px 10px 36px;font-size:13px;color:#666;border-bottom:1px solid #f8f8f8;cursor:pointer;display:block;transition:background .15s;}
        .mob-sub:hover{background:#f5f7fa;color:${NAVY};}
        @media(max-width:1100px){.cat-grid{grid-template-columns:repeat(4,1fr);}.product-grid{grid-template-columns:repeat(3,1fr);}.brands-row{grid-template-columns:repeat(6,1fr);}}
        @media(max-width:768px){.util-bar{display:none;}.nav-cats{display:none;}.nav-cta{display:none;}.hamburger{display:flex!important;}.hero-icon{display:none;}.hero-title{font-size:40px;}.product-grid{grid-template-columns:repeat(2,1fr);}.srv-grid{grid-template-columns:repeat(2,1fr);}.about-grid{grid-template-columns:1fr;}.about-left{border-right:none;border-bottom:1px solid #dde2f0;}.cat-grid{grid-template-columns:repeat(4,1fr);}.footer-main{grid-template-columns:1fr 1fr;gap:32px;}.info-bar-inner{grid-template-columns:1fr 1fr;}.brands-row{grid-template-columns:repeat(4,1fr);}}
        @media(max-width:480px){.product-grid{grid-template-columns:1fr;}.cat-grid{grid-template-columns:repeat(2,1fr);}.srv-grid{grid-template-columns:1fr;}.footer-main{grid-template-columns:1fr;}.info-bar-inner{grid-template-columns:1fr;}.brands-row{grid-template-columns:repeat(3,1fr);}.hero-title{font-size:32px;}.section{padding:48px 20px;}}
      `}</style>

      {/* PWA INSTALL BANNER */}
      {pwaPrompt&&!pwaInstalled&&(
        <div style={{background:NAVY,color:"#fff",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",zIndex:999,position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>📲</span>
            <span style={{fontSize:13,fontWeight:500}}>Install Advantage Silchar app on your phone for quick access</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{pwaPrompt.prompt();pwaPrompt.userChoice.then(()=>setPwaPrompt(null));}}
              style={{background:RED,color:"#fff",border:"none",padding:"7px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              Install App
            </button>
            <button onClick={()=>setPwaPrompt(null)}
              style={{background:"none",border:"1px solid rgba(255,255,255,.3)",color:"rgba(255,255,255,.7)",padding:"7px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
              Not now
            </button>
          </div>
        </div>
      )}

      {/* PROMO BANNER */}
      {(()=>{
        const txt=localStorage.getItem("advantage_banner")||"🔥 Summer Sale — Up to ₹5,000 off on Laptops &nbsp;|&nbsp; 🎓 Student Discount Available &nbsp;|&nbsp; 💻 Free OS Installation on all Desktops &nbsp;|&nbsp; 📞 Call 9435070738 for Best Deals";
        return(
          <div style={{background:RED,overflow:"hidden",height:32,display:"flex",alignItems:"center"}}>
            <style>{`@keyframes marquee{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}.marquee-txt{display:inline-block;animation:marquee 35s linear infinite;white-space:nowrap;}`}</style>
            <div className="marquee-txt" style={{fontSize:12,fontWeight:600,color:"#fff",letterSpacing:".02em"}} dangerouslySetInnerHTML={{__html:txt}}/>
          </div>
        );
      })()}

      {/* UTIL BAR */}
      <div className="util-bar">
        <span>📍 Anand Arcade, Opposite Civil Hospital, Silchar – 788001</span>
        <div style={{display:"flex",alignItems:"center"}}>
          <span>Mon – Sat</span><span className="util-divider">|</span>
          <strong style={{color:NAVY}}>10:00 AM – 8:00 PM</strong><span className="util-divider">|</span>
          <a href="tel:0384230952">03842-230952</a><span className="util-divider">|</span>
          <a href="tel:9435070738"><strong style={{color:RED}}>9435070738</strong></a>
        </div>
      </div>

      {/* NAV */}
      <div className={"nav-wrap"+(scrollY>34?" elevated":"")} ref={menuRef}>
        <div className="nav-inner">
          <a className="nav-logo" href="#">
            <div className="logo-box"><span className="logo-ad">AD</span><span className="logo-v">V</span><span className="logo-antage">ANTAGE</span></div>
            <div className="logo-sub"><span>SILCHAR</span></div>
          </a>
          <div className="nav-cats">
            {Object.keys(MEGA_MENU).map(cat=>(
              <button key={cat} className={"nav-cat-btn"+(activeMenu===cat?" open":"")}
                onMouseEnter={()=>setActiveMenu(cat)} onClick={()=>setActiveMenu(activeMenu===cat?null:cat)}>
                {cat} <span className="arr">▾</span>
              </button>
            ))}
          </div>
          <div className="nav-right">
            <div className="search-bar-wrap">
              <div className={"search-expand"+(searchOpen?" open":" closed")}>
                <input ref={searchRef} className="search-inp" placeholder="Search laptops, printers..." value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Escape"){setSearchOpen(false);setSearchQuery("");}if(e.key==="Enter"&&searchQuery.trim())scroll("products-section");}}/>
                {searchQuery&&<button className="search-clear" onClick={()=>setSearchQuery("")}>×</button>}
              </div>
              <button className="nav-icon-btn" onClick={()=>{if(searchOpen&&!searchQuery)setSearchOpen(false);else{setSearchOpen(true);setActiveMenu(null);}}} style={{color:searchOpen?NAVY:"#333"}}>🔍</button>
            </div>
            <button className="nav-icon-btn" onClick={()=>window.open("https://wa.me/919435070738","_blank")}>💬</button>
            <button onClick={()=>{setPcBuilderOpen(true);setActiveMenu(null);}}
              style={{background:"none",border:"1.5px solid "+NAVY,color:NAVY,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=NAVY;}}>
              🔧 Build PC
            </button>
            <button className="nav-cta" onClick={()=>{setModal("contact");setActiveMenu(null);}}>Get Quote</button>
            <button className={"hamburger"+(mobileMenuOpen?" open":"")} onClick={()=>setMobileMenuOpen(o=>!o)} aria-label="Menu">
              <span/><span/><span/>
            </button>
          </div>
        </div>
        <div className="mega-wrap" onMouseLeave={()=>setActiveMenu(null)}>
          {Object.entries(MEGA_MENU).map(([cat,data])=>(
            <div key={cat} className={"mega-menu"+(activeMenu===cat?" visible":"")}>
              {data.sections.map((sec,i)=>(
                <div key={i} className="mega-section">
                  <h4>{sec.head}</h4>
                  {sec.items.map(item=>{
                    function handleClick(){
                      setActiveMenu(null);
                      // Work out which category and filter to apply
                      const lower=item.toLowerCase();
                      // Brand filter
                      const brands=["hp","dell","lenovo","asus","acer","msi","canon","epson","cp plus","hikvision","dahua","logitech"];
                      const matchedBrand=brands.find(b=>lower.includes(b));
                      if(matchedBrand){
                        setActiveCat(cat==="Security & CCTV"?"Security & CCTV":lower.includes("printer")?"Printers":lower.includes("desktop")?"Desktops":"Laptops");
                        setFilterTag("brand:"+matchedBrand);
                        scroll("products-section"); return;
                      }
                      // Price filter
                      if(lower.includes("under ₹30")){setActiveCat("Laptops");setFilterTag("price:0-30000");scroll("products-section");return;}
                      if(lower.includes("30,000") && lower.includes("50,000")){setActiveCat("Laptops");setFilterTag("price:30000-50000");scroll("products-section");return;}
                      if(lower.includes("50,000") && lower.includes("80,000")){setActiveCat("Laptops");setFilterTag("price:50000-80000");scroll("products-section");return;}
                      if(lower.includes("above ₹80")||lower.includes("above ₹1")){setActiveCat("Laptops");setFilterTag("price:80000-0");scroll("products-section");return;}
                      // Use case filter
                      if(lower.includes("gaming")){setActiveCat("Laptops");setFilterTag("use:gaming");scroll("products-section");return;}
                      if(lower.includes("student")){setActiveCat("Laptops");setFilterTag("use:student");scroll("products-section");return;}
                      if(lower.includes("home")){setActiveCat("Laptops");setFilterTag("use:home");scroll("products-section");return;}
                      if(lower.includes("work")||lower.includes("office")){setActiveCat("All");setFilterTag("use:work");scroll("products-section");return;}
                      // Category filters
                      if(lower.includes("tower")||lower.includes("all-in-one")||lower.includes("mini")||lower.includes("workstation")){setActiveCat("Desktops");setFilterTag("");scroll("products-section");return;}
                      if(lower.includes("inkjet")||lower.includes("laser")||lower.includes("ink tank")){setActiveCat("Printers");setFilterTag("");scroll("products-section");return;}
                      if(lower.includes("laptop repair")){setModal("contact");return;}
                      if(lower.includes("repair")||lower.includes("service")||lower.includes("onsite")||lower.includes("carry-in")||lower.includes("os installation")){setModal("contact");return;}
                      // Security
                      if(lower.includes("camera")||lower.includes("dvr")||lower.includes("nvr")||lower.includes("cctv")||lower.includes("biometric")||lower.includes("access")){
                        setActiveCat("Security & CCTV");setFilterTag("");scroll("products-section");return;
                      }
                      // Default — just go to that category
                      setActiveCat(cat); setFilterTag(""); scroll("products-section");
                    }
                    return <a key={item} onClick={handleClick}>{item}</a>;
                  })}
                </div>
              ))}
              <div style={{marginLeft:"auto",alignSelf:"flex-start"}}>
                <button onClick={()=>{setModal("contact");setActiveMenu(null);}} style={{background:RED,color:"#fff",border:"none",padding:"10px 22px",fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",cursor:"pointer"}}>Enquire →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className={"mobile-drawer"+(mobileMenuOpen?" open":"")}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:58,borderBottom:"3px solid "+NAVY,position:"sticky",top:0,background:"#fff",zIndex:10}}>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{background:NAVY,padding:"5px 12px",display:"flex",alignItems:"center"}}>
              <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>AD</span><span style={{fontSize:18,fontWeight:800,color:RED}}>V</span><span style={{fontSize:18,fontWeight:800,color:"#fff"}}>ANTAGE</span>
            </div>
            <div style={{background:"#fff",border:"1px solid "+NAVY,padding:"2px 8px",alignSelf:"stretch",display:"flex",alignItems:"center"}}>
              <span style={{fontSize:8,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:NAVY}}>SILCHAR</span>
            </div>
          </div>
          <button onClick={()=>setMobileMenuOpen(false)} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#333",lineHeight:1,padding:4}}>×</button>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #e8e8e8"}}>
          <button onClick={()=>{setModal("contact");setMobileMenuOpen(false);}} style={{flex:1,background:RED,color:"#fff",border:"none",padding:"14px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",fontFamily:"inherit"}}>Get Quote</button>
          <button onClick={()=>window.open("https://wa.me/919435070738","_blank")} style={{flex:1,background:"#25D366",color:"#fff",border:"none",padding:"14px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}>💬 WhatsApp</button>
        </div>
        <div style={{paddingTop:12}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",padding:"8px 24px 4px"}}>Shop</div>
          {[{icon:"🏪",label:"All Products"},...CATEGORIES].map((c,i)=>(
            <div key={c.label} className="mob-cat" onClick={()=>{setActiveCat(i===0?"All":c.label);setMobileMenuOpen(false);setTimeout(()=>scroll("products-section"),120);}}>
              {c.icon} &nbsp;{c.label}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #f0f0f0",paddingTop:12}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",padding:"8px 24px 4px"}}>Services</div>
          {["Laptop Repair","Desktop Repair","Printer Service","Onsite Support"].map(s=>(
            <div key={s} className="mob-sub" onClick={()=>{setModal("contact");setMobileMenuOpen(false);}}>{s}</div>
          ))}
        </div>
        <div style={{background:"#f5f7fa",margin:"16px",padding:"16px 18px"}}>
          <div style={{fontSize:12,fontWeight:700,color:NAVY,marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>Visit Us</div>
          {[{icon:"📍",text:"Anand Arcade, Opp. Civil Hospital, Silchar – 788001"},{icon:"📞",text:"03842-230952 · 9435070738"},{icon:"🕙",text:"Mon – Sat · 10:00 AM – 8:00 PM"}].map((c,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:12,color:"#555",marginBottom:7,fontWeight:500,alignItems:"flex-start"}}><span style={{flexShrink:0}}>{c.icon}</span><span>{c.text}</span></div>
          ))}
        </div>
      </div>
      {mobileMenuOpen&&<div onClick={()=>setMobileMenuOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1099}}/>}

      {/* HERO */}
      <section className="hero" style={{background:cur.bg}}>
        <div className="hero-inner">
          <div>
            <div className="hero-tag">{cur.tag}</div>
            <h1 className="hero-title">{cur.title}</h1>
            <p className="hero-sub">{cur.sub}</p>
            <div className="hero-btns">
              <button className="hero-btn-red" onClick={()=>{setActiveCat(cur.cat==="Repair"?"All":cur.cat);scroll("products-section");}}>{cur.cta1}</button>
              <button className="hero-btn-outline" onClick={()=>setModal("contact")}>{cur.cta2}</button>
            </div>
          </div>
          <div className="hero-icon">{cur.icon}</div>
        </div>
        <div className="hero-dots">{HERO_SLIDES.map((_,i)=><button key={i} className={"hero-dot"+(i===slide?" active":"")} onClick={()=>setSlide(i)}/>)}</div>
      </section>

      {/* QUICK LINKS */}
      <div className="quick-links">
        <div className="quick-links-inner">
          {[{icon:"🏪",label:"All Products",cat:"All"},...CATEGORIES.map(c=>({icon:c.icon,label:c.label,cat:c.label}))].map(l=>(
            <div key={l.label} className={"quick-link"+(activeCat===l.cat?" ql-active":"")} onClick={()=>{setActiveCat(l.cat);scroll("products-section");}}>
              <span style={{fontSize:14}}>{l.icon}</span>{l.label}
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH BANNER */}
      {q&&(
        <div className="search-banner">
          <span>Showing <strong>{displayed.length} result{displayed.length!==1?"s":""}</strong> for "<strong>{searchQuery}</strong>"</span>
          <button onClick={()=>{setSearchQuery("");setSearchOpen(false);}}>✕ Clear search</button>
        </div>
      )}

      {/* SHOP BY CATEGORY */}
      <div style={{borderBottom:"1px solid #dde2f0"}}>
        <div className="section" style={{paddingBottom:48}}>
          <Fade>
            <div className="section-top"><h2 className="section-title">Shop by Category</h2></div>
            <div className="cat-grid">
              {CATEGORIES.map((c,i)=>(
                <div key={i} className="cat-tile" onClick={()=>{setActiveCat(c.label);scroll("products-section");}}>
                  <span className="ct-icon">{c.icon}</span>
                  <span className="ct-label">{c.label}</span>
                  <span className="ct-sub">{c.sub}</span>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </div>

      {/* PRODUCTS */}
      <div id="products-section" style={{borderBottom:"1px solid #dde2f0"}}>
        <div className="section">
          <Fade>
            <div className="section-top">
              <h2 className="section-title">
                {q?"Results for \""+searchQuery+"\"":activeCat==="All"?"All Products":activeCat}
                <span style={{fontSize:14,color:"#aaa",fontWeight:400,marginLeft:12}}>{displayed.length} item{displayed.length!==1?"s":""}</span>
              </h2>
              {(activeCat!=="All"&&!q)&&<span className="section-view-all" onClick={()=>setActiveCat("All")}>View All →</span>}
              {q&&<span className="section-view-all" onClick={()=>{setSearchQuery("");setSearchOpen(false);}}>✕ Clear</span>}
            </div>
          </Fade>
          {displayed.length===0?(
            <div style={{textAlign:"center",padding:"72px 20px",border:"1px solid #dde2f0"}}>
              <div style={{fontSize:48,marginBottom:16}}>🔍</div>
              <div style={{fontWeight:700,fontSize:18,color:NAVY,marginBottom:8}}>No results for "{searchQuery}"</div>
              <p style={{fontSize:14,color:"#888",marginBottom:24}}>Try a brand name, product type, or spec.</p>
              <button onClick={()=>{setSearchQuery("");setSearchOpen(false);}} style={{background:NAVY,color:"#fff",border:"none",padding:"11px 28px",fontSize:13,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer"}}>View All Products</button>
            </div>
          ):(
            <div className="product-grid">
              {displayed.map((p,i)=><ProductCard key={p.id} p={p} onQuote={setModal} onView={setSelectedProduct} onCompare={handleCompare} compareList={compareList} delay={i*.04}/>)}
            </div>
          )}
        </div>
      </div>

      {/* SERVICES */}
      <div className="srv-section">
        <div className="section">
          <Fade>
            <div className="section-top" style={{marginBottom:28}}>
              <h2 className="section-title" style={{color:"#fff"}}>Repair & Services</h2>
              <span className="section-view-all" style={{color:"rgba(255,255,255,.4)"}} onClick={()=>setModal("contact")}>Book a service →</span>
            </div>
          </Fade>
          <div className="srv-grid">
            {SERVICES_LIST.map((s,i)=>(
              <Fade key={i} delay={i*.07}>
                <div className="srv-tile">
                  <div className="st-icon">{s.icon}</div>
                  <div className="st-title">{s.title}</div>
                  <ul className="st-list">{s.items.map(item=><li key={item}>{item}</li>)}</ul>
                </div>
              </Fade>
            ))}
          </div>
          <div className="srv-cta">
            <div>
              <div style={{font:"700 16px/1 'DM Sans',sans-serif",color:"#fff",marginBottom:6}}>Need a service? We'll help you fast.</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>Carry-in at Anand Arcade or book an onsite visit</div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>setRepairOpen(true)} style={{background:RED,color:"#fff",border:"none",padding:"11px 24px",fontSize:13,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit"}}>Book Service</button>
              <button onClick={()=>setServiceTrackerOpen(true)} style={{background:"rgba(255,255,255,.1)",color:"#fff",border:"1px solid rgba(255,255,255,.2)",padding:"11px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔍 Track Repair</button>
              <a href="tel:9435070738" style={{background:"none",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.2)",padding:"11px 20px",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,textDecoration:"none"}}>📞 9435070738</a>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div style={{borderBottom:"1px solid #dde2f0"}}>
        <div className="section">
          <Fade>
            <div className="about-grid">
              <div className="about-left">
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:RED,marginBottom:16}}>Our Story</div>
                <h2 style={{fontSize:"clamp(28px,3.5vw,46px)",fontWeight:800,letterSpacing:"-.02em",lineHeight:1,marginBottom:20,color:NAVY}}>FROM CAFE<br/>TO STORE</h2>
                <p style={{fontSize:15,color:"#555",lineHeight:1.8,maxWidth:440,marginBottom:28}}>
                  Advantage started in <strong>1995</strong> as one of Silchar's first computer cafes. As technology became part of daily life, we grew into a full-service computer store. Today we sell, service, and support all major brands for homes, schools, offices, and businesses across Silchar.
                </p>
                <button onClick={()=>setModal("contact")}
                  style={{background:NAVY,color:"#fff",border:"none",padding:"12px 28px",fontSize:13,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",cursor:"pointer",transition:"background .15s"}}
                  onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                  Contact Us
                </button>
              </div>
              <div className="about-right">
                {[{val:"Mon–Sat",lbl:"Open 6 Days"},{val:"10–8 PM",lbl:"Store Hours"}].map((s,i)=>(
                  <div key={i} className="stat-tile"><div className="stat-val">{s.val}</div><div className="stat-lbl">{s.lbl}</div></div>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </div>

      {/* BRANDS */}
      <div className="brands-section">
        <div className="brands-inner">
          <Fade>
            <div className="brands-label">Brands We Carry & Service</div>
            <div className="brands-row">{BRANDS.map(b=><div key={b} className="brand-item">{b}</div>)}</div>
          </Fade>
        </div>
      </div>

      {/* CONTACT INFO BAR */}
      <div className="info-bar" id="contact-section">
        <div className="info-bar-inner">
          {[
            {icon:"📍",label:"Address", val:"Anand Arcade\nOpposite Civil Hospital\nSilchar – 788001, Assam"},
            {icon:"📞",label:"Phone",   val:"03842-230952\n9435070738"},
            {icon:"✉️",label:"Email",   val:"advantage.it@gmail.com"},
            {icon:"🕙",label:"Hours",   val:"Monday – Saturday\n10:00 AM – 8:00 PM"},
          ].map((c,i)=>(
            <div key={i} className="info-item">
              <span className="ii-icon">{c.icon}</span>
              <div><div className="ii-label">{c.label}</div><div className="ii-val">{c.val}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* GOOGLE MAPS */}
     
<div style={{ width: "100%", position: "relative" }}>
  <iframe
    title="Advantage Silchar Location"
    src="https://maps.google.com/maps?q=24.8177744,92.79945&output=embed&z=17"
    width="100%"
    height="320"
    style={{ border: 0, display: "block" }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
  <a
    href="https://www.google.com/maps/place/EPSON+AUTHORISED+SERVICE+CENTRE+-+Advantage/@24.8177792,92.7945791,17z/data=!3m1!4b1!4m6!3m5!1s0x374e4b0c5d7d4ed9:0xd45e483c48359750!8m2!3d24.8177744!4d92.79945!16s%2Fg%2F11fsw03y6g"
    target="_blank"
    rel="noreferrer"
    style={{
      position: "absolute",
      bottom: 16,
      right: 16,
      background: NAVY,
      color: "#fff",
      padding: "10px 20px",
      fontSize: 13,
      fontWeight: 700,
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: 6,
      boxShadow: "0 2px 8px rgba(0,0,0,.3)"
    }}
  >
    📍 Get Directions
  </a>
</div>

      {/* BULK / INSTITUTIONAL QUOTE */}
      <div style={{background:"#0B1F5E",borderTop:"3px solid "+RED}}>
        <div style={{maxWidth:1340,margin:"0 auto",padding:"48px 32px",display:"grid",gridTemplateColumns:"1fr auto",gap:32,alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:RED,marginBottom:10}}>For Schools · Colleges · Offices · Government</div>
            <h2 style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:800,color:"#fff",marginBottom:10,letterSpacing:"-.01em"}}>Bulk & Institutional Purchases</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,.5)",lineHeight:1.7,maxWidth:500}}>Get special pricing on bulk orders. We supply laptops, desktops, printers and networking equipment to schools, government offices and businesses across Silchar and Assam.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,flexShrink:0}}>
            <button onClick={()=>setBulkQuoteOpen(true)}
              style={{background:RED,color:"#fff",border:"none",padding:"14px 32px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:".04em",textTransform:"uppercase",transition:"background .15s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>e.target.style.background="#a81515"} onMouseLeave={e=>e.target.style.background=RED}>
              Request Bulk Quote
            </button>
            <a href="tel:9435070738" style={{color:"rgba(255,255,255,.5)",fontSize:13,textAlign:"center",textDecoration:"none"}}>or call 9435070738</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top-strip"/>
        <div className="footer-main">
          <div className="footer-brand">
            <div className="fb-name">AD<span className="fb-v">V</span>ANTAGE</div>
            <div className="fb-tagline">Silchar's trusted computer store. Laptops, desktops, printers, accessories and expert repair services for all major brands.</div>
          </div>
          {[
            {head:"Products", links:["Laptops","Desktop PCs","Printers","Keyboards & Mouse","Monitors","Accessories"]},
            {head:"Services", links:["Laptop Repair","Desktop Repair","Printer Service","Onsite Support","OS Installation"]},
            {head:"Visit Us", links:["Anand Arcade","Opposite Civil Hospital","Silchar – 788001","Assam, India","03842-230952","9435070738"]},
          ].map((col,i)=>(
            <div key={i} className="footer-col">
              <h4>{col.head}</h4>
              {col.links.map(l=><a key={l}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <span>© 2026 Advantage, Silchar. All rights reserved.</span>
            <span>Silchar, Assam</span>
          </div>
        </div>
      </footer>

      {/* WA FLOAT */}
      <button className="wa-float" style={{bottom:compareList.length>0?90:24}}
        onClick={()=>window.open("https://wa.me/919435070738?text=Hi%2C+I+want+to+enquire+about+your+products+and+services.","_blank")}>
        💬 WhatsApp
      </button>

      {/* COMPARE BAR */}
      <CompareBar list={compareList} onRemove={id=>setCompareList(l=>l.filter(p=>p.id!==id))} onClear={()=>setCompareList([])} onCompare={()=>setCompareOpen(true)}/>

      {/* MODALS */}
      {compareOpen&&<CompareModal list={compareList} onClose={()=>setCompareOpen(false)} onQuote={setModal}/>}
      {modal&&<QuoteModal product={modal} onClose={()=>setModal(null)}/>}
      {pcBuilderOpen&&<PCBuilder onClose={()=>setPcBuilderOpen(false)} onEnquire={setModal}/>}
      {repairOpen&&<RepairModal onClose={()=>setRepairOpen(false)}/>}
      {serviceTrackerOpen&&<ServiceTracker onClose={()=>setServiceTrackerOpen(false)}/>}
      {bulkQuoteOpen&&<BulkQuoteModal onClose={()=>setBulkQuoteOpen(false)}/>}
    </>
  );
}