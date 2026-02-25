import { Bell, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { name: 'Home',        path: '/'            },
        { name: 'Dashboard',   path: '/dashboard'   },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'EcoSnap',     path: '/form'        },
    ]

    const handleNavClick = (path) => {
        navigate(path)
        setIsMobileMenuOpen(false)
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 py-6">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-300"
                    >
                        <span className="font-bold text-4xl bg-gradient-to-br from-[#08a728] via-[#99d64f] to-[#ed8a26] bg-clip-text text-transparent">
                            EcoSimple
                        </span>
                    </button>

                    {/* Desktop Nav Links */}
                    <div className={`hidden md:flex items-center space-x-1 px-6 py-3 rounded-full transition-all duration-300 ${
                        isScrolled
                            ? 'bg-[#7d7b7bb1] backdrop-blur-md shadow-lg border border-white/10'
                            : 'bg-[#474747] backdrop-blur-sm shadow-md border border-white/5'
                    }`}>
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.path)}
                                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                                    isActive(item.path)
                                        ? 'text-blue-500'
                                        : 'text-gray-300 hover:text-blue-400'
                                }`}
                            >
                                {item.name}
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-200 transform origin-left transition-transform duration-300 ${
                                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                }`} />
                            </button>
                        ))}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Bell */}
                        <button
                            onClick={() => navigate('/notifications')}
                            className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#17ce3c] rounded-full shadow-[0_0_6px_#17ce3c]" />
                        </button>

                        {/* Profile */}
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center px-6 py-3 bg-[#1C7DF1] text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <User className="inline mr-2" size={16} />
                            Profile
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                    <div className="flex flex-col space-y-2 py-4 bg-black/60 backdrop-blur-md rounded-2xl shadow-xl px-4 border border-white/10">
                        {navItems.map((item, index) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.path)}
                                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 text-left ${
                                    isActive(item.path)
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                        : 'text-gray-300 hover:bg-white/10'
                                }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {item.name}
                            </button>
                        ))}

                        <button
                            onClick={() => navigate('/notifications')}
                            className="flex items-center justify-center gap-2 px-4 py-3 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <Bell size={16} />
                            Notifications
                        </button>

                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                        >
                            <User className="inline mr-2" size={16} />
                            Profile
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar