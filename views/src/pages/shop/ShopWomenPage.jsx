import { useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/common/Button'
import PageTransition from '@/components/common/PageTransition'
import ProductFilter from '@/components/product/ProductFilter'
import ProductGrid from '@/components/product/ProductGrid'
import useMediaQuery from '@/hooks/useMediaQuery'
import { useLanguage } from '@/context/LanguageContext'
import './ShopPage.css'

export default function ShopWomenPage() {
  const data = useLoaderData()
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 960px)')

  const watches = Array.isArray(data) ? data : []
  const search = (searchParams.get('search') || '').trim()
  const brand = searchParams.get('brand') || 'all'
  const gender = searchParams.get('gender') || 'women'
  const rating = searchParams.get('rating') || 'all'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const category = searchParams.get('category') || 'all'
  const genderLabel = gender === 'men' ? t('filter.men') : gender === 'women' ? t('filter.women') : null

  const activeFilters = [
    search ? t('shop.searchFilter', { query: search }) : null,
    category !== 'all' ? category : null,
    brand !== 'all' ? brand : null,
    rating !== 'all' ? t('shop.ratingFilter', { rating }) : null,
    minPrice || maxPrice ? t('shop.priceFilter', { min: minPrice || '0', max: maxPrice || t('shop.any') }) : null,
  ].filter(Boolean)

  if (activeFilters.length > 0 && genderLabel) {
    activeFilters.push(genderLabel)
  }

  const summaryText =
    activeFilters.length > 0
      ? t('shop.filteredBy', { filters: activeFilters.join(' | ') })
      : gender === 'men'
        ? t('shop.showingMens')
        : t('shop.showingWomens')

  return (
    <PageTransition>
      <section className="shop-page">
        <div className="shop-page__inner">
          <header className="shop-page__header">
            <div className="shop-page__heading">
              <p className="shop-page__eyebrow">{t('shop.womensCollection')}</p>
              <h1 className="shop-page__title">{t('shop.womensTitle')}</h1>
              <p className="shop-page__subtitle">
                {t('shop.womensSubtitle')}
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
                    {t('shop.filterBy')}
                  </Button>
                )}
                <span className="shop-page__count">{t('shop.watchCount', { count: watches.length })}</span>
              </div>
              <p className="shop-page__summary">{summaryText}</p>
            </div>
          </header>

          {!isMobile && (
            <div className="shop-page__filters">
              <ProductFilter defaultGender="women" />
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
                    <h2 className="shop-page__drawer-title">{t('shop.filters')}</h2>
                    <button
                      className="shop-page__drawer-close"
                      onClick={() => setIsFilterOpen(false)}
                      aria-label={t('shop.closeFilters')}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="shop-page__drawer-content">
                    <ProductFilter defaultGender="women" />
                    <div className="shop-page__drawer-footer">
                      <Button
                        variant="home-action-solid"
                        className="shop-page__drawer-apply"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        {t('shop.applyFilters')}
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
