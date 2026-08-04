import React from 'react'
import { avatarColors, employees, statusBadge, teams } from '../data';


export const Teams = () => {
    
  return (
    <div>
        <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Teams</h1>
          <p className="text-gray-500 text-sm mt-0.5">{teams.length} teams</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
          + Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {teams.map(team => {
          const teamEmployees = employees.filter(e => e.team === team.name);
          return (
            <div key={team.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${team.color}`}>{team.name}</span>
                </div>
                <span className="text-xs text-gray-500">{team.projects} projects</span>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Team Lead</p>
                <p className="text-sm font-medium text-gray-900">{team.lead}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Members ({teamEmployees.length})</p>
                <div className="space-y-2">
                  {teamEmployees.map((emp, i) => (
                    <div key={emp.id} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                        {emp.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.role}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(emp.status)}`}>{emp.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  )
}
