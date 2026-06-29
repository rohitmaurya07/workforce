import React from 'react'

const Settings = () => {
  return (
    <div>
        <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1 space-y-2">
          {["General", "Security", "Notifications", "Integrations", "Billing"].map(s => (
            <button key={s} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${s === "General" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Company Info</h2>
            <div className="space-y-4">
              {[["Company Name", "WorkForce Inc."], ["Industry", "Software & Technology"], ["Company Size", "1–50 employees"]].map(([label, val]) => (
                <div key={label}>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                  <input defaultValue={val} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 bg-gray-50" />
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Admin Account</h2>
            <div className="space-y-4">
              {[["Full Name", "Rohit Admin"], ["Email", "admin@company.com"]].map(([label, val]) => (
                <div key={label}>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                  <input defaultValue={val} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 bg-gray-50" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Settings