import React from 'react'

const StatCard = ({ label, value, change, icon, color }) => {
  return (
    <div>
      
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-xs mt-1 ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% this month
        </p>
      </div>
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-lg`}>{icon}</div>
    </div>

    </div>
  )
}

export default StatCard