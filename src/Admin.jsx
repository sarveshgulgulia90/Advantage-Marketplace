import { useState, useEffect } from "react";

const NAVY = "#0B1F5E";
const RED  = "#CC1A1A";
const GREY = "#f5f6f8";
const BORDER = "#e2e4ea";

const API  = import.meta.env.VITE_API_URL    || "http://localhost:5000/api";
const BTKN = import.meta.env.VITE_ADMIN_TOKEN || "advantage_admin_secret_2025";
const ADMIN_PASSWORD = "advantage1995";
const STORAGE_KEY = "advantage_products";

const CATS = ["Laptops","Desktops","Printers","Accessories","Security & CCTV"];
const SPEC_KEYS = {
  Laptops:          ["Processor","RAM","Storage","Display","Graphics","Operating System","Battery","Ports","Connectivity","Weight","Warranty"],
  Desktops:         ["Processor","RAM","Storage","Form Factor","Graphics","Operating System","Ports","Connectivity","Warranty"],
  Printers:         ["Type","Print Technology","Print Speed","Print Resolution","Connectivity","Scanner","Paper Size","Page Yield","Warranty"],
  Accessories:      ["Type","Connectivity","Compatibility","Interface","Weight","Warranty"],
  "Security & CCTV":["Type","Resolution","Connectivity","Storage","Power","IR Range","Warranty"],
};
const EMPTY = {name:"",cat:"Laptops",price:"",icon:"💻",isNew:false,inStock:true,image:"",spec:"",specs:{},highlights:["","","",""]};

function ls(){ try{ const s=localStorage.getItem(STORAGE_KEY); return s?JSON.parse(s):null; }catch{return null;} }
function ss(a){ localStorage.setItem(STORAGE_KEY,JSON.stringify(a)); }

/* ─── shared input style ─────────────────────────────────────────── */
const INP = {
  width:"100%",border:"1px solid "+BORDER,padding:"9px 12px",
  fontSize:13,outline:"none",fontFamily:"inherit",color:"#111",
  background:"#fff",transition:"border-color .15s",borderRadius:0,
};

/* ─── Stat card ──────────────────────────────────────────────────── */
function Stat({label,value,alert}){
  return(
    <div style={{background:"#fff",border:"1px solid "+BORDER,padding:"18px 22px",flex:1,minWidth:110}}>
      <div style={{fontSize:26,fontWeight:800,color:alert?RED:NAVY,lineHeight:1}}>{value}</div>
      <div style={{fontSize:11,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"#999",marginTop:6}}>{label}</div>
    </div>
  );
}

/* ─── PC Price Row ───────────────────────────────────────────────── */
function PcPriceRow({item,category,saveMsg,onSave,onDelete}){
  const[price,setPrice]=useState(item.price||0);
  const[inStock,setInStock]=useState(item.inStock!==false);
  const days=item.updatedAt?Math.floor((Date.now()-new Date(item.updatedAt))/(864e5))+"d ago":"—";
  return(
    <tr style={{borderBottom:"1px solid "+BORDER}}>
      <td style={{padding:"10px 14px",fontSize:13,color:NAVY}}>{item.name}</td>
      <td style={{padding:"10px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:12,color:"#777"}}>Rs.</span>
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)}
            style={{...INP,width:90,padding:"5px 8px"}}
            onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
        </div>
      </td>
      <td style={{padding:"10px 14px"}}>
        <button onClick={()=>setInStock(s=>!s)}
          style={{background:"none",border:"1px solid "+(inStock?"#16a34a":RED),color:inStock?"#16a34a":RED,padding:"3px 10px",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:".04em"}}>
          {inStock?"In Stock":"Out of Stock"}
        </button>
      </td>
      <td style={{padding:"10px 14px",fontSize:11,color:"#aaa"}}>{days}</td>
      <td style={{padding:"10px 14px"}}>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>onSave(price,inStock,item.name)}
            style={{background:saveMsg?NAVY:GREY,color:saveMsg?"#fff":NAVY,border:"1px solid "+(saveMsg?NAVY:BORDER),padding:"4px 12px",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>
            {saveMsg||"Save"}
          </button>
          <button onClick={()=>window.confirm("Delete "+item.name+"?")&&onDelete(category,item.componentId)}
            style={{background:"none",border:"1px solid "+BORDER,color:"#999",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Add Part Form ──────────────────────────────────────────────── */
function AddPartForm({onAdd}){
  const[cat,setCat]=useState("CPU");
  const[cid,setCid]=useState("");
  const[nm,setNm]=useState("");
  const[pr,setPr]=useState("");
  const[msg,setMsg]=useState("");
  async function go(){
    if(!cat||!cid||!nm||!pr){setMsg("All fields required");return;}
    const ok=await onAdd(cat,cid,nm,pr);
    if(ok){setCid("");setNm("");setPr("");setMsg("Added successfully");}
    else setMsg("Failed to add");
    setTimeout(()=>setMsg(""),2500);
  }
  return(
    <div style={{background:"#fff",border:"1px solid "+BORDER,padding:18,marginBottom:20}}>
      <div style={{fontSize:11,fontWeight:700,color:NAVY,letterSpacing:".08em",textTransform:"uppercase",marginBottom:12}}>Add New Component</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr 1fr auto",gap:10,alignItems:"end"}}>
        <div>
          <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Category</label>
          <input style={INP} placeholder="e.g. CPU" value={cat} onChange={e=>setCat(e.target.value)}
            onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
        </div>
        <div>
          <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Component ID</label>
          <input style={INP} placeholder="e.g. i5-12400" value={cid} onChange={e=>setCid(e.target.value)}
            onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
        </div>
        <div>
          <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Name</label>
          <input style={INP} placeholder="Full component name" value={nm} onChange={e=>setNm(e.target.value)}
            onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
        </div>
        <div>
          <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Price (Rs.)</label>
          <input style={INP} type="number" placeholder="0" value={pr} onChange={e=>setPr(e.target.value)}
            onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
        </div>
        <button onClick={go}
          style={{background:NAVY,color:"#fff",border:"none",padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",height:38}}>
          Add
        </button>
      </div>
      {msg&&<div style={{marginTop:8,fontSize:12,color:msg.includes("success")?"#16a34a":RED,fontWeight:600}}>{msg}</div>}
    </div>
  );
}

/* ─── Service job inline updater ─────────────────────────────────── */
function EstCostUpdate({job,onUpdate}){
  const[status,setStatus]=useState(job.status);
  const[cost,setCost]=useState(job.estimatedCost||"");
  const[note,setNote]=useState("");
  const[open,setOpen]=useState(false);
  const STATUS_LIST=["Received","Diagnosed","In Progress","Ready for Pickup","Completed","Cancelled"];
  const BORDER="#e2e4ea";
  const NAVY="#0B1F5E";
  const RED="#CC1A1A";

  function save(){
    onUpdate(job.jobId, status, note, cost);
    setOpen(false);
    setNote("");
  }

  if(!open) return(
    <button onClick={()=>setOpen(true)}
      style={{background:"#fff",color:NAVY,border:"1px solid "+NAVY,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
      Update
    </button>
  );

  return(
    <div style={{position:"relative"}}>
      <div style={{position:"fixed",inset:0,zIndex:100}} onClick={()=>setOpen(false)}/>
      <div style={{position:"absolute",right:0,top:32,background:"#fff",border:"1px solid "+BORDER,padding:16,zIndex:200,minWidth:260,boxShadow:"0 4px 16px rgba(0,0,0,.1)"}}>
        <div style={{fontSize:11,fontWeight:700,color:NAVY,letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Update Job</div>
        <div style={{marginBottom:8}}>
          <label style={{fontSize:10,color:"#888",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)}
            style={{width:"100%",border:"1px solid "+BORDER,padding:"7px 10px",fontSize:12,fontFamily:"inherit",outline:"none",color:"#111",background:"#fff"}}>
            {STATUS_LIST.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{marginBottom:8}}>
          <label style={{fontSize:10,color:"#888",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Estimated Cost (Rs.)</label>
          <input type="number" value={cost} onChange={e=>setCost(e.target.value)} placeholder="e.g. 1500"
            style={{width:"100%",border:"1px solid "+BORDER,padding:"7px 10px",fontSize:12,fontFamily:"inherit",outline:"none",color:"#111"}}
            onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:10,color:"#888",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Note (optional)</label>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Motherboard replaced"
            style={{width:"100%",border:"1px solid "+BORDER,padding:"7px 10px",fontSize:12,fontFamily:"inherit",outline:"none",color:"#111"}}
            onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={save}
            style={{flex:1,background:NAVY,color:"#fff",border:"none",padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Save
          </button>
          <button onClick={()=>setOpen(false)}
            style={{background:"#fff",color:"#888",border:"1px solid "+BORDER,padding:"8px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Seed Banner ────────────────────────────────────────────────── */
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
  if(status==="done") return <div style={{background:"#f0fdf4",border:"1px solid #86efac",padding:"12px 18px",marginBottom:20,fontSize:13,color:"#15803d"}}>Products seeded to MongoDB successfully.</div>;
  if(status==="exists") return <div style={{background:"#fffbeb",border:"1px solid #fde047",padding:"12px 18px",marginBottom:20,fontSize:13,color:"#854d0e"}}>Products already exist in the database.</div>;
  return(
    <div style={{background:"#fff",border:"1px solid "+BORDER,padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
      <div>
        <div style={{fontWeight:600,fontSize:13,color:NAVY}}>First time setup — seed products to MongoDB</div>
        <div style={{fontSize:12,color:"#888",marginTop:2}}>Pushes {products.length} products from local list into the database. Run once.</div>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {status==="error"&&<span style={{fontSize:12,color:RED}}>Failed — is backend running?</span>}
        <button onClick={seed} disabled={status==="loading"}
          style={{background:NAVY,color:"#fff",border:"none",padding:"9px 20px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:status==="loading"?.7:1}}>
          {status==="loading"?"Seeding...":"Seed to Database"}
        </button>
      </div>
    </div>
  );
}

/* ─── Invoice Modal ──────────────────────────────────────────────── */
function InvoiceModal({inq,onClose}){
  const NAVY="#0B1F5E",RED="#CC1A1A",BORDER="#e2e4ea";
  const API=import.meta.env.VITE_API_URL||"http://localhost:5000/api";
  const BTKN=import.meta.env.VITE_ADMIN_TOKEN||"advantage_admin_secret_2025";
  const[items,setItems]=useState([{desc:inq.product||"",qty:1,rate:"",amount:""}]);
  const[invNo]=useState("INV-"+Date.now().toString().slice(-6));
  const[date]=useState(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}));
  const[notes,setNotes]=useState("Thank you for your business. Payment due on receipt.");
  const[gst,setGst]=useState(false);
  const[emailTo,setEmailTo]=useState(inq.email||"");
  const[emailStatus,setEmailStatus]=useState("");
  const[emailSending,setEmailSending]=useState(false);

  async function sendEmail(){
    if(!emailTo){setEmailStatus("Enter customer email first");return;}
    setEmailSending(true);setEmailStatus("");
    try{
      const res=await fetch(API+"/email/invoice",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-admin-token":BTKN},
        body:JSON.stringify({to:emailTo,customerName:inq.name,phone:inq.phone,invNo,date,items,subtotal,gstAmt,total,gst,notes})
      });
      const d=await res.json();
      if(!res.ok)throw new Error(d.error||"Failed");
      setEmailStatus("Sent to "+emailTo);
    }catch(e){setEmailStatus("Error: "+e.message);}
    setEmailSending(false);
  }

  function updateItem(i,field,val){
    setItems(prev=>{
      const updated=[...prev];
      updated[i]={...updated[i],[field]:val};
      if(field==="qty"||field==="rate"){
        const qty=parseFloat(updated[i].qty)||0;
        const rate=parseFloat(updated[i].rate)||0;
        updated[i].amount=(qty*rate).toFixed(2);
      }
      return updated;
    });
  }

  function addItem(){setItems(prev=>[...prev,{desc:"",qty:1,rate:"",amount:""}]);}
  function removeItem(i){setItems(prev=>prev.filter((_,idx)=>idx!==i));}

  const subtotal=items.reduce((s,it)=>s+(parseFloat(it.amount)||0),0);
  const gstAmt=gst?subtotal*0.18:0;
  const total=subtotal+gstAmt;

  function printInvoice(){
    const rows=items.map((it,i)=>`
      <tr>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;">${i+1}</td>
        <td style="padding:8px 12px;border:1px solid #ddd;">${it.desc}</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;">${it.qty}</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;">Nos</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:right;">Rs.${parseFloat(it.rate||0).toLocaleString()}</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:right;font-weight:600;">Rs.${parseFloat(it.amount||0).toLocaleString()}</td>
      </tr>`
    ).join("");

    const cgst=gst?(subtotal*0.09).toFixed(2):"0";
    const sgst=gst?(subtotal*0.09).toFixed(2):"0";

    // Amount in words
    function toWords(n){
      const ones=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
      const tens=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
      if(n===0)return"Zero";
      if(n<20)return ones[n];
      if(n<100)return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:"");
      if(n<1000)return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+toWords(n%100):"");
      if(n<100000)return toWords(Math.floor(n/1000))+" Thousand"+(n%1000?" "+toWords(n%1000):"");
      if(n<10000000)return toWords(Math.floor(n/100000))+" Lakh"+(n%100000?" "+toWords(n%100000):"");
      return toWords(Math.floor(n/10000000))+" Crore"+(n%10000000?" "+toWords(n%10000000):"");
    }
    const totalWords=toWords(Math.floor(total))+" Rupees Only";

    const html=`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Invoice ${invNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Arial,sans-serif;font-size:12px;color:#111;background:#fff;}
  .page{max-width:800px;margin:0 auto;padding:20px;border:2px solid #0B1F5E;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0B1F5E;padding-bottom:14px;margin-bottom:14px;}
  .company-name{font-size:24px;font-weight:900;color:#0B1F5E;letter-spacing:-.01em;}
  .company-name span{color:#CC1A1A;}
  .company-info{font-size:11px;color:#444;margin-top:5px;line-height:1.7;}
  .inv-label{font-size:18px;font-weight:900;color:#CC1A1A;letter-spacing:.08em;text-align:right;}
  .inv-meta{text-align:right;font-size:11px;color:#555;margin-top:4px;line-height:1.8;}
  .inv-meta strong{color:#111;}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #ddd;margin-bottom:14px;}
  .box{padding:10px 14px;}
  .box-label{font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#888;margin-bottom:4px;}
  .box-val{font-size:13px;font-weight:700;color:#0B1F5E;}
  .box-sub{font-size:11px;color:#555;margin-top:2px;line-height:1.6;}
  .box-right{border-left:1px solid #ddd;}
  table.items{width:100%;border-collapse:collapse;margin-bottom:0;}
  table.items th{background:#0B1F5E;color:#fff;padding:8px 12px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;border:1px solid #0B1F5E;}
  table.items td{padding:8px 12px;border:1px solid #ddd;font-size:12px;}
  .totals-section{display:flex;justify-content:space-between;border:1px solid #ddd;border-top:none;}
  .amount-words{padding:10px 14px;flex:1;border-right:1px solid #ddd;}
  .amount-words .aw-label{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#888;margin-bottom:4px;}
  .amount-words .aw-val{font-size:12px;font-weight:700;color:#0B1F5E;}
  .totals-table{width:260px;flex-shrink:0;}
  .totals-table table{width:100%;border-collapse:collapse;}
  .totals-table td{padding:7px 14px;border-bottom:1px solid #ddd;font-size:12px;}
  .totals-table td:last-child{text-align:right;font-weight:600;}
  .grand-total td{background:#0B1F5E!important;color:#fff!important;font-weight:900!important;font-size:14px!important;border:none!important;}
  .footer-box{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;border:1px solid #ddd;}
  .terms{padding:10px 14px;border-right:1px solid #ddd;}
  .terms .t-label{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#888;margin-bottom:6px;}
  .terms ul{padding-left:14px;font-size:11px;color:#555;line-height:1.8;}
  .sign-box{padding:10px 14px;display:flex;flex-direction:column;justify-content:space-between;}
  .sign-box .s-label{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#888;}
  .sign-box .s-name{font-size:12px;font-weight:700;color:#0B1F5E;margin-top:4px;}
  .sign-line{border-top:1px solid #333;margin-top:32px;padding-top:4px;font-size:10px;color:#888;}
  @media print{
    body{padding:0;}
    .page{border:2px solid #0B1F5E;max-width:100%;}
    button{display:none!important;}
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div>
      <div class="company-name">AD<span>V</span>ANTAGE <span style="font-size:15px;font-weight:700;color:#666;">SILCHAR</span></div>
      <div class="company-info">
        Anand Arcade, Opposite Civil Hospital, Hospital Road, Silchar – 788001, Assam<br/>
        Phone: 03842-230952 / 9435070738 &nbsp;|&nbsp; Email: advantage.it@gmail.com<br/>
        ${gst?'GSTIN: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Enter GSTIN)':''}
      </div>
    </div>
    <div>
      <div class="inv-label">${gst?"TAX INVOICE":"INVOICE"}</div>
      <div class="inv-meta">
        Invoice No: <strong>${invNo}</strong><br/>
        Date: <strong>${date}</strong><br/>
        ${gst?`<br/>Supply Type: <strong>Intra-State</strong>`:""}
      </div>
    </div>
  </div>

  <!-- Bill To / Ship To -->
  <div class="two-col">
    <div class="box">
      <div class="box-label">Bill To</div>
      <div class="box-val">${inq.name}</div>
      <div class="box-sub">
        Phone: ${inq.phone}<br/>
        ${inq.email?`Email: ${inq.email}<br/>`:""}
        Silchar, Assam
      </div>
    </div>
    <div class="box box-right">
      <div class="box-label">Payment Details</div>
      <div class="box-sub">
        Payment Mode: Cash / UPI / Card<br/>
        Payment Status: <strong style="color:#16a34a;">Due on Receipt</strong>
      </div>
    </div>
  </div>

  <!-- Items Table -->
  <table class="items">
    <thead>
      <tr>
        <th style="width:5%;">#</th>
        <th style="width:40%;text-align:left;">Description of Goods / Services</th>
        <th style="width:8%;">Qty</th>
        <th style="width:8%;">Unit</th>
        <th style="width:18%;text-align:right;">Rate (Rs.)</th>
        <th style="width:18%;text-align:right;">Amount (Rs.)</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <!-- Empty rows for spacing -->
      ${items.length<5?Array(5-items.length).fill('<tr><td style="padding:8px 12px;border:1px solid #ddd;">&nbsp;</td><td style="border:1px solid #ddd;"></td><td style="border:1px solid #ddd;"></td><td style="border:1px solid #ddd;"></td><td style="border:1px solid #ddd;"></td><td style="border:1px solid #ddd;"></td></tr>').join(""):""}
    </tbody>
    ${gst?`
    <tfoot>
      <tr style="background:#f5f7fa;">
        <td colspan="5" style="padding:8px 12px;border:1px solid #ddd;font-weight:600;text-align:right;">Taxable Amount</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:right;font-weight:600;">Rs.${subtotal.toLocaleString()}</td>
      </tr>
      <tr style="background:#f5f7fa;">
        <td colspan="5" style="padding:8px 12px;border:1px solid #ddd;text-align:right;">CGST @ 9%</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:right;">Rs.${cgst}</td>
      </tr>
      <tr style="background:#f5f7fa;">
        <td colspan="5" style="padding:8px 12px;border:1px solid #ddd;text-align:right;">SGST @ 9%</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:right;">Rs.${sgst}</td>
      </tr>
    </tfoot>`:""}
  </table>

  <!-- Total + Amount in Words -->
  <div class="totals-section">
    <div class="amount-words">
      <div class="aw-label">Amount in Words</div>
      <div class="aw-val">${totalWords}</div>
      ${notes?`<div style="margin-top:10px;font-size:11px;color:#555;"><strong>Notes:</strong> ${notes}</div>`:""}
    </div>
    <div class="totals-table">
      <table>
        <tr><td>Sub Total</td><td>Rs.${subtotal.toLocaleString()}</td></tr>
        ${gst?`<tr><td>CGST (9%)</td><td>Rs.${cgst}</td></tr><tr><td>SGST (9%)</td><td>Rs.${sgst}</td></tr>`:""}
        <tr class="grand-total"><td colspan="2" style="padding:10px 14px;"><table style="width:100%;border:none;"><tr><td style="padding:0;border:none;color:#fff;font-weight:900;font-size:14px;">GRAND TOTAL</td><td style="padding:0;border:none;color:#fff;font-weight:900;font-size:14px;text-align:right;">Rs.${total.toLocaleString()}</td></tr></table></td></tr>
      </table>
    </div>
  </div>

  <!-- Terms + Signature -->
  <div class="footer-box">
    <div class="terms">
      <div class="t-label">Terms & Conditions</div>
      <ul>
        <li>All disputes subject to Silchar jurisdiction only.</li>
        <li>Goods once sold will not be taken back.</li>
        <li>Warranty as per manufacturer's terms.</li>
        <li>Payment due on receipt of invoice.</li>
      </ul>
    </div>
    <div class="sign-box">
      <div>
        <div class="s-label">For Advantage Silchar</div>
        <div class="sign-line">Authorised Signature</div>
      </div>
      <div>
        <div class="s-label">Customer Acknowledgement</div>
        <div class="sign-line">Received in good condition</div>
      </div>
    </div>
  </div>

  <div style="text-align:center;margin-top:12px;font-size:10px;color:#aaa;">
    This is a computer-generated invoice. Thank you for shopping at Advantage Silchar.
  </div>

</div>
<br/>
<button onclick="window.print()" style="display:block;margin:16px auto;background:#0B1F5E;color:#fff;border:none;padding:11px 32px;font-size:13px;cursor:pointer;font-family:Arial;font-weight:700;">Print / Save as PDF</button>
</body>
</html>`;

    const w=window.open("","_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(()=>w.print(),600);
  }

    const html=`<!DOCTYPE html><html><head><title>Invoice ${invNo}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:Arial,sans-serif;padding:40px;color:#111;max-width:760px;margin:0 auto;}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #0B1F5E;}
      .logo{font-size:22px;font-weight:900;color:#0B1F5E;letter-spacing:-.01em;}
      .logo span{color:#CC1A1A;}
      .store-info{font-size:11px;color:#666;margin-top:6px;line-height:1.7;}
      .inv-meta{text-align:right;}
      .inv-title{font-size:28px;font-weight:900;color:#0B1F5E;letter-spacing:-.01em;}
      .inv-no{font-size:13px;color:#888;margin-top:4px;}
      .inv-date{font-size:13px;color:#888;}
      .bill-to{background:#f5f7fa;border:1px solid #e2e4ea;padding:16px 20px;margin-bottom:24px;}
      .bill-to-label{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#888;margin-bottom:6px;}
      .bill-to-name{font-size:16px;font-weight:700;color:#0B1F5E;}
      .bill-to-info{font-size:12px;color:#666;margin-top:3px;}
      table{width:100%;border-collapse:collapse;margin-bottom:0;}
      thead{background:#0B1F5E;}
      thead td{padding:10px 14px;font-size:10px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase;}
      .totals{margin-left:auto;width:280px;margin-top:0;}
      .totals table{width:100%;}
      .totals td{padding:8px 14px;font-size:13px;border-bottom:1px solid #e2e4ea;}
      .totals td:last-child{text-align:right;font-weight:600;}
      .total-row td{background:#0B1F5E;color:#fff;font-weight:700;font-size:15px;border:none;padding:12px 14px;}
      .total-row td:last-child{text-align:right;}
      .notes{margin-top:28px;padding:14px 18px;background:#f5f7fa;border:1px solid #e2e4ea;font-size:12px;color:#555;line-height:1.7;}
      .footer{margin-top:32px;text-align:center;font-size:11px;color:#aaa;border-top:1px solid #e2e4ea;padding-top:16px;}
      @media print{button{display:none!important;}body{padding:20px;}}
    </style></head>
    <body>
      <div class="header">
        <div>
          <div class="logo">AD<span>V</span>ANTAGE <span style="font-size:14px;font-weight:700;color:#888;">SILCHAR</span></div>
          <div class="store-info">
            Anand Arcade, Opposite Civil Hospital, Hospital Road<br/>
            Silchar – 788001, Assam, India<br/>
            Phone: 9435070738 &nbsp;|&nbsp; Email: advantage.it@gmail.com
          </div>
        </div>
        <div class="inv-meta">
          <div class="inv-title">INVOICE</div>
          <div class="inv-no">${invNo}</div>
          <div class="inv-date">${date}</div>
        </div>
      </div>

      <div class="bill-to">
        <div class="bill-to-label">Bill To</div>
        <div class="bill-to-name">${inq.name}</div>
        <div class="bill-to-info">Phone: ${inq.phone}${inq.email?" &nbsp;|&nbsp; Email: "+inq.email:""}</div>
      </div>

      <table>
        <thead>
          <tr>
            <td style="width:50%">Description</td>
            <td style="width:10%;text-align:center;">Qty</td>
            <td style="width:20%;text-align:right;">Rate</td>
            <td style="width:20%;text-align:right;">Amount</td>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="totals">
        <table>
          <tr><td>Subtotal</td><td>Rs.${subtotal.toLocaleString()}</td></tr>
          ${gst?"<tr><td>GST (18%)</td><td>Rs."+gstAmt.toFixed(2)+"</td></tr>":""}
          <tr class="total-row"><td>Total</td><td>Rs.${total.toLocaleString()}</td></tr>
        </table>
      </div>

      ${notes?`<div class="notes"><strong>Notes:</strong> ${notes}</div>`:""}

      <div class="footer">
        Advantage Silchar — Est. 1995 &nbsp;|&nbsp; Silchar's trusted computer store &nbsp;|&nbsp; Mon–Sat, 10AM–8PM
      </div>
      <br/><button onclick="window.print()" style="background:#0B1F5E;color:#fff;border:none;padding:10px 28px;font-size:13px;cursor:pointer;font-family:Arial;margin-top:8px;">Print / Save as PDF</button>
    </body></html>`;

    const w=window.open("","_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(()=>w.print(),600);
  }

  const inp={border:"1px solid "+BORDER,padding:"7px 10px",fontSize:12,fontFamily:"inherit",outline:"none",width:"100%",color:"#111",background:"#fff"};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"20px 0"}}>
      <div style={{background:"#fff",width:"100%",maxWidth:760,margin:"0 auto"}}>

        {/* Header */}
        <div style={{background:NAVY,padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#fff",letterSpacing:".02em"}}>Invoice Generator</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2}}>{invNo} &nbsp;·&nbsp; {date}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.7)",padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
        </div>

        <div style={{padding:"24px"}}>

          {/* Bill To */}
          <div style={{background:"#f5f7fa",border:"1px solid "+BORDER,padding:"14px 18px",marginBottom:20}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#888",marginBottom:6}}>Bill To</div>
            <div style={{fontWeight:700,fontSize:15,color:NAVY}}>{inq.name}</div>
            <div style={{fontSize:12,color:"#666",marginTop:2}}>{inq.phone}{inq.email&&" · "+inq.email}</div>
          </div>

          {/* Line Items */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#888",marginBottom:10}}>Items</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:NAVY}}>
                  {["Description","Qty","Rate (Rs.)","Amount (Rs.)",""].map(h=>(
                    <td key={h} style={{padding:"8px 12px",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:".06em",textTransform:"uppercase",textAlign:h==="Qty"||h==="Rate (Rs.)"||h==="Amount (Rs.)"?"right":"left"}}>{h}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((it,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid "+BORDER}}>
                    <td style={{padding:"8px 6px",width:"44%"}}>
                      <input value={it.desc} onChange={e=>updateItem(i,"desc",e.target.value)} placeholder="Product / Service description" style={inp} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                    </td>
                    <td style={{padding:"8px 6px",width:"10%"}}>
                      <input type="number" value={it.qty} onChange={e=>updateItem(i,"qty",e.target.value)} style={{...inp,textAlign:"right"}} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                    </td>
                    <td style={{padding:"8px 6px",width:"18%"}}>
                      <input type="number" value={it.rate} onChange={e=>updateItem(i,"rate",e.target.value)} placeholder="0" style={{...inp,textAlign:"right"}} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                    </td>
                    <td style={{padding:"8px 6px",width:"18%"}}>
                      <input value={it.amount?"Rs."+parseFloat(it.amount).toLocaleString():""} readOnly style={{...inp,background:"#f5f7fa",textAlign:"right",color:NAVY,fontWeight:600,cursor:"default"}}/>
                    </td>
                    <td style={{padding:"8px 6px",width:"10%",textAlign:"center"}}>
                      {items.length>1&&<button onClick={()=>removeItem(i)} style={{background:"none",border:"none",color:RED,fontSize:16,cursor:"pointer",fontWeight:700,lineHeight:1}}>×</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} style={{marginTop:10,background:"#fff",border:"1px solid "+BORDER,color:NAVY,padding:"7px 16px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Add Line Item</button>
          </div>

          {/* Totals */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:20,marginBottom:16}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#888",marginBottom:6}}>Notes</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} style={{...inp,resize:"vertical",padding:"8px 10px",fontSize:12}}
                onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
              <label style={{display:"flex",alignItems:"center",gap:6,marginTop:10,cursor:"pointer",fontSize:12,fontWeight:500,color:NAVY}}>
                <input type="checkbox" checked={gst} onChange={e=>setGst(e.target.checked)} style={{accentColor:NAVY,width:14,height:14}}/>
                Apply GST (18%)
              </label>
            </div>
            <div style={{minWidth:240,background:"#f5f7fa",border:"1px solid "+BORDER,padding:"14px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:"1px solid "+BORDER}}>
                <span style={{color:"#555"}}>Subtotal</span>
                <span style={{fontWeight:600,color:NAVY}}>Rs.{subtotal.toLocaleString()}</span>
              </div>
              {gst&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:"1px solid "+BORDER}}>
                <span style={{color:"#555"}}>GST 18%</span>
                <span style={{fontWeight:600,color:NAVY}}>Rs.{gstAmt.toFixed(2)}</span>
              </div>}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,padding:"10px 0",color:NAVY}}>
                <span>Total</span>
                <span>Rs.{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Send Options */}
          <div style={{background:"#f5f7fa",border:"1px solid "+BORDER,padding:"16px 20px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#888",marginBottom:12}}>Send to Customer</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,alignItems:"center",marginBottom:8}}>
              <input value={emailTo} onChange={e=>setEmailTo(e.target.value)} placeholder="Customer email address"
                style={{...inp,fontSize:12}} onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
              <button onClick={sendEmail} disabled={emailSending||!emailTo}
                style={{background:emailTo&&!emailSending?NAVY:"#ccc",color:"#fff",border:"none",padding:"8px 16px",fontSize:11,fontWeight:700,cursor:emailTo?"pointer":"not-allowed",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s"}}
                onMouseEnter={e=>{if(emailTo&&!emailSending)e.target.style.background=RED;}} onMouseLeave={e=>e.target.style.background=emailTo?NAVY:"#ccc"}>
                {emailSending?"Sending...":"Send Email"}
              </button>
              <a href={"https://wa.me/91"+inq.phone.replace(/[^0-9]/g,"")+"?text="+encodeURIComponent(
                "Hi "+inq.name+", please find your invoice from Advantage Silchar.\n\n"+
                "Invoice No: "+invNo+"\nDate: "+date+"\n\n"+
                items.filter(it=>it.desc).map(it=>"- "+it.desc+" x"+it.qty+" = Rs."+parseFloat(it.amount||0).toLocaleString()).join("\n")+
                "\n\nSubtotal: Rs."+subtotal.toLocaleString()+
                (gst?"\nGST (18%): Rs."+gstAmt.toFixed(2):"")+
                "\nTotal: Rs."+total.toLocaleString()+
                "\n\nThank you for choosing Advantage Silchar!\nAnand Arcade, Opp. Civil Hospital, Silchar. Call: 9435070738"
              )} target="_blank" rel="noreferrer"
                style={{background:"#25D366",color:"#fff",padding:"8px 16px",fontSize:11,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap",display:"block",textAlign:"center"}}>
                WhatsApp
              </a>
            </div>
            {emailStatus&&<div style={{fontSize:11,color:emailStatus.startsWith("Error")?"#dc2626":"#16a34a",fontWeight:600}}>{emailStatus}</div>}
          </div>

          {/* Actions */}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:"1px solid "+BORDER}}>
            <button onClick={onClose} style={{background:"#fff",border:"1px solid "+BORDER,color:"#666",padding:"10px 20px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
            <button onClick={printInvoice}
              style={{background:NAVY,color:"#fff",border:"none",padding:"10px 28px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:".04em",transition:"background .15s"}}
              onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN ADMIN
═══════════════════════════════════════════════════════════════════ */
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
  const[serviceJobs,setServiceJobs]=useState([]);
  const[serviceLoading,setServiceLoading]=useState(false);
  const[analytics,setAnalytics]=useState(null);
  const[analyticsLoading,setAnalyticsLoading]=useState(false);
  const[bannerText,setBannerText]=useState(()=>localStorage.getItem("advantage_banner")||"Summer Sale — Up to Rs.5,000 off on Laptops | Student Discount Available | Free OS Installation on all Desktops | Call 9435070738 for Best Deals");
  const[bannerSaved,setBannerSaved]=useState(false);

  function showToast(msg,type="success"){setToast({msg,type});setTimeout(()=>setToast(null),2800);}
  function persist(arr){setProducts(arr);ss(arr);}

  /* Inquiries */
  async function loadInquiries(){
    setInqLoading(true);
    try{
      const res=await fetch(API+"/inquiries",{headers:{"x-admin-token":BTKN}});
      const d=await res.json();
      if(!res.ok)throw new Error(d.error||"Error "+res.status);
      setInquiries(Array.isArray(d)?d:[]);
    }catch(e){showToast(e.message,"error");setInquiries([]);}
    setInqLoading(false);
  }
  async function markRead(id){
    try{await fetch(API+"/inquiries/"+id+"/read",{method:"PUT",headers:{"x-admin-token":BTKN}});loadInquiries();}catch{}
  }
  async function deleteInquiry(id){
    try{await fetch(API+"/inquiries/"+id,{method:"DELETE",headers:{"x-admin-token":BTKN}});loadInquiries();}catch{}
  }

  /* PC Prices */
  async function loadPcPrices(){
    setPcLoading(true);
    try{const res=await fetch(API+"/components");if(res.ok)setPcPrices(await res.json());}catch{}
    setPcLoading(false);
  }
  async function savePcPrice(cat,cid,price,inStock,name){
    try{
      const res=await fetch(API+"/components/"+cat+"/"+cid,{method:"PUT",headers:{"Content-Type":"application/json","x-admin-token":BTKN},body:JSON.stringify({price:Number(price),inStock,name,category:cat,componentId:cid})});
      if(res.ok){setPcSaveMsg(m=>({...m,[cat+":"+cid]:"Saved"}));setTimeout(()=>setPcSaveMsg(m=>({...m,[cat+":"+cid]:""})),2000);loadPcPrices();}
    }catch{}
  }
  async function deletePcPart(cat,cid){
    try{await fetch(API+"/components/"+cat+"/"+cid,{method:"DELETE",headers:{"x-admin-token":BTKN}});loadPcPrices();}catch{}
  }
  async function addPcPart(cat,cid,name,price){
    if(!cat||!cid||!name||!price)return false;
    try{
      const res=await fetch(API+"/components/"+cat+"/"+cid,{method:"PUT",headers:{"Content-Type":"application/json","x-admin-token":BTKN},body:JSON.stringify({price:Number(price),inStock:true,name,category:cat,componentId:cid})});
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
      {category:"Cooler",componentId:"stock",name:"Stock Cooler (Included)",price:0,inStock:true},
      {category:"Cooler",componentId:"hm212",name:"Cooler Master Hyper 212",price:2500,inStock:true},
      {category:"Cooler",componentId:"aio240",name:"240mm AIO Liquid Cooler",price:6000,inStock:true},
    ];
    try{
      const res=await fetch(API+"/components/seed",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":BTKN},body:JSON.stringify(defaults)});
      const d=await res.json();showToast(d.message||"Seeded");loadPcPrices();
    }catch{showToast("Seed failed","error");}
  }

  /* Service Jobs */
  async function loadServiceJobs(){
    setServiceLoading(true);
    try{
      const res=await fetch(API+"/service/all",{headers:{"x-admin-token":BTKN}});
      const d=await res.json();
      if(!res.ok)throw new Error(d.error||"Error");
      setServiceJobs(Array.isArray(d)?d:[]);
    }catch(e){showToast(e.message,"error");setServiceJobs([]);}
    setServiceLoading(false);
  }
  async function updateJobStatus(jobId,status,note,estimatedCost){
    try{
      const body={status,note:note||""};
      if(estimatedCost!==undefined&&estimatedCost!=="") body.estimatedCost=Number(estimatedCost);
      const res=await fetch(API+"/service/"+jobId+"/status",{method:"PUT",headers:{"Content-Type":"application/json","x-admin-token":BTKN},body:JSON.stringify(body)});
      if(!res.ok)throw new Error("Failed");
      showToast("Job updated — "+status);loadServiceJobs();
    }catch(e){showToast(e.message,"error");}
  }
  async function deleteServiceJob(jobId){
    try{await fetch(API+"/service/"+jobId,{method:"DELETE",headers:{"x-admin-token":BTKN}});loadServiceJobs();}catch{}
  }

  /* Analytics */
  async function loadAnalytics(){
    setAnalyticsLoading(true);
    try{
      const[inqRes,svcRes]=await Promise.all([
        fetch(API+"/inquiries",{headers:{"x-admin-token":BTKN}}),
        fetch(API+"/service/all",{headers:{"x-admin-token":BTKN}}),
      ]);
      const inqRaw=inqRes.ok?await inqRes.json():[];
      const svcRaw=svcRes.ok?await svcRes.json():[];
      const inqData=Array.isArray(inqRaw)?inqRaw:[];
      const svcData=Array.isArray(svcRaw)?svcRaw:[];
      const now=new Date();
      const last7=new Date(now-7*864e5);
      const last30=new Date(now-30*864e5);
      const prodCount={};
      inqData.forEach(i=>{if(i.product&&i.product!=="General"){prodCount[i.product]=(prodCount[i.product]||0)+1;}});
      const topProducts=Object.entries(prodCount).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,count])=>({name,count}));
      const dailyMap={};
      for(let i=6;i>=0;i--){
        const d=new Date(now-i*864e5);
        const key=d.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
        dailyMap[key]=0;
      }
      inqData.filter(i=>new Date(i.createdAt)>last7).forEach(i=>{
        const key=new Date(i.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
        if(dailyMap[key]!==undefined)dailyMap[key]++;
      });
      setAnalytics({
        totalEnquiries:inqData.length,
        enquiriesLast7:inqData.filter(i=>new Date(i.createdAt)>last7).length,
        enquiriesLast30:inqData.filter(i=>new Date(i.createdAt)>last30).length,
        unread:inqData.filter(i=>!i.read).length,
        totalProducts:products.length,
        outOfStock:products.filter(p=>p.inStock===false).length,
        outOfStockList:products.filter(p=>p.inStock===false),
        activeJobs:svcData.filter(j=>!["Completed","Cancelled"].includes(j.status)).length,
        totalServiceJobs:svcData.length,
        topProducts,
        dailyEnquiries:Object.entries(dailyMap).map(([date,count])=>({date,count})),
      });
    }catch(e){showToast(e.message,"error");}
    setAnalyticsLoading(false);
  }

  const[invoiceData,setInvoiceData]=useState(null);

  function generateInvoice(inq){
    setInvoiceData(inq);
  }

  function saveBanner(){localStorage.setItem("advantage_banner",bannerText);setBannerSaved(true);setTimeout(()=>setBannerSaved(false),2000);showToast("Banner saved. Refresh website to see it.");}

  /* Products */
  function handleSave(){
    if(!form.name.trim()||!form.price.trim()){showToast("Name and Price required","error");return;}
    const spec=form.spec.trim()||Object.values(form.specs).filter(Boolean).slice(0,4).join(" · ");
    const highlights=form.highlights.filter(h=>h.trim());
    if(editId!==null){
      persist(products.map(p=>p.id===editId?{...form,id:editId,spec,highlights}:p));
      showToast('"'+form.name+'" updated');
    }else{
      persist([...products,{...form,id:Date.now(),spec,highlights}]);
      showToast('"'+form.name+'" added');
    }
    setForm(EMPTY);setEditId(null);setTab("products");
  }
  function handleEdit(p){
    setForm({name:p.name,cat:p.cat,price:p.price,icon:p.icon||"💻",isNew:p.isNew||false,inStock:p.inStock!==false,image:p.image||"",spec:p.spec||"",specs:p.specs||{},highlights:p.highlights?.length?p.highlights:["","","",""]});
    setEditId(p.id);setTab("add");window.scrollTo({top:0,behavior:"smooth"});
  }
  function handleDelete(id){persist(products.filter(p=>p.id!==id));setDelConfirm(null);showToast("Product deleted","error");}
  function toggleNew(id){persist(products.map(p=>p.id===id?{...p,isNew:!p.isNew}:p));}
  function toggleStock(id){persist(products.map(p=>p.id===id?{...p,inStock:p.inStock===false}:p));}

  const filtered=filterCat==="All"?products:products.filter(p=>p.cat===filterCat);
  const newCount=inquiries.filter(i=>!i.read).length;

  /* ─── Styles ─────────────────────────────────────────────────── */
  const TABS=[
    {key:"products",label:"Products ("+products.length+")"},
    {key:"add",label:editId!==null?"Edit Product":"Add Product"},
    {key:"inquiries",label:"Enquiries"+(newCount>0?" ("+newCount+")":""),onClick:()=>loadInquiries()},
    {key:"pcprices",label:"PC Prices",onClick:()=>loadPcPrices()},
    {key:"service",label:"Service Jobs",onClick:()=>loadServiceJobs()},
    {key:"analytics",label:"Analytics",onClick:()=>loadAnalytics()},
    {key:"banner",label:"Banner"},
  ];

  const STATUS_LIST=["Received","Diagnosed","In Progress","Ready for Pickup","Completed","Cancelled"];
  const STATUS_COLOR={"Received":"#d97706","Diagnosed":"#0891b2","In Progress":"#7c3aed","Ready for Pickup":"#16a34a","Completed":"#16a34a","Cancelled":"#dc2626"};

  /* ─── Login ──────────────────────────────────────────────────── */
  if(!authed) return(
    <div style={{minHeight:"100vh",background:GREY,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}"}</style>
      <div style={{background:"#fff",width:"100%",maxWidth:360,padding:"40px 36px",border:"1px solid "+BORDER}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:32}}>
          <div style={{background:NAVY,padding:"5px 12px",display:"flex",alignItems:"center"}}>
            <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>AD</span>
            <span style={{fontSize:18,fontWeight:800,color:RED}}>V</span>
            <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>ANTAGE</span>
          </div>
          <div style={{background:"#fff",border:"1px solid "+NAVY,padding:"2px 8px",display:"flex",alignItems:"center"}}>
            <span style={{fontSize:8,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:NAVY}}>ADMIN</span>
          </div>
        </div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:6}}>Admin Access</div>
        <div style={{fontSize:22,fontWeight:800,color:NAVY,marginBottom:24}}>Sign In</div>
        <input type="password" placeholder="Password" value={pw}
          onChange={e=>{setPw(e.target.value);setPwErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&(pw===ADMIN_PASSWORD?setAuthed(true):setPwErr(true))}
          style={{...INP,borderColor:pwErr?RED:BORDER,marginBottom:8,padding:"11px 12px",fontSize:14}}
          onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=pwErr?RED:BORDER}/>
        {pwErr&&<div style={{fontSize:12,color:RED,marginBottom:10}}>Incorrect password.</div>}
        <button onClick={()=>pw===ADMIN_PASSWORD?setAuthed(true):setPwErr(true)}
          style={{width:"100%",background:NAVY,color:"#fff",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:".04em"}}>
          Sign In
        </button>
        <button onClick={onExit} style={{width:"100%",marginTop:10,background:"none",border:"none",fontSize:12,color:"#aaa",cursor:"pointer",padding:"8px 0",fontFamily:"inherit"}}>Back to website</button>
      </div>
    </div>
  );

  /* ─── Main ───────────────────────────────────────────────────── */
  return(
    <div style={{minHeight:"100vh",background:GREY,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .adm-inp{width:100%;border:1px solid ${BORDER};padding:9px 12px;font-size:13px;outline:none;background:#fff;font-family:inherit;color:#111;transition:border-color .15s;}
        .adm-inp:focus{border-color:${NAVY};}
        .adm-inp select{appearance:none;}
      `}</style>

      {/* Top bar */}
      <div style={{background:NAVY,height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center"}}>
          <div style={{background:"rgba(255,255,255,.08)",padding:"4px 10px",display:"flex",alignItems:"center"}}>
            <span style={{fontSize:15,fontWeight:800,color:"#fff"}}>AD</span>
            <span style={{fontSize:15,fontWeight:800,color:RED}}>V</span>
            <span style={{fontSize:15,fontWeight:800,color:"#fff"}}>ANTAGE</span>
          </div>
          <div style={{borderLeft:"2px solid "+RED,marginLeft:0,padding:"2px 8px"}}>
            <span style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.5)"}}>ADMIN PANEL</span>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>{products.length} products</span>
          <button onClick={onExit} style={{background:"none",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.7)",padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",letterSpacing:".04em"}}>View Website</button>
          <button onClick={()=>setAuthed(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,.3)",padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Logout</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 24px"}}>

        {/* Stats */}
        <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
          <Stat label="Total Products" value={products.length}/>
          {CATS.map(c=><Stat key={c} label={c.replace(" & CCTV","")} value={products.filter(p=>p.cat===c).length}/>)}
          <Stat label="New" value={products.filter(p=>p.isNew).length}/>
          <Stat label="Out of Stock" value={products.filter(p=>p.inStock===false).length} alert/>
        </div>

        <SeedBanner products={products}/>

        {/* Tabs */}
        <div style={{display:"flex",gap:0,marginBottom:24,borderBottom:"2px solid "+BORDER,flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.key}
              onClick={()=>{setTab(t.key);t.onClick&&t.onClick();if(!editId&&t.key==="add")setForm(EMPTY);}}
              style={{padding:"10px 18px",fontSize:12,fontWeight:600,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",letterSpacing:".03em",color:tab===t.key?NAVY:"#888",borderBottom:"2px solid "+(tab===t.key?NAVY:"transparent"),marginBottom:-2,transition:"all .15s",whiteSpace:"nowrap"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ PRODUCTS ══ */}
        {tab==="products"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["All",...CATS].map(c=>(
                  <button key={c} onClick={()=>setFilterCat(c)}
                    style={{padding:"5px 14px",fontSize:12,fontWeight:600,border:"1px solid "+(filterCat===c?NAVY:BORDER),background:filterCat===c?NAVY:"#fff",color:filterCat===c?"#fff":"#555",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                    {c}
                  </button>
                ))}
              </div>
              <button onClick={()=>window.confirm("Reset to defaults?")&&persist(defaultProducts)}
                style={{background:"none",border:"1px solid "+BORDER,padding:"5px 14px",fontSize:11,fontWeight:600,color:"#888",cursor:"pointer",fontFamily:"inherit"}}>
                Reset to Defaults
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {filtered.length===0&&<div style={{textAlign:"center",padding:"48px",background:"#fff",border:"1px solid "+BORDER,color:"#aaa",fontSize:13}}>No products in this category.</div>}
              {filtered.map(p=>(
                <div key={p.id} style={{background:"#fff",border:"1px solid "+BORDER,padding:"12px 16px",display:"flex",alignItems:"center",gap:14,transition:"border-color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=NAVY}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                  {p.image?<img src={p.image} alt="" style={{width:44,height:44,objectFit:"contain",flexShrink:0}}/>:<div style={{width:44,height:44,background:GREY,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{p.icon}</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:14,color:NAVY}}>{p.name}</span>
                      {p.isNew&&<span style={{background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",letterSpacing:".06em",textTransform:"uppercase"}}>NEW</span>}
                      {p.inStock===false&&<span style={{background:"#fff",color:"#d97706",border:"1px solid #d97706",fontSize:9,fontWeight:700,padding:"1px 6px",letterSpacing:".06em",textTransform:"uppercase"}}>OUT OF STOCK</span>}
                    </div>
                    <div style={{fontSize:11,color:"#aaa"}}>{p.cat} &nbsp;·&nbsp; {p.spec}</div>
                  </div>
                  <div style={{fontWeight:700,fontSize:14,color:NAVY,flexShrink:0}}>{p.price}</div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={()=>toggleNew(p.id)} style={{padding:"4px 10px",fontSize:11,fontWeight:600,border:"1px solid "+BORDER,background:"#fff",color:p.isNew?RED:"#888",cursor:"pointer",fontFamily:"inherit"}}>
                      {p.isNew?"Remove New":"Mark New"}
                    </button>
                    <button onClick={()=>toggleStock(p.id)} style={{padding:"4px 10px",fontSize:11,fontWeight:600,border:"1px solid "+BORDER,background:"#fff",color:p.inStock===false?"#d97706":"#16a34a",cursor:"pointer",fontFamily:"inherit"}}>
                      {p.inStock===false?"Mark In Stock":"Mark Out"}
                    </button>
                    <button onClick={()=>handleEdit(p)} style={{padding:"4px 12px",fontSize:11,fontWeight:600,border:"1px solid "+NAVY,background:"#fff",color:NAVY,cursor:"pointer",fontFamily:"inherit"}}>Edit</button>
                    <button onClick={()=>setDelConfirm(p.id)} style={{padding:"4px 12px",fontSize:11,fontWeight:600,border:"1px solid "+BORDER,background:"#fff",color:RED,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ADD / EDIT ══ */}
        {tab==="add"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* Basic */}
              <div style={{background:"#fff",border:"1px solid "+BORDER,padding:20}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:14}}>Basic Info</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div>
                    <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Product Name *</label>
                    <input className="adm-inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. HP Pavilion 15"
                      onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div>
                      <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Category</label>
                      <select className="adm-inp" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value,specs:{}}))}
                        onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}>
                        {CATS.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Price *</label>
                      <input className="adm-inp" placeholder="e.g. Rs.52,990" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}
                        onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:20}}>
                    <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13,fontWeight:500,color:NAVY}}>
                      <input type="checkbox" checked={form.isNew} onChange={e=>setForm(f=>({...f,isNew:e.target.checked}))} style={{accentColor:RED,width:14,height:14}}/>
                      Mark as New
                    </label>
                    <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13,fontWeight:500,color:"#16a34a"}}>
                      <input type="checkbox" checked={form.inStock!==false} onChange={e=>setForm(f=>({...f,inStock:e.target.checked}))} style={{accentColor:"#16a34a",width:14,height:14}}/>
                      In Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div style={{background:"#fff",border:"1px solid "+BORDER,padding:20}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:14}}>Product Image</div>
                <div style={{border:"1px dashed "+BORDER,padding:20,textAlign:"center",background:GREY,cursor:"pointer",marginBottom:10}}
                  onClick={()=>document.getElementById("img-up").click()}
                  onDragOver={e=>e.preventDefault()}
                  onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.type.startsWith("image/")){const r=new FileReader();r.onload=ev=>setForm(fm=>({...fm,image:ev.target.result}));r.readAsDataURL(f);}}}>
                  <input id="img-up" type="file" accept="image/*" style={{display:"none"}}
                    onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setForm(fm=>({...fm,image:ev.target.result}));r.readAsDataURL(f);}}}/>
                  {form.image?(
                    <div style={{position:"relative",display:"inline-block"}}>
                      <img src={form.image} alt="" style={{maxHeight:100,maxWidth:"100%",objectFit:"contain"}}/>
                      <button onClick={e=>{e.stopPropagation();setForm(f=>({...f,image:""}));}} style={{position:"absolute",top:-8,right:-8,background:RED,color:"#fff",border:"none",width:20,height:20,borderRadius:"50%",fontSize:11,cursor:"pointer",fontWeight:700}}>x</button>
                    </div>
                  ):(
                    <div style={{fontSize:12,color:"#aaa"}}>Click or drag to upload image</div>
                  )}
                </div>
                <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Or paste URL</label>
                <input className="adm-inp" placeholder="https://..." value={form.image.startsWith("data:")?"":(form.image||"")} onChange={e=>setForm(f=>({...f,image:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
              </div>

              {/* Specs */}
              <div style={{background:"#fff",border:"1px solid "+BORDER,padding:20}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:14}}>Specifications</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {(SPEC_KEYS[form.cat]||SPEC_KEYS.Accessories).map(k=>(
                    <div key={k} style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:600,color:"#555"}}>{k}</span>
                      <input className="adm-inp" value={form.specs[k]||""} onChange={e=>setForm(f=>({...f,specs:{...f.specs,[k]:e.target.value}}))} placeholder={k}
                        onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12}}>
                  <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Short Summary (auto-generated if blank)</label>
                  <input className="adm-inp" value={form.spec} onChange={e=>setForm(f=>({...f,spec:e.target.value}))} placeholder="e.g. Intel i5 · 8GB · 512GB SSD"
                    onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                </div>
              </div>

              {/* Highlights */}
              <div style={{background:"#fff",border:"1px solid "+BORDER,padding:20}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:NAVY,marginBottom:12}}>Key Highlights</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[0,1,2,3].map(i=>(
                    <input key={i} className="adm-inp" placeholder={"Highlight "+(i+1)} value={form.highlights[i]||""}
                      onChange={e=>{const h=[...form.highlights];h[i]=e.target.value;setForm(f=>({...f,highlights:h}));}}
                      onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  ))}
                </div>
              </div>

              <div style={{display:"flex",gap:10}}>
                <button onClick={handleSave}
                  style={{flex:1,background:NAVY,color:"#fff",border:"none",padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:".04em",transition:"background .15s"}}
                  onMouseEnter={e=>e.target.style.background=RED} onMouseLeave={e=>e.target.style.background=NAVY}>
                  {editId!==null?"Update Product":"Add Product"}
                </button>
                <button onClick={()=>{setForm(EMPTY);setEditId(null);setTab("products");}}
                  style={{padding:"13px 20px",background:"#fff",border:"1px solid "+BORDER,color:"#666",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  Cancel
                </button>
              </div>
            </div>

            {/* Preview */}
            <div style={{background:"#fff",border:"1px solid "+BORDER,padding:18,position:"sticky",top:64}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#aaa",marginBottom:12}}>Preview</div>
              <div style={{background:GREY,height:130,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,overflow:"hidden",position:"relative"}}>
                {form.isNew&&<span style={{position:"absolute",top:6,left:6,background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",letterSpacing:".06em",textTransform:"uppercase"}}>NEW</span>}
                {form.image?<img src={form.image} alt="" style={{maxHeight:130,maxWidth:"100%",objectFit:"contain",padding:8}}/>:<span style={{fontSize:48}}>{form.icon}</span>}
              </div>
              <div style={{fontSize:10,color:RED,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:3}}>{form.cat}</div>
              <div style={{fontWeight:700,fontSize:14,color:NAVY,marginBottom:4,lineHeight:1.2}}>{form.name||"Product Name"}</div>
              <div style={{fontSize:11,color:"#aaa",marginBottom:8}}>{form.spec||Object.values(form.specs).filter(Boolean).slice(0,3).join(" · ")||"Specifications"}</div>
              <div style={{fontWeight:800,fontSize:18,color:NAVY}}>{form.price||"Rs.0,000"}</div>
              {form.highlights.filter(h=>h).map((h,i)=>(
                <div key={i} style={{fontSize:11,color:"#444",marginTop:6,display:"flex",gap:5,alignItems:"flex-start"}}>
                  <span style={{color:RED,fontWeight:700,flexShrink:0}}>—</span>{h}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ENQUIRIES ══ */}
        {tab==="inquiries"&&(
          <div>
            {inqLoading&&<div style={{textAlign:"center",padding:40,color:"#aaa",fontSize:13}}>Loading enquiries...</div>}
            {!inqLoading&&inquiries.length===0&&<div style={{textAlign:"center",padding:"48px",background:"#fff",border:"1px solid "+BORDER,color:"#aaa",fontSize:13}}>No enquiries yet.</div>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {inquiries.map(inq=>(
                <div key={inq._id||inq.id} style={{background:"#fff",border:"1px solid "+(inq.read?BORDER:NAVY),padding:"16px 18px",display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:14,color:NAVY}}>{inq.name}</span>
                      <span style={{fontSize:12,color:"#888"}}>{inq.phone}</span>
                      {inq.email&&<span style={{fontSize:12,color:"#888"}}>{inq.email}</span>}
                      {!inq.read&&<span style={{background:RED,color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",letterSpacing:".04em",textTransform:"uppercase"}}>New</span>}
                    </div>
                    <div style={{fontSize:11,color:RED,fontWeight:600,marginBottom:4,letterSpacing:".03em",textTransform:"uppercase"}}>{inq.product}</div>
                    <div style={{fontSize:13,color:"#444",lineHeight:1.6,whiteSpace:"pre-line"}}>{inq.message}</div>
                    <div style={{fontSize:11,color:"#bbb",marginTop:6}}>{new Date(inq.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0,flexDirection:"column",minWidth:130}}>
                    <a href={"https://wa.me/91"+inq.phone.replace(/[^0-9]/g,"")+"?text="+encodeURIComponent("Hi "+inq.name+", regarding your enquiry about "+inq.product+"...")}
                      target="_blank" rel="noreferrer"
                      style={{background:"#25D366",color:"#fff",padding:"7px 12px",fontSize:11,fontWeight:600,cursor:"pointer",textDecoration:"none",textAlign:"center",display:"block"}}>
                      WhatsApp
                    </a>
                    <button onClick={()=>generateInvoice(inq)}
                      style={{background:NAVY,color:"#fff",border:"none",padding:"7px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",letterSpacing:".03em"}}>
                      Generate Invoice
                    </button>
                    {!inq.read&&(
                      <button onClick={()=>markRead(inq._id||inq.id)}
                        style={{background:"#fff",color:NAVY,border:"1px solid "+NAVY,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                        Mark Read
                      </button>
                    )}
                    <button onClick={()=>deleteInquiry(inq._id||inq.id)}
                      style={{background:"#fff",color:RED,border:"1px solid "+BORDER,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PC PRICES ══ */}
        {tab==="pcprices"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:NAVY}}>PC Component Prices</div>
                <div style={{fontSize:12,color:"#888",marginTop:2}}>Edit prices and stock. Changes appear in PC Builder immediately.</div>
              </div>
              <button onClick={seedPcPrices} style={{background:"#fff",color:NAVY,border:"1px solid "+NAVY,padding:"8px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Seed Default Prices</button>
            </div>
            <AddPartForm onAdd={addPcPart}/>
            {pcLoading&&<div style={{textAlign:"center",padding:40,color:"#aaa",fontSize:13}}>Loading...</div>}
            {!pcLoading&&Object.keys(pcPrices).length===0&&(
              <div style={{background:"#fffbeb",border:"1px solid #fde047",padding:"12px 16px",fontSize:13,color:"#854d0e"}}>No prices in database. Click "Seed Default Prices" to start.</div>
            )}
            {Object.entries(pcPrices).map(([category,items])=>(
              <div key={category} style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:NAVY,marginBottom:8,paddingBottom:6,borderBottom:"1px solid "+BORDER}}>{category}</div>
                <table style={{width:"100%",borderCollapse:"collapse",background:"#fff",border:"1px solid "+BORDER}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid "+BORDER}}>
                      {["Component","Price","Stock","Updated","Actions"].map(h=>(
                        <td key={h} style={{padding:"8px 14px",fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:".06em"}}>{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item=>(
                      <PcPriceRow key={item.componentId} item={item} category={category}
                        saveMsg={pcSaveMsg[category+":"+item.componentId]||""}
                        onSave={(price,inStock,name)=>savePcPrice(category,item.componentId,price,inStock,name)}
                        onDelete={deletePcPart}/>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ══ SERVICE JOBS ══ */}
        {tab==="service"&&(
          <div>
            <div style={{background:"#fffbeb",border:"1px solid #fde047",padding:"10px 16px",marginBottom:16,fontSize:12,color:"#854d0e"}}>
              Service jobs are created automatically when customers book a repair. Update status and notify customers here.
            </div>
            {serviceLoading&&<div style={{textAlign:"center",padding:40,color:"#aaa",fontSize:13}}>Loading...</div>}
            {!serviceLoading&&serviceJobs.length===0&&<div style={{textAlign:"center",padding:"48px",background:"#fff",border:"1px solid "+BORDER,color:"#aaa",fontSize:13}}>No service jobs yet.</div>}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {serviceJobs.map(job=>(
                <div key={job._id} style={{background:"#fff",border:"1px solid "+BORDER,padding:"14px 16px",display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:14,color:NAVY}}>{job.customerName}</span>
                      <span style={{fontSize:12,color:"#888"}}>{job.phone}</span>
                      <span style={{background:GREY,color:NAVY,fontSize:10,fontWeight:700,padding:"2px 8px",fontFamily:"monospace",border:"1px solid "+BORDER}}>{job.jobId}</span>
                    </div>
                    <div style={{fontSize:12,color:"#555",marginBottom:3}}>{job.deviceType} {job.brand} {job.model}</div>
                    <div style={{fontSize:11,color:"#888",marginBottom:6}}>{job.issue}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{background:STATUS_COLOR[job.status]||"#888",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",letterSpacing:".06em",textTransform:"uppercase"}}>{job.status}</span>
                      <span style={{fontSize:10,color:"#bbb"}}>{new Date(job.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                      {job.serviceType&&<span style={{fontSize:10,color:"#aaa"}}>{job.serviceType}</span>}
                      {job.estimatedCost>0&&<span style={{fontSize:11,fontWeight:700,color:NAVY,background:"#f0f2f8",padding:"1px 8px",border:"1px solid #dde2f0"}}>Est. Rs.{job.estimatedCost.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0,alignItems:"center",flexWrap:"wrap"}}>
                    <EstCostUpdate job={job} onUpdate={updateJobStatus}/>
                    <a href={"https://wa.me/91"+job.phone.replace(/[^0-9]/g,"")+"?text="+encodeURIComponent("Hi "+job.customerName+", your "+job.deviceType+" repair (Job: "+job.jobId+") status is now: "+job.status+". Call 9435070738 for details.")}
                      target="_blank" rel="noreferrer"
                      style={{background:"#25D366",color:"#fff",padding:"6px 12px",fontSize:11,fontWeight:600,textDecoration:"none",whiteSpace:"nowrap"}}>
                      Notify
                    </a>
                    <button onClick={()=>window.confirm("Delete job "+job.jobId+"?")&&deleteServiceJob(job.jobId)}
                      style={{background:"#fff",color:RED,border:"1px solid "+BORDER,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {tab==="analytics"&&(
          <div>
            {analyticsLoading&&<div style={{textAlign:"center",padding:60,color:"#aaa",fontSize:13}}>Loading analytics...</div>}
            {!analyticsLoading&&!analytics&&(
              <div style={{textAlign:"center",padding:"48px",background:"#fff",border:"1px solid "+BORDER}}>
                <div style={{fontSize:13,color:"#aaa",marginBottom:14}}>Load your store analytics</div>
                <button onClick={loadAnalytics} style={{background:NAVY,color:"#fff",border:"none",padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Load Analytics</button>
              </div>
            )}
            {analytics&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
                  {[
                    {label:"Total Enquiries",value:analytics.totalEnquiries},
                    {label:"Last 7 Days",value:analytics.enquiriesLast7},
                    {label:"Unread",value:analytics.unread,alert:analytics.unread>0},
                    {label:"Active Repairs",value:analytics.activeJobs},
                    {label:"Total Products",value:analytics.totalProducts},
                    {label:"Out of Stock",value:analytics.outOfStock,alert:analytics.outOfStock>0},
                    {label:"Last 30 Days",value:analytics.enquiriesLast30},
                    {label:"Total Service Jobs",value:analytics.totalServiceJobs},
                  ].map((k,i)=><Stat key={i} label={k.label} value={k.value} alert={k.alert}/>)}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div style={{background:"#fff",border:"1px solid "+BORDER,padding:20}}>
                    <div style={{fontWeight:700,fontSize:13,color:NAVY,marginBottom:14,letterSpacing:".02em"}}>Enquiries — Last 7 Days</div>
                    {(()=>{
                      const max=Math.max(...analytics.dailyEnquiries.map(d=>d.count),1);
                      return(
                        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:90}}>
                          {analytics.dailyEnquiries.map((d,i)=>(
                            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                              <div style={{fontSize:10,fontWeight:700,color:NAVY}}>{d.count||""}</div>
                              <div style={{width:"100%",background:d.count>0?NAVY:BORDER,height:Math.max((d.count/max)*72,2)+"px"}}/>
                              <div style={{fontSize:9,color:"#aaa",textAlign:"center"}}>{d.date}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div style={{background:"#fff",border:"1px solid "+BORDER,padding:20}}>
                    <div style={{fontWeight:700,fontSize:13,color:NAVY,marginBottom:14,letterSpacing:".02em"}}>Top Products by Enquiries</div>
                    {analytics.topProducts.length===0?<div style={{color:"#aaa",fontSize:12}}>No product enquiries yet.</div>:
                      analytics.topProducts.slice(0,5).map((p,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"6px 0",borderBottom:"1px solid "+BORDER}}>
                          <span style={{fontSize:11,fontWeight:800,color:i===0?RED:NAVY,minWidth:18}}>{i+1}</span>
                          <span style={{fontSize:12,color:NAVY,flex:1}}>{p.name}</span>
                          <span style={{fontSize:11,color:"#aaa"}}>{p.count}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {analytics.outOfStockList.length>0&&(
                  <div style={{background:"#fff",border:"1px solid #fde047",padding:18,marginBottom:16}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#854d0e",marginBottom:10}}>Out of Stock ({analytics.outOfStockList.length})</div>
                    {analytics.outOfStockList.map(p=>(
                      <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid "+BORDER}}>
                        <div><span style={{fontWeight:600,fontSize:13,color:NAVY}}>{p.name}</span><span style={{fontSize:11,color:"#aaa",marginLeft:8}}>{p.cat}</span></div>
                        <button onClick={()=>{persist(products.map(x=>x.id===p.id?{...x,inStock:true}:x));showToast(p.name+" marked in stock");loadAnalytics();}}
                          style={{background:"#fff",color:"#16a34a",border:"1px solid #16a34a",padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                          Mark In Stock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={loadAnalytics} style={{background:"#fff",color:NAVY,border:"1px solid "+BORDER,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Refresh</button>
              </div>
            )}
          </div>
        )}

        {/* ══ BANNER ══ */}
        {tab==="banner"&&(
          <div>
            <div style={{background:"#fff",border:"1px solid "+BORDER,padding:22,marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:15,color:NAVY,marginBottom:4}}>Scrolling Promo Banner</div>
              <div style={{fontSize:12,color:"#888",marginBottom:16}}>This text scrolls across the top of the website. Customers see it on every visit.</div>
              <label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Banner Text</label>
              <textarea value={bannerText} onChange={e=>setBannerText(e.target.value)} rows={3}
                style={{...INP,resize:"vertical",marginBottom:14,padding:"10px 12px",fontSize:13}}
                onFocus={e=>e.target.style.borderColor=NAVY} onBlur={e=>e.target.style.borderColor=BORDER}/>
              <div style={{fontSize:11,color:"#888",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Preview</div>
              <div style={{background:RED,overflow:"hidden",height:30,display:"flex",alignItems:"center",marginBottom:16}}>
                <style>{"@keyframes bm{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}.bmar{display:inline-block;animation:bm 20s linear infinite;white-space:nowrap;padding-left:100%;}"}</style>
                <div className="bmar" style={{fontSize:12,fontWeight:600,color:"#fff"}} dangerouslySetInnerHTML={{__html:bannerText}}/>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={saveBanner}
                  style={{background:bannerSaved?"#16a34a":NAVY,color:"#fff",border:"none",padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"background .2s"}}>
                  {bannerSaved?"Saved":"Save Banner"}
                </button>
                <button onClick={()=>setBannerText("Summer Sale — Up to Rs.5,000 off on Laptops | Student Discount Available | Free OS Installation on all Desktops | Call 9435070738")}
                  style={{background:"#fff",border:"1px solid "+BORDER,color:"#666",padding:"10px 18px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  Reset to Default
                </button>
              </div>
              <div style={{marginTop:12,fontSize:12,color:"#aaa"}}>After saving, refresh the website to see the updated banner.</div>
            </div>

            <div style={{background:"#fff",border:"1px solid "+BORDER,padding:20}}>
              <div style={{fontWeight:700,fontSize:13,color:NAVY,marginBottom:12}}>Quick Templates</div>
              {[
                "Summer Sale — Up to Rs.5,000 off on Laptops | Call 9435070738 for Best Deals",
                "Student Special — Extra Rs.1,000 off on all Laptops | Valid this month only",
                "New Arrivals — Latest HP and Dell Laptops in stock | Visit Anand Arcade, Silchar",
                "Free Diagnosis — Bring your laptop for free checkup | No fix, no charge",
                "Dussehra Sale — Special prices on Desktops, Laptops and Printers | Limited stock",
              ].map((t,i)=>(
                <div key={i} onClick={()=>setBannerText(t)}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",border:"1px solid "+BORDER,cursor:"pointer",marginBottom:6,background:"#fff",transition:"border-color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=NAVY}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                  <div style={{flex:1,fontSize:12,color:"#444"}}>{t}</div>
                  <button style={{background:NAVY,color:"#fff",border:"none",padding:"4px 12px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}>Use</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Invoice Modal */}
      {invoiceData&&<InvoiceModal inq={invoiceData} onClose={()=>setInvoiceData(null)}/>}

      {/* Delete Modal */}
      {delConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",maxWidth:340,width:"100%",padding:"32px 28px",border:"1px solid "+BORDER}}>
            <div style={{fontWeight:700,fontSize:18,color:NAVY,marginBottom:8}}>Delete this product?</div>
            <p style={{fontSize:13,color:"#666",marginBottom:24}}>This cannot be undone.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDelConfirm(null)} style={{flex:1,background:"#fff",border:"1px solid "+BORDER,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#555"}}>Cancel</button>
              <button onClick={()=>handleDelete(delConfirm)} style={{flex:1,background:RED,color:"#fff",border:"none",padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast&&(
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?RED:NAVY,color:"#fff",padding:"10px 20px",fontSize:13,fontWeight:600,zIndex:3000,boxShadow:"0 4px 16px rgba(0,0,0,.15)",whiteSpace:"nowrap"}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}