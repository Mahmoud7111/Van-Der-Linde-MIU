import { useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/common/Button'
import PageTransition from '@/components/common/PageTransition'
import ProductFilter from '@/components/product/ProductFilter'
import ProductGrid from '@/components/product/ProductGrid'
import useMediaQuery from '@/hooks/useMediaQuery'
import './ShopPage.css'

export default function ShopMenPage() {
  const data = useLoaderData()
  const [searchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 960px)')

  const watches = Array.isArray(data) ? data : []
  const search = (searchParams.get('search') || '').trim()
  const brand = searchParams.get('brand') || 'all'
  const gender = searchParams.get('gender') || 'men'
  const rating = searchParams.get('rating') || 'all'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const category = searchParams.get('category') || 'all'
  const genderLabel = gender === 'men' ? 'Men' : gender === 'women' ? 'Women' : null

  const activeFilters = [
    search ? `Search: "${search}"` : null,
    category !== 'all' ? category : null,
    brand !== 'all' ? brand : null,
    rating !== 'all' ? `${rating}+ stars` : null,
    minPrice || maxPrice ? `Price: ${minPrice || '0'} - ${maxPrice || 'Any'}` : null,
  ].filter(Boolean)

  if (activeFilters.length > 0 && genderLabel) {
    activeFilters.push(genderLabel)
  }

  const summaryText =
    activeFilters.length > 0
      ? `Filtered by ${activeFilters.join(' | ')}`
      : gender === 'women'
        ? "Showing women's watches"
        : "Showing men's watches"

  return (
    <PageTransition>
      <section className="shop-page">
        <div className="shop-page__inner">
          <header className="shop-page__header">
            <div className="shop-page__heading">
              <p className="shop-page__eyebrow">Men&apos;s Collection</p>
              <h1 className="shop-page__title">Shop Men&apos;s Watches</h1>
              <p className="shop-page__subtitle">
                Bold, engineered silhouettes crafted for modern precision.
              </p>
            </div>
            <div className="shop-page__meta">
              <div className="shop-page__actions">
                {isMobile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shop-page__filter-toggle"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <span className="shop-page__filter-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </span>
                    Filter By
                  </Button>
                )}
                <span className="shop-page__count">{watches.length} Watches</span>
              </div>
              <p className="shop-page__summary">{summaryText}</p>
            </div>
          </header>

          {!isMobile && (
            <div className="shop-page__filters">
              <ProductFilter defaultGender="men" />
            </div>
          )}

          <AnimatePresence>
            {isMobile && isFilterOpen && (
              <>
                <motion.div
                  className="shop-page__filter-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                />
                <motion.aside
                  className="shop-page__filter-drawer"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <div className="shop-page__drawer-header">
                    <h2 className="shop-page__drawer-title">Filters</h2>
                    <button
                      className="shop-page__drawer-close"
                      onClick={() => setIsFilterOpen(false)}
                      aria-label="Close filters"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="shop-page__drawer-content">
                    <ProductFilter defaultGender="men" />
                    <div className="shop-page__drawer-footer">
                      <Button
                        variant="home-action-solid"
                        className="shop-page__drawer-apply"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <div className="shop-page__results">
            <ProductGrid watches={watches} />
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
