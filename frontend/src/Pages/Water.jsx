import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Droplets, ArrowLeft, TrendingUp, TrendingDown, Minus, MapPin, Info, Smile, Meh, Frown, AlertTriangle, Fish, Waves, ShowerHead, Leaf } from 'lucide-react'
import Navbar from "../Components/Navbar.jsx"

const getWaterConfig = (do_) => {
  if (do_ >= 8.0) return {
    level: 'Excellent',
    hex: '#3b82f6',
    emoji: '💎',
    plain: 'Safe & clean water',
    desc: 'This water has plenty of oxygen — safe for fish, swimming, and most uses. Think of a clear mountain stream.',
    icon: <Smile size={20} />,
    tip: 'Great news! Water quality here is top-notch. Safe for all recreational activities.',
    canDrink: true, canSwim: true, fishHealthy: true,
  }
  if (do_ >= 6.0) return {
    level: 'Good',
    hex: '#22c55e',
    emoji: '✨',
    plain: 'Mostly healthy water',
    desc: 'Oxygen levels are good. Fish and aquatic life are doing well. Generally safe for most uses.',
    icon: <Smile size={20} />,
    tip: 'Water quality is good. Fish and aquatic life are thriving here.',
    canDrink: true, canSwim: true, fishHealthy: true,
  }
  if (do_ >= 4.0) return {
    level: 'Moderate',
    hex: '#eab308',
    emoji: '⚠️',
    plain: 'Water under stress',
    desc: 'Oxygen is getting low. Sensitive fish species may struggle. Water needs attention.',
    icon: <Meh size={20} />,
    tip: 'Some fish species are under stress. Avoid using this water for drinking without treatment.',
    canDrink: false, canSwim: true, fishHealthy: false,
  }
  if (do_ >= 2.0) return {
    level: 'Poor',
    hex: '#f97316',
    emoji: '🚰',
    plain: 'Unhealthy water',
    desc: 'Very little oxygen remains. Most fish cannot survive here. This water is polluted.',
    icon: <Frown size={20} />,
    tip: 'Water is heavily polluted. Not safe for drinking or swimming. Fish population is declining.',
    canDrink: false, canSwim: false, fishHealthy: false,
  }
  return {
    level: 'Very Poor',
    hex: '#ef4444',
    emoji: '🚫',
    plain: 'Critically polluted',
    desc: 'Dangerously low oxygen. Aquatic life cannot survive. Immediate attention needed.',
    icon: <AlertTriangle size={20} />,
    tip: 'Critical pollution level. No aquatic life can survive. Urgent remediation needed.',
    canDrink: false, canSwim: false, fishHealthy: false,
  }
}

const mockData = [{
  "16-Apr": 8.5, "16-Aug": 5.4, "16-Dec": 5.7, "16-Jul": 7.0,
  "16-Jun": 11.5, "16-Mar": 5.5, "16-May": 10.4, "16-Nov": 8.5,
  "16-Oct": 10.75, "16-Sep": 6.25, "17-Feb": 11.25, "17-Jan": 11.2,
  "Average (mg/L)": 8.5, "City": "Pune", "Locations": "1.Khadakwasla"
}]

// Simple indicator pill
const IndicatorPill = ({ ok, label, icon }) => (
  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
    style={{
      background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
      border: `1px solid ${ok ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
      color: ok ? '#4ade80' : '#f87171'
    }}>
    {icon}
    <span>{ok ? '✓' : '✗'} {label}</span>
  </div>
)

const Water = () => {
  const navigate = useNavigate()
  const [waterData, setWaterData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/water')
        const d = await res.json()
        setWaterData(d.data[0])
      } catch {
        setWaterData(mockData[0])
      } finally { setLoading(false) }
    }
    fetch_()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a130a' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-white/10 animate-spin mx-auto mb-4" />
        <p className="text-white/50 text-sm">Loading water data...</p>
      </div>
    </div>
  )

  const monthlyData = [
    { m: 'Jan', do: waterData['17-Jan'] },
    { m: 'Feb', do: waterData['17-Feb'] },
    { m: 'Mar', do: waterData['16-Mar'] },
    { m: 'Apr', do: waterData['16-Apr'] },
    { m: 'May', do: waterData['16-May'] },
    { m: 'Jun', do: waterData['16-Jun'] },
    { m: 'Jul', do: waterData['16-Jul'] },
    { m: 'Aug', do: waterData['16-Aug'] },
    { m: 'Sep', do: waterData['16-Sep'] },
    { m: 'Oct', do: waterData['16-Oct'] },
    { m: 'Nov', do: waterData['16-Nov'] },
    { m: 'Dec', do: waterData['16-Dec'] },
  ]

  const avgDO = waterData['Average (mg/L)']
  const cfg = getWaterConfig(avgDO)
  const sorted = [...monthlyData].sort((a, b) => b.do - a.do)
  const best = sorted[0], worst = sorted[sorted.length - 1]
  const h1 = monthlyData.slice(0, 6).reduce((s, m) => s + (m.do || 0), 0) / 6
  const h2 = monthlyData.slice(6).reduce((s, m) => s + (m.do || 0), 0) / 6
  const trend = h2 > h1 ? 'improving' : h2 < h1 ? 'declining' : 'stable'

  // Score out of 10 for the layperson
  const score = Math.min(10, Math.round((avgDO / 12) * 10))

  const card = "rounded-2xl border border-white/7 p-6"
  const cardBg = { background: 'rgba(255,255,255,0.03)' }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pb-16 text-white" style={{ background: '#0a130a' }}>
        <div className="max-w-5xl mx-auto px-6 pt-28">

          {/* Back */}
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition mb-8">
            <ArrowLeft size={16} /> Back
          </button>

          {/* Title */}
          <div className="mb-8">
            <p className="text-xs font-mono text-white/25 tracking-[3px] uppercase mb-2">◈ Water Quality</p>
            <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Water Quality Index
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-white/30">
              <span className="flex items-center gap-1.5"><MapPin size={13} />{waterData.City}</span>
              <span className="flex items-center gap-1.5"><Droplets size={13} />{waterData.Locations}</span>
            </div>
          </div>

          {/* ── PLAIN ENGLISH SUMMARY CARD ── */}
          <div className="rounded-2xl p-6 mb-5" style={{
            background: `linear-gradient(135deg, ${cfg.hex}18, transparent)`,
            border: `1px solid ${cfg.hex}35`,
            boxShadow: `0 0 40px ${cfg.hex}12`
          }}>
            <div className="flex items-start gap-5">
              <div className="text-5xl mt-1">{cfg.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {cfg.plain}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${cfg.hex}25`, color: cfg.hex, border: `1px solid ${cfg.hex}40` }}>
                    {cfg.level}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{cfg.desc}</p>

                {/* At-a-glance indicators */}
                <div className="flex flex-wrap gap-2">
                  <IndicatorPill ok={cfg.canDrink}   label="Safe to drink (treated)" icon={<ShowerHead size={14} />} />
                  <IndicatorPill ok={cfg.canSwim}    label="Safe for swimming"        icon={<Waves size={14} />} />
                  <IndicatorPill ok={cfg.fishHealthy} label="Fish can survive"        icon={<Fish size={14} />} />
                </div>
              </div>
            </div>
          </div>

          {/* ── SCORE + QUICK STATS ── */}
          <div className="grid grid-cols-4 gap-4 mb-5">

            {/* Big score */}
            <div className={card} style={{ ...cardBg, borderColor: `${cfg.hex}30` }}>
              <p className="text-xs text-white/25 mb-2">Water Score</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold font-mono" style={{ color: cfg.hex }}>{score}</span>
                <span className="text-white/30 text-lg mb-1">/10</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${score * 10}%`, background: cfg.hex }} />
              </div>
            </div>

            {/* Trend */}
            <div className={card} style={cardBg}>
              <p className="text-xs text-white/25 mb-2">Year Trend</p>
              <div className="flex items-center gap-2">
                {trend === 'improving'
                  ? <TrendingUp size={22} className="text-green-400" />
                  : trend === 'declining'
                  ? <TrendingDown size={22} className="text-red-400" />
                  : <Minus size={22} className="text-yellow-400" />}
                <span className="font-bold capitalize text-white">{trend}</span>
              </div>
              <p className="text-xs text-white/30 mt-2">
                {trend === 'improving' ? 'Getting better over time' : trend === 'declining' ? 'Getting worse over time' : 'Staying the same'}
              </p>
            </div>

            {/* Best month */}
            <div className={card} style={cardBg}>
              <p className="text-xs text-white/25 mb-1">Best Month</p>
              <div className="text-2xl font-bold text-green-400">{best.m}</div>
              <p className="text-xs text-white/30 mt-1">Cleanest water of the year</p>
            </div>

            {/* Worst month */}
            <div className={card} style={cardBg}>
              <p className="text-xs text-white/25 mb-1">Needs Attention</p>
              <div className="text-2xl font-bold text-orange-400">{worst.m}</div>
              <p className="text-xs text-white/30 mt-1">Lowest quality this year</p>
            </div>
          </div>

          {/* ── WHAT DOES THIS MEAN? ── */}
          <div className={`${card} mb-5`} style={{ ...cardBg, borderColor: 'rgba(34,197,94,0.15)' }}>
            <div className="flex items-start gap-3">
              <Leaf size={16} className="text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white mb-1">What does this mean for you?</p>
                <p className="text-sm text-white/50 leading-relaxed">{cfg.tip}</p>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div className={`${card} mb-5`} style={cardBg}>
            <h3 className="text-sm font-semibold text-white mb-1">Oxygen Levels Throughout the Year</h3>
            <p className="text-xs text-white/30 mb-5">Higher is better — more oxygen means healthier water</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="doGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={cfg.hex} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={cfg.hex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                {/* Reference lines for quality zones */}
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#0d140e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 13 }}
                  formatter={(v) => {
                    const c = getWaterConfig(v)
                    return [`${v?.toFixed(2)} mg/L — ${c.plain}`, 'Water Quality']
                  }}
                />
                <Area type="monotone" dataKey="do" stroke={cfg.hex} strokeWidth={2.5} fill="url(#doGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className={`${card} mb-5`} style={cardBg}>
            <h3 className="text-sm font-semibold text-white mb-1">Month-by-Month Comparison</h3>
            <p className="text-xs text-white/30 mb-5">Taller bars = better water quality that month</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#0d140e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 13 }}
                  formatter={(v) => {
                    const c = getWaterConfig(v)
                    return [`${v?.toFixed(2)} mg/L — ${c.plain}`]
                  }}
                />
                <Bar dataKey="do" fill={cfg.hex} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Simple scale */}
          <div className={`${card} mb-5`} style={{ ...cardBg, borderColor: 'rgba(59,130,246,0.2)' }}>
            <div className="flex items-start gap-3">
              <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
              <div className="w-full">
                <p className="text-sm font-semibold text-white mb-1">How to read this</p>
                <p className="text-xs text-white/40 mb-4">We measure Dissolved Oxygen (DO) — the amount of oxygen in water. More oxygen = healthier water, just like fresh air is better for breathing.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { l: '💎 Excellent', r: 'Like a mountain stream',  sub: '≥8 mg/L', c: '#3b82f6' },
                    { l: '✨ Good',      r: 'Healthy river water',     sub: '6–8 mg/L', c: '#22c55e' },
                    { l: '⚠️ Moderate',  r: 'Fish getting stressed',   sub: '4–6 mg/L', c: '#eab308' },
                    { l: '🚫 Poor',      r: 'Polluted, needs help',    sub: '<4 mg/L',  c: '#ef4444' },
                  ].map(({ l, r, sub, c }) => (
                    <div key={l} className="p-3 rounded-xl border text-xs" style={{ borderColor: `${c}30`, background: `${c}10` }}>
                      <div className="font-semibold mb-1" style={{ color: c }}>{l}</div>
                      <div className="text-white/60 mb-0.5">{r}</div>
                      <div className="text-white/30">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Station info */}
          <div className={card} style={cardBg}>
            <h3 className="text-sm font-semibold text-white mb-4">Station Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['City',      waterData.City],
                ['Location',  waterData.Locations],
                ['Measures',  'Dissolved Oxygen (DO)'],
                ['Period',    '  '],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-white/25 text-xs mb-0.5">{k}</p>
                  <p className="text-white/70">{v}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Water