import Navbar from "../Components/Navbar"
const TODO_ITEMS = [
  { num: '01', emoji: '🪣', title: 'Reduce Water Waste',            tag: 'Home',      desc: 'Turn off the tap while brushing. Collect rainwater for plants. Fix dripping faucets — one drip wastes 20 litres a day.' },
  { num: '02', emoji: '♻️', title: 'Segregate Your Waste',          tag: 'Waste',     desc: 'Separate dry, wet, and hazardous waste. Compost organic kitchen scraps into nutrient-rich soil for your garden.' },
  { num: '03', emoji: '🚶', title: 'Walk, Cycle, or Carpool',       tag: 'Transport', desc: 'For short distances, skip the car. Cycling 10 km/day instead of driving saves ~1.5 tonnes of CO₂ per year.' },
  { num: '04', emoji: '🌱', title: 'Plant Something',               tag: 'Greenery',  desc: 'Start a windowsill herb garden, adopt a tree, or grow native plants. Even a pot of mint improves local air quality.' },
  { num: '05', emoji: '💡', title: 'Switch Off & Unplug',           tag: 'Energy',    desc: 'Phantom loads from standby devices account for 10% of home energy bills. Unplug chargers and TVs when idle.' },
  { num: '06', emoji: '🛍️', title: 'Say No to Single-Use Plastic',  tag: 'Plastic',   desc: 'Carry a reusable bag and bottle. Refuse plastic straws. One person switching saves ~700 plastic bags per year.' },
  { num: '07', emoji: '🍽️', title: 'Eat Mindfully',                tag: 'Diet',      desc: 'Cut food waste by meal planning. Try one meat-free day per week — it can shrink your carbon footprint by up to 8%.' },
  { num: '08', emoji: '🧹', title: 'Clean Your Neighbourhood',      tag: 'Community', desc: 'Join or organise a local clean-up. Small acts inspire others and restore dignity to shared public spaces.' },
  { num: '09', emoji: '📢', title: 'Educate & Spread Awareness',    tag: 'Advocacy',  desc: 'Share what you learn with family and on social media. Real environmental change scales through community action.' },
]

const SUGGESTIONS = [
  { num: '1', impact: 95, title: 'Install Solar Panels or Support Green Energy', desc: 'Switching to renewable energy, even partially, is one of the highest-impact lifetime decisions you can make.' },
  { num: '2', impact: 75, title: 'Choose Sustainable Products',                  desc: 'Look for eco-certified labels. Support local, organic, and low-packaging brands over convenience-first options.' },
  { num: '3', impact: 62, title: 'Create a Rainwater Harvesting System',         desc: 'Even a simple barrel on a downspout can collect hundreds of litres per rain event for outdoor use.' },
  { num: '4', impact: 50, title: 'Digitise & Go Paperless',                      desc: 'Opt for e-bills, e-books, and digital notes. Paper production contributes ~10% of global industrial energy.' },
  { num: '5', impact: 80, title: 'Build or Join a Community Garden',             desc: 'Shared green spaces lower urban heat, increase biodiversity, and strengthen community bonds.' },
  { num: '6', impact: 68, title: 'Repair Before You Replace',                    desc: 'Fashion and electronics are massive polluters. Repairing extends product life and cuts manufacturing demand.' },
]

const KnowYourEnv = () => {
  return (
    <> 
    <Navbar />
    <div className="bg-black min-h-screen text-white overflow-x-hidden pt-15">

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <div
        className="relative z-10 text-center pt-24 pb-16 px-6"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 60%, rgba(8,168,40,0.08) 0%, transparent 70%)',
        }}
      >
        <span className="inline-flex items-center gap-2 border border-[rgba(8,232,50,0.4)] rounded-full px-5 py-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#08e832] mb-6">
          <span className="w-[7px] h-[7px] rounded-full bg-[#08e832] animate-pulse" />
          Know Your Environment
        </span>

        <h1
          className="font-black leading-[0.92] tracking-[-2px] text-white mt-2"
          style={{ fontSize: 'clamp(44px, 7vw, 96px)', fontFamily: 'Barlow, sans-serif' }}
        >
          Act Today.
          <span className="block text-[#08e832]">Sustain Tomorrow.</span>
        </h1>

        <p className="max-w-[480px] mx-auto mt-6 text-[15px] font-light text-[#7a9a7b] leading-relaxed">
          Small daily actions compound into lasting change. Here's exactly what you can do — starting right now.
        </p>
      </div>

      {/* ── TO-DO SECTION ────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24">

        <div className="flex items-center gap-3 mb-4">
          <span className="w-7 h-px bg-[#08e832]" />
          <p className="text-[11px] tracking-[3px] uppercase font-semibold text-[#08e832]">
            Your Action Plan
          </p>
        </div>

        <h2
          className="font-black leading-[0.93] tracking-[-1.5px] mb-12"
          style={{ fontSize: 'clamp(34px, 5vw, 60px)', fontFamily: 'Barlow, sans-serif' }}
        >
          Things To Do <span className="text-[#08e832]">Today.</span>
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[rgba(8,232,50,0.12)] rounded-2xl overflow-hidden">
          {TODO_ITEMS.map((item, i) => (
            <div
              key={item.num}
              className="group relative bg-[#0a0a0a] p-8 overflow-hidden transition-all duration-300 hover:bg-[#0e1f10]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? '1px solid rgba(8,232,50,0.12)' : 'none',
                borderBottom: i < TODO_ITEMS.length - 3 ? '1px solid rgba(8,232,50,0.12)' : 'none',
              }}
            >
              {/* Hover sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(8,232,50,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div
                className="font-black text-[60px] leading-none tracking-tighter text-[rgba(8,232,49,0.49)] mb-1 group-hover:text-[rgb(8,232,49)] transition-colors duration-300"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                {item.num}
              </div>

              <span className="text-[24px] mb-3 block">{item.emoji}</span>

              <div
                className="font-bold text-[17px] text-white mb-2"
                style={{ fontFamily: 'Barlow, sans-serif' }}
              >
                {item.title}
              </div>

              <p className="text-[13px] text-[#5cc960] leading-relaxed">{item.desc}</p>

              <span className="inline-block mt-4 text-[10px] font-semibold tracking-[2px] uppercase text-[#08e832] border border-[rgba(8,232,50,0.25)] px-3 py-0.5 rounded-full">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUGGESTIONS SECTION ──────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-t border-b border-[rgba(8,232,50,0.12)]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-24">

          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-px bg-[#08e832]" />
            <p className="text-[11px] tracking-[3px] uppercase font-semibold text-[#08e832]">
              Long-Term Habits
            </p>
          </div>

          <h2
            className="font-black leading-[0.93] tracking-[-1.5px] mb-14"
            style={{ fontSize: 'clamp(34px, 5vw, 60px)', fontFamily: 'Barlow, sans-serif' }}
          >
            Suggestions for a <span className="text-[#08e832]">Sustainable Life.</span>
          </h2>

          <div>
            {SUGGESTIONS.map((s) => (
              <div
                key={s.num}
                className="grid grid-cols-[70px_1fr] md:grid-cols-[90px_1fr_130px] items-center gap-6 md:gap-9 py-7 border-b border-[rgba(255,255,255,0.04)] last:border-b-0 transition-all duration-300 hover:pl-3"
              >
                {/* Number */}
                <div
                  className="font-black text-[56px] leading-none tracking-tighter text-[rgba(8,232,49,0.46)]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {s.num}
                </div>

                {/* Body */}
                <div>
                  <strong
                    className="block font-bold text-[17px] text-white mb-1.5"
                    style={{ fontFamily: 'Barlow, sans-serif' }}
                  >
                    {s.title}
                  </strong>
                  <p className="text-sm text-[#7a9a7b] leading-relaxed">{s.desc}</p>
                </div>

                {/* Impact bar */}
                <div className="hidden md:block text-right">
                  <span className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#08e832] mb-2">
                    Impact
                  </span>
                  <div className="w-full h-[3px] bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#08a728] to-[#08e832]"
                      style={{ width: `${s.impact}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PLEDGE STRIP ─────────────────────────────────────────── */}
      <div
        className="max-w-[1280px] mx-auto px-6 md:px-12 py-24 text-center"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(8,232,50,0.04), transparent 70%)',
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-7 h-px bg-[#08e832]" />
          <p className="text-[11px] tracking-[3px] uppercase font-semibold text-[#08e832]">
            Your Green Pledge
          </p>
          <span className="w-7 h-px bg-[#08e832]" />
        </div>

        <h2
          className="font-black leading-[0.93] tracking-[-1.5px] mb-10"
          style={{ fontSize: 'clamp(34px, 5vw, 60px)', fontFamily: 'Barlow, sans-serif' }}
        >
          Start With One. <span className="text-[#08e832]">Build From There.</span>
        </h2>

        <blockquote
          className="font-bold italic text-[#08e832] max-w-[520px] mx-auto mb-12 leading-[1.5] border-l-[3px] border-[#08e832] pl-5 text-left text-[18px]"
          style={{ fontFamily: 'Barlow, sans-serif' }}
        >
          "We do not inherit the earth from our ancestors; we borrow it from our children."
        </blockquote>

        {/* Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-w-[1000px] mx-auto text-left">
          {[
            'Carry a reusable bag & bottle daily',
            'Compost kitchen scraps weekly',
            'Walk or cycle for trips under 3 km',
            'Unplug all devices before sleeping',
            'Plant one tree or native plant this month',
            'Refuse single-use plastics at every meal',
            'Join or start a neighbourhood clean-up',
            'Eat plant-based at least once a week',
          ].map((pledge) => (
            <div
              key={pledge}
              className="flex items-center gap-3 bg-[#0a0a0a] border border-[rgba(8,232,50,0.12)] rounded-xl px-4 py-3.5 text-[13px] text-gray-300 transition-all duration-200 hover:border-[rgba(8,232,50,0.35)] hover:bg-[#0e1f10]"
            >
              <div className="w-5 h-5 rounded-full bg-[#08e832] text-black flex items-center justify-center text-[10px] font-extrabold shrink-0">
                ✓
              </div>
              {pledge}
            </div>
          ))}
        </div>
      </div>

    </div>
    </>    
  )
}

export default KnowYourEnv