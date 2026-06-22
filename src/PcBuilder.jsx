import { useState, useEffect } from "react";

const NAVY = "#0B1F5E";
const RED  = "#CC1A1A";
const API  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ─── Category display config (stays hardcoded — just labels & order) ── */
const CAT_META = {
  CPU:         { label:"Processor (CPU)",    required:true  },
  Motherboard: { label:"Motherboard",        required:true  },
  RAM:         { label:"RAM",                required:true  },
  Storage:     { label:"Storage",            required:true  },
  GPU:         { label:"Graphics Card",      required:false },
  Cabinet:     { label:"Cabinet / Case",     required:true  },
  PSU:         { label:"Power Supply (PSU)", required:true  },
  Cooler:      { label:"CPU Cooler",         required:false },
};

const CAT_ORDER = Object.keys(CAT_META);

/* ─── Compatibility checker — reads specs from DB components ────────── */
function checkCompatibility(selected){
  const issues = [];
  const cpu = selected.CPU;
  const mb  = selected.Motherboard;
  const ram = selected.RAM;
  const psu = selected.PSU;
  const gpu = selected.GPU;

  if(cpu && mb){
    const cpuSocket = cpu.specs?.socket;
    const mbSocket  = mb.specs?.socket;
    if(cpuSocket && mbSocket && cpuSocket !== mbSocket)
      issues.push("CPU socket ("+cpuSocket+") does not match motherboard socket ("+mbSocket+")");
  }

  if(mb && ram){
    const mbRam  = mb.specs?.ramType;
    const ramType = ram.specs?.type;
    if(mbRam && ramType && mbRam !== ramType)
      issues.push("Motherboard supports "+mbRam+" but selected RAM is "+ramType);
  }

  if(cpu && psu){
    const tdp     = Number(cpu.specs?.tdp) || 0;
    const gpuPow  = gpu && gpu.price > 0 ? 150 : 0;
    const needed  = tdp + gpuPow + 100;
    const wattage = Number(psu.specs?.wattage) || 0;
    if(wattage > 0 && wattage < needed)
      issues.push("PSU may be underpowered — need ~"+needed+"W, selected "+wattage+"W");
  }

  if(cpu && gpu && gpu.price === 0){
    const hasIGPU = cpu.specs?.hasIGPU;
    if(hasIGPU === false)
      issues.push("Selected CPU has no integrated graphics — please add a GPU");
  }

  return issues;
}

/* ─── Spec display helper ───────────────────────────────────────────── */
function SpecBadges({specs, category}){
  if(!specs) return null;
  const show = [];
  if(category==="CPU"){
    if(specs.socket) show.push("Socket: "+specs.socket);
    if(specs.tdp)    show.push("TDP: "+specs.tdp+"W");
    if(specs.brand)  show.push(specs.brand);
  }
  if(category==="Motherboard"){
    if(specs.socket)  show.push("Socket: "+specs.socket);
    if(specs.ramType) show.push(specs.ramType);
    if(specs.maxRam)  show.push("Max "+specs.maxRam+"GB");
  }
  if(category==="RAM"){
    if(specs.type) show.push(specs.type);
    if(specs.size) show.push(specs.size+"GB");
  }
  if(category==="Storage"){
    if(specs.type) show.push(specs.type);
    if(specs.size) show.push(specs.size>=1024?(specs.size/1024)+"TB":specs.size+"GB");
  }
  if(category==="GPU"){
    if(specs.vram)  show.push(specs.vram+"GB VRAM");
    if(specs.brand) show.push(specs.brand);
  }
  if(category==="PSU"){
    if(specs.wattage) show.push(specs.wattage+"W");
    if(specs.rating)  show.push(specs.rating);
  }
  if(category==="Cooler"){
    if(specs.type) show.push(specs.type);
  }
  if(!show.length) return null;
  return(
    <div style={{fontSize:11,color:"#888",marginBottom:8,lineHeight:1.7}}>
      {show.map((s,i)=><span key={i}>{s}{i<show.length-1?" · ":""}</span>)}
    </div>
  );
}

export default function PCBuilder({onClose, onEnquire}){
  const[categories,setCategories]=useState({});  // from DB
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState("");
  const[selected,setSelected]=useState({});
  const[activeTab,setActiveTab]=useState("");
  const[form,setForm]=useState({name:"",phone:""});
  const[sent,setSent]=useState(false);
  const[sending,setSending]=useState(false);
  const[sendError,setSendError]=useState("");

  /* ─── Fetch all components from DB ─── */
  useEffect(()=>{
    fetchComponents();
  },[]);

  async function fetchComponents(){
    setLoading(true); setError("");
    try{
      const res = await fetch(API+"/components");
      if(!res.ok) throw new Error("Server error "+res.status);
      const data = await res.json();
      setCategories(data);
      // Set first tab
      const firstCat = CAT_ORDER.find(c=>data[c]?.length>0);
      if(firstCat) setActiveTab(firstCat);
      // Default free options
      const defaults = {};
      if(data.GPU){
        const freeGpu = data.GPU.find(g=>g.price===0);
        if(freeGpu) defaults.GPU = freeGpu;
      }
      if(data.Cooler){
        const freeCooler = data.Cooler.find(c=>c.price===0);
        if(freeCooler) defaults.Cooler = freeCooler;
      }
      setSelected(defaults);
    }catch(e){
      setError("Could not load components. Is the server running?");
    }
    setLoading(false);
  }

  /* ─── Ordered categories (only show categories that exist in DB) ─── */
  const orderedCats = CAT_ORDER.filter(c=>categories[c]?.length>0);
  // Also show any custom categories admin added that aren't in CAT_ORDER
  const extraCats = Object.keys(categories).filter(c=>!CAT_ORDER.includes(c)&&categories[c]?.length>0);
  const allCats = [...orderedCats, ...extraCats];

  const total = Object.values(selected).reduce((s,c)=>s+(c?.price||0),0);
  const issues = checkCompatibility(selected);
  const requiredCats = allCats.filter(c=>CAT_META[c]?.required!==false);
  const allRequired = requiredCats.every(c=>selected[c]);

  function selectComponent(cat, item){
    setSelected(s=>({...s,[cat]:item}));
    // Advance to next tab
    const idx = allCats.indexOf(cat);
    if(idx < allCats.length-1) setActiveTab(allCats[idx+1]);
  }

  /* ─── Compatibility warning per item ─── */
  function getWarning(cat, item){
    const cpu = selected.CPU;
    const mb  = selected.Motherboard;
    if(cat==="Motherboard" && cpu){
      if(item.specs?.socket && cpu.specs?.socket && item.specs.socket !== cpu.specs.socket)
        return "Socket mismatch with "+cpu.name;
    }
    if(cat==="RAM" && mb){
      if(item.specs?.type && mb.specs?.ramType && item.specs.type !== mb.specs.ramType)
        return "Needs "+mb.specs.ramType+" — not compatible";
    }
    return "";
  }

  async function submitEnquiry(){
    if(!form.name||!form.phone) return;
    setSending(true); setSendError("");
    const summary = Object.entries(selected).filter(([,v])=>v)
      .map(([cat,v])=>cat+": "+v.name+" (Rs."+v.price.toLocaleString()+")").join("\n");
    try{
      const res = await fetch(API+"/inquiries",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:form.name, phone:form.phone,
          product:"Custom PC Build",
          message:"PC Build Request:\n"+summary+"\n\nEstimated Total: Rs."+total.toLocaleString()
        })
      });
      const d = await res.json();
      if(!res.ok) throw new Error(d.error||"Failed");
      setSent(true);
    }catch(e){ setSendError(e.message||"Failed. Please use WhatsApp below."); }
    setSending(false);
  }

  const inp = {border:"1.5px solid #ddd",padding:"10px 13px",fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",color:"#111"};

  /* ─── Loading ─── */
  if(loading) return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",padding:"32px 48px",textAlign:"center"}}>
        <div style={{fontWeight:700,fontSize:16,color:NAVY,marginBottom:8}}>Loading PC Builder...</div>
        <div style={{fontSize:13,color:"#888"}}>Fetching latest prices from store</div>
      </div>
    </div>
  );

  /* ─── Error / Empty state ─── */
  if(error||allCats.length===0) return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",padding:"40px",textAlign:"center",maxWidth:400}}>
        <div style={{fontWeight:700,fontSize:16,color:NAVY,marginBottom:8}}>PC Builder Not Set Up</div>
        <div style={{fontSize:13,color:"#666",lineHeight:1.7,marginBottom:20}}>{error||"No components found. Ask the admin to seed PC component prices from the Admin Panel."}</div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={fetchComponents} style={{background:NAVY,color:"#fff",border:"none",padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Retry</button>
          <button onClick={onClose} style={{background:"#fff",color:NAVY,border:"1.5px solid "+NAVY,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"20px 0"}}>
      <div style={{background:"#f5f7fa",width:"100%",maxWidth:1200,fontFamily:"'DM Sans',sans-serif"}}>

        {/* Header */}
        <div style={{background:NAVY,padding:"18px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div>
            <div style={{fontWeight:800,fontSize:20,color:"#fff",letterSpacing:"-.01em"}}>Custom PC Builder</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:2}}>Select components — we assemble it at Advantage Silchar</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".06em"}}>Estimated Total</div>
              <div style={{fontWeight:800,fontSize:24,color:"#fff"}}>Rs.{total.toLocaleString()}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>+ Assembly charges</div>
            </div>
            <button onClick={onClose}
              style={{background:"none",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.7)",padding:"8px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              Close
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"260px 1fr",minHeight:"80vh"}}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{background:NAVY,padding:"20px 16px",overflowY:"auto"}}>

            {/* Build summary */}
            <div style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:12}}>Your Build</div>
            {allCats.map(cat=>{
              const meta = CAT_META[cat];
              const sel  = selected[cat];
              return(
                <div key={cat} onClick={()=>setActiveTab(cat)}
                  style={{padding:"8px 10px",marginBottom:4,background:activeTab===cat?"rgba(204,26,26,.25)":"rgba(255,255,255,.04)",border:"1px solid "+(activeTab===cat?RED:"rgba(255,255,255,.08)"),cursor:"pointer",transition:"all .15s"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.4)",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>
                    {meta?.label||cat}{meta?.required===false&&" (Optional)"}
                  </div>
                  <div style={{fontSize:12,fontWeight:sel?600:400,color:sel?"#fff":"rgba(255,255,255,.3)"}}>
                    {sel?sel.name:"Not selected"}
                  </div>
                  {sel&&sel.price>0&&<div style={{fontSize:11,color:RED,fontWeight:700,marginTop:2}}>Rs.{sel.price.toLocaleString()}</div>}
                </div>
              );
            })}

            {/* Total */}
            <div style={{marginTop:14,padding:"12px 10px",background:"rgba(204,26,26,.15)",border:"1px solid "+RED}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Components Total</div>
              <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>Rs.{total.toLocaleString()}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:3}}>Assembly charges billed separately</div>
            </div>

            {/* Compatibility issues */}
            {issues.length>0&&(
              <div style={{marginTop:10}}>
                {issues.map((issue,i)=>(
                  <div key={i} style={{background:"rgba(255,200,0,.1)",border:"1px solid rgba(255,200,0,.25)",padding:"8px 10px",fontSize:11,color:"#ffd700",marginBottom:6,lineHeight:1.5}}>
                    {issue}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{padding:"22px 28px",overflowY:"auto"}}>

            {/* Tab nav */}
            <div style={{display:"flex",gap:0,marginBottom:24,overflowX:"auto",borderBottom:"2px solid #dde2f0"}}>
              {allCats.map(cat=>{
                const meta = CAT_META[cat];
                const done = !!selected[cat];
                return(
                  <button key={cat} onClick={()=>setActiveTab(cat)}
                    style={{padding:"9px 14px",fontSize:12,fontWeight:600,border:"none",background:"none",cursor:"pointer",borderBottom:"2px solid "+(activeTab===cat?RED:"transparent"),marginBottom:-2,color:activeTab===cat?RED:done?"#16a34a":"#888",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .15s",letterSpacing:".02em"}}>
                    {meta?.label||cat}{done?" ✓":""}
                  </button>
                );
              })}
            </div>

            {/* Component cards for active tab */}
            {allCats.map(cat=>{
              if(activeTab!==cat) return null;
              const meta  = CAT_META[cat];
              const items = categories[cat]||[];
              return(
                <div key={cat}>
                  <div style={{marginBottom:18}}>
                    <h2 style={{fontWeight:800,fontSize:19,color:NAVY,marginBottom:3}}>{meta?.label||cat}</h2>
                    {meta?.required===false&&<div style={{fontSize:12,color:"#888"}}>Optional — skip if not needed</div>}
                    <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{items.length} option{items.length!==1?"s":""} available</div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                    {items.map(item=>{
                      const isSel   = selected[cat]?._id===item._id || selected[cat]?.componentId===item.componentId;
                      const warning = getWarning(cat,item);
                      const outOfStock = item.inStock===false;

                      return(
                        <div key={item.componentId}
                          onClick={()=>!warning&&!outOfStock&&selectComponent(cat,item)}
                          style={{background:"#fff",border:"2px solid "+(isSel?RED:warning||outOfStock?"#f59e0b":"#e8e8e8"),padding:"14px 16px",cursor:warning||outOfStock?"not-allowed":"pointer",transition:"border-color .15s",opacity:warning||outOfStock?.55:1,position:"relative"}}
                          onMouseEnter={e=>{if(!warning&&!outOfStock)e.currentTarget.style.borderColor=isSel?RED:NAVY;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=isSel?RED:warning||outOfStock?"#f59e0b":"#e8e8e8";}}>

                          {isSel&&<div style={{position:"absolute",top:8,right:8,background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",letterSpacing:".04em",textTransform:"uppercase"}}>Selected</div>}
                          {outOfStock&&<div style={{position:"absolute",top:8,right:8,background:"#555",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",letterSpacing:".04em"}}>Out of Stock</div>}

                          <div style={{fontWeight:700,fontSize:14,color:NAVY,marginBottom:6,paddingRight:isSel||outOfStock?70:0,lineHeight:1.3}}>{item.name}</div>
                          <SpecBadges specs={item.specs} category={cat}/>
                          {item.note&&<div style={{fontSize:11,color:"#888",fontStyle:"italic",marginBottom:6}}>{item.note}</div>}
                          {warning&&<div style={{fontSize:11,color:"#d97706",fontWeight:600,marginBottom:6}}>Warning: {warning}</div>}

                          <div style={{fontWeight:800,fontSize:18,color:item.price===0?"#16a34a":NAVY}}>
                            {item.price===0?"Included / Free":"Rs."+item.price.toLocaleString()}
                          </div>
                          {item.updatedAt&&(
                            <div style={{fontSize:9,color:"#bbb",marginTop:3}}>
                              Updated: {Math.floor((Date.now()-new Date(item.updatedAt))/(864e5))} days ago
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Next button */}
                  {allCats.indexOf(cat)<allCats.length-1&&(
                    <button onClick={()=>setActiveTab(allCats[allCats.indexOf(cat)+1])}
                      style={{marginTop:18,background:NAVY,color:"#fff",border:"none",padding:"11px 28px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:".04em",transition:"background .15s"}}
                      onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                      Next: {CAT_META[allCats[allCats.indexOf(cat)+1]]?.label||allCats[allCats.indexOf(cat)+1]}
                    </button>
                  )}
                </div>
              );
            })}

            {/* Build summary + enquire form */}
            {allRequired&&(
              <div style={{marginTop:28,background:"#fff",border:"2px solid "+NAVY,padding:"24px"}}>
                <h3 style={{fontWeight:800,fontSize:17,color:NAVY,marginBottom:18}}>Build Summary</h3>
                <table style={{width:"100%",borderCollapse:"collapse",marginBottom:18}}>
                  <tbody>
                    {Object.entries(selected).filter(([,v])=>v).map(([cat,v],i)=>(
                      <tr key={cat} style={{borderBottom:"1px solid #f0f0f0",background:i%2===0?"#f9f9fb":"#fff"}}>
                        <td style={{padding:"10px 14px",fontSize:11,fontWeight:700,color:"#777",textTransform:"uppercase",letterSpacing:".05em",width:"22%"}}>{CAT_META[cat]?.label||cat}</td>
                        <td style={{padding:"10px 14px",fontSize:13,color:NAVY,fontWeight:500}}>{v.name}</td>
                        <td style={{padding:"10px 14px",fontSize:13,fontWeight:700,color:v.price===0?"#16a34a":NAVY,textAlign:"right",whiteSpace:"nowrap"}}>{v.price===0?"Free":"Rs."+v.price.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{background:NAVY}}>
                      <td style={{padding:"12px 14px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.5)",textTransform:"uppercase"}}>Total</td>
                      <td style={{padding:"12px 14px",fontSize:12,color:"rgba(255,255,255,.4)"}}>Assembly charges separate</td>
                      <td style={{padding:"12px 14px",fontSize:20,fontWeight:800,color:"#fff",textAlign:"right"}}>Rs.{total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {issues.length===0&&(
                  <div style={{background:"#f0fdf4",border:"1px solid #86efac",padding:"10px 14px",marginBottom:16,fontSize:13,color:"#15803d",fontWeight:500}}>
                    All components are compatible with each other.
                  </div>
                )}

                {!sent?(
                  <div>
                    <div style={{fontSize:13,color:"#666",marginBottom:12}}>Send this build to us — we'll confirm availability and assembly time.</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your Name *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                      <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone Number *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                    </div>
                    {sendError&&<div style={{background:"#fff0f0",border:"1px solid #fecaca",padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:10}}>{sendError}</div>}
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={submitEnquiry} disabled={!form.name||!form.phone||sending}
                        style={{flex:1,background:form.name&&form.phone?NAVY:"#ccc",color:"#fff",border:"none",padding:"13px",fontSize:13,fontWeight:700,cursor:form.name&&form.phone?"pointer":"not-allowed",fontFamily:"inherit",transition:"background .15s"}}
                        onMouseEnter={e=>{if(form.name&&form.phone)e.target.style.background=RED;}} onMouseLeave={e=>{if(form.name&&form.phone)e.target.style.background=NAVY;}}>
                        {sending?"Sending...":"Send Build Enquiry"}
                      </button>
                      <button onClick={()=>window.open("https://wa.me/919435070738?text="+encodeURIComponent("Hi, Custom PC Build enquiry:\n\n"+Object.entries(selected).filter(([,v])=>v&&v.price>0).map(([c,v])=>(CAT_META[c]?.label||c)+": "+v.name).join("\n")+"\n\nTotal: Rs."+total.toLocaleString()),"_blank")}
                        style={{flex:1,background:"#25D366",color:"#fff",border:"none",padding:"13px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                        WhatsApp Build
                      </button>
                    </div>
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"24px"}}>
                    <div style={{fontWeight:800,fontSize:18,color:NAVY,marginBottom:8}}>Build Enquiry Sent!</div>
                    <p style={{fontSize:13,color:"#666",lineHeight:1.7}}>We'll call <strong>{form.phone}</strong> to confirm parts and assembly time.<br/>Or reach us at <strong style={{color:RED}}>9435070738</strong>.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}