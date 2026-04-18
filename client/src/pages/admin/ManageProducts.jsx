import { useLoaderData } from 'react-router-dom'
import { useMemo, useState } from 'react'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import { useCurrency } from '@/context/CurrencyContext'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { CATEGORIES } from '@/utils/constants'
import './ManageProducts.css'

const LOW_STOCK_THRESHOLD = 5

const getCategoryLabel = (value) => {
  if (!value) return 'Uncategorized'
  return CATEGORIES.find((option) => option.value === value)?.label ?? value
}

const getStockValue = (watch) => {
  const rawStock = Number(watch?.stock)
  return Number.isFinite(rawStock) ? rawStock : null
}

export default function ManageProducts() {
  const data = useLoaderData()
  const { formatPrice } = useCurrency()
  const watches = Array.isArray(data) ? data : []

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  const summary = useMemo(() => {
    let inStockCount = 0
    let lowStockCount = 0

    watches.forEach((watch) => {
      const stockValue = getStockValue(watch)
      const isAvailable = stockValue === null || stockValue > 0
      const isLowStock = stockValue !== null && stockValue > 0 && stockValue <= LOW_STOCK_THRESHOLD

      if (isAvailable) inStockCount += 1
      if (isLowStock) lowStockCount += 1
    })

    return {
      total: watches.length,
      inStock: inStockCount,
      lowStock: lowStockCount,
    }
  }, [watches])

  const filteredWatches = useMemo(() => {
    const query = search.trim().toLowerCase()

    return watches.filter((watch) => {
      const name = watch?.name?.toLowerCase() ?? ''
      const brand = watch?.brand?.toLowerCase() ?? ''
      const category = watch?.category ?? ''
      const matchQuery =
        !query || name.includes(query) || brand.includes(query) || category.toLowerCase().includes(query)

      const matchCategory = categoryFilter === 'all' || category === categoryFilter

      const stockValue = getStockValue(watch)
      const isOutOfStock = stockValue !== null && stockValue <= 0
      const isLowStock = stockValue !== null && stockValue > 0 && stockValue <= LOW_STOCK_THRESHOLD
      const isInStock = stockValue === null || stockValue > LOW_STOCK_THRESHOLD

      const matchStock =
        stockFilter === 'all' ||
        (stockFilter === 'in-stock' && isInStock) ||
        (stockFilter === 'low-stock' && isLowStock) ||
        (stockFilter === 'out-of-stock' && isOutOfStock)

      return matchQuery && matchCategory && matchStock
    })
  }, [watches, search, categoryFilter, stockFilter])

  const handleNoop = (event) => {
    event.preventDefault()
  }

  return (
    <PageTransition>
      <section className="admin-products">
        <div className="admin-products__inner">
          <header className="admin-products__header">
            <p className="admin-products__eyebrow">Admin Console</p>
            <div className="admin-products__heading">
              <h1 className="admin-products__title">Manage Watch Catalog</h1>
              <p className="admin-products__subtitle">
                Oversee inventory, pricing, and presentation for every Van Der Linde timepiece.
              </p>
            </div>
            <div className="admin-products__header-actions">
              <Button variant="primary" onClick={handleNoop}>
                Add new watch
              </Button>
              <Button variant="secondary" onClick={handleNoop}>
                Export catalog
              </Button>
            </div>
          </header>

          <section className="admin-products__section" aria-labelledby="admin-products-summary">
            <div className="admin-products__section-header">
              <div>
                <p className="admin-products__section-eyebrow">Summary</p>
                <h2 id="admin-products-summary" className="admin-products__section-title">
                  Inventory overview
                </h2>
              </div>
              <p className="admin-products__section-subtitle">
                Snapshot of catalog readiness and stock levels.
              </p>
            </div>
            <div className="admin-products__summary">
              <article className="admin-products__summary-card">
                <p className="admin-products__summary-label">Total watches</p>
                <p className="admin-products__summary-value">{summary.total}</p>
                <p className="admin-products__summary-meta">Active references</p>
              </article>
              <article className="admin-products__summary-card">
                <p className="admin-products__summary-label">In stock</p>
                <p className="admin-products__summary-value">{summary.inStock}</p>
                <p className="admin-products__summary-meta">Ready to ship</p>
              </article>
              <article className="admin-products__summary-card">
                <p className="admin-products__summary-label">Low stock</p>
                <p className="admin-products__summary-value">{summary.lowStock}</p>
                <p className="admin-products__summary-meta">Below {LOW_STOCK_THRESHOLD} units</p>
              </article>
            </div>
          </section>

          <section className="admin-products__section" aria-labelledby="admin-products-table">
            <div className="admin-products__section-header">
              <div>
                <p className="admin-products__section-eyebrow">Catalog</p>
                <h2 id="admin-products-table" className="admin-products__section-title">
                  Watch listings
                </h2>
              </div>
              <p className="admin-products__section-subtitle">
                {filteredWatches.length} of {summary.total} watches match your filters.
              </p>
            </div>

            <div className="admin-products__filters" role="search">
              <div className="admin-products__field admin-products__field--search">
                <label className="admin-products__label" htmlFor="watch-search">
                  Search
                </label>
                <input
                  id="watch-search"
                  type="search"
                  className="admin-products__input"
                  placeholder="Search by name, brand, or category"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="admin-products__field">
                <label className="admin-products__label" htmlFor="watch-category">
                  Category
                </label>
                <select
                  id="watch-category"
                  className="admin-products__select"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  {CATEGORIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-products__field">
                <label className="admin-products__label" htmlFor="watch-stock">
                  Stock status
                </label>
                <select
                  id="watch-stock"
                  className="admin-products__select"
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value)}
                >
                  <option value="all">All stock levels</option>
                  <option value="in-stock">In stock</option>
                  <option value="low-stock">Low stock</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>
              </div>
            </div>

            <div className="admin-products__table-wrapper">
              <table className="admin-products__table">
                <thead>
                  <tr>
                    <th scope="col">Watch</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWatches.map((watch) => {
                    const stockValue = getStockValue(watch)
                    const isOutOfStock = stockValue !== null && stockValue <= 0
                    const isLowStock = stockValue !== null && stockValue > 0 && stockValue <= LOW_STOCK_THRESHOLD
                    const statusLabel = isOutOfStock
                      ? 'Out of stock'
                      : isLowStock
                        ? `Low stock (${stockValue})`
                        : stockValue === null
                          ? 'Available'
                          : `${stockValue} available`
                    const statusTone = isOutOfStock ? 'warning' : isLowStock ? 'warning' : 'success'
                    const ratingValue = Number(watch?.rating)
                    const hasRating = Number.isFinite(ratingValue) && ratingValue > 0
                    const imageUrl = resolveWatchProductImage(watch?.images?.[0] ?? watch?.image ?? '')

                    return (
                      <tr key={watch._id ?? watch.name}>
                        <th scope="row">
                          <div className="admin-products__product">
                            <img
                              className="admin-products__product-image"
                              src={imageUrl}
                              alt={watch?.name ?? 'Watch'}
                            />
                            <div className="admin-products__product-info">
                              <p className="admin-products__product-name">{watch?.name ?? 'Untitled watch'}</p>
                              <p className="admin-products__product-brand">{watch?.brand ?? 'Van Der Linde'}</p>
                              {hasRating && (
                                <div className="admin-products__product-rating">
                                  <StarRating rating={ratingValue} className="admin-products__product-stars" />
                                  <span className="admin-products__product-rating-text">
                                    {ratingValue.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </th>
                        <td className="admin-products__cell">{getCategoryLabel(watch?.category)}</td>
                        <td className="admin-products__cell">{formatPrice(watch?.price)}</td>
                        <td className="admin-products__cell">
                          <span className={`admin-products__status admin-products__status--${statusTone}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="admin-products__cell">
                          <div className="admin-products__actions">
                            <Button variant="secondary" size="sm" onClick={handleNoop}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleNoop}>
                              Archive
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </PageTransition>
  )
}
