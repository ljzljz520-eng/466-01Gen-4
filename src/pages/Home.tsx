import { MapPin, Building2, RotateCcw } from 'lucide-react'
import { RoleSwitcher } from '../components/RoleSwitcher'
import { ProgressTimeline } from '../components/ProgressTimeline'
import { NodeCard } from '../components/NodeCard'
import { useProjectStore } from '../store/useProjectStore'
import { roleInfos } from '../data/mockData'

export default function Home() {
  const { project, currentRole, canProceedToNode, resetProject } = useProjectStore()
  const currentRoleInfo = roleInfos[currentRole]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{project.name}</h1>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{project.address}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RoleSwitcher />
              <button
                onClick={resetProject}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="重置数据"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">当前身份</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{currentRoleInfo.avatar}</span>
                <span className="text-xl font-semibold">{currentRoleInfo.name}</span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {currentRole === 'foreman' && '工长'}
                  {currentRole === 'owner' && '业主'}
                  {currentRole === 'supervisor' && '监理'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">隐蔽工程验收</p>
              <p className="text-2xl font-bold mt-1">验收簿</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <ProgressTimeline />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">验收节点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.nodes.map((node, index) => (
              <NodeCard
                key={node.id}
                node={node}
                index={index}
                locked={!canProceedToNode(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">💡 使用说明</h3>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• <strong>工长</strong>：上传验收照片、提交验收申请、完成整改</li>
            <li>• <strong>业主</strong>：查看验收内容、签字确认</li>
            <li>• <strong>监理</strong>：专业验收、签字确认、发起整改项、验证整改</li>
            <li>• 四个节点按顺序进行，前一节点未通过不能进入下一节点</li>
            <li>• 存在未完成整改项时，不能通过验收</li>
          </ul>
        </div>
      </main>

      <footer className="mt-12 py-6 text-center text-xs text-gray-400">
        <p>装修隐蔽工程验收簿 · 质量有保障</p>
      </footer>
    </div>
  )
}
