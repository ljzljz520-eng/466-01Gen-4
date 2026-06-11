import { useProjectStore } from '../store/useProjectStore'
import { roleInfos } from '../data/mockData'
import { getRoleText } from '../utils/status'
import type { Role } from '../types'

const roles: Role[] = ['foreman', 'owner', 'supervisor']

export function RoleSwitcher() {
  const { currentRole, setRole } = useProjectStore()

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
      <span className="text-xs text-gray-500 px-2 font-medium">角色:</span>
      <div className="flex gap-1">
        {roles.map((role) => {
          const info = roleInfos[role]
          const isActive = currentRole === role
          return (
            <button
              key={role}
              onClick={() => setRole(role)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-base">{info.avatar}</span>
              <span>{getRoleText(role)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
