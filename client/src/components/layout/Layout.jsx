/**
 * Root layout for all routed pages.
 *
 * What this file is:
 * The top-level shell rendered by createBrowserRouter for the `/` route.
 *
 * What it does:
 * - Renders shared chrome (Header + Footer).
 * - Hosts ScrollToTop once for global route-change scroll reset.
 * - Shows a top loading bar during route transitions/loaders.
 * - Renders route children inside Outlet wrapped in Suspense for lazy-loaded pages.
 *
 * Where it is used:
 * Referenced as the root `element` in routes/index.jsx.
 * 
 * ! Without Layout, you'd need Header + Footer in every page
 * 
 * ! routes/index.jsx tells the router: put all pages inside Layout
 */
import { Suspense } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EmailCaptureModal from '@/components/common/EmailCaptureModal'
import ScrollToTop from '@/routes/ScrollToTop'

// Root layout component for all application routes.
export default function Layout() {
  // Router navigation state tells us when loaders or route transitions are in progress.
  const navigation = useNavigation()

  // Loading bar appears whenever router is fetching/transitioning to a new route.
  const isLoading = navigation.state === 'loading'

  return (
    <>
      {/* Render once globally; no visible UI, only scroll reset side effect. */}
      <ScrollToTop />

      {/* Shared top navigation across all pages. */}
      <Header />

      {/* Route transition bar provides immediate feedback while loaders are resolving. */}
      {isLoading && (   //! The Style Might Be Changed Later, but for now it's a simple fixed bar at the top of the page that animates while loading. */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'var(--color-gold)',
            animation: 'loadingBar 1.2s linear infinite',
            zIndex: 'var(--z-toast)',
          }}
          aria-hidden="true"
        />
      )}

      {/*
        Main content area expands to fill vertical space.
        `flex: 1` keeps footer pushed to the bottom on short pages.
      */}
      <main style={{ flex: 1 }}>
        {/*
          Suspense is required because route elements are lazy-loaded with React.lazy in routes/index.jsx.
          Until the chunk resolves, this fallback is shown.

          // All pages are lazy loaded (React.lazy)
          // When user first visits /shop, ShopPage.js has to download
          // During that download, React needs a fallback to show
          // Suspense provides that fallback while waiting for the lazy-loaded page to be ready
        */}
         {/* The fallback can be a spinner, skeleton, or simple "Loading..." text. It shows while the lazy-loaded page component is being fetched and rendered for the first time. Once the page component is ready, Suspense will render it in place of the fallback. */}
        <Suspense fallback={<div style={{ padding: 'var(--space-lg)' }}>Loading...</div>}>
          {/* Outlet is where createBrowserRouter renders matched child routes. */}
          <Outlet /> {/*//! - current page renders HERE, Outlet is the placeholder for the current route's page component. It will render whatever page component matches the current URL, as defined in routes/index.jsx. Because those page components are lazy-loaded, they will trigger the Suspense fallback until they are ready. */}
        </Suspense> 
      </main>

      {/* Shared footer across all pages. */}
      <Footer />

      {/* Global marketing modals */}
      <EmailCaptureModal />
    </>
  )
}
