/**
 * Service for fetching real-time exchange rates.
 * 
 * Uses the free, no-key-required public endpoint from ExchangeRate-API.
 * Base currency is USD by default.
 */

const BASE_URL = 'https://open.er-api.com/v6/latest/USD'

// Default fallback rates in case of API failure.
// These are rough estimates and should only be used as a last resort.
export const DEFAULT_RATES = {
  USD: 1,
  EUR: 0.92,
  EGP: 47.50,
  SAR: 3.75,
  AED: 3.67
}

/**
 * Fetch latest exchange rates from the public API.
 * @returns {Promise<Object>} Object containing currency codes as keys and rates as values.
 */
export const getLatestRates = async () => {
  try {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      throw new Error(`Currency API responded with status: ${response.status}`)
    }
    const data = await response.json()
    
    if (data && data.rates) {
      return data.rates
    }
    
    throw new Error('Invalid data format received from Currency API')
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    // Return default rates so the app remains functional
    return DEFAULT_RATES
  }
}
