import { useState, useEffect } from "react";

const NAVY = "#0B1F5E";
const RED  = "#CC1A1A";
const API  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COMPONENTS = {
  CPU: {
    label:"Processor (CPU)", icon:"⚙️", required:true,
    options:[
      { id:"i3-12100",  name:"Intel Core i3-12100",   brand:"Intel", socket:"LGA1700", ram:"DDR4/DDR5", tdp:60,  price:8500  },
      { id:"i5-12400",  name:"Intel Core i5-12400",   brand:"Intel", socket:"LGA1700", ram:"DDR4/DDR5", tdp:65,  price:13000 },
      { id:"i5-13600k", name:"Intel Core i5-13600K",  brand:"Intel", socket:"LGA1700", ram:"DDR4/DDR5", tdp:125, price:21000 },
      { id:"i7-12700",  name:"Intel Core i7-12700",   brand:"Intel", socket:"LGA1700", ram:"DDR4/DDR5", tdp:65,  price:26000 },
      { id:"r5-5600",   name:"AMD Ryzen 5 5600",      brand:"AMD",   socket:"AM4",     ram:"DDR4",      tdp:65,  price:11500 },
      { id:"r5-7600x",  name:"AMD Ryzen 5 7600X",     brand:"AMD",   socket:"AM5",     ram:"DDR5",      tdp:105, price:18500 },
      { id:"r7-7700x",  name:"AMD Ryzen 7 7700X",     brand:"AMD",   socket:"AM5",     ram:"DDR5",      tdp:105, price:28000 },
    ]
  },
  Motherboard: {
    label:"Motherboard", icon:"🖥️", required:true,
    options:[
      { id:"h610m",     name:"MSI H610M Pro-S",            socket:"LGA1700", ram:"DDR4", maxRam:64,  price:6500  },
      { id:"h610k",     name:"Asus Prime H610M-K",          socket:"LGA1700", ram:"DDR4", maxRam:64,  price:7200  },
      { id:"b660m",     name:"MSI B660M Pro-A",             socket:"LGA1700", ram:"DDR4", maxRam:128, price:9500  },
      { id:"b660k",     name:"Asus Prime B660M-K",          socket:"LGA1700", ram:"DDR4", maxRam:128, price:9000  },
      { id:"b550m",     name:"MSI B550M Pro-VDH WiFi",      socket:"AM4",     ram:"DDR4", maxRam:128, price:8500  },
      { id:"b550a",     name:"Asus Prime B550M-A",          socket:"AM4",     ram:"DDR4", maxRam:128, price:8000  },
      { id:"b650m",     name:"MSI B650M Pro-A",             socket:"AM5",     ram:"DDR5", maxRam:192, price:12500 },
      { id:"b650e",     name:"Asus Prime B650M-A WiFi",     socket:"AM5",     ram:"DDR5", maxRam:192, price:13500 },
    ]
  },
  RAM: {
    label:"RAM (Memory)", icon:"💾", required:true,
    options:[
      { id:"8d4",  name:"8GB DDR4 3200MHz",   type:"DDR4", size:8,  price:2200  },
      { id:"16d4", name:"16GB DDR4 3200MHz",  type:"DDR4", size:16, price:3800  },
      { id:"32d4", name:"32GB DDR4 3200MHz",  type:"DDR4", size:32, price:7500  },
      { id:"16d5", name:"16GB DDR5 4800MHz",  type:"DDR5", size:16, price:5500  },
      { id:"32d5", name:"32GB DDR5 4800MHz",  type:"DDR5", size:32, price:10000 },
    ]
  },
  Storage: {
    label:"Storage", icon:"💿", required:true,
    options:[
      { id:"256ssd", name:"256GB NVMe SSD",             type:"SSD",   size:256,  price:2500  },
      { id:"512ssd", name:"512GB NVMe SSD",             type:"SSD",   size:512,  price:3500  },
      { id:"1tssd",  name:"1TB NVMe SSD",               type:"SSD",   size:1024, price:6500  },
      { id:"2tssd",  name:"2TB NVMe SSD",               type:"SSD",   size:2048, price:12000 },
      { id:"1thdd",  name:"1TB HDD 7200RPM",            type:"HDD",   size:1024, price:3200  },
      { id:"2thdd",  name:"2TB HDD 7200RPM",            type:"HDD",   size:2048, price:5500  },
      { id:"512+1t", name:"512GB SSD + 1TB HDD (Combo)",type:"Combo", size:1536, price:6500  },
    ]
  },
  GPU: {
    label:"Graphics Card (GPU)", icon:"🎮", required:false,
    options:[
      { id:"none",   name:"No GPU (Integrated Graphics)", brand:"—",     vram:0,  price:0     },
      { id:"1650",   name:"NVIDIA GTX 1650 4GB",          brand:"NVIDIA",vram:4,  price:14000 },
      { id:"3060",   name:"NVIDIA RTX 3060 12GB",         brand:"NVIDIA",vram:12, price:25000 },
      { id:"3060ti", name:"NVIDIA RTX 3060 Ti 8GB",       brand:"NVIDIA",vram:8,  price:30000 },
      { id:"4060",   name:"NVIDIA RTX 4060 8GB",          brand:"NVIDIA",vram:8,  price:32000 },
      { id:"4060ti", name:"NVIDIA RTX 4060 Ti 16GB",      brand:"NVIDIA",vram:16, price:42000 },
      { id:"rx6600", name:"AMD RX 6600 8GB",              brand:"AMD",   vram:8,  price:22000 },
      { id:"rx7600", name:"AMD RX 7600 8GB",              brand:"AMD",   vram:8,  price:27000 },
    ]
  },
  Cabinet: {
    label:"Cabinet (Case)", icon:"🗳️", required:true,
    options:[
      { id:"basic",    name:"Basic ATX Cabinet",                  formFactor:"ATX",  price:2500 },
      { id:"cm690",    name:"Cooler Master MasterBox Q300L",      formFactor:"mATX", price:3500 },
      { id:"mid",      name:"Mid Tower ATX Cabinet",              formFactor:"ATX",  price:4500 },
      { id:"midglass", name:"Mid Tower ATX with Tempered Glass",  formFactor:"ATX",  price:5500 },
      { id:"full",     name:"Full Tower ATX Cabinet",             formFactor:"ATX",  price:7000 },
    ]
  },
  PSU: {
    label:"Power Supply (PSU)", icon:"🔌", required:true,
    options:[
      { id:"450w",  name:"450W 80+ Standard", wattage:450, rating:"Standard", price:3000  },
      { id:"550wb", name:"550W 80+ Bronze",   wattage:550, rating:"Bronze",   price:4500  },
      { id:"650wg", name:"650W 80+ Gold",     wattage:650, rating:"Gold",     price:6500  },
      { id:"750wg", name:"750W 80+ Gold",     wattage:750, rating:"Gold",     price:8000  },
      { id:"850wg", name:"850W 80+ Gold",     wattage:850, rating:"Gold",     price:10000 },
    ]
  },
  Cooler: {
    label:"CPU Cooler", icon:"❄️", required:false,
    options:[
      { id:"stock",  name:"Stock Cooler (Included with CPU)",  type:"Air",    price:0    },
      { id:"hm212",  name:"Cooler Master Hyper 212 Black",     type:"Air",    price:2500 },
      { id:"noctua", name:"Noctua NH-U12S",                   type:"Air",    price:5500 },
      { id:"aio240", name:"240mm AIO Liquid Cooler",          type:"Liquid", price:6000 },
      { id:"aio360", name:"360mm AIO Liquid Cooler",          type:"Liquid", price:9000 },
    ]
  },
};

function checkCompatibility(selected){
  const issues=[];
  const cpu=selected.CPU, mb=selected.Motherboard, ram=selected.RAM, psu=selected.PSU, gpu=selected.GPU;
  if(cpu&&mb){
    if(cpu.socket!==mb.socket) issues.push("❌ CPU socket ("+cpu.socket+") doesn't match Motherboard socket ("+mb.socket+")");
  }
  if(mb&&ram){
    if(mb.ram!==ram.type) issues.push("❌ Motherboard supports "+mb.ram+" but you selected "+ram.type+" RAM");
  }
  if(cpu&&psu&&gpu){
    const required=cpu.tdp+(gpu&&gpu.price>0?150:0)+100;
    if(psu.wattage<required) issues.push("⚠️ PSU may be underpowered. Recommended: "+required+"W+, selected: "+psu.wattage+"W");
  }
  if(cpu&&cpu.brand==="AMD"&&!cpu.name.includes("G")&&gpu&&gpu.id==="none"){
    issues.push("⚠️ AMD Ryzen (non-G) CPUs have no integrated graphics. Please add a GPU.");
  }
  return issues;
}

const USE_CASES=[
  {label:"💼 Office PC",     budget:35000,  picks:{CPU:"i3-12100",Motherboard:"h610m",RAM:"8d4",  Storage:"512ssd",GPU:"none",  Cabinet:"basic",   PSU:"450w", Cooler:"stock"}},
  {label:"🎓 Student PC",    budget:40000,  picks:{CPU:"i3-12100",Motherboard:"h610m",RAM:"16d4", Storage:"512ssd",GPU:"none",  Cabinet:"mid",     PSU:"550wb",Cooler:"stock"}},
  {label:"🎮 Gaming PC",     budget:80000,  picks:{CPU:"i5-12400",Motherboard:"b660m",RAM:"16d4", Storage:"512ssd",GPU:"3060",  Cabinet:"midglass",PSU:"650wg",Cooler:"hm212"}},
  {label:"🎮 Budget Gaming", budget:55000,  picks:{CPU:"r5-5600", Motherboard:"b550m",RAM:"16d4", Storage:"512ssd",GPU:"rx6600",Cabinet:"mid",     PSU:"550wb",Cooler:"stock"}},
  {label:"🖥️ Content Creation", budget:150000, picks:{CPU:"r7-7700x",Motherboard:"b650m",RAM:"32d5", Storage:"2tssd", GPU:"4060ti",Cabinet:"midglass",PSU:"750wg",Cooler:"aio240"}},
  {label:"👨‍💻 Programming", budget:60000,  picks:{CPU:"i5-12400",Motherboard:"b660m",RAM:"16d4", Storage:"512ssd",GPU:"none",  Cabinet:"mid",     PSU:"550wb",Cooler:"stock"}},
  {label:"📊 Data Analysis", budget:90000,  picks:{CPU:"r5-7600x",Motherboard:"b650m",RAM:"32d5", Storage:"1tssd", GPU:"none",  Cabinet:"midglass",PSU:"550wb",Cooler:
    "stock"}},
  {label:"🎨 Graphic Design", budget:85000,  picks:{CPU:"r5-7600x",Motherboard:"b650m",RAM:"32d5", Storage:"1tssd", GPU:"rx7600",Cabinet:"midglass",PSU:"650wg",Cooler:"hm212"}},
  {label:"🎥 Video Editing", budget:120000, picks:{CPU:"r7-7700x",Motherboard:"b650m",RAM:"32d5", Storage:"2tssd", GPU:"4060ti",Cabinet:"midglass",PSU:"750wg",Cooler:"aio240"}},
  {label:"💻 All-rounder",   budget:70000,  picks:{CPU:"i5-13600k",Motherboard:"b660m",RAM:"16d4", Storage:"512ssd",GPU:"3060ti",Cabinet:"midglass",PSU:"650wg",Cooler:"hm212"}},
  {label:"⚡ High Performance", budget:200000, picks:{CPU:"i5-13600k",Motherboard:"b660m",RAM:"32d5", Storage:"2tssd", GPU:"4060ti",Cabinet:"full",    PSU:"850wg",Cooler:"aio360"}},
  {label:"Machine Learning",   budget:180000, picks:{CPU:"r7-7700x",Motherboard:"b650m",RAM:"32d5", Storage:"2tssd", GPU:"4060ti",Cabinet:"full",    PSU:"850wg",Cooler:"aio360"}},
  {label:"🎮 High-end Gaming", budget:150000, picks:{CPU:"i7-12700",Motherboard:"b660m",RAM:"32d4", Storage:"1tssd", GPU:"4060ti",Cabinet:"midglass",PSU:"750wg",Cooler:"hm212"}},
  {label:"Artificial Intelligence", budget:250000, picks:{CPU:"r7-7700x",Motherboard:"b650m",RAM:"32d5", Storage:"2tssd", GPU:"4060ti",Cabinet:"full",    PSU:"850wg",Cooler:"aio360"}},
  {label:"🎬 Video Editing", budget:100000, picks:{CPU:"i7-12700",Motherboard:"b660m",RAM:"32d4", Storage:"512+1t",GPU:"4060",  Cabinet:"midglass",PSU:"750wg",Cooler:"hm212"}},
  {label:"🖥️ Workstation",   budget:120000, picks:{CPU:"r7-7700x",Motherboard:"b650m",RAM:"32d5", Storage:"1tssd", GPU:"4060ti",Cabinet:"full",    PSU:"850wg",Cooler:"aio240"}},
];

function daysAgo(dateStr){
  if(!dateStr) return null;
  const diff=Math.floor((Date.now()-new Date(dateStr))/(1000*60*60*24));
  if(diff===0) return "Today";
  if(diff===1) return "Yesterday";
  return diff+" days ago";
}

export default function PCBuilder({onClose,onEnquire}){
  const[selected,setSelected]=useState({
    GPU:   {id:"none", name:"No GPU (Integrated Graphics)",brand:"—",vram:0,price:0},
    Cooler:{id:"stock",name:"Stock Cooler (Included with CPU)",type:"Air",price:0},
  });
  const[activeSection,setActiveSection]=useState("CPU");
  const[enquireSent,setEnquireSent]=useState(false);
  const[form,setForm]=useState({name:"",phone:""});
  const[componentPrices,setComponentPrices]=useState({});
  const[apiLoading,setApiLoading]=useState(false);

  useEffect(()=>{ fetchComponentPrices(); },[]);

  async function fetchComponentPrices(){
    setApiLoading(true);
    try{
      const res=await fetch(API+"/components");
      if(res.ok){
        const data=await res.json();
        const map={};
        for(const[category,items] of Object.entries(data)){
          for(const item of items){
            map[category+":"+item.componentId]={
              price:    item.price,
              inStock:  item.inStock,
              note:     item.note||"",
              updatedAt:item.updatedAt,
            };
          }
        }
        setComponentPrices(map);
      }
    } catch(e){}
    setApiLoading(false);
  }

  // Merge API prices with hardcoded defaults
  const merged={};
  for(const[cat,def] of Object.entries(COMPONENTS)){
    merged[cat]={...def, options:def.options.map(opt=>{
      const fetched=componentPrices[cat+":"+opt.id];
      return fetched ? {...opt,price:fetched.price,inStock:fetched.inStock,note:fetched.note,updatedAt:fetched.updatedAt} : opt;
    })};
  }

  const total=Object.values(selected).reduce((s,c)=>s+(c?.price||0),0);
  const issues=checkCompatibility(selected);
  const allRequired=["CPU","Motherboard","RAM","Storage","Cabinet","PSU"].every(k=>selected[k]);

  function selectComponent(cat,opt){
    setSelected(s=>({...s,[cat]:opt}));
    const keys=Object.keys(merged);
    const idx=keys.indexOf(cat);
    if(idx<keys.length-1) setActiveSection(keys[idx+1]);
  }

  function applyPreset(preset){
    const newSel={};
    for(const[cat,id] of Object.entries(preset.picks)){
      const opt=merged[cat]?.options?.find(o=>o.id===id);
      if(opt) newSel[cat]=opt;
    }
    setSelected(newSel);
    setActiveSection("CPU");
  }

  const[enquireLoading,setEnquireLoading]=useState(false);
  const[enquireError,setEnquireError]=useState("");

  async function submitEnquiry(){
    if(!form.name||!form.phone) return;
    setEnquireLoading(true); setEnquireError("");
    const buildSummary=Object.entries(selected).filter(([,v])=>v)
      .map(([cat,v])=>cat+": "+v.name+" (₹"+(v.price||0).toLocaleString()+")").join("\n");
    try{
      const res=await fetch(API+"/inquiries",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:form.name,phone:form.phone,
          product:"Custom PC Build",
          message:"PC Build Request:\n"+buildSummary+"\n\nEstimated Total: ₹"+total.toLocaleString()
        })
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Server error "+res.status);
      setEnquireSent(true);
    }catch(e){
      setEnquireError(e.message||"Failed to send. Please use WhatsApp below.");
    }
    setEnquireLoading(false);
  }

  const inp={border:"1.5px solid #ddd",padding:"11px 13px",fontSize:14,fontFamily:"inherit",outline:"none",width:"100%"};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"20px 0"}}>
      <div style={{background:"#f5f7fa",width:"100%",maxWidth:1200,fontFamily:"'DM Sans',sans-serif"}}>

        {/* Header */}
        <div style={{background:NAVY,padding:"20px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div>
            <div style={{fontWeight:800,fontSize:22,color:"#fff"}}>🔧 Custom PC Builder</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:2}}>
              Select components — we assemble it for you at Advantage Silchar
              {apiLoading&&<span style={{marginLeft:12,color:"#ffd700"}}>⟳ Loading latest prices...</span>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>Estimated Total</div>
              <div style={{fontWeight:800,fontSize:26,color:"#fff"}}>₹{total.toLocaleString()}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>+Assembly charges</div>
            </div>
            <button onClick={onClose}
              style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              ✕ Close
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"270px 1fr",minHeight:"85vh"}}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{background:NAVY,padding:"20px 16px",overflowY:"auto"}}>

            {/* Presets */}
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:RED,marginBottom:10}}>Quick Presets</div>
            {USE_CASES.map(uc=>(
              <button key={uc.label} onClick={()=>applyPreset(uc)}
                style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.85)",padding:"8px 12px",fontSize:12,fontWeight:500,cursor:"pointer",marginBottom:6,textAlign:"left",fontFamily:"inherit",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.14)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>
                <span>{uc.label}</span>
                <span style={{color:RED,fontWeight:700,fontSize:11}}>~₹{(uc.budget/1000).toFixed(0)}K</span>
              </button>
            ))}

            {/* Component list */}
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",margin:"18px 0 10px"}}>Your Build</div>
            {Object.entries(merged).map(([cat,def])=>(
              <div key={cat} onClick={()=>setActiveSection(cat)}
                style={{padding:"8px 10px",marginBottom:4,background:activeSection===cat?"rgba(204,26,26,.3)":"rgba(255,255,255,.04)",border:"1px solid "+(activeSection===cat?RED:"rgba(255,255,255,.08)"),cursor:"pointer",transition:"all .15s"}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,.4)",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{def.icon} {def.label}{!def.required&&" (Optional)"}</div>
                <div style={{fontSize:12,color:selected[cat]?"#fff":"rgba(255,255,255,.3)",fontWeight:600,marginTop:2}}>
                  {selected[cat]?selected[cat].name:"Not selected"}
                </div>
                {selected[cat]?.price>0&&<div style={{fontSize:11,color:RED,fontWeight:700,marginTop:1}}>₹{selected[cat].price.toLocaleString()}</div>}
              </div>
            ))}

            {/* Total box */}
            <div style={{marginTop:16,padding:"14px 12px",background:"rgba(204,26,26,.15)",border:"1px solid "+RED}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginBottom:4}}>Components Total</div>
              <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>₹{total.toLocaleString()}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:3}}>Assembly charges billed separately</div>
            </div>

            {/* Issues */}
            {issues.length>0&&(
              <div style={{marginTop:12}}>
                {issues.map((issue,i)=>(
                  <div key={i} style={{background:"rgba(255,200,0,.1)",border:"1px solid rgba(255,200,0,.3)",padding:"8px 10px",fontSize:11,color:"#ffd700",marginBottom:6,lineHeight:1.5}}>{issue}</div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{padding:"24px 28px",overflowY:"auto"}}>

            {/* Tab nav */}
            <div style={{display:"flex",gap:0,marginBottom:24,overflowX:"auto",borderBottom:"2px solid #dde2f0"}}>
              {Object.entries(merged).map(([cat,def])=>(
                <button key={cat} onClick={()=>setActiveSection(cat)}
                  style={{padding:"10px 14px",fontSize:12,fontWeight:600,border:"none",background:"none",cursor:"pointer",borderBottom:"2px solid "+(activeSection===cat?RED:"transparent"),marginBottom:-2,color:activeSection===cat?RED:selected[cat]?"#16a34a":"#888",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .15s"}}>
                  {def.icon} {cat==="Motherboard"?"MoBo":cat==="Cabinet"?"Case":cat}
                  {selected[cat]&&" ✓"}
                </button>
              ))}
            </div>

            {/* Component cards */}
            {Object.entries(merged).map(([cat,def])=>activeSection===cat&&(
              <div key={cat}>
                <div style={{marginBottom:20}}>
                  <h2 style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:4}}>{def.icon} {def.label}</h2>
                  {!def.required&&<div style={{fontSize:12,color:"#888"}}>Optional — skip if not needed for your use case</div>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                  {def.options.map(opt=>{
                    const isSelected=selected[cat]?.id===opt.id;
                    const cpu=selected.CPU, mb=selected.Motherboard;
                    let warning="";
                    if(cat==="Motherboard"&&cpu&&opt.socket!==cpu.socket) warning="Socket mismatch with "+cpu.name;
                    if(cat==="RAM"&&mb&&opt.type!==mb.ram) warning="Needs "+mb.ram+" — not compatible";
                    const outOfStock=opt.inStock===false;

                    return(
                      <div key={opt.id}
                        onClick={()=>!warning&&!outOfStock&&selectComponent(cat,opt)}
                        style={{background:"#fff",border:"2px solid "+(isSelected?RED:warning||outOfStock?"#f59e0b":"#e8e8e8"),padding:"16px",cursor:warning||outOfStock?"not-allowed":"pointer",transition:"all .15s",opacity:warning||outOfStock?.6:1,position:"relative"}}
                        onMouseEnter={e=>{if(!warning&&!outOfStock)e.currentTarget.style.borderColor=isSelected?RED:NAVY;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=isSelected?RED:warning||outOfStock?"#f59e0b":"#e8e8e8";}}>

                        {isSelected&&<div style={{position:"absolute",top:8,right:8,background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",letterSpacing:".04em"}}>SELECTED</div>}
                        {outOfStock&&<div style={{position:"absolute",top:8,right:8,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px"}}>OUT OF STOCK</div>}

                        <div style={{fontWeight:700,fontSize:14,color:NAVY,marginBottom:6,paddingRight:isSelected||outOfStock?70:0,lineHeight:1.3}}>{opt.name}</div>

                        <div style={{fontSize:11,color:"#888",marginBottom:8,lineHeight:1.7}}>
                          {opt.socket&&<span>Socket: {opt.socket} &nbsp;·&nbsp; </span>}
                          {opt.ram&&cat==="CPU"&&<span>RAM: {opt.ram} &nbsp;·&nbsp; </span>}
                          {opt.tdp&&<span>TDP: {opt.tdp}W &nbsp;·&nbsp; </span>}
                          {opt.type&&cat==="RAM"&&<span>{opt.type} · {opt.size}GB &nbsp;·&nbsp; </span>}
                          {opt.type&&cat==="Storage"&&<span>{opt.type} · {opt.size>=1024?(opt.size/1024)+"TB":opt.size+"GB"} &nbsp;·&nbsp; </span>}
                          {opt.vram>0&&<span>VRAM: {opt.vram}GB &nbsp;·&nbsp; </span>}
                          {opt.wattage&&<span>{opt.wattage}W · {opt.rating} &nbsp;·&nbsp; </span>}
                        </div>

                        {warning&&<div style={{fontSize:10,color:"#d97706",fontWeight:600,marginBottom:6}}>⚠️ {warning}</div>}
                        {opt.note&&<div style={{fontSize:10,color:"#888",fontStyle:"italic",marginBottom:6}}>{opt.note}</div>}

                        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                          <div style={{fontWeight:800,fontSize:20,color:opt.price===0?"#16a34a":NAVY}}>
                            {opt.price===0?"Included / Free":"₹"+opt.price.toLocaleString()}
                          </div>
                          {opt.updatedAt&&(
                            <div style={{fontSize:9,color:"#aaa"}}>Updated: {daysAgo(opt.updatedAt)}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Next button */}
                {Object.keys(merged).indexOf(cat)<Object.keys(merged).length-1&&(
                  <button onClick={()=>{const keys=Object.keys(merged);setActiveSection(keys[keys.indexOf(cat)+1]);}}
                    style={{marginTop:20,background:NAVY,color:"#fff",border:"none",padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                    onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                    Next: {Object.keys(merged)[Object.keys(merged).indexOf(cat)+1]} →
                  </button>
                )}
              </div>
            ))}

            {/* Summary + Enquire */}
            {allRequired&&(
              <div style={{marginTop:32,background:"#fff",border:"2px solid "+NAVY,padding:"28px"}}>
                <h3 style={{fontWeight:800,fontSize:18,color:NAVY,marginBottom:20}}>📋 Build Summary</h3>
                <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20}}>
                  <tbody>
                    {Object.entries(selected).filter(([,v])=>v).map(([cat,v],i)=>(
                      <tr key={cat} style={{borderBottom:"1px solid #f0f0f0",background:i%2===0?"#f9f9fb":"#fff"}}>
                        <td style={{padding:"10px 16px",fontSize:11,fontWeight:700,color:"#777",textTransform:"uppercase",letterSpacing:".05em",width:"18%"}}>{cat}</td>
                        <td style={{padding:"10px 16px",fontSize:14,color:NAVY,fontWeight:500}}>{v.name}</td>
                        <td style={{padding:"10px 16px",fontSize:14,fontWeight:700,color:v.price===0?"#16a34a":NAVY,textAlign:"right",whiteSpace:"nowrap"}}>{v.price===0?"Free":"₹"+v.price.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{background:NAVY}}>
                      <td style={{padding:"14px 16px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.5)",textTransform:"uppercase"}}>Total</td>
                      <td style={{padding:"14px 16px",fontSize:12,color:"rgba(255,255,255,.4)"}}>Assembly charges billed separately</td>
                      <td style={{padding:"14px 16px",fontSize:22,fontWeight:800,color:"#fff",textAlign:"right"}}>₹{total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {issues.length===0&&(
                  <div style={{background:"#f0fdf4",border:"1px solid #86efac",padding:"12px 16px",marginBottom:20,fontSize:13,color:"#15803d",fontWeight:500}}>
                    ✅ All components are compatible with each other.
                  </div>
                )}

                {!enquireSent?(
                  <div>
                    <div style={{fontSize:13,color:"#666",marginBottom:14}}>Send this build to Advantage Silchar — we'll confirm parts & assembly time.</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                      <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your Name *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                      <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone Number *" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                    </div>
                    {enquireError&&<div style={{background:"#fff0f0",border:"1px solid #fecaca",padding:"10px 14px",fontSize:13,color:"#dc2626",fontWeight:500,marginBottom:10}}>⚠️ {enquireError}</div>}
                    <div style={{display:"flex",gap:12}}>
                      <button onClick={submitEnquiry} disabled={!form.name||!form.phone||enquireLoading}
                        style={{flex:1,background:form.name&&form.phone&&!enquireLoading?NAVY:"#ccc",color:"#fff",border:"none",padding:"14px",fontSize:14,fontWeight:700,cursor:form.name&&form.phone&&!enquireLoading?"pointer":"not-allowed",fontFamily:"inherit",transition:"background .15s"}}
                        onMouseEnter={e=>{if(form.name&&form.phone&&!enquireLoading)e.target.style.background=RED;}}
                        onMouseLeave={e=>{if(form.name&&form.phone&&!enquireLoading)e.target.style.background=NAVY;}}>
                        {enquireLoading?"Sending...":"📩 Send Build Enquiry"}
                      </button>
                      <button onClick={()=>window.open("https://wa.me/919435070738?text="+encodeURIComponent("Hi! Custom PC Build enquiry:\n\n"+Object.entries(selected).filter(([,v])=>v&&v.price>0).map(([c,v])=>c+": "+v.name).join("\n")+"\n\nTotal: ₹"+total.toLocaleString()),"_blank")}
                        style={{flex:1,background:"#25D366",color:"#fff",border:"none",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                        💬 WhatsApp Build
                      </button>
                    </div>
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"32px"}}>
                    <div style={{fontSize:48,marginBottom:12}}>✅</div>
                    <div style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:8}}>Build Enquiry Sent!</div>
                    <p style={{fontSize:14,color:"#666",lineHeight:1.7}}>We'll call <strong>{form.phone}</strong> to confirm parts availability and assembly time.<br/>You can also reach us at <strong style={{color:RED}}>9435070738</strong>.</p>
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