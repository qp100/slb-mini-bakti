import React from 'react'
import { Home, ClipboardList, Users, Menu } from 'lucide-react'

const Navbar = ({ setActivePage, activePage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'absensi', label: 'Absensi', icon: ClipboardList },
    { id: 'guru', label: 'Data Guru', icon: Users },
  ]

  return (
    <header className="bg-[#3f6db3] h-[70px] rounded-t-xl flex items-center justify-between px-6 text-white shadow-md">
      {/* Left: Logo + School Name */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white p-1 w-10 h-10 flex items-center justify-center shadow">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#3f6db3]" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
          </svg>
        </div>
        <span className="font-bold text-xl hidden sm:block">SLB Mini Bakti</span>
      </div>

      {/* Center: Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`nav-${id}`}
            onClick={() => setActivePage(id)}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-200 hover:opacity-70 focus:outline-none ${
              activePage === id ? 'opacity-100 scale-105' : 'opacity-80'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
            {activePage === id && (
              <div className="w-full h-0.5 bg-white rounded-full mt-0.5" />
            )}
          </button>
        ))}
      </nav>

      {/* Right: Avatar */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-[#3f6db3] font-bold text-sm shadow">
          A
        </div>
        <span className="text-sm font-medium hidden sm:block">Admin</span>
      </div>
    </header>
  )
}

export default Navbar
