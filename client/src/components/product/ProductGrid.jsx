import { motion } from 'framer-motion'
import EmptyState from '@/components/common/EmptyState'
import SkeletonCard from '@/components/common/SkeletonCard'
import ProductCard from './ProductCard'
import './ProductGrid.css'

const MotionItem = motion.div

export default function ProductGrid({ watches = [], loading = false, error = null }) {
  const safeWatches = Array.isArray(watches) ? watches : []
  const errorMessage = typeof error === 'string' ? error : error?.message

  if (errorMessage) {
    return <p className="product-grid__error">{errorMessage}</p>
  }

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
          <MotionItem
            key={watch._id ?? `${watch.name}-${index}`}
            className="product-grid__item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <ProductCard watch={watch} />
          </MotionItem>
        ))}
      </div>
    </div>
  )
}
