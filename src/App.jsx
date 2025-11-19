import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Home, MessageSquare, Settings, User, ChevronLeft, ChevronRight, Download, Calendar, Search, Activity, Users, TrendingUp, CreditCard, Menu, LogOut, Plus, Paperclip, Send, Moon, Sun } from 'lucide-react'

// Design tokens
const colors = {
  primary: 'rgb(10, 24, 61)', // deep navy
  accent: 'rgb(20, 184, 166)', // teal
  muted: '#6b7280', // warm gray
}

function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark] = useState(false)
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <div className={`min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>      
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 min-h-screen ml-0">
          <Topbar onToggleDark={() => setDark(!dark)} dark={dark} />
          <div className="px-6 pb-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation()
  const items = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/chat', label: 'Chat', icon: MessageSquare },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/profile', label: 'Profile', icon: User },
  ]
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <aside className={`sticky top-0 h-screen hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-950/50 transition-all duration-300`} style={{width: collapsed ? 72 : 240}}>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white grid place-items-center shadow-sm">FB</div>
          {!collapsed && (
            <div>
              <div className="font-semibold">Flames Blue</div>
              <div className="text-xs text-slate-500">Analytics</div>
            </div>
          )}
        </div>
        <button aria-label="Collapse sidebar" onClick={() => setCollapsed(!collapsed)} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
          {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}        
        </button>
      </div>
      <nav className="mt-2 flex-1 px-2 space-y-1">
        {items.map(({to,label,icon:Icon}) => {
          const active = isActive(to)
          return (
            <Link key={to} to={to} className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100/60 dark:hover:bg-slate-800/60 relative ${active ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
              {active && <span className="absolute left-0 inset-y-0 w-1 rounded-r bg-teal-500"/>}
              <Icon size={18} className={`${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}/>
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 pb-4 mt-auto">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
          <div className="text-xs text-slate-500 mb-2">Profile</div>
          <button className="w-full inline-flex items-center justify-center gap-2 text-sm rounded-lg px-3 py-2 bg-slate-900 text-white hover:bg-slate-800">
            <LogOut size={16}/> {!collapsed && 'Logout'}
          </button>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ onToggleDark, dark }) {
  const location = useLocation()
  const title = location.pathname.startsWith('/chat') ? 'Chat' : 'Dashboard'
  const subtitle = location.pathname.startsWith('/chat') ? 'Ask questions & get insights' : 'Overview & insights'

  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-slate-950/60 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-sm text-slate-500 -mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <DateRange />
            <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-teal-500 text-white hover:bg-teal-600 text-sm"><Download size={16}/> Export</button>
            <button onClick={onToggleDark} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden">
              <img src="https://i.pravatar.cc/64" alt="User" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function DateRange() {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState('Last 30 days')
  const options = ['Last 7 days', 'Last 30 days', 'Last 90 days']
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"><Calendar size={16}/>{range}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-1">
          {options.map(o => (
            <button key={o} onClick={() => {setRange(o); setOpen(false)}} className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${o===range ? 'text-teal-600' : ''}`}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// Dashboard Page
function DashboardPage(){
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    let mounted = true
    fetch(`${baseUrl}/api/dashboard/sample`)
      .then(r => r.json())
      .then(d => { if(mounted){ setData(d); setLoading(false)} })
      .catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(loading ? Array.from({length:4}).map((_,i)=>({label:'—',value:'—',delta:0,icon:'Activity',format:'number'})) : data?.kpis || []).map((k,i)=> (
          <KpiCard key={i} k={k} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Users / Sessions over time" subtitle="Daily trends"/>
          <LineChart data={data?.series || []} />
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Traffic Source / Channel Mix"/>
            <DonutChart data={data?.traffic || []}/>
          </Card>
          <Card>
            <CardHeader title="Top Features Used"/>
            <BarChart data={data?.features || []}/>
          </Card>
        </div>
      </div>

      {/* Secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent signups"/>
          <SignupTable rows={data?.recent || []}/>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Metric timeline"/>
            <MiniArea />
            <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1">
              <li>Growth accelerates after latest release.</li>
              <li>Weekend dips consistent across months.</li>
              <li>Conversion stable within expected band.</li>
            </ul>
          </Card>
          <Card>
            <CardHeader title="Alerts"/>
            <div className="space-y-2">
              <AlertChip color="teal" label="Billing success up 3.2%"/>
              <AlertChip color="amber" label="API latency increased"/>
              <AlertChip color="rose" label="Churn risk elevated"/>
            </div>
          </Card>
        </div>
      </div>

      <div className="text-xs text-slate-500">Last updated: {new Date().toLocaleString()} • <a className="underline" href="#">Help</a></div>
    </div>
  )}

function KpiCard({ k }){
  const Icon = {Activity, Users, TrendingUp, CreditCard}[k.icon] || Activity
  const formatValue = (v)=>{
    if(k.format==='percent') return `${v.toFixed ? v.toFixed(1) : v}%`
    if(k.format==='currency') return `$${Number(v).toLocaleString()}`
    return Number(v).toLocaleString()
  }
  const deltaPositive = (k.delta||0) >= 0
  return (
    <div className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600"><Icon size={18}/></span>
          <div className="text-slate-500 text-sm" title={k.label+': Total unique users who logged in during the selected range.'}>{k.label}</div>
        </div>
        <div className={`text-xs px-2 py-0.5 rounded-full ${deltaPositive ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}`}>
          {deltaPositive ? '▲' : '▼'} {Math.abs(k.delta)}%
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold">{formatValue(k.value)}</div>
    </div>
  )
}

function Card({children, className=''}){
  return <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm ${className}`}>{children}</div>
}
function CardHeader({title, subtitle}){
  return (
    <div className="mb-3">
      <div className="font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
    </div>
  )
}

// Simple charts (SVG based, no extra deps)
function LineChart({data}){
  // Prepare
  const pad = 28
  const w = 820, h = 220
  const pointsU = data.map((d,i)=>({x:i, y:d.users}))
  const pointsS = data.map((d,i)=>({x:i, y:d.sessions}))
  const maxX = Math.max(1, data.length-1)
  const maxY = Math.max(1, ...data.map(d=>Math.max(d.users,d.sessions)))
  const scaleX = (i)=> pad + (i/maxX)*(w-pad*2)
  const scaleY = (v)=> h - pad - (v/maxY)*(h-pad*2)
  const path = (pts)=> pts.map((p,i)=> `${i?'L':'M'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ')

  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        {/* axes */}
        <line x1={pad} x2={w-pad} y1={h-pad} y2={h-pad} stroke="#e5e7eb"/>
        {/* users */}
        <path d={path(pointsU)} fill="none" stroke="#0ea5e9" strokeWidth="2"/>
        {/* sessions */}
        <path d={path(pointsS)} fill="none" stroke="#14b8a6" strokeWidth="2"/>
      </svg>
      <div className="flex gap-4 text-xs text-slate-500 mt-2">
        <div className="inline-flex items-center gap-2"><span className="w-3 h-1 bg-sky-500 inline-block"/>Users</div>
        <div className="inline-flex items-center gap-2"><span className="w-3 h-1 bg-teal-500 inline-block"/>Sessions</div>
      </div>
    </div>
  )
}

function DonutChart({data}){
  const total = Math.max(1, data.reduce((a,b)=>a+b.value,0))
  const radius = 70
  const stroke = 18
  const C = 2 * Math.PI * radius
  let acc = 0
  const colors = ['#0ea5e9','#14b8a6','#f59e0b','#ef4444']
  return (
    <div className="flex items-center gap-4">
      <svg width="180" height="180" viewBox="0 0 200 200">
        <g transform="translate(100,100)">
          {data.map((d,i)=>{
            const len = (d.value/total)*C
            const dash = `${len} ${C-len}`
            const rot = (acc/total)*360
            acc += d.value
            return <circle key={i} r={radius} fill="transparent" stroke={colors[i%colors.length]} strokeWidth={stroke} strokeDasharray={dash} transform={`rotate(${rot-90})`}/>
          })}
          <circle r={radius-stroke} fill="white" className="dark:fill-slate-900"/>
        </g>
      </svg>
      <div className="space-y-1 text-sm">
        {data.map((d,i)=>(
          <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 inline-block rounded-sm" style={{background: colors[i%colors.length]}}/> {d.name} <span className="text-slate-400">• {Math.round((d.value/total)*100)}%</span></div>
        ))}
      </div>
    </div>
  )
}

function BarChart({data}){
  const max = Math.max(1, ...data.map(d=>d.count||0))
  return (
    <div className="space-y-2">
      {data.slice(0,10).map((d,i)=>(
        <div key={i} className="flex items-center gap-3">
          <div className="text-sm text-slate-600 dark:text-slate-300 w-40 truncate">{d.name}</div>
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-teal-500" style={{width: `${(d.count/max)*100}%`}}/>
          </div>
          <div className="w-16 text-right text-xs text-slate-500">{d.count}</div>
        </div>
      ))}
    </div>
  )
}

function SignupTable({rows}){
  const [page,setPage] = useState(1)
  const pageSize = 5
  const total = Math.ceil(rows.length / pageSize)
  const slice = rows.slice((page-1)*pageSize, page*pageSize)
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2">Name / Email</th>
              <th className="py-2">Signup Date</th>
              <th className="py-2">Source</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r,i)=> (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-2">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-slate-500">{r.email}</div>
                </td>
                <td className="py-2">{r.date}</td>
                <td className="py-2">{r.source}</td>
                <td className="py-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm text-slate-600">
        <div>Page {page} of {total}</div>
        <div className="space-x-2">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-50">Prev</button>
          <button disabled={page===total} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}

function MiniArea(){
  const pts = Array.from({length:40}).map((_,i)=> ({x:i, y: 50 + Math.sin(i/3)*20 + Math.random()*8}))
  const w=320,h=80
  const maxX=39, maxY=Math.max(...pts.map(p=>p.y))
  const sx=(i)=> (i/maxX)*w
  const sy=(v)=> h - (v/maxY)*h
  const path = 'M '+ pts.map((p,i)=> `${sx(p.x)} ${sy(p.y)}`).join(' L ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={path + ` L ${w} ${h} L 0 ${h} Z`} fill="url(#g)"/>
      <path d={path} fill="none" stroke="#14b8a6" strokeWidth="2"/>
    </svg>
  )
}

function AlertChip({label,color}){
  const map = {teal:'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', amber:'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', rose:'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}
  return <div className={`text-sm px-3 py-2 rounded-lg ${map[color]}`}>{label}</div>
}

// Chat Page
function ChatPage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [input,setInput] = useState('')
  const [sending,setSending] = useState(false)
  const [messages,setMessages] = useState(()=>{
    const stored = localStorage.getItem('fb_chat_demo')
    return stored ? JSON.parse(stored) : [
      {id:1, role:'system', text:'AI • Model v1 ready'},
      {id:2, role:'user', text:'Hi, can you summarize our growth?'},
      {id:3, role:'bot', text:'Over the last 30 days, users grew 4.2% with stable sessions.'}
    ]
  })
  const [toast,setToast] = useState('')
  const listRef = useRef(null)

  useEffect(()=>{ localStorage.setItem('fb_chat_demo', JSON.stringify(messages)) }, [messages])
  useEffect(()=>{ listRef.current?.scrollTo({top: 1e9, behavior:'smooth'}) }, [messages, sending])

  const send = async () => {
    if(!input.trim() || sending) return
    setSending(true)
    const userMsg = {id:Date.now(), role:'user', text: input.trim(), status:'sending'}
    setMessages(m=>[...m, userMsg])
    setInput('')
    setToast('Generating response…')
    try{
      // show bot typing placeholder
      const typingId = Date.now()+1
      setMessages(m=>[...m, {id:typingId, role:'bot', typing:true, text:''}])
      const res = await fetch(`${baseUrl}/api/chat/respond`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({message: userMsg.text})})
      if(!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages(m=> m.map(x=> x.id===userMsg.id ? {...x, status:'sent'}: x).filter(x=> !x.typing).concat([{id: Date.now()+2, role:'bot', text: data.reply, source:'AI • Model v1'}]))
      setToast('')
    }catch(e){
      setMessages(m=> m.map(x=> x.id===userMsg.id ? {...x, status:'failed'}: x))
      setToast('Message failed to send. Retry?')
    }finally{
      setSending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {['What changed this week?','Top drivers of growth','Any churn risks?'].map((s,i)=>(
          <button key={i} onClick={()=>setInput(s)} className="text-sm px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">{s}</button>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {/* History */}
        <div ref={listRef} role="log" aria-live="polite" className="h-[56vh] overflow-y-auto p-4 space-y-3">
          {messages.map(m=> <MessageBubble key={m.id} m={m}/>) }
          {sending && (
            <div className="flex items-center justify-center text-xs text-slate-500"><span className="animate-pulse">Thinking…</span></div>
          )}
        </div>
        {/* Composer */}
        <div className={`border-t border-slate-200 dark:border-slate-800 p-3 ${sending? 'opacity-80 pointer-events-none': ''}`}>
          <div className={`flex items-end gap-2`}>            
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Attach file"><Paperclip size={18}/></button>
            <textarea
              aria-label="Message input"
              placeholder="Ask anything — product metrics, support issues, or quick analysis."
              className={`flex-1 min-h-[44px] max-h-32 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 text-sm`}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send() } }}
            />
            <button onClick={send} disabled={sending || !input.trim()} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 ${sending ? 'animate-pulse' : ''}`}>{sending ? 'Sending' : <><Send size={16}/> Send</>}</button>
          </div>
          {toast && (
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">{toast}</div>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({m}){
  const isUser = m.role==='user'
  if(m.typing){
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800"/>
        <div className="rounded-2xl px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <div className="w-28 h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite] rounded"/>
        </div>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      </div>
    )
  }
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-7 h-7 rounded-full overflow-hidden mr-2"><img src="https://i.pravatar.cc/40?img=12"/></div>}
      <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${isUser ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'}`}>
        <div className="text-xs mb-1 opacity-70">{isUser ? 'You • ' : (m.source || 'AI • Model v1 • ')}{new Date(m.id).toLocaleTimeString()}</div>
        <div className="whitespace-pre-wrap text-sm">{m.text}</div>
        {m.status==='failed' && (
          <div className="mt-1 text-xs text-rose-500">Failed to send. Tap to retry.</div>
        )}
      </div>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
