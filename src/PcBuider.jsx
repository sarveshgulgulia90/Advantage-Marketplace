import { useState } from "react";

const NAVY = "#0B1F5E";
const RED  = "#CC1A1A";
const API  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ─── Component database with approximate market prices ─── */
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
      { id:"h610m",    name:"MSI H610M Pro-S",         socket:"LGA1700", ram:"DDR4", maxRam:64,  price:6500  },
      { id:"h610k",    name:"Asus Prime H610M-K",       socket:"LGA1700", ram:"DDR4", maxRam:64,  price:7200  },
      { id:"b660m",    name:"MSI B660M Pro-A",          socket:"LGA1700", ram:"DDR4", maxRam:128, price:9500  },
      { id:"b660k",    name:"Asus Prime B660M-K",       socket:"LGA1700", ram:"DDR4", maxRam:128, price:9000  },
      { id:"b550m",    name:"MSI B550M Pro-VDH WiFi",   socket:"AM4",     ram:"DDR4", maxRam:128, price:8500  },
      { id:"b550a",    name:"Asus Prime B550M-A",       socket:"AM4",     ram:"DDR4", maxRam:128, price:8000  },
      { id:"b650m",    name:"MSI B650M Pro-A",          socket:"AM5",     ram:"DDR5", maxRam:192, price:12500 },
      { id:"b650e",    name:"Asus Prime B650M-A WiFi",  socket:"AM5",     ram:"DDR5", maxRam:192, price:13500 },
    ]
  },
  RAM: {
    label:"RAM (Memory)", icon:"💾", required:true,
    options:[
      { id:"8d4",  name:"8GB DDR4 3200MHz",  type:"DDR4", size:8,  price:2200 },
      { id:"16d4", name:"16GB DDR4 3200MHz", type:"DDR4", size:16, price:3800 },
      { id:"32d4", name:"32GB DDR4 3200MHz", type:"DDR4", size:32, price:7500 },
      { id:"16d5", name:"16GB DDR5 4800MHz", type:"DDR5", size:16, price:5500 },
      { id:"32d5", name:"32GB DDR5 4800MHz", type:"DDR5", size:32, price:10000},
    ]
  },
  Storage: {
    label:"Storage", icon:"💿", required:true,
    options:[
      { id:"256ssd",  name:"256GB NVMe SSD",  type:"SSD", size:256,  price:2500  },
      { id:"512ssd",  name:"512GB NVMe SSD",  type:"SSD", size:512,  price:3500  },
      { id:"1tssd",   name:"1TB NVMe SSD",    type:"SSD", size:1024, price:6500  },
      { id:"2tssd",   name:"2TB NVMe SSD",    type:"SSD", size:2048, price:12000 },
      { id:"1thdd",   name:"1TB HDD 7200RPM", type:"HDD", size:1024, price:3200  },
      { id:"2thdd",   name:"2TB HDD 7200RPM", type:"HDD", size:2048, price:5500  },
      { id:"512+1t",  name:"512GB SSD + 1TB HDD (Combo)", type:"Combo", size:1536, price:6500 },
    ]
  },
  GPU: {
    label:"Graphics Card (GPU)", icon:"🎮", required:false,
    options:[
      { id:"none",   name:"No GPU (Use CPU Integrated Graphics)", brand:"—",    vram:0,  price:0     },
      { id:"1650",   name:"NVIDIA GTX 1650 4GB",                 brand:"NVIDIA",vram:4,  price:14000 },
      { id:"3060",   name:"NVIDIA RTX 3060 12GB",                brand:"NVIDIA",vram:12, price:25000 },
      { id:"3060ti", name:"NVIDIA RTX 3060 Ti 8GB",              brand:"NVIDIA",vram:8,  price:30000 },
      { id:"4060",   name:"NVIDIA RTX 4060 8GB",                 brand:"NVIDIA",vram:8,  price:32000 },
      { id:"4060ti", name:"NVIDIA RTX 4060 Ti 16GB",             brand:"NVIDIA",vram:16, price:42000 },
      { id:"rx6600", name:"AMD RX 6600 8GB",                     brand:"AMD",   vram:8,  price:22000 },
      { id:"rx7600", name:"AMD RX 7600 8GB",                     brand:"AMD",   vram:8,  price:27000 },
    ]
  },
  Cabinet: {
    label:"Cabinet (Case)", icon:"🗳️", required:true,
    options:[
      { id:"basic",  name:"Basic ATX Cabinet",                    formFactor:"ATX",   price:2500 },
      { id:"cm690",  name:"Cooler Master MasterBox Q300L",        formFactor:"mATX",  price:3500 },
      { id:"mid",    name:"Mid Tower ATX Cabinet",                formFactor:"ATX",   price:4500 },
      { id:"midglass",name:"Mid Tower ATX with Tempered Glass",   formFactor:"ATX",   price:5500 },
      { id:"full",   name:"Full Tower ATX Cabinet",               formFactor:"ATX",   price:7000 },
    ]
  },
  PSU: {
    label:"Power Supply (PSU)", icon:"🔌", required:true,
    options:[
      { id:"450w",  name:"450W 80+ Standard",       wattage:450, rating:"Standard", price:3000 },
      { id:"550wb", name:"550W 80+ Bronze",          wattage:550, rating:"Bronze",   price:4500 },
      { id:"650wg", name:"650W 80+ Gold",            wattage:650, rating:"Gold",     price:6500 },
      { id:"750wg", name:"750W 80+ Gold",            wattage:750, rating:"Gold",     price:8000 },
      { id:"850wg", name:"850W 80+ Gold",            wattage:850, rating:"Gold",     price:10000},
    ]
  },
  Cooler: {
    label:"CPU Cooler", icon:"❄️", required:false,
    options:[
      { id:"stock",  name:"Stock Cooler (Comes with CPU)",        type:"Air",    price:0    },
      { id:"hm212",  name:"Cooler Master Hyper 212 Black",        type:"Air",    price:2500 },
      { id:"noctua", name:"Noctua NH-U12S",                       type:"Air",    price:5500 },
      { id:"aio240", name:"240mm AIO Liquid Cooler",              type:"Liquid", price:6000 },
      { id:"aio360", name:"360mm AIO Liquid Cooler",              type:"Liquid", price:9000 },
    ]
  },
};

/* ─── Compatibility rules ─── */
function checkCompatibility(selected){
  const issues=[];
  const cpu  = selected.CPU;
  const mb   = selected.Motherboard;
  const ram  = selected.RAM;
  const psu  = selected.PSU;
  const gpu  = selected.GPU;

  if(cpu&&mb){
    if(cpu.socket!==mb.socket) issues.push("❌ CPU socket ("+cpu.socket+") doesn't match Motherboard socket ("+mb.socket+")");
    if(cpu.ram&&mb.ram&&!cpu.ram.includes(mb.ram.replace("DDR","DDR"))) {
      // check DDR type compatibility
    }
  }
  if(mb&&ram){
    if(mb.ram!==ram.type) issues.push("❌ Motherboard supports "+mb.ram+" but you selected "+ram.type+" RAM");
  }
  if(cpu&&psu&&gpu){
    const required=cpu.tdp+(gpu.price>0?150:0)+100;
    if(psu.wattage<required) issues.push("⚠️ PSU may be underpowered. Recommended: "+required+"W+, selected: "+psu.wattage+"W");
  }
  if(cpu&&gpu&&gpu.id==="none"&&cpu.brand==="AMD"&&!cpu.name.includes("G")){
    // AMD CPUs without G suffix have no integrated graphics
    issues.push("⚠️ AMD Ryzen non-G CPUs have no integrated graphics. You need a GPU.");
  }
  return issues;
}

/* ─── Use case suggestions ─── */
const USE_CASES=[
  { label:"💼 Office PC",      budget:35000,  picks:{CPU:"i3-12100",Motherboard:"h610m",RAM:"8d4",Storage:"512ssd",GPU:"none",Cabinet:"basic",PSU:"450w",Cooler:"stock"}},
  { label:"🎓 Student PC",     budget:40000,  picks:{CPU:"i3-12100",Motherboard:"h610m",RAM:"16d4",Storage:"512ssd",GPU:"none",Cabinet:"mid",PSU:"550wb",Cooler:"stock"}},
  { label:"🎮 Gaming PC",      budget:80000,  picks:{CPU:"i5-12400",Motherboard:"b660m",RAM:"16d4",Storage:"512ssd",GPU:"3060",Cabinet:"midglass",PSU:"650wg",Cooler:"hm212"}},
  { label:"🎮 Budget Gaming",  budget:55000,  picks:{CPU:"r5-5600",Motherboard:"b550m",RAM:"16d4",Storage:"512ssd",GPU:"rx6600",Cabinet:"mid",PSU:"550wb",Cooler:"stock"}},
  { label:"🎬 Video Editing",  budget:100000, picks:{CPU:"i7-12700",Motherboard:"b660m",RAM:"32d4",Storage:"512+1t",GPU:"4060",Cabinet:"midglass",PSU:"750wg",Cooler:"hm212"}},
  { label:"🖥️ Workstation",    budget:120000, picks:{CPU:"r7-7700x",Motherboard:"b650m",RAM:"32d5",Storage:"1tssd",GPU:"4060ti",Cabinet:"full",PSU:"850wg",Cooler:"aio240"}},
];

export default function PCBuilder({ onClose, onEnquire }){
  const[selected,setSelected]=useState({GPU:{id:"none",name:"No GPU (Use CPU Integrated Graphics)",brand:"—",vram:0,price:0},Cooler:{id:"stock",name:"Stock Cooler (Comes with CPU)",type:"Air",price:0}});
  const[activeSection,setActiveSection]=useState("CPU");
  const[priceLoading,setPriceLoading]=useState(false);
  const[priceMessage,setPriceMessage]=useState("");
  const[enquireSent,setEnquireSent]=useState(false);
  const[form,setForm]=useState({name:"",phone:""});

  const total=Object.values(selected).reduce((s,c)=>s+(c?.price||0),0);
  const issues=checkCompatibility(selected);
  const allRequired=["CPU","Motherboard","RAM","Storage","Cabinet","PSU"].every(k=>selected[k]);

  function selectComponent(cat,opt){
    setSelected(s=>({...s,[cat]:opt}));
    // Auto-advance to next section
    const keys=Object.keys(COMPONENTS);
    const idx=keys.indexOf(cat);
    if(idx<keys.length-1)setActiveSection(keys[idx+1]);
  }

  function applyPreset(preset){
    const newSel={};
    Object.entries(preset.picks).forEach(([cat,id])=>{
      const opt=COMPONENTS[cat]?.options.find(o=>o.id===id);
      if(opt)newSel[cat]=opt;
    });
    setSelected(newSel);
    setActiveSection("CPU");
  }

  async function fetchLivePrices(){
    setPriceLoading(true);
    setPriceMessage("");
    try{
      const componentNames=Object.entries(selected).filter(([,v])=>v&&v.price>0).map(([cat,v])=>cat+": "+v.name).join(", ");
      const res=await fetch(API+"/ai/compare",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          products:[{name:"PC Build",cat:"Desktops",price:"Custom",specs:{Components:componentNames},highlights:[],specs:{}}],
          useCase:"What are the current market prices in India (in INR) for these PC components: "+componentNames+"? Reply with a JSON array: [{\"component\":\"name\",\"estimatedPrice\":number}]"
        })
      });
      setPriceMessage("Prices shown are approximate. Visit the store for exact quotes.");
    } catch(e){}
    setPriceLoading(false);
  }

  async function submitEnquiry(){
    if(!form.name||!form.phone)return;
    const buildSummary=Object.entries(selected).filter(([,v])=>v).map(([cat,v])=>cat+": "+v.name+" (₹"+v.price.toLocaleString()+")").join("\n");
    try{
      await fetch(API+"/inquiries",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:form.name,phone:form.phone,product:"Custom PC Build",message:"PC Build Request:\n"+buildSummary+"\n\nTotal: ₹"+total.toLocaleString()})
      });
    }catch(e){}
    setEnquireSent(true);
  }

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"20px 0"}}>
      <div style={{background:"#f5f7fa",width:"100%",maxWidth:1200,minHeight:"90vh",fontFamily:"'DM Sans',sans-serif",position:"relative"}}>

        {/* Header */}
        <div style={{background:NAVY,padding:"20px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div>
            <div style={{fontWeight:800,fontSize:22,color:"#fff"}}>🔧 Custom PC Builder</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:2}}>Select components — we'll assemble it for you at Advantage Silchar</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>Estimated Total</div>
              <div style={{fontWeight:800,fontSize:24,color:"#fff"}}>₹{total.toLocaleString()}</div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✕ Close</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"280px 1fr",minHeight:"calc(90vh - 72px)"}}>

          {/* Left sidebar — selected summary */}
          <div style={{background:NAVY,padding:"24px 20px",borderRight:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:16}}>Your Build</div>

            {/* Preset buttons */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:RED,marginBottom:10}}>Quick Presets</div>
              {USE_CASES.map(uc=>(
                <button key={uc.label} onClick={()=>applyPreset(uc)}
                  style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.8)",padding:"8px 12px",fontSize:12,fontWeight:500,cursor:"pointer",marginBottom:6,textAlign:"left",fontFamily:"inherit",transition:"background .15s",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>
                  <span>{uc.label}</span>
                  <span style={{color:RED,fontWeight:700}}>~₹{(uc.budget/1000).toFixed(0)}K</span>
                </button>
              ))}
            </div>

            {/* Selected components list */}
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:12}}>Selected</div>
            {Object.entries(COMPONENTS).map(([cat,def])=>(
              <div key={cat} onClick={()=>setActiveSection(cat)}
                style={{padding:"8px 10px",marginBottom:4,background:activeSection===cat?"rgba(204,26,26,.25)":"rgba(255,255,255,.04)",border:"1px solid "+(activeSection===cat?RED:"rgba(255,255,255,.08)"),cursor:"pointer",transition:"all .15s"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>{def.icon} {def.label}{!def.required&&" (Optional)"}</div>
                <div style={{fontSize:12,color:selected[cat]?"#fff":"rgba(255,255,255,.3)",fontWeight:selected[cat]?600:400,marginTop:2}}>
                  {selected[cat]?selected[cat].name:"Not selected"}
                </div>
                {selected[cat]&&selected[cat].price>0&&<div style={{fontSize:11,color:RED,fontWeight:700,marginTop:2}}>₹{selected[cat].price.toLocaleString()}</div>}
              </div>
            ))}

            {/* Total */}
            <div style={{marginTop:16,padding:"14px 10px",background:"rgba(204,26,26,.15)",border:"1px solid "+RED}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>Total (Components Only)</div>
              <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>₹{total.toLocaleString()}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:4}}>+Assembly charges apply</div>
            </div>

            {/* Compatibility */}
            {issues.length>0&&(
              <div style={{marginTop:12}}>
                {issues.map((issue,i)=>(
                  <div key={i} style={{background:"rgba(255,200,0,.1)",border:"1px solid rgba(255,200,0,.3)",padding:"8px 10px",fontSize:11,color:"#ffd700",marginBottom:6,lineHeight:1.5}}>{issue}</div>
                ))}
              </div>
            )}
          </div>

          {/* Right — component selector */}
          <div style={{padding:"24px 32px",overflowY:"auto"}}>

            {/* Tab navigation */}
            <div style={{display:"flex",gap:0,marginBottom:28,overflowX:"auto",borderBottom:"2px solid #dde2f0"}}>
              {Object.entries(COMPONENTS).map(([cat,def])=>(
                <button key={cat} onClick={()=>setActiveSection(cat)}
                  style={{padding:"10px 16px",fontSize:12,fontWeight:600,border:"none",background:"none",cursor:"pointer",borderBottom:"2px solid "+(activeSection===cat?RED:"transparent"),marginBottom:-2,color:activeSection===cat?RED:selected[cat]?"#16a34a":"#888",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .15s"}}>
                  {def.icon} {cat.replace("Motherboard","MoBo").replace("Cabinet","Case")}
                  {selected[cat]&&" ✓"}
                </button>
              ))}
            </div>

            {/* Component options */}
            {Object.entries(COMPONENTS).map(([cat,def])=>(
              activeSection===cat&&(
                <div key={cat}>
                  <div style={{marginBottom:20}}>
                    <h2 style={{fontWeight:800,fontSize:20,color:NAVY,marginBottom:4}}>{def.icon} {def.label}</h2>
                    {!def.required&&<div style={{fontSize:12,color:"#888"}}>Optional — skip if not needed</div>}
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                    {def.options.map(opt=>{
                      const isSelected=selected[cat]?.id===opt.id;
                      // Compatibility warning
                      const cpu=selected.CPU;
                      const mb=selected.Motherboard;
                      let warning="";
                      if(cat==="Motherboard"&&cpu&&opt.socket!==cpu.socket) warning="Socket mismatch with "+cpu.name;
                      if(cat==="RAM"&&mb&&opt.type!==mb.ram) warning="Not compatible with selected motherboard";
                      if(cat==="Motherboard"&&cpu&&opt.ram&&!opt.ram.includes(cpu.ram?.split("/")[0])) warning="Check RAM compatibility";

                      return(
                        <div key={opt.id} onClick={()=>!warning&&selectComponent(cat,opt)}
                          style={{background:"#fff",border:"2px solid "+(isSelected?RED:warning?"#f59e0b":"#e8e8e8"),padding:"16px",cursor:warning?"not-allowed":"pointer",transition:"all .15s",opacity:warning?0.6:1,position:"relative"}}
                          onMouseEnter={e=>{if(!warning)e.currentTarget.style.borderColor=isSelected?RED:NAVY;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=isSelected?RED:warning?"#f59e0b":"#e8e8e8";}}>

                          {isSelected&&<div style={{position:"absolute",top:8,right:8,background:RED,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",letterSpacing:".04em"}}>SELECTED</div>}

                          <div style={{fontWeight:700,fontSize:14,color:NAVY,marginBottom:6,paddingRight:isSelected?60:0}}>{opt.name}</div>

                          {/* Show relevant specs */}
                          <div style={{fontSize:11,color:"#888",marginBottom:8,lineHeight:1.6}}>
                            {opt.socket&&<span>Socket: {opt.socket} · </span>}
                            {opt.ram&&<span>RAM: {opt.ram} · </span>}
                            {opt.tdp&&<span>TDP: {opt.tdp}W · </span>}
                            {opt.type&&cat==="RAM"&&<span>{opt.type} · {opt.size}GB · </span>}
                            {opt.type&&cat==="Storage"&&<span>{opt.type} · {opt.size>=1024?(opt.size/1024)+"TB":opt.size+"GB"} · </span>}
                            {opt.vram>0&&<span>VRAM: {opt.vram}GB · </span>}
                            {opt.wattage&&<span>{opt.wattage}W · {opt.rating} · </span>}
                          </div>

                          {warning&&<div style={{fontSize:10,color:"#d97706",fontWeight:600,marginBottom:6}}>⚠️ {warning}</div>}

                          <div style={{fontWeight:800,fontSize:18,color:opt.price===0?"#16a34a":NAVY}}>
                            {opt.price===0?"Included / Free":"₹"+opt.price.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Next button */}
                  {Object.keys(COMPONENTS).indexOf(cat)<Object.keys(COMPONENTS).length-1&&(
                    <button onClick={()=>{const keys=Object.keys(COMPONENTS);setActiveSection(keys[keys.indexOf(cat)+1]);}}
                      style={{marginTop:20,background:NAVY,color:"#fff",border:"none",padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                      onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                      Next →
                    </button>
                  )}
                </div>
              )
            ))}

            {/* Final summary + enquire */}
            {allRequired&&(
              <div style={{marginTop:32,background:"#fff",border:"2px solid "+NAVY,padding:"28px"}}>
                <h3 style={{fontWeight:800,fontSize:18,color:NAVY,marginBottom:20}}>📋 Your Build Summary</h3>

                <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20}}>
                  <tbody>
                    {Object.entries(selected).filter(([,v])=>v).map(([cat,v],i)=>(
                      <tr key={cat} style={{borderBottom:"1px solid #f0f0f0",background:i%2===0?"#f9f9fb":"#fff"}}>
                        <td style={{padding:"10px 16px",fontSize:12,fontWeight:700,color:"#777",textTransform:"uppercase",letterSpacing:".05em",width:"20%"}}>{cat}</td>
                        <td style={{padding:"10px 16px",fontSize:14,color:NAVY,fontWeight:500}}>{v.name}</td>
                        <td style={{padding:"10px 16px",fontSize:14,fontWeight:700,color:v.price===0?"#16a34a":NAVY,textAlign:"right"}}>{v.price===0?"Free":"₹"+v.price.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{background:NAVY}}>
                      <td style={{padding:"14px 16px",fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:".05em"}}>Subtotal</td>
                      <td style={{padding:"14px 16px",fontSize:14,color:"rgba(255,255,255,.6)"}}>(Assembly charges extra)</td>
                      <td style={{padding:"14px 16px",fontSize:20,fontWeight:800,color:"#fff",textAlign:"right"}}>₹{total.toLocaleString()}</td>
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
                    <div style={{fontSize:13,color:"#555",marginBottom:14}}>Send this build to Advantage Silchar — we'll confirm availability and assembly time.</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                      <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your Name *"
                        style={{border:"1.5px solid #ddd",padding:"11px 13px",fontSize:14,fontFamily:"inherit",outline:"none"}}
                        onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                      <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone Number *"
                        style={{border:"1.5px solid #ddd",padding:"11px 13px",fontSize:14,fontFamily:"inherit",outline:"none"}}
                        onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor="#ddd"}/>
                    </div>
                    <div style={{display:"flex",gap:12}}>
                      <button onClick={submitEnquiry} disabled={!form.name||!form.phone}
                        style={{flex:1,background:form.name&&form.phone?NAVY:"#ccc",color:"#fff",border:"none",padding:"14px",fontSize:14,fontWeight:700,cursor:form.name&&form.phone?"pointer":"not-allowed",fontFamily:"inherit",transition:"background .15s"}}
                        onMouseEnter={e=>{if(form.name&&form.phone)e.target.style.background=RED;}} onMouseLeave={e=>{if(form.name&&form.phone)e.target.style.background=NAVY;}}>
                        📩 Send Build Enquiry
                      </button>
                      <button onClick={()=>window.open("https://wa.me/919435070738?text="+encodeURIComponent("Hi! I want to enquire about a Custom PC Build:\n\n"+Object.entries(selected).filter(([,v])=>v&&v.price>0).map(([c,v])=>c+": "+v.name).join("\n")+"\n\nTotal: ₹"+total.toLocaleString()),"_blank")}
                        style={{flex:1,background:"#25D366",color:"#fff",border:"none",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                        💬 WhatsApp Build
                      </button>
                    </div>
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"24px"}}>
                    <div style={{fontSize:44,marginBottom:12}}>✅</div>
                    <div style={{fontWeight:800,fontSize:18,color:NAVY,marginBottom:8}}>Build Enquiry Sent!</div>
                    <p style={{fontSize:14,color:"#666"}}>We'll call you at <strong>{form.phone}</strong> to confirm parts availability and assembly time.</p>
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