import React from 'react'
import { Home, ClipboardList, Users } from 'lucide-react'

const Navbar = ({ setActivePage, activePage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'absensi', label: 'Absensi', icon: ClipboardList },
    { id: 'guru', label: 'Data Guru', icon: Users },
  ]

  return (
    <header className="bg-[#3f6db3] min-h-[64px] sm:h-[70px] rounded-t-xl flex items-center justify-between px-4 sm:px-6 text-white shadow-md">
      {/* Kiri: Logo + Nama Sekolah */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="rounded-full bg-white p-1 w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center shadow">
          <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-[#3f6db3]" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="font-bold text-base sm:text-xl block truncate">SLB Mini Bakti</span>
          <span className="text-[10px] sm:text-xs text-blue-200 block sm:hidden">Manajemen Sekolah</span>
        </div>
      </div>

      {/* Tengah: Navigasi — hanya tampil di md ke atas */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`nav-${id}`}
            onClick={() => setActivePage(id)}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-200 hover:opacity-80 focus:outline-none relative ${
              activePage === id ? 'opacity-100 scale-105' : 'opacity-70'
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

      {/* Kanan: Avatar Admin */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-200 flex items-center justify-center text-[#3f6db3] font-bold text-sm shadow">
          A
        </div>
        <span className="text-sm font-medium hidden lg:block">Admin</span>
      </div>
    </header>
  )
}

export default Navbar
