import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp, Check, Clock, User } from 'lucide-react'
import type { Rectification, Photo } from '../types'
import { getRectificationStatusText, getRectificationStatusColor, getRoleText } from '../utils/status'
import { cn } from '../lib/utils'

interface RectificationListProps {
  rectifications: Rectification[]
  canAdd?: boolean
  canResolve?: boolean
  canVerify?: boolean
  onAdd?: (description: string, beforePhotos: Photo[]) => void
  onResolve?: (rectId: string, afterPhotos: Photo[]) => void
  onVerify?: (rectId: string, passed: boolean) => void
}

export function RectificationList({
  rectifications,
  canAdd = false,
  canResolve = false,
  canVerify = false,
  onAdd,
  onResolve,
  onVerify,
}: RectificationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDescription, setNewDescription] = useState('')
  const [resolvingRect, setResolvingRect] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleAdd = () => {
    if (onAdd && newDescription.trim()) {
      onAdd(newDescription.trim(), [])
      setNewDescription('')
      setShowAddForm(false)
    }
  }

  const handleResolve = (rectId: string) => {
    if (onResolve) {
      onResolve(rectId, [])
      setResolvingRect(null)
    }
  }

  if (rectifications.length === 0 && !canAdd) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          整改项
        </h3>
        <div className="py-8 text-center text-gray-400">
          <Check className="w-12 h-12 mx-auto mb-3 text-green-300" />
          <p>暂无整改项，一切正常</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          整改项
          <span className="text-sm font-normal text-gray-400">({rectifications.length})</span>
        </h3>
        {canAdd && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            {showAddForm ? '取消' : '+ 添加整改'}
          </button>
        )}
      </div>

      {canAdd && showAddForm && (
        <div className="mb-4 p-4 bg-orange-50 rounded-xl">
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="请描述整改要求..."
            className="w-full p-3 border border-orange-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
            rows={3}
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              disabled={!newDescription.trim()}
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交整改
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rectifications.map((rect, index) => {
          const isExpanded = expandedId === rect.id
          return (
            <div
              key={rect.id}
              className={cn(
                'border rounded-xl overflow-hidden transition-all',
                rect.status === 'pending' ? 'border-red-200 bg-red-50/30' :
                rect.status === 'resolved' ? 'border-blue-200 bg-blue-50/30' :
                'border-green-200 bg-green-50/30',
              )}
            >
              <div
                onClick={() => toggleExpand(rect.id)}
                className="p-4 cursor-pointer hover:bg-white/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {rect.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {getRoleText(rect.createdBy)}
                        </span>
                        <span>{rect.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn(
                      'px-2.5 py-1 text-xs font-medium rounded-full',
                      getRectificationStatusColor(rect.status),
                    )}>
                      {getRectificationStatusText(rect.status)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {rect.beforePhotos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">整改前</p>
                      <div className="flex gap-2">
                        {rect.beforePhotos.map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={photo.caption || '整改前'}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {rect.afterPhotos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">整改后</p>
                      <div className="flex gap-2">
                        {rect.afterPhotos.map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={photo.caption || '整改后'}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {rect.resolvedAt && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>整改完成时间：{rect.resolvedAt}</span>
                    </div>
                  )}

                  {rect.verifiedAt && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Check className="w-3 h-3" />
                      <span>验证通过时间：{rect.verifiedAt}</span>
                    </div>
                  )}

                  {canResolve && rect.status === 'pending' && (
                    <div className="mt-4">
                      {resolvingRect === rect.id ? (
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">确认已完成整改？</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setResolvingRect(null)}
                              className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => handleResolve(rect.id)}
                              className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              确认整改
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingRect(rect.id)}
                          className="w-full py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          提交整改完成
                        </button>
                      )}
                    </div>
                  )}

                  {canVerify && rect.status === 'resolved' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => onVerify?.(rect.id, false)}
                        className="flex-1 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        整改不通过
                      </button>
                      <button
                        onClick={() => onVerify?.(rect.id, true)}
                        className="flex-1 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                      >
                        验证通过
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
