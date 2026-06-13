import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Photo, Rectification } from '../types'
import { mockProject } from '../data/mockData'
import { useAuthStore } from './useAuthStore'

interface ProjectState {
  project: Project
  uploadPhoto: (nodeId: string, photo: Omit<Photo, 'id' | 'uploadAt' | 'uploadBy' | 'uploadByUserId' | 'uploadByUserName'>) => void
  submitNode: (nodeId: string) => void
  signNode: (nodeId: string, signatureData?: string) => boolean
  addRectification: (nodeId: string, description: string, beforePhotos?: Photo[]) => void
  resolveRectification: (nodeId: string, rectId: string, afterPhotos?: Photo[]) => void
  verifyRectification: (nodeId: string, rectId: string, passed: boolean) => void
  canProceedToNode: (nodeIndex: number) => boolean
  getNodeIndex: (nodeId: string) => number
  resetProject: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

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

const getCurrentUser = () => {
  const { currentUser } = useAuthStore.getState()
  return currentUser
}

const addLog = (action: string, nodeId?: string, nodeName?: string, details?: Record<string, unknown>) => {
  const { addOperationLog } = useAuthStore.getState()
  addOperationLog(action, nodeId, nodeName, details)
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      project: mockProject,

      getNodeIndex: (nodeId: string) => {
        const { project } = get()
        return project.nodes.findIndex((n) => n.id === nodeId)
      },

      canProceedToNode: (nodeIndex: number) => {
        if (nodeIndex <= 0) return true
        const { project } = get()
        const prevNode = project.nodes[nodeIndex - 1]
        return prevNode.status === 'passed'
      },

      uploadPhoto: (nodeId: string, photo) => {
        const user = getCurrentUser()
        if (!user) return

        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const node = project.nodes[nodeIndex]

        const newPhoto: Photo = {
          ...photo,
          id: generateId(),
          uploadAt: getNowString(),
          uploadBy: user.role,
          uploadByUserId: user.id,
          uploadByUserName: user.name,
        }

        set((state) => {
          const newNodes = [...state.project.nodes]
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            photos: [...newNodes[nodeIndex].photos, newPhoto],
          }
          return {
            project: {
              ...state.project,
              nodes: newNodes,
            },
          }
        })

        addLog('上传照片', nodeId, node.name, { photoCount: 1 })
      },

      submitNode: (nodeId: string) => {
        const user = getCurrentUser()
        if (!user) return

        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const node = project.nodes[nodeIndex]
        const hasPendingRect = node.rectifications.some((r) => r.status === 'pending')
        if (hasPendingRect) return

        if (node.photos.length === 0) return

        set((state) => {
          const newNodes = [...state.project.nodes]
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            status: 'submitted',
            submittedAt: getNowString(),
            submittedByUserId: user.id,
            submittedByUserName: user.name,
          }
          return {
            project: {
              ...state.project,
              nodes: newNodes,
            },
          }
        })

        addLog('提交验收申请', nodeId, node.name)
      },

      signNode: (nodeId: string, signatureData?: string): boolean => {
        const user = getCurrentUser()
        if (!user) return false

        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return false

        const node = project.nodes[nodeIndex]
        if (node.status !== 'submitted' && node.status !== 'rejected') return false

        const hasPendingRect = node.rectifications.some((r) => r.status === 'pending')
        if (hasPendingRect) return false

        const sigIndex = node.signatures.findIndex((s) => s.role === user.role)
        if (sigIndex === -1) return false

        if (node.signatures[sigIndex].signed) return false

        set((state) => {
          const newNodes = [...state.project.nodes]
          const newSignatures = [...newNodes[nodeIndex].signatures]
          newSignatures[sigIndex] = {
            ...newSignatures[sigIndex],
            signed: true,
            signedAt: getNowString(),
            signatureData: signatureData || `sig-${generateId()}`,
            signedByUserId: user.id,
          }

          const allSigned = newSignatures.every((s) => s.signed)
          const newStatus = allSigned ? 'passed' : 'submitted'

          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            signatures: newSignatures,
            status: newStatus,
            passedAt: allSigned ? getNowString() : newNodes[nodeIndex].passedAt,
          }

          return {
            project: {
              ...state.project,
              nodes: newNodes,
            },
          }
        })

        addLog('签字确认', nodeId, node.name, { role: user.role })

        return true
      },

      addRectification: (nodeId: string, description: string, beforePhotos: Photo[] = []) => {
        const user = getCurrentUser()
        if (!user) return

        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const node = project.nodes[nodeIndex]

        const newRect: Rectification = {
          id: generateId(),
          description,
          status: 'pending',
          createdAt: getNowString(),
          createdBy: user.role,
          createdByUserId: user.id,
          createdByUserName: user.name,
          beforePhotos,
          afterPhotos: [],
        }

        set((state) => {
          const newNodes = [...state.project.nodes]
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            status: 'rejected',
            rectifications: [...newNodes[nodeIndex].rectifications, newRect],
          }
          return {
            project: {
              ...state.project,
              nodes: newNodes,
            },
          }
        })

        addLog('发起整改', nodeId, node.name, { description })
      },

      resolveRectification: (nodeId: string, rectId: string, afterPhotos: Photo[] = []) => {
        const user = getCurrentUser()
        if (!user) return

        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const rectIndex = project.nodes[nodeIndex].rectifications.findIndex((r) => r.id === rectId)
        if (rectIndex === -1) return

        const node = project.nodes[nodeIndex]

        set((state) => {
          const newNodes = [...state.project.nodes]
          const newRects = [...newNodes[nodeIndex].rectifications]
          newRects[rectIndex] = {
            ...newRects[rectIndex],
            status: 'resolved',
            afterPhotos,
            resolvedAt: getNowString(),
            resolvedByUserId: user.id,
            resolvedByUserName: user.name,
          }
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            rectifications: newRects,
          }
          return {
            project: {
              ...state.project,
              nodes: newNodes,
            },
          }
        })

        addLog('提交整改完成', nodeId, node.name, { rectId })
      },

      verifyRectification: (nodeId: string, rectId: string, passed: boolean) => {
        const user = getCurrentUser()
        if (!user) return

        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const rectIndex = project.nodes[nodeIndex].rectifications.findIndex((r) => r.id === rectId)
        if (rectIndex === -1) return

        const node = project.nodes[nodeIndex]

        set((state) => {
          const newNodes = [...state.project.nodes]
          const newRects = [...newNodes[nodeIndex].rectifications]

          if (passed) {
            newRects[rectIndex] = {
              ...newRects[rectIndex],
              status: 'verified',
              verifiedAt: getNowString(),
              verifiedByUserId: user.id,
              verifiedByUserName: user.name,
            }
          } else {
            newRects[rectIndex] = {
              ...newRects[rectIndex],
              status: 'pending',
              afterPhotos: [],
              resolvedAt: undefined,
              resolvedByUserId: undefined,
              resolvedByUserName: undefined,
            }
          }

          const allVerified = newRects.every((r) => r.status === 'verified')
          const hasPhotos = newNodes[nodeIndex].photos.length > 0

          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            rectifications: newRects,
            status: allVerified && hasPhotos ? 'submitted' : 'rejected',
          }

          return {
            project: {
              ...state.project,
              nodes: newNodes,
            },
          }
        })

        addLog(
          passed ? '验证整改通过' : '验证整改不通过',
          nodeId,
          node.name,
          { rectId, passed },
        )
      },

      resetProject: () => {
        set({ project: mockProject })
        addLog('重置项目数据')
      },
    }),
    {
      name: 'acceptance-book-storage',
    },
  ),
)
