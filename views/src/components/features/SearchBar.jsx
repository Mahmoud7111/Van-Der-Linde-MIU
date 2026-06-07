import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { watchService } from '@/services/watchService'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import useDebounce from '@/hooks/useDebounce'
import useClickOutside from '@/hooks/useClickOutside'
import './SearchBar.css'

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  const searchRef = useRef(null)
  const inputRef = useRef(null)

  // Debounce the query string by 400ms to avoid hammering the service
  const debouncedQuery = useDebounce(query, 400)

  // Close the search dropdown if the user clicks anywhere outside the search container
  useClickOutside(searchRef, () => {
    if (isOpen) setIsOpen(false)
  })

  // Trigger search logic whenever the debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return
    }

    watchService.getAll({ search: debouncedQuery })
      .then((data) => setResults(data))
      .catch((err) => console.error("Search failed:", err))
      .finally(() => setIsLoading(false))
  }, [debouncedQuery])

  const visibleResults = debouncedQuery.trim() ? results : []

  const toggleSearch = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Focus input shortly after opening the dropdown
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const closeSearch = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    setIsLoading(false)
  }

  const handleQueryChange = (event) => {
    const nextQuery = event.target.value
    setQuery(nextQuery)
    setIsLoading(Boolean(nextQuery.trim()))
  }

  return (
    <div className="search-bar" ref={searchRef}>
      <button 
        type="button" 
        className="header__icon-control" 
        onClick={toggleSearch}
        aria-label={t('header.toggleSearch')}
      >
        <FiSearch aria-hidden="true" />
      </button>

      <div className={`search-bar__dropdown ${isOpen ? 'search-bar__dropdown--open' : ''}`}>
        <div className="search-bar__input-wrap">
          <FiSearch className="search-bar__input-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="search-bar__input"
            placeholder={t('header.search')}
            value={query}
            onChange={handleQueryChange}
          />
          {query && (
            <button className="search-bar__clear" onClick={closeSearch} aria-label={t('search.clear')}>
              <FiX aria-hidden="true" />
            </button>
          )}
        </div>

        {isOpen && query.trim() !== '' && (
          <div className="search-bar__results">
            {isLoading && <div className="search-bar__loading">{t('search.loading')}</div>}
            
            {!isLoading && visibleResults.length === 0 && (
              <div className="search-bar__no-results">{t('search.noResults', { query })}</div>
            )}

            {!isLoading && visibleResults.length > 0 && (
              <ul className="search-bar__results-list">
                {visibleResults.slice(0, 5).map((watch) => (
                  <li key={watch._id} className="search-bar__result-item">
                    <Link to={`/watch/${watch._id}`} className="search-bar__result-link" onClick={closeSearch}>
                      <img src={resolveWatchProductImage(watch.images?.[0])} alt={watch.name} className="search-bar__result-image" />
                      <div className="search-bar__result-info">
                        <span className="search-bar__result-name">{watch.name}</span>
                        <span className="search-bar__result-price">{formatPrice(watch.price)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
                {visibleResults.length > 5 && (
                  <li className="search-bar__result-more">
                    <Link to={`/shop?search=${encodeURIComponent(query)}`} onClick={closeSearch}>
                      {t('search.viewAllResults', { count: visibleResults.length })}
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
