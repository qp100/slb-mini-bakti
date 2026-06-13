import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import AbsensiPage from './pages/AbsensiPage'
import GuruPage from './pages/GuruPage'

const App = () => {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar: hanya tampil di layar md ke atas */}
      <Sidebar />

      {/* Konten utama */}
      <div className="w-full md:ml-20 p-3 sm:p-5 pb-24 md:pb-5">
        <Navbar setActivePage={setActivePage} activePage={activePage} />
        <div className="mt-4 sm:mt-5">
          {activePage === 'home' && <HomePage />}
          {activePage === 'absensi' && <AbsensiPage />}
          {activePage === 'guru' && <GuruPage />}
        </div>
      </div>

      {/* Bottom Navigation: hanya tampil di mobile */}
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  )
}

export default App
