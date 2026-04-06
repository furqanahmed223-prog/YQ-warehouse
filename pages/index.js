import { useState, useEffect, useMemo, useRef } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

const T = {
  en: {
    app:'Warehouse', sub:'Mobile Accessories', lock:'Lock 🔒', unlock:'Unlock →',
    pwd:'Password', enterPwd:'Enter password', wrongPwd:'Wrong password', loading:'Loading...',
    home:'Home', stock:'Stock', scan:'Scan', transfer:'Transfer', reports:'Reports', settings:'Settings',
    skus:'Total SKUs', units:'Units', inToday:'In Today', outToday:'Out Today', stockVal:'Stock Value (BD)',
    updateStock:'📦 Update Stock', sendReturn:'🚚 Send / Return', addItem:'+ Add Item',
    recentActivity:'Recent Activity', lowStock:'Low Stock', outOfStock:'Out of Stock', allItems:'All',
    stockIn:'Stock In', stockOut:'Stock Out', transferL:'Transfer', returnL:'Return',
    sendTo:'🚚 Send to Salesman', receiveRet:'↩ Receive Return',
    movLog:'Movement Log', entries:'entries',
    settings2:'Settings', changePwd:'Change Password', currPwd:'Current Password',
    newPwd:'New Password', confPwd:'Confirm Password', showPwd:'Show', updatePwd:'Update Password',
    appInfo:'App Info', manageSalesmen:'Manage Salesmen', addSalesman:'+ Add Salesman',
    salesmanName:'Salesman Name', remove:'Remove',
    recvSupplier:'📥 Receive from Supplier', dispatch:'📤 Dispatch / Sell',
    curr:'Current stock', newTot:'New total', remaining:'Remaining',
    qty:'Quantity', shelf:'Shelf', note:'Note (optional)',
    selSales:'Select Salesman', retReason:'Reason (optional)',
    confRcv:'Confirm Receipt', confDisp:'Confirm Dispatch', confSend:'Confirm Send', confRet:'Accept Return',
    itemName:'Item Name', itemCode:'Code', price:'Price (BD)', openStock:'Opening Stock', minAlert:'Min Alert',
    addWarehouse:'Add to Warehouse', mainWH:'Warehouse', dispatched:'Dispatched',
    supplier:'Supplier', openEntry:'Opening stock',
    scanTitle:'Barcode Scanner', scanSub:'Scan with camera or type item code',
    scanInput:'Type item name or code...', searchItem:'Search',
    itemNotFound:'Item not found',
    noStock:'No stock available — cannot transfer',
    reports2:'Reports', daily:'Daily Summary', bySales:'By Salesman', fullLog:'Full Log', exportCSV:'Export CSV',
    date:'Date', totalIn:'Total In', totalOut:'Total Out', transfers:'Transfers', returns:'Returns',
    salesman:'Salesman', totalReceived:'Received', totalReturned:'Returned', balance:'Balance',
    available:'available', units2:'units', dataLive:'Data saved to cloud · any phone',
    searchSKU:'Search item by name or code...', searchSalesman:'Search salesman...',
    tapToScan:'Tap to open camera', orType:'or type below',
    scanHint:'Point camera at barcode on product packaging',
    insuffStock:'Insufficient stock', selectItemFirst:'Select an item first',
    transferNote:'Stock deducted from warehouse · logged under salesman',
    returnNote:'Stock returned to warehouse from salesman',
    step1:'Step 1 — Select Item', step2:'Step 2 — Select Salesman', step3:'Step 3 — Quantity',
  },
  ar: {
    app:'المستودع', sub:'الملحقات المحمولة', lock:'قفل 🔒', unlock:'فتح →',
    pwd:'كلمة المرور', enterPwd:'أدخل كلمة المرور', wrongPwd:'كلمة المرور خاطئة', loading:'جاري التحميل...',
    home:'الرئيسية', stock:'المخزون', scan:'المسح', transfer:'التحويل', reports:'التقارير', settings:'الإعدادات',
    skus:'إجمالي الأصناف', units:'وحدات', inToday:'وارد اليوم', outToday:'صادر اليوم', stockVal:'قيمة المخزون (BD)',
    updateStock:'📦 تحديث المخزون', sendReturn:'🚚 إرسال / استرجاع', addItem:'+ إضافة صنف',
    recentActivity:'النشاط الأخير', lowStock:'مخزون منخفض', outOfStock:'نفد', allItems:'الكل',
    stockIn:'وارد', stockOut:'صادر', transferL:'تحويل', returnL:'مرتجع',
    sendTo:'🚚 إرسال لمندوب', receiveRet:'↩ استلام مرتجع',
    movLog:'سجل الحركات', entries:'قيد',
    settings2:'الإعدادات', changePwd:'تغيير كلمة المرور', currPwd:'الكلمة الحالية',
    newPwd:'الكلمة الجديدة', confPwd:'تأكيد الكلمة', showPwd:'إظهار', updatePwd:'تحديث',
    appInfo:'معلومات', manageSalesmen:'إدارة المندوبين', addSalesman:'+ إضافة مندوب',
    salesmanName:'اسم المندوب', remove:'حذف',
    recvSupplier:'📥 استلام من المورد', dispatch:'📤 صرف',
    curr:'المخزون الحالي', newTot:'المجموع الجديد', remaining:'المتبقي',
    qty:'الكمية', shelf:'الرف', note:'ملاحظة (اختياري)',
    selSales:'اختر المندوب', retReason:'السبب (اختياري)',
    confRcv:'تأكيد الاستلام', confDisp:'تأكيد الصرف', confSend:'تأكيد الإرسال', confRet:'قبول المرتجع',
    itemName:'اسم الصنف', itemCode:'الكود', price:'السعر (BD)', openStock:'المخزون الافتتاحي', minAlert:'الحد الأدنى',
    addWarehouse:'إضافة للمستودع', mainWH:'المستودع', dispatched:'مصروف',
    supplier:'المورد', openEntry:'رصيد افتتاحي',
    scanTitle:'ماسح الباركود', scanSub:'امسح بالكاميرا أو اكتب الكود',
    scanInput:'اكتب اسم الصنف أو الكود...', searchItem:'بحث',
    itemNotFound:'الصنف غير موجود',
    noStock:'لا يوجد مخزون كافٍ',
    reports2:'التقارير', daily:'ملخص يومي', bySales:'حسب المندوب', fullLog:'السجل الكامل', exportCSV:'تصدير CSV',
    date:'التاريخ', totalIn:'إجمالي الوارد', totalOut:'إجمالي الصادر', transfers:'التحويلات', returns:'المرتجعات',
    salesman:'المندوب', totalReceived:'المستلم', totalReturned:'المُرجَع', balance:'الرصيد',
    available:'متاح', units2:'وحدة', dataLive:'البيانات محفوظة في السحابة',
    searchSKU:'ابحث عن صنف...', searchSalesman:'ابحث عن مندوب...',
    tapToScan:'اضغط لفتح الكاميرا', orType:'أو اكتب أدناه',
    scanHint:'وجه الكاميرا نحو باركود المنتج',
    insuffStock:'مخزون غير كافٍ', selectItemFirst:'اختر صنفاً أولاً',
    transferNote:'يخصم من المستودع ويُسجَّل باسم المندوب',
    returnNote:'يُضاف المخزون للمستودع من المندوب',
    step1:'الخطوة ١ — اختر الصنف', step2:'الخطوة ٢ — اختر المندوب', step3:'الخطوة ٣ — الكمية',
  }
}

const SHELVES = {'A-01':'Cables — USB-C / Lightning / Micro','A-02':'Cables — AUX / Multi','B-01':'Wall Chargers — Standard','B-02':'Wall Chargers — GaN / High Watt','C-01':'Car Chargers','C-02':'Power Banks — Small','C-03':'Power Banks — Large','D-01':'Earphones — Wired','D-02':'TWS / Bluetooth Airpods','D-03':'Neckbands / Headphones / Speakers','E-01':'Phone Holders','E-02':'Display Stands','F-01':'Wireless Chargers / Misc'}

const BARCODES = {'X01':'6971952430007','X02-M':'6971952430014','X02-L':'6971952430021','X02-C':'6971952430038','X03-M':'6971952430045','X03-L':'6971952430052','X05-C':'6971952430069','X05-L':'6971952430076','X13-L':'6971952430083','X13-C':'6971952430090','X15':'6971952430106','X19':'6971952430113','X21':'6971952430120','X22-C':'6971952430137','X22-L':'6971952430144','X23':'6971952430151','X25-UL':'6971952430168','X25-UC':'6971952430175','X25-CL':'6971952430182','X25-CC':'6971952430199','L11':'6971952430205','L12-FC':'6971952430212','L12-MC':'6971952430229','L12-ML':'6971952430236','L12-FL':'6971952430243','W01':'6971952430250','UK03':'6971952430267','UK03-L':'6971952430274','UK04':'6971952430281','UK04-L':'6971952430298','UK07':'6971952430304','UK08':'6971952430311','UK09':'6971952430328','UK09-L':'6971952430335','UK09-C':'6971952430342','UK11':'6971952430359','UK11-C':'6971952430366','UK11-L':'6971952430373','UK12':'6971952430380','UK12-C':'6971952430397','UK12-L':'6971952430403','UK15':'6971952430410','UK16':'6971952430427','UK17':'6971952430434','UK17-L':'6971952430441','UK18':'6971952430458','UK19':'6971952430465','UK20':'6971952430472','M04':'6971952430489','M07':'6971952430496','M09':'6971952430502','M11':'6971952430519','M15':'6971952430526','M16':'6971952430533','M17':'6971952430540','M18':'6971952430557','M19':'6971952430564','M20':'6971952430571','M21':'6971952430588','T02':'6971952430595','T03':'6971952430601','T06':'6971952430618','T08':'6971952430625','T10':'6971952430632','T11':'6971952430649','T12':'6971952430656','T16':'6971952430663','BE01':'6971952430670','BE02':'6971952430687','BE04':'6971952430694','BE05':'6971952430700','BE06':'6971952430717','C01':'6971952430724','C02':'6971952430731','C03':'6971952430748','C07':'6971952430755','C12':'6971952430762','C13':'6971952430779','C14':'6971952430786','C15-CL':'6971952430793','C17-CC':'6971952430809','C18':'6971952430816','F04':'6971952430823','F06':'6971952430830','F07':'6971952430847','F10':'6971952430854','F12':'6971952430861','F13':'6971952430878','F14':'6971952430885','F15':'6971952430892','F16':'6971952430908','F17':'6971952430915','F19':'6971952430922','F20':'6971952430939','F23':'6971952430946','F24':'6971952430953','F25':'6971952430960','F29A':'6971952430977','F29B':'6971952430984','F30':'6971952430991','G176-1':'6971952431004','GN-08C':'6971952431011','K105':'6971952431028','BS06':'6971952431035','BS07':'6971952431042','BS08':'6971952431059','H08':'6971952431066','H09':'6971952431073','UK05':'6971952431080','TB-D6':'6971952433649','TB-D7':'6971952433656','TB-D8':'6971952433663','TB-D9':'6971952433670'}

const gE = n => { const l=n.toLowerCase(); if(l.includes('airpod')||l.includes('aipord')||l.includes('tws'))return'🎧'; if(l.includes('neckband')||l.includes('headphone'))return'🎧'; if(l.includes('speaker'))return'🔊'; if(l.includes('in-ear')||/^m\d/.test(l))return'🎵'; if(/^f\d/.test(l)||l.includes('power bank')||l.includes('k105')||l.includes('g176')||l.includes('gn-'))return'🔋'; if(l.includes('wireless charger')||l.includes('w01'))return'🔌'; if(l.includes('car charger')||/^c\d/.test(l))return'🚗'; if(/^uk/.test(l)||l.includes('charger'))return'⚡'; if(l.includes('aux'))return'🎵'; if(l.includes('cable')||/^x\d/.test(l)||/^p\d/.test(l)||/^l1/.test(l))return'🔌'; if(l.includes('holder'))return'📱'; if(l.includes('display')||l.includes('cardboard'))return'🗂️'; return'📦' }
const fBD = v => 'BD '+parseFloat(v||0).toFixed(3)
const fD = () => new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})
const fDT = ts => { const d=ts?new Date(ts):new Date(); return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})+' '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) }

function YQLogo({size=32}){return(<div style={{width:size,height:size,borderRadius:size*0.25,background:'linear-gradient(135deg,#7b3fc4,#9b4edf)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.38,fontWeight:900,color:'#fff',letterSpacing:-1,flexShrink:0}}>yq?</div>)}

function SearchDropdown({items,value,onChange,onSelect,placeholder,showStock=false}){
  const[open,setOpen]=useState(false);const[q,setQ]=useState('');const ref=useRef()
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[])
  useEffect(()=>{if(value)setQ(value.name);else setQ('')},[value])
  const filtered=useMemo(()=>{if(!q||(value&&q===value.name))return items.slice(0,25);return items.filter(i=>i.name.toLowerCase().includes(q.toLowerCase())||i.code.toLowerCase().includes(q.toLowerCase())).slice(0,25)},[q,items,value])
  return(
    <div ref={ref} style={{position:'relative'}}>
      <input className="inp" placeholder={placeholder} value={q}
        onChange={e=>{setQ(e.target.value);setOpen(true);onChange&&onChange(null)}}
        onFocus={()=>setOpen(true)} autoComplete="off"/>
      {open&&filtered.length>0&&(
        <div style={{position:'absolute',top:'100%',left:0,right:0,background:'var(--bg2)',border:'1px solid var(--bd2)',borderRadius:8,zIndex:300,maxHeight:200,overflowY:'auto',boxShadow:'0 4px 20px rgba(0,0,0,.35)',marginTop:2}}>
          {filtered.map(i=>(
            <div key={i.id} onClick={()=>{onSelect(i);setQ(i.name);setOpen(false)}}
              style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',cursor:'pointer',borderBottom:'1px solid var(--bd)'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
              onMouseLeave={e=>e.currentTarget.style.background=''}>
              <span style={{fontSize:15,flexShrink:0}}>{gE(i.name)}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{i.name}</div>
                <div style={{fontSize:10,color:'var(--tx3)',fontFamily:'JetBrains Mono'}}>{i.code}</div>
              </div>
              {showStock&&(<div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:i.qty===0?'var(--rd)':i.qty<=i.min_qty?'var(--am)':'var(--gr)'}}>{i.qty}</div>
                <div style={{fontSize:9,color:'var(--tx3)',textTransform:'uppercase'}}>{i.qty===0?'OUT':i.qty<=i.min_qty?'LOW':'units'}</div>
              </div>)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SalesmanDropdown({salesmen,value,onSelect,placeholder}){
  const[open,setOpen]=useState(false);const[q,setQ]=useState(value||'');const ref=useRef()
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[])
  useEffect(()=>{setQ(value||'')},[value])
  const filtered=salesmen.filter(s=>s.toLowerCase().includes(q.toLowerCase()))
  return(
    <div ref={ref} style={{position:'relative'}}>
      <input className="inp" placeholder={placeholder} value={q}
        onChange={e=>{setQ(e.target.value);setOpen(true);onSelect('')}}
        onFocus={()=>setOpen(true)} autoComplete="off"/>
      {open&&filtered.length>0&&(
        <div style={{position:'absolute',top:'100%',left:0,right:0,background:'var(--bg2)',border:'1px solid var(--bd2)',borderRadius:8,zIndex:300,maxHeight:180,overflowY:'auto',boxShadow:'0 4px 20px rgba(0,0,0,.35)',marginTop:2}}>
          {filtered.map(s=>(
            <div key={s} onClick={()=>{onSelect(s);setQ(s);setOpen(false)}}
              style={{padding:'10px 12px',cursor:'pointer',fontSize:13,fontWeight:500,borderBottom:'1px solid var(--bd)'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
              onMouseLeave={e=>e.currentTarget.style.background=''}>
              👤 {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Home(){
  const[lang,setLang]=useState('en');const[theme,setTheme]=useState('light')
  const[loggedIn,setLoggedIn]=useState(false);const[tab,setTab]=useState('home')
  const[items,setItems]=useState([]);const[logs,setLogs]=useState([]);const[salesmen,setSalesmen]=useState([])
  const[modal,setModal]=useState(null);const[sel,setSel]=useState(null)
  const[search,setSearch]=useState('');const[toast,setToast]=useState(null);const[loading,setLoading]=useState(true)
  const t=T[lang]

  useEffect(()=>{document.body.className=theme+(lang==='ar'?' ar':'')},[theme,lang])
  useEffect(()=>{if(loggedIn)loadData()},[loggedIn])

  const loadData=async()=>{
    setLoading(true)
    const[{data:iD},{data:lD},{data:sD}]=await Promise.all([
      supabase.from('items').select('*').order('name'),
      supabase.from('logs').select('*').order('created_at',{ascending:false}).limit(300),
      supabase.from('salesmen').select('*').order('name'),
    ])
    if(iD)setItems(iD);if(lD)setLogs(lD);if(sD)setSalesmen(sD.map(s=>s.name))
    setLoading(false)
  }

  const showToast=(msg,c='gr')=>{setToast({msg,c});setTimeout(()=>setToast(null),2500)}
  const close=()=>{setModal(null);setSel(null)}

  const addLog=async(type,item,qty,from,to,note='')=>{
    const{data}=await supabase.from('logs').insert({type,item_code:item.code,item_name:item.name,qty:parseInt(qty),from_loc:from,to_loc:to,note}).select().single()
    if(data)setLogs(p=>[data,...p])
  }

  const doIn=async(id,qty,shelf,note)=>{const q=parseInt(qty)||0;if(!q)return;const it=items.find(i=>i.id===id);const nq=it.qty+q;await supabase.from('items').update({qty:nq,shelf:shelf||it.shelf}).eq('id',id);setItems(items.map(i=>i.id===id?{...i,qty:nq,shelf:shelf||i.shelf}:i));await addLog('in',it,q,t.supplier,shelf||it.shelf,note);showToast('+'+q+' '+t.units2);close()}
  const doOut=async(id,qty,note)=>{const q=parseInt(qty)||0;if(!q)return;const it=items.find(i=>i.id===id);const nq=Math.max(0,it.qty-q);await supabase.from('items').update({qty:nq}).eq('id',id);setItems(items.map(i=>i.id===id?{...i,qty:nq}:i));await addLog('out',it,q,it.shelf,t.dispatched,note);showToast('-'+q+' '+t.units2,'rd');close()}
  const doTransfer=async(id,qty,to,note)=>{const q=parseInt(qty)||0;if(!q||!to)return;const it=items.find(i=>i.id===id);if(it.qty<q){showToast(t.insuffStock,'rd');return}const nq=it.qty-q;await supabase.from('items').update({qty:nq}).eq('id',id);setItems(items.map(i=>i.id===id?{...i,qty:nq}:i));await addLog('transfer',it,q,t.mainWH,to,note);showToast('→ '+to,'tl');close()}
  const doReturn=async(id,qty,from,note)=>{const q=parseInt(qty)||0;if(!q||!from)return;const it=items.find(i=>i.id===id);const nq=it.qty+q;await supabase.from('items').update({qty:nq}).eq('id',id);setItems(items.map(i=>i.id===id?{...i,qty:nq}:i));await addLog('return',it,q,from,t.mainWH,note);showToast('↩ '+q+' '+t.units2,'pu');close()}

  const addItem=async(d)=>{const{data}=await supabase.from('items').insert({code:d.code,name:d.name,rate:parseFloat(d.rate)||0,qty:parseInt(d.qty)||0,min_qty:parseInt(d.minQty)||5,shelf:d.shelf||'A-01'}).select().single();if(data){setItems(p=>[data,...p]);if(data.qty>0)await addLog('in',data,data.qty,t.openEntry,data.shelf,t.openEntry)}showToast('Item added ✓');close()}
  const addSalesman=async(name)=>{const n=name.trim();if(!n)return;const{error}=await supabase.from('salesmen').insert({name:n});if(!error){setSalesmen(p=>[...p,n].sort());showToast(n+' added')}else showToast('Already exists','am')}
  const removeSalesman=async(name)=>{await supabase.from('salesmen').delete().eq('name',name);setSalesmen(p=>p.filter(s=>s!==name))}
  const updatePassword=async(np)=>{await supabase.from('settings').update({value:np}).eq('key','password');showToast(t.updatePwd+' ✓')}
  const checkPassword=async(pwd)=>{const{data}=await supabase.from('settings').select('value').eq('key','password').single();return data&&data.value===pwd}

  const low=items.filter(i=>i.qty>0&&i.qty<=i.min_qty)
  const filtered=useMemo(()=>items.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||i.code.toLowerCase().includes(search.toLowerCase())),[items,search])
  const tc={gr:theme==='dark'?'#00e5a0':'#0a7c4e',rd:theme==='dark'?'#ff4f4f':'#c0392b',tl:theme==='dark'?'#00d4c8':'#0a7a72',pu:theme==='dark'?'#a78bfa':'#5b3fa6',am:theme==='dark'?'#ffc14d':'#a05c00'}

  if(!loggedIn)return <LoginScreen t={t} lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} onLogin={async(pwd)=>{const ok=await checkPassword(pwd);if(ok)setLoggedIn(true);else showToast(t.wrongPwd,'rd')}}/>

  return(<>
    <Head><title>YQ Warehouse</title><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/><meta name="theme-color" content="#0a0d14"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-title" content="YQ Warehouse"/></Head>
    <div className="app">
      {toast&&<div style={{position:'fixed',top:14,left:'50%',transform:'translateX(-50%)',background:tc[toast.c]||tc.gr,color:theme==='dark'?'#000':'#fff',padding:'8px 18px',borderRadius:22,fontSize:13,fontWeight:700,zIndex:999,whiteSpace:'nowrap',boxShadow:'0 3px 12px rgba(0,0,0,.25)'}}>{toast.msg}</div>}
      <div className="topbar">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <YQLogo size={34}/>
          <div style={{lineHeight:1.2}}><div style={{fontSize:13,fontWeight:700}}>YQ Warehouse</div><div style={{fontSize:10,color:'var(--tx3)'}}>Mobile Accessories</div></div>
        </div>
        <div style={{display:'flex',gap:4}}>
          <button className={`ltb${lang==='en'?' on':''}`} onClick={()=>setLang('en')}>EN</button>
          <button className={`ltb${lang==='ar'?' on':''}`} onClick={()=>setLang('ar')}>عر</button>
          <button className={`ttb${theme==='light'?' on':''}`} onClick={()=>setTheme('light')}>☀️</button>
          <button className={`ttb${theme==='dark'?' on':''}`} onClick={()=>setTheme('dark')}>🌙</button>
        </div>
      </div>
      {loading?<div className="loading"><div className="spinner"/>{t.loading}</div>:<>
        {tab==='home'&&<HomeTab t={t} items={items} logs={logs} low={low} setTab={setTab} setModal={setModal} onLogout={()=>setLoggedIn(false)} theme={theme}/>}
        {tab==='stock'&&<StockTab t={t} items={filtered} search={search} setSearch={setSearch} setSel={setSel} setModal={setModal}/>}
        {tab==='scan'&&<ScanTab t={t} items={items} setSel={setSel} setModal={setModal} showToast={showToast}/>}
        {tab==='transfer'&&<TransferTab t={t} items={items} salesmen={salesmen} doTransfer={doTransfer} doReturn={doReturn} showToast={showToast}/>}
        {tab==='reports'&&<ReportsTab t={t} logs={logs} salesmen={salesmen}/>}
        {tab==='settings'&&<SettingsTab t={t} theme={theme} salesmen={salesmen} onAddSalesman={addSalesman} onRemoveSalesman={removeSalesman} onUpdatePassword={updatePassword} onCheckPassword={checkPassword} onLogout={()=>setLoggedIn(false)} showToast={showToast}/>}
      </>}
      <nav className="nav">
        {[[t.home,'🏠','home'],[t.stock,'📦','stock'],[t.scan,'📷','scan'],[t.transfer,'🚚','transfer'],[t.reports,'📊','reports'],[t.settings,'⚙️','settings']].map(([lb,ic,id])=>(
          <button key={id} className={`nt${tab===id?' on':''}`} onClick={()=>setTab(id)}>
            <span className="ni">{ic}</span><span>{lb}</span><div className="nd"/>
          </button>
        ))}
      </nav>
      {modal==='menu'&&sel&&<MenuModal t={t} item={sel} onClose={close} onIn={()=>setModal('in')} onOut={()=>setModal('out')} onTransfer={()=>setModal('transfer')} onReturn={()=>setModal('return')}/>}
      {modal==='in'&&sel&&<InModal t={t} item={sel} onClose={close} onSubmit={doIn} shelves={Object.keys(SHELVES)}/>}
      {modal==='out'&&sel&&<OutModal t={t} item={sel} onClose={close} onSubmit={doOut}/>}
      {modal==='transfer'&&sel&&<TransModal t={t} item={sel} salesmen={salesmen} onClose={close} onSubmit={doTransfer}/>}
      {modal==='return'&&sel&&<RetModal t={t} item={sel} salesmen={salesmen} onClose={close} onSubmit={doReturn}/>}
      {modal==='add'&&<AddModal t={t} onClose={close} onSubmit={addItem} shelves={Object.keys(SHELVES)}/>}
    </div>
  </>)
}

function LoginScreen({t,lang,theme,setLang,setTheme,onLogin}){
  const[v,setV]=useState('');const[err,setErr]=useState(false);const[show,setShow]=useState(false);const[busy,setBusy]=useState(false)
  const sub=async()=>{if(!v.trim())return;setBusy(true);await onLogin(v);setErr(true);setV('');setBusy(false)}
  return(<div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:22,background:'var(--bg)',direction:lang==='ar'?'rtl':'ltr'}}>
    <div style={{display:'flex',gap:6,marginBottom:28,justifyContent:'center',flexWrap:'wrap'}}>
      {['en','ar'].map(l=><button key={l} className={`ltb${lang===l?' on':''}`} onClick={()=>setLang(l)}>{l==='en'?'EN':'عربي'}</button>)}
      <div style={{width:1,background:'var(--bd)',margin:'0 4px'}}/>
      {['light','dark'].map(th=><button key={th} className={`ttb${theme===th?' on':''}`} onClick={()=>setTheme(th)}>{th==='light'?'☀️':'🌙'}</button>)}
    </div>
    <YQLogo size={64}/>
    <div style={{fontSize:22,fontWeight:700,margin:'12px 0 2px',textAlign:'center'}}>YQ Warehouse</div>
    <div style={{fontSize:11,color:'var(--tx3)',marginBottom:28,textTransform:'uppercase',letterSpacing:'1px',textAlign:'center'}}>{t.sub}</div>
    <div style={{width:'100%',maxWidth:310}}>
      <div className="fld"><label>{t.pwd}</label>
        <div style={{position:'relative'}}>
          <input className="inp" type={show?'text':'password'} placeholder={t.enterPwd} value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')sub()}} style={{paddingRight:44}}/>
          <button onClick={()=>setShow(s=>!s)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'transparent',fontSize:15,color:'var(--tx3)',padding:4}}>{show?'🙈':'👁️'}</button>
        </div>
      </div>
      {err&&<div style={{fontSize:12,color:'var(--rd)',marginBottom:9,textAlign:'center'}}>{t.wrongPwd}</div>}
      <button className="btn btn-gr btn-full btn-lg" onClick={sub} disabled={busy} style={{color:theme==='dark'?'#000':'#fff',opacity:busy?.7:1}}>{busy?t.loading:t.unlock}</button>
      <div style={{marginTop:12,fontSize:11,color:'var(--tx3)',textAlign:'center',lineHeight:1.6}}>☁️ {t.dataLive}</div>
    </div>
  </div>)
}

function HomeTab({t,items,logs,low,setTab,setModal,onLogout,theme}){
  const total=items.reduce((s,i)=>s+i.qty,0)
  const today=fD()
  const tl=logs.filter(l=>new Date(l.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})===today)
  const tIn=tl.filter(l=>l.type==='in').reduce((s,l)=>s+l.qty,0)
  const tOut=tl.filter(l=>l.type==='out').reduce((s,l)=>s+l.qty,0)
  const val=items.reduce((s,i)=>s+i.qty*(i.rate||0),0)
  return(<div className="scr">
    <div className="hdr">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1>🏪 {t.app}</h1><p>{t.sub} · {fD()}</p></div>
        <button onClick={onLogout} style={{background:'var(--bg3)',border:'1px solid var(--bd)',borderRadius:6,padding:'5px 9px',fontSize:11,color:'var(--tx2)',fontWeight:600}}>{t.lock}</button>
      </div>
    </div>
    {low.length>0&&<div style={{padding:'8px 15px 0'}}>{low.slice(0,3).map(i=><div key={i.id} className="alrt">⚠️ <span style={{fontSize:12,color:'var(--am)',flex:1}}><b>{i.name}</b> — only <b>{i.qty}</b> left</span></div>)}</div>}
    <div className="sg">
      <div className="st"><div className="sv" style={{color:'var(--gr)'}}>{items.length}</div><div className="sl">{t.skus}</div></div>
      <div className="st"><div className="sv">{total.toLocaleString()}</div><div className="sl">{t.units}</div></div>
      <div className="st"><div className="sv" style={{color:'var(--gr)'}}>+{tIn}</div><div className="sl">{t.inToday}</div></div>
      <div className="st"><div className="sv" style={{color:'var(--rd)'}}>-{tOut}</div><div className="sl">{t.outToday}</div></div>
    </div>
    <div style={{padding:'0 15px',marginBottom:9}}>
      <div className="inset" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:12,color:'var(--tx2)'}}>{t.stockVal}</span>
        <span style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:'var(--am)'}}>{fBD(val)}</span>
      </div>
    </div>
    <div style={{padding:'0 15px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:7}}>
      <button className="btn btn-gr btn-full" style={{color:theme==='dark'?'#000':'#fff'}} onClick={()=>setTab('stock')}>{t.updateStock}</button>
      <button className="btn btn-tl btn-full" onClick={()=>setTab('transfer')}>{t.sendReturn}</button>
    </div>
    <div style={{padding:'0 15px',marginBottom:7}}><button className="btn btn-out btn-full" onClick={()=>setModal('add')}>{t.addItem}</button></div>
    {logs.length>0&&<><div className="slbl">{t.recentActivity}</div><div style={{padding:'0 15px'}}><div className="card">{logs.slice(0,6).map(l=><LRow key={l.id} l={l} t={t}/>)}</div></div></>}
  </div>)
}

function LRow({l,t}){
  const c={in:'var(--gr)',out:'var(--rd)',transfer:'var(--tl)',return:'var(--pu)'}
  const s={in:'+',out:'-',transfer:'→',return:'↩'}
  return(<div style={{display:'flex',gap:9,alignItems:'flex-start',padding:'7px 0',borderBottom:'1px solid var(--bd)'}}>
    <div style={{width:7,height:7,borderRadius:'50%',background:c[l.type]||'var(--gr)',flexShrink:0,marginTop:4}}/>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.item_name}</div>
      <div style={{fontSize:10,color:'var(--tx3)',fontFamily:'JetBrains Mono',marginTop:1}}>{l.to_loc||l.from_loc||''} · {fDT(l.created_at).split(' ').slice(-1)[0]}</div>
    </div>
    <div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:c[l.type]||'var(--gr)',flexShrink:0}}>{(s[l.type]||'+')+l.qty}</div>
  </div>)
}

function StockTab({t,items,search,setSearch,setSel,setModal}){
  const[filter,setFilter]=useState('all')
  const shown=filter==='low'?items.filter(i=>i.qty>0&&i.qty<=i.min_qty):filter==='zero'?items.filter(i=>i.qty===0):items
  return(<div className="scr">
    <div className="hdr"><h1>{t.stock}</h1><p>{items.length} items</p></div>
    <div className="srch">
      <span>🔍</span><input placeholder={t.searchSKU} value={search} onChange={e=>setSearch(e.target.value)}/>
      {search&&<button onClick={()=>setSearch('')} style={{background:'transparent',color:'var(--tx3)',fontSize:16,cursor:'pointer'}}>✕</button>}
    </div>
    <div className="stabs">
      {[[t.allItems,'all'],[t.lowStock,'low'],[t.outOfStock,'zero']].map(([lb,k])=><button key={k} className={`stab${filter===k?' on':''}`} onClick={()=>setFilter(k)}>{lb}</button>)}
    </div>
    <div style={{padding:'4px 15px 0'}}>
      <button className="btn btn-out btn-sm" style={{marginBottom:7}} onClick={()=>setModal('add')}>{t.addItem}</button>
      {shown.length===0?<div className="empty">No items found</div>:<div className="card">
        {shown.map(i=><div key={i.id} className="row rowc" onClick={()=>{setSel(i);setModal('menu')}}>
          <div className="ava">{gE(i.name)}</div>
          <div style={{flex:1,minWidth:0}}><div className="iname">{i.name}</div><div className="isub">{i.code} · {fBD(i.rate)} · <span className="shelf-tag">{i.shelf}</span></div></div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:i.qty===0?'var(--tx3)':i.qty<=i.min_qty?'var(--rd)':'var(--gr)'}}>{i.qty}</div>
            <div style={{fontSize:9,textTransform:'uppercase',letterSpacing:'.4px',color:'var(--tx3)'}}>{i.qty===0?t.outOfStock:i.qty<=i.min_qty?t.lowStock:t.units2}</div>
          </div>
        </div>)}
      </div>}
    </div>
  </div>)
}

function ScanTab({t,items,setSel,setModal,showToast}){
  const[code,setCode]=useState('');const[result,setResult]=useState(null);const[notFound,setNotFound]=useState(false)
  const[scanning,setScanning]=useState(false);const videoRef=useRef();const streamRef=useRef()

  const stopCamera=()=>{if(streamRef.current){streamRef.current.getTracks().forEach(tr=>tr.stop());streamRef.current=null}setScanning(false)}
  useEffect(()=>()=>stopCamera(),[])

  const startCamera=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:720}}})
      streamRef.current=stream;if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play()}
      setScanning(true)
    }catch(e){showToast('Camera blocked — type code below','am')}
  }

  const doScan=val=>{
    const q=(val||code).trim();if(!q)return
    const bCode=Object.keys(BARCODES).find(k=>BARCODES[k]===q)
    const found=items.find(i=>i.code===q||i.code===bCode||i.code.toLowerCase()===q.toLowerCase()||i.name.toLowerCase().includes(q.toLowerCase()))
    stopCamera()
    if(found){setResult(found);setNotFound(false)}else{setResult(null);setNotFound(true)}
    setCode('')
  }

  return(<div className="scr">
    <div className="hdr"><h1>{t.scanTitle}</h1><p>{t.scanSub}</p></div>
    <div style={{padding:'12px 15px 0'}}>
      {!scanning?(
        <div className="scan-area" onClick={startCamera}>
          <div style={{fontSize:44,marginBottom:8}}>📷</div>
          <div style={{fontSize:13,fontWeight:600,color:'var(--tx2)'}}>{t.tapToScan}</div>
          <div style={{fontSize:11,color:'var(--tx3)',marginTop:4}}>{t.scanHint}</div>
        </div>
      ):(
        <div style={{position:'relative',borderRadius:12,overflow:'hidden',marginBottom:12,background:'#000'}}>
          <video ref={videoRef} style={{width:'100%',height:220,objectFit:'cover'}} playsInline muted/>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:220,height:80,border:'2px solid var(--gr)',borderRadius:8}}/>
          <button onClick={stopCamera} style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,.6)',color:'#fff',borderRadius:20,padding:'4px 10px',fontSize:12,cursor:'pointer'}}>✕ Close</button>
          <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',fontSize:11,color:'rgba(255,255,255,.8)'}}>Camera active</div>
        </div>
      )}
      <div style={{fontSize:12,color:'var(--tx3)',textAlign:'center',marginBottom:7}}>{t.orType}</div>
      <div style={{display:'flex',gap:7,marginBottom:12}}>
        <input className="inp" placeholder={t.scanInput} value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')doScan()}} style={{flex:1}}/>
        <button className="btn btn-gr" style={{color:'var(--bg)',whiteSpace:'nowrap'}} onClick={()=>doScan()}>{t.searchItem}</button>
      </div>
      {notFound&&<div style={{padding:'12px',background:'var(--rdb)',border:'1px solid var(--rd)',borderRadius:8,textAlign:'center',fontSize:13,color:'var(--rd)',fontWeight:500,marginBottom:10}}>{t.itemNotFound}</div>}
      {result&&<div className="card">
        <div style={{display:'flex',gap:11,alignItems:'center',marginBottom:12}}>
          <div className="ava" style={{width:48,height:48,fontSize:22}}>{gE(result.name)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,lineHeight:1.4,whiteSpace:'normal'}}>{result.name}</div>
            <div className="isub">{result.code} · {fBD(result.rate)}</div>
            {BARCODES[result.code]&&<div style={{fontSize:10,color:'var(--tx3)',fontFamily:'JetBrains Mono',marginTop:2}}>Barcode: {BARCODES[result.code]}</div>}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:12}}>
          <div className="inset" style={{textAlign:'center'}}>
            <div style={{fontSize:22,fontWeight:700,fontFamily:'JetBrains Mono',color:result.qty===0?'var(--tx3)':result.qty<=result.min_qty?'var(--rd)':'var(--gr)'}}>{result.qty}</div>
            <div style={{fontSize:10,color:'var(--tx3)',textTransform:'uppercase'}}>{t.units2}</div>
          </div>
          <div className="inset" style={{textAlign:'center'}}>
            <div style={{fontSize:12,fontWeight:600,color:'var(--bl)',fontFamily:'JetBrains Mono'}}>{result.shelf}</div>
            <div style={{fontSize:10,color:'var(--tx3)',textTransform:'uppercase'}}>{t.shelf}</div>
          </div>
          <div className="inset" style={{textAlign:'center'}}>
            <div style={{fontSize:12,fontWeight:600,color:'var(--am)'}}>{fBD(result.rate)}</div>
            <div style={{fontSize:10,color:'var(--tx3)',textTransform:'uppercase'}}>Rate</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
          <button className="btn btn-gr btn-full" style={{color:'var(--bg)'}} onClick={()=>{setSel(result);setModal('menu')}}>{t.updateStock}</button>
          <button className="btn btn-out btn-full" onClick={()=>{setResult(null);setCode('')}}>Clear</button>
        </div>
      </div>}
    </div>
  </div>)
}

function TransferTab({t,items,salesmen,doTransfer,doReturn,showToast}){
  const[mode,setMode]=useState('transfer')
  const[selItem,setSelItem]=useState(null);const[selSales,setSelSales]=useState('')
  const[qty,setQty]=useState('');const[note,setNote]=useState('');const[busy,setBusy]=useState(false)

  useEffect(()=>{setSelItem(null);setSelSales('');setQty('');setNote('')},[mode])

  const canSubmit=selItem&&selSales&&qty&&parseInt(qty)>0&&(mode==='return'||selItem.qty>=parseInt(qty))

  const submit=async()=>{
    const q=parseInt(qty)||0
    if(!q){showToast('Enter quantity','am');return}
    if(!selSales){showToast('Select salesman','am');return}
    if(!selItem){showToast(t.selectItemFirst,'am');return}
    if(mode==='transfer'&&selItem.qty<q){showToast(t.insuffStock+' ('+selItem.qty+' available)','rd');return}
    setBusy(true)
    if(mode==='transfer')await doTransfer(selItem.id,q,selSales,note)
    else await doReturn(selItem.id,q,selSales,note)
    setSelItem(null);setSelSales('');setQty('');setNote('');setBusy(false)
  }

  return(<div className="scr">
    <div className="hdr"><h1>{t.sendReturn}</h1></div>
    <div style={{padding:'10px 15px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:12}}>
      <button className={`btn btn-full ${mode==='transfer'?'btn-tl':'btn-out'}`} onClick={()=>setMode('transfer')}>{t.sendTo}</button>
      <button className={`btn btn-full ${mode==='return'?'btn-pu':'btn-out'}`} onClick={()=>setMode('return')}>{t.receiveRet}</button>
    </div>
    <div style={{padding:'0 15px 10px'}}>
      <div className="inset" style={{fontSize:12,color:'var(--tx2)',lineHeight:1.6}}>{mode==='transfer'?'🚚 '+t.transferNote:'↩ '+t.returnNote}</div>
    </div>
    <div style={{padding:'0 15px'}}>
      {/* Step 1 */}
      <div className="card">
        <div style={{fontSize:11,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:8}}>{t.step1}</div>
        <SearchDropdown items={items} value={selItem} onChange={setSelItem} onSelect={i=>setSelItem(i)} placeholder={t.searchSKU} showStock={true}/>
        {selItem&&<div style={{marginTop:8,padding:'10px 12px',background:'var(--bg3)',borderRadius:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{minWidth:0,flex:1}}>
            <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selItem.name}</div>
            <div style={{fontSize:11,color:'var(--tx3)',fontFamily:'JetBrains Mono'}}>{selItem.code}</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0,marginLeft:8}}>
            <div style={{fontFamily:'JetBrains Mono',fontSize:20,fontWeight:700,color:selItem.qty===0?'var(--rd)':selItem.qty<=selItem.min_qty?'var(--am)':'var(--gr)'}}>{selItem.qty}</div>
            <div style={{fontSize:9,color:'var(--tx3)',textTransform:'uppercase'}}>{selItem.qty===0?'OUT OF STOCK':t.available}</div>
          </div>
        </div>}
        {selItem&&selItem.qty===0&&mode==='transfer'&&<div style={{marginTop:6,padding:'8px 10px',background:'var(--rdb)',border:'1px solid var(--rd)',borderRadius:6,fontSize:12,color:'var(--rd)',fontWeight:600,textAlign:'center'}}>⛔ {t.noStock}</div>}
      </div>

      {/* Step 2 */}
      <div className="card">
        <div style={{fontSize:11,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:8}}>{t.step2}</div>
        <SalesmanDropdown salesmen={salesmen} value={selSales} onSelect={setSelSales} placeholder={t.searchSalesman}/>
        {selSales&&<div style={{marginTop:6,display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:'var(--bg3)',borderRadius:6}}>
          <span>👤</span><span style={{fontSize:13,fontWeight:600}}>{selSales}</span>
        </div>}
      </div>

      {/* Step 3 */}
      <div className="card">
        <div style={{fontSize:11,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:8}}>{t.step3}</div>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:8,marginBottom:8}}>
          <input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} min={1} max={mode==='transfer'&&selItem?selItem.qty:undefined} inputMode="numeric"/>
          <div style={{background:'var(--bg3)',borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:4}}>
            <div style={{fontFamily:'JetBrains Mono',fontSize:18,fontWeight:700,color:selItem?(selItem.qty===0?'var(--rd)':selItem.qty<=selItem.min_qty?'var(--am)':'var(--gr)'):'var(--tx3)'}}>{selItem?selItem.qty:'—'}</div>
            <div style={{fontSize:9,color:'var(--tx3)',textTransform:'uppercase'}}>{t.available}</div>
          </div>
        </div>
        {selItem&&qty&&mode==='transfer'&&<div style={{fontSize:12,color:'var(--tx2)',textAlign:'center',marginBottom:8}}>
          {t.remaining}: <b style={{color:selItem.qty-parseInt(qty||0)<0?'var(--rd)':'var(--gr)'}}>{Math.max(0,selItem.qty-(parseInt(qty)||0))} {t.units2}</b>
          {parseInt(qty||0)>selItem.qty&&<span style={{color:'var(--rd)',marginLeft:6}}>⚠ Exceeds stock</span>}
        </div>}
        <input className="inp" placeholder={t.note} value={note} onChange={e=>setNote(e.target.value)}/>
      </div>

      <button className={`btn btn-full btn-lg ${mode==='transfer'?'btn-tl':'btn-pu'}`}
        onClick={submit} disabled={busy||!canSubmit} style={{opacity:canSubmit?1:.4,marginBottom:16}}>
        {busy?t.loading:mode==='transfer'?`${t.confSend}${selItem&&qty?' — '+qty+' units':''}${selSales?' → '+selSales.split(' ')[0]:''}`:
          `${t.confRet}${selItem&&qty?' — '+qty+' units':''}`}
      </button>
    </div>
  </div>)
}

function ReportsTab({t,logs,salesmen}){
  const[view,setView]=useState('daily');const[ls,setLs]=useState('')
  const dailyMap={}
  logs.forEach(l=>{const d=new Date(l.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'});if(!dailyMap[d])dailyMap[d]={date:d,in:0,out:0,transfer:0,return:0};dailyMap[d][l.type]=(dailyMap[d][l.type]||0)+l.qty})
  const daily=Object.values(dailyMap).sort((a,b)=>b.date.localeCompare(a.date))
  const salesMap={};salesmen.forEach(s=>salesMap[s]={name:s,received:0,returned:0})
  logs.forEach(l=>{if(l.type==='transfer'&&salesMap[l.to_loc])salesMap[l.to_loc].received+=l.qty;if(l.type==='return'&&salesMap[l.from_loc])salesMap[l.from_loc].returned+=l.qty})
  const salesData=Object.values(salesMap).filter(s=>s.received>0||s.returned>0).sort((a,b)=>b.received-a.received)
  const filteredLogs=logs.filter(l=>!ls||l.item_name.toLowerCase().includes(ls.toLowerCase())||l.item_code.toLowerCase().includes(ls.toLowerCase())||(l.to_loc||'').toLowerCase().includes(ls.toLowerCase())||(l.from_loc||'').toLowerCase().includes(ls.toLowerCase()))
  const exportCSV=()=>{const rows=[['Date','Time','Type','Item','Code','Qty','From','To','Note'],...logs.map(l=>{const d=new Date(l.created_at);return[d.toLocaleDateString('en-GB'),d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),l.type,l.item_name,l.item_code,l.qty,l.from_loc||'',l.to_loc||'',l.note||'']})];const csv=rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='yq_warehouse.csv';a.click()}
  const tc={in:'var(--gr)',out:'var(--rd)',transfer:'var(--tl)',return:'var(--pu)'}
  const ts={in:'+',out:'-',transfer:'→',return:'↩'}
  const tb={in:'b-gr',out:'b-rd',transfer:'b-tl',return:'b-pu'}
  const tl2={in:t.stockIn,out:t.stockOut,transfer:t.transferL,return:t.returnL}
  return(<div className="scr">
    <div className="hdr">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h1>{t.reports2}</h1><p>{logs.length} {t.entries}</p></div>
        <button className="btn btn-bl btn-sm" onClick={exportCSV}>{t.exportCSV}</button>
      </div>
    </div>
    <div className="stabs">
      {[[t.daily,'daily'],[t.bySales,'sales'],[t.fullLog,'log']].map(([lb,k])=><button key={k} className={`stab${view===k?' on':''}`} onClick={()=>setView(k)}>{lb}</button>)}
    </div>
    {view==='daily'&&<div style={{padding:'4px 15px 0'}}>
      {daily.length===0?<div className="empty">No data yet.</div>:<div className="card">
        <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr 1fr 1fr 1fr',gap:4,padding:'6px 0 8px',borderBottom:'1px solid var(--bd)',marginBottom:4}}>
          {[t.date,'In','Out','Sent','Ret'].map(h=><div key={h} style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.4px',color:'var(--tx3)',textAlign:'center'}}>{h}</div>)}
        </div>
        {daily.map(d=><div key={d.date} style={{display:'grid',gridTemplateColumns:'1.2fr 1fr 1fr 1fr 1fr',gap:4,padding:'7px 0',borderBottom:'1px solid var(--bd)',alignItems:'center'}}>
          <div style={{fontSize:10,color:'var(--tx2)',fontFamily:'JetBrains Mono'}}>{d.date}</div>
          <div style={{fontSize:12,fontWeight:700,color:'var(--gr)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.in||'-'}</div>
          <div style={{fontSize:12,fontWeight:700,color:'var(--rd)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.out||'-'}</div>
          <div style={{fontSize:12,fontWeight:700,color:'var(--tl)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.transfer||'-'}</div>
          <div style={{fontSize:12,fontWeight:700,color:'var(--pu)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.return||'-'}</div>
        </div>)}
      </div>}
    </div>}
    {view==='sales'&&<div style={{padding:'4px 15px 0'}}>
      {salesData.length===0?<div className="empty">No transfers yet.</div>:salesData.map(s=><div key={s.name} className="card" style={{marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:14,fontWeight:700}}>👤 {s.name}</div>
          <div style={{display:'flex',gap:12}}>
            {[{v:s.received,c:'var(--tl)',l:'Sent'},{v:s.returned,c:'var(--pu)',l:'Ret.'},{v:s.received-s.returned,c:'var(--am)',l:'Bal.'}].map(({v,c,l})=><div key={l} style={{textAlign:'center'}}>
              <div style={{fontFamily:'JetBrains Mono',fontSize:16,fontWeight:700,color:c}}>{v}</div>
              <div style={{fontSize:9,color:'var(--tx3)',textTransform:'uppercase'}}>{l}</div>
            </div>)}
          </div>
        </div>
      </div>)}
    </div>}
    {view==='log'&&<div style={{padding:'4px 15px 0'}}>
      <div className="srch" style={{margin:'0 0 9px'}}>
        <span>🔍</span><input placeholder="Search..." value={ls} onChange={e=>setLs(e.target.value)}/>
        {ls&&<button onClick={()=>setLs('')} style={{background:'transparent',color:'var(--tx3)',fontSize:16,cursor:'pointer'}}>✕</button>}
      </div>
      {filteredLogs.length===0?<div className="empty">No entries found.</div>:filteredLogs.map(l=><div key={l.id} style={{padding:'9px 0',borderBottom:'1px solid var(--bd)'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:7,marginBottom:4}}>
          <div style={{flex:1,minWidth:0}}><div className="iname">{l.item_name}</div><div className="isub">{l.item_code}{l.note?' · '+l.note:''}</div></div>
          <div style={{fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:tc[l.type]||'var(--gr)',flexShrink:0}}>{(ts[l.type]||'+')+l.qty}</div>
        </div>
        <div style={{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}}>
          <span className={`badge ${tb[l.type]||'b-gr'}`}>{tl2[l.type]||l.type}</span>
          {l.from_loc&&l.to_loc&&<span style={{fontSize:11,color:'var(--tx3)',fontFamily:'JetBrains Mono'}}>{l.from_loc} → {l.to_loc}</span>}
          <span style={{fontSize:11,color:'var(--tx3)',marginLeft:'auto',fontFamily:'JetBrains Mono'}}>{fDT(l.created_at)}</span>
        </div>
      </div>)}
    </div>}
  </div>)
}

function SettingsTab({t,theme,salesmen,onAddSalesman,onRemoveSalesman,onUpdatePassword,onCheckPassword,onLogout,showToast}){
  const[op,setOp]=useState('');const[np,setNp]=useState('');const[cp,setCp]=useState('');const[show,setShow]=useState(false)
  const[ns,setNs]=useState('');const[sv,setSv]=useState(false)
  const chPwd=async()=>{const ok=await onCheckPassword(op);if(!ok){showToast(t.wrongPwd,'rd');return}if(np.length<4){showToast('Min 4 chars','rd');return}if(np!==cp){showToast('No match','rd');return}await onUpdatePassword(np);setOp('');setNp('');setCp('')}
  return(<div className="scr">
    <div className="hdr"><h1>{t.settings2}</h1></div>
    <div style={{padding:'0 15px'}}>
      <div className="card">
        <div style={{fontSize:13,fontWeight:700,color:'var(--gr)',marginBottom:10}}>{t.changePwd}</div>
        <div className="fld"><label>{t.currPwd}</label><input className="inp" type={show?'text':'password'} value={op} onChange={e=>setOp(e.target.value)} placeholder="••••••"/></div>
        <div className="fld"><label>{t.newPwd}</label><input className="inp" type={show?'text':'password'} value={np} onChange={e=>setNp(e.target.value)} placeholder="••••••"/></div>
        <div className="fld"><label>{t.confPwd}</label><input className="inp" type={show?'text':'password'} value={cp} onChange={e=>setCp(e.target.value)} placeholder="••••••"/></div>
        <label style={{display:'flex',gap:7,alignItems:'center',marginBottom:10,cursor:'pointer',fontSize:12,color:'var(--tx2)'}}><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>{t.showPwd}</label>
        <button className="btn btn-gr btn-full" style={{color:theme==='dark'?'#000':'#fff'}} onClick={chPwd}>{t.updatePwd}</button>
      </div>
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:700}}>{t.manageSalesmen} ({salesmen.length})</div>
          <button className="btn btn-out btn-sm" onClick={()=>setSv(v=>!v)}>{sv?'Hide':'Show'}</button>
        </div>
        {sv&&<>
          <div style={{display:'flex',gap:7,marginBottom:10}}>
            <input className="inp" placeholder={t.salesmanName} value={ns} onChange={e=>setNs(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){onAddSalesman(ns);setNs('')}}} style={{flex:1}}/>
            <button className="btn btn-gr" style={{color:theme==='dark'?'#000':'#fff'}} onClick={()=>{onAddSalesman(ns);setNs('')}}>+</button>
          </div>
          {salesmen.map(s=><div key={s} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid var(--bd)',fontSize:13}}>
            <span>👤 {s}</span>
            <button className="btn btn-rd btn-sm" onClick={()=>onRemoveSalesman(s)}>{t.remove}</button>
          </div>)}
        </>}
      </div>
      <div className="card">
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>ℹ {t.appInfo}</div>
        {[['App','YQ Warehouse'],['Version','1.0 Hosted'],['Items','170 VFAN SKUs'],['Database','Supabase Cloud'],['Hosting','Vercel (free)']].map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--bd)',fontSize:12}}><span style={{color:'var(--tx2)'}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>)}
      </div>
      <button className="btn btn-rd btn-full" style={{marginTop:4}} onClick={onLogout}>{t.lock}</button>
    </div>
  </div>)
}

function MenuModal({t,item,onClose,onIn,onOut,onTransfer,onReturn}){
  return(<div className="bkdp" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <div className="mh"/>
    <div style={{display:'flex',gap:11,alignItems:'flex-start',marginBottom:14,background:'var(--bg3)',borderRadius:8,padding:'11px'}}>
      <div className="ava" style={{width:46,height:46,fontSize:20,flexShrink:0}}>{gE(item.name)}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,lineHeight:1.3,whiteSpace:'normal'}}>{item.name}</div>
        <div className="isub">{item.code} · {fBD(item.rate)}</div>
        {BARCODES[item.code]&&<div style={{fontSize:10,color:'var(--tx3)',fontFamily:'JetBrains Mono',marginTop:2}}>{BARCODES[item.code]}</div>}
        <div style={{marginTop:5,display:'flex',gap:7,alignItems:'center'}}>
          <span style={{fontFamily:'JetBrains Mono',fontSize:15,fontWeight:700,color:item.qty===0?'var(--tx3)':item.qty<=item.min_qty?'var(--rd)':'var(--gr)'}}>{item.qty} {t.units2}</span>
          <span className="shelf-tag">{item.shelf}</span>
        </div>
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:7}}>
      <button className="btn btn-gr btn-full btn-lg" onClick={onIn}>📥 {t.recvSupplier}</button>
      <button className="btn btn-rd btn-full btn-lg" onClick={onOut}>📤 {t.dispatch}</button>
      <button className="btn btn-tl btn-full btn-lg" onClick={onTransfer}>{t.sendTo}</button>
      <button className="btn btn-pu btn-full btn-lg" onClick={onReturn}>{t.receiveRet}</button>
    </div>
  </div></div>)
}

function InModal({t,item,onClose,onSubmit,shelves}){
  const[qty,setQty]=useState('');const[shelf,setShelf]=useState(item.shelf);const[note,setNote]=useState('')
  return(<div className="bkdp" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <div className="mh"/><div className="mt">📥 {t.recvSupplier}</div>
    <div style={{padding:'9px 11px',background:'var(--grb)',border:'1px solid var(--grl)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--gr)',fontWeight:500}}>{item.name} · {t.curr}: <b>{item.qty} {t.units2}</b></div>
    <div className="fld"><label>{t.qty}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus inputMode="numeric"/></div>
    <div className="fld"><label>{t.shelf}</label><select className="inp" value={shelf} onChange={e=>setShelf(e.target.value)}>{shelves.map(s=><option key={s}>{s}</option>)}</select></div>
    <div className="fld"><label>{t.note}</label><input className="inp" placeholder="Invoice #..." value={note} onChange={e=>setNote(e.target.value)}/></div>
    {qty&&<div style={{textAlign:'center',fontSize:12,color:'var(--tx2)',marginBottom:10}}>{t.newTot}: <b style={{color:'var(--gr)'}}>{item.qty+(parseInt(qty)||0)} {t.units2}</b></div>}
    <button className="btn btn-gr btn-full btn-lg" style={{color:'var(--bg)'}} onClick={()=>{if(qty)onSubmit(item.id,qty,shelf,note)}}>{t.confRcv} +{qty||'0'}</button>
  </div></div>)
}

function OutModal({t,item,onClose,onSubmit}){
  const[qty,setQty]=useState('');const[note,setNote]=useState('')
  return(<div className="bkdp" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <div className="mh"/><div className="mt">📤 {t.dispatch}</div>
    <div style={{padding:'9px 11px',background:'var(--rdb)',border:'1px solid var(--rd)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--rd)',fontWeight:500}}>{item.name} · {t.available}: <b>{item.qty} {t.units2}</b></div>
    <div className="fld"><label>{t.qty}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus max={item.qty} inputMode="numeric"/></div>
    <div className="fld"><label>{t.note}</label><input className="inp" placeholder="..." value={note} onChange={e=>setNote(e.target.value)}/></div>
    {qty&&<div style={{textAlign:'center',fontSize:12,color:'var(--tx2)',marginBottom:10}}>{t.remaining}: <b style={{color:'var(--am)'}}>{Math.max(0,item.qty-(parseInt(qty)||0))} {t.units2}</b></div>}
    <button className="btn btn-rd btn-full btn-lg" onClick={()=>{if(qty)onSubmit(item.id,qty,note)}}>{t.confDisp} -{qty||'0'}</button>
  </div></div>)
}

function TransModal({t,item,salesmen,onClose,onSubmit}){
  const[qty,setQty]=useState('');const[to,setTo]=useState(salesmen[0]||'');const[note,setNote]=useState('')
  return(<div className="bkdp" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <div className="mh"/><div className="mt">{t.sendTo}</div>
    <div style={{padding:'9px 11px',background:'var(--tlb)',border:'1px solid var(--tl)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--tl)',fontWeight:500}}>{item.name} · <b>{item.qty} {t.units2}</b></div>
    <div className="fld"><label>{t.selSales}</label><SalesmanDropdown salesmen={salesmen} value={to} onSelect={setTo} placeholder={t.searchSalesman}/></div>
    <div className="fld"><label>{t.qty}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus max={item.qty} inputMode="numeric"/></div>
    <div className="fld"><label>{t.note}</label><input className="inp" placeholder="..." value={note} onChange={e=>setNote(e.target.value)}/></div>
    {qty&&to&&<div style={{textAlign:'center',fontSize:13,fontFamily:'JetBrains Mono',color:'var(--tl)',marginBottom:10}}>{t.mainWH} → {to}</div>}
    <button className="btn btn-tl btn-full btn-lg" onClick={()=>{if(qty&&to)onSubmit(item.id,qty,to,note)}}>{t.confSend} {qty||'0'} → {to.split(' ')[0]}</button>
  </div></div>)
}

function RetModal({t,item,salesmen,onClose,onSubmit}){
  const[qty,setQty]=useState('');const[from,setFrom]=useState(salesmen[0]||'');const[note,setNote]=useState('')
  return(<div className="bkdp" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <div className="mh"/><div className="mt">↩ {t.receiveRet}</div>
    <div style={{padding:'9px 11px',background:'var(--pub)',border:'1px solid var(--pu)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--pu)',fontWeight:500}}>{item.name} · {t.curr}: <b>{item.qty} {t.units2}</b></div>
    <div className="fld"><label>{t.retFrom}</label><SalesmanDropdown salesmen={salesmen} value={from} onSelect={setFrom} placeholder={t.searchSalesman}/></div>
    <div className="fld"><label>{t.qty}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus inputMode="numeric"/></div>
    <div className="fld"><label>{t.retReason}</label><input className="inp" placeholder="Unsold, wrong item, damaged..." value={note} onChange={e=>setNote(e.target.value)}/></div>
    {qty&&<div style={{textAlign:'center',fontSize:12,color:'var(--tx2)',marginBottom:10}}>{t.newTot}: <b style={{color:'var(--pu)'}}>{item.qty+(parseInt(qty)||0)} {t.units2}</b></div>}
    <button className="btn btn-pu btn-full btn-lg" onClick={()=>{if(qty&&from)onSubmit(item.id,qty,from,note)}}>{t.confRet} {qty||'0'}</button>
  </div></div>)
}

function AddModal({t,onClose,onSubmit,shelves}){
  const[f,setF]=useState({name:'',code:'',rate:'',qty:'',minQty:'5',shelf:'A-01'})
  const s=(k,v)=>setF(p=>({...p,[k]:v}))
  return(<div className="bkdp" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <div className="mh"/><div className="mt">{t.addItem}</div>
    <div className="fld"><label>{t.itemName}</label><input className="inp" placeholder="e.g. X31 Cable..." value={f.name} onChange={e=>s('name',e.target.value)}/></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
      <div className="fld"><label>{t.itemCode}</label><input className="inp" placeholder="X31" value={f.code} onChange={e=>s('code',e.target.value)}/></div>
      <div className="fld"><label>{t.price}</label><input className="inp" type="number" placeholder="0.000" value={f.rate} onChange={e=>s('rate',e.target.value)} step="0.001"/></div>
    </div>
    <div className="fld"><label>{t.shelf}</label><select className="inp" value={f.shelf} onChange={e=>s('shelf',e.target.value)}>{shelves.map(sh=><option key={sh}>{sh}</option>)}</select></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
      <div className="fld"><label>{t.openStock}</label><input className="inp" type="number" placeholder="0" value={f.qty} onChange={e=>s('qty',e.target.value)}/></div>
      <div className="fld"><label>{t.minAlert}</label><input className="inp" type="number" placeholder="5" value={f.minQty} onChange={e=>s('minQty',e.target.value)}/></div>
    </div>
    <button className="btn btn-gr btn-full btn-lg" style={{color:'var(--bg)'}} onClick={()=>{if(f.name&&f.code)onSubmit(f)}}>{t.addWarehouse}</button>
  </div></div>)
}
