import { useState } from 'react'
import { X, ZoomIn, Upload } from 'lucide-react'
import type { Photo } from '../types'
import { cn } from '../lib/utils'

interface PhotoGalleryProps {
  photos: Photo[]
  canUpload?: boolean
  onUpload?: (file: File) => void
  className?: string
}

export function PhotoGallery({ photos, canUpload = false, onUpload, className }: PhotoGalleryProps) {
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && onUpload) {
      Array.from(files).forEach((file) => onUpload(file))
    }
    e.target.value = ''
  }

  return (
    <>
      <div className={cn('grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5', className)}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setPreviewPhoto(photo)}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
          >
            <img
              src={photo.url}
              alt={photo.caption || '验收照片'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs text-white truncate">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}

        {canUpload && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs text-gray-500 mt-2 group-hover:text-blue-500">上传照片</span>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewPhoto.url}
              alt={previewPhoto.caption || '验收照片'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {previewPhoto.caption && (
              <p className="text-white text-center mt-4 text-lg">{previewPhoto.caption}</p>
            )}
            <p className="text-gray-400 text-center mt-2 text-sm">
              上传时间：{previewPhoto.uploadAt}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
