import { useNavigate } from 'react-router-dom'
import { Zap, Droplets, LayoutGrid, Layers, Lock, ChevronRight, ImageIcon, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { AcceptanceNode } from '../types'
import { getNodeStatusText, getNodeStatusColor } from '../utils/status'
import { cn } from '../lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Droplets,
  LayoutGrid,
  Layers,
}

interface NodeCardProps {
  node: AcceptanceNode
  index: number
  locked: boolean
}

export function NodeCard({ node, index, locked }: NodeCardProps) {
  const navigate = useNavigate()
  const Icon = iconMap[node.icon] || Zap

  const signedCount = node.signatures.filter((s) => s.signed).length
  const totalSignatures = node.signatures.length
  const pendingRectCount = node.rectifications.filter((r) => r.status === 'pending').length

  const handleClick = () => {
    if (!locked) {
      navigate(`/node/${node.id}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative bg-white rounded-2xl p-5 border transition-all duration-300',
        locked
          ? 'opacity-60 cursor-not-allowed border-gray-100'
          : 'cursor-pointer hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 border-gray-100',
      )}
    >
      <div className="absolute top-4 right-4">
        {locked ? (
          <div className="flex items-center gap-1 text-gray-400">
            <Lock className="w-4 h-4" />
          </div>
        ) : node.status === 'passed' ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : node.status === 'rejected' ? (
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        ) : null}
      </div>

      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            node.status === 'passed'
              ? 'bg-green-100 text-green-600'
              : node.status === 'rejected'
              ? 'bg-orange-100 text-orange-600'
              : node.status === 'submitted'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-500',
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">第 {index + 1} 项</span>
            <span className={cn('px-2 py-0.5 text-xs rounded-full font-medium', getNodeStatusColor(node.status))}>
              {getNodeStatusText(node.status)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-1">{node.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{node.description}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <ImageIcon className="w-4 h-4" />
            <span>{node.photos.length}张照片</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="flex -space-x-1">
              {node.signatures.map((sig) => (
                <span
                  key={sig.role}
                  className={cn(
                    'w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs',
                    sig.signed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400',
                  )}
                >
                  {sig.signed ? '✓' : '○'}
                </span>
              ))}
            </span>
            <span>{signedCount}/{totalSignatures}签字</span>
          </div>
        </div>

        {!locked && (
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
        )}
      </div>

      {pendingRectCount > 0 && (
        <div className="mt-3 p-2.5 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{pendingRectCount} 项待整改</span>
        </div>
      )}
    </div>
  )
}
