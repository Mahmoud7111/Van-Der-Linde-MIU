# Van Der Linde — Developer Guide
> Read this entire document before writing a single line of code.

---

## Table of Contents
1. [Prerequisites & Installation](#1-prerequisites--installation)
2. [Running the Project](#2-running-the-project)
3. [What Dev 1 Already Built](#3-what-dev-1-already-built)
4. [No-Blocking Rule — Read This](#4-no-blocking-rule--read-this)
5. [Context API Reference](#5-context-api-reference)
6. [Services Reference](#6-services-reference)
7. [Hooks Reference](#7-hooks-reference)
8. [Utils Reference](#8-utils-reference)
9. [CSS Rules](#9-css-rules)
10. [Git Workflow](#10-git-workflow)
11. [Dev Assignments (Parallel)](#11-dev-assignments-parallel)

---

## 1. Prerequisites & Installation

### Required Software (install before anything else)
| Tool | Version | Download |
|------|---------|----------|
| Node.js | ≥ 18.x | https://nodejs.org |
| Git | latest | https://git-scm.com |
| VS Code | latest | https://code.visualstudio.com |

### VS Code Extensions (install all of these)
- **ESLint** — code quality
- **Prettier** — auto formatting
- **ES7+ React/Redux/React-Native snippets** — React shortcuts
- **CSS Variable Autocomplete** — helps with `var(--color-gold)` etc.
- **GitLens** — see who changed what

### Clone and Install
```powershell
# Clone the repo
git clone https://github.com/your-org/van-der-linde.git
cd van-der-linde

# Install everything (root + client) in one command
npm run install:all
```

### Frontend-only packages already in package.json (DO NOT re-install manually)
```
react                    react-dom
react-router-dom         axios
framer-motion            react-hook-form
@hookform/resolvers      yup
react-hot-toast          react-icons
clsx
```

### If you need to install something NEW, run inside client/
```powershell
cd client
npm install <package-name>
```

### Packages you will likely need to add (per domain)

**Dev 2 (Mina)— Shop & Product:**
```powershell
cd client
# No extra packages needed — everything is in package.json
```

**Dev 3 (Omar Abass)— Cart & Checkout:**
```powershell
cd client
npm install @stripe/react-stripe-js @stripe/stripe-js
```

**Dev 4 (Ahmed)— Auth & Account:**
```powershell
cd client
# No extra packages needed
```

**Dev 5 (Omar Magdy)— Content & Features:**
```powershell
cd client
# No extra packages needed
```

---

## 2. Running the Project

### Start everything (frontend + backend) from root:
```powershell
npm run dev
```

### Start frontend only:
```powershell
cd client
npm run dev
# Runs on http://localhost:5173
```

### Environment file
Create `client/.env` with:
```
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=true
VITE_STRIPE_PK=pk_test_replace_when_ready
```

> **Important:** `VITE_USE_MOCK=true` means the app uses fake JSON data from `src/data/`. You do NOT need the backend running to work on the frontend. Keep it `true` until the backend is ready.

---

## 3. What Dev 1 Already Built

Do not rebuild or modify any of these files without asking Dev 1 first.

### Foundation Files — COMPLETE
```
src/styles/variables.css          ← ALL CSS tokens — use var(--color-gold) etc.
src/styles/index.css              ← global reset + base styles
src/styles/animations.css         ← @keyframes: fadeIn, slideUp, shimmer, spin, pulse, loadingBar
src/api/axiosInstance.js          ← shared axios instance — NEVER import axios directly
src/utils/cn.js                   ← cn('btn', isActive && 'btn--active')
src/utils/constants.js            ← CATEGORIES, SORT_OPTIONS, ORDER_STATUS, CURRENCIES, etc.
src/utils/formatters.js           ← formatPrice, formatDate, truncateText, slugify
src/utils/validators.js           ← loginSchema, registerSchema, shippingSchema, reviewSchema
```

### Data Files (mock JSON) — COMPLETE
```
src/data/products.json
src/data/collections.json
src/data/brands.json
src/data/orders.json
src/data/user.json
src/data/faq.json
src/data/quiz-questions.json
src/data/testimonials.json
src/data/translations.json
```

### Contexts — COMPLETE (use hooks, never modify internals)
```
src/context/ThemeContext.jsx       ← useTheme()
src/context/LanguageContext.jsx    ← useLanguage()
src/context/CurrencyContext.jsx    ← useCurrency()
src/context/AuthContext.jsx        ← useAuth()
src/context/CartContext.jsx        ← useCart()
src/context/WishlistContext.jsx    ← useWishlist()
```

### Services — COMPLETE
```
src/services/authService.js
src/services/watchService.js
src/services/orderService.js
src/services/collectionService.js
```

### Routes & Layout — COMPLETE
```
src/routes/index.jsx              ← all routes already wired, do NOT touch
src/routes/PrivateRoute.jsx
src/routes/AdminRoute.jsx
src/routes/ScrollToTop.jsx
src/components/layout/Layout.jsx
```

### Header & HomePage — COMPLETE
```
src/components/layout/Header.jsx + Header.css
src/pages/home/HomePage.jsx + HomePage.css
```

### Common Components — REAL IMPLEMENTATIONS (COMPLETE, do not rebuild)
```
src/components/common/Button.jsx          ← DONE — real implementation with variants, sizes, loading state
src/components/common/Button.css          ← DONE
src/components/common/StarRating.jsx      ← DONE — real implementation, supports interactive mode
src/components/common/PageTransition.jsx  ← DONE — Framer Motion fade+slide, wraps children
```

### Common Components — STUBS (working but minimal — assigned devs replace internals only)
```
src/components/common/EmptyState.jsx      ← stub — Dev 3 implements real version
src/components/common/Loader.jsx          ← stub — Dev 3 implements real version
src/components/common/SkeletonCard.jsx    ← stub — Dev 2 implements real version
src/components/common/Modal.jsx           ← stub — Dev 3 implements real version
src/components/common/Badge.jsx           ← stub — Dev 4 implements real version
```

> **Stubs are already working and imported correctly.** You do NOT need to create your own copies.
> When you implement the real version, only change the internals — never change the file name, file path, or props signature.

### Hook Stubs (logic not implemented yet — assigned devs implement their own)
```
src/hooks/useDebounce.js          ← Dev 4 implements
src/hooks/useClickOutside.js      ← Dev 3 implements
src/hooks/useMediaQuery.js        ← Dev 5 implements
src/hooks/useScrollPosition.js    ← COMPLETE
src/hooks/useScrollDirection.js   ← COMPLETE
```

---

## 4. No-Blocking Rule — Read This

Dev 1 has already pre-built stub versions of all shared common components and put them on `develop`.

**You do NOT need to create your own stub copies.** Just pull from `develop` and the files are already there.

The only thing to know:

- `Button.jsx`, `StarRating.jsx`, and `PageTransition.jsx` are **fully implemented** — use them as-is.
- `EmptyState.jsx`, `Loader.jsx`, `SkeletonCard.jsx`, `Modal.jsx`, and `Badge.jsx` are **stubs** — they render something basic so nothing crashes. The assigned dev will replace the internals with a real implementation.
- When the assigned dev finishes a component, they replace the stub internals only. The import path stays identical for everyone — no changes needed in your own files.

```jsx
// This import works RIGHT NOW with the stub, and keeps working after the real version ships
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import PageTransition from '@/components/common/PageTransition'
```

---

## 5. Context API Reference

These are all already built. Import the hook and use it. Never import the Context object directly.

---

### useAuth — Authentication
```jsx
import { useAuth } from '@/context/AuthContext'

const { user, loading, login, register, logout } = useAuth()
```

| Value | Type | Description |
|-------|------|-------------|
| `user` | `object \| null` | Current user `{ _id, name, email, role }`. `null` = not logged in |
| `loading` | `boolean` | `true` while session is being restored on page refresh |
| `login(email, password)` | `async function` | Returns `{ user, token }`. Stores token automatically |
| `register(data)` | `async function` | `data = { name, email, password }`. Stores token automatically |
| `logout()` | `async function` | Clears token and sets user to null |

**Common patterns:**
```jsx
// Check if logged in
const { user } = useAuth()
if (!user) return <Navigate to="/login" />

// Login form submit
const { login } = useAuth()
const onSubmit = async (data) => {
  try {
    await login(data.email, data.password)
    navigate(location.state?.from?.pathname || '/')
  } catch (err) {
    toast.error('Invalid credentials')
  }
}

// Show different UI based on auth
const { user } = useAuth()
return user ? <AccountMenu /> : <Link to="/login">Login</Link>

// Check admin role
const { user } = useAuth()
const isAdmin = user?.role === USER_ROLES.ADMIN
```

---

### useCart — Shopping Cart
```jsx
import { useCart } from '@/context/CartContext'

const { cart, dispatch, totalItems, totalPrice } = useCart()
```

| Value | Type | Description |
|-------|------|-------------|
| `cart` | `array` | Array of cart items `{ _id, name, price, quantity, stock, images }` |
| `dispatch` | `function` | Send actions to the cart reducer |
| `totalItems` | `number` | Sum of all quantities — use in header badge |
| `totalPrice` | `number` | Sum of `price × quantity` — use in cart summary |

**All dispatch actions:**
```jsx
// Add item (handles duplicates automatically, caps at stock limit)
dispatch({ type: 'ADD', payload: watch })

// Remove item
dispatch({ type: 'REMOVE', payload: watchId })

// Update quantity (clamped between 1 and stock)
dispatch({ type: 'UPDATE_QTY', payload: { id: watchId, qty: 3 } })

// Clear entire cart (call after successful checkout)
dispatch({ type: 'CLEAR' })
```

**Common patterns:**
```jsx
// Add to cart button
const { dispatch } = useCart()
<button onClick={() => dispatch({ type: 'ADD', payload: watch })}>
  Add to Cart
</button>

// Cart badge in header
const { totalItems } = useCart()
<span>{totalItems}</span>

// Cart summary
const { cart, totalPrice } = useCart()
const { formatPrice } = useCurrency()
return <div>Total: {formatPrice(totalPrice)}</div>

// Quantity controls in CartItem
const { dispatch } = useCart()
<button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item._id, qty: item.quantity - 1 } })}>-</button>
<button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item._id, qty: item.quantity + 1 } })}>+</button>
<button onClick={() => dispatch({ type: 'REMOVE', payload: item._id })}>Remove</button>
```

---

### useCurrency — Price Formatting
```jsx
import { useCurrency } from '@/context/CurrencyContext'

const { currency, setCurrency, formatPrice } = useCurrency()
```

| Value | Type | Description |
|-------|------|-------------|
| `currency` | `string` | Current code: `'USD'`, `'EUR'`, or `'EGP'` |
| `setCurrency(code)` | `function` | Change currency, persists to localStorage |
| `formatPrice(amount)` | `function` | Formats number with correct symbol and locale |

**Common patterns:**
```jsx
// Display any price — always use this, never format manually
const { formatPrice } = useCurrency()
<span>{formatPrice(watch.price)}</span>           // "$1,299"
<span>{formatPrice(totalPrice)}</span>            // "€2,450"

// Currency switcher buttons
const { currency, setCurrency } = useCurrency()
import { CURRENCIES } from '@/utils/constants'
{CURRENCIES.map(c => (
  <button key={c.code} onClick={() => setCurrency(c.code)} className={currency === c.code ? 'active' : ''}>
    {c.symbol} {c.label}
  </button>
))}
```

---

### useTheme — Dark Mode
```jsx
import { useTheme } from '@/context/ThemeContext'

const { theme, toggleTheme, setTheme } = useTheme()
```

| Value | Type | Description |
|-------|------|-------------|
| `theme` | `string` | `'light'` or `'dark'` |
| `toggleTheme()` | `function` | Flip between light and dark |
| `setTheme(value)` | `function` | Set explicitly if needed |

**Common patterns:**
```jsx
// Dark mode toggle button
const { theme, toggleTheme } = useTheme()
<button onClick={toggleTheme} aria-label="Toggle dark mode">
  {theme === 'dark' ? <FiSun /> : <FiMoon />}
</button>
```

> Dark mode styles are in CSS only. Use `[data-theme="dark"]` selector in your `.css` files. Never write JavaScript to change colors.

---

### useLanguage — Translations
```jsx
import { useLanguage } from '@/context/LanguageContext'

const { lang, setLang, t } = useLanguage()
```

| Value | Type | Description |
|-------|------|-------------|
| `lang` | `string` | `'en'` or `'ar'` |
| `setLang(code)` | `function` | Change language, sets RTL direction automatically |
| `t(key)` | `function` | Returns translated string, falls back to English, then to key itself |

**Common patterns:**
```jsx
// Translate any UI string
const { t } = useLanguage()
<button>{t('btn.addToCart')}</button>     // "Add to Cart" or "أضف إلى السلة"
<p>{t('cart.empty')}</p>

// Language switcher
const { lang, setLang } = useLanguage()
import { LANGUAGES } from '@/utils/constants'
{LANGUAGES.map(l => (
  <button key={l.code} onClick={() => setLang(l.code)}>{l.label}</button>
))}
```

> All translation keys are in `src/data/translations.json`. If a key doesn't exist, `t()` returns the key string — it never crashes.

---

### useWishlist — Saved Items
```jsx
import { useWishlist } from '@/context/WishlistContext'

const { wishlist, addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
```

| Value | Type | Description |
|-------|------|-------------|
| `wishlist` | `array` | Array of saved watch objects |
| `addToWishlist(watch)` | `function` | Add full watch object |
| `removeFromWishlist(id)` | `function` | Remove by `_id` |
| `isWishlisted(id)` | `function` | Returns `true/false` — use for heart icon state |

**Common patterns:**
```jsx
// Heart toggle button in ProductCard
const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
const saved = isWishlisted(watch._id)
<button onClick={() => saved ? removeFromWishlist(watch._id) : addToWishlist(watch)}>
  {saved ? <FiHeart fill="currentColor" /> : <FiHeart />}
</button>

// Wishlist page
const { wishlist } = useWishlist()
{wishlist.length === 0 ? <EmptyState title="No saved items" /> : wishlist.map(...)}
```

---

## 6. Services Reference

All services have mock and real implementations. `USE_MOCK=true` in `.env` means mock JSON is used. Never call axios directly — always go through a service.

```jsx
// CORRECT
import { watchService } from '@/services/watchService'
const watches = await watchService.getAll()

// WRONG — never do this
import axios from 'axios'
const watches = await axios.get('/watches')
```

---

### watchService
```jsx
import { watchService } from '@/services/watchService'
```

| Method | Arguments | Returns | Used by |
|--------|-----------|---------|---------|
| `getAll(filters?)` | `{ category, search, sort }` | `Promise<Watch[]>` | Shop loaders, useWatches hook |
| `getById(id)` | `string` | `Promise<Watch>` | ProductDetail loader |
| `create(data)` | `object` | `Promise<Watch>` | Admin ManageProducts |
| `update(id, data)` | `string, object` | `Promise<Watch>` | Admin ManageProducts |
| `remove(id)` | `string` | `Promise<{id}>` | Admin ManageProducts |

---

### authService
```jsx
import { authService } from '@/services/authService'
// Note: AuthContext already calls this internally.
// You call useAuth() hooks, not authService directly.
// Only call authService directly for forgot/reset password pages.
```

| Method | Arguments | Returns |
|--------|-----------|---------|
| `login(data)` | `{ email, password }` | `{ user, token }` |
| `register(data)` | `{ name, email, password }` | `{ user, token }` |
| `getMe()` | none | `User` |
| `logout()` | none | `void` |
| `forgotPassword(data)` | `{ email }` | `{ message }` |
| `resetPassword(data)` | `{ token, password }` | `{ message }` |

---

### orderService
```jsx
import { orderService } from '@/services/orderService'
```

| Method | Arguments | Returns | Used by |
|--------|-----------|---------|---------|
| `getMyOrders()` | none | `Promise<Order[]>` | profile + orders loaders |
| `getAll()` | none | `Promise<Order[]>` | admin orders loader |
| `getById(id)` | `string` | `Promise<Order>` | order detail page |
| `create(data)` | `object` | `Promise<Order>` | CheckoutPage |
| `updateStatus(id, status)` | `string, string` | `Promise` | admin ManageOrders |

```jsx
// Place an order after checkout
const order = await orderService.create({
  items: cart,
  shippingAddress: formData,
  totalPrice
})
dispatch({ type: 'CLEAR' })
navigate('/order-confirmation')

// Update status in admin
await orderService.updateStatus(orderId, ORDER_STATUS.SHIPPED)
```

---

### collectionService
```jsx
import { collectionService } from '@/services/collectionService'
```

| Method | Arguments | Returns |
|--------|-----------|---------|
| `getAll()` | none | `Promise<Collection[]>` |
| `getBySlug(slug)` | `string` | `Promise<Collection>` |

---

## 7. Hooks Reference

---

### useScrollDirection — Header hide/show — COMPLETE
```jsx
import { useScrollDirection } from '@/hooks/useScrollDirection'
const { scrollY, isHidden } = useScrollDirection()
```

---

### useScrollPosition — Scroll depth only — COMPLETE
```jsx
import { useScrollPosition } from '@/hooks/useScrollPosition'
const scrollY = useScrollPosition()
```

---

### useDebounce — Delay fast-changing values
**Status: stub file exists — Dev 4 must implement**

```jsx
import useDebounce from '@/hooks/useDebounce'

const debouncedSearch = useDebounce(searchValue, 400)

useEffect(() => {
  watchService.getAll({ search: debouncedSearch })
}, [debouncedSearch])
```

**Implementation Dev 4 needs to write:**
```jsx
import { useState, useEffect } from 'react'

export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
```

---

### useClickOutside — Close on outside click
**Status: stub file exists — Dev 3 must implement**

```jsx
import useClickOutside from '@/hooks/useClickOutside'

const panelRef = useRef(null)
useClickOutside(panelRef, () => setIsOpen(false))
return <div ref={panelRef}>...</div>
```

**Implementation Dev 3 needs to write:**
```jsx
import { useEffect } from 'react'

export default function useClickOutside(ref, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, callback])
}
```

---

### useMediaQuery — Responsive JavaScript
**Status: stub file exists — Dev 5 must implement**

```jsx
import useMediaQuery from '@/hooks/useMediaQuery'

const isMobile = useMediaQuery('(max-width: 768px)')
if (isMobile) return <MobileMenu />
```

**Implementation Dev 5 needs to write:**
```jsx
import { useState, useEffect } from 'react'

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}
```

---

## 8. Utils Reference

---

### cn — Conditional class names
```jsx
import { cn } from '@/utils/cn'

cn('btn', isActive && 'btn--active', isDisabled && 'btn--disabled')
// → "btn btn--active"
```

---

### formatters
```jsx
import { formatPrice, formatDate, formatRelativeTime, truncateText, slugify } from '@/utils/formatters'

// Note: for prices, use useCurrency().formatPrice() instead — it knows the selected currency
formatPrice(1299, 'USD')           // "$1,299"
formatDate('2024-12-01')           // "December 1, 2024"
formatRelativeTime('2024-12-01')   // "Today" / "Yesterday" / "3 days ago"
truncateText(description, 120)     // "Crafted from the finest Swiss..." + "..."
slugify('Chrono Elite')            // "chrono-elite"
```

---

### constants
```jsx
import {
  CATEGORIES,      // [{ value: 'all', label: 'All' }, { value: 'luxury', label: 'Luxury' }, ...]
  SORT_OPTIONS,    // [{ value: 'default', label: 'Default' }, ...]
  ORDER_STATUS,    // { PENDING: 'pending', CONFIRMED: 'confirmed', SHIPPED: 'shipped', ... }
  CURRENCIES,      // [{ code: 'USD', symbol: '$', label: 'US Dollar' }, ...]
  LANGUAGES,       // [{ code: 'en', label: 'English', dir: 'ltr' }, ...]
  USER_ROLES,      // { USER: 'user', ADMIN: 'admin' }
} from '@/utils/constants'
```

Never hardcode these strings directly. Use the constants.

---

### validators (Yup schemas with React Hook Form)
```jsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema, registerSchema, shippingSchema, reviewSchema, contactSchema } from '@/utils/validators'

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(loginSchema)
})

<input {...register('email')} />
{errors.email && <span className="form__error">{errors.email.message}</span>}
```

| Schema | Used in | Fields |
|--------|---------|--------|
| `loginSchema` | LoginPage | email, password |
| `registerSchema` | RegisterPage | name, email, password, confirmPassword |
| `shippingSchema` | ShippingForm | fullName, email, phone, street, city, country, zip |
| `reviewSchema` | ReviewForm | rating (1-5), comment (min 10 chars) |
| `contactSchema` | ContactPage | name, email, subject, message (min 20 chars) |

---

## 9. CSS Rules

### The Three File Types — never mix them

| File | Contains | Rule |
|------|----------|------|
| `styles/variables.css` | CSS custom properties only | `:root { --var: value }` — no actual styles |
| `styles/index.css` | Global base styles only | Reset, body, headings — nothing component-specific |
| `styles/animations.css` | `@keyframes` only | shimmer, fadeIn, slideUp, spin, pulse |
| `ComponentName.css` | That component only | Never reference another component's class |

### Available CSS Variables — use these, never hardcode colors
```css
/* Colors */
--color-gold: #c9a84c
--color-gold-light: #e8c97a
--color-brass: #b5925f
--color-dark: #0d1b2a
--color-surface: #f8f0e5
--color-muted: #8a8378
--color-border: rgba(201, 168, 76, 0.3)
--color-white: #ffffff
--color-error: #c0392b
--color-success: #1d9e75

/* Fonts */
--font-display: 'Cormorant Garamond', serif
--font-body: 'Inter', sans-serif
--font-mono: 'IBM Plex Mono', monospace

/* Spacing */
--space-xs: 4px   --space-sm: 8px   --space-md: 16px
--space-lg: 24px  --space-xl: 48px  --space-2xl: 96px

/* Transitions */
--transition-fast: 120ms ease
--transition-normal: 220ms ease
--transition-slow: 420ms ease

/* Border radius */
--radius-sm: 4px   --radius-md: 8px   --radius-lg: 14px
--radius-xl: 22px  --radius-full: 9999px

/* Z-index */
--z-base: 1   --z-dropdown: 100   --z-sticky: 200
--z-modal: 1000   --z-toast: 1100   --z-cursor: 1200
```

### Dark mode — CSS only, never JavaScript
```css
.card {
  background: var(--color-white);
  color: var(--color-dark);
}

[data-theme="dark"] .card {
  background: #152238;
}
```

### Animation utility classes (from animations.css)
```css
.skeleton          /* shimmer loading placeholder */
.anim-fade-in      /* simple opacity fade */
.anim-slide-up     /* fade + rise from below */
.badge--live       /* infinite pulse animation */
```

### Framer Motion — when to use it vs CSS
| Use Framer Motion for | Use CSS for |
|-----------------------|-------------|
| Exit/unmount animations | Hover state transitions |
| Page transitions | Loading bar |
| Stagger animations on lists | Simple fade-ins |
| Cart offcanvas slide-in | Skeleton shimmer |
| Modal enter/exit | |

```jsx
// Every page must be wrapped in PageTransition — it already exists, just import it
import PageTransition from '@/components/common/PageTransition'

export default function ShopPage() {
  return (
    <PageTransition>
      <div className="shop-page">...</div>
    </PageTransition>
  )
}

// Card stagger animation
import { motion } from 'framer-motion'
{watches.map((watch, index) => (
  <motion.div
    key={watch._id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -6 }}
  >
    <ProductCard watch={watch} />
  </motion.div>
))}
```

---

## 10. Git Workflow

### Branch naming
```
feature/shop-product       ← Dev 2
feature/cart-checkout      ← Dev 3
feature/auth-account-ui    ← Dev 4
feature/content-features   ← Dev 5
```

### Daily workflow
```powershell
# Start of day — get latest changes from develop
git checkout develop
git pull origin develop
git checkout feature/your-branch
git merge develop

# End of day — push your work
git add .
git commit -m "feat(shop): add ProductCard with Framer Motion stagger"
git push origin feature/your-branch
```

### Commit message format
```
feat(scope): short description       ← new feature
fix(scope): short description        ← bug fix
style(scope): short description      ← CSS only changes
refactor(scope): short description   ← code change, no new feature
```

### PR rules
- Never push directly to `main` or `develop`
- Open a PR → get at least 1 review → merge
- Delete your feature branch after merge
- If you're blocked by a merge conflict in a shared file, ping Dev 1

### Files — who touches what
| File | Owner | Ask before touching |
|------|-------|---------------------|
| `routes/index.jsx` | Dev 1 | Yes — always |
| `styles/variables.css` | Dev 1 | Yes — always |
| `utils/constants.js` | Dev 1 | Yes — always |
| `components/common/*` | Dev 1 (stubs done) / assigned devs (real implementations) | Yes — ping in group chat |
| `context/*` | Dev 1 | Yes — always |
| `services/*` | Dev 1 | Yes — always |
| `main.jsx` | Dev 1 | Yes — always |

---

## 11. Dev Assignments (Parallel)

All devs start simultaneously on **Day 1**. No waiting.

> **Before you start:** pull from `develop`. All common components and hook stub files already exist — do not create them yourself.

---

### Dev 2 — Shop & Product
**Branch:** `feature/shop-product`

**Priority order:**
1. `hooks/useWatches.js` — needed by multiple components
2. `components/product/ProductCard.jsx`
3. `components/product/ProductGrid.jsx`
4. `components/product/ProductFilter.jsx`
5. `pages/shop/ShopPage.jsx`
6. `pages/product/ProductDetailPage.jsx`
7. `pages/shop/ShopMenPage.jsx` + `ShopWomenPage.jsx`
8. `components/product/ProductImageGallery.jsx`
9. `components/product/ReviewCard.jsx` + `ReviewForm.jsx`
10. `pages/admin/ManageProducts.jsx`
11. `pages/admin/AdminDashboard.jsx`
12. **Replace stub:** `components/common/SkeletonCard.jsx` — implement the real shimmer version

> `SkeletonCard` and `StarRating` stubs already exist and work. Build your other components first, then come back and do the real SkeletonCard when you have time.

**Key patterns for Dev 2:**
```jsx
// Reading loader data — no useState, no useEffect for data fetching
import { useLoaderData } from 'react-router-dom'
const watches = useLoaderData()

// useWatches hook — for components that can't use useLoaderData
import { useState, useEffect } from 'react'
import { watchService } from '@/services/watchService'

export function useWatches(filters = {}) {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    watchService.getAll(filters).then(setWatches).finally(() => setLoading(false))
  }, [JSON.stringify(filters)])
  return { watches, loading }
}

// Updating URL params in ProductFilter
import { useSearchParams } from 'react-router-dom'
const [searchParams, setSearchParams] = useSearchParams()
const setCategory = (value) => {
  setSearchParams(prev => { prev.set('category', value); return prev })
}
```

---

### Dev 3 — Cart & Checkout
**Branch:** `feature/cart-checkout`

**Priority order:**
1. **Implement** `hooks/useClickOutside.js` — stub file exists, write the logic (code is in Section 7)
2. `components/cart/CartItem.jsx`
3. `components/cart/CartSummary.jsx`
4. `components/cart/CartOffcanvas.jsx`
5. `pages/cart/CartPage.jsx`
6. `components/checkout/CheckoutSteps.jsx`
7. `components/checkout/ShippingForm.jsx`
8. `components/checkout/PaymentForm.jsx`
9. `components/checkout/OrderReview.jsx`
10. `pages/cart/CheckoutPage.jsx`
11. `pages/cart/OrderConfirmationPage.jsx`
12. `pages/admin/ManageOrders.jsx`
13. **Replace stub:** `components/common/EmptyState.jsx` — implement the real version
14. **Replace stub:** `components/common/Loader.jsx` — implement the real version
15. **Replace stub:** `components/common/Modal.jsx` — implement the real version

> The stubs for EmptyState, Loader, and Modal are already there and won't crash your work. Build your cart/checkout pages first, then come back and do the real component implementations.

**Real implementations to write:**

```jsx
// src/components/common/EmptyState.jsx
export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  )
}

// src/components/common/Loader.jsx
export default function Loader({ size = 'md' }) {
  return <div className={`loader loader--${size}`} aria-label="Loading" />
}

// src/components/common/Modal.jsx
import { useEffect } from 'react'
export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal__title">{title}</h2>}
        <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  )
}
```

**Key patterns for Dev 3:**
```jsx
// Stripe setup in CheckoutPage
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)
<Elements stripe={stripePromise}><PaymentForm /></Elements>

// After order placed successfully
dispatch({ type: 'CLEAR' })
navigate('/order-confirmation', { state: { order } })

// CartOffcanvas with AnimatePresence
import { AnimatePresence, motion } from 'framer-motion'
<AnimatePresence>
  {isOpen && (
    <motion.div
      className="cart-offcanvas"
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

---

### Dev 4 — Auth & Account
**Branch:** `feature/auth-account-ui`

**Priority order:**
1. **Implement** `hooks/useDebounce.js` — stub file exists, write the logic (code is in Section 7) — Dev 2 needs this for SearchBar
2. `pages/account/LoginPage.jsx`
3. `pages/account/RegisterPage.jsx`
4. `pages/account/ForgotPasswordPage.jsx`
5. `pages/account/ResetPasswordPage.jsx`
6. `pages/account/AccountPage.jsx`
7. `pages/account/OrderHistoryPage.jsx`
8. `pages/account/WishlistPage.jsx`
9. `styles/AuthPage.css` ← shared by all 4 auth pages
10. **Replace stub:** `components/common/Badge.jsx` — implement the real version
11. `components/common/Toast.jsx` ← this one does not exist yet, build it from scratch

> Button, StarRating, and PageTransition are already fully done by Dev 1 — do not rebuild them. Your common component focus is Badge and Toast only.

**Key patterns for Dev 4:**
```jsx
// Login form — full pattern
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/utils/validators'
import { useAuth } from '@/context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(location.state?.from?.pathname || '/')
    } catch {
      toast.error('Invalid email or password')
    }
  }

  return (
    <PageTransition>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
        <input {...register('password')} type="password" placeholder="Password" />
        {errors.password && <span>{errors.password.message}</span>}
        <Button type="submit" isLoading={isSubmitting}>Sign In</Button>
      </form>
    </PageTransition>
  )
}

// Account and OrderHistory pages use useLoaderData
import { useLoaderData } from 'react-router-dom'
const orders = useLoaderData()
```

---

### Dev 5 — Content, Features & Footer
**Branch:** `feature/content-features`

**Priority order:**
1. **Implement** `hooks/useMediaQuery.js` — stub file exists, write the logic (code is in Section 7)
2. `components/layout/MobileMenu.jsx + .css`
3. `components/layout/Footer.jsx` (full — stub exists)
4. `components/features/DarkModeToggle.jsx`
5. `components/features/CurrencySwitcher.jsx`
6. `components/features/SearchBar.jsx` (needs useDebounce from Dev 4 — import it, it'll work once Dev 4 pushes)
7. `pages/info/ErrorPage.jsx` ← uses useRouteError(), important
8. `pages/info/NotFoundPage.jsx`
9. `pages/info/CollectionsPage.jsx`
10. `pages/info/AboutPage.jsx`
11. `pages/info/FaqPage.jsx`
12. `pages/info/ContactPage.jsx`
13. `pages/info/GiftingPage.jsx`
14. `pages/quiz/WatchQuizPage.jsx`
15. `pages/configurator/ConfiguratorPage.jsx`
16. `components/features/FluidCursor.jsx`
17. `components/features/EmailCaptureModal.jsx`
18. All remaining info pages (TermsPage, PrivacyPolicyPage, SizeGuidePage, GiftRegistryPage)

**Key patterns for Dev 5:**
```jsx
// ErrorPage — must use useRouteError, not props
import { useRouteError, Link } from 'react-router-dom'
export default function ErrorPage() {
  const error = useRouteError()
  const is404 = error?.status === 404
  return (
    <PageTransition>
      <div className="error-page">
        <h1>{is404 ? '404' : 'Something went wrong'}</h1>
        <p>{is404 ? 'Page not found' : error?.message}</p>
        <Link to="/">Go home</Link>
      </div>
    </PageTransition>
  )
}

// Quiz scoring
const calculateResult = (answers) => {
  const totals = { luxury: 0, sport: 0, classic: 0, smart: 0 }
  answers.forEach(answer => {
    Object.entries(answer.scores).forEach(([cat, pts]) => { totals[cat] += pts })
  })
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]
}

// MobileMenu with AnimatePresence
import { AnimatePresence, motion } from 'framer-motion'
<AnimatePresence>
  {isOpen && (
    <motion.nav
      initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.35 }}
      className="mobile-menu"
    >
      ...
    </motion.nav>
  )}
</AnimatePresence>
```

---

## Common Mistakes to Avoid

```jsx
// ❌ WRONG — direct axios call
const res = await axios.get('/watches')
// ✅ CORRECT
const watches = await watchService.getAll()

// ❌ WRONG — relative import
import Button from '../../../components/common/Button'
// ✅ CORRECT
import Button from '@/components/common/Button'

// ❌ WRONG — useState for cart
const [cart, setCart] = useState([])
// ✅ CORRECT
const { cart, dispatch } = useCart()

// ❌ WRONG — hardcoded string
if (user.role === 'admin')
// ✅ CORRECT
if (user.role === USER_ROLES.ADMIN)

// ❌ WRONG — no PageTransition wrapper
export default function ShopPage() {
  return <div>...</div>
}
// ✅ CORRECT
export default function ShopPage() {
  return <PageTransition><div>...</div></PageTransition>
}

// ❌ WRONG — format price manually
<span>${watch.price}</span>
// ✅ CORRECT
const { formatPrice } = useCurrency()
<span>{formatPrice(watch.price)}</span>

// ❌ WRONG — rebuilding a common component that already exists
// creating your own Button.jsx or PageTransition.jsx in your branch
// ✅ CORRECT — just import from @/components/common/
import Button from '@/components/common/Button'
import PageTransition from '@/components/common/PageTransition'
```
