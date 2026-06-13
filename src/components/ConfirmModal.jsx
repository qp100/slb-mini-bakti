import React, { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

/**
 * Modal konfirmasi hapus yang cantik.
 * Props:
 *   isOpen    — boolean, tampilkan modal atau tidak
 *   title     — judul modal (e.g. "Hapus Data Absensi")
 *   message   — pesan deskripsi (e.g. "Nama siswa: Budi")
 *   onConfirm — callback ketika tombol Hapus diklik
 *   onCancel  — callback ketika tombol Batal / X diklik
 */
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={onCancel}
    >
      {/* Panel Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-[fadeInScale_0.18s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol tutup */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Ikon peringatan */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Judul */}
        <h2 className="text-center text-lg font-bold text-gray-800 mb-1">
          {title ?? 'Konfirmasi Hapus'}
        </h2>

        {/* Pesan */}
        <p className="text-center text-sm text-gray-500 mb-1">
          Apakah kamu yakin ingin menghapus data ini?
        </p>
        {message && (
          <p className="text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-3 py-2 mt-2 mb-1">
            {message}
          </p>
        )}
        <p className="text-center text-xs text-red-400 mt-2 mb-6">
          Tindakan ini tidak dapat dibatalkan.
        </p>

        {/* Tombol aksi */}
        <div className="flex gap-3">
          <button
            id="modal-btn-batal"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all focus:outline-none"
          >
            Batal
          </button>
          <button
            id="modal-btn-hapus"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all focus:outline-none flex items-center justify-center gap-2 shadow-md shadow-red-200"
          >
            <Trash2 size={15} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
