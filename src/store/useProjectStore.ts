import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Role, Photo, Rectification } from '../types'
import { mockProject } from '../data/mockData'

interface ProjectState {
  project: Project
  currentRole: Role
  setRole: (role: Role) => void
  uploadPhoto: (nodeId: string, photo: Omit<Photo, 'id' | 'uploadAt' | 'uploadBy'>) => void
  submitNode: (nodeId: string) => void
  signNode: (nodeId: string, signatureData?: string) => void
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

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      project: mockProject,
      currentRole: 'foreman',

      setRole: (role: Role) => {
        set({ currentRole: role })
      },

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
        const { currentRole, project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const newPhoto: Photo = {
          ...photo,
          id: generateId(),
          uploadAt: getNowString(),
          uploadBy: currentRole,
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
      },

      submitNode: (nodeId: string) => {
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
          }
          return {
            project: {
              ...state.project,
              nodes: newNodes,
            },
          }
        })
      },

      signNode: (nodeId: string, signatureData?: string) => {
        const { currentRole, project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const node = project.nodes[nodeIndex]
        if (node.status !== 'submitted') return

        const hasPendingRect = node.rectifications.some((r) => r.status === 'pending')
        if (hasPendingRect) return

        const sigIndex = node.signatures.findIndex((s) => s.role === currentRole)
        if (sigIndex === -1) return

        set((state) => {
          const newNodes = [...state.project.nodes]
          const newSignatures = [...newNodes[nodeIndex].signatures]
          newSignatures[sigIndex] = {
            ...newSignatures[sigIndex],
            signed: true,
            signedAt: getNowString(),
            signatureData: signatureData || `sig-${generateId()}`,
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
      },

      addRectification: (nodeId: string, description: string, beforePhotos: Photo[] = []) => {
        const { currentRole, project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const newRect: Rectification = {
          id: generateId(),
          description,
          status: 'pending',
          createdAt: getNowString(),
          createdBy: currentRole,
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
      },

      resolveRectification: (nodeId: string, rectId: string, afterPhotos: Photo[] = []) => {
        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const rectIndex = project.nodes[nodeIndex].rectifications.findIndex((r) => r.id === rectId)
        if (rectIndex === -1) return

        set((state) => {
          const newNodes = [...state.project.nodes]
          const newRects = [...newNodes[nodeIndex].rectifications]
          newRects[rectIndex] = {
            ...newRects[rectIndex],
            status: 'resolved',
            afterPhotos,
            resolvedAt: getNowString(),
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
      },

      verifyRectification: (nodeId: string, rectId: string, passed: boolean) => {
        const { project } = get()
        const nodeIndex = project.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) return

        const rectIndex = project.nodes[nodeIndex].rectifications.findIndex((r) => r.id === rectId)
        if (rectIndex === -1) return

        set((state) => {
          const newNodes = [...state.project.nodes]
          const newRects = [...newNodes[nodeIndex].rectifications]

          if (passed) {
            newRects[rectIndex] = {
              ...newRects[rectIndex],
              status: 'verified',
              verifiedAt: getNowString(),
            }
          } else {
            newRects[rectIndex] = {
              ...newRects[rectIndex],
              status: 'pending',
              afterPhotos: [],
              resolvedAt: undefined,
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
      },

      resetProject: () => {
        set({ project: mockProject, currentRole: 'foreman' })
      },
    }),
    {
      name: 'acceptance-book-storage',
    },
  ),
)
