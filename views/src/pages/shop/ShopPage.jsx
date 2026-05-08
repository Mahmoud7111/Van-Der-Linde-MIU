import { useEffect, useMemo, useRef, useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/common/Button'
import PageTransition from '@/components/common/PageTransition'
import ProductFilter from '@/components/product/ProductFilter'
import ProductGrid from '@/components/product/ProductGrid'
import useMediaQuery from '@/hooks/useMediaQuery'
import { CATEGORIES } from '@/utils/constants'
import longinesHeader from '@/assets/Models/longines-header.avif'
import './ShopPage.css'

const ITEMS_PER_PAGE = 6

const getCategoryLabel = (value) => {
  if (!value || value === 'all') {
    return null
  }

  return CATEGORIES.find((option) => option.value === value)?.label ?? value
}

export default function ShopPage() {
  const data = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()
  const previousFilterSignature = useRef('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 960px)')

  const watches = Array.isArray(data) ? data : []
  const category = searchParams.get('category') || 'all'
  const brand = searchParams.get('brand') || 'all'
  const gender = searchParams.get('gender') || 'all'
  const rating = searchParams.get('rating') || 'all'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const search = (searchParams.get('search') || '').trim()

  const activeFilters = [
    search ? `Search: "${search}"` : null,
    getCategoryLabel(category),
    brand !== 'all' ? brand : null,
    gender !== 'all' ? gender : null,
    rating !== 'all' ? `${rating}+ stars` : null,
    minPrice || maxPrice ? `Price: ${minPrice || '0'} - ${maxPrice || 'Any'}` : null,
  ].filter(Boolean)

  const summaryText =
    activeFilters.length > 0 ? `Filtered by ${activeFilters.join(' | ')}` : 'Showing all watches'
  const currentPageParam = Number.parseInt(searchParams.get('page') || '1', 10)
  const currentPage = Number.isFinite(currentPageParam) && currentPageParam > 0 ? currentPageParam : 1
  const totalPages = Math.max(1, Math.ceil(watches.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedWatches = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return watches.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [safeCurrentPage, watches])
  const filterSignature = [category, brand, gender, rating, minPrice, maxPrice, search].join('|')

  useEffect(() => {
    if (previousFilterSignature.current === '') {
      previousFilterSignature.current = filterSignature
      return
    }

    if (previousFilterSignature.current !== filterSignature) {
      previousFilterSignature.current = filterSignature

      if (currentPage !== 1) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.set('page', '1')
          return next
        })
      }
    }
  }, [category, brand, gender, rating, minPrice, maxPrice, search, currentPage, filterSignature, setSearchParams])

  const goToPage = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
  }

  const goToPreviousPage = () => {
    if (safeCurrentPage > 1) {
      goToPage(safeCurrentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (safeCurrentPage < totalPages) {
      goToPage(safeCurrentPage + 1)
    }
  }

  return (
    <PageTransition>
      <section className="shop-page">
        <div className="shop-page__inner">
          <div className="shop-page__hero">
            <img
              className="shop-page__hero-image"
              src={longinesHeader}
              alt="Longines watch"
              loading="eager"
            />
            <div className="shop-page__hero-overlay" aria-hidden="true" />
            <div className="shop-page__hero-content">
              <header className="shop-page__header">
                <div className="shop-page__heading">
                  <p className="shop-page__eyebrow">The Collection</p>
                  <h1 className="shop-page__title">Shop Van Der Linde Watches</h1>
                  <p className="shop-page__subtitle">
                    Precision engineering, refined silhouettes, and modern heritage.
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
            </div>
          </div>

          <div className="shop-page__content">
            {!isMobile && (
              <aside className="shop-page__sidebar">
                <ProductFilter />
              </aside>
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
                      <ProductFilter />
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
              <ProductGrid watches={paginatedWatches} />

              {totalPages > 1 && (
                <nav className="shop-page__pagination" aria-label="Shop pagination">
                  <div className="shop-page__pagination-status">
                    Page {safeCurrentPage} of {totalPages}
                  </div>
                  <div className="shop-page__pagination-controls">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shop-page__pagination-button"
                      onClick={goToPreviousPage}
                      disabled={safeCurrentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="shop-page__pagination-pages" aria-label="Page numbers">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        const isActive = pageNumber === safeCurrentPage

                        return (
                          <Button
                            key={pageNumber}
                            variant={isActive ? 'primary' : 'secondary'}
                            size="sm"
                            className="shop-page__pagination-button"
                            onClick={() => goToPage(pageNumber)}
                            active={isActive}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            {pageNumber}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="shop-page__pagination-button"
                      onClick={goToNextPage}
                      disabled={safeCurrentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
