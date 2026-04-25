import { useLoaderData } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import { useCurrency } from '@/context/CurrencyContext'
import { watchService } from '@/services/watchService'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { CATEGORIES } from '@/utils/constants'
import './ManageProducts.css'

const LOW_STOCK_THRESHOLD = 5
const FORM_DEFAULTS = {
  name: '',
  brand: 'Van Der Linde',
  category: 'luxury',
  gender: 'men',
  price: '',
  stock: '',
  image: '',
  description: '',
}
const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
]

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
  const watches = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const [catalog, setCatalog] = useState(watches)
  const [formValues, setFormValues] = useState(FORM_DEFAULTS)
  const [formMode, setFormMode] = useState('create')
  const [editingId, setEditingId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formStatus, setFormStatus] = useState(null)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    setCatalog(watches)
  }, [watches])

  const summary = useMemo(() => {
    let inStockCount = 0
    let lowStockCount = 0

    catalog.forEach((watch) => {
      const stockValue = getStockValue(watch)
      const isAvailable = stockValue === null || stockValue > 0
      const isLowStock = stockValue !== null && stockValue > 0 && stockValue <= LOW_STOCK_THRESHOLD

      if (isAvailable) inStockCount += 1
      if (isLowStock) lowStockCount += 1
    })

    return {
      total: catalog.length,
      inStock: inStockCount,
      lowStock: lowStockCount,
    }
  }, [catalog])

  const filteredWatches = useMemo(() => {
    const query = search.trim().toLowerCase()

    return catalog.filter((watch) => {
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
  }, [catalog, search, categoryFilter, stockFilter])

  const openCreateForm = () => {
    setFormMode('create')
    setEditingId(null)
    setFormValues(FORM_DEFAULTS)
    setIsFormOpen(true)
    setFormStatus(null)
  }

  const openEditForm = (watch) => {
    setFormMode('edit')
    setEditingId(watch?._id ?? null)
    setFormValues({
      name: watch?.name ?? '',
      brand: watch?.brand ?? 'Van Der Linde',
      category: watch?.category ?? 'luxury',
      gender: watch?.gender ?? 'men',
      price: watch?.price ?? '',
      stock: watch?.stock ?? '',
      image: watch?.images?.[0] ?? watch?.image ?? '',
      description: watch?.description ?? '',
    })
    setIsFormOpen(true)
    setFormStatus(null)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setFormMode('create')
    setFormStatus(null)
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    if (isSaving) return

    const name = formValues.name.trim()
    const priceValue = Number(formValues.price)
    const stockValue =
      formValues.stock === '' || formValues.stock === null ? null : Number(formValues.stock)

    if (!name) {
      setFormStatus({ type: 'error', message: 'Watch name is required.' })
      return
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setFormStatus({ type: 'error', message: 'Enter a valid price to continue.' })
      return
    }

    setIsSaving(true)
    setFormStatus(null)

    const baseWatch = editingId ? catalog.find((item) => item._id === editingId) : null
    const imageValue = formValues.image.trim()

    const payload = {
      name,
      brand: formValues.brand.trim() || 'Van Der Linde',
      category: formValues.category,
      gender: formValues.gender,
      price: priceValue,
      stock: Number.isFinite(stockValue) ? stockValue : null,
      images: imageValue ? [imageValue] : baseWatch?.images ?? [],
      description: formValues.description.trim(),
      rating: baseWatch?.rating ?? 0,
      numReviews: baseWatch?.numReviews ?? 0,
    }

    try {
      if (formMode === 'edit' && editingId) {
        const updated = await watchService.update(editingId, payload)
        setCatalog((prev) =>
          prev.map((item) =>
            item._id === editingId ? { ...item, ...payload, ...updated, _id: editingId } : item
          )
        )
        setFormStatus({ type: 'success', message: 'Watch updated successfully.' })
      } else {
        const created = await watchService.create(payload)
        const newWatch = { ...payload, ...created }
        setCatalog((prev) => [newWatch, ...prev])
        setFormStatus({ type: 'success', message: 'New watch added to the catalog.' })
        setFormValues(FORM_DEFAULTS)
      }
      setIsFormOpen(false)
      setEditingId(null)
      setFormMode('create')
    } catch {
      setFormStatus({ type: 'error', message: 'Unable to save this watch right now.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (watch) => {
    if (!watch?._id || deletingId) return
    const confirmDelete = window.confirm('Remove this watch from the catalog?')
    if (!confirmDelete) return

    setDeletingId(watch._id)
    setFormStatus(null)

    try {
      await watchService.remove(watch._id)
      setCatalog((prev) => prev.filter((item) => item._id !== watch._id))
      setFormStatus({ type: 'success', message: 'Watch removed from the catalog.' })
    } catch {
      setFormStatus({ type: 'error', message: 'Unable to remove that watch right now.' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = () => {
    const payload = JSON.stringify(catalog, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'van-der-linde-catalog.json'
    link.click()
    URL.revokeObjectURL(url)
    setFormStatus({ type: 'success', message: 'Catalog export ready.' })
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
              <Button variant="primary" onClick={openCreateForm}>
                Add new watch
              </Button>
              <Button variant="secondary" onClick={handleExport}>
                Export catalog
              </Button>
            </div>
            {formStatus && (
              <p className={`admin-products__status-message admin-products__status-message--${formStatus.type}`}>
                {formStatus.message}
              </p>
            )}
          </header>

          {isFormOpen && (
            <section className="admin-products__section" aria-labelledby="admin-products-editor">
              <div className="admin-products__section-header">
                <div>
                  <p className="admin-products__section-eyebrow">Catalog editor</p>
                  <h2 id="admin-products-editor" className="admin-products__section-title">
                    {formMode === 'edit' ? 'Edit watch' : 'Add new watch'}
                  </h2>
                </div>
                <p className="admin-products__section-subtitle">
                  Update the essential fields to keep the catalog precise and consistent.
                </p>
              </div>

              <form className="admin-products__form" onSubmit={handleFormSubmit}>
                <div className="admin-products__form-grid">
                  <div className="admin-products__field">
                    <label className="admin-products__label" htmlFor="watch-name">
                      Watch name
                    </label>
                    <input
                      id="watch-name"
                      name="name"
                      className="admin-products__input"
                      value={formValues.name}
                      onChange={handleFormChange}
                      placeholder="Van Der Linde Signature"
                    />
                  </div>

                  <div className="admin-products__field">
                    <label className="admin-products__label" htmlFor="watch-brand">
                      Brand
                    </label>
                    <input
                      id="watch-brand"
                      name="brand"
                      className="admin-products__input"
                      value={formValues.brand}
                      onChange={handleFormChange}
                      placeholder="Van Der Linde"
                    />
                  </div>

                  <div className="admin-products__field">
                    <label className="admin-products__label" htmlFor="watch-category">
                      Category
                    </label>
                    <select
                      id="watch-category"
                      name="category"
                      className="admin-products__select"
                      value={formValues.category}
                      onChange={handleFormChange}
                    >
                      {CATEGORIES.filter((option) => option.value !== 'all').map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-products__field">
                    <label className="admin-products__label" htmlFor="watch-gender">
                      Gender
                    </label>
                    <select
                      id="watch-gender"
                      name="gender"
                      className="admin-products__select"
                      value={formValues.gender}
                      onChange={handleFormChange}
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-products__field">
                    <label className="admin-products__label" htmlFor="watch-price">
                      Price
                    </label>
                    <input
                      id="watch-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="admin-products__input"
                      value={formValues.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="admin-products__field">
                    <label className="admin-products__label" htmlFor="watch-stock">
                      Stock
                    </label>
                    <input
                      id="watch-stock"
                      name="stock"
                      type="number"
                      min="0"
                      className="admin-products__input"
                      value={formValues.stock}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="admin-products__field admin-products__field--full">
                    <label className="admin-products__label" htmlFor="watch-image">
                      Image URL
                    </label>
                    <input
                      id="watch-image"
                      name="image"
                      className="admin-products__input"
                      value={formValues.image}
                      onChange={handleFormChange}
                      placeholder="@/assets/images/Watches/..."
                    />
                  </div>

                  <div className="admin-products__field admin-products__field--full">
                    <label className="admin-products__label" htmlFor="watch-description">
                      Description
                    </label>
                    <textarea
                      id="watch-description"
                      name="description"
                      rows="3"
                      className="admin-products__input admin-products__input--area"
                      value={formValues.description}
                      onChange={handleFormChange}
                      placeholder="Highlight the defining traits of this reference."
                    />
                  </div>
                </div>

                <div className="admin-products__form-actions">
                  <Button variant="primary" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : formMode === 'edit' ? 'Save changes' : 'Add watch'}
                  </Button>
                  <Button variant="ghost" type="button" onClick={handleFormCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </section>
          )}

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
                  {filteredWatches.length === 0 && (
                    <tr>
                      <td className="admin-products__empty" colSpan={5}>
                        No watches match the current filters.
                      </td>
                    </tr>
                  )}
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
                            <Button variant="secondary" size="sm" onClick={() => openEditForm(watch)}>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(watch)}
                              disabled={deletingId === watch._id}
                            >
                              {deletingId === watch._id ? 'Removing...' : 'Remove'}
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
