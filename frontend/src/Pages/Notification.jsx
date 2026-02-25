import { useState } from 'react'

const INITIAL_NOTIFICATIONS = [
  // ── HAZARDOUS WEATHER ──────────────────────────────────────────
  {
    id: 1,
    type: 'weather',
    severity: 'critical',
    icon: '🌪️',
    title: 'Cyclone Warning — Pune Region',
    desc: 'A severe cyclonic storm is expected to make landfall within 24 hours. Winds up to 140 km/h. Stay indoors, avoid coastal areas.',
    time: '2 min ago',
    read: false,
    tag: 'Weather Alert',
  },
  {
    id: 2,
    type: 'weather',
    severity: 'high',
    icon: '🌡️',
    title: 'Extreme Heat Advisory',
    desc: 'Temperatures forecast to reach 46°C today. Avoid outdoor activity between 11 AM – 4 PM. Stay hydrated.',
    time: '18 min ago',
    read: false,
    tag: 'Weather Alert',
  },
  {
    id: 3,
    type: 'weather',
    severity: 'medium',
    icon: '⛈️',
    title: 'Heavy Rainfall Expected',
    desc: 'IMD forecasts 80–120mm rainfall over the next 6 hours. Risk of waterlogging in low-lying areas.',
    time: '1 hr ago',
    read: true,
    tag: 'Weather Alert',
  },

  // ── AQI ────────────────────────────────────────────────────────
  {
    id: 4,
    type: 'aqi',
    severity: 'critical',
    icon: '😷',
    title: 'AQI Hazardous — 385 AQI',
    desc: 'Air quality has reached hazardous levels. PM2.5 at 385µg/m³. Wear N95 masks, keep windows closed, avoid all outdoor activity.',
    time: '5 min ago',
    read: false,
    tag: 'Air Quality',
  },
  {
    id: 5,
    type: 'aqi',
    severity: 'high',
    icon: '🏭',
    title: 'Very Unhealthy AQI — 220',
    desc: 'AQI has crossed 200. Sensitive groups including children, elderly, and those with respiratory conditions should stay indoors.',
    time: '3 hr ago',
    read: false,
    tag: 'Air Quality',
  },
  {
    id: 6,
    type: 'aqi',
    severity: 'low',
    icon: '🍃',
    title: 'AQI Improved — Now Good (32)',
    desc: 'Air quality in your area has improved significantly. Safe to go outdoors. Great day for a walk or cycle!',
    time: 'Yesterday',
    read: true,
    tag: 'Air Quality',
  },

  // ── WATER QUALITY ──────────────────────────────────────────────
  {
    id: 7,
    type: 'water',
    severity: 'critical',
    icon: '☣️',
    title: 'Water Contamination Alert',
    desc: 'E. coli detected in municipal supply in Sectors 14–18. Do NOT drink tap water. Use boiled or bottled water immediately.',
    time: '10 min ago',
    read: false,
    tag: 'Water Quality',
  },
  {
    id: 8,
    type: 'water',
    severity: 'high',
    icon: '💧',
    title: 'High Turbidity Detected',
    desc: 'Post-rainfall turbidity spike in local reservoir. Water treatment in progress. May cause discolouration at your tap.',
    time: '2 hr ago',
    read: true,
    tag: 'Water Quality',
  },
  {
    id: 9,
    type: 'water',
    severity: 'medium',
    icon: '🧪',
    title: 'Chlorine Levels Elevated',
    desc: 'Chlorine disinfection levels slightly above normal (4.2 ppm). Water is safe to drink but may have a mild taste/odour.',
    time: 'Yesterday',
    read: true,
    tag: 'Water Quality',
  },

  // ── CREDITS / REWARDS ──────────────────────────────────────────
  {
    id: 10,
    type: 'credits',
    severity: 'success',
    icon: '⚡',
    title: '+300 pts — Planted a Tree!',
    desc: 'Amazing! You earned 300 reward points for completing the "Plant a Tree" eco action. Keep it up!',
    time: '30 min ago',
    read: false,
    tag: 'Rewards',
  },
  {
    id: 11,
    type: 'credits',
    severity: 'success',
    icon: '🏆',
    title: 'Badge Unlocked — Water Saver',
    desc: 'You\'ve saved over 100L of water this month. The "Water Saver" badge has been added to your profile.',
    time: '2 hr ago',
    read: false,
    tag: 'Rewards',
  },
  {
    id: 12,
    type: 'credits',
    severity: 'success',
    icon: '🔥',
    title: '18-Day Streak — Keep Going!',
    desc: 'You\'ve completed eco actions 18 days in a row. You\'re just 12 days away from the "30-Day Streak" badge!',
    time: '6 hr ago',
    read: true,
    tag: 'Rewards',
  },
  {
    id: 13,
    type: 'credits',
    severity: 'success',
    icon: '🌱',
    title: '+120 pts — Reduced Water Waste',
    desc: 'You earned 120 reward points for completing the "Reduce Water Waste" action. Total: 3,240 pts.',
    time: 'Yesterday',
    read: true,
    tag: 'Rewards',
  },
]

const FILTERS = ['All', 'Weather', 'AQI', 'Water', 'Credits']

const SEVERITY_STYLES = {
  critical: {
    border: 'border-[rgba(239,68,68,0.35)]',
    bg:     'bg-[rgba(239,68,68,0.06)]',
    dot:    'bg-red-500',
    badge:  'bg-[rgba(239,68,68,0.15)] text-red-400',
    glow:   'shadow-[0_0_20px_rgba(239,68,68,0.12)]',
  },
  high: {
    border: 'border-[rgba(249,115,22,0.35)]',
    bg:     'bg-[rgba(249,115,22,0.06)]',
    dot:    'bg-orange-400',
    badge:  'bg-[rgba(249,115,22,0.15)] text-orange-400',
    glow:   'shadow-[0_0_20px_rgba(249,115,22,0.1)]',
  },
  medium: {
    border: 'border-[rgba(234,179,8,0.3)]',
    bg:     'bg-[rgba(234,179,8,0.05)]',
    dot:    'bg-yellow-400',
    badge:  'bg-[rgba(234,179,8,0.15)] text-yellow-400',
    glow:   '',
  },
  low: {
    border: 'border-[rgba(8,232,50,0.2)]',
    bg:     'bg-[rgba(8,232,50,0.04)]',
    dot:    'bg-[#08e832]',
    badge:  'bg-[rgba(8,232,50,0.12)] text-[#08e832]',
    glow:   '',
  },
  success: {
    border: 'border-[rgba(8,232,50,0.3)]',
    bg:     'bg-[rgba(8,232,50,0.06)]',
    dot:    'bg-[#08e832]',
    badge:  'bg-[rgba(8,232,50,0.15)] text-[#08e832]',
    glow:   'shadow-[0_0_20px_rgba(8,232,50,0.08)]',
  },
}

const Notifications = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [activeFilter, setActiveFilter]   = useState('All')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  /* ── helpers ── */
  const unreadCount = notifications.filter((n) => !n.read).length

  const filtered = notifications.filter((n) => {
    const matchFilter =
      activeFilter === 'All'     ? true :
      activeFilter === 'Weather' ? n.type === 'weather' :
      activeFilter === 'AQI'     ? n.type === 'aqi'     :
      activeFilter === 'Water'   ? n.type === 'water'   :
      activeFilter === 'Credits' ? n.type === 'credits' : true

    const matchRead = showUnreadOnly ? !n.read : true
    return matchFilter && matchRead
  })

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )

  const dismiss = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const clearAll = () =>
    setNotifications((prev) => prev.filter((n) => !n.read))

  /* ── render ── */
  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <div
        className="relative z-10 pt-24 pb-10 px-6 md:px-12"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(8,168,40,0.07) 0%, transparent 70%)',
        }}
      >
        <div className="max-w-[860px] mx-auto">

          <span className="inline-flex items-center gap-2 border border-[rgba(8,232,50,0.4)] rounded-full px-5 py-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#08e832] mb-6">
            <span className="w-[7px] h-[7px] rounded-full bg-[#08e832] animate-pulse" />
            EcoSimple Alerts
          </span>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1
                className="font-black leading-[0.9] tracking-[-2px] text-white"
                style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontFamily: 'Barlow, sans-serif' }}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-4 align-middle text-[22px] font-black text-[#08e832]">
                    ({unreadCount})
                  </span>
                )}
              </h1>
              <p className="text-[#7a9a7b] text-sm mt-3 font-light">
                Stay informed on weather, air quality, water safety, and your eco rewards.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={markAllRead}
                className="text-[11px] tracking-[1.5px] uppercase font-semibold text-[#08e832] border border-[rgba(8,232,50,0.25)] px-4 py-2 rounded-full hover:bg-[rgba(8,232,50,0.08)] transition-colors whitespace-nowrap"
              >
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="text-[11px] tracking-[1.5px] uppercase font-semibold text-[#7a9a7b] border border-[rgba(255,255,255,0.1)] px-4 py-2 rounded-full hover:border-[rgba(255,255,255,0.2)] transition-colors whitespace-nowrap"
              >
                Clear read
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTERS ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[rgba(0,0,0,0.85)] backdrop-blur-md border-b border-[rgba(8,232,50,0.08)] px-6 md:px-12 py-3">
        <div className="max-w-[860px] mx-auto flex items-center justify-between gap-4 flex-wrap">

          {/* Type filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[11px] font-semibold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-[#08e832] text-black'
                    : 'text-[#7a9a7b] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(8,232,50,0.3)] hover:text-[#08e832]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Unread toggle */}
          <button
            onClick={() => setShowUnreadOnly((p) => !p)}
            className={`flex items-center gap-2 text-[11px] font-semibold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full transition-all duration-200 ${
              showUnreadOnly
                ? 'bg-[rgba(8,232,50,0.12)] text-[#08e832] border border-[rgba(8,232,50,0.3)]'
                : 'text-[#7a9a7b] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(8,232,50,0.3)]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showUnreadOnly ? 'bg-[#08e832]' : 'bg-[#7a9a7b]'}`} />
            Unread only
          </button>
        </div>
      </div>

      {/* ── NOTIFICATION LIST ─────────────────────────────────────── */}
      <div className="max-w-[860px] mx-auto px-6 md:px-12 py-8 space-y-3">

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-white font-bold text-lg mb-2">All clear!</p>
            <p className="text-[#7a9a7b] text-sm">No notifications match this filter.</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const s = SEVERITY_STYLES[notif.severity]
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`relative group flex items-start gap-4 p-5 rounded-2xl border cursor-pointer
                  transition-all duration-300 hover:scale-[1.01]
                  ${s.border} ${s.bg} ${s.glow}
                  ${!notif.read ? 'opacity-100' : 'opacity-60 hover:opacity-80'}
                `}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <span className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${s.dot} animate-pulse flex-shrink-0`} />
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${s.border} ${s.bg}`}>
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-0.5 rounded-full ${s.badge}`}>
                      {notif.tag}
                    </span>
                    {notif.severity === 'critical' && (
                      <span className="text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-0.5 rounded-full bg-[rgba(239,68,68,0.2)] text-red-400 animate-pulse">
                        ⚠ Critical
                      </span>
                    )}
                  </div>

                  <p
                    className="font-bold text-[15px] text-white mb-1 leading-snug"
                    style={{ fontFamily: 'Barlow, sans-serif' }}
                  >
                    {notif.title}
                  </p>
                  <p className="text-[13px] text-[#7a9a7b] leading-relaxed">{notif.desc}</p>
                  <p className="text-[11px] text-[#4a6a4b] mt-2 tracking-wide">{notif.time}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(notif.id) }}
                  className="absolute top-3 right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#7a9a7b] hover:text-white text-lg leading-none"
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* ── SUMMARY STRIP ─────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-t border-[rgba(8,232,50,0.1)] mt-6">
        <div className="max-w-[860px] mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '🌪️', label: 'Weather',  count: notifications.filter((n) => n.type === 'weather').length,              color: 'text-orange-400' },
              { icon: '😷', label: 'AQI',      count: notifications.filter((n) => n.type === 'aqi').length,                  color: 'text-red-400'    },
              { icon: '💧', label: 'Water',    count: notifications.filter((n) => n.type === 'water').length,                color: 'text-blue-400'   },
              { icon: '⚡', label: 'Credits',  count: notifications.filter((n) => n.type === 'credits').length,              color: 'text-[#08e832]'  },
            ].map((s) => (
              <div
                key={s.label}
                onClick={() => setActiveFilter(s.label === 'AQI' ? 'AQI' : s.label.charAt(0).toUpperCase() + s.label.slice(1))}
                className="bg-black border border-[rgba(8,232,50,0.1)] rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[rgba(8,232,50,0.3)] hover:bg-[#0e1f10] transition-all duration-200"
              >
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className={`font-black text-xl leading-none ${s.color}`} style={{ fontFamily: 'Barlow, sans-serif' }}>
                    {s.count}
                  </div>
                  <div className="text-[10px] tracking-[1.5px] uppercase text-[#7a9a7b] mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Notifications