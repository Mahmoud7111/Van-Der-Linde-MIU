import React         from 'react'
import ReactDOM      from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router }    from '@/routes'

// Contexts — order matters
import { ThemeProvider }    from '@/context/ThemeContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { AuthProvider }     from '@/context/AuthContext'
import { CartProvider }     from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

// Global styles
import '@/styles/variables.css'
import '@/styles/index.css'
import '@/styles/animations.css'

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <ThemeProvider>

        <LanguageProvider> 

          <CurrencyProvider>

            <AuthProvider>

              <CartProvider>

                <WishlistProvider>

                  <RouterProvider router={router} />

                </WishlistProvider>

              </CartProvider>

            </AuthProvider>

          </CurrencyProvider>

        </LanguageProvider>

      </ThemeProvider>

    </React.StrictMode>
  )