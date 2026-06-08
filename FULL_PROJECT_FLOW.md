# Van Der Linde Full Project Flow

This document explains the full website flow from the smallest shared features to the biggest end-to-end flows. It also shows how the frontend, backend, database, email service, and deployment/cloud operations connect.

## 1. High-Level Architecture

The project is a MERN-style app:

- Frontend: React/Vite inside `views/`
- Backend: Express app from `app.js`
- Database: MongoDB Atlas through Mongoose models
- Email: Nodemailer SMTP through Brevo
- API prefix: every backend endpoint starts with `/api`
- Frontend API calls: frontend services call `/api/...`, and Vite/backend deployment route those requests to Express

Flow:

```txt
User browser
  -> React page/component
  -> React context or frontend service
  -> fetch/HTTP request to /api/...
  -> Express route
  -> Controller
  -> Service
  -> Mongoose model
  -> MongoDB Atlas
  -> response back to React
  -> UI updates
```

## 2. Backend Startup Flow

Backend starts from `app.js`.

```txt
npm run dev
  -> nodemon app.js
  -> dotenv loads .env
  -> Express app is created
  -> helmet/cors/json/cookie/morgan middleware are applied
  -> /api/health route is mounted
  -> /api routes/index.js is mounted
  -> errorHandler is mounted last
  -> connectDB() connects to MongoDB Atlas
  -> app.listen(PORT)
```

Important backend files:

- `app.js`: app startup and middleware
- `config/db.js`: MongoDB connection
- `config/env.js`: environment variables
- `config/cors.js`: allowed frontend origins
- `routes/index.js`: combines all route files
- `middleware/errorHandler.js`: final error response handler

## 3. Frontend Startup Flow

Frontend starts from `views/src/main.jsx`.

```txt
npm run dev inside views/
  -> Vite starts React
  -> main.jsx renders the app
  -> providers wrap the routes
  -> React Router loads route components
  -> route loaders call frontend services
  -> services call backend /api endpoints
```

Important frontend folders:

- `views/src/pages`: page screens
- `views/src/components`: reusable UI
- `views/src/context`: global state like auth, cart, wishlist, language, currency, theme
- `views/src/services`: API calls to backend
- `views/src/routes`: React Router route map
- `views/src/data/translations.json`: English/Arabic translations

## 4. Shared UI Features

### Theme: Dark Mode and Light Mode

Frontend flow:

```txt
Theme switch button
  -> ThemeContext updates theme state
  -> theme is saved/restored
  -> document/CSS classes or variables change
  -> all components receive new colors through CSS variables
```

Why it matters:

- It is a pure frontend feature.
- It should not save to MongoDB unless you want each logged-in user to keep their theme across devices.

Optional backend improvement:

```txt
PATCH /api/users/profile
body: { preferences: { theme: "dark" } }
```

### Translation: English and Arabic

Frontend flow:

```txt
LanguageSwitcher
  -> LanguageContext.setLang("en" or "ar")
  -> localStorage saves selected language
  -> <html lang="..."> and dir="ltr/rtl" update
  -> components call t("translation.key")
  -> UI text changes
```

Important files:

- `views/src/context/LanguageContext.jsx`
- `views/src/data/translations.json`
- `views/src/components/features/LanguageSwitcher.jsx`

Dynamic data note:

Watch names, collection names, collection descriptions, testimonials, and some admin data come from MongoDB or JSON data. To translate those fully, the data itself needs fields like:

```js
name: { en: "Heritage", ar: "التراث" }
description: { en: "...", ar: "..." }
```

### Currency

Frontend flow:

```txt
Currency selector
  -> CurrencyContext changes currency
  -> formatPrice(price) converts/displays price
  -> product cards, cart, checkout, wishlist update
```

Current behavior is frontend display logic. If real exchange rates are needed, add a backend or external rates service.

## 5. Authentication Flow

Pages:

- `/login`
- `/register`
- `/account`
- `/forgot-password`
- `/reset-password`

Backend routes:

- `authRoutes.js`
- `userRoutes.js`

Models:

- `User.js`
- `PasswordToken.js`

Login flow:

```txt
User fills login form
  -> LoginPage calls AuthContext.login()
  -> authService sends POST /api/auth/login
  -> backend validates credentials
  -> backend creates token/session
  -> frontend stores user state
  -> user redirects to previous page or account
```

Register flow:

```txt
User fills register form
  -> RegisterPage calls AuthContext.register()
  -> POST /api/auth/register
  -> backend creates User document
  -> frontend receives logged-in user
  -> redirect to /account
```

Profile edit flow:

```txt
User edits profile in AccountPage
  -> AuthContext.updateProfile()
  -> frontend service sends profile update
  -> backend user controller/service validates fields
  -> User document updates in MongoDB
  -> frontend user state refreshes
```

## 6. Catalog Flow: Brands, Collections, Watches

Backend routes:

- `brandRoutes.js`
- `collectionRoutes.js`
- `watchRoutes.js`

Models:

- `Brand.js`
- `Collection.js`
- `Watch.js`

Shop flow:

```txt
User opens /shop
  -> React Router loader calls watchService.getAll(filters)
  -> GET /api/watches?filters...
  -> backend watch route/controller/service
  -> MongoDB Watch query with filters/sort/search
  -> frontend receives watches
  -> ProductGrid renders ProductCard list
```

Product detail flow:

```txt
User opens /watch/:id
  -> route loader calls watchService.getById(id)
  -> GET /api/watches/:id
  -> backend fetches Watch
  -> ProductDetailPage renders details
```

Collections flow:

```txt
User opens /collections
  -> collectionService.getAll()
  -> GET /api/collections
  -> MongoDB Collection list
  -> CollectionsPage renders cards

User opens /collections/:slug
  -> collectionService.getBySlug(slug)
  -> watchService.getAll()
  -> CollectionDetailPage renders collection and related watches
```

## 7. Search Flow

Frontend flow:

```txt
User opens search overlay
  -> SearchOverlay fetches all watches once
  -> user types query
  -> frontend filters watches by name/brand/category
  -> grouped results display
  -> clicking item navigates to product page
```

Current search is mostly frontend filtering. For very large catalogs, move search to backend:

```txt
GET /api/watches?search=rolex
```

## 8. Cart Flow

Backend route:

- `cartRoutes.js`

Model:

- `Cart.js`

Frontend files:

- `CartContext.jsx`
- `CartPage.jsx`

Logged-in cart flow:

```txt
User clicks Add to Cart
  -> CartContext dispatch/add
  -> cartService sends request to /api/cart
  -> backend updates Cart document in MongoDB
  -> frontend normalizes backend cart items
  -> cart UI updates
```

Why this matters:

- Cart is saved in MongoDB for logged-in users.
- If user opens another laptop after pull/deploy, cart appears because backend data persists.

Guest cart flow:

```txt
Guest adds product
  -> CartContext stores locally
  -> no MongoDB write
```

## 9. Wishlist Flow

Backend route:

- `wishlistRoutes.js`

Model:

- `Wishlist.js`

Frontend files:

- `WishlistContext.jsx`
- `WishlistPage.jsx`

Flow:

```txt
User clicks wishlist heart
  -> WishlistContext add/remove
  -> wishlistService sends request to /api/wishlist
  -> backend updates Wishlist document
  -> frontend receives normalized wishlist
  -> UI updates
```

## 10. Checkout and Orders Flow

Backend routes:

- `orderRoutes.js`
- `paymentRoutes.js`
- `shippingRoutes.js`

Model:

- `Order.js`

Frontend files:

- `CheckoutPage.jsx`
- `ShippingForm.jsx`
- `PaymentForm.jsx`
- `OrderReview.jsx`
- `CheckoutSteps.jsx`

Checkout flow:

```txt
User opens /checkout
  -> CheckoutPage checks CartContext
  -> Step 1: ShippingForm collects address
  -> Step 2: PaymentForm collects card or cash on delivery
  -> Step 3: OrderReview confirms data
  -> Place Order calls orderService.create()
  -> POST /api/orders
  -> backend creates Order document in MongoDB
  -> cart clears
  -> success message shown
```

Order history flow:

```txt
User opens /orders
  -> route loader calls orderService.getMyOrders()
  -> GET /api/orders/my
  -> backend returns user orders
  -> OrderHistoryPage renders table
```

Admin order flow:

```txt
Admin opens /admin/orders
  -> frontend loader calls orderService.getAll()
  -> backend checks admin role
  -> returns all orders
  -> admin can review/update statuses
```

## 11. Configurator Flow

Backend route:

- `configuratorRoutes.js`

Model:

- `ConfigurationRequest.js`

Email utility:

- `utils/emailService.js`

Frontend page:

- `ConfiguratorPage.jsx`

Flow:

```txt
User selects model/case/bezel/dial/strap
  -> React state updates preview and price
  -> user fills name/email/notes
  -> configuratorService.submit()
  -> POST /api/configurator
  -> backend saves ConfigurationRequest in MongoDB
  -> backend sends email to admin
  -> backend sends confirmation email to user
  -> frontend shows success message
```

Email env:

```txt
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-brevo-login
EMAIL_PASS=your-brevo-smtp-password
EMAIL_FROM=Van Der Linde <verified-sender-email>
ADMIN_EMAIL=real-admin-email
```

Important:

- `EMAIL_FROM` must be a verified sender in Brevo.
- `ADMIN_EMAIL` is who receives the order/request details.
- User email comes from the configurator form.

## 12. Reviews Flow

Backend routes:

- `reviewRoutes.js`
- `adminReviewRoutes.js`

Model:

- `Review.js`

Flow:

```txt
User submits review
  -> frontend sends review data
  -> backend validates user/product
  -> Review document saved
  -> product rating can be recalculated/displayed
```

Admin review flow can approve, reject, or manage reviews depending on current route/controller logic.

## 13. Chatbot Flow

Backend route:

- `chatbotRoutes.js`

Environment:

- `GEN_AI_KEY`

Flow:

```txt
User sends chatbot message
  -> frontend sends prompt to /api/chatbot
  -> backend calls AI service using GEN_AI_KEY
  -> response returns to frontend
  -> chat UI displays answer
```

## 14. Newsletter / Subscriber Flow

Backend route:

- `subscriberRoutes.js`

Model:

- `Subscriber.js`

Flow:

```txt
User enters email in newsletter/footer
  -> frontend sends email to /api/subscribers
  -> backend validates email
  -> Subscriber saved in MongoDB
```

## 15. Admin Flow

Admin pages:

- `/admin`
- `/admin/watches`
- `/admin/orders`

Backend routes:

- `adminRoutes.js`
- protected routes use auth/admin middleware

Flow:

```txt
Admin logs in
  -> AuthContext stores user
  -> AdminRoute checks user.role
  -> admin page loads dashboard data
  -> admin actions call protected backend endpoints
  -> backend middleware verifies token and admin role
  -> database updates happen
```

Admin watches flow:

```txt
Admin creates/edits/deletes watch
  -> ManageProducts form
  -> watchService create/update/delete
  -> backend watch controller/service
  -> Watch document changes in MongoDB
  -> frontend list refreshes
```

Admin orders flow:

```txt
Admin updates order status
  -> ManageOrders action
  -> orderService update
  -> backend updates Order document
  -> customer order history reflects new status
```

## 16. Cloud and Deployment Flow

### Local Development

Backend:

```txt
npm install
npm run dev
http://localhost:5000
GET /api/health
```

Frontend:

```txt
cd views
npm install
npm run dev
http://localhost:5173
```

### Environment Variables

Backend `.env`:

```txt
PORT=5000
NODE_ENV=development
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
GEN_AI_KEY=...
ADMIN_EMAIL=...
EMAIL_HOST=...
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=...
```

Frontend `.env` if needed:

```txt
VITE_API_URL=/api
```

### Deployment Options

Recommended simple split:

```txt
Frontend -> Vercel
Backend  -> Render/Railway/Fly.io
Database -> MongoDB Atlas
Email    -> Brevo SMTP
```

Cloud deployment flow:

```txt
Developer commits code
  -> GitHub receives commit
  -> Vercel builds frontend from views/
  -> backend host builds Express app from root
  -> backend environment variables are set in host dashboard
  -> MongoDB Atlas allows backend IP/network access
  -> frontend VITE_API_URL points to backend /api URL
  -> backend CORS FRONTEND_URL allows deployed frontend domain
```

Production CORS must include deployed frontend:

```txt
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

Production API examples:

```txt
GET https://your-backend-domain.com/api/health
GET https://your-backend-domain.com/api/watches
POST https://your-backend-domain.com/api/auth/login
```

## 17. Full Customer Journey

```txt
Visitor lands on Home
  -> switches language/theme/currency
  -> searches or opens Shop
  -> filters watches
  -> opens Product Detail
  -> adds to Cart/Wishlist
  -> logs in/registers
  -> checkout shipping/payment/review
  -> order saved in MongoDB
  -> user checks Order History
```

## 18. Full Configurator Journey

```txt
Visitor opens Configurator
  -> selects model/case/bezel/dial/strap
  -> sees updated preview and price
  -> fills quote form
  -> backend saves request
  -> admin receives email
  -> customer receives confirmation email
  -> request appears in MongoDB
```

## 19. Full Admin Journey

```txt
Admin logs in
  -> opens Admin Dashboard
  -> checks summary cards and activity
  -> manages catalog watches
  -> manages orders
  -> watches/orders update in MongoDB
  -> customer-facing pages reflect changes
```

## 20. Testing Flow Before Commit

Run these after each feature change:

```txt
Backend:
GET http://localhost:5000/api/health
GET http://localhost:5000/api/brands
GET http://localhost:5000/api/collections
GET http://localhost:5000/api/watches

Frontend:
cd views
npm run build
```

Manual frontend tests:

- Language switch: English -> Arabic -> English
- Theme switch: dark -> light -> dark
- Search overlay
- Shop filters
- Product detail
- Add/remove cart
- Add/remove wishlist
- Login/register/profile edit
- Checkout order creation
- Configurator email submission
- Admin dashboard/products/orders

## 21. Current Translation Completion Notes

Already translated in the current working tree:

- Navigation pieces
- Footer
- Search overlay
- Home
- Shop all / men / women
- Filters
- Product cards/details
- Cart and checkout flow
- Login/register/account/wishlist/orders
- Configurator
- Quiz
- Contact
- Collections
- Gift Registry
- Size Guide
- Not Found

Still needs a final translation/content pass:

- Long static About page content
- FAQ page
- Services page
- Gifting flow/page
- Privacy Policy page
- Terms page
- Forgot/reset password pages
- Admin pages
- Validation error messages in `utils/validators.js`
- Database-driven watch/collection/testimonial content

Do not call translation 100% complete until the remaining list is finished.
