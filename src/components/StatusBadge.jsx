import React from 'react'

const STATUS_STYLES = {
  Hadir: 'bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium',
  'Tidak Hadir': 'bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium',
  Terlambat: 'bg-orange-400 text-white px-3 py-1 rounded-lg text-sm font-medium',
}

const StatusBadge = ({ status }) => {
  const className = STATUS_STYLES[status] ?? 'bg-gray-400 text-white px-3 py-1 rounded-lg text-sm font-medium'
  return <span className={className}>{status}</span>
}

export default StatusBadge
