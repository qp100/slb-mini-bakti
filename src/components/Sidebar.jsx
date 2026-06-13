import React from 'react'
import { Menu } from 'lucide-react'

const Sidebar = () => {
  return (
    // Tersembunyi di mobile (< md), tampil di md ke atas
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-20 bg-white border-r border-gray-200 justify-center pt-5 z-20 shadow-sm">
      <Menu size={24} className="text-gray-500" />
    </aside>
  )
}

export default Sidebar
