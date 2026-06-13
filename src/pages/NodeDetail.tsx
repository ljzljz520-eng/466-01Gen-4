import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Zap,
  Droplets,
  LayoutGrid,
  Layers,
  ImageIcon,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  User,
} from 'lucide-react'
import { UserMenu } from '../components/UserMenu'
import { PhotoGallery } from '../components/PhotoGallery'
import { SignaturePanel } from '../components/SignaturePanel'
import { RectificationList } from '../components/RectificationList'
import { useProjectStore } from '../store/useProjectStore'
import { useAuthStore } from '../store/useAuthStore'
import { getNodeStatusText, getNodeStatusColor } from '../utils/status'
import { cn } from '../lib/utils'
import type { Photo } from '../types'

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Droplets,
  LayoutGrid,
  Layers,
}

export default function NodeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    project,
    uploadPhoto,
    submitNode,
    signNode,
    addRectification,
    resolveRectification,
    verifyRectification,
    getNodeIndex,
    canProceedToNode,
  } = useProjectStore()
  const { currentUser, openLoginModal } = useAuthStore()

  const node = project.nodes.find((n) => n.id === id)

  if (!node) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">节点不存在</p>
      </div>
    )
  }

  const nodeIndex = getNodeIndex(node.id)
  const isLocked = !canProceedToNode(nodeIndex)
  const Icon = iconMap[node.icon] || Zap
  const userRole = currentUser?.role

  const canUploadPhoto = userRole === 'foreman' && node.status !== 'passed' && !isLocked
  const canSubmit =
    userRole === 'foreman' &&
    node.status !== 'passed' &&
    node.photos.length > 0 &&
    node.rectifications.every((r) => r.status === 'verified') &&
    !isLocked
  const canSign =
    (userRole === 'owner' || userRole === 'supervisor') &&
    (node.status === 'submitted' || node.status === 'rejected') &&
    node.rectifications.every((r) => r.status === 'verified') &&
    currentUser &&
    !node.signatures.find((s) => s.role === userRole)?.signed
  const canAddRectification = userRole === 'supervisor' && node.status !== 'passed' && !isLocked
  const canResolveRectification = userRole === 'foreman' && !isLocked
  const canVerifyRectification = userRole === 'supervisor' && !isLocked

  const hasPendingRect = node.rectifications.some((r) => r.status === 'pending')

  const handlePhotoUpload = (file: File) => {
    if (!currentUser) {
      openLoginModal()
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      uploadPhoto(node.id, {
        url,
        caption: file.name,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!currentUser) {
      openLoginModal()
      return
    }
    if (canSubmit) {
      submitNode(node.id)
    }
  }

  const handleSign = (signatureData: string) => {
    if (!currentUser) {
      openLoginModal()
      return
    }
    signNode(node.id, signatureData)
  }

  const handleAddRectification = (description: string, beforePhotos: Photo[]) => {
    if (!currentUser) {
      openLoginModal()
      return
    }
    addRectification(node.id, description, beforePhotos)
  }

  const handleResolveRectification = (rectId: string, afterPhotos: Photo[]) => {
    if (!currentUser) {
      openLoginModal()
      return
    }
    resolveRectification(node.id, rectId, afterPhotos)
  }

  const handleVerifyRectification = (rectId: string, passed: boolean) => {
    if (!currentUser) {
      openLoginModal()
      return
    }
    verifyRectification(node.id, rectId, passed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 pb-24">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    node.status === 'passed'
                      ? 'bg-green-100 text-green-600'
                      : node.status === 'rejected'
                      ? 'bg-orange-100 text-orange-600'
                      : node.status === 'submitted'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500',
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{node.name}</h1>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', getNodeStatusColor(node.status))}>
                    {getNodeStatusText(node.status)}
                  </span>
                </div>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {isLocked && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">此节点尚未解锁</p>
              <p className="text-xs text-amber-600 mt-0.5">请先完成上一个节点的验收</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {node.submittedAt && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>提交时间：{node.submittedAt}</span>
            </div>
            {node.submittedByUserName && (
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-4 h-4" />
                <span>提交人：{node.submittedByUserName}</span>
              </div>
            )}
          </div>
        )}

        {node.passedAt && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-medium text-green-800">验收通过</p>
              <p className="text-sm text-green-600">通过时间：{node.passedAt}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            验收照片
            <span className="text-sm font-normal text-gray-400">({node.photos.length}张)</span>
          </h3>

          {node.photos.length === 0 && !canUploadPhoto ? (
            <div className="py-8 text-center text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无照片</p>
            </div>
          ) : (
            <PhotoGallery
              photos={node.photos}
              canUpload={canUploadPhoto}
              onUpload={handlePhotoUpload}
            />
          )}

          {!currentUser && !canUploadPhoto && node.photos.length === 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-700">
                请
                <button onClick={openLoginModal} className="text-blue-600 font-medium hover:underline ml-1">
                  登录工长账号
                </button>
                上传照片
              </p>
            </div>
          )}
        </div>

        <SignaturePanel
          signatures={node.signatures}
          canSign={canSign}
          currentRole={userRole || 'foreman'}
          onSign={handleSign}
        />

        {!currentUser && node.status !== 'passed' && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <p className="text-sm text-blue-700">
              请
              <button onClick={openLoginModal} className="text-blue-600 font-medium hover:underline mx-1">
                登录
              </button>
              后进行签字和整改操作
            </p>
          </div>
        )}

        {hasPendingRect && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">存在待整改项</p>
              <p className="text-xs text-red-600 mt-0.5">所有整改项完成并验证后，才能签字验收</p>
            </div>
          </div>
        )}

        <RectificationList
          rectifications={node.rectifications}
          canAdd={canAddRectification}
          canResolve={canResolveRectification}
          canVerify={canVerifyRectification}
          onAdd={handleAddRectification}
          onResolve={handleResolveRectification}
          onVerify={handleVerifyRectification}
        />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {canSubmit ? (
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              提交验收申请
            </button>
          ) : !currentUser ? (
            <button
              onClick={openLoginModal}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              登录后操作
            </button>
          ) : node.status === 'pending' && userRole === 'foreman' ? (
            <div className="text-center py-2 text-gray-500 text-sm">
              请先上传验收照片后再提交
            </div>
          ) : hasPendingRect && userRole === 'foreman' ? (
            <div className="text-center py-2 text-orange-600 text-sm">
              请先完成所有整改项后再提交验收
            </div>
          ) : node.status === 'submitted' || node.status === 'rejected' ? (
            <div className="text-center py-2 text-blue-600 text-sm">
              等待业主和监理签字确认...
            </div>
          ) : node.status === 'passed' ? (
            <div className="text-center py-2 text-green-600 text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              本节点已验收通过
            </div>
          ) : (
            <div className="text-center py-2 text-gray-400 text-sm">
              当前角色无操作权限
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
