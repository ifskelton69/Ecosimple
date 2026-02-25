import { useEffect, useState } from "react"
  import Navbar from "../Components/Navbar"
  import { fetchLeaderboard } from "../api.js"

  const LeaderBoard = () => {
    const [users, setUsers]     = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState("")

    useEffect(() => {
      const load = async () => {
        try {
          const data = await fetchLeaderboard()
          setUsers(data)
        } catch (err) {
          setError(err.message || "Failed to load leaderboard.")
        } finally {
          setLoading(false)
        }
      }
      load()
    }, [])

    const max    = users[0]?.credits || 1
    const leader = users[0]

    return (
      <>
       
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&display=swap');
          .syne { font-family: 'Syne', sans-serif; }
          .mono { font-family: 'Space Mono', monospace; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes crownFloat {
            0%,100% { transform: translateY(0) rotate(-5deg); }
            50%      { transform: translateY(-6px) rotate(5deg); }
          }
          @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes barGrow {
            from { width: 0; }
          }

          .fade-up { animation: fadeUp 0.5s ease both; }
          .delay-1 { animation-delay: 0.1s; }
          .delay-2 { animation-delay: 0.2s; }
          .delay-3 { animation-delay: 0.3s; }

          .crown { animation: crownFloat 3s ease-in-out infinite; display: inline-block; }

          .shimmer-bar {
            background: linear-gradient(90deg, #17ce3c 0%, #0aff5a 50%, #17ce3c 100%);
            background-size: 400px 100%;
            animation: shimmer 2s linear infinite, barGrow 1s ease both;
          }
          .shimmer-gold {
            background: linear-gradient(90deg, #f59e0b 0%, #fde68a 50%, #f59e0b 100%);
            background-size: 400px 100%;
            animation: shimmer 2s linear infinite, barGrow 1s ease both;
          }

          .row-hover:hover {
            background: rgba(23,206,60,0.05) !important;
            transform: translateX(4px);
            transition: all 0.2s ease;
          }

          .leader-glow {
            box-shadow:
              0 0 0 1px rgba(23,206,60,0.3),
              0 8px 32px rgba(23,206,60,0.2),
              0 32px 64px rgba(0,0,0,0.4);
          }
        `}</style>

        <div className="syne min-h-screen" style={{ background: "#080c09" }}>
          <Navbar />

          <div className="max-w-3xl mx-auto px-4 pb-20 pt-32 ">

            {/* Page title */}
            <div className="text-center mb-12 fade-up">
              <div className="mono text-[10px] text-[#17ce3c] tracking-[4px] uppercase mb-3">◈ Weekly Rankings</div>
              <h1 className="text-5xl font-extrabold text-white tracking-tight leading-none">
                Leader<span style={{ color: "#17ce3c" }}>board</span>
              </h1>
              <p className="text-white/30 text-sm mono mt-3">Ranked by total credit points earned</p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center gap-4 py-24">
                <div className="w-10 h-10 border-4 border-white/10 border-t-[#17ce3c] rounded-full animate-spin" />
                <p className="mono text-xs text-white/30 tracking-widest uppercase">Loading...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-16">
                <p className="mono text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-2xl px-6 py-4 inline-block">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>

                {/* ── LEADER HERO CARD ── */}
                {leader && (
                  <div
                    className="relative rounded-3xl p-8 mb-8 overflow-hidden fade-up leader-glow"
                    style={{ background: "linear-gradient(135deg, #0d1f10 0%, #0a1a0c 100%)", border: "1px solid rgba(23,206,60,0.2)" }}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                      style={{ background: "radial-gradient(circle, #17ce3c, transparent)", transform: "translate(30%, -30%)" }} />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">

                      {/* Initials circle */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold"
                          style={{ background: "linear-gradient(135deg, #17ce3c, #0aad32)", color: "#050a06", boxShadow: "0 8px 24px rgba(23,206,60,0.4)" }}
                        >
                          {leader.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -top-4 -right-2 text-2xl crown">👑</div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="mono text-[10px] text-[#17ce3c] tracking-[3px] uppercase mb-1">🏆 #1 Leader</div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight truncate">{leader.name}</h2>
                        <p className="mono text-sm text-white/30 truncate mt-0.5">{leader.email}</p>
                      </div>

                      {/* Credits badge */}
                      <div className="flex-shrink-0 text-right">
                        <div
                          className="inline-block px-6 py-3 rounded-2xl"
                          style={{ background: "rgba(23,206,60,0.1)", border: "1px solid rgba(23,206,60,0.3)" }}
                        >
                          <div className="text-4xl font-extrabold" style={{ color: "#17ce3c" }}>{leader.credits}</div>
                          <div className="mono text-[10px] text-white/30 uppercase tracking-widest mt-0.5">credits</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FULL RANKED LIST ── */}
                <div
                  className="rounded-3xl overflow-hidden fade-up delay-1"
                  style={{ background: "#0d1410", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {/* Header */}
                  <div
                    className="grid grid-cols-12 px-6 py-3 mono text-[9px] text-white/25 uppercase tracking-widest"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="col-span-1">Rank</span>
                    <span className="col-span-4">Name</span>
                    <span className="col-span-4">Email</span>
                    <span className="col-span-3 text-right">Credits</span>
                  </div>

                  {users.map((user, i) => {
                    const rank    = i + 1
                    const pct     = (user.credits / max) * 100
                    const isFirst = rank === 1
                    const medal   = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null

                    return (
                      <div
                        key={user._id || user.id || i}
                        className="row-hover cursor-default"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          background: isFirst ? "rgba(23,206,60,0.04)" : "transparent",
                          transition: "all 0.2s ease",
                          animationDelay: `${0.05 * i}s`,
                        }}
                      >
                        <div className="grid grid-cols-12 items-center px-6 py-4">

                          {/* Rank */}
                          <div className="col-span-1">
                            {medal
                              ? <span className="text-xl">{medal}</span>
                              : <span className="mono text-sm font-bold text-white/20">{rank}</span>
                            }
                          </div>

                          {/* Initials + Name */}
                          <div className="col-span-4 flex items-center gap-3 min-w-0">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0"
                              style={{
                                background: isFirst
                                  ? "linear-gradient(135deg, #17ce3c, #0aad32)"
                                  : "rgba(255,255,255,0.07)",
                                color: isFirst ? "#050a06" : "rgba(255,255,255,0.5)",
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`text-sm font-bold truncate ${isFirst ? "text-white" : "text-white/70"}`}>
                              {user.name}
                            </span>
                          </div>

                          {/* Email */}
                          <div className="col-span-4 min-w-0">
                            <span className="mono text-xs text-white/25 truncate block">{user.email}</span>
                          </div>

                          {/* Credits + bar */}
                          <div className="col-span-3">
                            <div className="flex items-center justify-end gap-3">
                              {/* Mini bar */}
                              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className={`h-full rounded-full ${isFirst ? "shimmer-gold" : rank <= 3 ? "shimmer-bar" : ""}`}
                                  style={{
                                    width: `${pct}%`,
                                    background: isFirst
                                      ? undefined
                                      : rank <= 3
                                      ? undefined
                                      : `rgba(255,255,255,${0.1 + pct / 200})`,
                                    animationDelay: `${0.05 * i}s`,
                                  }}
                                />
                              </div>
                              <div className="text-right">
                                <span
                                  className="text-sm font-extrabold"
                                  style={{ color: isFirst ? "#17ce3c" : rank === 2 ? "#94a3b8" : rank === 3 ? "#f97316" : "rgba(255,255,255,0.5)" }}
                                >
                                  {user.credits}
                                </span>
                                <span className="mono text-[9px] text-white/20 ml-1">pts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {users.length === 0 && (
                    <div className="py-20 text-center mono text-sm text-white/20 tracking-widest uppercase">
                      No users yet
                    </div>
                  )}
                </div>

                {/* Footer note */}
                <p className="mono text-center text-[10px] text-white/15 tracking-widest uppercase mt-6">
                  Updated in real-time · {users.length} participants
                </p>
              </>
            )}
          </div>
        </div>
      </>
    )
  }

  export default LeaderBoard