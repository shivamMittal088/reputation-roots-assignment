<div align="center">

# 🛍️ Micro Marketplace

### Discover premium products. Build your collection. Share your favorites.

### 🌐 [Live Demo](https://reputation-roots-assignment-5nsq-henjxe7ie.vercel.app)

[![Frontend](https://img.shields.io/badge/Frontend-Live-success?logo=vercel)](https://reputation-roots-assignment-5nsq-henjxe7ie.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Live-success?logo=vercel)](https://reputation-roots-assignment-osl9une1d.vercel.app)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-111111?logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-EF4444?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 💡 What is Micro Marketplace?

Micro Marketplace is a modern, production-ready e-commerce platform built with cutting-edge technologies. It features a clean architecture, performant UI, and scalable backend APIs for product discovery, favorites management, and intelligent search with recent history tracking.

Built with best practices like React.memo optimization, cursor-based pagination, inline route handlers, and mobile-first responsive design.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based auth with bcrypt password hashing, register/login/logout flows |
| 🛒 **Product Management** | Full CRUD operations with multi-image support (up to 4 additional images) |
| ❤️ **Favorites System** | Add/remove favorites with DB persistence and deduplication logic |
| 🔍 **Smart Search** | Real-time product search with suggestions, recent searches (max 8), localStorage fallback |
| 📱 **Responsive Design** | Mobile-first with 2-col mobile, 4-col desktop grid, compact cards |
| 📄 **Pagination** | Offset-based pagination with configurable page size (default 8)

## 🛠️ Tech Stack

### Backend

| Layer | Technology |
|:------|:-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Language | JavaScript (CommonJS) |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Validation | express-validator |
| Security | CORS + express middleware |

### Frontend

| Layer | Technology |
|:------|:-----------|
| Framework | React 19.2.0 |
| Language | TypeScript 5.9.3 |
| Routing | React Router 7.13.0 |
| Styling | Tailwind CSS 4.2.0 |
| Build Tool | Vite 7.3.1 |
| HTTP Client | Axios 1.13.5 |
| Icons | lucide-react 0.575.0 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 4.4+
- npm or pnpm

### 1) Clone Repository

```bash
git clone <repository-url>
cd "Reputation Roots"
```

### 2) Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `backend/`:

```env
PORT=5002
MONGODB_URI=<your-mongoDB url -here>
JWT_SECRET=your-<your-secret-here>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Seed Database:**

```bash
npm run seed
```

**Start Backend:**

```bash
npm run dev
```

Backend runs at: `http://localhost:5002`

### 3) Frontend Setup

```bash
cd ../web
npm install
```

Create `.env` in `web/`:

```env
VITE_API_URL=http://localhost:5002
```

**Start Frontend:**

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 4) Test Credentials

After seeding, use these accounts:

**Seller Account:**
- Email: `seller@example.com`
- Password: `password123`

**Buyer Account:**
- Email: `buyer@example.com`
- Password: `password123`

---

## 🔌 API Documentation

### Authentication

<table align="center" border="1" cellpadding="8" cellspacing="0" width="100%">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>POST</code></td><td><code>/auth/register</code></td><td>Register new user</td></tr>
    <tr><td><code>POST</code></td><td><code>/auth/login</code></td><td>Authenticate user session</td></tr>
  </tbody>
</table>

### Products

<table align="center" border="1" cellpadding="8" cellspacing="0" width="100%">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>GET</code></td><td><code>/products</code></td><td>List products with pagination & search (query: page, limit, q)</td></tr>
    <tr><td><code>GET</code></td><td><code>/products/:id</code></td><td>Get single product details</td></tr>
    <tr><td><code>GET</code></td><td><code>/products/mine/favorites</code></td><td>Get user's favorite products (primary)</td></tr>
    <tr><td><code>GET</code></td><td><code>/products/favorites</code></td><td>Get favorites (fallback route)</td></tr>
    <tr><td><code>POST</code></td><td><code>/products/:id/favorite</code></td><td>Add product to favorites</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/products/:id/favorite</code></td><td>Remove product from favorites</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/products/favorites</code></td><td>Clear all favorites</td></tr>
  </tbody>
</table>

### Search

<table align="center" border="1" cellpadding="8" cellspacing="0" width="100%">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>GET</code></td><td><code>/search/recent-searches</code></td><td>Get user's recent searches (max 8)</td></tr>
    <tr><td><code>POST</code></td><td><code>/search/recent-searches</code></td><td>Add new recent search term</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/search/recent-searches</code></td><td>Clear all recent searches</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/search/recent-searches/:term</code></td><td>Remove specific search term</td></tr>
  </tbody>
</table>

### Users

<table align="center" border="1" cellpadding="8" cellspacing="0" width="100%">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>GET</code></td><td><code>/users/me</code></td><td>Get current user profile</td></tr>
  </tbody>
</table>

---

## 📁 Project Structure

```
Reputation Roots/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication middleware
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── validate.js          # express-validator wrapper
│   │   ├── models/
│   │   │   ├── Product.js           # Product schema (with images array)
│   │   │   └── User.js              # User schema (with favorites & recentSearches)
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints (register, login)
│   │   │   ├── productRoutes.js     # Product CRUD + favorites
│   │   │   ├── searchRoutes.js      # Recent searches management
│   │   │   └── userRoutes.js        # User profile endpoint
│   │   ├── app.js                   # Express app setup
│   │   ├── server.js                # Server entry point
│   │   └── seed.js                  # Database seeding script
│   ├── .env
│   └── package.json
│
├── web/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx        # Dark theme login/signup toggle
│   │   │   ├── RegisterPage.tsx     # Registration with icons
│   │   │   ├── ProductsPage.tsx     # Main listing with stats
│   │   │   └── ProductDetailPage.tsx # Product details with gallery
│   │   ├── ui/
│   │   │   ├── Header.tsx           # Navigation with auth UI
│   │   │   ├── SearchBar.tsx        # Search with suggestions & recent
│   │   │   ├── ProductCard.tsx      # Memoized product card
│   │   │   └── ShimmerCard.tsx      # Loading skeleton
│   │   ├── state/
│   │   │   ├── AuthContext.tsx      # Auth state management
│   │   │   ├── ToastProvider.tsx    # Toast notifications with icons
│   │   │   ├── useAuth.ts           # Auth hook
│   │   │   └── useToast.ts          # Toast hook
│   │   ├── api.ts                   # API request utilities
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # App entry point
│   │   └── index.css                # Global styles + animations
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🎨 UI Components

### SearchBar Component

Extracted for code splitting:
- Search input with lucide-react Search icon
- Real-time product suggestions with Tag icons
- Recent searches with Clock icon header
- Per-item deletion with X icons
- Clear all button
- 20% opacity overlay on focus

### ProductCard Component

Memoized for performance:
- Compact design (h-32 sm:h-40)
- Gradient "Premium" badge
- Heart favorite button with animation
- Hover scale effects
- Gradient price text

### Header Component

- ShoppingBag logo icon
- SearchBar integration
- User icon with name
- LogOut button with icon
- Conditional login/register links

---

## 🔒 Authentication Flow

1. **Register**: User signs up with name, email, password
2. **Login**: JWT token generated and stored in httpOnly cookie
3. **Protected Routes**: `auth` middleware validates token from cookies
4. **Token Expiry**: Default 7 days (configurable via `JWT_EXPIRES_IN`)
5. **Password Security**: bcryptjs hashing with salt rounds

---

## 📊 Database Schema

### User Model

```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  passwordHash: String (required),
  favorites: [ObjectId] (default: []),
  recentSearches: [String] (default: [], max: 8),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model

```javascript
{
  title: String (required, trimmed),
  description: String (required),
  price: Number (required, min: 0),
  image: String (required, URL),
  images: [String] (default: [], max: 4 URLs),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚡ Performance Optimizations

1. **React.memo**: ProductCard components only re-render when props change
2. **useCallback**: Event handlers memoized to prevent recreation
3. **Lazy Loading**: Component-level code splitting with SearchBar
4. **Debounced Search**: 250ms delay for product suggestions
5. **Pagination**: Only load 8 products per page
6. **localStorage Cache**: Recent searches cached locally with DB sync
