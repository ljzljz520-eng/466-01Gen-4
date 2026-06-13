import { useState, useRef } from 'react'
import { Check, PenLine, Clock, User } from 'lucide-react'
import type { Signature } from '../types'
import { getRoleText } from '../utils/status'
import { cn } from '../lib/utils'

interface SignaturePanelProps {
  signatures: Signature[]
  canSign: boolean
  currentRole: string
  onSign: (signatureData: string) => void
}

export function SignaturePanel({ signatures, canSign, currentRole, onSign }: SignaturePanelProps) {
  const [showCanvas, setShowCanvas] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true
    const pos = getPosition(e)
    lastPosRef.current = pos
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const pos = getPosition(e)
    const lastPos = lastPosRef.current
    if (!lastPos) return

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPosRef.current = pos
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
    lastPosRef.current = null
  }

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleConfirm = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const signatureData = canvas.toDataURL()
    onSign(signatureData)
    setShowCanvas(false)
    clearCanvas()
  }

  const handleCancel = () => {
    setShowCanvas(false)
    clearCanvas()
  }

  const currentSig = signatures.find((s) => s.role === currentRole)
  const canCurrentSign = canSign && currentSig && !currentSig.signed

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PenLine className="w-5 h-5 text-blue-500" />
        签字确认
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {signatures.map((sig) => {
          const isCurrent = sig.role === currentRole
          const canSignThis = canCurrentSign && isCurrent

          return (
            <div
              key={sig.role}
              className={cn(
                'relative rounded-xl p-4 border-2 transition-all',
                sig.signed
                  ? 'border-green-200 bg-green-50'
                  : isCurrent
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-100 bg-gray-50',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    sig.signed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500',
                  )}
                >
                  {sig.signed ? <Check className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{sig.name}</p>
                  <p className="text-sm text-gray-500">{getRoleText(sig.role)}</p>
                </div>
              </div>

              {sig.signed ? (
                <div className="mt-3">
                  <div className="h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {sig.signatureData?.startsWith('data:') ? (
                      <img src={sig.signatureData} alt="签名" className="h-full w-auto" />
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">已签字确认</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    {sig.signedAt}
                  </p>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">等待签字</span>
                </div>
              )}

              {canSignThis && (
                <button
                  onClick={() => setShowCanvas(true)}
                  className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <PenLine className="w-4 h-4" />
                  立即签字
                </button>
              )}
            </div>
          )
        })}
      </div>

      {showCanvas && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">手写签字</h4>
            <p className="text-sm text-gray-500 mb-4">请在下方区域用鼠标或手指签字</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={clearCanvas}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                清除
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                确认签字
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
