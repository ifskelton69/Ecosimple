import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { ArrowLeft, TreePine, MapPin, Info } from 'lucide-react'

// ── India national breakdown (from CSV) ───────────────
const indiaBreakdown = [
  { name: 'Very Dense Forest',      area: 83502,   pct: 2.54,  color: '#14532d' },
  { name: 'Moderately Dense Forest',area: 318745,  pct: 9.70,  color: '#16a34a' },
  { name: 'Open Forest',            area: 295651,  pct: 8.99,  color: '#4ade80' },
  { name: 'Scrub',                  area: 41383,   pct: 1.26,  color: '#a3e635' },
  { name: 'Non Forest',             area: 2547982, pct: 77.51, color: '#1c2a1c' },
]

// ── Top 15 states by forest cover % (FSI 2021) ────────
const stateData = [
  { state: 'Mizoram',         pct: 85.41, area: 18005 },
  { state: 'Arunachal Pradesh', pct: 79.33, area: 66964 },
  { state: 'Meghalaya',       pct: 76.00, area: 17146 },
  { state: 'Manipur',         pct: 74.34, area: 17218 },
  { state: 'Nagaland',        pct: 73.90, area: 12486 },
  { state: 'Tripura',         pct: 73.68, area: 7726  },
  { state: 'Goa',             pct: 56.56, area: 2147  },
  { state: 'Sikkim',          pct: 47.31, area: 3341  },
  { state: 'Uttarakhand',     pct: 45.43, area: 24303 },
  { state: 'Himachal Pradesh',pct: 27.72, area: 15434 },
  { state: 'Chhattisgarh',    pct: 44.21, area: 55717 },
  { state: 'Odisha',          pct: 33.15, area: 51619 },
  { state: 'Maharashtra',     pct: 16.46, area: 50646 },
  { state: 'Karnataka',       pct: 20.19, area: 38730 },
  { state: 'Madhya Pradesh',  pct: 25.14, area: 77414 },
].sort((a, b) => b.pct - a.pct)

// Maharashtra specific data
const maharashtra = {
  treeCover: 9079,
  treePct: 2.95,
  forestCover: 50646,
  forestPct: 16.46,
  combined: 59725,
  combinedPct: 19.41,
  totalArea: 307713,
}

const Forest = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(null)

  const card = "rounded-2xl border border-white/7 p-6"
  const cardBg = { background: 'rgba(255,255,255,0.03)' }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload
      return (
        <div style={{ background: '#0d140e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#fff' }}>
          <div className="font-semibold mb-1">{d.name}</div>
          <div style={{ color: '#4ade80' }}>{d.pct}% of India</div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }}>{d.area?.toLocaleString()} sq. km</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen pb-16 text-white" style={{ background: '#050f05' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono&display=swap');
        .forest-title { font-family: 'Syne', sans-serif; }
        .forest-mono  { font-family: 'Space Mono', monospace; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 pt-28">

        {/* Back */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition mb-8">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs forest-mono text-white/25 tracking-[3px] uppercase mb-2">◈ Forest Cover</p>
          <h1 className="forest-title text-4xl font-extrabold text-white">Forest Cover Index</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/30">
            <span className="flex items-center gap-1.5"><MapPin size={13} />India & Maharashtra</span>
            <span className="flex items-center gap-1.5"><TreePine size={13} />FSI Report 2021</span>
          </div>
        </div>

        {/* India hero stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Total Forest Cover', value: '6,97,898', unit: 'sq. km', color: '#4ade80' },
            { label: '% of India\'s Area',  value: '21.23',    unit: '%',      color: '#4ade80' },
            { label: 'Non-Forest Land',    value: '77.51',    unit: '%',      color: '#f97316' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className={card} style={{ ...cardBg, borderColor: `${color}20` }}>
              <p className="text-xs text-white/25 mb-1">{label}</p>
              <div className="forest-mono text-3xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs text-white/30 mt-1">{unit}</div>
            </div>
          ))}
        </div>

        {/* Pie chart + breakdown */}
        <div className={`${card} mb-5`} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-6">India Land Use Breakdown</h3>
          <div className="grid grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={indiaBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={110}
                  dataKey="pct"
                  onMouseEnter={(_, i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  strokeWidth={0}
                >
                  {indiaBreakdown.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === i ? 1 : 0.4}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {indiaBreakdown.map(({ name, pct, area, color }) => (
                <div key={name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: color }} />
                    <span className="text-sm text-white/60 truncate">{name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="forest-mono text-sm font-bold text-white">{pct}%</span>
                    <div className="text-xs text-white/30">{area.toLocaleString()} km²</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maharashtra spotlight */}
        <div className={`${card} mb-5`} style={{ ...cardBg, borderColor: 'rgba(74,222,128,0.2)', boxShadow: '0 0 40px rgba(74,222,128,0.06)' }}>
          <div className="flex items-center gap-2 mb-5">
            <TreePine size={16} className="text-green-400" />
            <h3 className="text-sm font-semibold text-white">Maharashtra Spotlight</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Forest Cover',  value: maharashtra.forestCover.toLocaleString(), unit: 'sq. km', pct: maharashtra.forestPct, color: '#16a34a' },
              { label: 'Tree Cover',    value: maharashtra.treeCover.toLocaleString(),   unit: 'sq. km', pct: maharashtra.treePct,   color: '#4ade80' },
              { label: 'Combined',      value: maharashtra.combined.toLocaleString(),    unit: 'sq. km', pct: maharashtra.combinedPct, color: '#a3e635' },
              { label: 'Total Area',    value: maharashtra.totalArea.toLocaleString(),   unit: 'sq. km', pct: 100,                   color: '#ffffff' },
            ].map(({ label, value, unit, pct, color }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }}>
                <p className="text-xs text-white/30 mb-1">{label}</p>
                <div className="forest-mono text-xl font-bold" style={{ color }}>{pct}%</div>
                <div className="text-xs text-white/30 mt-0.5">{value} {unit}</div>
              </div>
            ))}
          </div>

          {/* Maharashtra progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-white/30 mb-2">
              <span>Land use distribution</span>
              <span>{maharashtra.totalArea.toLocaleString()} sq. km total</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ width: `${maharashtra.forestPct}%`, background: '#16a34a' }} title={`Forest: ${maharashtra.forestPct}%`} />
              <div style={{ width: `${maharashtra.treePct}%`, background: '#4ade80' }} title={`Tree: ${maharashtra.treePct}%`} />
              <div style={{ width: `${100 - maharashtra.combinedPct}%`, background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-white/30">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#16a34a' }} />Forest {maharashtra.forestPct}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#4ade80' }} />Trees {maharashtra.treePct}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'rgba(255,255,255,0.1)' }} />Other {(100 - maharashtra.combinedPct).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* State comparison bar chart */}
        <div className={`${card} mb-5`} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-1">State-wise Forest Cover</h3>
          <p className="text-xs text-white/25 mb-5">% of state geographical area · Maharashtra highlighted</p>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={stateData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0, 90]} stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 10 }}
                tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="state" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 11 }} width={130} />
              <Tooltip
                contentStyle={{ background: '#0d140e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 12 }}
                formatter={(v, _, props) => [`${v}% · ${props.payload.area.toLocaleString()} km²`]}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {stateData.map((d, i) => (
                  <Cell key={i} fill={d.state === 'Maharashtra' ? '#f97316' : '#16a34a'} opacity={d.state === 'Maharashtra' ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-white/30">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-green-700" />Other states</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-orange-500" />Maharashtra</span>
          </div>
        </div>

        {/* Info card */}
        <div className={card} style={{ ...cardBg, borderColor: 'rgba(59,130,246,0.2)' }}>
          <div className="flex items-start gap-3">
            <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white mb-3">Forest Cover Classification</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { l: 'Very Dense Forest',       d: 'Canopy density > 70%',  c: '#14532d' },
                  { l: 'Moderately Dense Forest', d: 'Canopy density 40–70%', c: '#16a34a' },
                  { l: 'Open Forest',             d: 'Canopy density 10–40%', c: '#4ade80' },
                ].map(({ l, d, c }) => (
                  <div key={l} className="p-3 rounded-xl border text-xs" style={{ borderColor: `${c}30`, background: `${c}10` }}>
                    <div className="font-semibold mb-1" style={{ color: c }}>{l}</div>
                    <div className="text-white/40">{d}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/25 mt-3">Source: Forest Survey of India (FSI) — India State of Forest Report 2021</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Forest