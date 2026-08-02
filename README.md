# 🏛️ Delight Fashion - Men's Premium E-Commerce System (Phnom Penh, Cambodia)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Ecosystem-FFCA28?style=for-the-badge&logo=firebase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=for-the-badge&logo=cloudinary)

Welcome to **Delight Fashion**, a production-ready, mobile-first, high-end men's fashion e-commerce platform built for Phnom Penh, Cambodia. This repository implements our complete **CTO-level architecture plan**, featuring a luxury **Black, White, and Gold** aesthetic, server-less Firebase Backend, Cloudinary image pipeline, and automated Telegram shop owner order alerting.

---

## 📋 Table of Contents
- [Architecture & Technology Stack](#-architecture--technology-stack)
- [Project Phases Roadmap](#-project-phases-roadmap)
- [Folder & Feature Architecture](#-folder--feature-architecture)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Available Scripts](#-available-scripts)
- [License & Authors](#-license--authors)

---

## 🛠️ Architecture & Technology Stack

```
+-------------------------------------------------------------------------------+
|                       DELIGHT FASHION WEB APPLICATION                         |
|   +-----------------------+   +--------------------+   +------------------+   |
|   | Storefront (App Router)|   |  Admin Dashboard   |   | Tailwind Theme   |   |
|   +-----------------------+   +--------------------+   +------------------+   |
+-------------------------------------------------------------------------------+
                                      |
                     +----------------+----------------+
                     |                                 |
                     v                                 v
    +---------------------------------+   +---------------------------------+
    |   FIREBASE SERVERLESS CORE      |   |        CLOUDINARY CDN           |
    |  - Auth (Google + Custom Claim) |   |  - WebP / AVIF Transformation   |
    |  - Firestore NoSQL Schema       |   |  - Signed Presets (3:4 aspect)  |
    |  - Cloud Functions (Webhooks)   |   +---------------------------------+
    |  - FCM Push Notifications       |
    +---------------------------------+
                     |
                     v
    +---------------------------------+
    |      MERCHANT NOTIFICATIONS     |
    |  - Telegram Bot Push Alerts     |
    |  - Phnom Penh Instant SMS/Call  |
    +---------------------------------+
```

- **Frontend Core:** Next.js 16 (App Router), React 19, TypeScript
- **Styling System:** Vanilla Tailwind CSS v4 with custom brand tokens (`--brand-black`, `--brand-gold`, `--brand-white`)
- **Database & IAM:** Firebase Authentication, Firestore NoSQL (`firestore.rules` custom claims RBAC)
- **Asset Pipeline:** Cloudinary Node SDK & dynamic responsive transformations (`q_auto,f_auto`)
- **Notifications Engine:** Firebase Cloud Messaging (Shopper tracking) & Telegram Bot API (Shop owner new order alerts)
- **Cambodia Payments:** Cash on Delivery (COD) & ABA Bank QR PayWay transfers

---

## 🗺️ Project Phases Roadmap

- [x] **Phase 1: Project Architecture & Core Infrastructure Setup** *(Completed)*
  - Initialized Next.js 16 App Router + TypeScript + Tailwind CSS v4 + ESLint.
  - Configured Firebase Client (`client.ts`) & Admin Modular SDK (`admin.ts`).
  - Implemented Cloudinary image optimization utilities & signed signature generators (`cloudinary.ts`).
  - Created standardized API / Server Action response wrappers (`response.ts`) & domain interfaces (`types/index.ts`).
  - Implemented production Firestore Security Rules (`firestore.rules`).
- [ ] **Phase 2: Design System, Theme & Shared Components**
- [ ] **Phase 3: Firebase Authentication & Security IAM**
- [ ] **Phase 4: Product Management & Cloudinary Asset Pipeline**
- [ ] **Phase 5: Customer Storefront & Catalog Experience**
- [ ] **Phase 6: Shopping Cart, Checkout & Transactional Order Engine**
- [ ] **Phase 7: Order Management & Multi-Channel Notification Engine**
- [ ] **Phase 8: Quality Assurance, Security Audit & Production Launch**

---

## 📁 Folder & Feature Architecture

```
delight-fashion/
├── src/
│   ├── app/                           # Next.js App Router (Storefront & Admin routes)
│   ├── components/                    # Reusable Design System & Shared UI
│   │   ├── ui/                        # Atomic Components (Buttons, Modals, Inputs)
│   │   ├── storefront/                # Storefront UI (Hero, ProductCard, CartDrawer)
│   │   └── admin/                     # Admin Dashboard UI (DataTable, StockBadge)
│   ├── features/                      # Domain-specific Functional Logic Modules
│   ├── services/                      # Backend Data Layer & Server Actions
│   │   └── firebase/                  # Firebase Client/Admin SDK & Security Rules
│   │       ├── client.ts              # Firebase Client SDK Singleton
│   │       ├── admin.ts               # Firebase Admin Modular SDK Initializer
│   │       └── rules/
│   │           └── firestore.rules    # Production Firestore IAM Security Rules
│   ├── hooks/                         # Custom React Hooks (useAuth, useCart)
│   ├── types/                         # TypeScript Domain Interfaces (User, Product, Order)
│   └── utils/                         # Helper Functions (cloudinary, response wrappers)
├── IMPLEMENTATION_PLAN.md             # Detailed CTO Technical Roadmap
├── .env.example                       # Documented Environment Variables Template
└── tailwind.config.ts / globals.css   # Luxury Black, White, and Gold Theme Settings
```

---

## 🚀 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rotananob/Delight-Fashion.git
   cd Delight-Fashion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your Firebase and Cloudinary credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## ⚙️ Environment Variables Configuration

See `.env.example` for all required keys. Key namespaces include:
- `NEXT_PUBLIC_FIREBASE_*`: Firebase client web app configuration.
- `FIREBASE_ADMIN_*`: Service account credentials for secure Server Actions & webhooks.
- `NEXT_PUBLIC_CLOUDINARY_*` / `CLOUDINARY_*`: Image CDN cloud name, API key, and secret.
- `TELEGRAM_BOT_TOKEN` & `TELEGRAM_SHOP_OWNER_CHAT_ID`: Telegram notification webhook configuration for Phnom Penh shop alerts.
- `NEXT_PUBLIC_ABA_*`: ABA Bank account info for Cambodian local QR transfers.

---

## 📜 Available Scripts

- `npm run dev` - Start local development server with Hot Module Replacement (HMR).
- `npm run build` - Build production Next.js 16 application with static/dynamic route optimization.
- `npm run start` - Start production server locally.
- `npm run lint` - Execute ESLint code quality checks.

---

## 🏛️ License & Authors

**Delight Fashion Co., Ltd.** — Phnom Penh, Cambodia.  
All Rights Reserved. Engineered for production-ready men's fashion retail.
