# AMU SmartCare – Patient‑Doctor Connection Platform

[![Node.js](https://img.shields.io/badge/backend-Node.js%2FExpress-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/frontend-React%2FTypeScript-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org)

AMU SmartCare is a web platform connecting Arba Minch University medical doctors with community patients. It supports appointment booking, secure in-app messaging, doctor ratings, and a mock payment system with escrow.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start (Docker)](#quick-start-docker)
4. [Manual Setup](#manual-setup)
   - [Backend](#backend-setup)
   - [Frontend](#frontend-setup)
5. [Environment Variables](#environment-variables)
6. [Database Migrations & Seeding](#database-migrations--seeding)
7. [API Overview](#api-overview)
8. [Mock Payment System](#mock-payment-system)
9. [User Roles & Default Accounts](#user-roles--default-accounts)
10. [Project Structure](#project-structure)

---

## Architecture Overview

```
┌─────────────────────┐      HTTP/REST      ┌──────────────────────┐
│   React Frontend    │ ──────────────────► │  Express Backend     │
│  (port 3000)        │                     │  (port 5000)         │
│  TypeScript + Redux │ ◄────────────────── │  TypeScript + Prisma │
└─────────────────────┘                     └──────────┬───────────┘
                                                        │
                                                        ▼
                                             ┌──────────────────────┐
                                             │     PostgreSQL       │
                                             │     (port 5432)      │
                                             └──────────────────────┘
```

**Tech Stack**:
- **Backend**: Node.js 18 + Express.js + TypeScript + Prisma ORM
- **Frontend**: React 18 + TypeScript + Redux Toolkit + React Router v6 + Axios
- **Database**: PostgreSQL 15
- **Auth**: JWT (Bearer tokens) + bcrypt password hashing
- **Payments**: Pluggable `IPaymentService` (MockPaymentService | LivePaymentService stub)

---

## Prerequisites

- [Node.js 18+](https://nodejs.org)
- [npm 9+](https://www.npmjs.com)
- [Docker + Docker Compose](https://docs.docker.com/compose/) *(for Docker quick start)*
- [PostgreSQL 15](https://www.postgresql.org) *(for manual setup only)*

---

## Quick Start (Docker)

```bash
# 1. Clone and enter the repo
git clone https://github.com/petmsyh/AMU-SmartCare.git
cd AMU-SmartCare

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start all services
docker compose up -d

# 4. Run migrations + seed
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed

# 5. Open the app
#    Frontend: http://localhost:3000
#    Backend API: http://localhost:5000/api
```

---

## Manual Setup

### Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Copy and edit environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string and other settings

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Seed the database (admin + sample doctors)
npm run db:seed

# 6. Start the development server
npm run dev
# Backend will be available at http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit REACT_APP_API_URL if your backend runs on a different port

# 3. Start the development server
npm start
# Frontend will be available at http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/amu_smartcare` | PostgreSQL connection string |
| `JWT_SECRET` | *(required)* | Secret key for JWT signing – use a long random string in production |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiry |
| `PORT` | `5000` | HTTP server port |
| `PAYMENT_MODE` | `mock` | Payment mode: `mock` or `live` |
| `PLATFORM_COMMISSION_RATE` | `0.10` | Platform commission rate (10%) |
| `AUTO_RELEASE_HOURS` | `24` | Hours before escrow auto-releases after consultation |
| `NODE_ENV` | `development` | Node environment |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API base URL |
| `REACT_APP_STUN_URLS` | `stun:stun.l.google.com:19302` | Comma-separated STUN server URLs |
| `REACT_APP_TURN_URLS` | *(optional)* | Comma-separated TURN server URLs (recommended for production/mobile networks) |
| `REACT_APP_TURN_USERNAME` | *(optional)* | TURN username |
| `REACT_APP_TURN_CREDENTIAL` | *(optional)* | TURN credential/password |

---

## Database Migrations & Seeding

```bash
# Create a new migration after schema changes
cd backend && npx prisma migrate dev --name <migration_name>

# Apply migrations in production
cd backend && npx prisma migrate deploy

# Seed the database
cd backend && npm run db:seed

# Open Prisma Studio (DB GUI)
cd backend && npx prisma studio
```

---

## API Overview

Base URL: `http://localhost:5000/api`

| Group | Prefix | Description |
|---|---|---|
| Auth | `/auth` | Register, login, get current user |
| Users | `/users` | User management (admin) |
| Doctors | `/doctors` | Doctor profiles, search/filter |
| Consultations | `/consultations` | Book, accept, decline, complete |
| Messages | `/messages` | In-app secure messaging |
| Ratings | `/ratings` | Rate doctors, view reviews |
| Payments | `/payments` | Initiate payment, wallet, withdrawals, transactions |
| Admin | `/admin` | Admin dashboard, mock payment test panel |

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Mock Payment System

The platform includes a full mock payment system controlled by the `PAYMENT_MODE` env flag.

**`PAYMENT_MODE=mock`** (default for development):
- No real money moves; all transactions are labeled `is_real_money=false`
- Patient initiates payment → chooses simulated outcome: **success / failure / timeout**
- On **success**: funds are held in escrow in the database
- On **consultation completion**: escrow releases to doctor wallet (minus platform commission)
- **Refunds** are processed when a doctor doesn't respond or dispute is resolved for the patient
- Doctors can simulate **wallet withdrawals** (no real bank transfer)
- All mock transactions are stored with `transaction_mode='mock'` and `mock_outcome`

**Admin Mock Payment Dashboard** (`/admin` → Mock Payments):
- View all mock transactions and escrow states
- Manually trigger mock outcomes for any transaction
- Reset mock wallet balances for testing

**`PAYMENT_MODE=live`**:
- Routes to `LivePaymentService` which currently throws `"Live payment not implemented"`
- Integrate Chapa/Telebirr/CBE Birr API keys and implement `LivePaymentService` when ready

---

## User Roles & Default Accounts

After seeding, the following accounts are available:

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | `admin@amu.edu` | `Admin1234!` | Full system access |
| Doctor | `dr.kebede@amu.edu` | `Doctor1234!` | Internal Medicine |
| Doctor | `dr.tigist@amu.edu` | `Doctor1234!` | Pediatrics Specialist |
| Doctor | `dr.yonas@amu.edu` | `Doctor1234!` | Surgery Super-Specialist |
| Patient | `patient@example.com` | `Patient1234!` | Sample patient |

---

## Project Structure

```
AMU-SmartCare/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic
│   │   │   └── payment/       # IPaymentService, MockPaymentService, LivePaymentService
│   │   ├── repositories/      # Data access layer (Prisma)
│   │   ├── routes/            # Express router definitions
│   │   ├── middlewares/       # Auth, RBAC, validation, error handling
│   │   ├── utils/             # JWT, password hashing, logger
│   │   └── types/             # Shared TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed script
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instance with JWT interceptor
│   │   ├── store/             # Redux store + slices
│   │   ├── pages/             # React pages by role
│   │   │   ├── patient/
│   │   │   ├── doctor/
│   │   │   ├── student/
│   │   │   └── admin/
│   │   ├── components/        # Reusable UI components
│   │   └── types/             # TypeScript interfaces
│   ├── public/
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Scripts Reference

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Seed database with sample data |
| `npm run lint` | Run ESLint |

### Frontend
| Command | Description |
|---|---|
| `npm start` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests (pass-through) |
| `npm run lint` | Run ESLint |

---

## Audio / Video Calling (WebRTC + Firebase)

Scheduled (appointment-time-only) audio and video calls are implemented using **WebRTC** for media and **Firebase Firestore** for signaling and call-room state.

### Features
- **Scheduled-only**: join buttons are enabled 10 minutes before the scheduled consultation time and remain available for 90 minutes after.
- **1:1 and group** calls via a peer-to-peer mesh topology (dev-grade; no TURN server required for same-network or simple NAT scenarios).
- **Audio mode** and **Video mode**.
- Controls: mute/unmute mic, camera on/off, end call, participant count, per-peer connection-state indicator.

### Dev-only limitations
- Uses Google's public STUN server (`stun:stun.l.google.com:19302`) only.  
  Calls may fail across strict NATs or firewalls — add a TURN server for production use.
- Firebase Auth is not used for signaling; participants are identified by their AMU-SmartCare user ID.

### Setup: create a Firebase project

1. Go to <https://console.firebase.google.com/> and create a new project (or use an existing one).
2. Click **Add app → Web** and copy the `firebaseConfig` object.
3. Enable **Cloud Firestore** in the Firebase console (start in *test mode* for local dev, apply the rules in step 5 before going to production).
4. Copy `frontend/.env.example` to `frontend/.env.local` and fill in the Firebase values:

   ```env
   REACT_APP_FIREBASE_API_KEY=...
   REACT_APP_FIREBASE_AUTH_DOMAIN=...
   REACT_APP_FIREBASE_PROJECT_ID=...
   REACT_APP_FIREBASE_STORAGE_BUCKET=...
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
   ```

5. Deploy the security rules from `firestore.rules`:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add   # select your project
   firebase deploy --only firestore:rules
   ```

6. Restart the frontend dev server (`npm start` inside `frontend/`).

If the `REACT_APP_FIREBASE_PROJECT_ID` env var is not set the calling features are gracefully disabled — the rest of the app continues to work normally.
