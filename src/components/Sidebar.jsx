import React from 'react'
import { Menu } from 'lucide-react'

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-white border-r border-gray-200 flex justify-center pt-5 z-10 shadow-sm">
      <Menu size={24} className="text-gray-500" />
    </aside>
  )
}

export default Sidebar
