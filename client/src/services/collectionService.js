/**
 * Collection service (mock + real implementations).
 *
 * What this file is:
 * A data access layer for collection-related operations.
 *
 * What it does:
 * Provides a single `collectionService` export with mock and real async methods
 * to list collections and fetch one collection by slug.
 *
 * Where it is used:
 * Route loaders/pages for collections list and collection detail flows
 * (for example `/collections` and `/collections/:slug`).
 */

//! Still in development

import api from '@/api/axiosInstance'
import { USE_MOCK } from '@/utils/constants'
import collections from '@/data/collections.json'

// Mock service for frontend-first development while backend routes are pending.
const mock = {
  // Called by the `/collections` page loader (or page-level fetch) to render all collections.
  // Backend parity: GET /collections.
  // Promise.resolve preserves the same async contract as real API calls so loaders/components
  // can await one consistent interface in both mock and real modes.
    getAll: () => Promise.resolve(collections),

  // Called by the `/collections/:slug` detail loader that receives `params.slug` from the URL.
  // Backend parity: GET /collections/:slug.
  // Promise.resolve/Promise.reject keeps mock behavior aligned with real async request flow.
  // Slug is used instead of `_id` because it is URL-friendly, readable, and matches route params.
    getBySlug: (slug) => {
        const collection = collections.find((item) => item.slug === slug)

    if (collection) {
        return Promise.resolve(collection)
    }

    // Reject with Response so createBrowserRouter loader error handling can read HTTP status.
    return Promise.reject(new Response('Collection not found', { status: 404 }))
    },
}

// Real service for production API integration.
const real = {
  // Called by the `/collections` page loader to fetch the collection list.
  // Backend route: GET /collections.
    getAll: () => api.get('/collections').then((response) => response.data),

  // Called by the `/collections/:slug` detail loader using route param `slug`.
  // Backend route: GET /collections/:slug.
  // Slug (not `_id`) is used to keep URLs human-readable and route-compatible.
    getBySlug: (slug) => api.get(`/collections/${slug}`).then((response) => response.data),
}

// Single export consumed by loaders/pages; mode is controlled by USE_MOCK.
export const collectionService = USE_MOCK ? mock : real