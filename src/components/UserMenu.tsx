import { useState } from 'react'
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { getRoleText } from '../utils/status'
import { cn } from '../lib/utils'

interface UserMenuProps {
  className?: string
}

export function UserMenu({ className }: UserMenuProps) {
  const { currentUser, openLoginModal, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!currentUser) {
    return (
      <button
        onClick={openLoginModal}
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-blue-200',
          className,
        )}
      >
        <LogIn className="w-4 h-4" />
        登录
      </button>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
          {currentUser.avatar}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-500">{getRoleText(currentUser.role)}</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', menuOpen && 'rotate-180')} />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">@{currentUser.username}</span>
              </div>
            </div>
            <button
              onClick={() => {
                logout()
                setMenuOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </>
      )}
    </div>
  )
}
