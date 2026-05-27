# Van Der Linde

A luxury watch e-commerce platform built with React + Vite and Node.js + Express + MongoDB.

---

## Tech Stack

**Frontend** — React 18, Vite, React Router v6, Framer Motion, Axios, React Hook Form + Yup

**Backend** — Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer, Stripe

---

## Getting Started

### Prerequisites
- Node.js ≥ 18.x
- Git

### Installation

```bash
git clone https://github.com/your-org/van-der-linde.git
cd van-der-linde
npm run install:all
```

### Environment Variables

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=true
VITE_STRIPE_PK=pk_test_replace_when_ready
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/van-der-linde
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
STRIPE_SECRET_KEY=sk_test_replace_when_ready
CLIENT_URL=http://localhost:5173
```

> Set `VITE_USE_MOCK=true` to run the frontend with local JSON data — no backend required.

### Run

```bash
# Full stack
npm run dev

# Frontend only — http://localhost:5173
cd client && npm run dev

# Backend only — http://localhost:5000
cd server && npm run dev
```

---

## Project Structure

```
van-der-linde/
├── client/
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/     # UI components
│       ├── context/        # Global state (Auth, Cart, Wishlist, Theme, Currency, Language)
│       ├── data/           # Mock JSON data
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Route-level page components
│       ├── routes/         # React Router config
│       ├── services/       # API abstraction layer
│       ├── styles/         # Global CSS and variables
│       └── utils/          # Helpers, constants, validators
└── server/
    ├── config/             # Database connection
    ├── controllers/        # Route handler logic
    ├── middleware/         # Auth, error handling, file upload
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    └── server.js           # Entry point
```

---

## Team & Branches

| Dev | Domain | Branch |
|-----|--------|--------|
| Dev 1 | Foundation, Layout, Home | `develop` |
| Dev 2 | Shop & Product | `feature/shop-product` |
| Dev 3 | Cart & Checkout | `feature/cart-checkout` |
| Dev 4 | Auth, Account & Common UI | `feature/auth-account-ui` |
| Dev 5 | Content, Features & Mobile | `feature/content-features` |

---

## Git Workflow

```bash
# Start of day
git checkout develop && git pull origin develop
git checkout feature/your-branch && git merge develop

# End of day
git add .
git commit -m "feat(scope): description"
git push origin feature/your-branch
```

**Commit types:** `feat` `fix` `style` `refactor`

PRs go from feature branch → `develop`. Minimum 1 review required. Never push directly to `main` or `develop`.

---

## License

Private — all rights reserved.
