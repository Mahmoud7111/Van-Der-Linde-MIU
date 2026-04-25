import { useLoaderData, useSearchParams } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'
import ProductFilter from '@/components/product/ProductFilter'
import ProductGrid from '@/components/product/ProductGrid'
import { CATEGORIES } from '@/utils/constants'
import './ShopPage.css'

const getCategoryLabel = (value) => {
  if (!value || value === 'all') {
    return null
  }

  return CATEGORIES.find((option) => option.value === value)?.label ?? value
}

export default function ShopPage() {
  const data = useLoaderData()
  const [searchParams] = useSearchParams()

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
              <ProductGrid watches={watches} />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
