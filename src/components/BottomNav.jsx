import React from 'react'
import { Home, ClipboardList, Users } from 'lucide-react'

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'absensi', label: 'Absensi', icon: ClipboardList },
  { id: 'guru', label: 'Guru', icon: Users },
]

/**
 * Bottom navigation bar — hanya tampil di mobile (< md).
 * Menggantikan nav center di Navbar yang tersembunyi di mobile.
 */
const BottomNav = ({ activePage, setActivePage }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              id={`bottom-nav-${id}`}
              onClick={() => setActivePage(id)}
              className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all duration-200 focus:outline-none ${
                isActive ? 'text-[#3f6db3]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-[#3f6db3] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
