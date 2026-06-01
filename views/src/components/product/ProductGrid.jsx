import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import EmptyState from '@/components/common/EmptyState'
import SkeletonCard from '@/components/common/SkeletonCard'
import ProductCard from './ProductCard'
import './ProductGrid.css'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MotionItem = motion.div
const MotionStage = motion.div

export default function ProductGrid({ watches = [], loading = false, error = null }) {
  const [viewMode, setViewMode] = useState('grid') // 'grid' (2 columns) or 'feed' (1 column)
  const safeWatches = Array.isArray(watches) ? watches : []
  const errorMessage = typeof error === 'string' ? error : error?.message
  const gridKey = safeWatches.map((watch, index) => watch?._id ?? watch?.slug ?? `${watch?.name ?? 'watch'}-${index}`).join('|')

  const toggleView = (mode) => {
    setViewMode(mode)
  }

  if (errorMessage) {
    return <p className="product-grid__error">{errorMessage}</p>
  }

  const renderToggle = () => (
    <div className="product-grid__view-toggle">
      <button
        className={cn('view-toggle__btn', viewMode === 'grid' && 'view-toggle__btn--active')}
        onClick={() => toggleView('grid')}
      >
        <span>GRID</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
      <button
        className={cn('view-toggle__btn', viewMode === 'feed' && 'view-toggle__btn--active')}
        onClick={() => toggleView('feed')}
      >
        <span>FEED</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" />
        </svg>
      </button>
    </div>
  )

  if (prefersReducedMotion) {
    if (loading) {
      return (
        <div className="product-grid">
          <div className="product-grid__items">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={`skeleton-${index}`} className="product-grid__item">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (safeWatches.length === 0) {
      return (
        <div className="product-grid product-grid--empty">
          <EmptyState title="No watches found" message="Try adjusting your filters." />
        </div>
      )
    }

    return (
      <div className="product-grid">
        {renderToggle()}
        <div className={cn('product-grid__items', `product-grid__items--${viewMode}`)}>
          {safeWatches.map((watch, index) => (
            <div key={watch._id ?? `${watch.name}-${index}`} className="product-grid__item">
              <ProductCard watch={watch} viewMode={viewMode} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {renderToggle()}
      <AnimatePresence mode="wait">
        {loading ? (
          <MotionStage
            key="product-grid-loading"
            className="product-grid__items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4 }}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                className="product-grid__item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}
          </MotionStage>
        ) : safeWatches.length === 0 ? (
          <MotionStage
            key={`product-grid-empty-${gridKey || 'none'}`}
            className="product-grid product-grid--empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <EmptyState title="No watches found" message="Try adjusting your filters." />
          </MotionStage>
        ) : (
          <MotionStage
            key={`product-grid-loaded-${gridKey || 'none'}`}
            className={cn('product-grid__items', `product-grid__items--${viewMode}`)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4 }}
          >
            {safeWatches.map((watch, index) => (
              <MotionItem
                key={watch._id ?? `${watch.name}-${index}`}
                className="product-grid__item"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16, transition: { duration: 0.25 } }}
                transition={{
                  delay: index * 0.08,
                  type: 'spring',
                  damping: 20,
                  stiffness: 260,
                }}
              >
                <ProductCard watch={watch} viewMode={viewMode} />
              </MotionItem>
            ))}
          </MotionStage>
        )}
      </AnimatePresence>
    </div>
  )
}
