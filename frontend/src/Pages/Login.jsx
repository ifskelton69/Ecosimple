import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { loginUser } from "../api.js"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await loginUser(form.email, form.password)
      localStorage.setItem("token", data.token)
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#050a06] pt-20">

      <div className="w-full max-w-sm bg-[#0d140e]/90 border border-white/8 rounded-3xl px-9 py-10 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <div className="text-3xl font-extrabold bg-gradient-to-r from-[#08a728] via-[#99d64f] to-[#ed8a26] bg-clip-text text-transparent mb-1">
          EcoSimple
        </div>
        <div className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-8">
          Environmental Intelligence Platform
        </div>

        <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-sm text-white/35 mb-7">Sign in to your account</p>

        {/* Error */}
        {error && (
          <div className="px-4 py-2.5 mb-5 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-white/50 tracking-wide mb-2">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/4 border border-white/9 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-green-500/40 focus:bg-green-500/4 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-white/50 tracking-wide mb-2">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full pl-10 pr-10 py-3 bg-white/4 border border-white/9 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-green-500/40 focus:bg-green-500/4 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#17ce3c] to-[#0aad32] text-[#050a06] font-bold text-sm rounded-xl shadow-lg shadow-green-500/20 hover:-translate-y-0.5 hover:shadow-green-500/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-5 border-t border-white/6 text-sm text-white/30">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#17ce3c] font-bold hover:opacity-75 transition">
            Create one
          </Link>
        </div>

      </div>
    </div>
  )
}