import { useState, useEffect, useRef } from "react";


const NAVY  = "#0B1F5E";
const RED   = "#CC1A1A";
const WHITE = "#ffffff";

const MEGA_MENU = {
  Laptops: {
    sections: [
      { head:"By Use",    items:["For Home","For Students","For Work","For Gaming"] },
      { head:"By Brand",  items:["HP Laptops","Dell Laptops","Lenovo Laptops","Asus Laptops","Acer Laptops","MSI Laptops","Avita Laptops"] },
      { head:"By Budget", items:["Under ₹30,000","₹30,000–₹50,000","₹50,000–₹80,000","Above ₹80,000","Above ₹1,00,000"] },
    ],
  },
  Desktops: {
    sections: [
      { head:"Type",  items:["Tower PCs","All-in-One PCs","Mini PCs","Workstations"] },
      { head:"Brand", items:["HP Desktops","Dell Desktops","Lenovo Desktops"] },
    ],
  },
  Printers: {
    sections: [
      { head:"Type",  items:["Inkjet Printers","Laser Printers","All-in-One Printers","Ink Tank Printers"] },
      { head:"Brand", items:["HP Printers","Canon Printers","Epson Printers"] },
    ],
  },
  Accessories: {
    sections: [
      { head:"Input",               items:["Keyboards","Mouse","Keyboard & Mouse Combos","Webcams"] },
      { head:"Display & Storage",   items:["Monitors","External Hard Drives","Pen Drives","SSDs"] },
      { head:"Connectivity",        items:["USB Hubs","HDMI Cables","Networking","Adapters"] },
    ],
  },
  "Repair & Service": {
    sections: [
      { head:"Device",       items:["Laptop Repair","Desktop Repair","Printer Service","Screen Replacement"] },
      { head:"Service Type", items:["Carry-in Service","Onsite Visit","OS Installation"] },
    ],
  },
};

const HERO_SLIDES = [
  { tag:"New Arrivals",            title:"Laptops Built\nFor Every Need",    sub:"Intel 12th Gen · AMD Ryzen · Starting ₹29,999", cta1:"Shop Laptops",   cta2:"Get Quote", cat:"Laptops",  bg:`linear-gradient(135deg,${NAVY} 0%,#071240 100%)`, icon:"💻" },
  { tag:"Expert Service",          title:"Repair Done\nRight. Fast.",        sub:"Laptops · Desktops · Printers · All Brands",     cta1:"Book Enquiry",   cta2:"Call Us",   cat:"Repair",   bg:`linear-gradient(135deg,#0a0a14 0%,${NAVY} 100%)`, icon:"🔧" },
  { tag:"Desktops & Workstations", title:"Power That\nMeans Business",       sub:"Assembled PCs · Branded Desktops · Upgrades",    cta1:"Shop Desktops",  cta2:"Get Quote", cat:"Desktops", bg:`linear-gradient(135deg,#07122e 0%,#0d1e50 100%)`, icon:"🖥️" },
];

const CATEGORIES = [
  { icon:"💻", label:"Laptops",    sub:"HP, Dell, Lenovo, Asus, Acer" },
  { icon:"🖥️", label:"Desktops",   sub:"Tower, AIO, Mini PCs" },
  { icon:"🖨️", label:"Printers",   sub:"Inkjet, Laser, Ink Tank" },
  { icon:"⌨️", label:"Keyboards",  sub:"Wired, Wireless, Mechanical" },
  { icon:"🖱️", label:"Mouse",      sub:"Wired, Wireless, Gaming" },
  { icon:"🖥️", label:"Monitors",   sub:"FHD, QHD, Gaming Displays" },
  { icon:"💾", label:"Storage",    sub:"HDD, SSD, Pen Drives" },
  { icon:"🔧", label:"Services",   sub:"Carry-in & Onsite Service" },
];

const PRODUCTS = [
  { id:1,  name:"HP Pavilion 15",           cat:"Laptops",    spec:"Intel i5-1235U · 8GB RAM · 512GB SSD · Win 11",  price:"₹52,990", icon:"💻", isNew:false },
  { id:2,  name:"Lenovo IdeaPad Slim 3",    cat:"Laptops",    spec:"AMD Ryzen 5 · 16GB RAM · 512GB SSD · Win 11",    price:"₹46,500", icon:"💻", isNew:true  },
  { id:3,  name:"Asus VivoBook 15",         cat:"Laptops",    spec:"Intel i3-1215U · 8GB RAM · 512GB SSD · OLED",    price:"₹44,990", icon:"💻", isNew:false },
  { id:4,  name:"Dell Inspiron 15",         cat:"Laptops",    spec:"Intel i5 · 16GB RAM · 1TB HDD + 256GB SSD",      price:"₹55,000", icon:"💻", isNew:false },
  { id:5,  name:"HP 280 Pro G9 Desktop",    cat:"Desktops",   spec:"Core i3-12100 · 8GB · 1TB HDD · Win 11",        price:"₹36,000", icon:"🖥️", isNew:false },
  { id:6,  name:"Dell Vostro 3020",         cat:"Desktops",   spec:"Core i5 · 8GB · 512GB SSD · Win 11 Pro",        price:"₹42,500", icon:"🖥️", isNew:true  },
  { id:7,  name:"Canon PIXMA G3770",        cat:"Printers",   spec:"Wireless · All-in-One · Color Ink Tank",        price:"₹14,499", icon:"🖨️", isNew:false },
  { id:8,  name:"HP LaserJet 107a",         cat:"Printers",   spec:"Mono Laser · 20ppm · USB · Compact",            price:"₹8,299",  icon:"🖨️", isNew:false },
  { id:9,  name:"Logitech MK235",           cat:"Accessories",spec:"Wireless Keyboard & Mouse Combo · USB",          price:"₹1,499",  icon:"⌨️", isNew:false },
  { id:10, name:"Dell 21.5\" Monitor",      cat:"Accessories",spec:"FHD IPS · HDMI · VGA · Eye Care · Tilt",        price:"₹12,800", icon:"🖥️", isNew:false },
  { id:11, name:"HP 27\" FHD Monitor",      cat:"Accessories",spec:"Full HD IPS · HDMI · Low Blue Light · 75Hz",    price:"₹18,500", icon:"🖥️", isNew:true  },
  { id:12, name:"Seagate 1TB External HDD", cat:"Accessories",spec:"USB 3.0 · Portable · Windows & Mac",            price:"₹3,999",  icon:"💾", isNew:false },
];

const SERVICES_LIST = [
  { icon:"💻", title:"Laptop Repair",   items:["Screen replacement","Battery & keyboard","Motherboard repair","Hinge & port fix"] },
  { icon:"🖥️", title:"Desktop Service", items:["Custom PC assembly","Hardware upgrades","Virus & malware removal"] },
  { icon:"🖨️", title:"Printer Service", items:["Cartridge & ink refill","Print head cleaning","Network printer setup","Hardware faults"] },
  { icon:"🏠", title:"Onsite Support",  items:["Home & office visits","LAN & WiFi setup","OS installation"] },
];

const BRANDS = ["HP","Dell","Lenovo","Asus","Acer","Canon","Epson","Logitech","Intel","AMD","TP-Link"];

/* ══════ HELPERS ══════ */
function useScrollY() {
  const [y,setY]=useState(0);
  useEffect(()=>{const fn=()=>setY(window.scrollY);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);
  return y;
}
function useInView(t=0.12){
  const ref=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[t]);
  return[ref,v];
}
function Fade({children,delay=0}){
  const[ref,v]=useInView();
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"none":"translateY(16px)",transition:`opacity .5s ease ${delay}s,transform .5s ease ${delay}s`}}>{children}</div>;
}

/* ══════ MODAL ══════ */
function QuoteModal({product,onClose}){
  const[form,setForm]=useState({name:"",phone:"",msg:product&&product!=="contact"?`Hi, I'm interested in ${product.name} (${product.price}). Please share availability and best price.`:""});
  const[sent,setSent]=useState(false);
  useEffect(()=>{
    const fn=e=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",fn);
    document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",fn);document.body.style.overflow="";};
  },[onClose]);
  const inp={border:"1px solid #ddd",padding:"11px 13px",fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",transition:"border-color .15s"};
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",width:"100%",maxWidth:460}}>
        {!sent?(
          <>
            <div style={{padding:"24px 28px 18px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#999",marginBottom:4}}>{product==="contact"?"Contact Us":"Request a Quote"}</div>
                <div style={{fontWeight:700,fontSize:20,color:NAVY,lineHeight:1.2}}>{product==="contact"?"Get in Touch":product.name}</div>
                {product!=="contact"&&<div style={{fontSize:13,color:RED,fontWeight:600,marginTop:2}}>{product.price}</div>}
              </div>
              <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#aaa",lineHeight:1}}>×</button>
            </div>
            <div style={{padding:"22px 28px 28px",display:"flex",flexDirection:"column",gap:12}}>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your Name *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              <textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} rows={3} style={{...inp,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
              <button disabled={!form.name||!form.phone} onClick={()=>setSent(true)}
                style={{background:form.name&&form.phone?NAVY:"#ccc",color:"#fff",border:"none",padding:"13px",fontSize:14,fontWeight:700,fontFamily:"inherit",cursor:form.name&&form.phone?"pointer":"not-allowed",letterSpacing:".04em",textTransform:"uppercase"}}>
                Submit Enquiry
              </button>
              <button onClick={()=>window.open(`https://wa.me/919435070738?text=${encodeURIComponent(form.msg||"Hi, I want to enquire.")}`, "_blank")}
                style={{background:"#25D366",color:"#fff",border:"none",padding:"12px",fontSize:14,fontWeight:600,fontFamily:"inherit",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{fontSize:16}}>💬</span> Send via WhatsApp
              </button>
            </div>
          </>
        ):(
          <div style={{padding:"48px 28px",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:16,color:RED}}>✓</div>
            <div style={{fontWeight:700,fontSize:20,color:NAVY,marginBottom:8}}>Enquiry Received</div>
            <p style={{fontSize:14,color:"#666",lineHeight:1.7,marginBottom:28}}>We'll call <strong>{form.phone}</strong> shortly.<br/>Or reach us at <strong style={{color:RED}}>9435070738</strong>.</p>
            <button onClick={onClose} style={{background:NAVY,color:"#fff",border:"none",padding:"12px 32px",fontSize:14,fontWeight:600,cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",fontFamily:"inherit"}}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════ PRODUCT CARD ══════ */
function ProductCard({p,onQuote,onView,delay}){
  const[hov,setHov]=useState(false);
  return(
    <Fade delay={delay}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{background:"#fff",border:`1px solid ${hov?NAVY:"#e8e8e8"}`,transition:"border-color .2s",position:"relative",cursor:"pointer",height:"100%"}}>
        {p.isNew&&<div style={{position:"absolute",top:12,left:12,background:RED,color:"#fff",fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"3px 10px",zIndex:1}}>NEW</div>}
        <div style={{background:"#f5f5f5",height:200,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80}}
          onClick={()=>onView(p)}>{p.icon}</div>
        <div style={{padding:"16px 18px 20px"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:RED,marginBottom:5}}>{p.cat}</div>
          <div style={{fontWeight:700,fontSize:17,color:NAVY,marginBottom:6,lineHeight:1.2,cursor:"pointer"}}
            onClick={()=>onView(p)}>{p.name}</div>
          <div style={{fontSize:12,color:"#888",lineHeight:1.55,marginBottom:12,minHeight:36}}>{p.spec}</div>
          <div style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:14}}>{p.price}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onView(p)}
              style={{flex:1,background:"#fff",color:NAVY,border:`1.5px solid ${NAVY}`,padding:"9px 0",fontSize:12,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>{e.target.style.background=NAVY;e.target.style.color="#fff";}} onMouseLeave={e=>{e.target.style.background="#fff";e.target.style.color=NAVY;}}>
              View
            </button>
            <button onClick={()=>onQuote(p)}
              style={{flex:1,background:NAVY,color:"#fff",border:"none",padding:"10px 0",fontSize:12,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
              onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
              Enquire
            </button>
            <button onClick={()=>window.open(`https://wa.me/919435070738?text=Hi%2C+I'm+interested+in+${encodeURIComponent(p.name)}+at+${encodeURIComponent(p.price)}`,"_blank")}
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

/* ══════ PRODUCT PAGE ══════ */
function ProductPage({p,onBack,onQuote}){
  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[p]);
  const related=PRODUCTS.filter(r=>r.cat===p.cat&&r.id!==p.id).slice(0,4);
  const specs=p.spec.split("·").map(s=>s.trim()).filter(Boolean);

  // Parse spec into label:value pairs for the table
  const specMap={
    "Laptops":    ["Processor","RAM","Storage","Operating System","Display"],
    "Desktops":   ["Processor","RAM","Storage","Operating System"],
    "Printers":   ["Type","Connectivity","Function","Print Speed"],
    "Accessories":["Type","Connectivity","Compatibility"],
  };
  const labels=specMap[p.cat]||["Spec 1","Spec 2","Spec 3","Spec 4"];

  return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'DM Sans',sans-serif"}}>
      {/* Breadcrumb */}
      <div style={{background:"#f0f2f8",borderBottom:"1px solid #dde2f0",padding:"12px 32px"}}>
        <div style={{maxWidth:1340,margin:"0 auto",display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#888"}}>
          <span style={{cursor:"pointer",color:NAVY,fontWeight:600}} onClick={onBack}>Home</span>
          <span>›</span>
          <span style={{cursor:"pointer",color:NAVY,fontWeight:600}}
            onClick={onBack}>{p.cat}</span>
          <span>›</span>
          <span style={{color:"#555"}}>{p.name}</span>
        </div>
      </div>

      {/* Main product area */}
      <div style={{maxWidth:1340,margin:"0 auto",padding:"48px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>

          {/* LEFT — image */}
          <div>
            <div style={{background:"#f5f5f5",border:"1px solid #e8e8e8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:160,padding:"60px 40px",position:"relative"}}>
              {p.isNew&&<div style={{position:"absolute",top:16,left:16,background:RED,color:"#fff",fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"4px 12px"}}>NEW</div>}
              {p.icon}
            </div>
            {/* Thumbnail strip (placeholder) */}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              {[1,2,3].map(i=>(
                <div key={i} style={{flex:1,background:"#f5f5f5",border:"1px solid #e8e8e8",height:72,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,cursor:"pointer",opacity:i===1?1:0.5}}>
                  {p.icon}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — details */}
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:RED,marginBottom:10}}>{p.cat}</div>
            <h1 style={{fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:NAVY,lineHeight:1.1,marginBottom:16,letterSpacing:"-.01em"}}>{p.name}</h1>

            {/* Spec chips */}
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
              {specs.map((s,i)=>(
                <span key={i} style={{background:"#f0f2f8",border:"1px solid #dde2f0",borderRadius:2,padding:"5px 12px",fontSize:12,fontWeight:500,color:"#555"}}>{s}</span>
              ))}
            </div>

            {/* Price */}
            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
              <span style={{fontSize:40,fontWeight:800,color:NAVY,letterSpacing:"-.02em"}}>{p.price}</span>
            </div>
            <div style={{fontSize:13,color:"#888",marginBottom:32}}>Price may vary. Contact us for bulk pricing & discounts.</div>

            {/* CTAs */}
            <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap"}}>
              <button onClick={()=>onQuote(p)}
                style={{flex:1,minWidth:160,background:NAVY,color:"#fff",border:"none",padding:"15px 0",fontSize:14,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                Enquire Now
              </button>
              <button onClick={()=>window.open(`https://wa.me/919435070738?text=Hi%2C+I'm+interested+in+${encodeURIComponent(p.name)}+at+${encodeURIComponent(p.price)}. Please share availability.`,"_blank")}
                style={{flex:1,minWidth:160,background:"#25D366",color:"#fff",border:"none",padding:"15px 0",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{fontSize:18}}>💬</span> WhatsApp
              </button>
            </div>

            {/* Highlights */}
            <div style={{borderTop:"1px solid #e8e8e8",paddingTop:24,marginBottom:28}}>
              <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:14}}>Highlights</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {specs.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:14,color:"#333"}}>
                    <span style={{color:RED,fontWeight:700,flexShrink:0}}>—</span>
                    <span><strong style={{color:NAVY,marginRight:4}}>{labels[i]||`Feature ${i+1}`}:</strong>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Store info strip */}
            <div style={{background:"#f0f2f8",border:"1px solid #dde2f0",padding:"16px 20px",display:"flex",gap:24,flexWrap:"wrap"}}>
              {[
                {icon:"📍",text:"Available at Anand Arcade, Silchar"},
                {icon:"📞",text:"Call 9435070738 to confirm stock"},
                {icon:"🕙",text:"Mon–Sat · 10 AM – 8 PM"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#555",fontWeight:500}}>
                  <span>{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs table */}
        <div style={{marginTop:56,borderTop:"1px solid #e8e8e8",paddingTop:40}}>
          <h2 style={{fontSize:22,fontWeight:800,color:NAVY,marginBottom:24,letterSpacing:"-.01em"}}>Specifications</h2>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <tbody>
              {specs.map((s,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f0f0f0",background:i%2===0?"#f9f9fb":"#fff"}}>
                  <td style={{padding:"14px 20px",fontWeight:600,color:"#555",width:"30%",fontSize:13,letterSpacing:".02em",textTransform:"uppercase",fontSize:11}}>{labels[i]||`Feature ${i+1}`}</td>
                  <td style={{padding:"14px 20px",color:NAVY,fontWeight:500}}>{s}</td>
                </tr>
              ))}
              <tr style={{borderBottom:"1px solid #f0f0f0",background:specs.length%2===0?"#f9f9fb":"#fff"}}>
                <td style={{padding:"14px 20px",fontWeight:600,color:"#555",fontSize:11,letterSpacing:".02em",textTransform:"uppercase"}}>Availability</td>
                <td style={{padding:"14px 20px",color:"#16a34a",fontWeight:700}}>✓ In Store — Anand Arcade, Silchar</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Related products */}
        {related.length>0&&(
          <div style={{marginTop:56,borderTop:"1px solid #e8e8e8",paddingTop:40}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
              <h2 style={{fontSize:22,fontWeight:800,color:NAVY,letterSpacing:"-.01em"}}>More in {p.cat}</h2>
              <span style={{fontSize:13,fontWeight:600,color:RED,cursor:"pointer"}} onClick={onBack}>View All →</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"#dde2f0",border:"1px solid #dde2f0"}}>
              {related.map((r,i)=>(
                <ProductCard key={r.id} p={r} onQuote={onQuote} onView={()=>window.scrollTo({top:0})||onQuote(r)} delay={i*.05}/>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div style={{marginTop:48}}>
          <button onClick={onBack}
            style={{background:"none",border:`1.5px solid ${NAVY}`,color:NAVY,padding:"11px 28px",fontSize:13,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=NAVY;}}>
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════ MAIN ══════ */
export default function App(){
  const scrollY=useScrollY();
  const[activeMenu,setActiveMenu]=useState(null);
  const[slide,setSlide]=useState(0);
  const[activeCat,setActiveCat]=useState("All");
  const[modal,setModal]=useState(null);
  const[selectedProduct,setSelectedProduct]=useState(null);
  const[searchOpen,setSearchOpen]=useState(false);
  const[searchQuery,setSearchQuery]=useState("");
  const menuRef=useRef(null);
  const searchRef=useRef(null);

  useEffect(()=>{const t=setInterval(()=>setSlide(s=>(s+1)%HERO_SLIDES.length),5000);return()=>clearInterval(t);},[]);
  useEffect(()=>{const fn=e=>{if(menuRef.current&&!menuRef.current.contains(e.target))setActiveMenu(null);};document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);},[]);
  useEffect(()=>{if(searchOpen)setTimeout(()=>searchRef.current?.focus(),50);},[searchOpen]);

  const q=searchQuery.trim().toLowerCase();
  const displayed=(()=>{
    let base=activeCat==="All"?PRODUCTS:PRODUCTS.filter(p=>p.cat===activeCat);
    if(q) base=PRODUCTS.filter(p=>
      p.name.toLowerCase().includes(q)||
      p.spec.toLowerCase().includes(q)||
      p.cat.toLowerCase().includes(q)
    );
    return base;
  })();
  const cur=HERO_SLIDES[slide];
  function scroll(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;background:#fff;color:#111;-webkit-font-smoothing:antialiased;}
        button,input,textarea{font-family:inherit;}
        a{text-decoration:none;color:inherit;}

        /* UTIL BAR */
        .util-bar{background:#f0f2f8;border-bottom:1px solid #dde2f0;height:34px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;font-size:11px;color:#555;font-weight:500;letter-spacing:.02em;}
        .util-bar a{color:#555;transition:color .15s;}
        .util-bar a:hover{color:${NAVY};}
        .util-divider{color:#ccc;margin:0 8px;}

        /* NAV */
        .nav-wrap{position:sticky;top:0;z-index:1000;background:#fff;border-bottom:3px solid ${NAVY};transition:box-shadow .2s;}
        .nav-wrap.elevated{box-shadow:0 2px 16px rgba(11,31,94,.12);}
        .nav-inner{max-width:1340px;margin:0 auto;padding:0 32px;display:flex;align-items:center;height:58px;}

        /* LOGO */
        .nav-logo{display:flex;align-items:center;gap:0;text-decoration:none;flex-shrink:0;}
        .logo-box{background:${NAVY};padding:6px 14px;display:flex;align-items:center;}
        .logo-ad{font-size:22px;font-weight:800;color:#fff;letter-spacing:-.01em;line-height:1;}
        .logo-v{font-size:22px;font-weight:800;color:${RED};letter-spacing:-.01em;line-height:1;}
        .logo-antage{font-size:22px;font-weight:800;color:#fff;letter-spacing:-.01em;line-height:1;}
        .logo-sub{background:#fff;border:1px solid ${NAVY};padding:3px 8px;align-self:stretch;display:flex;align-items:center;}
        .logo-sub span{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${NAVY};}

        /* NAV CATS */
        .nav-cats{display:flex;margin-left:40px;height:100%;align-items:stretch;}
        .nav-cat-btn{padding:0 15px;font-size:13px;font-weight:600;color:#333;border:none;background:none;cursor:pointer;height:100%;display:flex;align-items:center;gap:4px;border-bottom:3px solid transparent;margin-bottom:-3px;transition:color .15s,border-color .15s;white-space:nowrap;}
        .nav-cat-btn:hover,.nav-cat-btn.open{color:${NAVY};border-bottom-color:${RED};}
        .nav-cat-btn .arr{font-size:9px;opacity:.4;transition:transform .2s;}
        .nav-cat-btn.open .arr{transform:rotate(180deg);}

        /* NAV RIGHT */
        .nav-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
        .nav-icon-btn{background:none;border:none;cursor:pointer;padding:8px;border-radius:3px;font-size:16px;color:#333;transition:background .15s;}
        .nav-icon-btn:hover{background:#f0f2f8;}
        .nav-cta{background:${RED};color:#fff;border:none;padding:9px 20px;font-size:13px;font-weight:700;letter-spacing:.03em;cursor:pointer;transition:background .15s;white-space:nowrap;}
        .nav-cta:hover{background:#a81515;}

        /* MEGA MENU */
        .mega-wrap{position:relative;}
        .mega-menu{position:absolute;top:100%;left:0;right:0;background:#fff;border-top:2px solid ${RED};border-bottom:1px solid #e8e8e8;box-shadow:0 8px 32px rgba(11,31,94,.14);z-index:999;display:none;padding:32px;}
        .mega-menu.visible{display:flex;gap:48px;max-width:1340px;margin:0 auto;}
        .mega-section h4{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${RED};margin-bottom:14px;}
        .mega-section a{display:block;font-size:13px;color:#444;padding:4px 0;transition:color .15s;cursor:pointer;}
        .mega-section a:hover{color:${NAVY};}

        /* HERO */
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

        /* QUICK LINKS */
        .quick-links{background:#f0f2f8;border-bottom:1px solid #dde2f0;overflow-x:auto;scrollbar-width:none;}
        .quick-links::-webkit-scrollbar{display:none;}
        .quick-links-inner{max-width:1340px;margin:0 auto;padding:0 32px;display:flex;align-items:center;min-width:max-content;}
        .quick-link{padding:0 18px;height:44px;display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:#444;letter-spacing:.03em;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap;}
        .quick-link:hover{color:${NAVY};}
        .quick-link.ql-active{border-bottom-color:${RED};color:${RED};}
        .quick-link .ql-icon{font-size:14px;}

        /* SECTION */
        .section{max-width:1340px;margin:0 auto;padding:64px 32px;}
        .section-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;}
        .section-title{font-size:clamp(22px,3vw,30px);font-weight:800;letter-spacing:-.01em;color:${NAVY};}
        .section-view-all{font-size:13px;font-weight:600;color:${RED};cursor:pointer;display:flex;align-items:center;gap:4px;}
        .section-view-all:hover{text-decoration:underline;}

        /* CAT GRID */
        .cat-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:1px;background:#dde2f0;border:1px solid #dde2f0;}
        .cat-tile{background:#fff;padding:24px 12px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:background .15s;text-align:center;}
        .cat-tile:hover{background:#f0f2f8;}
        .cat-tile .ct-icon{font-size:32px;}
        .cat-tile .ct-label{font-size:12px;font-weight:700;color:${NAVY};letter-spacing:.02em;}
        .cat-tile .ct-sub{font-size:10px;color:#999;line-height:1.4;}

        /* PRODUCT GRID */
        .product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#dde2f0;border:1px solid #dde2f0;}

        /* SERVICES */
        .srv-section{background:${NAVY};}
        .srv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);}
        .srv-tile{background:${NAVY};padding:36px 28px;}
        .srv-tile .st-icon{font-size:32px;margin-bottom:16px;}
        .srv-tile .st-title{font-size:17px;font-weight:700;color:#fff;margin-bottom:12px;}
        .srv-tile .st-list{list-style:none;}
        .srv-tile .st-list li{font-size:13px;color:rgba(255,255,255,.5);padding:4px 0;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:6px;}
        .srv-tile .st-list li::before{content:"—";color:${RED};font-size:10px;flex-shrink:0;}
        .srv-cta{display:flex;align-items:center;justify-content:space-between;padding:28px 32px;background:rgba(0,0,0,.25);border-top:1px solid rgba(255,255,255,.1);}

        /* ABOUT */
        .about-grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid #dde2f0;}
        .about-left{padding:56px 48px;border-right:1px solid #dde2f0;}
        .about-right{display:grid;grid-template-columns:1fr;background:#dde2f0;gap:1px;}
        .stat-tile{background:#fff;padding:32px 28px;}
        .stat-val{font-size:40px;font-weight:800;letter-spacing:-.02em;color:${NAVY};line-height:1;}
        .stat-lbl{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#aaa;margin-top:8px;}

        /* BRANDS */
        .brands-section{background:#f0f2f8;border-top:1px solid #dde2f0;border-bottom:1px solid #dde2f0;}
        .brands-inner{max-width:1340px;margin:0 auto;padding:32px;}
        .brands-label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin-bottom:20px;}
        .brands-row{display:grid;grid-template-columns:repeat(11,1fr);gap:1px;background:#dde2f0;border:1px solid #dde2f0;}
        .brand-item{background:#f0f2f8;padding:14px 10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#aaa;transition:all .15s;cursor:default;}
        .brand-item:hover{background:#fff;color:${NAVY};}

        /* INFO BAR */
        .info-bar{border-top:1px solid #dde2f0;border-bottom:1px solid #dde2f0;}
        .info-bar-inner{max-width:1340px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
        .info-item{padding:28px 32px;border-right:1px solid #dde2f0;display:flex;gap:14px;align-items:flex-start;}
        .info-item:last-child{border-right:none;}
        .info-item .ii-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
        .info-item .ii-label{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${RED};margin-bottom:4px;}
        .info-item .ii-val{font-size:13px;font-weight:600;color:${NAVY};line-height:1.55;white-space:pre-line;}

        /* FOOTER */
        .footer{background:${NAVY};color:rgba(255,255,255,.5);}
        .footer-top-strip{background:${RED};height:3px;}
        .footer-main{max-width:1340px;margin:0 auto;padding:52px 32px 36px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;}
        .footer-brand .fb-name{font-size:20px;font-weight:800;color:#fff;letter-spacing:.02em;}
        .footer-brand .fb-v{color:${RED};}
        .footer-brand .fb-tagline{font-size:12px;color:rgba(255,255,255,.35);margin-top:10px;line-height:1.7;max-width:260px;}
        .footer-col h4{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${RED};margin-bottom:16px;}
        .footer-col a{display:block;font-size:13px;color:rgba(255,255,255,.4);margin-bottom:10px;transition:color .15s;cursor:pointer;}
        .footer-col a:hover{color:#fff;}
        .footer-bottom{border-top:1px solid rgba(255,255,255,.1);}
        .footer-bottom-inner{max-width:1340px;margin:0 auto;padding:18px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
        .footer-bottom span{font-size:11px;}

        /* WA FLOAT */
        .wa-float{position:fixed;bottom:24px;right:24px;z-index:1500;background:#25D366;color:#fff;border:none;border-radius:3px;padding:11px 20px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(37,211,102,.4);display:flex;align-items:center;gap:8px;letter-spacing:.02em;transition:transform .2s;}
        .wa-float:hover{transform:translateY(-2px);}

        /* SEARCH */
        .search-bar-wrap{display:flex;align-items:center;position:relative;}
        .search-expand{display:flex;align-items:center;overflow:hidden;transition:width .25s ease;background:#f0f2f8;border:1.5px solid transparent;height:34px;}
        .search-expand.open{width:240px;border-color:#dde2f0;}
        .search-expand.closed{width:0;border-color:transparent;}
        .search-inp{border:none;background:transparent;outline:none;font-size:13px;font-family:inherit;color:#111;padding:0 10px;width:100%;height:100%;}
        .search-inp::placeholder{color:#aaa;}
        .search-clear{background:none;border:none;cursor:pointer;padding:0 8px;color:#aaa;font-size:16px;line-height:1;flex-shrink:0;}
        .search-clear:hover{color:#111;}

        /* SEARCH RESULTS BANNER */
        .search-banner{background:#fff3cd;border-bottom:1px solid #ffe69c;padding:10px 32px;display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:500;color:#664d03;}
        .search-banner strong{color:${NAVY};}
        .search-banner button{background:none;border:none;cursor:pointer;font-size:13px;font-weight:600;color:${RED};padding:0;}

        /* RESPONSIVE */
        @media(max-width:1100px){.cat-grid{grid-template-columns:repeat(4,1fr);}.product-grid{grid-template-columns:repeat(3,1fr);}.brands-row{grid-template-columns:repeat(6,1fr);}}
        @media(max-width:768px){.util-bar{display:none;}.nav-cats{display:none;}.hero-icon{display:none;}.hero-title{font-size:40px;}.product-grid{grid-template-columns:repeat(2,1fr);}.srv-grid{grid-template-columns:repeat(2,1fr);}.about-grid{grid-template-columns:1fr;}.about-left{border-right:none;border-bottom:1px solid #dde2f0;}.cat-grid{grid-template-columns:repeat(4,1fr);}.footer-main{grid-template-columns:1fr 1fr;gap:32px;}.info-bar-inner{grid-template-columns:1fr 1fr;}.brands-row{grid-template-columns:repeat(4,1fr);}}
        @media(max-width:480px){.product-grid{grid-template-columns:1fr;}.cat-grid{grid-template-columns:repeat(2,1fr);}.srv-grid{grid-template-columns:1fr;}.footer-main{grid-template-columns:1fr;}.info-bar-inner{grid-template-columns:1fr;}.brands-row{grid-template-columns:repeat(3,1fr);}.hero-title{font-size:32px;}.section{padding:48px 20px;}}
      `}</style>

      {/* ── UTIL BAR ── */}
      <div className="util-bar">
        <span>📍 Anand Arcade, Opposite Civil Hospital, Silchar – 788001</span>
        <div style={{display:"flex",alignItems:"center"}}>
          <span>Mon – Sat</span>
          <span className="util-divider">|</span>
          <strong style={{color:NAVY}}>10:00 AM – 8:00 PM</strong>
          <span className="util-divider">|</span>
          <a href="tel:038422230952">03842-230952</a>
          <span className="util-divider">|</span>
          <a href="tel:9435070738"><strong style={{color:RED}}>9435070738</strong></a>
        </div>
      </div>

      {/* ── NAV ── */}
      <div className={`nav-wrap ${scrollY>34?"elevated":""}`} ref={menuRef}>
        <div className="nav-inner">
          {/* Logo — matches store sign: AD[V]ANTAGE */}
          <a className="nav-logo" href="#">
            <div className="logo-box">
              <span className="logo-ad">AD</span>
              <span className="logo-v">V</span>
              <span className="logo-antage">ANTAGE</span>
            </div>
            <div className="logo-sub">
              <span>SILCHAR</span>
            </div>
          </a>

          <div className="nav-cats">
            {Object.keys(MEGA_MENU).map(cat=>(
              <button key={cat} className={`nav-cat-btn ${activeMenu===cat?"open":""}`}
                onMouseEnter={()=>setActiveMenu(cat)}
                onClick={()=>setActiveMenu(activeMenu===cat?null:cat)}>
                {cat} <span className="arr">▾</span>
              </button>
            ))}
          </div>

          <div className="nav-right">
            {/* Expanding search bar */}
            <div className="search-bar-wrap">
              <div className={`search-expand ${searchOpen?"open":"closed"}`}>
                <input
                  ref={searchRef}
                  className="search-inp"
                  placeholder="Search laptops, printers..."
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  onKeyDown={e=>{
                    if(e.key==="Escape"){setSearchOpen(false);setSearchQuery("");}
                    if(e.key==="Enter"&&searchQuery.trim()){scroll("products-section");}
                  }}
                />
                {searchQuery&&<button className="search-clear" onClick={()=>setSearchQuery("")}>×</button>}
              </div>
              <button className="nav-icon-btn" title="Search"
                onClick={()=>{
                  if(searchOpen&&!searchQuery){setSearchOpen(false);}
                  else{setSearchOpen(true);setActiveMenu(null);}
                }}
                style={{color:searchOpen?NAVY:"#333"}}>
                🔍
              </button>
            </div>
            <button className="nav-icon-btn" title="WhatsApp" onClick={()=>window.open("https://wa.me/919435070738","_blank")}>💬</button>
            <button className="nav-cta" onClick={()=>{setModal("contact");setActiveMenu(null);}}>Get Quote</button>
          </div>
        </div>

        {/* Mega menu */}
        <div className="mega-wrap" onMouseLeave={()=>setActiveMenu(null)}>
          {Object.entries(MEGA_MENU).map(([cat,data])=>(
            <div key={cat} className={`mega-menu ${activeMenu===cat?"visible":""}`}>
              {data.sections.map((sec,i)=>(
                <div key={i} className="mega-section">
                  <h4>{sec.head}</h4>
                  {sec.items.map(item=>(
                    <a key={item} onClick={()=>{setActiveMenu(null);scroll("products-section");}}>{item}</a>
                  ))}
                </div>
              ))}
              <div style={{marginLeft:"auto",alignSelf:"flex-start"}}>
                <button onClick={()=>{setModal("contact");setActiveMenu(null);}}
                  style={{background:RED,color:"#fff",border:"none",padding:"10px 22px",fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",cursor:"pointer"}}>
                  Enquire →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
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
        <div className="hero-dots">
          {HERO_SLIDES.map((_,i)=>(
            <button key={i} className={`hero-dot ${i===slide?"active":""}`} onClick={()=>setSlide(i)}/>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <div className="quick-links">
        <div className="quick-links-inner">
          {[{icon:"🏪",label:"All Products",cat:"All"},...CATEGORIES.map(c=>({icon:c.icon,label:c.label,cat:c.label}))].map(l=>(
            <div key={l.label} className={`quick-link ${activeCat===l.cat?"ql-active":""}`}
              onClick={()=>{setActiveCat(l.cat);scroll("products-section");}}>
              <span className="ql-icon">{l.icon}</span>{l.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── SEARCH BANNER ── */}
      {q&&(
        <div className="search-banner">
          <span>Showing <strong>{displayed.length} result{displayed.length!==1?"s":""}</strong> for "<strong>{searchQuery}</strong>"</span>
          <button onClick={()=>{setSearchQuery("");setSearchOpen(false);}}>✕ Clear search</button>
        </div>
      )}

      {/* ── SHOP BY CATEGORY ── */}
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

      {/* ── PRODUCTS ── */}
      <div id="products-section" style={{borderBottom:"1px solid #dde2f0"}}>
        <div className="section">
          <Fade>
            <div className="section-top">
              <h2 className="section-title">
                {q?`Results for "${searchQuery}"`:activeCat==="All"?"All Products":activeCat}
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
              <p style={{fontSize:14,color:"#888",marginBottom:24}}>Try a different keyword — like a brand name, product type, or spec.</p>
              <button onClick={()=>{setSearchQuery("");setSearchOpen(false);}}
                style={{background:NAVY,color:"#fff",border:"none",padding:"11px 28px",fontSize:13,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer"}}>
                View All Products
              </button>
            </div>
          ):(
          <div className="product-grid">
            {displayed.map((p,i)=><ProductCard key={p.id} p={p} onQuote={setModal} delay={i*.04}/>)}
          </div>
          )}
        </div>
      </div>

      {/* ── SERVICES ── */}
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
              <div style={{font:`700 16px/1 'DM Sans',sans-serif`,color:"#fff",marginBottom:6}}>Need a service? We'll help you fast.</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>Carry-in at Anand Arcade or book an onsite visit</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setModal("contact")}
                style={{background:RED,color:"#fff",border:"none",padding:"11px 24px",fontSize:13,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer"}}>
                Book Service
              </button>
              <a href="tel:9435070738"
                style={{background:"none",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.2)",padding:"11px 20px",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                📞 9435070738
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div style={{borderBottom:"1px solid #dde2f0"}}>
        <div className="section">
          <Fade>
            <div className="about-grid">
              <div className="about-left">
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:RED,marginBottom:16}}>Our Story</div>
                <h2 style={{fontSize:"clamp(28px,3.5vw,46px)",fontWeight:800,letterSpacing:"-.02em",lineHeight:1,marginBottom:20,color:NAVY}}>
                  FROM CAFE<br/>TO STORE
                </h2>
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
                  <div key={i} className="stat-tile">
                    <div className="stat-val">{s.val}</div>
                    <div className="stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </div>

      {/* ── BRANDS ── */}
      <div className="brands-section">
        <div className="brands-inner">
          <Fade>
            <div className="brands-label">Brands We Carry & Service</div>
            <div className="brands-row">
              {BRANDS.map(b=><div key={b} className="brand-item">{b}</div>)}
            </div>
          </Fade>
        </div>
      </div>

      {/* ── CONTACT INFO BAR ── */}
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
              <div>
                <div className="ii-label">{c.label}</div>
                <div className="ii-val">{c.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
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

      {/* ── WA FLOAT ── */}
      <button className="wa-float" onClick={()=>window.open("https://wa.me/919435070738?text=Hi%2C+I+want+to+enquire+about+your+products+and+services.","_blank")}>
        💬 WhatsApp
      </button>

      {modal&&<QuoteModal product={modal} onClose={()=>setModal(null)}/>}
    </>
  );
}