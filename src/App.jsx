import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import AbsensiPage from './pages/AbsensiPage'
import GuruPage from './pages/GuruPage'

const App = () => {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="ml-20 w-full p-5">
        <Navbar setActivePage={setActivePage} activePage={activePage} />
        <div className="mt-5">
          {activePage === 'home' && <HomePage />}
          {activePage === 'absensi' && <AbsensiPage />}
          {activePage === 'guru' && <GuruPage />}
        </div>
      </div>
    </div>
  )
}

export default App
