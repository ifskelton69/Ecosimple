import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAQI } from "../api.js"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Activity, ArrowLeft, AlertCircle, CheckCircle, XCircle, RefreshCw, MapPin, Wind, Home, Baby, Bike } from 'lucide-react'
import Navbar from "../Components/Navbar.jsx"

const getAQIConfig = (aqi) => {
  const configs = {
    1: { label: 'Good',      hex: '#22c55e', emoji: '😊', plain: 'Air is clean & fresh',    desc: 'Perfectly safe to breathe. Like standing in a forest after rain.', maskNeeded: false, windowsOpen: true,  kidsOutside: true,  exerciseOk: true  },
    2: { label: 'Fair',      hex: '#3b82f6', emoji: '🙂', plain: 'Air is mostly fine',       desc: 'Acceptable for most people. Sensitive individuals may notice mild effects.', maskNeeded: false, windowsOpen: true,  kidsOutside: true,  exerciseOk: true  },
    3: { label: 'Moderate',  hex: '#eab308', emoji: '😐', plain: 'Air quality is average',   desc: 'Some pollution present. Healthy adults are fine but take it easy outdoors.', maskNeeded: true,  windowsOpen: false, kidsOutside: false, exerciseOk: false },
    4: { label: 'Poor',      hex: '#f97316', emoji: '😷', plain: 'Air is unhealthy',         desc: 'Noticeable irritation likely. Stay indoors where possible and wear a mask.', maskNeeded: true,  windowsOpen: false, kidsOutside: false, exerciseOk: false },
    5: { label: 'Very Poor', hex: '#ef4444', emoji: '🚫', plain: 'Air is hazardous',         desc: 'Serious risk for everyone. Treat it like breathing smoke — stay inside.', maskNeeded: true,  windowsOpen: false, kidsOutside: false, exerciseOk: false },
  }
  return configs[aqi] || configs[4]
}

const getPollutantInfo = (name, value) => {
  const info = {
    'PM2.5': { what: 'Tiny dust particles',  safe: 12,   moderate: 35   },
    'PM10':  { what: 'Coarse dust & pollen', safe: 54,   moderate: 154  },
    'O3':    { what: 'Ground-level ozone',   safe: 54,   moderate: 70   },
    'NO2':   { what: 'Vehicle exhaust gas',  safe: 53,   moderate: 100  },
    'SO2':   { what: 'Industrial smoke',     safe: 35,   moderate: 75   },
    'CO':    { what: 'Carbon monoxide',      safe: 4400, moderate: 9400 },
  }
  const p = info[name]
  if (!p) return { what: name, status: 'Unknown', color: '#888' }
  if (value <= p.safe)     return { ...p, status: 'Safe',     color: '#22c55e' }
  if (value <= p.moderate) return { ...p, status: 'Moderate', color: '#eab308' }
  return                          { ...p, status: 'High',     color: '#ef4444' }
}

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

const AQI = () => {
  const navigate = useNavigate()
  const [aqiData, setAqiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchAQIData(pos.coords.latitude, pos.coords.longitude),
        () => fetchAQIData(19.076, 72.877)
      )
    } else {
      fetchAQIData(19.076, 72.877)
    }
  }, [])

  const fetchAQIData = async (lat = 19.076, lon = 72.877) => {
    setLoading(true); setError(null)
    try {
      const response = await getAQI(lat, lon)
      if (response.data.success) setAqiData(response.data)
      else setError('Failed to fetch data')
    } catch {
      setError('Cannot connect to backend. Make sure Flask server is running on localhost:5000')
    } finally { setLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a130a' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-t-[#08a728] border-white/10 animate-spin mx-auto mb-4" />
        <p className="text-white/50 text-sm">Loading AQI data...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a130a' }}>
      <div className="max-w-md w-full text-center p-8 rounded-2xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
        <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
        <h2 className="text-white text-xl font-bold mb-2">Connection Error</h2>
        <p className="text-white/40 text-sm mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => fetchAQIData()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#08a728' }}>
            <RefreshCw size={14} /> Retry
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 border border-white/10">
            Back
          </button>
        </div>
      </div>
    </div>
  )

  if (!aqiData?.data) return null

  const cfg = getAQIConfig(aqiData.data.aqi)
  const { data, recommendations } = aqiData

  const pollutants = [
    { name: 'PM2.5', value: data.pm2_5 },
    { name: 'PM10',  value: data.pm10  },
    { name: 'O3',    value: data.o3    },
    { name: 'NO2',   value: data.no2   },
    { name: 'SO2',   value: data.so2   },
    { name: 'CO',    value: data.co    },
  ]

  const card = "rounded-2xl border border-white/7 p-6"
  const cardBg = { background: 'rgba(255,255,255,0.03)' }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pb-16 text-white" style={{ background: '#0a130a' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
          .aqi-title { font-family: 'Syne', sans-serif; }
        `}</style>

        <div className="max-w-5xl mx-auto px-6 pt-28">

          {/* Back + Refresh */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={() => fetchAQIData(data.lat, data.lon)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/50 border border-white/10 hover:border-white/20 transition">
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Title */}
          <div className="mb-8">
            <p className="text-xs font-mono text-white/25 tracking-[3px] uppercase mb-2">◈ Air Quality</p>
            <h1 className="aqi-title text-4xl font-extrabold text-white">Air Quality Index</h1>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-white/30">
              <MapPin size={13} />
              <span>{data.lat.toFixed(3)}°, {data.lon.toFixed(3)}°</span>
            </div>
          </div>

          {/* Main AQI Card */}
          <div className={`${card} mb-5 flex items-center justify-between`} style={{ ...cardBg, borderColor: `${cfg.hex}30`, boxShadow: `0 0 40px ${cfg.hex}15` }}>
            <div className="flex items-center gap-8">
              <div className="text-6xl">{cfg.emoji}</div>
              <div>
                <div className="aqi-title text-6xl font-extrabold" style={{ color: cfg.hex }}>{data.aqi}</div>
                <div className="aqi-title text-xl font-semibold text-white mt-1">{cfg.plain}</div>
                <div className="text-sm text-white/40 mt-1">{cfg.desc}</div>
              </div>
            </div>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: `${cfg.hex}20`, color: cfg.hex }}>
              <Activity size={36} />
            </div>
          </div>

          {/* Quick indicators */}
          <div className="flex flex-wrap gap-3 mb-5">
            <IndicatorPill ok={!cfg.maskNeeded}  label="No mask needed"        icon={<Wind size={14} />} />
            <IndicatorPill ok={cfg.windowsOpen}  label="Open your windows"     icon={<Home size={14} />} />
            <IndicatorPill ok={cfg.kidsOutside}  label="Kids safe outside"     icon={<Baby size={14} />} />
            <IndicatorPill ok={cfg.exerciseOk}   label="Safe to exercise"      icon={<Bike size={14} />} />
          </div>

          {/* Alerts */}
          {recommendations.alerts.length > 0 && (
            <div className="mb-5 space-y-3">
              {recommendations.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.06)' }}>
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-300">{alert}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── BIG BOLD ADVICE SECTION ── */}
          <div className="grid md:grid-cols-2 gap-4 mb-5">

            {/* DO */}
            <div className="rounded-2xl p-8" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <CheckCircle size={18} className="text-green-400" />
                </div>
                <h3 className="aqi-title text-lg font-extrabold text-white">What To Do Today</h3>
              </div>
              <div className="space-y-4">
                {recommendations.actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.1)' }}>
                    <span className="text-green-400 font-black text-lg leading-none mt-0.5 shrink-0">→</span>
                    <span className="text-white/80 text-base font-medium leading-snug">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AVOID */}
            <div className="rounded-2xl p-8" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                  <XCircle size={18} className="text-red-400" />
                </div>
                <h3 className="aqi-title text-lg font-extrabold text-white">What To Avoid Today</h3>
              </div>
              {recommendations.avoid.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.avoid.map((a, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                      <span className="text-red-400 font-black text-lg leading-none mt-0.5 shrink-0">✕</span>
                      <span className="text-white/80 text-base font-medium leading-snug">{a}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-white/30 text-sm">
                  No restrictions today — enjoy the fresh air! 🎉
                </div>
              )}
            </div>
          </div>

          {/* Groups at risk */}
          {recommendations.groups_at_risk.length > 0 && (
            <div className={`${card} mb-5`} style={cardBg}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-orange-400" />
                <h3 className="aqi-title text-sm font-extrabold text-white">Who Should Be Extra Careful</h3>
              </div>
              <p className="text-xs text-white/30 mb-4">These groups are more sensitive to air pollution today:</p>
              <div className="flex flex-wrap gap-2">
                {recommendations.groups_at_risk.map((g, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-sm font-semibold text-orange-300 border border-orange-500/20" style={{ background: 'rgba(249,115,22,0.08)' }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pollutants */}
          <div className={`${card} mb-5`} style={cardBg}>
            <h3 className="aqi-title text-sm font-extrabold text-white mb-1">What's in the Air Right Now?</h3>
            <p className="text-xs text-white/30 mb-5">Each pollutant explained simply</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pollutants.map(({ name, value }) => {
                const info = getPollutantInfo(name, value)
                return (
                  <div key={name} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${info.color}25` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${info.color}20`, color: info.color }}>
                        {info.status}
                      </span>
                    </div>
                    <div className="aqi-title text-2xl font-bold mb-1" style={{ color: info.color }}>
                      {value.toFixed(1)}<span className="text-xs text-white/30 font-normal ml-1">µg/m³</span>
                    </div>
                    <p className="text-xs text-white/40">{info.what}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chart */}
          <div className={`${card} mb-5`} style={cardBg}>
            <h3 className="aqi-title text-sm font-extrabold text-white mb-1">Pollutant Levels — Visual</h3>
            <p className="text-xs text-white/30 mb-5">Lower bars are better</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pollutants}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#161f16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 13 }}
                  formatter={(v, _, props) => {
                    const info = getPollutantInfo(props.payload.name, v)
                    return [`${v.toFixed(2)} µg/m³ · ${info.status}`, info.what]
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pollutants.map(({ name, value }) => {
                    const info = getPollutantInfo(name, value)
                    return <rect key={name} fill={info.color} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AQI scale */}
          <div className={card} style={{ ...cardBg, borderColor: 'rgba(8,167,40,0.2)' }}>
            <div className="flex items-start gap-3">
              <Activity size={15} className="text-green-400 mt-0.5 shrink-0" />
              <div className="w-full">
                <p className="aqi-title text-sm font-extrabold text-white mb-1">How to read the AQI</p>
                <p className="text-xs text-white/40 mb-4">AQI goes from 1 (cleanest) to 5 (most polluted). Think of it like a health score for the air you breathe.</p>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { aqi: 1, label: 'Good',     hex: '#22c55e', desc: 'Fresh mountain air' },
                    { aqi: 2, label: 'Fair',      hex: '#3b82f6', desc: 'Normal city air' },
                    { aqi: 3, label: 'Moderate',  hex: '#eab308', desc: 'Slightly polluted' },
                    { aqi: 4, label: 'Poor',      hex: '#f97316', desc: 'Unhealthy for most' },
                    { aqi: 5, label: 'Very Poor', hex: '#ef4444', desc: 'Like breathing smoke' },
                  ].map(({ aqi, label, hex, desc }) => {
                    const active = data.aqi === aqi
                    return (
                      <div key={aqi} className="p-2 rounded-xl border text-xs text-center transition-all"
                        style={{
                          borderColor: active ? hex : `${hex}30`,
                          background: active ? `${hex}20` : `${hex}08`,
                          outline: active ? `2px solid ${hex}` : 'none',
                          outlineOffset: 2,
                          transform: active ? 'translateY(-3px)' : 'none'
                        }}>
                        <div className="aqi-title font-bold mb-0.5" style={{ color: hex }}>{aqi} — {label}</div>
                        <div className="text-white/40">{desc}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default AQI