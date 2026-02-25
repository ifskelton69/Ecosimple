import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { registerUser } from "../api.js"

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    try {
      const data = await registerUser(form.name, form.email, form.password)
      localStorage.setItem("token", data.token)
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          font-family: 'Syne', sans-serif;
          background:
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(23,206,60,0.07) 0%, transparent 70%),
            #050a06;
        }
        .auth-card {
          width: 100%; max-width: 420px;
          background: rgba(13,20,14,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 40px 36px;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          animation: fadeUp 0.5s ease both;
        }
        .auth-logo {
          font-size: 28px; font-weight: 800;
          background: linear-gradient(135deg, #08a728, #99d64f, #ed8a26);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 6px;
        }
        .auth-tagline {
          font-family: 'Space Mono', monospace; font-size: 10px;
          color: rgba(255,255,255,0.25); letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 32px;
        }
        .auth-title { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .auth-sub   { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; }

        .field-label {
          display: block; font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.5); letter-spacing: 0.5px; margin-bottom: 8px;
        }
        .field-wrap { position: relative; margin-bottom: 16px; }
        .field-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.2); width: 16px; height: 16px; pointer-events: none;
        }
        .field-input {
          width: 100%; padding: 12px 14px 12px 42px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; color: #fff;
          font-family: 'Syne', sans-serif; font-size: 14px;
          outline: none; transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus { border-color: rgba(23,206,60,0.4); background: rgba(23,206,60,0.04); }

        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.25);
          cursor: pointer; padding: 0; display: flex; transition: color 0.2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.6); }

        .auth-error {
          padding: 10px 14px; background: rgba(255,68,68,0.1);
          border: 1px solid rgba(255,68,68,0.25); border-radius: 10px;
          font-size: 13px; color: #ff8080; margin-bottom: 16px;
        }
        .submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #17ce3c, #0aad32);
          border: none; border-radius: 12px; color: #050a06;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800;
          cursor: pointer; box-shadow: 0 4px 20px rgba(23,206,60,0.3);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(23,206,60,0.45); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-divider {
          text-align: center; margin-top: 24px; padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 13px; color: rgba(255,255,255,0.3);
        }
        .auth-link { color: #17ce3c; text-decoration: none; font-weight: 700; transition: opacity 0.2s; }
        .auth-link:hover { opacity: 0.75; }

        .password-hint { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: -10px; margin-bottom: 16px; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(5,10,6,0.3); border-top-color: #050a06;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          display: inline-block; vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-logo">EcoSimple</div>
          <div className="auth-tagline">Environmental Intelligence Platform</div>
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Start your eco journey today</div>

          {error && <div className="auth-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="field-label">Full Name</label>
            <div className="field-wrap">
              <input className="field-input" type="text" placeholder="Your name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <User className="field-icon" />
            </div>

            <label className="field-label">Email</label>
            <div className="field-wrap">
              <input className="field-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Mail className="field-icon" />
            </div>

            <label className="field-label">Password</label>
            <div className="field-wrap">
              <input className="field-input" type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required style={{ paddingRight: "42px" }} />
              <Lock className="field-icon" />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="password-hint">At least 6 characters</p>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" />Creating account...</> : "Create Account →"}
            </button>
          </form>

          <div className="auth-divider">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  )
}