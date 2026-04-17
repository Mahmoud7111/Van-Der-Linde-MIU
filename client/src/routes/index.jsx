/**
 * Application router configuration using createBrowserRouter.
 *
 * What this file is:
 * The complete route map for Van Der Linde frontend navigation and data loaders.
 *
 * What it does:
 * - Declares every public, protected, and admin route.
 * - Uses route loaders to prefetch data before page render.
 * - Uses lazy imports to split page bundles for faster initial load.
 * - Assigns a root errorElement to catch loader errors and render failures.
 *
 * Where it is used:
 * Imported by main.jsx and passed into <RouterProvider router={router} />.
 */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import PrivateRoute from '@/routes/PrivateRoute'
import AdminRoute from '@/routes/AdminRoute'
import { watchService } from '@/services/watchService'
import { collectionService } from '@/services/collectionService'
import { orderService } from '@/services/orderService'
import ErrorPage from '@/pages/info/ErrorPage.jsx'  // ← regular import, not lazy because it is used as the root errorElement and must be available immediately when an error occurs.

//! Note: All page components are lazy-loaded to optimize initial bundle size. The Layout component is not lazy-loaded because it is the root element that wraps all routes and must be available immediately for the router to render any page. The ErrorPage is also not lazy-loaded because it is used as the root errorElement to catch loader errors and rendering errors at the top level, so it must be available immediately when an error occurs.

// Lazy page imports reduce initial bundle size; Layout's Suspense handles loading fallback.
//! Without lazy — all page code loads on first visit
//! // With lazy — only the visited page's code downloads on first visit, other pages load when visited later.
const HomePage = lazy(() => import('@/pages/home/HomePage.jsx'))
const ShopPage = lazy(() => import('@/pages/shop/ShopPage.jsx'))
const ShopMenPage = lazy(() => import('@/pages/shop/ShopMenPage.jsx'))
const ShopWomenPage = lazy(() => import('@/pages/shop/ShopWomenPage.jsx'))
const ProductDetailPage = lazy(() => import('@/pages/product/ProductDetailPage.jsx'))

const CartPage = lazy(() => import('@/pages/cart/CartPage.jsx'))
const CheckoutPage = lazy(() => import('@/pages/cart/CheckoutPage.jsx'))
const OrderConfirmationPage = lazy(() => import('@/pages/cart/OrderConfirmationPage.jsx'))

const LoginPage = lazy(() => import('@/pages/account/LoginPage.jsx'))
const RegisterPage = lazy(() => import('@/pages/account/RegisterPage.jsx'))
const ForgotPasswordPage = lazy(() => import('@/pages/account/ForgotPasswordPage.jsx'))
const ResetPasswordPage = lazy(() => import('@/pages/account/ResetPasswordPage.jsx'))
const AccountPage = lazy(() => import('@/pages/account/AccountPage.jsx'))
const OrderHistoryPage = lazy(() => import('@/pages/account/OrderHistoryPage.jsx'))
const WishlistPage = lazy(() => import('@/pages/account/WishlistPage.jsx'))

const AboutPage = lazy(() => import('@/pages/info/AboutPage.jsx'))
const CollectionsPage = lazy(() => import('@/pages/info/CollectionsPage.jsx'))
const ServicesPage = lazy(() => import('@/pages/info/ServicesPage.jsx'))
const ContactPage = lazy(() => import('@/pages/info/ContactPage.jsx'))
const FaqPage = lazy(() => import('@/pages/info/FaqPage.jsx'))
const GiftingPage = lazy(() => import('@/pages/info/GiftingPage.jsx'))
const GiftRegistryPage = lazy(() => import('@/pages/info/GiftRegistryPage.jsx'))
const SizeGuidePage = lazy(() => import('@/pages/info/SizeGuidePage.jsx'))
const PrivacyPolicyPage = lazy(() => import('@/pages/info/PrivacyPolicyPage.jsx'))
const TermsPage = lazy(() => import('@/pages/info/TermsPage.jsx'))
const NotFoundPage = lazy(() => import('@/pages/info/NotFoundPage.jsx'))
//! const ErrorPage = lazy(() => import('@/pages/info/ErrorPage.jsx')) Removed because it is imported directly in the router config to handle loader errors and rendering errors at the root level. It should not be lazy-loaded to ensure it is available immediately when an error occurs.

const WatchQuizPage = lazy(() => import('@/pages/quiz/WatchQuizPage.jsx'))
const ConfiguratorPage = lazy(() => import('@/pages/configurator/ConfiguratorPage.jsx'))

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard.jsx'))
const ManageProducts = lazy(() => import('@/pages/admin/ManageProducts.jsx'))
const ManageOrders = lazy(() => import('@/pages/admin/ManageOrders.jsx'))

// Exported router consumed by RouterProvider in main.jsx.
export const router = createBrowserRouter([
  {
    path: '/',
    // Layout wraps all route content and provides shared header/footer/outlet shell.
    element: <Layout />,

    // Root error boundary for loader failures and rendering errors from child routes.
    errorElement: <ErrorPage />,

    children: [
      // Home route preloads watches and collections before rendering homepage content.
      {
        index: true,
        element: <HomePage />,
        loader: async () => {
          const [watches, collections] = await Promise.all([
            watchService.getAll(),
            collectionService.getAll(),
          ])

          return { watches, collections }
        },
      },

      // Shop routes with data loaders to prefetch catalog data based on URL params.
      {
        path: 'shop',                   //<- the URL
        element: <ShopPage />,         //<- the page component rendered at that URL
        loader: ({ request }) => {    // <- data to fetch BEFORE rendering
          // Read query string directly from loader request URL.
          const url = new URL(request.url)

          // Build filter object expected by watchService.
          const filters = {
            category: url.searchParams.get('category') || 'all',
            search: url.searchParams.get('search') || '',
            sort: url.searchParams.get('sort') || 'default',
          }

          return watchService.getAll(filters)
        },
      },
      {
        path: 'shop/men',
        element: <ShopMenPage />,
        loader: () => watchService.getAll({ gender: 'men' }),
      },
      {
        path: 'shop/women',
        element: <ShopWomenPage />,
        loader: () => watchService.getAll({ gender: 'women' }),
      },
      {
        path: 'watch/:id',
        element: <ProductDetailPage />,
        loader: ({ params }) => watchService.getById(params.id),
      },

      // Cart and checkout funnel routes.
      {
        path: 'cart',
        // Cart page reads data from CartContext, so no loader is required.
        element: <CartPage />,
      },
      {
        path: 'checkout',
        // Protected because checkout requires authenticated customer details.
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'order-confirmation',
        // Protected so only authenticated users can view order confirmation pages.
        element: (
          <PrivateRoute>
            <OrderConfirmationPage />
          </PrivateRoute>
        ),
      },

      // Authentication routes.
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'account/reset-password', element: <ResetPasswordPage /> },

      // Account landing page is public so header user icon always opens it.
      {
        path: 'account',
        element: <AccountPage />,
      },

      // Account detail routes requiring authentication; loaders prefetch user order data before render.
      {
        path: 'account/orders',
        element: (
          <PrivateRoute>
            <OrderHistoryPage />
          </PrivateRoute>
        ),
        loader: () => orderService.getMyOrders(), // Order history page needs the full order list to display order history, so we preload them here. In a real app, we might have pagination or a separate endpoint for order history summaries to optimize this loader.
      },
      {
        path: 'account/wishlist',
        element: (
          <PrivateRoute>
            <WishlistPage />
          </PrivateRoute>
        ),
      },

      // Informational and marketing pages.
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'quiz', element: <WatchQuizPage /> },
      { path: 'configurator', element: <ConfiguratorPage /> },
      { path: 'gifting', element: <GiftingPage /> },
      { path: 'gift-registry', element: <GiftRegistryPage /> },
      { path: 'size-guide', element: <SizeGuidePage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'terms', element: <TermsPage /> },

      // Admin routes are protected by role-based guard.
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/watches',
        element: (
          <AdminRoute>
            <ManageProducts />
          </AdminRoute>
        ),
        loader: () => watchService.getAll(), // Admin product management page needs full watch list to display and edit products.
      },
      {
        path: 'admin/orders',
        element: (
          <AdminRoute>
            <ManageOrders />
          </AdminRoute>
        ),
        loader: () => orderService.getAll(), // Admin order management page needs full order list to display and manage orders.
      },

      // Catch-all route for unknown URLs.
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
