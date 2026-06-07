/*
  used in Header.jsx for the search overlay that appears when the search icon is clicked. It fetches the full watch catalogue on first open, then filters client-side as the user types their query. Results are grouped by category and displayed in a panel that animates down from below the header. The backdrop behind it also fades in, and clicking outside the panel closes it.
*/
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { watchService } from '@/services/watchService'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { useCurrency } from '@/context/CurrencyContext'
import { CATEGORIES } from '@/utils/constants'
import { motion, AnimatePresence } from 'framer-motion'
import './SearchOverlay.css'

export default function SearchOverlay ({
  isOpen,
  query = '',
  onClose,
  headerHeight = 115,
  showInput = false,
  onQueryChange = () => {},
  inputRef = null,
  placeholder = 'Search watches...'
}) {
  const [results, setResults] = useState([])
  const [allWatches, setAllWatches] = useState([])
  const { formatPrice } = useCurrency()
  const fallbackInputRef = useRef(null)
  const resolvedInputRef = inputRef || fallbackInputRef
  const isQueryEmpty = !query.trim()

  // Fetch catalogue once on first open
  useEffect(() => {
    if (!allWatches.length) {
      watchService.getAll()
        .then(setAllWatches)
        .catch(console.error)
    }

  }, [isOpen])


  // Filter whenever query changes
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const term = query.toLowerCase()
    setResults(
      allWatches.filter(w =>
        w.name?.toLowerCase().includes(term) ||
        w.brand?.toLowerCase().includes(term) ||
        w.category?.toLowerCase().includes(term)
      )
    )
  }, [query, allWatches])
  

  useEffect(() => {
    if (!isOpen || !showInput) return
    const id = setTimeout(() => resolvedInputRef.current?.focus(), 80)
    return () => clearTimeout(id)
  }, [isOpen, showInput, resolvedInputRef])

  const grouped = results.reduce((acc, w) => {
    const cat = w.category || 'luxury'
    ;(acc[cat] = acc[cat] || []).push(w)
    return acc
  }, {})

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — clicking outside closes */}
          <motion.div
            className="sov__backdrop"
            style={{ '--sov-top': `${headerHeight}px` }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Results panel drops from below the header */}
          <motion.div
            className="sov__panel"
            style={{ '--sov-top': `${headerHeight}px` }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          >
            <div className="sov__inner">
              <div className="sov__top">
                <div className="sov__title-area">
                  <h2 className="sov__title">Products</h2>
                  <p className="sov__subtitle">Search the live catalogue — names, brands, and categories.</p>
                </div>
                <button className="sov__close" onClick={onClose} aria-label="Close">
                  <FiX />
                </button>
              </div>

              {showInput && (
                <div className="sov__search" role="search">
                  <FiSearch className="sov__search-icon" aria-hidden="true" />
                  <input
                    ref={resolvedInputRef}
                    type="text"
                    className="sov__search-input"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    aria-label="Search"
                  />
                  {query && (
                    <button className="sov__search-clear" onClick={() => onQueryChange('')} aria-label="Clear search">
                      <FiX />
                    </button>
                  )}
                </div>
              )}

              {isQueryEmpty ? (
                <div className="sov__empty">
                  <div className="sov__empty-box">
                    <p className="sov__empty-heading">Start typing to search</p>
                    <p className="sov__empty-hint">Type to see products from the catalogue.</p>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="sov__empty">
                  <div className="sov__empty-box">
                    <p className="sov__empty-heading">No matches for "{query}"</p>
                    <p className="sov__empty-hint">Try a brand, collection name, or part of a product name.</p>
                  </div>
                </div>
              ) : (
                <div className="sov__results">
                  {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} className="sov__category">
                      <h3 className="sov__cat-label">
                        {CATEGORIES.find(c => c.value === cat)?.label || cat}
                      </h3>
                      <div className="sov__grid">
                        {items.map(w => (
                          <Link
                            key={w._id}
                            to={`/product/${w._id}`}
                            className="sov__item"
                            onClick={onClose}
                          >
                            <div className="sov__img">
                              <img
                                src={resolveWatchProductImage(w.images?.[0] || w.image)}
                                alt={w.name}
                              />
                            </div>
                            <div className="sov__info">
                              <p className="sov__name">{w.name}</p>
                              <p className="sov__price">{formatPrice(w.price)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
