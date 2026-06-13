import { useState } from 'react'
import { X, UserPlus } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import type { Role } from '../types'
import { getRoleText } from '../utils/status'
import { cn } from '../lib/utils'

interface RegisterModalProps {
  className?: string
}

export function RegisterModal({ className }: RegisterModalProps) {
  const { isRegisterModalOpen, closeRegisterModal, openLoginModal, register } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('foreman')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isRegisterModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username.trim()) {
      setError('请输入用户名')
      return
    }
    if (!name.trim()) {
      setError('请输入姓名')
      return
    }
    if (password.length < 6) {
      setError('密码至少6位')
      return
    }
    if (password !== confirmPassword) {
      setError('两次密码输入不一致')
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const result = register(username.trim(), password, name.trim(), role)
    if (!result.success) {
      setError(result.message)
      setLoading(false)
    } else {
      setSuccess(result.message)
      setLoading(false)
    }
  }

  const handleClose = () => {
    closeRegisterModal()
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setRole('foreman')
    setError('')
    setSuccess('')
  }

  const handleGoLogin = () => {
    closeRegisterModal()
    openLoginModal()
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setRole('foreman')
    setError('')
    setSuccess('')
  }

  const roles: Role[] = ['foreman', 'owner', 'supervisor']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className={cn(
        'relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6',
        'animate-in fade-in zoom-in-95 duration-200',
        className,
      )}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">注册账号</h2>
          <p className="text-sm text-gray-500 mt-1">创建您的验收系统账号</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              真实姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入您的姓名"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              角色身份
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    'py-2.5 px-3 rounded-xl text-sm font-medium transition-all',
                    role === r
                      ? r === 'foreman'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                        : r === 'owner'
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                        : 'bg-purple-500 text-white shadow-md shadow-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  )}
                >
                  {getRoleText(r)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                注 册
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          已有账号？
          <button
            onClick={handleGoLogin}
            className="text-blue-500 hover:text-blue-600 font-medium ml-1"
          >
            去登录
          </button>
        </p>
      </div>
    </div>
  )
}
