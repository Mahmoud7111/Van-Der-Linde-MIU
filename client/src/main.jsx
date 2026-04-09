/**
 * Frontend entry point for Van Der Linde React application.
 *
 * What this file is:
 * The bootstrap file that mounts React, global providers, router, and global styles.
 *
 * What it does:
 * - Initializes React 18 root rendering.
 * - Composes all six global context providers in required order.
 * - Mounts RouterProvider (createBrowserRouter-based routing) as the page renderer.
 *
 * Where it is used:
 * Vite loads this file as the app entry from index.html.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'

import { ThemeProvider } from '@/context/ThemeContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

// Global style entry point order: //! Orders matter for CSS cascade and variable availability.
// 1) Variables first so tokens are available everywhere.
// 2) Keyframes/utilities next so components can reference animations.
// 3) Base reset/style rules last for document defaults.
import '@/styles/variables.css'
import '@/styles/animations.css'
import '@/styles/index.css'

// App.jsx is intentionally removed as the root component because createBrowserRouter's route elements and loaders now handle page rendering and shared layout concerns. The Layout component is used directly in the router configuration to wrap all routes, so it serves as the root page shell without needing an additional App wrapper. This simplifies the component hierarchy and allows the router to manage all page-level concerns directly through its route definitions and loaders.
// createBrowserRouter + Layout now handle route rendering and shared page shell concerns.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode runs additional development checks (including double-invoking effects in dev)
  // to help detect unsafe side effects early.
  <React.StrictMode>
    {/*
      Provider order matters:
      - ThemeProvider outermost so all UI can read theme variables.
      - Language and Currency globally available to all pages/components.
      - AuthProvider above CartProvider in case cart behavior becomes user-aware.
      - RouterProvider innermost so routed pages can consume every context value.
    */}
    <ThemeProvider>              {/*<- 1st: outermost — every component needs theme*/}
      <LanguageProvider>         {/*<- 2nd: language tokens should be globally available*/} 
        <CurrencyProvider>       {/*<- 3rd: shop components need formatPrice()*/}  
          <AuthProvider>         {/*<- 4th: must be before Cart (cart may need user)*/}  
            <CartProvider>       {/*<- 5th: cart context above wishlist in case of shared behavior or cross-context interactions AND  cart needs auth context available above it*/} 
              <WishlistProvider> {/*<- 6th: innermost provider, but still above RouterProvider so all pages can access wishlist context*/}
                <RouterProvider router={router} />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
)
