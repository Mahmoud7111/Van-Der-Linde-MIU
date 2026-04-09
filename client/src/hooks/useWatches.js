export default function UseWatches() {
  return null;
}

//! MIGHT DELETE THIS FILE — depends on how we handle data fetching for non-route components. If we can do it all with route loaders + useLoaderData, we won't need this at all. But if we have components that need to fetch their own data inside pages, this is the pattern we'll use.
//! RelatedWatches section   → needs DIFFERENT data (same category) ← useWatches needed here
//! So useWatches is needed in exactly one place right now — the RelatedWatches section inside ProductDetailPage that fetches watches in the same category. Everything else uses useLoaderData.
//! Sub-component inside a page needs its OWN data (RelatedWatches, FeaturedSection)

//! So If We don't build a RelatedWatches section — We may never need useWatches at all.
// Route loaders are the primary way to fetch data (ShopPage gets watches from useLoaderData).
// useWatches is the fallback for components that need data but aren't page-level routes — like FeaturedWatches on the HomePage sidebar or a RelatedWatches section.


/**
 * useWatches(filters) → { watches, loading, error }  |  useWatch(id) → { watch, loading, error }
 *
 * What it is:
 * A data-fetching hook that calls watchService and returns the result with loading and error states.
 * Wraps the async service call in a clean, reusable pattern.
 *
 * Why we use it:
 * Route loaders handle data for page-level components. But sub-components (FeaturedWatches, RelatedWatches)
 * are not routes — they cannot use useLoaderData(). This is their fallback.
 *
 * The mechanism:
 * Uses useState for data/loading/error + useEffect to call the service when filters change.
 * Returns all three states so the component can handle each case.
 *
 * Important distinction:
 * ShopPage and ProductDetailPage use useLoaderData() — data is pre-fetched by the "route loader" before
 * the page renders, no spinner needed. useWatches is only for components inside those pages that need
 * their own additional data.
 *
 * Rule:
 * If you can use a route loader — use it. Only reach for useWatches when you are inside a component
 * that is not itself a route.
 *
 * Used in these files:
 * - pages/home/HomePage.jsx (FeaturedWatches section)
 * - pages/product/ProductDetailPage.jsx (RelatedWatches section)
 * - components/product/ProductGrid.jsx (when used outside routes)
 */