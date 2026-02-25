import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Wind, Droplets, ArrowRight, Volume2, TreePine, Thermometer, Eye, Gauge, CloudRain } from "lucide-react"
import Navbar from "../Components/Navbar"

// ── Weather Widget ─────────────────────────────────────
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [city, setCity] = useState('Pune')
  const [input, setInput] = useState('')

  const fetchWeather = async (cityName) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(cityName)}`
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      setWeather(data)
      setCity(cityName)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWeather('Pune') }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) { fetchWeather(input.trim()); setInput('') }
  }

  const getWeatherColor = (temp) => {
    if (temp >= 40) return '#ef4444'
    if (temp >= 32) return '#f97316'
    if (temp >= 22) return '#eab308'
    if (temp >= 15) return '#22c55e'
    return '#3b82f6'
  }

  return (
    <div className="rounded-2xl border border-white/7 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/30 tracking-widest uppercase font-mono">Live Weather</p>
          <p className="text-white font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>{city}</p>
        </div>
        {/* City search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search city..."
            className="text-xs px-3 py-1.5 rounded-lg outline-none text-white placeholder-white/20"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', width: 120 }}
          />
          <button type="submit"
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition"
            style={{ background: 'rgba(8,167,40,0.15)', border: '1px solid rgba(8,167,40,0.25)', color: '#4ade80' }}>
            Go
          </button>
        </form>
      </div>

      <div className="px-6 pb-6">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 rounded-full border-2 border-t-green-400 border-white/10 animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center h-32 text-white/30 text-sm">
            Could not load weather. Check city name.
          </div>
        )}

        {weather && !loading && !error && (() => {
          const temp = Math.round(weather.main?.temp)
          const feels = Math.round(weather.main?.feels_like)
          const humidity = weather.main?.humidity
          const windSpeed = weather.wind?.speed
          const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : '—'
          const pressure = weather.main?.pressure
          const desc = weather.weather?.[0]?.description
          const icon = weather.weather?.[0]?.icon
          const color = getWeatherColor(temp)

          return (
            <>
              {/* Main temp */}
              <div className="flex items-end justify-between mb-5">
                <div className="flex items-end gap-3">
                  {icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                      alt={desc}
                      className="w-14 h-14 -ml-2"
                    />
                  )}
                  <div>
                    <div className="text-5xl font-bold font-mono" style={{ color }}>{temp}°C</div>
                    <div className="text-xs text-white/40 mt-0.5 capitalize">{desc} · Feels {feels}°C</div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: <Droplets size={13} />,  label: 'Humidity',    value: `${humidity}%` },
                  { icon: <Wind size={13} />,       label: 'Wind',        value: `${windSpeed} m/s` },
                  { icon: <Eye size={13} />,         label: 'Visibility',  value: `${visibility} km` },
                  { icon: <Gauge size={13} />,       label: 'Pressure',    value: `${pressure}` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="rounded-xl p-3 text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-center text-white/30 mb-1">{icon}</div>
                    <div className="text-white font-semibold text-sm">{value}</div>
                    <div className="text-white/25 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()

  const cards = [
    {
      title: "Air Quality",
      subtitle: "Real-time AQI monitoring across cities",
      icon: <Wind size={28} />,
      path: "/aqi",
      color: "#08a728",
      glow: "rgba(8,167,40,0.15)",
      border: "rgba(8,167,40,0.2)",
      bg: "rgba(8,167,40,0.06)",
    },
    {
      title: "Water Quality",
      subtitle: "Track water safety and pollution levels",
      icon: <Droplets size={28} />,
      path: "/water",
      color: "#3b82f6",
      glow: "rgba(59,130,246,0.15)",
      border: "rgba(59,130,246,0.2)",
      bg: "rgba(59,130,246,0.06)",
    },
    {
      title: "Noise Pollution",
      subtitle: "Monitor noise levels across Pune stations",
      icon: <Volume2 size={28} />,
      path: "/noise",
      color: "#a855f7",
      glow: "rgba(168,85,247,0.15)",
      border: "rgba(168,85,247,0.2)",
      bg: "rgba(168,85,247,0.06)",
    },
    {
      title: "Forest Cover",
      subtitle: "Forest and tree cover across India & Maharashtra",
      icon: <TreePine size={28} />,
      path: "/forest",
      color: "#4ade80",
      glow: "rgba(74,222,128,0.15)",
      border: "rgba(74,222,128,0.2)",
      bg: "rgba(74,222,128,0.06)",
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 pt-28 pb-16" style={{ background: '#0a130a' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
          .dash-title { font-family: 'Syne', sans-serif; }
          .dash-body  { font-family: 'DM Sans', sans-serif; }
          .dash-card {
            position: relative;
            background: rgba(255,255,255,0.03);
            border-radius: 24px;
            padding: 32px 28px;
            cursor: pointer;
            transition: transform 0.25s, box-shadow 0.25s;
            text-align: left;
          }
          .dash-card:hover { transform: translateY(-5px); }
        `}</style>

        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="mb-10">
            <p className="text-xs font-mono text-white/25 tracking-[3px] uppercase mb-3">◈ Dashboard</p>
            <h1 className="dash-title text-4xl font-extrabold text-white">
              What do you want<br />to explore?
            </h1>
          </div>

          {/* Top: cards grid + weather widget side by side */}
          <div className="grid grid-cols-3 gap-5 mb-5">

            {/* Cards — 2 cols */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="dash-card"
                  style={{ border: `1px solid ${card.border}`, boxShadow: `0 0 40px ${card.glow}` }}
                  onClick={() => navigate(card.path)}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: card.bg, color: card.color }}>
                    {card.icon}
                  </div>
                  <h2 className="dash-title text-lg font-bold text-white mb-1">{card.title}</h2>
                  <p className="dash-body text-sm text-white/40 leading-relaxed mb-6">{card.subtitle}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: card.color }}>
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* Weather widget — 1 col */}
            <div className="col-span-1">
              <WeatherWidget />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Dashboard