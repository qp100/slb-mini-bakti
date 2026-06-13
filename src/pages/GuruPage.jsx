import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ConfirmModal from '../components/ConfirmModal'
import { Trash2, Users } from 'lucide-react'

const GuruPage = () => {
  const [form, setForm] = useState({
    namaGuru: '',
    jabatan: '',
    mapel: '',
    kontak: '',
  })
  const [guruList, setGuruList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState({ open: false, id: null, nama: '' })

  useEffect(() => {
    fetchGuru()
  }, [])

  const fetchGuru = async () => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSimpan = async () => {
    if (!form.namaGuru.trim() || !form.jabatan.trim() || !form.mapel.trim() || !form.kontak.trim()) {
      alert('Semua field harus diisi!')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('guru').insert([
        {
          nama: form.namaGuru.trim(),
          jabatan: form.jabatan.trim(),
          mata_pelajaran: form.mapel.trim(),
          kontak: form.kontak.trim(),
        },
      ])
      if (error) throw error
      setForm({ namaGuru: '', jabatan: '', mapel: '', kontak: '' })
      await fetchGuru()
    } catch (err) {
      console.error('Error inserting guru:', err)
      alert('Gagal menyimpan data. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const openModal = (id, nama) => setModal({ open: true, id, nama })
  const closeModal = () => setModal({ open: false, id: null, nama: '' })

  const handleHapus = async () => {
    try {
      const { error } = await supabase.from('guru').delete().eq('id', modal.id)
      if (error) throw error
      closeModal()
      await fetchGuru()
    } catch (err) {
      console.error('Error deleting guru:', err)
      closeModal()
      alert('Gagal menghapus data.')
    }
  }

  const inputClass =
    'w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-shadow'

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Users size={18} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-800">Data Guru</h1>
          <p className="text-xs text-gray-500">Kelola data tenaga pengajar sekolah</p>
        </div>
      </div>

      {/* Form — 1 kolom di mobile, 2 di sm, 3 di md, 5 di lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <input
          id="input-nama-guru"
          type="text"
          name="namaGuru"
          value={form.namaGuru}
          onChange={handleChange}
          placeholder="Nama Guru"
          className={inputClass}
        />
        <input
          id="input-jabatan"
          type="text"
          name="jabatan"
          value={form.jabatan}
          onChange={handleChange}
          placeholder="Jabatan"
          className={inputClass}
        />
        <input
          id="input-mapel"
          type="text"
          name="mapel"
          value={form.mapel}
          onChange={handleChange}
          placeholder="Mata Pelajaran"
          className={inputClass}
        />
        <input
          id="input-kontak"
          type="text"
          name="kontak"
          value={form.kontak}
          onChange={handleChange}
          placeholder="Kontak"
          className={inputClass}
        />
        <button
          id="btn-simpan-guru"
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
        ) : guruList.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Belum ada data guru</p>
          </div>
        ) : (
          <table className="w-full text-xs sm:text-sm min-w-[520px]">
            <thead>
              <tr>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600 rounded-l-lg w-10">No</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-left font-semibold text-gray-600">Nama Guru</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600">Jabatan</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600">Mata Pelajaran</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600">Kontak</th>
                <th className="bg-gray-100 p-2.5 sm:p-3 text-center font-semibold text-gray-600 rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {guruList.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-500">{idx + 1}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 font-medium text-gray-800 whitespace-nowrap">{row.nama}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-600 whitespace-nowrap">{row.jabatan}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-600 whitespace-nowrap">{row.mata_pelajaran}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center text-gray-600 whitespace-nowrap">{row.kontak}</td>
                  <td className="p-2.5 sm:p-3 border-t border-gray-100 text-center">
                    <button
                      id={`btn-hapus-guru-${row.id}`}
                      onClick={() => openModal(row.id, row.nama)}
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

      <ConfirmModal
        isOpen={modal.open}
        title="Hapus Data Guru"
        message={`Nama Guru: ${modal.nama}`}
        onConfirm={handleHapus}
        onCancel={closeModal}
      />
    </div>
  )
}

export default GuruPage
