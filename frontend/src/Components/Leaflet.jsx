import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapPin, RefreshCw, Loader } from "lucide-react"
import { getAQIForMultipleCities } from "../api"

// Fix broken marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Pulsing custom dot marker
const createPulseIcon = (color = "#16a34a") =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:14px; height:14px; border-radius:50%;
        background:${color};
        border:2px solid rgba(255,255,255,0.9);
        box-shadow:0 0 0 0 ${color};
        animation:leafletPulse 2s infinite;
      "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

// Cities to monitor - with coordinates
const CITIES = [
  { id: 1, name: "New Delhi", lat: 28.6139, lon: 77.2090 },
  { id: 2, name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { id: 3, name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { id: 4, name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { id: 5, name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { id: 6, name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { id: 7, name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { id: 8, name: "Pune", lat: 18.5204, lon: 73.8567 },
  { id: 9, name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { id: 10, name: "Los Angeles", lat: 34.0522, lon: -118.2437 },

  // 🇺🇸 USA
  { id: 11, name: "Washington, D.C.", lat: 38.9072, lon: -77.0369 },

  // 🇬🇧 UK
  { id: 12, name: "London", lat: 51.5074, lon: -0.1278 },

  // 🇫🇷 France
  { id: 13, name: "Paris", lat: 48.8566, lon: 2.3522 },

  // 🇩🇪 Germany
  { id: 14, name: "Berlin", lat: 52.5200, lon: 13.4050 },

  // 🇯🇵 Japan
  { id: 15, name: "Tokyo", lat: 35.6762, lon: 139.6503 },

  // 🇨🇳 China
  { id: 16, name: "Beijing", lat: 39.9042, lon: 116.4074 },

  // 🇷🇺 Russia
  { id: 17, name: "Moscow", lat: 55.7558, lon: 37.6173 },

  // 🇦🇺 Australia
  { id: 18, name: "Canberra", lat: -35.2809, lon: 149.1300 },

  // 🇨🇦 Canada
  { id: 19, name: "Ottawa", lat: 45.4215, lon: -75.6972 },

  // 🇧🇷 Brazil
  { id: 20, name: "Brasília", lat: -15.8267, lon: -47.9218 },

  // 🇮🇹 Italy
  { id: 21, name: "Rome", lat: 41.9028, lon: 12.4964 },

  // 🇪🇸 Spain
  { id: 22, name: "Madrid", lat: 40.4168, lon: -3.7038 },

  // 🇰🇷 South Korea
  { id: 23, name: "Seoul", lat: 37.5665, lon: 126.9780 },

  // 🇸🇬 Singapore
  { id: 24, name: "Singapore", lat: 1.3521, lon: 103.8198 },

  // 🇿🇦 South Africa
  { id: 25, name: "Pretoria", lat: -25.7479, lon: 28.2293 },

  // 🇦🇪 UAE
  { id: 26, name: "Abu Dhabi", lat: 24.4539, lon: 54.3773 },

  // 🇸🇦 Saudi Arabia
  { id: 27, name: "Riyadh", lat: 24.7136, lon: 46.6753 },

  // 🇹🇷 Turkey
  { id: 28, name: "Ankara", lat: 39.9334, lon: 32.8597 },

  // 🇲🇽 Mexico
  { id: 29, name: "Mexico City", lat: 19.4326, lon: -99.1332 },

  // 🇦🇷 Argentina
  { id: 30, name: "Buenos Aires", lat: -34.6037, lon: -58.3816 }
];

// Get AQI category and color
const getAQIConfig = (aqi) => {
  if (aqi === 1) return { label: "Good", color: "#16a34a", type: "good" }
  if (aqi === 2) return { label: "Fair", color: "#84cc16", type: "fair" }
  if (aqi === 3) return { label: "Moderate", color: "#f97316", type: "moderate" }
  if (aqi === 4) return { label: "Poor", color: "#ef4444", type: "unhealthy" }
  if (aqi === 5) return { label: "Very Poor", color: "#991b1b", type: "critical" }
  return { label: "Unknown", color: "#6b7280", type: "unknown" }
}

// Fly to user location
const FlyToLocation = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo(position, 12, { duration: 2 })
  }, [position, map])
  return null
}

export default function DynamicLeafletMap() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [userPos, setUserPos] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch real AQI data for all cities
  const fetchCitiesAQI = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const results = await getAQIForMultipleCities(CITIES)
      
      // Transform API data into hotspot format
      const transformedData = results.map(city => {
        if (!city.success || !city.aqiData) {
          return {
            id: city.id,
            pos: [city.lat, city.lon],
            label: city.name,
            aqi: 0,
            aqiValue: 0,
            pm25: 0,
            temp: 0,
            type: "unknown",
            color: "#6b7280",
            error: true
          }
        }

        const config = getAQIConfig(city.aqiData.aqi)
        
        return {
          id: city.id,
          pos: [city.lat, city.lon],
          label: city.name,
          aqi: city.aqiData.aqi,
          aqiValue: city.aqiData.aqi,
          pm25: city.aqiData.pm2_5,
          pm10: city.aqiData.pm10,
          o3: city.aqiData.o3,
          no2: city.aqiData.no2,
          so2: city.aqiData.so2,
          co: city.aqiData.co,
          temp: 25, // You can add weather API here
          type: config.type,
          color: config.color,
          aqiLabel: config.label,
          summary: city.recommendations?.summary || "",
          actions: city.recommendations?.actions || [],
          alerts: city.recommendations?.alerts || []
        }
      })
      
      setHotspots(transformedData)
    } catch (err) {
      console.error('Error fetching cities AQI:', err)
      setError('Failed to load AQI data')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    fetchCitiesAQI()
  }, [])

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Location access denied")
    )
  }

  const filtered = hotspots.filter((h) => {
    const matchSearch = h.label.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || h.type === filter
    return matchSearch && matchFilter
  })

  const filterOptions = ["all", "good", "fair", "moderate", "unhealthy", "critical"]

  const filterColors = {
    all: "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400",
    good: "bg-green-50 text-green-700 border-green-200 hover:border-green-400",
    fair: "bg-lime-50 text-lime-700 border-lime-200 hover:border-lime-400",
    moderate: "bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400",
    unhealthy: "bg-red-50 text-red-600 border-red-200 hover:border-red-400",
    critical: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400",
  }

  const filterActiveColors = {
    all: "bg-slate-200 text-slate-800 border-slate-400",
    good: "bg-green-100 text-green-800 border-green-500",
    fair: "bg-lime-100 text-lime-800 border-lime-500",
    moderate: "bg-orange-100 text-orange-700 border-orange-500",
    unhealthy: "bg-red-100 text-red-700 border-red-500",
    critical: "bg-rose-100 text-rose-800 border-rose-500",
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap');

        @keyframes leafletPulse {
          0%   { box-shadow: 0 0 0 0 currentColor; }
          70%  { box-shadow: 0 0 0 10px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }

        .map-font { font-family: 'Syne', sans-serif; }
        .mono-font { font-family: 'Space Mono', monospace; }

        .leaflet-container {
          height: 100% !important;
          background: #f1f5f9 !important;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.97) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          border-radius: 16px !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14) !important;
          color: #0f172a !important;
          font-family: 'Syne', sans-serif !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; padding: 16px !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-close-button {
          color: rgba(0,0,0,0.3) !important;
          top: 10px !important; right: 12px !important;
          font-size: 18px !important;
        }
      `}</style>

      <div className="map-font bg-slate-50 px-6 py-10 pb-16">

        {/* Header */}
        <div className="text-center mb-8">
         
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Air Quality Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-2 mono-font">Real-time AQI monitoring across major cities</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center max-w-5xl mx-auto mb-4">
          <input
            className="flex-1 min-w-[180px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition placeholder:text-slate-400 shadow-sm"
            placeholder="🔍  Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold capitalize transition-all shadow-sm
                ${filter === f ? filterActiveColors[f] : filterColors[f]}`}
            >
              {f}
            </button>
          ))}

          <button
            onClick={handleLocate}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-200 transition-all whitespace-nowrap flex items-center gap-2"
          >
            <MapPin size={16} /> Locate Me
          </button>

          <button
            onClick={fetchCitiesAQI}
            disabled={loading}
            className="px-4 py-2.5 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-green-200 transition-all whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-5xl mx-auto mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Map wrapper */}
        <div className="relative max-w-5xl mx-auto h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200">
          {loading && hotspots.length === 0 ? (
            <div className="flex items-center justify-center h-full bg-slate-100">
              <div className="text-center">
                <Loader className="animate-spin mx-auto mb-4 text-slate-400" size={48} />
                <p className="text-slate-500">Loading real-time AQI data...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={true}
              style={{ width: "100%", height: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              {/* User location */}
              {userPos && (
                <>
                  <FlyToLocation position={userPos} />
                  <Marker position={userPos} icon={createPulseIcon("#3b82f6")}>
                    <Popup>
                      <div className="text-slate-800">
                        <strong className="text-sm">📍 You are here</strong>
                        <div className="text-xs text-slate-400 mt-1">
                          {userPos[0].toFixed(4)}, {userPos[1].toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={userPos} radius={4000}
                    pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1 }}
                  />
                </>
              )}

              {/* City hotspots with REAL data */}
              {filtered.map((spot) => (
                <Marker key={spot.id} position={spot.pos} icon={createPulseIcon(spot.color)}>
                  <Popup>
                    <div style={{ minWidth: 200, color: "#0f172a" }}>
                      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
                        {spot.label}
                      </div>

                      {/* AQI row */}
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 12px",
                        background: `${spot.color}15`,
                        border: `1px solid ${spot.color}40`,
                        borderRadius: 10, marginBottom: 8
                      }}>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>AQI Level</span>
                        <span style={{ fontWeight: 800, fontSize: 22, color: spot.color }}>
                          {spot.aqi}
                        </span>
                      </div>

                      {/* Status */}
                      <div style={{
                        padding: "8px 12px",
                        background: "#f8fafc",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        marginBottom: 8
                      }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>STATUS</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: spot.color }}>
                          {spot.aqiLabel}
                        </div>
                        {spot.summary && (
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                            {spot.summary}
                          </div>
                        )}
                      </div>

                      {/* Pollutants */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 6,
                        marginBottom: 8
                      }}>
                        <div style={{ padding: 6, background: "#f8fafc", borderRadius: 6, fontSize: 10 }}>
                          <div style={{ color: "#94a3b8" }}>PM2.5</div>
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>{spot.pm25?.toFixed(1)}</div>
                        </div>
                        <div style={{ padding: 6, background: "#f8fafc", borderRadius: 6, fontSize: 10 }}>
                          <div style={{ color: "#94a3b8" }}>PM10</div>
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>{spot.pm10?.toFixed(1)}</div>
                        </div>
                        <div style={{ padding: 6, background: "#f8fafc", borderRadius: 6, fontSize: 10 }}>
                          <div style={{ color: "#94a3b8" }}>O3</div>
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>{spot.o3?.toFixed(1)}</div>
                        </div>
                        <div style={{ padding: 6, background: "#f8fafc", borderRadius: 6, fontSize: 10 }}>
                          <div style={{ color: "#94a3b8" }}>NO2</div>
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>{spot.no2?.toFixed(1)}</div>
                        </div>
                      </div>

                      {/* Top action */}
                      {spot.actions && spot.actions[0] && (
                        <div style={{
                          fontSize: 10,
                          color: "#64748b",
                          padding: 8,
                          background: "#f1f5f9",
                          borderRadius: 6
                        }}>
                          💡 {spot.actions[0]}
                        </div>
                      )}
                    </div>
                  </Popup>

                  <Circle
                    center={spot.pos} radius={80000}
                    pathOptions={{ color: spot.color, fillColor: spot.color, fillOpacity: 0.05, weight: 0.5 }}
                  />
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* AQI Legend overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-3 min-w-[190px] shadow-lg">
            <div className="mono-font text-[9px] text-slate-400 tracking-[2px] uppercase mb-2">
              AQI Scale
            </div>
            {[
              { color: "#16a34a", label: "Good (1)" },
              { color: "#84cc16", label: "Fair (2)" },
              { color: "#f97316", label: "Moderate (3)" },
              { color: "#ef4444", label: "Poor (4)" },
              { color: "#991b1b", label: "Very Poor (5)" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: l.color, boxShadow: `0 0 5px ${l.color}` }}
                />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar below map */}
        <div className="max-w-5xl mx-auto mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Cities Monitored", value: hotspots.length, color: "text-slate-700" },
            { label: "Critical Zones", value: hotspots.filter(h => h.type === "critical").length, color: "text-red-500" },
            { label: "Unhealthy Zones", value: hotspots.filter(h => h.type === "unhealthy").length, color: "text-orange-500" },
            { label: "Good Air Quality", value: hotspots.filter(h => h.type === "good").length, color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
              <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mono-font mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}