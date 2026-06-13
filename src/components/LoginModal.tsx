import { useState } from 'react'
import { X, LogIn } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { cn } from '../lib/utils'

interface LoginModalProps {
  className?: string
}

export function LoginModal({ className }: LoginModalProps) {
  const { isLoginModalOpen, closeLoginModal, openRegisterModal, login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isLoginModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 300))

    const result = login(username.trim(), password)
    if (!result.success) {
      setError(result.message)
      setLoading(false)
    } else {
      setUsername('')
      setPassword('')
      setLoading(false)
    }
  }

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user)
    setPassword(pass)
  }

  const handleClose = () => {
    closeLoginModal()
    setUsername('')
    setPassword('')
    setError('')
  }

  const handleGoRegister = () => {
    closeLoginModal()
    openRegisterModal()
    setUsername('')
    setPassword('')
    setError('')
  }

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
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">登录验收系统</h2>
          <p className="text-sm text-gray-500 mt-1">请输入您的账号密码</p>
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
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                登 录
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-3 text-center">快速登录测试账号（密码均为 123456）</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('gongzhang', '123456')}
              className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm rounded-lg transition-colors"
            >
              👷 工长
            </button>
            <button
              onClick={() => handleQuickLogin('yezhu', '123456')}
              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-lg transition-colors"
            >
              🏠 业主
            </button>
            <button
              onClick={() => handleQuickLogin('jianli', '123456')}
              className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm rounded-lg transition-colors"
            >
              📋 监理
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          还没有账号？
          <button
            onClick={handleGoRegister}
            className="text-blue-500 hover:text-blue-600 font-medium ml-1"
          >
            立即注册
          </button>
        </p>
      </div>
    </div>
  )
}
