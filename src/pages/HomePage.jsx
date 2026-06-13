import React, { useState, useEffect } from 'react'
import { AlertTriangle, Droplets } from 'lucide-react'
import { supabase } from '../supabaseClient'
import StatusBadge from '../components/StatusBadge'

const HomePage = () => {
  const [absensiList, setAbsensiList] = useState([])
  const [guruList, setGuruList] = useState([])
  const [todayStats, setTodayStats] = useState({ hadir: 0, total: 0 })
  const [loadingAbsensi, setLoadingAbsensi] = useState(true)
  const [loadingGuru, setLoadingGuru] = useState(true)
  const [showAlert, setShowAlert] = useState(true)

  useEffect(() => {
    fetchAbsensi()
    fetchGuru()
    fetchTodayStats()
  }, [])

  const fetchAbsensi = async () => {
    setLoadingAbsensi(true)
    try {
      const { data, error } = await supabase
        .from('absensi')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      if (error) throw error
      setAbsensiList(data ?? [])
    } catch (err) {
      console.error('Error fetching absensi:', err)
    } finally {
      setLoadingAbsensi(false)
    }
  }

  const fetchGuru = async () => {
    setLoadingGuru(true)
    try {
      const { data, error } = await supabase
        .from('guru')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      setGuruList(data ?? [])
    } catch (err) {
      console.error('Error fetching guru:', err)
    } finally {
      setLoadingGuru(false)
    }
  }

  const fetchTodayStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data: allToday, error: errAll } = await supabase
        .from('absensi')
        .select('id, status')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
      if (errAll) throw errAll

      const total = allToday?.length ?? 0
      const hadir = allToday?.filter(r => r.status === 'Hadir').length ?? 0
      setTodayStats({ hadir, total })
    } catch (err) {
      console.error('Error fetching today stats:', err)
    }
  }

  const hadirPercent = todayStats.total > 0
    ? Math.round((todayStats.hadir / todayStats.total) * 100)
    : 0

  return (
    <div className="bg-[#eef1f7] p-3 sm:p-5 rounded-b-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* 1. Alert Card — full width di semua breakpoint */}
        {showAlert && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-red-50 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-red-100">
            <div className="flex items-start sm:items-center gap-3">
              <AlertTriangle size={36} className="text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="font-bold text-base sm:text-lg text-gray-800">Galon Air Habis</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Persediaan air galon sudah habis. Segera ganti galon!
                </p>
              </div>
            </div>
            <button
              id="btn-alert-ok"
              onClick={() => setShowAlert(false)}
              className="self-end sm:self-auto bg-orange-400 text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-500 transition-colors flex-shrink-0 text-sm"
            >
              OK
            </button>
          </div>
        )}

        {/* 2. Water Status Card */}
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm text-center">
          <p className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Status Air</p>
          <Droplets size={52} className="text-blue-400 mx-auto my-2 sm:my-3" />
          <p className="text-xs sm:text-sm text-gray-500">Kurang/Habis</p>
          <p className="text-3xl sm:text-4xl font-bold text-gray-800 mt-1">10%</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
            <div className="w-[10%] h-full bg-orange-400 rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* 3. Attendance Card */}
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm text-center">
          <p className="font-semibold text-gray-700 text-sm sm:text-base">Absensi Hari Ini</p>
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-8 border-[#3f6db3] flex items-center justify-center mx-auto my-3 sm:my-4">
            <span className="text-2xl sm:text-3xl font-bold text-[#3f6db3]">{hadirPercent}%</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-3">
            {todayStats.hadir} hadir dari {todayStats.total} siswa
          </p>
          <StatusBadge status="Hadir" />
        </div>

        {/* 4. Student Attendance Preview */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-white rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Absensi Siswa</h2>
          {loadingAbsensi ? (
            <p className="text-gray-400 text-center py-4 text-sm">Memuat data...</p>
          ) : absensiList.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm">Belum ada data absensi</p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs sm:text-sm min-w-[320px]">
                <thead>
                  <tr>
                    <th className="bg-gray-100 p-2 sm:p-3 text-left rounded-l-lg font-semibold text-gray-600">Nama</th>
                    <th className="bg-gray-100 p-2 sm:p-3 text-center font-semibold text-gray-600">NIS</th>
                    <th className="bg-gray-100 p-2 sm:p-3 text-center font-semibold text-gray-600">Kelas</th>
                    <th className="bg-gray-100 p-2 sm:p-3 text-center rounded-r-lg font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {absensiList.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2 sm:p-3 border-t border-gray-100 font-medium text-gray-800 whitespace-nowrap">{row.nama}</td>
                      <td className="p-2 sm:p-3 border-t border-gray-100 text-center text-gray-600">{row.nis}</td>
                      <td className="p-2 sm:p-3 border-t border-gray-100 text-center text-gray-600 whitespace-nowrap">{row.kelas}</td>
                      <td className="p-2 sm:p-3 border-t border-gray-100 text-center">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 5. Teacher Data Preview */}
        <div className="col-span-1 sm:col-span-2 bg-white rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Data Guru</h2>
          {loadingGuru ? (
            <p className="text-gray-400 text-center py-4 text-sm">Memuat data...</p>
          ) : guruList.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm">Belum ada data guru</p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs sm:text-sm min-w-[320px]">
                <thead>
                  <tr>
                    <th className="bg-gray-100 p-2 sm:p-3 text-left rounded-l-lg font-semibold text-gray-600">Nama Guru</th>
                    <th className="bg-gray-100 p-2 sm:p-3 text-center font-semibold text-gray-600">Jabatan</th>
                    <th className="bg-gray-100 p-2 sm:p-3 text-center rounded-r-lg font-semibold text-gray-600">Mata Pelajaran</th>
                  </tr>
                </thead>
                <tbody>
                  {guruList.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2 sm:p-3 border-t border-gray-100 font-medium text-gray-800 whitespace-nowrap">{row.nama}</td>
                      <td className="p-2 sm:p-3 border-t border-gray-100 text-center text-gray-600 whitespace-nowrap">{row.jabatan}</td>
                      <td className="p-2 sm:p-3 border-t border-gray-100 text-center text-gray-600 whitespace-nowrap">{row.mata_pelajaran}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 6. School Profile — full width */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=800"
              alt="Gedung Sekolah SLB Mini Bakti"
              className="w-full sm:w-48 md:w-56 rounded-xl object-cover flex-shrink-0"
              style={{ height: '180px' }}
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">SLB Mini Bakti</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Sekolah Luar Biasa</p>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                SLB Mini Bakti adalah sekolah luar biasa yang berdedikasi memberikan pendidikan berkualitas
                bagi anak-anak berkebutuhan khusus. Kami berkomitmen menciptakan lingkungan belajar yang
                inklusif, menyenangkan, dan penuh kasih sayang untuk setiap siswa.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 sm:py-2 rounded-lg">
                  <span>📍</span>
                  <span className="font-medium">Bandung, Jawa Barat</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 sm:py-2 rounded-lg">
                  <span>🏫</span>
                  <span className="font-medium">Kelas Inklusi</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 sm:py-2 rounded-lg">
                  <span>⚽</span>
                  <span className="font-medium">Area Bermain</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomePage
