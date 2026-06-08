import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { CURRENCIES, SORT_OPTIONS } from '@/utils/constants'
import { brandService } from '@/services/brandService'
import { collectionService } from '@/services/collectionService'
import './ProductFilter.css'

const GENDER_OPTIONS = [
  { value: 'all', labelKey: 'filter.all' },
  { value: 'men', labelKey: 'filter.men' },
  { value: 'women', labelKey: 'filter.women' },
]

const RATING_OPTIONS = [
  { value: 'all', labelKey: 'filter.allRatings' },
  { value: '4.5', labelKey: 'filter.starsAndUp', rating: '4.5' },
  { value: '4', labelKey: 'filter.starsAndUp', rating: '4.0' },
  { value: '3.5', labelKey: 'filter.starsAndUp', rating: '3.5' },
]

const SORT_LABEL_KEYS = {
  default: 'sort.default',
  'price-asc': 'sort.priceAsc',
  'price-desc': 'sort.priceDesc',
  rating: 'sort.rating',
  newest: 'sort.newest',
}

export default function ProductFilter({ defaultGender }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { currency } = useCurrency()
  const { t } = useLanguage()
  const collection = searchParams.get('collection') || 'all'
  const brand = searchParams.get('brand') || 'all'
  const genderParam = searchParams.get('gender')
  const gender = genderParam || defaultGender || 'all'
  const rating = searchParams.get('rating') || 'all'
  const sort = searchParams.get('sort') || 'default'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const searchValue = (searchParams.get('search') || '').trim()

  const [searchInput, setSearchInput] = useState(searchValue)
  const currencySymbol = CURRENCIES.find((item) => item.code === currency)?.symbol ?? '$'
  const [brandsList, setBrandsList] = useState([])
  const [collectionsList, setCollectionsList] = useState([])

  useEffect(() => {
    setSearchInput(searchValue)
  }, [searchValue])

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [brandsData, collectionsData] = await Promise.all([
          brandService.getAll(),
          collectionService.getAll(),
        ])
        setBrandsList([{ value: 'all', labelKey: 'filter.allBrands' }].concat(
          brandsData.map((b) => ({ value: b.name, label: b.name }))
        ))
        setCollectionsList([{ value: 'all', labelKey: 'filter.allCollections' }].concat(
          collectionsData.map((c) => ({ value: c.name, label: c.name }))
        ))
      } catch (err) {
        console.error('Failed to load filter options:', err)
      }
    }
    fetchFiltersData()
  }, [])

  const updateParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        const normalized = value === undefined || value === null ? '' : String(value).trim()

        if (normalized === '' || normalized === 'all' || normalized === 'default') {
          next.delete(key)
        } else {
          next.set(key, normalized)
        }

        return next
      })
    },
    [setSearchParams],
  )

  useEffect(() => {
    if (!defaultGender) {
      return
    }

    if (genderParam && genderParam !== 'all') {
      return
    }

    updateParam('gender', defaultGender)
  }, [defaultGender, genderParam, updateParam])

  useEffect(() => {
    const normalizedSearch = searchInput.trim()

    if (normalizedSearch === searchValue) {
      return undefined
    }

    const timeout = setTimeout(() => {
      updateParam('search', normalizedSearch)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput, searchValue, updateParam])

  return (
    <section className="product-filter" aria-label={t('filter.aria')}>
      <div className="product-filter__surface">
        <div className="product-filter__header">
          <div>
            <p className="product-filter__eyebrow">{t('filter.refine')}</p>
            <h2 className="product-filter__title">{t('filter.title')}</h2>
          </div>
          <div className="product-filter__field product-filter__field--sort">
            <label className="product-filter__label" htmlFor="sort">
              {t('filter.sort')}
            </label>
            <select
              id="sort"
              className="product-filter__select"
              value={sort}
              onChange={(event) => updateParam('sort', event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(SORT_LABEL_KEYS[option.value] || option.label)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-filter__grid">
          <div className="product-filter__field product-filter__field--search">
            <label className="product-filter__label" htmlFor="search">
              {t('filter.search')}
            </label>
            <input
              id="search"
              type="search"
              placeholder={t('filter.searchPlaceholder')}
              className="product-filter__input"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>

          <div className="product-filter__field">
            <label className="product-filter__label" htmlFor="category">
              {t('filter.collection')}
            </label>
            <select
              id="category"
              className="product-filter__select"
              value={collection}
              onChange={(event) => updateParam('collection', event.target.value)}
            >
              {collectionsList.length > 0 ? (
                collectionsList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.labelKey ? t(option.labelKey) : option.label}
                  </option>
                ))
              ) : (
                <option value="all">{t('filter.allCollections')}</option>
              )}
            </select>
          </div>

          <div className="product-filter__field">
            <label className="product-filter__label" htmlFor="brand">
              {t('filter.brand')}
            </label>
            <select
              id="brand"
              className="product-filter__select"
              value={brand}
              onChange={(event) => updateParam('brand', event.target.value)}
            >
              {brandsList.length > 0 ? (
                brandsList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.labelKey ? t(option.labelKey) : option.label}
                  </option>
                ))
              ) : (
                <option value="all">{t('filter.allBrands')}</option>
              )}
            </select>
          </div>

          <fieldset className="product-filter__fieldset">
            <legend className="product-filter__legend">{t('filter.gender')}</legend>
            <div className="product-filter__options" role="radiogroup" aria-label={t('filter.gender')}>
              {GENDER_OPTIONS.map((option) => (
                <label key={option.value} className="product-filter__option">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={gender === option.value}
                    onChange={(event) => updateParam('gender', event.target.value)}
                  />
                  <span>{t(option.labelKey)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="product-filter__field">
            <label className="product-filter__label" htmlFor="rating">
              {t('filter.rating')}
            </label>
            <select
              id="rating"
              className="product-filter__select"
              value={rating}
              onChange={(event) => updateParam('rating', event.target.value)}
            >
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey, { rating: option.rating })}
                </option>
              ))}
            </select>
          </div>

          <div className="product-filter__field product-filter__field--price">
            <span className="product-filter__label">{t('filter.priceRange')}</span>
            <div className="product-filter__range">
              <label className="product-filter__range-field" htmlFor="price-min">
                <span className="product-filter__prefix">{currencySymbol}</span>
                <input
                  id="price-min"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder={t('filter.min')}
                  className="product-filter__input product-filter__input--price"
                  value={minPrice}
                  onChange={(event) => updateParam('minPrice', event.target.value)}
                />
              </label>
              <span className="product-filter__range-divider">-</span>
              <label className="product-filter__range-field" htmlFor="price-max">
                <span className="product-filter__prefix">{currencySymbol}</span>
                <input
                  id="price-max"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder={t('filter.max')}
                  className="product-filter__input product-filter__input--price"
                  value={maxPrice}
                  onChange={(event) => updateParam('maxPrice', event.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
