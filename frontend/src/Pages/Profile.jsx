import React from 'react';
import { Calendar, LogOut, Leaf, Mail, Shield, Languages, Users } from 'lucide-react';
import useAuthUser from '../store/useAuthStore';
import Navbar from '../Components/Navbar';
import { useLang } from '../Components/Languagecontext';

const profileT = {
  EN: {
    accountDetails: 'Account Details', fullName: 'Full Name',
    email: 'Email', joined: 'Joined', status: 'Status',
    credits: 'Credits', language: 'Language', logout: 'Logout',
    active: 'Active', inactive: 'Inactive', memberSince: 'Member since',
  },
  HI: {
    accountDetails: 'खाता विवरण', fullName: 'पूरा नाम',
    email: 'ईमेल', joined: 'जुड़े', status: 'स्थिति',
    credits: 'क्रेडिट', language: 'भाषा', logout: 'लॉगआउट',
    active: 'सक्रिय', inactive: 'निष्क्रिय', memberSince: 'सदस्य बने',
  },
  MR: {
    accountDetails: 'खाते तपशील', fullName: 'पूर्ण नाव',
    email: 'ईमेल', joined: 'सामील झाले', status: 'स्थिती',
    credits: 'क्रेडिट्स', language: 'भाषा', logout: 'लॉगआउट',
    active: 'सक्रिय', inactive: 'निष्क्रिय', memberSince: 'सदस्य झाले',
  },
  TA: {
    accountDetails: 'கணக்கு விவரங்கள்', fullName: 'முழு பெயர்',
    email: 'மின்னஞ்சல்', joined: 'இணைந்தது', status: 'நிலை',
    credits: 'கிரெடிட்கள்', language: 'மொழி', logout: 'வெளியேறு',
    active: 'செயலில்', inactive: 'செயலற்ற', memberSince: 'உறுப்பினர் தொடங்கி',
  },
}

const Profile = () => {
  const { authUser, isLoading, logout } = useAuthUser();
  const { lang, setLang } = useLang();
  const t = profileT[lang] || profileT.EN;

  const joinDate = authUser?.created_at
    ? new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const displayName = authUser?.name || 'User';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=200`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white pt-10" style={{ background: '#0d0f14' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

          .profile-serif { font-family: 'DM Serif Display', serif; }
          .profile-sans  { font-family: 'DM Sans', sans-serif; }

          .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); }
          .glow  { box-shadow: 0 0 40px rgba(99,102,241,0.1); }

          .stat-pill { background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.15); transition: all 0.2s; }
          .stat-pill:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); }

          .logout-btn { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.2); color: #f87171; transition: all 0.25s; cursor: pointer; }
          .logout-btn:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.4); transform: translateY(-1px); }

          .avatar-ring { background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa); padding: 3px; border-radius: 9999px; }
          .accent { color: #818cf8; }

          .fade-in { animation: fadeUp 0.5s ease both; }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          .delay-1 { animation-delay: 0.1s; }
          .delay-2 { animation-delay: 0.2s; }

          .skel {
            background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 8px;
            display: inline-block;
          }
          @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        `}</style>

        <div className="profile-sans max-w-2xl mx-auto px-4 py-16">

          {/* Top Card */}
          <div className="glass rounded-3xl overflow-hidden glow mb-5 fade-in">
            <div className="px-8 pb-8 pt-8">
              <div className="flex items-center justify-between mb-6">

                {/* Avatar */}
                <div className="avatar-ring">
                  <div className="w-24 h-24 rounded-full overflow-hidden" style={{ background: '#0d0f14' }}>
                    {isLoading
                      ? <div className="skel" style={{ width: 96, height: 96, borderRadius: '9999px' }} />
                      : <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" onError={(e) => { e.target.src = avatarUrl }} />
                    }
                  </div>
                </div>

                {/* Logout */}
                <button onClick={logout} className="logout-btn flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold">
                  <LogOut size={14} /> {t.logout}
                </button>
              </div>

              {/* Name */}
              {isLoading
                ? <div className="skel mb-2" style={{ height: 36, width: 200 }} />
                : <h1 className="profile-serif text-3xl text-white mb-1">{displayName}</h1>
              }

              {/* Joined */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="accent" />
                  {isLoading
                    ? <span className="skel" style={{ height: 16, width: 110 }} />
                    : `${t.joined} ${joinDate}`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-5 fade-in delay-1">

            {/* Language picker */}
            <div className="stat-pill rounded-2xl px-4 py-4 text-center cursor-default">
              <div className="flex justify-center mb-2" style={{ color: '#818cf8' }}>
                <Languages size={16} />
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="text-xs font-semibold text-white rounded-lg px-2 py-1 outline-none text-center bg-[#2a2929c9]"
              >
                <option value="EN">English</option>
                <option value="HI">Hindi</option>
                <option value="MR">Marathi</option>
                <option value="TA">Tamil</option>
              </select>
              <div className="text-gray-500 text-xs mt-1">{t.language}</div>
            </div>

            {/* Status */}
            <div className="stat-pill rounded-2xl px-4 py-4 text-center cursor-default">
              <div className="flex justify-center mb-2" style={{ color: '#818cf8' }}>
                <Leaf size={16} />
              </div>
              {isLoading
                ? <div className="skel mx-auto mb-1" style={{ height: 20, width: 48 }} />
                : <div className="text-white font-semibold text-lg leading-none mb-1">
                    {authUser ? t.active : t.inactive}
                  </div>
              }
              <div className="text-gray-500 text-xs">{t.status}</div>
            </div>

            {/* Credits */}
            <div className="stat-pill rounded-2xl px-4 py-4 text-center cursor-default">
              <div className="flex justify-center mb-2" style={{ color: '#818cf8' }}>
                <Shield size={16} />
              </div>
              {isLoading
                ? <div className="skel mx-auto mb-1" style={{ height: 20, width: 48 }} />
                : <div className="text-white font-semibold text-lg leading-none mb-1">
                    {authUser?.credits ?? 0}
                  </div>
              }
              <div className="text-gray-500 text-xs">{t.credits}</div>
            </div>
          </div>

          {/* Account Details */}
          <div className="glass rounded-2xl px-8 py-6 fade-in delay-2">
            <h2 className="profile-serif text-lg text-white mb-5">{t.accountDetails}</h2>
            <div className="space-y-1">
              {[
                { icon: <Users size={14} />,    label: t.fullName,    value: authUser?.name },
                { icon: <Mail size={14} />,     label: t.email,       value: authUser?.email },
                { icon: <Shield size={14} />,   label: t.credits,     value: authUser?.credits ?? 0 },
                { icon: <Calendar size={14} />, label: t.memberSince, value: joinDate },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span style={{ color: '#818cf8' }}>{icon}</span>
                    {label}
                  </div>
                  {isLoading
                    ? <div className="skel" style={{ height: 16, width: 112 }} />
                    : <span className="text-gray-200 text-sm font-medium">{value || '—'}</span>
                  }
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;