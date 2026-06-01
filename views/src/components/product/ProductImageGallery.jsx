import { useState } from 'react'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { cn } from '@/utils/cn'
import './ProductImageGallery.css'

export default function ProductImageGallery({ images = [], name = '' }) {
  const safeImages = Array.isArray(images)
    ? images.filter((image) => typeof image === 'string' && image.trim())
    : []
  const [activeImage, setActiveImage] = useState('')
  const galleryImages = safeImages.length > 0 ? safeImages : ['']
  const isPlaceholder = safeImages.length === 0

  const labelName = name?.trim() || 'Watch'
  const selectedImage = galleryImages.includes(activeImage) ? activeImage : galleryImages[0]
  const mainImageUrl = resolveWatchProductImage(selectedImage)

  return (
    <div className="product-gallery" aria-label={`${labelName} gallery`}>
      <div className="product-gallery__preview">
        <img className="product-gallery__preview-image" src={mainImageUrl} alt={labelName} />
        {isPlaceholder && <span className="product-gallery__placeholder">Image unavailable</span>}
      </div>

      <div className="product-gallery__thumbs" role="list">
        {galleryImages.map((image, index) => {
          const thumbUrl = resolveWatchProductImage(image)
          const isActive = image === selectedImage

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn('product-gallery__thumb', isActive && 'product-gallery__thumb--active')}
              onClick={() => setActiveImage(image)}
              aria-pressed={isActive}
              aria-label={`${labelName} thumbnail ${index + 1}`}
              disabled={isPlaceholder}
            >
              <img className="product-gallery__thumb-image" src={thumbUrl} alt={`${labelName} thumbnail`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
