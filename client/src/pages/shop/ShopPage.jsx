import { useEffect, useMemo, useRef } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import PageTransition from '@/components/common/PageTransition'
import ProductFilter from '@/components/product/ProductFilter'
import ProductGrid from '@/components/product/ProductGrid'
import { CATEGORIES } from '@/utils/constants'
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
          <header className="shop-page__header">
            <div className="shop-page__heading">
              <p className="shop-page__eyebrow">The Collection</p>
              <h1 className="shop-page__title">Shop Van Der Linde Watches</h1>
              <p className="shop-page__subtitle">
                Precision engineering, refined silhouettes, and modern heritage.
              </p>
            </div>
            <div className="shop-page__meta">
              <span className="shop-page__count">{watches.length} Watches</span>
              <p className="shop-page__summary">{summaryText}</p>
            </div>
          </header>

          <div className="shop-page__content">
            <aside className="shop-page__sidebar">
              <ProductFilter />
            </aside>

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
