import { useState, useEffect, useMemo, useCallback } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

const T = {
  en: {
    app:'Warehouse', sub:'Mobile Accessories', lock:'Lock 🔒', unlock:'Unlock →',
    pwd:'Password', enterPwd:'Enter password', wrongPwd:'Wrong password',
    home:'Home', stock:'Stock', scan:'Scan', transfer:'Transfer', reports:'Reports', settings:'Settings',
    skus:'Total SKUs', units:'Units', inToday:'In Today', outToday:'Out Today', stockVal:'Stock Value (BD)',
    updateStock:'📦 Update Stock', sendReturn:'🚚 Send / Return', addItem:'+ Add Item', recentActivity:'Recent Activity',
    lowStock:'Low Stock', outOfStock:'Out of Stock', allItems:'All',
    stockIn:'Stock In', stockOut:'Stock Out', transferL:'Transfer', returnL:'Return',
    sendTo:'🚚 Send to Salesman', receiveRet:'↩ Receive Return',
    shelfPlan:'Shelf Plan', tapShelf:'Tap to expand', itemTypes:'types', totalUnits:'units', emptyShelf:'Empty',
    movLog:'Movement Log', entries:'entries', searchLog:'Search...',
    all:'All', inL:'In', outL:'Out', tfL:'Transfers', retL:'Returns', clearAll:'Clear',
    settings2:'Settings', changePwd:'Change Password', currPwd:'Current Password',
    newPwd:'New Password', confPwd:'Confirm Password', showPwd:'Show', updatePwd:'Update Password',
    appInfo:'App Info', demoNote:'ℹ Hosted Version',
    recvSupplier:'📥 Receive from Supplier', dispatch:'📤 Dispatch / Sell',
    curr:'Current', newTot:'New total', remaining:'Remaining',
    qtyRcv:'Quantity', shelf:'Shelf', note:'Note (optional)',
    qtyDisp:'Quantity', selSales:'Select Salesman', qty:'Quantity',
    retFrom:'Salesman', retQty:'Quantity', retReason:'Reason (optional)',
    confRcv:'Confirm Receipt', confDisp:'Confirm Dispatch', confSend:'Confirm Send', confRet:'Accept Return',
    itemName:'Item Name', itemCode:'Code', price:'Price (BD)', openStock:'Opening Stock', minAlert:'Min Alert',
    addWarehouse:'Add to Warehouse', mainWH:'Warehouse', dispatched:'Dispatched', supplier:'Supplier', openEntry:'Opening stock',
    scanTitle:'Barcode Scanner', scanSub:'Type item code to find it', scanInput:'Type item code...', searchItem:'Search',
    itemNotFound:'Item not found',
    reports2:'Reports', daily:'Daily Summary', bySales:'By Salesman', fullLog:'Full Log', exportCSV:'Export CSV',
    date:'Date', totalIn:'Total In', totalOut:'Total Out', transfers:'Transfers', returns:'Returns',
    salesman:'Salesman', totalReceived:'Received', totalReturned:'Returned', balance:'Balance',
    addSalesman:'+ Add Salesman', salesmanName:'Salesman Name', manageSalesmen:'Manage Salesmen', remove:'Remove',
    available:'available', units2:'units', saving:'Saving...', loading:'Loading...',
    dataLive:'Data saved to cloud in real time',
  },
  ar: {
    app:'المستودع', sub:'الملحقات المحمولة', lock:'قفل 🔒', unlock:'فتح →',
    pwd:'كلمة المرور', enterPwd:'أدخل كلمة المرور', wrongPwd:'كلمة المرور خاطئة',
    home:'الرئيسية', stock:'المخزون', scan:'المسح', transfer:'التحويل', reports:'التقارير', settings:'الإعدادات',
    skus:'إجمالي الأصناف', units:'وحدات', inToday:'وارد اليوم', outToday:'صادر اليوم', stockVal:'قيمة المخزون (BD)',
    updateStock:'📦 تحديث المخزون', sendReturn:'🚚 إرسال / استرجاع', addItem:'+ إضافة صنف', recentActivity:'النشاط الأخير',
    lowStock:'مخزون منخفض', outOfStock:'نفد', allItems:'الكل',
    stockIn:'وارد', stockOut:'صادر', transferL:'تحويل', returnL:'مرتجع',
    sendTo:'🚚 إرسال لمندوب', receiveRet:'↩ استلام مرتجع',
    shelfPlan:'خطة الرفوف', tapShelf:'اضغط للتوسيع', itemTypes:'نوع', totalUnits:'وحدة', emptyShelf:'فارغ',
    movLog:'سجل الحركات', entries:'قيد', searchLog:'بحث...',
    all:'الكل', inL:'وارد', outL:'صادر', tfL:'تحويلات', retL:'مرتجعات', clearAll:'مسح',
    settings2:'الإعدادات', changePwd:'تغيير كلمة المرور', currPwd:'الكلمة الحالية',
    newPwd:'الكلمة الجديدة', confPwd:'تأكيد الكلمة', showPwd:'إظهار', updatePwd:'تحديث',
    appInfo:'معلومات', demoNote:'ℹ النسخة المستضافة',
    recvSupplier:'📥 استلام من المورد', dispatch:'📤 صرف',
    curr:'الحالي', newTot:'المجموع الجديد', remaining:'المتبقي',
    qtyRcv:'الكمية', shelf:'الرف', note:'ملاحظة (اختياري)',
    qtyDisp:'الكمية', selSales:'اختر المندوب', qty:'الكمية',
    retFrom:'المندوب', retQty:'الكمية', retReason:'السبب (اختياري)',
    confRcv:'تأكيد الاستلام', confDisp:'تأكيد الصرف', confSend:'تأكيد الإرسال', confRet:'قبول المرتجع',
    itemName:'اسم الصنف', itemCode:'الكود', price:'السعر (BD)', openStock:'المخزون الافتتاحي', minAlert:'الحد الأدنى',
    addWarehouse:'إضافة للمستودع', mainWH:'المستودع', dispatched:'مصروف', supplier:'المورد', openEntry:'رصيد افتتاحي',
    scanTitle:'ماسح الباركود', scanSub:'أدخل كود الصنف للبحث', scanInput:'أدخل كود الصنف...', searchItem:'بحث',
    itemNotFound:'الصنف غير موجود',
    reports2:'التقارير', daily:'ملخص يومي', bySales:'حسب المندوب', fullLog:'السجل الكامل', exportCSV:'تصدير CSV',
    date:'التاريخ', totalIn:'إجمالي الوارد', totalOut:'إجمالي الصادر', transfers:'التحويلات', returns:'المرتجعات',
    salesman:'المندوب', totalReceived:'المستلم', totalReturned:'المُرجَع', balance:'الرصيد',
    addSalesman:'+ إضافة مندوب', salesmanName:'اسم المندوب', manageSalesmen:'إدارة المندوبين', remove:'حذف',
    available:'متاح', units2:'وحدة', saving:'جاري الحفظ...', loading:'جاري التحميل...',
    dataLive:'البيانات محفوظة في السحابة',
  }
}

const SHELVES = {
  'A-01':'Cables — USB-C / Lightning / Micro','A-02':'Cables — AUX / Multi',
  'B-01':'Wall Chargers — Standard','B-02':'Wall Chargers — GaN / High Watt',
  'C-01':'Car Chargers','C-02':'Power Banks — Small','C-03':'Power Banks — Large',
  'D-01':'Earphones — Wired','D-02':'TWS / Bluetooth Airpods','D-03':'Neckbands / Headphones / Speakers',
  'E-01':'Phone Holders','E-02':'Display Stands','F-01':'Wireless Chargers / Misc'
}
const SHELVES_AR = {
  'A-01':'كابلات — USB-C / Lightning / Micro','A-02':'كابلات — AUX / متعدد',
  'B-01':'شواحن جدارية — عادية','B-02':'شواحن GaN / عالية',
  'C-01':'شواحن سيارة','C-02':'بطاريات محمولة — صغيرة','C-03':'بطاريات محمولة — كبيرة',
  'D-01':'سماعات سلكية','D-02':'إيربودز / بلوتوث','D-03':'سماعات رأس / مكبرات',
  'E-01':'حاملات الهاتف','E-02':'ستاندات العرض','F-01':'شواحن لاسلكية / متنوعة'
}

const gE = n => {
  const l = n.toLowerCase()
  if (l.includes('airpod')||l.includes('aipord')||l.includes('tws')) return '🎧'
  if (l.includes('neckband')||l.includes('headphone')) return '🎧'
  if (l.includes('speaker')) return '🔊'
  if (l.includes('in-ear')||/^m\d/.test(l)) return '🎵'
  if (/^f\d/.test(l)||l.includes('power bank')||l.includes('k105')||l.includes('g176')||l.includes('gn-')) return '🔋'
  if (l.includes('wireless charger')||l.includes('w01')) return '🔌'
  if (l.includes('car charger')||/^c\d/.test(l)) return '🚗'
  if (/^uk/.test(l)||l.includes('charger')) return '⚡'
  if (l.includes('aux')) return '🎵'
  if (l.includes('cable')||/^x\d/.test(l)||/^p\d/.test(l)||/^l1/.test(l)) return '🔌'
  if (l.includes('holder')) return '📱'
  if (l.includes('display')||l.includes('cardboard')) return '🗂️'
  return '📦'
}

const fBD = v => 'BD ' + parseFloat(v||0).toFixed(3)
const fD = () => new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})
const fT = () => new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})

function PieLogo() {
  return (
    <svg viewBox="0 0 70 44" width={30} height={19}>
      <text x={0} y={36} fontSize={40} fontWeight={900} fill="#1565C0" fontFamily="Arial Black,sans-serif">P</text>
      <rect x={25} y={3} width={6} height={38} fill="#F5A623" rx={3}/>
      <text x={32} y={36} fontSize={40} fontWeight={900} fill="#1565C0" fontFamily="Arial Black,sans-serif">IE</text>
    </svg>
  )
}

export default function Home() {
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('light')
  const [loggedIn, setLoggedIn] = useState(false)
  const [tab, setTab] = useState('home')
  const [items, setItems] = useState([])
  const [logs, setLogs] = useState([])
  const [salesmen, setSalesmen] = useState([])
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const t = T[lang]

  useEffect(() => {
    document.body.className = theme + (lang === 'ar' ? ' ar' : '')
  }, [theme, lang])

  useEffect(() => {
    if (loggedIn) loadData()
  }, [loggedIn])

  const loadData = async () => {
    setLoading(true)
    const [{ data: itemsData }, { data: logsData }, { data: salesData }] = await Promise.all([
      supabase.from('items').select('*').order('name'),
      supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('salesmen').select('*').order('name'),
    ])
    if (itemsData) setItems(itemsData)
    if (logsData) setLogs(logsData)
    if (salesData) setSalesmen(salesData.map(s => s.name))
    setLoading(false)
  }

  const showToast = (msg, c = 'gr') => { setToast({ msg, c }); setTimeout(() => setToast(null), 2400) }
  const close = () => { setModal(null); setSel(null) }

  const addLog = async (type, item, qty, from, to, note = '') => {
    const { data } = await supabase.from('logs').insert({
      type, item_code: item.code, item_name: item.name,
      qty: parseInt(qty), from_loc: from, to_loc: to, note
    }).select().single()
    if (data) setLogs(p => [data, ...p])
  }

  const doIn = async (id, qty, shelf, note) => {
    const q = parseInt(qty) || 0; if (!q) return
    const it = items.find(i => i.id === id)
    const newQty = it.qty + q
    await supabase.from('items').update({ qty: newQty, shelf: shelf || it.shelf }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, qty: newQty, shelf: shelf || i.shelf } : i))
    await addLog('in', it, q, t.supplier, shelf || it.shelf, note)
    showToast('+' + q + ' ' + t.units2); close()
  }

  const doOut = async (id, qty, note) => {
    const q = parseInt(qty) || 0; if (!q) return
    const it = items.find(i => i.id === id)
    const newQty = Math.max(0, it.qty - q)
    await supabase.from('items').update({ qty: newQty }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, qty: newQty } : i))
    await addLog('out', it, q, it.shelf, t.dispatched, note)
    showToast('-' + q + ' ' + t.units2, 'rd'); close()
  }

  const doTransfer = async (id, qty, to, note) => {
    const q = parseInt(qty) || 0; if (!q || !to) return
    const it = items.find(i => i.id === id)
    const newQty = Math.max(0, it.qty - q)
    await supabase.from('items').update({ qty: newQty }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, qty: newQty } : i))
    await addLog('transfer', it, q, t.mainWH, to, note)
    showToast('→ ' + to, 'tl'); close()
  }

  const doReturn = async (id, qty, from, note) => {
    const q = parseInt(qty) || 0; if (!q || !from) return
    const it = items.find(i => i.id === id)
    const newQty = it.qty + q
    await supabase.from('items').update({ qty: newQty }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, qty: newQty } : i))
    await addLog('return', it, q, from, t.mainWH, note)
    showToast('↩ ' + q + ' ' + t.units2, 'pu'); close()
  }

  const addItem = async (d) => {
    const { data } = await supabase.from('items').insert({
      code: d.code, name: d.name, rate: parseFloat(d.rate) || 0,
      qty: parseInt(d.qty) || 0, min_qty: parseInt(d.minQty) || 5, shelf: d.shelf || 'A-01'
    }).select().single()
    if (data) {
      setItems(p => [data, ...p])
      if (data.qty > 0) await addLog('in', data, data.qty, t.openEntry, data.shelf, t.openEntry)
    }
    showToast('Item added ✓'); close()
  }

  const addSalesman = async (name) => {
    const { error } = await supabase.from('salesmen').insert({ name })
    if (!error) { setSalesmen(p => [...p, name]); showToast(name + ' added') }
    else showToast('Already exists', 'am')
  }

  const removeSalesman = async (name) => {
    await supabase.from('salesmen').delete().eq('name', name)
    setSalesmen(p => p.filter(s => s !== name))
  }

  const updatePassword = async (newPass) => {
    await supabase.from('settings').update({ value: newPass }).eq('key', 'password')
    showToast(t.updatePwd + ' ✓')
  }

  const checkPassword = async (pwd) => {
    const { data } = await supabase.from('settings').select('value').eq('key', 'password').single()
    return data && data.value === pwd
  }

  const low = items.filter(i => i.qty > 0 && i.qty <= i.min_qty)
  const filtered = useMemo(() =>
    items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))
  , [items, search])

  const toastColors = { gr: theme==='dark'?'#00e5a0':'#0a7c4e', rd: theme==='dark'?'#ff4f4f':'#c0392b', tl: theme==='dark'?'#00d4c8':'#0a7a72', pu: theme==='dark'?'#a78bfa':'#5b3fa6', am: theme==='dark'?'#ffc14d':'#a05c00' }

  if (!loggedIn) return <LoginScreen t={t} lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} onLogin={async(pwd) => {
    const ok = await checkPassword(pwd)
    if (ok) setLoggedIn(true)
    else showToast(t.wrongPwd, 'rd')
  }} />

  return (
    <>
      <Head><title>Warehouse — Mobile Accessories</title><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/><meta name="theme-color" content="#0a0d14"/></Head>
      <div className="app">
        {toast && <div style={{position:'fixed',top:14,left:'50%',transform:'translateX(-50%)',background:toastColors[toast.c]||toastColors.gr,color:theme==='dark'?'#000':'#fff',padding:'8px 18px',borderRadius:22,fontSize:13,fontWeight:700,zIndex:999,whiteSpace:'nowrap',boxShadow:'0 3px 12px rgba(0,0,0,.25)'}}>{toast.msg}</div>}

        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="logo-yq">yq?</div>
            <div style={{width:32,height:32,borderRadius:8,background:'#0d2060',display:'flex',alignItems:'center',justifyContent:'center'}}><PieLogo/></div>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <div className="lang-toggle">
              <button className={`ltb${lang==='en'?' on':''}`} onClick={()=>setLang('en')}>EN</button>
              <button className={`ltb${lang==='ar'?' on':''}`} onClick={()=>setLang('ar')}>عر</button>
            </div>
            <div className="theme-toggle">
              <button className={`ttb${theme==='light'?' on':''}`} onClick={()=>setTheme('light')}>☀️</button>
              <button className={`ttb${theme==='dark'?' on':''}`} onClick={()=>setTheme('dark')}>🌙</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"/>{t.loading}</div>
        ) : (
          <>
            {tab==='home' && <HomeTab t={t} items={items} logs={logs} low={low} setTab={setTab} setModal={setModal} onLogout={()=>setLoggedIn(false)} theme={theme}/>}
            {tab==='stock' && <StockTab t={t} items={filtered} search={search} setSearch={setSearch} setSel={setSel} setModal={setModal}/>}
            {tab==='scan' && <ScanTab t={t} items={items} setSel={setSel} setModal={setModal}/>}
            {tab==='transfer' && <TransferTab t={t} items={items} salesmen={salesmen} setSel={setSel} setModal={setModal}/>}
            {tab==='reports' && <ReportsTab t={t} items={items} logs={logs} salesmen={salesmen} theme={theme}/>}
            {tab==='settings' && <SettingsTab t={t} theme={theme} salesmen={salesmen} onAddSalesman={addSalesman} onRemoveSalesman={removeSalesman} onUpdatePassword={updatePassword} onCheckPassword={checkPassword} onLogout={()=>setLoggedIn(false)} showToast={showToast}/>}
          </>
        )}

        <nav className="nav">
          {[[t.home,'🏠','home'],[t.stock,'📦','stock'],[t.scan,'📷','scan'],[t.transfer,'🚚','transfer'],[t.reports,'📊','reports'],[t.settings,'⚙️','settings']].map(([lb,ic,id]) => (
            <button key={id} className={`nt${tab===id?' on':''}`} onClick={()=>setTab(id)}>
              <span className="ni">{ic}</span><span>{lb}</span><div className="nd"/>
            </button>
          ))}
        </nav>

        {modal==='menu' && sel && <MenuModal t={t} item={sel} onClose={close} onIn={()=>setModal('in')} onOut={()=>setModal('out')} onTransfer={()=>setModal('transfer')} onReturn={()=>setModal('return')}/>}
        {modal==='in' && sel && <InModal t={t} item={sel} onClose={close} onSubmit={doIn} shelves={Object.keys(SHELVES)}/>}
        {modal==='out' && sel && <OutModal t={t} item={sel} onClose={close} onSubmit={doOut}/>}
        {modal==='transfer' && sel && <TransferModal t={t} item={sel} salesmen={salesmen} onClose={close} onSubmit={doTransfer}/>}
        {modal==='return' && sel && <ReturnModal t={t} item={sel} salesmen={salesmen} onClose={close} onSubmit={doReturn}/>}
        {modal==='add' && <AddModal t={t} onClose={close} onSubmit={addItem} shelves={Object.keys(SHELVES)}/>}
      </div>
    </>
  )
}

/* ── LOGIN ── */
function LoginScreen({ t, lang, theme, setLang, setTheme, onLogin }) {
  const [v, setV] = useState('')
  const [err, setErr] = useState(false)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const sub = async () => {
    setLoading(true)
    const ok = await onLogin(v)
    if (!ok) { setErr(true); setV('') }
    setLoading(false)
  }
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:22,background:'var(--bg)',direction:lang==='ar'?'rtl':'ltr'}}>
      <div style={{display:'flex',gap:6,marginBottom:28,justifyContent:'center',flexWrap:'wrap'}}>
        {['en','ar'].map(l=><button key={l} className={`ltb${lang===l?' on':''}`} onClick={()=>setLang(l)}>{l==='en'?'EN':'عربي'}</button>)}
        <div style={{width:1,background:'var(--bd)',margin:'0 4px'}}/>
        {['light','dark'].map(th=><button key={th} className={`ttb${theme===th?' on':''}`} onClick={()=>setTheme(th)}>{th==='light'?'☀️':'🌙'}</button>)}
      </div>
      <div style={{display:'flex',gap:10,marginBottom:14,justifyContent:'center',alignItems:'center'}}>
        <div className="logo-yq" style={{width:52,height:52,fontSize:18,borderRadius:14}}>yq?</div>
        <div style={{width:52,height:52,borderRadius:14,background:'#0d2060',display:'flex',alignItems:'center',justifyContent:'center'}}><PieLogo/></div>
      </div>
      <div style={{fontSize:22,fontWeight:700,marginBottom:2,textAlign:'center',letterSpacing:'-.3px'}}>{t.app}</div>
      <div style={{fontSize:11,color:'var(--tx3)',marginBottom:26,textTransform:'uppercase',letterSpacing:'1px',textAlign:'center'}}>{t.sub}</div>
      <div style={{width:'100%',maxWidth:310}}>
        <div className="fld">
          <label>{t.pwd}</label>
          <div style={{position:'relative'}}>
            <input className="inp" type={show?'text':'password'} placeholder={t.enterPwd} value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')sub()}} style={{paddingRight:42}}/>
            <button onClick={()=>setShow(s=>!s)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'transparent',fontSize:15,color:'var(--tx3)',padding:4}}>{show?'🙈':'👁️'}</button>
          </div>
        </div>
        {err && <div style={{fontSize:12,color:'var(--rd)',marginBottom:9,textAlign:'center'}}>{t.wrongPwd}</div>}
        <button className="btn btn-gr btn-full btn-lg" onClick={sub} disabled={loading} style={{color:theme==='dark'?'#000':'#fff',opacity:loading?.7:1}}>
          {loading ? t.loading : t.unlock}
        </button>
        <div style={{marginTop:14,fontSize:11,color:'var(--tx3)',textAlign:'center',lineHeight:1.6}}>☁️ {t.dataLive}</div>
      </div>
    </div>
  )
}

/* ── HOME TAB ── */
function HomeTab({ t, items, logs, low, setTab, setModal, onLogout, theme }) {
  const total = items.reduce((s,i) => s + i.qty, 0)
  const today = fD()
  const tl = logs.filter(l => {
    const d = new Date(l.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})
    return d === today
  })
  const tIn = tl.filter(l=>l.type==='in').reduce((s,l)=>s+l.qty,0)
  const tOut = tl.filter(l=>l.type==='out').reduce((s,l)=>s+l.qty,0)
  const val = items.reduce((s,i) => s + i.qty*(i.rate||0), 0)
  return (
    <div className="scr">
      <div className="hdr">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><h1>🏪 {t.app}</h1><p>{t.sub} · {fD()}</p></div>
          <button onClick={onLogout} style={{background:'var(--bg3)',border:'1px solid var(--bd)',borderRadius:6,padding:'5px 9px',fontSize:11,color:'var(--tx2)',fontWeight:600}}>{t.lock}</button>
        </div>
      </div>
      {low.length>0 && <div style={{padding:'8px 15px 0'}}>{low.slice(0,3).map(i=><div key={i.id} className="alrt">⚠️ <span style={{fontSize:12,color:'var(--am)',flex:1}}><b>{i.name}</b> — {i.qty} {t.units2}</span></div>)}</div>}
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
      <div style={{padding:'0 15px',marginBottom:7}}>
        <button className="btn btn-out btn-full" onClick={()=>setModal('add')}>{t.addItem}</button>
      </div>
      {logs.length>0 && <>
        <div className="slbl">{t.recentActivity}</div>
        <div style={{padding:'0 15px'}}>
          <div className="card">{logs.slice(0,5).map(l=><LRow key={l.id} l={l} t={t}/>)}</div>
        </div>
      </>}
    </div>
  )
}

function LRow({ l, t }) {
  const c = {in:'var(--gr)',out:'var(--rd)',transfer:'var(--tl)',return:'var(--pu)'}
  const s = {in:'+',out:'-',transfer:'→',return:'↩'}
  const d = new Date(l.created_at)
  const time = d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
  return (
    <div style={{display:'flex',gap:9,alignItems:'flex-start',padding:'7px 0',borderBottom:'1px solid var(--bd)'}}>
      <div style={{width:7,height:7,borderRadius:'50%',background:c[l.type]||'var(--gr)',flexShrink:0,marginTop:4}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.item_name}</div>
        <div style={{fontSize:10,color:'var(--tx3)',fontFamily:'JetBrains Mono',marginTop:1}}>{l.to_loc||''} · {time}</div>
      </div>
      <div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:c[l.type]||'var(--gr)',flexShrink:0}}>{(s[l.type]||'+')+l.qty}</div>
    </div>
  )
}

/* ── STOCK TAB ── */
function StockTab({ t, items, search, setSearch, setSel, setModal }) {
  const [filter, setFilter] = useState('all')
  const shown = filter==='low' ? items.filter(i=>i.qty>0&&i.qty<=i.min_qty) : filter==='zero' ? items.filter(i=>i.qty===0) : items
  return (
    <div className="scr">
      <div className="hdr"><h1>{t.stock}</h1><p>{items.length} · {t.allItems.toLowerCase()}</p></div>
      <div className="srch"><span>🔍</span><input placeholder={t.searchLog} value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="stabs">
        {[[t.allItems,'all'],[t.lowStock,'low'],[t.outOfStock,'zero']].map(([lb,k])=>(
          <button key={k} className={`stab${filter===k?' on':''}`} onClick={()=>setFilter(k)}>{lb}</button>
        ))}
      </div>
      <div style={{padding:'4px 15px 0'}}>
        <button className="btn btn-out btn-sm" style={{marginBottom:7}} onClick={()=>setModal('add')}>{t.addItem}</button>
        {shown.length===0 ? <div className="empty">—</div> : (
          <div className="card">
            {shown.map(i=>(
              <div key={i.id} className="row rowc" onClick={()=>{setSel(i);setModal('menu')}}>
                <div className="ava">{gE(i.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="iname">{i.name}</div>
                  <div className="isub">{i.code} · {fBD(i.rate)} · <span className="shelf-tag">{i.shelf}</span></div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:i.qty===0?'var(--tx3)':i.qty<=i.min_qty?'var(--rd)':'var(--gr)'}}>{i.qty}</div>
                  <div style={{fontSize:9,textTransform:'uppercase',letterSpacing:'.4px',color:'var(--tx3)'}}>{i.qty===0?t.outOfStock:i.qty<=i.min_qty?t.lowStock:t.units2}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── SCAN TAB ── */
function ScanTab({ t, items, setSel, setModal }) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const doScan = () => {
    const q = code.trim(); if (!q) return
    const found = items.find(i => i.code.toLowerCase()===q.toLowerCase() || i.name.toLowerCase().includes(q.toLowerCase()))
    if (found) { setResult(found); setNotFound(false) }
    else { setResult(null); setNotFound(true) }
    setCode('')
  }
  return (
    <div className="scr">
      <div className="hdr"><h1>{t.scanTitle}</h1><p>{t.scanSub}</p></div>
      <div style={{padding:'14px 15px 0'}}>
        <div className="scan-area" onClick={()=>document.getElementById('scan-inp').focus()}>
          <div style={{fontSize:42,marginBottom:6}}>📷</div>
          <div style={{fontSize:13,color:'var(--tx2)',fontWeight:500}}>📷 Tap to focus · Type code below</div>
        </div>
        <div className="fld">
          <input id="scan-inp" className="inp" placeholder={t.scanInput} value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')doScan()}}/>
        </div>
        <button className="btn btn-gr btn-full" style={{marginBottom:12,color:'var(--bg)'}} onClick={doScan}>{t.searchItem}</button>
        {notFound && <div style={{padding:'12px',background:'var(--rdb)',border:'1px solid var(--rd)',borderRadius:8,textAlign:'center',fontSize:13,color:'var(--rd)',fontWeight:500}}>{t.itemNotFound}</div>}
        {result && (
          <div className="card">
            <div style={{display:'flex',gap:11,alignItems:'center',marginBottom:12}}>
              <div className="ava" style={{width:46,height:46,fontSize:20}}>{gE(result.name)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="iname" style={{fontSize:14}}>{result.name}</div>
                <div className="isub">{result.code} · {fBD(result.rate)}</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:12}}>
              <div className="inset" style={{textAlign:'center'}}>
                <div style={{fontSize:20,fontWeight:700,fontFamily:'JetBrains Mono',color:result.qty===0?'var(--tx3)':result.qty<=result.min_qty?'var(--rd)':'var(--gr)'}}>{result.qty}</div>
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
          </div>
        )}
      </div>
    </div>
  )
}

/* ── TRANSFER TAB ── */
function TransferTab({ t, items, salesmen, setSel, setModal }) {
  const [mode, setMode] = useState('transfer')
  const list = items.filter(i => i.qty > 0)
  return (
    <div className="scr">
      <div className="hdr"><h1>{t.sendReturn}</h1><p>{t.selSales}</p></div>
      <div style={{padding:'10px 15px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:7}}>
        <button className={`btn btn-full ${mode==='transfer'?'btn-tl':'btn-out'}`} onClick={()=>setMode('transfer')}>{t.sendTo}</button>
        <button className={`btn btn-full ${mode==='return'?'btn-pu':'btn-out'}`} onClick={()=>setMode('return')}>{t.receiveRet}</button>
      </div>
      <div style={{padding:'0 15px 7px'}}>
        <div className="inset" style={{fontSize:12,color:'var(--tx2)',lineHeight:1.7}}>
          {mode==='transfer' ? '🚚 Stock leaves warehouse → logged under salesman name' : '↩ Stock returns to warehouse → logged as return from salesman'}
        </div>
      </div>
      <div className="slbl">{mode==='transfer' ? t.sendTo : t.receiveRet}</div>
      <div style={{padding:'0 15px'}}>
        {list.length===0 ? <div className="empty">—</div> : (
          <div className="card">
            {list.map(i=>(
              <div key={i.id} className="row rowc" onClick={()=>{setSel(i);setModal(mode)}}>
                <div className="ava">{gE(i.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="iname">{i.name}</div>
                  <div className="isub">{i.code}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:'var(--tx2)'}}>{i.qty}</div>
                  <div style={{fontSize:10,color:'var(--tx3)'}}>{t.available}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── REPORTS TAB ── */
function ReportsTab({ t, items, logs, salesmen, theme }) {
  const [view, setView] = useState('daily')

  const dailyMap = {}
  logs.forEach(l => {
    const d = new Date(l.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})
    if (!dailyMap[d]) dailyMap[d] = { date:d, in:0, out:0, transfer:0, return:0 }
    dailyMap[d][l.type] = (dailyMap[d][l.type]||0) + l.qty
  })
  const daily = Object.values(dailyMap).sort((a,b)=>b.date.localeCompare(a.date))

  const salesMap = {}
  salesmen.forEach(s => salesMap[s] = { name:s, received:0, returned:0 })
  logs.forEach(l => {
    if (l.type==='transfer' && salesMap[l.to_loc]) salesMap[l.to_loc].received += l.qty
    if (l.type==='return' && salesMap[l.from_loc]) salesMap[l.from_loc].returned += l.qty
  })
  const salesData = Object.values(salesMap).filter(s=>s.received>0||s.returned>0)

  const exportCSV = () => {
    const rows = [['Date','Time','Type','Item','Code','Qty','From','To','Note'],
      ...logs.map(l=>{
        const d = new Date(l.created_at)
        return [d.toLocaleDateString('en-GB'),d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),l.type,l.item_name,l.item_code,l.qty,l.from_loc||'',l.to_loc||'',l.note||'']
      })]
    const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n')
    const blob = new Blob([csv],{type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='warehouse_log.csv'; a.click()
  }

  return (
    <div className="scr">
      <div className="hdr">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><h1>{t.reports2}</h1><p>{logs.length} {t.entries}</p></div>
          <button className="btn btn-bl btn-sm" onClick={exportCSV}>{t.exportCSV}</button>
        </div>
      </div>
      <div className="stabs">
        {[[t.daily,'daily'],[t.bySales,'sales'],[t.fullLog,'log']].map(([lb,k])=>(
          <button key={k} className={`stab${view===k?' on':''}`} onClick={()=>setView(k)}>{lb}</button>
        ))}
      </div>

      {view==='daily' && (
        <div style={{padding:'4px 15px 0'}}>
          {daily.length===0 ? <div className="empty">No data yet. Start recording stock movements.</div> : (
            <div className="card">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:4,padding:'6px 0 8px',borderBottom:'1px solid var(--bd)',marginBottom:4}}>
                {[t.date,t.totalIn,t.totalOut,t.transfers,t.returns].map(h=>(
                  <div key={h} style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.4px',color:'var(--tx3)',textAlign:'center'}}>{h}</div>
                ))}
              </div>
              {daily.map(d=>(
                <div key={d.date} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:4,padding:'7px 0',borderBottom:'1px solid var(--bd)',alignItems:'center'}}>
                  <div style={{fontSize:11,color:'var(--tx2)',fontFamily:'JetBrains Mono'}}>{d.date}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--gr)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.in||'-'}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--rd)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.out||'-'}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--tl)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.transfer||'-'}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--pu)',textAlign:'center',fontFamily:'JetBrains Mono'}}>{d.return||'-'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view==='sales' && (
        <div style={{padding:'4px 15px 0'}}>
          {salesData.length===0 ? <div className="empty">No transfers yet. Use the Transfer tab to send stock to salesmen.</div> : (
            <div className="card">
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:4,padding:'6px 0 8px',borderBottom:'1px solid var(--bd)',marginBottom:4}}>
                {[t.salesman,t.totalReceived,t.totalReturned,t.balance].map(h=>(
                  <div key={h} style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.4px',color:'var(--tx3)'}}>{h}</div>
                ))}
              </div>
              {salesData.map(s=>(
                <div key={s.name} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:4,padding:'7px 0',borderBottom:'1px solid var(--bd)',alignItems:'center'}}>
                  <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--tl)',fontFamily:'JetBrains Mono'}}>{s.received}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--pu)',fontFamily:'JetBrains Mono'}}>{s.returned}</div>
                  <div style={{fontSize:12,fontWeight:700,color:s.received-s.returned>0?'var(--am)':'var(--tx3)',fontFamily:'JetBrains Mono'}}>{s.received-s.returned}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view==='log' && (
        <div style={{padding:'4px 15px 0'}}>
          {logs.length===0 ? <div className="empty">No movements yet.</div> : logs.map(l=>{
            const tc={in:'var(--gr)',out:'var(--rd)',transfer:'var(--tl)',return:'var(--pu)'}
            const ts={in:'+',out:'-',transfer:'→',return:'↩'}
            const tb={in:'b-gr',out:'b-rd',transfer:'b-tl',return:'b-pu'}
            const tl2={in:t.stockIn,out:t.stockOut,transfer:t.transferL,return:t.returnL}
            const d = new Date(l.created_at)
            const dateStr = d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})
            const timeStr = d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
            return (
              <div key={l.id} style={{padding:'9px 0',borderBottom:'1px solid var(--bd)'}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:7,marginBottom:4}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="iname">{l.item_name}</div>
                    <div className="isub">{l.item_code}{l.note?' · '+l.note:''}</div>
                  </div>
                  <div style={{fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:tc[l.type]||'var(--gr)',flexShrink:0}}>{(ts[l.type]||'+')+l.qty}</div>
                </div>
                <div style={{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}}>
                  <span className={`badge ${tb[l.type]||'b-gr'}`}>{tl2[l.type]||l.type}</span>
                  {l.from_loc&&l.to_loc && <span style={{fontSize:11,color:'var(--tx3)',fontFamily:'JetBrains Mono'}}>{l.from_loc} → {l.to_loc}</span>}
                  <span style={{fontSize:11,color:'var(--tx3)',marginLeft:'auto',fontFamily:'JetBrains Mono'}}>{dateStr} {timeStr}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── SETTINGS TAB ── */
function SettingsTab({ t, theme, salesmen, onAddSalesman, onRemoveSalesman, onUpdatePassword, onCheckPassword, onLogout, showToast }) {
  const [op, setOp] = useState('')
  const [np, setNp] = useState('')
  const [cp, setCp] = useState('')
  const [show, setShow] = useState(false)
  const [newSales, setNewSales] = useState('')
  const [salesView, setSalesView] = useState(false)

  const chPwd = async () => {
    const ok = await onCheckPassword(op)
    if (!ok) { showToast(t.wrongPwd, 'rd'); return }
    if (np.length < 4) { showToast('Min 4 chars', 'rd'); return }
    if (np !== cp) { showToast('No match', 'rd'); return }
    await onUpdatePassword(np)
    setOp(''); setNp(''); setCp('')
  }

  return (
    <div className="scr">
      <div className="hdr"><h1>{t.settings2}</h1></div>
      <div style={{padding:'0 15px'}}>
        <div className="card">
          <div style={{fontSize:13,fontWeight:700,color:'var(--gr)',marginBottom:10}}>{t.changePwd}</div>
          <div className="fld"><label>{t.currPwd}</label><input className="inp" type={show?'text':'password'} value={op} onChange={e=>setOp(e.target.value)} placeholder="••••••"/></div>
          <div className="fld"><label>{t.newPwd}</label><input className="inp" type={show?'text':'password'} value={np} onChange={e=>setNp(e.target.value)} placeholder="••••••"/></div>
          <div className="fld"><label>{t.confPwd}</label><input className="inp" type={show?'text':'password'} value={cp} onChange={e=>setCp(e.target.value)} placeholder="••••••"/></div>
          <label style={{display:'flex',gap:7,alignItems:'center',marginBottom:10,cursor:'pointer',fontSize:12,color:'var(--tx2)'}}>
            <input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>{t.showPwd}
          </label>
          <button className="btn btn-gr btn-full" style={{color:theme==='dark'?'#000':'#fff'}} onClick={chPwd}>{t.updatePwd}</button>
        </div>

        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:700}}>{t.manageSalesmen} ({salesmen.length})</div>
            <button className="btn btn-out btn-sm" onClick={()=>setSalesView(v=>!v)}>{salesView?'Hide':'Show'}</button>
          </div>
          {salesView && (
            <div>
              <div style={{display:'flex',gap:7,marginBottom:10}}>
                <input className="inp" placeholder={t.salesmanName} value={newSales} onChange={e=>setNewSales(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){onAddSalesman(newSales.trim());setNewSales('')}}} style={{flex:1}}/>
                <button className="btn btn-gr" style={{color:theme==='dark'?'#000':'#fff',whiteSpace:'nowrap'}} onClick={()=>{onAddSalesman(newSales.trim());setNewSales('')}}>+</button>
              </div>
              {salesmen.map(s=>(
                <div key={s} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid var(--bd)',fontSize:13}}>
                  <span>{s}</span>
                  <button className="btn btn-rd btn-sm" onClick={()=>onRemoveSalesman(s)}>{t.remove}</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>ℹ {t.appInfo}</div>
          {[['App','VFAN MA Warehouse'],['Version','1.0 Hosted'],['Items','170 SKUs'],['Database','Supabase (cloud)'],['Hosting','Vercel (free)']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--bd)',fontSize:12}}>
              <span style={{color:'var(--tx2)'}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-rd btn-full" style={{marginTop:4}} onClick={onLogout}>{t.lock}</button>
      </div>
    </div>
  )
}

/* ── MODALS ── */
function MenuModal({ t, item, onClose, onIn, onOut, onTransfer, onReturn }) {
  return (
    <div className="bkdp" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mh"/>
        <div style={{display:'flex',gap:11,alignItems:'flex-start',marginBottom:14,background:'var(--bg3)',borderRadius:8,padding:'11px'}}>
          <div className="ava" style={{width:46,height:46,fontSize:20,flexShrink:0}}>{gE(item.name)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,lineHeight:1.3}}>{item.name}</div>
            <div className="isub">{item.code} · {fBD(item.rate)}</div>
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
      </div>
    </div>
  )
}

function InModal({ t, item, onClose, onSubmit, shelves }) {
  const [qty, setQty] = useState('')
  const [shelf, setShelf] = useState(item.shelf)
  const [note, setNote] = useState('')
  return (
    <div className="bkdp" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mh"/>
        <div className="mt">📥 {t.recvSupplier}</div>
        <div style={{padding:'9px 11px',background:'var(--grb)',border:'1px solid var(--grl)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--gr)',fontWeight:500}}>{item.name} · {t.curr}: <b>{item.qty} {t.units2}</b></div>
        <div className="fld"><label>{t.qtyRcv}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus min={1}/></div>
        <div className="fld"><label>{t.shelf}</label><select className="inp" value={shelf} onChange={e=>setShelf(e.target.value)}>{shelves.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="fld"><label>{t.note}</label><input className="inp" placeholder="Invoice #..." value={note} onChange={e=>setNote(e.target.value)}/></div>
        {qty && <div style={{textAlign:'center',fontSize:12,color:'var(--tx2)',marginBottom:10}}>{t.newTot}: <b style={{color:'var(--gr)'}}>{item.qty+(parseInt(qty)||0)} {t.units2}</b></div>}
        <button className="btn btn-gr btn-full btn-lg" style={{color:'var(--bg)'}} onClick={()=>{if(qty)onSubmit(item.id,qty,shelf,note)}}>{t.confRcv} +{qty||'0'}</button>
      </div>
    </div>
  )
}

function OutModal({ t, item, onClose, onSubmit }) {
  const [qty, setQty] = useState('')
  const [note, setNote] = useState('')
  return (
    <div className="bkdp" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mh"/>
        <div className="mt">📤 {t.dispatch}</div>
        <div style={{padding:'9px 11px',background:'var(--rdb)',border:'1px solid var(--rd)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--rd)',fontWeight:500}}>{item.name} · {t.available}: <b>{item.qty} {t.units2}</b></div>
        <div className="fld"><label>{t.qtyDisp}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus min={1} max={item.qty}/></div>
        <div className="fld"><label>{t.note}</label><input className="inp" placeholder="..." value={note} onChange={e=>setNote(e.target.value)}/></div>
        {qty && <div style={{textAlign:'center',fontSize:12,color:'var(--tx2)',marginBottom:10}}>{t.remaining}: <b style={{color:'var(--am)'}}>{Math.max(0,item.qty-(parseInt(qty)||0))} {t.units2}</b></div>}
        <button className="btn btn-rd btn-full btn-lg" onClick={()=>{if(qty)onSubmit(item.id,qty,note)}}>{t.confDisp} -{qty||'0'}</button>
      </div>
    </div>
  )
}

function TransferModal({ t, item, salesmen, onClose, onSubmit }) {
  const [qty, setQty] = useState('')
  const [to, setTo] = useState(salesmen[0]||'')
  const [note, setNote] = useState('')
  return (
    <div className="bkdp" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mh"/>
        <div className="mt">{t.sendTo}</div>
        <div style={{padding:'9px 11px',background:'var(--tlb)',border:'1px solid var(--tl)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--tl)',fontWeight:500}}>
          {item.name} · <b>{item.qty} {t.units2}</b>
          <div style={{marginTop:3,fontSize:11,fontWeight:400,color:'var(--tx3)'}}>Deducted from warehouse · logged under salesman</div>
        </div>
        <div className="fld"><label>{t.selSales}</label><select className="inp" value={to} onChange={e=>setTo(e.target.value)}>{salesmen.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="fld"><label>{t.qty}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus min={1} max={item.qty}/></div>
        <div className="fld"><label>{t.note}</label><input className="inp" placeholder="..." value={note} onChange={e=>setNote(e.target.value)}/></div>
        {qty&&to && <div style={{textAlign:'center',fontSize:13,fontFamily:'JetBrains Mono',color:'var(--tl)',marginBottom:10}}>{t.mainWH} → {to}</div>}
        <button className="btn btn-tl btn-full btn-lg" onClick={()=>{if(qty&&to)onSubmit(item.id,qty,to,note)}}>{t.confSend} {qty||'0'} → {to.split(' ')[0]}</button>
      </div>
    </div>
  )
}

function ReturnModal({ t, item, salesmen, onClose, onSubmit }) {
  const [qty, setQty] = useState('')
  const [from, setFrom] = useState(salesmen[0]||'')
  const [note, setNote] = useState('')
  return (
    <div className="bkdp" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mh"/>
        <div className="mt">↩ {t.receiveRet}</div>
        <div style={{padding:'9px 11px',background:'var(--pub)',border:'1px solid var(--pu)',borderRadius:8,marginBottom:12,fontSize:12,color:'var(--pu)',fontWeight:500}}>
          {item.name} · <b>{item.qty} {t.units2}</b>
          <div style={{marginTop:3,fontSize:11,fontWeight:400,color:'var(--tx3)'}}>Stock returns to warehouse</div>
        </div>
        <div className="fld"><label>{t.retFrom}</label><select className="inp" value={from} onChange={e=>setFrom(e.target.value)}>{salesmen.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="fld"><label>{t.retQty}</label><input className="inp" type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)} autoFocus min={1}/></div>
        <div className="fld"><label>{t.retReason}</label><input className="inp" placeholder="Unsold, wrong item, damaged..." value={note} onChange={e=>setNote(e.target.value)}/></div>
        {qty && <div style={{textAlign:'center',fontSize:12,color:'var(--tx2)',marginBottom:10}}>{t.newTot}: <b style={{color:'var(--pu)'}}>{item.qty+(parseInt(qty)||0)} {t.units2}</b></div>}
        <button className="btn btn-pu btn-full btn-lg" onClick={()=>{if(qty&&from)onSubmit(item.id,qty,from,note)}}>{t.confRet} {qty||'0'}</button>
      </div>
    </div>
  )
}

function AddModal({ t, onClose, onSubmit, shelves }) {
  const [f, setF] = useState({name:'',code:'',rate:'',qty:'',minQty:'5',shelf:'A-01'})
  const s = (k,v) => setF(p=>({...p,[k]:v}))
  return (
    <div className="bkdp" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mh"/>
        <div className="mt">{t.addItem}</div>
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
      </div>
    </div>
  )
}
