import { useEffect, useRef } from "react"
import Navbar from "../Components/Navbar"
import Leaflet from "../Components/Leaflet"
import EnvIcon from "../Components/Evicon"
import { useLang } from "../Components/Languagecontext"

const homeT = {
  EN: {
    badge:  "Real-time Environmental Intelligence",
    title1: "Monitor the Planet.",
    title2: "Earn for Every Action.",
    sub:    "EcoSimple turns environmental data into actionable insights — track air quality, earn green rewards, and make sustainability second nature.",
    cta1:   "🌿 Explore Dashboard",
    cta2:   "🏆 Leaderboard",
  },
  HI: {
    badge:  "रियल-टाइम पर्यावरण इंटेलिजेंस",
    title1: "ग्रह की निगरानी करें।",
    title2: "हर कार्य के लिए कमाएं।",
    sub:    "EcoSimple पर्यावरण डेटा को कार्रवाई योग्य अंतर्दृष्टि में बदलता है — वायु गुणवत्ता ट्रैक करें, हरित पुरस्कार अर्जित करें।",
    cta1:   "🌿 डैशबोर्ड देखें",
    cta2:   "🏆 लीडरबोर्ड",
  },
  MR: {
    badge:  "रिअल-टाइम पर्यावरण बुद्धिमत्ता",
    title1: "ग्रहाचे निरीक्षण करा.",
    title2: "प्रत्येक कृतीसाठी कमवा.",
    sub:    "EcoSimple पर्यावरण डेटाचे कृतीयोग्य अंतर्दृष्टीत रूपांतर करते — हवा गुणवत्ता ट्रॅक करा, हरित पुरस्कार मिळवा.",
    cta1:   "🌿 डॅशबोर्ड एक्सप्लोर करा",
    cta2:   "🏆 लीडरबोर्ड",
  },
  TA: {
    badge:  "நிகழ்நேர சுற்றுச்சூழல் நுண்ணறிவு",
    title1: "கோளை கண்காணியுங்கள்.",
    title2: "ஒவ்வொரு செயலுக்கும் சம்பாதியுங்கள்.",
    sub:    "EcoSimple சுற்றுச்சூழல் தரவை செயல்படத்தக்க நுண்ணறிவாக மாற்றுகிறது — காற்றின் தரத்தை கண்காணிக்கவும், பசுமை வெகுமதிகளை பெறவும்.",
    cta1:   "🌿 டாஷ்போர்டை ஆராயுங்கள்",
    cta2:   "🏆 லீடர்போர்டு",
  },
}

export default function Homepage() {
  const canvasRef = useRef(null)
  const { lang } = useLang()
  const t = homeT[lang] || homeT.EN

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(23,206,60,${p.opacity})`
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(23,206,60,${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(23,206,60,0.05) 0%, transparent 60%),
            #0d0f14;
        }

        .hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

        .hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        .hero-content { position: relative; z-index: 2; text-align: center; max-width: 760px; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 18px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 100px;
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: #818cf8;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease both;
        }

        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #17ce3c; box-shadow: 0 0 8px #17ce3c;
          animation: glow-pulse 1.5s infinite;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 7vw, 76px);
          font-weight: 400; line-height: 1.08; letter-spacing: -1px;
          color: #fff; margin-bottom: 20px;
          animation: fadeUp 0.7s ease 0.1s both;
        }
        .hero-title span {
          background: linear-gradient(135deg, #17ce3c 0%, #0aff5a 50%, #17ce3c 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(23,206,60,0.4));
        }

        .hero-sub {
          font-size: 17px; color: rgba(255,255,255,0.4);
          max-width: 500px; margin: 0 auto 40px; line-height: 1.75;
          animation: fadeUp 0.7s ease 0.2s both;
        }

        .hero-actions {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          animation: fadeUp 0.7s ease 0.3s both;
        }

        .btn-primary {
          padding: 13px 28px;
          background: linear-gradient(135deg, #17ce3c, #0aad32);
          border: none; border-radius: 14px;
          color: #050a06; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700; cursor: pointer;
          text-decoration: none; display: inline-block;
          box-shadow: 0 4px 24px rgba(23,206,60,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(23,206,60,0.5); }

        .btn-ghost {
          padding: 13px 28px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 14px; color: #a5b4fc;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none; display: inline-block;
          backdrop-filter: blur(12px); transition: all 0.2s;
        }
        .btn-ghost:hover { background: rgba(99,102,241,0.15); color: #fff; transform: translateY(-3px); }
      `}</style>

      <Navbar />

      <section className="hero" id="home">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            {t.badge}
          </div>

          <h1 className="hero-title">
            {t.title1}<br />
            <span>{t.title2}</span>
          </h1>

          <p className="hero-sub">{t.sub}</p>

          <div className="hero-actions">
            <a href="/dashboard" className="btn-primary">{t.cta1}</a>
            <a href="/leaderboard" className="btn-ghost">{t.cta2}</a>
          </div>
        </div>

        <EnvIcon />
      </section>

      <Leaflet />
    </>
  )
}