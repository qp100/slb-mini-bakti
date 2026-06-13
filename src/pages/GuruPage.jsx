import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
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

  const handleHapus = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data guru ini?')) return
    try {
      const { error } = await supabase.from('guru').delete().eq('id', id)
      if (error) throw error
      await fetchGuru()
    } catch (err) {
      console.error('Error deleting guru:', err)
      alert('Gagal menghapus data.')
    }
  }

  const inputClass =
    'w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-shadow'

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Users size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Data Guru</h1>
          <p className="text-xs text-gray-500">Kelola data tenaga pengajar sekolah</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
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
          className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-600 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Memuat data...</p>
        ) : guruList.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400">Belum ada data guru</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="bg-gray-100 p-3 text-center font-semibold text-gray-600 rounded-l-lg">No</th>
                <th className="bg-gray-100 p-3 text-left font-semibold text-gray-600">Nama Guru</th>
                <th className="bg-gray-100 p-3 text-center font-semibold text-gray-600">Jabatan</th>
                <th className="bg-gray-100 p-3 text-center font-semibold text-gray-600">Mata Pelajaran</th>
                <th className="bg-gray-100 p-3 text-center font-semibold text-gray-600">Kontak</th>
                <th className="bg-gray-100 p-3 text-center font-semibold text-gray-600 rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {guruList.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-t border-gray-100 text-center text-gray-500">{idx + 1}</td>
                  <td className="p-3 border-t border-gray-100 font-medium text-gray-800">{row.nama}</td>
                  <td className="p-3 border-t border-gray-100 text-center text-gray-600">{row.jabatan}</td>
                  <td className="p-3 border-t border-gray-100 text-center text-gray-600">{row.mata_pelajaran}</td>
                  <td className="p-3 border-t border-gray-100 text-center text-gray-600">{row.kontak}</td>
                  <td className="p-3 border-t border-gray-100 text-center">
                    <button
                      id={`btn-hapus-guru-${row.id}`}
                      onClick={() => handleHapus(row.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 active:scale-95 transition-all flex items-center gap-1 mx-auto"
                    >
                      <Trash2 size={13} />
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

export default GuruPage
