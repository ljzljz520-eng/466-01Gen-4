import type { NodeStatus, RectificationStatus, Role } from '../types'

export const getNodeStatusText = (status: NodeStatus): string => {
  const map: Record<NodeStatus, string> = {
    pending: '待提交',
    submitted: '验收中',
    rejected: '需整改',
    passed: '已通过',
  }
  return map[status]
}

export const getNodeStatusColor = (status: NodeStatus): string => {
  const map: Record<NodeStatus, string> = {
    pending: 'bg-gray-100 text-gray-600',
    submitted: 'bg-blue-100 text-blue-700',
    rejected: 'bg-orange-100 text-orange-700',
    passed: 'bg-green-100 text-green-700',
  }
  return map[status]
}

export const getRectificationStatusText = (status: RectificationStatus): string => {
  const map: Record<RectificationStatus, string> = {
    pending: '待整改',
    resolved: '已整改',
    verified: '已验证',
  }
  return map[status]
}

export const getRectificationStatusColor = (status: RectificationStatus): string => {
  const map: Record<RectificationStatus, string> = {
    pending: 'bg-red-100 text-red-700',
    resolved: 'bg-blue-100 text-blue-700',
    verified: 'bg-green-100 text-green-700',
  }
  return map[status]
}

export const getRoleText = (role: Role): string => {
  const map: Record<Role, string> = {
    foreman: '工长',
    owner: '业主',
    supervisor: '监理',
  }
  return map[role]
}

export const getRoleColor = (role: Role): string => {
  const map: Record<Role, string> = {
    foreman: 'bg-amber-500',
    owner: 'bg-blue-500',
    supervisor: 'bg-purple-500',
  }
  return map[role]
}
