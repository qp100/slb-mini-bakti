import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import StatusBadge from '../components/StatusBadge'
import { Trash2, UserCheck } from 'lucide-react'

const KELAS_OPTIONS = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6']
const STATUS_OPTIONS = ['Hadir', 'Tidak Hadir', 'Terlambat']

const AbsensiPage = () => {
  const [form, setForm] = useState({
    nama: '',
    nis: '',
    kelas: 'Kelas 1',
    status: 'Hadir',
  })
  const [absensiList, setAbsensiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAbsensi()
  }, [])

  const fetchAbsensi = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('absensi')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setAbsensiList(data ?? [])
    } catch (err) {
      console.error('Error fetching absensi:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSimpan = async () => {
    if (!form.nama.trim() || !form.nis.trim()) {
      alert('Nama dan NIS tidak boleh kosong!')
      return
    }
    setSaving(true)
    try {
      const now = new Date()
      const jam = now.toTimeString().slice(0, 5)
      const { error } = await supabase.from('absensi').insert([
        {
          nama: form.nama.trim(),
          nis: form.nis.trim(),
          kelas: form.kelas,
          status: form.status,
          jam,
        },
      ])
      if (error) throw error
      setForm({ nama: '', nis: '', kelas: 'Kelas 1', status: 'Hadir' })
      await fetchAbsensi()
    } catch (err) {
      console.error('Error inserting absensi:', err)
      alert('Gagal menyimpan data. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleHapus = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data absensi ini?')) return
    try {
      const { error } = await supabase.from('absensi').delete().eq('id', id)
      if (error) throw error
      await fetchAbsensi()
    } catch (err) {
      console.error('Error deleting absensi:', err)
      alert('Gagal menghapus data.')
    }
  }

  const inputClass =
    'w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-shadow'

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <UserCheck size={18} className="text-[#3f6db3]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-800">Absensi Siswa</h1>
          <p className="text-xs text-gray-500">Catat kehadiran siswa hari ini</p>
        </div>
      </div>

      {/* Form — 1 kolom di mobile, 2 di sm, 3 di md, 5 di lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <input
          id="input-nama"
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama Siswa"
          className={inputClass}
        />
        <input
          id="input-nis"
          type="text"
          name="nis"
          value={form.nis}
          onChange={handleChange}
          placeholder="NIS"
          className={inputClass}
        />
        <select
          id="select-kelas"
          name="kelas"
          value={form.kelas}
          onChange={handleChange}
          className={inputClass}
        >
          {KELAS_OPTIONS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <select
          id="select-status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className={inputClass}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          id="btn-simpan-absensi"
          onClick={handleSimpan}
          disabled={saving}
          className="w-full bg-green-500 text-white px-4 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-green-600 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:col-span-2 md:col-span-1"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Table dengan scroll horizontal */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        {loading ? (
          <p className="text-gray-400 text-center py-8 text-sm">Memuat data...</p>
        ) : absensiList.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Belum ada data absensi</p>
          </div>
        ) : (
          <table className="w-full text-xs sm:text-sm min-w-[560px]">
            <thead>
              <tr>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600 rounded-l-lg w-10">No</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-left font-semibold text-gray-600">Nama</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600">NIS</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600">Kelas</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600">Status</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600">Jam</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600 rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {absensiList.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-500">{idx + 1}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 font-medium text-gray-800 whitespace-nowrap">{row.nama}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-600">{row.nis}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-600 whitespace-nowrap">{row.kelas}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-600">{row.jam}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center">
                    <button
                      id={`btn-hapus-absensi-${row.id}`}
                      onClick={() => handleHapus(row.id)}
                      className="bg-red-500 text-white px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-red-600 active:scale-95 transition-all flex items-center gap-1 mx-auto whitespace-nowrap"
                    >
                      <Trash2 size={12} />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AbsensiPage
