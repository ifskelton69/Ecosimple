import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { Volume2, ArrowLeft, MapPin, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'

// ── Noise level config ─────────────────────────────────
const getNoiseConfig = (db) => {
  if (db >= 80)  return { level: 'Hazardous',   hex: '#ef4444', emoji: '🔴' }
  if (db >= 70)  return { level: 'Very Loud',   hex: '#f97316', emoji: '🟠' }
  if (db >= 60)  return { level: 'Loud',        hex: '#eab308', emoji: '🟡' }
  if (db >= 50)  return { level: 'Moderate',    hex: '#22c55e', emoji: '🟢' }
  return               { level: 'Quiet',        hex: '#3b82f6', emoji: '🔵' }
}

// ── WHO limits by zone ─────────────────────────────────
const WHO_LIMITS = {
  Commercial:  { day: 65, night: 55 },
  Residential: { day: 55, night: 45 },
  Silence:     { day: 50, night: 40 },
  Industrial:  { day: 75, night: 70 },
}

// ── Static data from CSV ───────────────────────────────
const noiseData = [
  { location: "Indradhnushya Env. Center", type: "Commercial", avg: 69.86, "16-Mar": 69.21, "16-Apr": 67.59, "16-May": 67.11, "16-Jun": 64.94, "16-Jul": 65.66, "16-Aug": 72.14, "16-Sep": 73.1,  "16-Oct": 71.46, "16-Nov": 73.11, "16-Dec": 72.63, "17-Jan": 71.46, "17-Feb": 69.93 },
  { location: "Nal Stop",                  type: "Commercial", avg: 72.17, "16-Mar": 71.3,  "16-Apr": 71.49, "16-May": 68.44, "16-Jun": 71.6,  "16-Jul": 74.38, "16-Aug": 75.97, "16-Sep": 75.44, "16-Oct": 69.53, "16-Nov": 73.43, "16-Dec": 71.69, "17-Jan": 71.8,  "17-Feb": 70.98 },
  { location: "RTO",                       type: "Commercial", avg: 73.59, "16-Mar": 78.11, "16-Apr": 78.16, "16-May": 70.89, "16-Jun": 77.77, "16-Jul": 76.1,  "16-Aug": 69.4,  "16-Sep": 74.29, "16-Oct": 68.93, "16-Nov": 69.65, "16-Dec": 72.8,  "17-Jan": 73.26, "17-Feb": 73.74 },
  { location: "Swargate",                  type: "Commercial", avg: 72.51, "16-Mar": 75.33, "16-Apr": 73.97, "16-May": 74.38, "16-Jun": 76.67, "16-Jul": 73.13, "16-Aug": 71.49, "16-Sep": 71.31, "16-Oct": 68.53, "16-Nov": 73.69, "16-Dec": 69.23, "17-Jan": 68.4,  "17-Feb": 73.95 },
  { location: "Mandai",                    type: "Commercial", avg: 69.66, "16-Mar": 70.68, "16-Apr": 71.31, "16-May": 73.53, "16-Jun": 68.19, "16-Jul": 66.3,  "16-Aug": 67.27, "16-Sep": 71.3,  "16-Oct": 65.6,  "16-Nov": 77.51, "16-Dec": 64.62, "17-Jan": 68.17, "17-Feb": 71.39 },
  { location: "Near E Square",             type: "Commercial", avg: 70.26, "16-Mar": 68.91, "16-Apr": 68.8,  "16-May": 70.11, "16-Jun": 69.71, "16-Jul": 70.4,  "16-Aug": 71.14, "16-Sep": 72.08, "16-Oct": 69.43, "16-Nov": 75.85, "16-Dec": 66.88, "17-Jan": 68.94, "17-Feb": 70.88 },
  { location: "Bremen Chowk",              type: "Commercial", avg: 72.16, "16-Mar": 73.09, "16-Apr": 72.97, "16-May": 72.11, "16-Jun": 72.4,  "16-Jul": 74.31, "16-Aug": 68.81, "16-Sep": 70.81, "16-Oct": 67.69, "16-Nov": 69.81, "16-Dec": 73.33, "17-Jan": 76.1,  "17-Feb": 74.54 },
  { location: "Ambedkar Chowk",            type: "Commercial", avg: 71.11, "16-Mar": 73.22, "16-Apr": 70.13, "16-May": 71.91, "16-Jun": 72.16, "16-Jul": 66.79, "16-Aug": 68.37, "16-Sep": 70.21, "16-Oct": 70.88, "16-Nov": 67.95, "16-Dec": 74.79, "17-Jan": 74.67, "17-Feb": 72.29 },
  { location: "Wadgaon Bk.(NH4)",          type: "Commercial", avg: 67.98, "16-Mar": 61.83, "16-Apr": 61.01, "16-May": 66.61, "16-Jun": 68.02, "16-Jul": 68.46, "16-Aug": 67.2,  "16-Sep": 69.98, "16-Oct": 72.87, "16-Nov": 72.19, "16-Dec": 74.29, "17-Jan": 68.87, "17-Feb": 64.4  },
  { location: "Pashan (NH4)",              type: "Commercial", avg: 69.86, "16-Mar": 66.9,  "16-Apr": 65.53, "16-May": 72.89, "16-Jun": 71.54, "16-Jul": 72.81, "16-Aug": 72.02, "16-Sep": 69.29, "16-Oct": 70.21, "16-Nov": 71.69, "16-Dec": 73.1,  "17-Jan": 67.08, "17-Feb": 65.2  },
  { location: "Near MPCB Office",          type: "Commercial", avg: 73.18, "16-Mar": 76.31, "16-Apr": 76.49, "16-May": 72.99, "16-Jun": 74.1,  "16-Jul": 71.51, "16-Aug": 74.13, "16-Sep": 69.06, "16-Oct": 71.88, "16-Nov": 72.58, "16-Dec": 69.91, "17-Jan": 72.61, "17-Feb": 76.56 },
  { location: "KK Market",                 type: "Commercial", avg: 73.45, "16-Mar": 77.49, "16-Apr": 75.56, "16-May": 72.48, "16-Jun": 72.59, "16-Jul": 71.78, "16-Aug": 71.21, "16-Sep": 72.81, "16-Oct": 71.9,  "16-Nov": 78.31, "16-Dec": 71.2,  "17-Jan": 73.18, "17-Feb": 72.86 },
  { location: "Rajiv Gandhi Bridge",       type: "Commercial", avg: 69.62, "16-Mar": 71.06, "16-Apr": 60.65, "16-May": 71.64, "16-Jun": 72.34, "16-Jul": 68.94, "16-Aug": 68.33, "16-Sep": 69.1,  "16-Oct": 67.96, "16-Nov": 72.24, "16-Dec": 71.19, "17-Jan": 71.3,  "17-Feb": 70.64 },
  { location: "Harrison Bridge",           type: "Commercial", avg: 71.54, "16-Mar": 70.44, "16-Apr": 71.17, "16-May": 70.61, "16-Jun": 72.26, "16-Jul": 74.4,  "16-Aug": 70.88, "16-Sep": 74.11, "16-Oct": 69.14, "16-Nov": 74.38, "16-Dec": 72.1,  "17-Jan": 69.99, "17-Feb": 69.03 },
  { location: "Near PMC Building",         type: "Commercial", avg: 70.89, "16-Mar": 68.61, "16-Apr": 68.34, "16-May": 70.83, "16-Jun": 72.9,  "16-Jul": 72.21, "16-Aug": 68.41, "16-Sep": 72.6,  "16-Oct": 68.73, "16-Nov": 75.81, "16-Dec": 67.11, "17-Jan": 73.37, "17-Feb": 71.78 },
  { location: "Kamgar Statue",             type: "Commercial", avg: 71.03, "16-Mar": 70.7,  "16-Apr": 70.5,  "16-May": 66.83, "16-Jun": 71.93, "16-Jul": 68.45, "16-Aug": 68.81, "16-Sep": 73.61, "16-Oct": 71.88, "16-Nov": 75.36, "16-Dec": 69.32, "17-Jan": 73.66, "17-Feb": 71.34 },
  { location: "Sant Dnyaneshwar Ghat",     type: "Residential", avg: 66.75, "16-Mar": 71.37, "16-Apr": 67.67, "16-May": 62.96, "16-Jun": 68.38, "16-Jul": 68.01, "16-Aug": 67.01, "16-Sep": 67.21, "16-Oct": 59.54, "16-Nov": 67.44, "16-Dec": 64.07, "17-Jan": 66.8,  "17-Feb": 70.54 },
  { location: "Near Ramoshi Gate",         type: "Residential", avg: 64.76, "16-Mar": 66.09, "16-Apr": 68.57, "16-May": 61.38, "16-Jun": 65.97, "16-Jul": 62.31, "16-Aug": 66.19, "16-Sep": 66.86, "16-Oct": 66.32, "16-Nov": 67.19, "16-Dec": 60.72, "17-Jan": 63.2,  "17-Feb": 62.33 },
  { location: "Pulachiwadi",               type: "Residential", avg: 62.39, "16-Mar": 60.61, "16-Apr": 63.1,  "16-May": 61.6,  "16-Jun": 64.56, "16-Jul": 61.84, "16-Aug": 60.97, "16-Sep": 62.84, "16-Oct": 65.73, "16-Nov": 66.23, "16-Dec": 60.02, "17-Jan": 59.81, "17-Feb": 61.43 },
  { location: "Sant Malimaharaj Ghat",     type: "Residential", avg: 61.93, "16-Mar": 59.48, "16-Apr": 64.1,  "16-May": 56.42, "16-Jun": 60.42, "16-Jul": 65.63, "16-Aug": 64.84, "16-Sep": 61.38, "16-Oct": 66.04, "16-Nov": 65.75, "16-Dec": 61.06, "17-Jan": 58.87, "17-Feb": 59.2  },
  { location: "Katraj Lake",               type: "Residential", avg: 60.81, "16-Mar": 54.93, "16-Apr": 58.24, "16-May": 56.6,  "16-Jun": 61.86, "16-Jul": 63.44, "16-Aug": 66.81, "16-Sep": 61.44, "16-Oct": 63.42, "16-Nov": 62.21, "16-Dec": 60.17, "17-Jan": 59.09, "17-Feb": 61.51 },
  { location: "Near Phadke Houd",          type: "Residential", avg: 62.64, "16-Mar": 59.3,  "16-Apr": 59.4,  "16-May": 63.21, "16-Jun": 62.14, "16-Jul": 63.59, "16-Aug": 66.54, "16-Sep": 59.33, "16-Oct": 63.41, "16-Nov": 63.65, "16-Dec": 59.19, "17-Jan": 65.17, "17-Feb": 66.78 },
  { location: "Erandwane",                 type: "Residential", avg: 63.15, "16-Mar": 60.21, "16-Apr": 60.46, "16-May": 65.07, "16-Jun": 56.19, "16-Jul": 59.06, "16-Aug": 67.74, "16-Sep": 67.93, "16-Oct": 68.23, "16-Nov": 64.06, "16-Dec": 66.49, "17-Jan": 65.36, "17-Feb": 56.99 },
  { location: "Khadakwasla",               type: "Residential", avg: 64.31, "16-Mar": 60,    "16-Apr": 60.76, "16-May": 63.14, "16-Jun": 68.12, "16-Jul": 66.56, "16-Aug": 68.01, "16-Sep": 68.82, "16-Oct": 64.83, "16-Nov": 63.71, "16-Dec": 62.76, "17-Jan": 65.18, "17-Feb": 59.88 },
  { location: "Raja Ram Bridge",           type: "Residential", avg: 67.16, "16-Mar": 76.62, "16-Apr": 73.97, "16-May": 62.57, "16-Jun": 61.73, "16-Jul": 60.89, "16-Aug": 62.39, "16-Sep": 65.02, "16-Oct": 67.16, "16-Nov": 72.24, "16-Dec": 69.37, "17-Jan": 63.4,  "17-Feb": 70.58 },
  { location: "Ramvadi Octroi Naka",       type: "Residential", avg: 66.41, "16-Mar": 76.11, "16-Apr": 74.53, "16-May": 64.21, "16-Jun": 63.5,  "16-Jul": 61.05, "16-Aug": 59.9,  "16-Sep": 67.09, "16-Oct": 71.41, "16-Nov": 70.73, "16-Dec": 67.78, "17-Jan": 54.82, "17-Feb": 65.84 },
  { location: "Poona Hospital",            type: "Silence",     avg: 54.87, "16-Mar": 48.86, "16-Apr": 51.71, "16-May": 51.79, "16-Jun": 54.98, "16-Jul": 60.55, "16-Aug": 63.71, "16-Sep": 58.78, "16-Oct": 56.9,  "16-Nov": 55.76, "16-Dec": 52.43, "17-Jan": 50.94, "17-Feb": 52.05 },
  { location: "Sasoon Hospital",           type: "Silence",     avg: 58.64, "16-Mar": 56.94, "16-Apr": 55.97, "16-May": 58.03, "16-Jun": 59.22, "16-Jul": 58.16, "16-Aug": 57.12, "16-Sep": 59.53, "16-Oct": 59.91, "16-Nov": 62.41, "16-Dec": 61.58, "17-Jan": 57.57, "17-Feb": 57.29 },
  { location: "N.M.V. School",             type: "Silence",     avg: 59.1,  "16-Mar": 58.01, "16-Apr": 61.24, "16-May": 62.35, "16-Jun": 62.42, "16-Jul": 58.8,  "16-Aug": 59.39, "16-Sep": 58.76, "16-Oct": 55.87, "16-Nov": 62.7,  "16-Dec": 58.71, "17-Jan": 56.32, "17-Feb": 54.59 },
  { location: "Pune University",           type: "Silence",     avg: 64.52, "16-Mar": 70.18, "16-Apr": 66.23, "16-May": 57.3,  "16-Jun": 62.96, "16-Jul": 60.61, "16-Aug": 63.08, "16-Sep": 65.37, "16-Oct": 58.72, "16-Nov": 64.66, "16-Dec": 67.53, "17-Jan": 69.19, "17-Feb": 68.45 },
  { location: "Naidu Hospital",            type: "Silence",     avg: 58.23, "16-Mar": 56.99, "16-Apr": 59,    "16-May": 53.96, "16-Jun": 59.37, "16-Jul": 55.44, "16-Aug": 55.8,  "16-Sep": 63.61, "16-Oct": 57.34, "16-Nov": 58.96, "16-Dec": 55.91, "17-Jan": 58.01, "17-Feb": 64.31 },
  { location: "Chirag Industrial",         type: "Industrial",  avg: 76.1,  "16-Mar": 75.28, "16-Apr": 75.77, "16-May": 76.37, "16-Jun": 76.77, "16-Jul": 76.01, "16-Aug": 77.91, "16-Sep": 76.28, "16-Oct": 76.31, "16-Nov": 76.95, "16-Dec": 76.62, "17-Jan": 74.46, "17-Feb": 74.53 },
  { location: "Cabinet Systems",           type: "Industrial",  avg: 76.37, "16-Mar": 75.98, "16-Apr": 74.94, "16-May": 75.67, "16-Jun": 75.54, "16-Jul": 76.8,  "16-Aug": 77.33, "16-Sep": 77.26, "16-Oct": 77.8,  "16-Nov": 77.35, "16-Dec": 77.12, "17-Jan": 74.69, "17-Feb": 75.99 },
  { location: "Kirloskar Foundry",         type: "Industrial",  avg: 76.3,  "16-Mar": 75.74, "16-Apr": 76.33, "16-May": 76.3,  "16-Jun": 77.53, "16-Jul": 77.34, "16-Aug": 76.91, "16-Sep": 76.32, "16-Oct": 76.64, "16-Nov": 76.54, "16-Dec": 74.3,  "17-Jan": 74.92, "17-Feb": 76.73 },
  { location: "Honeywell Automation",      type: "Industrial",  avg: 76.75, "16-Mar": 76.52, "16-Apr": 75.84, "16-May": 76.83, "16-Jun": 77.12, "16-Jul": 77.99, "16-Aug": 76.33, "16-Sep": 76.33, "16-Oct": 77.04, "16-Nov": 78,    "16-Dec": 76.86, "17-Jan": 76.28, "17-Feb": 75.8  },
  { location: "Vanaz Engineers",           type: "Industrial",  avg: 76.75, "16-Mar": 74.36, "16-Apr": 72.99, "16-May": 74.12, "16-Jun": 76.68, "16-Jul": 75.83, "16-Aug": 75.83, "16-Sep": 76,    "16-Oct": 77.31, "16-Nov": 77.1,  "16-Dec": 76.31, "17-Jan": 75.96, "17-Feb": 73.29 },
]

const MONTHS = ['16-Mar','16-Apr','16-May','16-Jun','16-Jul','16-Aug','16-Sep','16-Oct','16-Nov','16-Dec','17-Jan','17-Feb']
const MONTH_LABELS = { '16-Mar':'Mar','16-Apr':'Apr','16-May':'May','16-Jun':'Jun','16-Jul':'Jul','16-Aug':'Aug','16-Sep':'Sep','16-Oct':'Oct','16-Nov':'Nov','16-Dec':'Dec','17-Jan':'Jan','17-Feb':'Feb' }
const ZONE_COLORS = { Commercial: '#f97316', Residential: '#22c55e', Silence: '#3b82f6', Industrial: '#ef4444' }

const Noise = () => {
  const navigate = useNavigate()
  const [selectedZone, setSelectedZone] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState(noiseData[0])

  const zones = ['All', 'Commercial', 'Residential', 'Silence', 'Industrial']
  const filtered = selectedZone === 'All' ? noiseData : noiseData.filter(d => d.type === selectedZone)

  // Zone averages for radar
  const zoneAvgs = ['Commercial','Residential','Silence','Industrial'].map(z => ({
    zone: z,
    avg: +(noiseData.filter(d => d.type === z).reduce((s,d) => s + d.avg, 0) / noiseData.filter(d => d.type === z).length).toFixed(1)
  }))

  // Monthly trend for selected location
  const monthlyTrend = MONTHS.map(m => ({ m: MONTH_LABELS[m], db: selectedLocation[m] }))

  const cfg = getNoiseConfig(selectedLocation.avg)
  const limit = WHO_LIMITS[selectedLocation.type]
  const overLimit = selectedLocation.avg > limit.day

  // Overall city avg
  const cityAvg = +(noiseData.reduce((s,d) => s + d.avg, 0) / noiseData.length).toFixed(1)
  const loudest = [...noiseData].sort((a,b) => b.avg - a.avg)[0]
  const quietest = [...noiseData].sort((a,b) => a.avg - b.avg)[0]

  const card = "rounded-2xl border border-white/7 p-6"
  const cardBg = { background: 'rgba(255,255,255,0.03)' }

  return (
    <div className="min-h-screen pb-16 text-white" style={{ background: '#0a0a0f' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono&display=swap');
        .noise-title { font-family: 'Syne', sans-serif; }
        .noise-mono  { font-family: 'Space Mono', monospace; }
        .loc-btn { transition: all 0.15s; }
        .loc-btn:hover { background: rgba(255,255,255,0.07); }
        .loc-btn.active { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .zone-tab { transition: all 0.15s; border: 1px solid transparent; border-radius: 999px; padding: 6px 14px; font-size: 13px; cursor: pointer; }
        .zone-tab:hover { background: rgba(255,255,255,0.06); }
        .zone-tab.active { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 pt-28">

        {/* Back */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition mb-8">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs noise-mono text-white/25 tracking-[3px] uppercase mb-2">◈ Noise Pollution</p>
          <h1 className="noise-title text-4xl font-extrabold text-white">Noise Quality Index</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/30">
            <span className="flex items-center gap-1.5"><MapPin size={13} />Pune</span>
            <span className="flex items-center gap-1.5"><Volume2 size={13} />{noiseData.length} monitoring stations</span>
          </div>
        </div>

        {/* City summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className={card} style={{ ...cardBg, borderColor: 'rgba(249,115,22,0.25)', boxShadow: '0 0 30px rgba(249,115,22,0.08)' }}>
            <p className="text-xs text-white/25 mb-1">City Average</p>
            <div className="noise-mono text-4xl font-bold text-orange-400">{cityAvg}</div>
            <div className="text-xs text-white/30 mt-1">dB(A)</div>
          </div>
          <div className={card} style={cardBg}>
            <p className="text-xs text-white/25 mb-1">Loudest Station</p>
            <div className="text-lg font-bold text-red-400 leading-tight">{loudest.location}</div>
            <div className="noise-mono text-sm text-white/40 mt-1">{loudest.avg} dB · {loudest.type}</div>
          </div>
          <div className={card} style={cardBg}>
            <p className="text-xs text-white/25 mb-1">Quietest Station</p>
            <div className="text-lg font-bold text-blue-400 leading-tight">{quietest.location}</div>
            <div className="noise-mono text-sm text-white/40 mt-1">{quietest.avg} dB · {quietest.type}</div>
          </div>
        </div>

        {/* Zone average radar */}
        <div className={`${card} mb-5`} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-4">Average by Zone Type</h3>
          <div className="grid grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={zoneAvgs}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="zone" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[40, 85]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                <Radar dataKey="avg" stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {zoneAvgs.map(({ zone, avg }) => (
                <div key={zone} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[zone] }} />
                    <span className="text-sm text-white/60">{zone}</span>
                  </div>
                  <span className="noise-mono text-sm font-bold" style={{ color: ZONE_COLORS[zone] }}>{avg} dB</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone filter + location list + detail */}
        <div className="grid grid-cols-5 gap-4 mb-5">

          {/* Left: location list */}
          <div className={`${card} col-span-2`} style={{ ...cardBg, padding: '20px 16px' }}>
            {/* Zone tabs */}
            <div className="flex flex-wrap gap-1 mb-4">
              {zones.map(z => (
                <button key={z} className={`zone-tab text-white/50 ${selectedZone === z ? 'active text-white' : ''}`}
                  onClick={() => setSelectedZone(z)}>
                  {z}
                </button>
              ))}
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
              {filtered.map(d => (
                <button key={d.location}
                  onClick={() => setSelectedLocation(d)}
                  className={`loc-btn w-full text-left px-3 py-2.5 rounded-xl border border-transparent ${selectedLocation.location === d.location ? 'active' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70 leading-tight">{d.location}</span>
                    <span className="noise-mono text-xs ml-2 shrink-0" style={{ color: ZONE_COLORS[d.type] }}>{d.avg}</span>
                  </div>
                  <div className="text-xs text-white/25 mt-0.5">{d.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: selected location detail */}
          <div className="col-span-3 space-y-4">

            {/* Hero */}
            <div className={card} style={{ ...cardBg, borderColor: `${cfg.hex}30`, boxShadow: `0 0 30px ${cfg.hex}10` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-white/30 mb-1">{selectedLocation.type} Zone</p>
                  <h2 className="noise-title text-xl font-bold text-white leading-tight">{selectedLocation.location}</h2>
                </div>
                <div className="text-3xl">{cfg.emoji}</div>
              </div>
              <div className="flex items-end gap-3">
                <div className="noise-mono text-5xl font-bold" style={{ color: cfg.hex }}>{selectedLocation.avg}</div>
                <div className="pb-1">
                  <div className="text-white/30 text-sm">dB(A)</div>
                  <div className="text-sm font-semibold" style={{ color: cfg.hex }}>{cfg.level}</div>
                </div>
              </div>
              {/* WHO limit indicator */}
              <div className={`mt-4 px-3 py-2 rounded-xl text-xs flex items-center gap-2 ${overLimit ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                {overLimit ? '⚠️ Exceeds WHO day limit' : '✅ Within WHO day limit'} ({limit.day} dB for {selectedLocation.type})
              </div>
            </div>

            {/* Monthly mini chart */}
            <div className={card} style={cardBg}>
              <p className="text-xs text-white/30 mb-3">Monthly Readings (dB)</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={monthlyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="m" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 10 }} domain={['auto','auto']} />
                  <Tooltip
                    contentStyle={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 12 }}
                    formatter={(v) => [`${v?.toFixed(1)} dB`]}
                  />
                  <Bar dataKey="db" fill={cfg.hex} radius={[4,4,0,0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* All locations bar chart */}
        <div className={`${card} mb-5`} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-1">All Stations — Average dB</h3>
          <p className="text-xs text-white/25 mb-5">Sorted by noise level</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={[...noiseData].sort((a,b) => b.avg - a.avg).map(d => ({ name: d.location.slice(0,18), db: d.avg, type: d.type }))}
              layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[40, 85]} stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 9 }} width={110} />
              <Tooltip
                contentStyle={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 12 }}
                formatter={(v) => [`${v?.toFixed(1)} dB`]}
              />
              <Bar dataKey="db" radius={[0,4,4,0]}>
                {[...noiseData].sort((a,b) => b.avg - a.avg).map((d, i) => (
                  <rect key={i} fill={ZONE_COLORS[d.type]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {Object.entries(ZONE_COLORS).map(([zone, color]) => (
              <div key={zone} className="flex items-center gap-1.5 text-xs text-white/40">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                {zone}
              </div>
            ))}
          </div>
        </div>

        {/* Scale info */}
        <div className={card} style={{ ...cardBg, borderColor: 'rgba(59,130,246,0.2)' }}>
          <div className="flex items-start gap-3">
            <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white mb-3">Noise Level Scale & WHO Standards</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { l: 'Quiet',      r: '<50 dB',   c: '#3b82f6' },
                  { l: 'Moderate',   r: '50–60 dB', c: '#22c55e' },
                  { l: 'Loud',       r: '60–70 dB', c: '#eab308' },
                  { l: 'Very Loud',  r: '70–80 dB', c: '#f97316' },
                  { l: 'Hazardous',  r: '>80 dB',   c: '#ef4444' },
                ].map(({ l, r, c }) => (
                  <div key={l} className="p-2 rounded-xl border text-xs" style={{ borderColor: `${c}30`, background: `${c}10` }}>
                    <div className="font-semibold mb-0.5" style={{ color: c }}>{l}</div>
                    <div className="text-white/40">{r}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(WHO_LIMITS).map(([zone, { day, night }]) => (
                  <div key={zone} className="p-2 rounded-xl border border-white/5 text-xs" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="font-semibold text-white/60 mb-0.5">{zone}</div>
                    <div className="text-white/30">Day: {day} dB</div>
                    <div className="text-white/30">Night: {night} dB</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Noise