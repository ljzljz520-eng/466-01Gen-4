import { Check, X } from 'lucide-react'
import { useProjectStore } from '../store/useProjectStore'
import { getNodeStatusColor } from '../utils/status'

export function ProgressTimeline() {
  const { project } = useProjectStore()
  const { nodes } = project

  const passedCount = nodes.filter((n) => n.status === 'passed').length
  const totalCount = nodes.length

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">验收进度</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">{passedCount}</span>
          <span className="text-gray-400">/</span>
          <span className="text-lg text-gray-500">{totalCount}</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
        <div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${(passedCount / totalCount) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {nodes.map((node, index) => {
            const isPassed = node.status === 'passed'
            const isCurrent = node.status !== 'pending' && node.status !== 'passed'
            const isLocked = node.status === 'pending' && index > 0 && nodes[index - 1].status !== 'passed'

            return (
              <div key={node.id} className="flex flex-col items-center">
                <div
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300
                    ${isPassed
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                      : isLocked
                      ? 'bg-gray-100 border-gray-200 text-gray-400'
                      : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isPassed ? (
                    <Check className="w-5 h-5" />
                  ) : node.status === 'rejected' ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium ${isPassed || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                    {node.name}
                  </p>
                  <span className={`
                    inline-block mt-1 px-2 py-0.5 text-xs rounded-full
                    ${getNodeStatusColor(node.status)}
                  `}>
                    {node.status === 'pending' ? (isLocked ? '未解锁' : '待开始') : ''}
                    {node.status === 'submitted' ? '验收中' : ''}
                    {node.status === 'rejected' ? '需整改' : ''}
                    {node.status === 'passed' ? '已通过' : ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
