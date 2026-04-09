/**
 * Currency context for global price display behavior.
 *
 * What this file is:
 * A React context that stores selected currency and exposes formatting helpers.
 *
 * What it does:
 * - Persists selected currency in localStorage.
 * - Provides a context-scoped `formatPrice(amount)` function that always uses
 *   the currently selected currency.
 *
 * Where it is used:
 * CurrencyProvider wraps the app in main.jsx. Components like ProductCard,
 * ProductDetailPage, CartSummary, Checkout pages, and order tables call useCurrency().
 */
import { createContext, useContext, useState } from 'react'
import { formatPrice as formatCurrencyPrice } from '@/utils/formatters'

// Create currency context for current currency code and utility methods.
const CurrencyContext = createContext(null)

// Provider exposes currency selection state and formatting helpers.
export const CurrencyProvider = ({ children }) => {
  // Restore previous currency choice or default to USD.
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD')

  // Context-level formatter lets components call formatPrice(watch.price) without knowing active currency.
  const formatPrice = (amount) => formatCurrencyPrice(amount, currency)

  // Setter updates React state + localStorage so selection persists across refreshes.
  const handleSetCurrency = (nextCurrency) => {
    setCurrency(nextCurrency)
    localStorage.setItem('currency', nextCurrency)
  }

  return (
    // Share selected currency and formatting behavior globally.
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

// Custom hook for currency context access.
export const useCurrency = () => {
  const context = useContext(CurrencyContext)

  // Guard against incorrect usage outside provider boundary.
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }

  return context
}
