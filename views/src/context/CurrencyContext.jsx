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
import { createContext, useContext, useState, useEffect } from 'react'
import { CURRENCIES } from '@/utils/constants'
import { formatPrice as formatCurrencyPrice } from '@/utils/formatters'
import { getLatestRates, DEFAULT_RATES } from '@/services/currencyService'

// Create currency context for current currency code and utility methods.
const CurrencyContext = createContext(null)

const supportedCurrencyCodes = new Set(CURRENCIES.map((item) => item.code))

const normalizeCurrencyCode = (value) => {
  const normalizedValue = String(value || '').trim().toUpperCase()
  return supportedCurrencyCodes.has(normalizedValue) ? normalizedValue : 'USD'
}

// Provider exposes currency selection state and formatting helpers.
export const CurrencyProvider = ({ children }) => {
  // Restore previous currency choice or default to USD.
  const [currency, setCurrency] = useState(() => normalizeCurrencyCode(localStorage.getItem('currency')))
  
  // Rates state, initialized with defaults or cached values.
  const [rates, setRates] = useState(() => {
    const cached = localStorage.getItem('exchange_rates')
    return cached ? JSON.parse(cached) : DEFAULT_RATES
  })

  // Fetch fresh rates on mount.
  useEffect(() => {
    const fetchRates = async () => {
      const freshRates = await getLatestRates()
      setRates(freshRates)
      localStorage.setItem('exchange_rates', JSON.stringify(freshRates))
    }
    fetchRates()
  }, [])

  /**
   * Context-level formatter.
   * Calculates the converted price based on current rates before formatting.
   * 
   * @param {number} amount - The base price (assumed to be in USD).
   * @returns {string} Formatted string with currency symbol and converted value.
   */
  const formatPrice = (amount) => {
    const rate = rates[currency] || 1
    const convertedAmount = amount * rate
    return formatCurrencyPrice(convertedAmount, currency)
  }

  // Setter updates React state + localStorage so selection persists across refreshes.
  const handleSetCurrency = (nextCurrency) => {
    const normalizedCurrency = normalizeCurrencyCode(nextCurrency)
    setCurrency(normalizedCurrency)
    localStorage.setItem('currency', normalizedCurrency)
  }

  return (
    // Share selected currency, formatting behavior, and raw rates globally.
    <CurrencyContext.Provider
      value={{
        currency,
        rates,
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
