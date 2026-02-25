import { useState, useRef } from "react"
import { Upload, X, Send, ArrowLeft, CheckCircle } from "lucide-react"
import { submitTicket } from "../api.js"
import { useNavigate } from "react-router-dom"
import Navbar from '../Components/Navbar'

const STATIONS = [
  "PCMC",
  "Sant Tukaram Nagar",
  "Bhosari",
  "Kasarwadi",
  "Phugewadi",
  "Range Hills",
  "Shivaji Nagar",
  "Civil Court",
  "Budhwar Peth",
  "Mandai",
  "Swargate",
  "Vanaz",
  "Ideal Colony",
  "Nal Stop",
  "Garware College",
  "Deccan Gymkhana",
]

const TRANSPORT_TYPES = ["Bus", "Train", "Metro"]

export default function Form() {
  const [source, setSource]           = useState("")
  const [destination, setDestination] = useState("")
  const [transportType, setTransportType] = useState("")
  const [image, setImage]             = useState(null)
  const [preview, setPreview]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [error, setError]             = useState("")
  const fileRef = useRef()
  const navigate = useNavigate()

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith("image/")) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!source)      { setError("Please select a starting station."); return }
    if (!destination) { setError("Please select a destination station."); return }
    if (source === destination) { setError("Source and destination cannot be the same."); return }
    if (!image)       { setError("Please upload a ticket image."); return }

    try {
      setLoading(true)
      await submitTicket(source, destination)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setSource(""); setDestination(""); setTransportType("")
    setImage(null); setPreview(null); setSuccess(false); setError("")
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white pt-28 pb-16 px-6" style={{ background: '#050a06' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono&display=swap');

          .form-root { font-family: 'Syne', sans-serif; }

          .glass {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 24px;
          }

          .field-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 12px;
            color: #fff;
            font-family: 'Syne', sans-serif;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s, background 0.2s;
            box-sizing: border-box;
            appearance: none;
            -webkit-appearance: none;
          }
          .field-input::placeholder { color: rgba(255,255,255,0.2); }
          .field-input:focus {
            border-color: rgba(8,167,40,0.4);
            background: rgba(8,167,40,0.04);
          }
          .field-input option { background: #0d140e; color: #fff; }

          .field-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: rgba(255,255,255,0.4);
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 8px;
          }

          .select-wrap { position: relative; }
          .select-wrap::after {
            content: '▾';
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.3);
            pointer-events: none;
            font-size: 12px;
          }

          .drop-zone {
            cursor: pointer;
            border: 2px dashed rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            color: rgba(255,255,255,0.25);
            transition: all 0.2s;
            background: rgba(255,255,255,0.02);
          }
          .drop-zone:hover {
            border-color: rgba(8,167,40,0.35);
            background: rgba(8,167,40,0.04);
            color: rgba(255,255,255,0.5);
          }

          .submit-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #17ce3c, #0aad32);
            border: none;
            border-radius: 14px;
            color: #050a06;
            font-family: 'Syne', sans-serif;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(23,206,60,0.3);
            transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(23,206,60,0.45);
          }
          .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

          .fade-in { animation: fadeUp 0.45s ease both; }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="form-root max-w-lg mx-auto">

          {/* Back */}
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition mb-8">
            <ArrowLeft size={15} /> Back
          </button>

          {/* Success */}
          {success ? (
            <div className="glass p-10 text-center fade-in">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(23,206,60,0.12)', border: '1px solid rgba(23,206,60,0.25)' }}>
                <CheckCircle size={28} style={{ color: '#17ce3c' }} />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Ticket Submitted!</h2>
              <p className="text-white/40 text-sm mb-8">
                Your trip from <span className="text-white font-semibold">{source}</span> to <span className="text-white font-semibold">{destination}</span> has been recorded. Credits have been added to your account!
              </p>
              <button onClick={reset} className="submit-btn" style={{ maxWidth: 200, margin: '0 auto' }}>
                Submit Another
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 fade-in">
                <p className="text-xs font-mono text-white/25 tracking-[3px] uppercase mb-2">◈ Public Transport Portal</p>
                <h1 className="text-3xl font-extrabold text-white">Upload Your Ticket</h1>
                <p className="text-white/35 text-sm mt-2">Submit your metro ticket to earn eco credits.</p>
              </div>

              {/* Form card */}
              <div className="glass p-8 fade-in space-y-5">

                {/* Source station */}
                <div>
                  <label className="field-label">Starting Station</label>
                  <div className="select-wrap">
                    <select
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="field-input"
                      required
                    >
                      <option value="">Select station</option>
                      {STATIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destination station */}
                <div>
                  <label className="field-label">Destination Station</label>
                  <div className="select-wrap">
                    <select
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      className="field-input"
                      required
                    >
                      <option value="">Select station</option>
                      {STATIONS.filter(s => s !== source).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Transport type */}
                <div>
                  <label className="field-label">Transport Type</label>
                  <div className="select-wrap">
                    <select
                      value={transportType}
                      onChange={e => setTransportType(e.target.value)}
                      className="field-input"
                    >
                      <option value="">Select type</option>
                      {TRANSPORT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Image upload */}
                <div>
                  <label className="field-label">
                    Ticket Image <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

                  {preview ? (
                    <div className="relative rounded-2xl overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img src={preview} alt="Ticket"
                        className="w-full object-contain"
                        style={{ maxHeight: 220, background: 'rgba(255,255,255,0.02)' }} />
                      <button
                        type="button"
                        onClick={() => { setImage(null); setPreview(null) }}
                        className="absolute top-3 right-3 p-1.5 rounded-full transition"
                        style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
                      >
                        <X size={14} />
                      </button>
                      <div className="px-4 py-2.5 text-xs truncate"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
                        {image?.name}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="drop-zone"
                      onClick={() => fileRef.current.click()}
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                    >
                      <Upload size={22} />
                      <p className="text-sm font-semibold">Click or drag & drop</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>JPG, PNG, WEBP — max 10MB</p>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    ⚠ {error}
                  </div>
                )}

                {/* Submit */}
                <button type="button" onClick={handleSubmit} disabled={loading} className="submit-btn">
                  {loading
                    ? <span className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: 'rgba(5,10,6,0.3)', borderTopColor: '#050a06' }} />
                    : <Send size={15} />
                  }
                  {loading ? "Submitting..." : "Submit Ticket"}
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}