/**
 * Shared application constants.
 *
 * What this file is:
 * A centralized constants module for options, enums, and environment flags.
 *
 * What it does:
 * Prevents magic strings and duplicated values across contexts, pages, routes, and services.
 *
 * Where it is used:
 * Imported by filters, selectors, forms, guards, and service modules throughout the project.
 */

// Product categories used in shop filters, quiz outcomes, and admin product assignment UI.
export const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'sport', label: 'Sport' },
  { value: 'classic', label: 'Classic' },
  { value: 'smart', label: 'Smart' },
]

// Sort options consumed by shop controls and watchService filtering logic.
export const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
]

// Canonical order status values used by badges, steppers, and admin status updates.
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Currency options shown in currency switcher and interpreted by CurrencyContext.
export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'EGP', symbol: 'E£', label: 'Egyptian Pound' },
  { code: 'SAR', symbol: 'Rs', label: 'Saudi Riyal' },
  { code: 'AED', symbol: 'ED£', label: 'UAE Dirham' },
]

// Language options used by LanguageContext to set `lang`, `dir`, and translation lookup key.
export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', dir: 'rtl' },
]

// User role enum used by route guards (AdminRoute) and role-based UI rendering.
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

// Base API URL used by axios instance and service files; defaults to `/api` for Vite proxy usage.
export const API_URL = import.meta.env.VITE_API_URL || '/api' //

// Toggle mock services versus real HTTP calls.
// Defaults to `true` for frontend-first development (backend not running yet).
// Set VITE_USE_MOCK=false in `.env` when you want to use real API routes.
const envUseMock = import.meta.env.VITE_USE_MOCK
export const USE_MOCK = envUseMock ? envUseMock.toLowerCase() === 'true' : true
