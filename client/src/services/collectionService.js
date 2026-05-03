import collections from '@/data/collections.json'

/**
 * Collection service using local JSON for mock data.
 * All real API calls and Axios dependencies have been removed.
 */
export const collectionService = {
  // Called by the `/collections` page loader (or page-level fetch) to render all collections.
  getAll: () => Promise.resolve(collections),

  // Called by the `/collections/:slug` detail loader that receives `params.slug` from the URL.
  getBySlug: (slug) => {
    const collection = collections.find((item) => item.slug === slug)

    if (collection) {
      return Promise.resolve(collection)
    }

    // Reject with Response so createBrowserRouter loader error handling can read HTTP status.
    return Promise.reject(new Response('Collection not found', { status: 404 }))
  },
}

export default collectionService;