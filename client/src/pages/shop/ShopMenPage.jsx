import { useLoaderData, useSearchParams } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'
import ProductFilter from '@/components/product/ProductFilter'
import ProductGrid from '@/components/product/ProductGrid'
import './ShopPage.css'

export default function ShopMenPage() {
  const data = useLoaderData()
  const [searchParams] = useSearchParams()

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
              <span className="shop-page__count">{watches.length} Watches</span>
              <p className="shop-page__summary">{summaryText}</p>
            </div>
          </header>

          <div className="shop-page__filters">
            <ProductFilter defaultGender="men" />
          </div>

          <div className="shop-page__results">
            <ProductGrid watches={watches} />
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
