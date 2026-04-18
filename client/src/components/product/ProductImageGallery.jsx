import { useState } from 'react'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { cn } from '@/utils/cn'
import './ProductImageGallery.css'

export default function ProductImageGallery({ images = [], name = '' }) {
  const safeImages = Array.isArray(images)
    ? images.filter((image) => typeof image === 'string' && image.trim())
    : []
  const [activeIndex, setActiveIndex] = useState(0)
  const galleryImages = safeImages.length > 0 ? safeImages : ['']
  const isPlaceholder = safeImages.length === 0

  const labelName = name?.trim() || 'Watch'
  const activeImage = galleryImages[Math.min(activeIndex, galleryImages.length - 1)]
  const mainImageUrl = resolveWatchProductImage(activeImage)

  return (
    <div className="product-gallery" aria-label={`${labelName} gallery`}>
      <div className="product-gallery__preview">
        <img className="product-gallery__preview-image" src={mainImageUrl} alt={labelName} />
        {isPlaceholder && <span className="product-gallery__placeholder">Image unavailable</span>}
      </div>

      <div className="product-gallery__thumbs" role="list">
        {galleryImages.map((image, index) => {
          const thumbUrl = resolveWatchProductImage(image)
          const isActive = index === activeIndex

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn('product-gallery__thumb', isActive && 'product-gallery__thumb--active')}
              onClick={() => setActiveIndex(index)}
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
