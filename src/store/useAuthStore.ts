import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Role, OperationLog } from '../types'

interface RegisteredUser {
  id: string
  username: string
  passwordHash: string
  name: string
  role: Role
  avatar: string
  createdAt: string
}

interface AuthState {
  currentUser: User | null
  registeredUsers: RegisteredUser[]
  operationLogs: OperationLog[]
  isLoginModalOpen: boolean
  isRegisterModalOpen: boolean
  login: (username: string, password: string) => { success: boolean; message: string }
  register: (username: string, password: string, name: string, role: Role) => { success: boolean; message: string }
  logout: () => void
  openLoginModal: () => void
  closeLoginModal: () => void
  openRegisterModal: () => void
  closeRegisterModal: () => void
  addOperationLog: (action: string, nodeId?: string, nodeName?: string, details?: Record<string, unknown>) => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

const hashPassword = (password: string): string => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(16)
}

const getNowString = () => {
  const now = new Date()
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const defaultUsers: RegisteredUser[] = [
  {
    id: 'user-foreman',
    username: 'gongzhang',
    passwordHash: hashPassword('123456'),
    name: '张工长',
    role: 'foreman',
    avatar: '👷',
    createdAt: '2024-01-01 00:00',
  },
  {
    id: 'user-owner',
    username: 'yezhu',
    passwordHash: hashPassword('123456'),
    name: '李业主',
    role: 'owner',
    avatar: '🏠',
    createdAt: '2024-01-01 00:00',
  },
  {
    id: 'user-supervisor',
    username: 'jianli',
    passwordHash: hashPassword('123456'),
    name: '王监理',
    role: 'supervisor',
    avatar: '📋',
    createdAt: '2024-01-01 00:00',
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      registeredUsers: defaultUsers,
      operationLogs: [],
      isLoginModalOpen: false,
      isRegisterModalOpen: false,

      login: (username: string, password: string) => {
        const { registeredUsers } = get()
        const user = registeredUsers.find((u) => u.username === username)

        if (!user) {
          return { success: false, message: '用户不存在' }
        }

        if (user.passwordHash !== hashPassword(password)) {
          return { success: false, message: '密码错误' }
        }

        const currentUser: User = {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        }

        set({ currentUser, isLoginModalOpen: false })
        get().addOperationLog('登录')

        return { success: true, message: '登录成功' }
      },

      register: (username: string, password: string, name: string, role: Role) => {
        const { registeredUsers } = get()

        if (registeredUsers.some((u) => u.username === username)) {
          return { success: false, message: '用户名已存在' }
        }

        const newUser: RegisteredUser = {
          id: generateId(),
          username,
          passwordHash: hashPassword(password),
          name,
          role,
          avatar: role === 'foreman' ? '👷' : role === 'owner' ? '🏠' : '📋',
          createdAt: getNowString(),
        }

        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser],
          isRegisterModalOpen: false,
          isLoginModalOpen: true,
        }))

        return { success: true, message: '注册成功，请登录' }
      },

      logout: () => {
        get().addOperationLog('退出登录')
        set({ currentUser: null })
      },

      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
      openRegisterModal: () => set({ isRegisterModalOpen: true }),
      closeRegisterModal: () => set({ isRegisterModalOpen: false }),

      addOperationLog: (action: string, nodeId?: string, nodeName?: string, details?: Record<string, unknown>) => {
        const { currentUser } = get()
        if (!currentUser) return

        const log: OperationLog = {
          id: generateId(),
          userId: currentUser.id,
          userName: currentUser.name,
          role: currentUser.role,
          action,
          nodeId,
          nodeName,
          timestamp: getNowString(),
          details,
        }

        set((state) => ({
          operationLogs: [log, ...state.operationLogs].slice(0, 200),
        }))
      },
    }),
    {
      name: 'acceptance-auth-storage',
    },
  ),
)
