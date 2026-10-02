# 🌿 Palvii — Our Farm to Your Home

A complete full-stack web application for **Palvii**, a farm-to-home fresh vegetable delivery business.

---

## 📋 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express.js |
| Database | MySQL + Sequelize ORM |
| Authentication | JWT + bcrypt |
| State | React Context (Auth + Cart) |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Icons | Lucide React |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MySQL** v8+ running locally
- **npm** v9+

---

## 1️⃣ MySQL Setup

Open MySQL and run:

```sql
CREATE DATABASE palvii_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 2️⃣ Backend Setup

```bash
cd backend

# Copy and edit environment variables
copy .env.example .env
# Edit .env with your MySQL credentials and JWT secret

# Install dependencies (already done if you ran setup)
npm install

# Sync database + seed initial data
npm run setup

# Start development server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

## 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies (already done if you ran setup)
npm install

# Copy env (already created)
copy .env.example .env

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 4️⃣ Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `NODE_ENV` | development / production |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default: 3306) |
| `DB_NAME` | Database name |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | **CHANGE THIS** — secret key for JWT |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d) |
| `PALVII_WHATSAPP_NUMBER` | WhatsApp number with country code (e.g. 919876543210) |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number with country code |

---

## 🔐 Default Admin Credentials

After running `npm run setup` in the backend:

| Field | Value |
|-------|-------|
| Mobile | `9999999999` |
| Email | `admin@palvii.in` |
| Password | `Admin@123` |

> ⚠️ **Change the admin password after first login in production.**

---

## 📁 Project Structure

```
Palvii/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Sequelize config
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── basket.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── trial.controller.js
│   │   │   ├── subscription.controller.js
│   │   │   ├── delivery.controller.js
│   │   │   ├── review.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT + role guards
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── index.js             # All Sequelize models
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── basket.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── trial.routes.js
│   │   │   ├── subscription.routes.js
│   │   │   ├── delivery.routes.js
│   │   │   ├── review.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── user.routes.js
│   │   ├── scripts/
│   │   │   └── setup.js             # DB sync + seed
│   │   └── app.js                   # Express app
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── logo.png                 # Replace with your actual logo
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       ├── Header.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── layouts/
    │   │   ├── MainLayout.jsx
    │   │   └── AdminLayout.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Vegetables.jsx
    │   │   ├── Baskets.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Subscriptions.jsx
    │   │   ├── About.jsx
    │   │   ├── Contact.jsx
    │   │   ├── HowItWorks.jsx
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── customer/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── MyOrders.jsx
    │   │   │   └── MySubscriptions.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProducts.jsx
    │   │       ├── AdminOrders.jsx
    │   │       ├── AdminTrialRequests.jsx
    │   │       ├── AdminCustomers.jsx
    │   │       ├── AdminDeliveries.jsx
    │   │       └── AdminReviews.jsx
    │   ├── routes/
    │   │   ├── index.jsx            # All app routes
    │   │   └── guards.jsx           # ProtectedRoute, AdminRoute
    │   ├── services/
    │   │   ├── api.js               # Axios instance
    │   │   └── index.js             # All service functions
    │   ├── utils/
    │   │   └── whatsapp.js          # WhatsApp link generator
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🗄️ Database Models

| Model | Description |
|-------|-------------|
| `User` | Customers, Admin, Delivery Partners |
| `Address` | Delivery addresses |
| `Category` | Vegetable categories |
| `Product` | Individual vegetables |
| `Basket` | Vegetable baskets |
| `BasketItem` | Products inside a basket |
| `TrialRequest` | Free trial requests (pilot) |
| `Order` | Customer orders |
| `OrderItem` | Items in an order |
| `SubscriptionPlan` | Subscription plan templates |
| `Subscription` | Customer subscriptions |
| `Delivery` | Delivery records per order |
| `Review` | Customer feedback |

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me         (protected)
PUT  /api/auth/change-password (protected)
```

### Products
```
GET    /api/products               (public)
GET    /api/products/:id           (public)
POST   /api/products               (admin)
PUT    /api/products/:id           (admin)
DELETE /api/products/:id           (admin)
```

### Categories, Baskets, Orders, Subscriptions, Deliveries
Standard CRUD with role-based protection. See source code for full list.

### Trial Requests
```
POST /api/trial-requests                    (public)
GET  /api/trial-requests                    (admin)
PUT  /api/trial-requests/:id/status         (admin)
```

---

## 🎯 Website Pages

| URL | Page | Access |
|-----|------|--------|
| `/` | Home | Public |
| `/vegetables` | Vegetable listing | Public |
| `/baskets` | Baskets | Public |
| `/basket` | Shopping cart | Public |
| `/checkout` | Checkout | Logged in |
| `/subscriptions` | Subscription plans | Public |
| `/how-it-works` | Process | Public |
| `/about` | About Us | Public |
| `/contact` | Contact | Public |
| `/login` | Login | Guest |
| `/register` | Register | Guest |
| `/dashboard` | Customer dashboard | Customer |
| `/my-orders` | My orders | Customer |
| `/my-subscriptions` | My subscriptions | Customer |
| `/admin` | Admin dashboard | Admin |
| `/admin/products` | Manage products | Admin |
| `/admin/orders` | Manage orders | Admin |
| `/admin/trial-requests` | Manage trials | Admin |
| `/admin/customers` | Manage customers | Admin |
| `/admin/deliveries` | Delivery management | Admin |
| `/admin/reviews` | Moderate reviews | Admin |

---

## 🖼️ Logo

The placeholder logo is currently at `frontend/public/logo.png`.

**To replace with your actual Palvii logo:**
1. Copy your logo file to `frontend/public/logo.png`
2. Ensure it's a PNG with transparent background
3. The logo will automatically appear in the header, footer, and login pages

---

## 🚀 Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
NODE_ENV=production npm start
```

---

## 🔮 Future Features (Architecture Ready)

The codebase is designed to support:
- ✅ Razorpay payment gateway
- ✅ WhatsApp Business API
- ✅ Delivery partner login
- ✅ Coupon codes
- ✅ Customer wallet
- ✅ Loyalty program
- ✅ Multiple delivery areas
- ✅ Recurring notifications
- ✅ PWA support

---

*Made with ❤️ for Palvii — Our Farm to Your Home.*
