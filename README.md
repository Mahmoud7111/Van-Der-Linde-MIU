# 🕰️ Van Der Linde

A luxury watch e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 📑 Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Features](#features)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [API Endpoints](#api-endpoints)
* [Chatbot](#chatbot)
* [Contributing](#contributing)

---

## 🌟 Overview

Van Der Linde is a full-stack web application for a luxury watch retailer. It provides a complete shopping experience, from browsing a curated catalog of high-end timepieces to managing orders through an admin dashboard.

The platform supports bilingual content (English and Arabic), dark/light theme switching, multi-currency display, a custom watch configurator, and a built-in customer chatbot.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, React Router, Framer Motion, React Hook Form, Yup, React Icons
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer, Nodemailer
* **Utilities:** Brevo (Sendinblue) SMTP for transactional emails

---

## ✨ Features

* **🔐 Authentication & Authorization:** JWT-based authentication with role-based access control (User & Admin). Includes registration, login, logout, password reset, and profile management.
* **🛍️ Product Catalog:** Browse watches by brand, collection, category, gender, and price. Dynamic filtering, sorting, and search.
* **🛒 Shopping Cart & Wishlist:** Persistent cart and wishlist for logged-in users, stored in MongoDB.
* **💳 Checkout:** Multi-step checkout (shipping, payment, review) supporting local card validation (Luhn check) and Cash on Delivery (COD).
* **📦 Order Management:** Order history for users, order status tracking, and admin order management.
* **⭐ Reviews:** Logged-in users can leave ratings and reviews on products.
* **⌚ Watch Configurator:** Users can customize watch specs (model, case, bezel, dial, strap) and submit a request quote. Admin receives an email notification.
* **🤖 Chatbot:** A built-in customer support chatbot that answers FAQs and helps find watches in the catalog based on keywords, budget, and style.
* **🧑‍💼 Admin Dashboard:** Protected admin routes for managing products, collections, brands, orders, and user reviews.
* **🌐 Localization:** Bilingual support (English & Arabic) with text direction (LTR/RTL) and translation context.
* **🌙 Theming:** Dark and light mode support.
* **💱 Currency Switcher:** Frontend currency display switching.

---

## 🏗️ Architecture

The application follows a standard MERN architecture:

```txt
User Interface (React/Vite)
        ↓
Frontend Services (fetch/axios)
        ↓
REST API (Express.js)
        ↓
Business Logic (Controllers & Services)
        ↓
Data Layer (Mongoose/MongoDB)
```

* **Frontend:** React SPA with Vite, React Router for navigation, and Context API for global state (Auth, Cart, Wishlist, Theme, Language, Currency).
* **Backend:** Express.js REST API with a Service-Controller pattern. Routes are mounted under `/api/`.
* **Database:** MongoDB Atlas with Mongoose ODM.

---

## 📁 Project Structure

```txt
van-der-linde/
├── app.js                          # Express app entry point
├── config/                         # DB connection, env vars, CORS
├── controllers/                    # Route handlers
├── middleware/                     # Auth, error handling, uploads, rate limiting
├── models/                         # Mongoose schemas
├── routes/                         # Express route definitions
├── services/                       # Business logic layer
├── utils/                          # Helper functions & validators
├── views/                          # React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page-level components
│   │   ├── context/                # Global state (Auth, Cart, etc.)
│   │   ├── services/               # Frontend API calls
│   │   ├── styles/                 # CSS and global variables
│   │   └── main.jsx                # Frontend entry point
│   └── package.json
└── package.json
```

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js >= 18.x
* MongoDB (local or Atlas)
* Git

### 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MahmoudSayed711/van-der-linde.git
   cd van-der-linde
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd views
   npm install
   ```

4. Start the backend:

   ```bash
   cd ..
   npm run dev
   ```

   Server runs on `http://localhost:5000`.

5. Start the frontend:

   ```bash
   cd views
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# Email (Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your_brevo_login
EMAIL_PASS=your_brevo_smtp_password
EMAIL_FROM=Van Der Linde <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

Create a `.env` file in the `views/` directory (if needed for frontend API URL):

```env
VITE_API_URL=/api
```

---

## 🔗 API Endpoints

| Endpoint                  | Description                    |
| ------------------------- | ------------------------------ |
| `POST /api/auth/register` | Register a new user            |
| `POST /api/auth/login`    | Login                          |
| `POST /api/auth/logout`   | Logout                         |
| `GET /api/watches`        | Get all watches (with filters) |
| `GET /api/watches/:id`    | Get single watch               |
| `GET /api/collections`    | Get all collections            |
| `GET /api/brands`         | Get all brands                 |
| `POST /api/cart`          | Add to cart                    |
| `GET /api/cart`           | Get user cart                  |
| `POST /api/wishlist`      | Add to wishlist                |
| `GET /api/wishlist`       | Get user wishlist              |
| `POST /api/orders`        | Create order                   |
| `GET /api/orders/mine`    | Get my orders                  |
| `GET /api/orders`         | Get all orders (Admin)         |
| `POST /api/reviews`       | Submit a review                |
| `POST /api/configurator`  | Submit configurator request    |
| `POST /api/chatbot`       | Send message to chatbot        |
| `GET /api/admin/...`      | Admin protected routes         |

---

## 🤖 Chatbot

The chatbot is a backend-driven support assistant. It does not use external AI. Instead, it uses keyword matching and database queries to answer customer questions.

* **📌 FAQ Replies:** Answers common questions about shipping, returns, warranty, sizing, payment, and more.
* **🔎 Catalog Search:** Helps users find watches by brand, category, gender, or budget.
* **🧭 Fallback:** Provides general guidance if no specific match is found.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please ensure your code follows the existing project structure and conventions.
