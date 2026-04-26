import { AnimatePresence, motion } from 'framer-motion'
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
  const safeWatches = Array.isArray(watches) ? watches : []
  const errorMessage = typeof error === 'string' ? error : error?.message
  const gridKey = safeWatches.map((watch, index) => watch?._id ?? watch?.slug ?? `${watch?.name ?? 'watch'}-${index}`).join('|')

  if (errorMessage) {
    return <p className="product-grid__error">{errorMessage}</p>
  }

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
        <div className="product-grid__items">
          {safeWatches.map((watch, index) => (
            <div key={watch._id ?? `${watch.name}-${index}`} className="product-grid__item">
              <ProductCard watch={watch} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="product-grid">
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
            className="product-grid__items"
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
                <ProductCard watch={watch} />
              </MotionItem>
            ))}
          </MotionStage>
        )}
      </AnimatePresence>
    </div>
  )
}
