# Osher Shop — Full-Stack E-Commerce App

A full-stack e-commerce application built with React 19 and Express 5, organized as an npm monorepo.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, TailwindCSS (Dracula theme), React Router 7, Framer Motion, Axios |
| Backend | Express 5, TypeScript, Typegoose / Mongoose 8, Zod, JWT, bcryptjs |
| Shared | `@osher/shared` — Zod schemas + TypeScript types used by both apps |
| Database | MongoDB (via Docker) |
| Testing | Vitest, supertest, mongodb-memory-server |

## Project Structure

```
/
├── apps/
│   ├── express/          # Backend API (port 3000)
│   │   └── src/
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── models/
│   │       ├── routes/
│   │       └── utils/
│   │           ├── db.ts
│   │           └── seed.ts
│   └── react/            # Frontend SPA (port 5173 in dev)
│       └── src/
│           ├── api/
│           ├── components/
│           └── context/
├── packages/
│   └── shared/           # Shared Zod schemas & types
├── docker-compose.yml
└── .env.example
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/) (for MongoDB)

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd osher_final
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and set a value for `JWT_SECRET` (any long random string).

### 3. Start MongoDB

```bash
docker compose up -d
```

### 4. Seed the database

```bash
npm run seed
```

This populates the database with sample products and creates two default accounts (see [Default Accounts](#default-accounts) below).

### 5. Start the dev servers

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## Available Scripts

```bash
npm run dev            # start backend + frontend concurrently (development)
npm run seed           # seed database with sample data
npm run build          # build all packages for production
npm start              # serve production build (Express serves the React SPA)
npm test               # run backend test suite
```

---

## Environment Variables

Copy `.env.example` to `.env`:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | Yes | `mongodb://localhost:27017/osher` | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret used to sign JWTs — server throws on startup if missing |
| `PORT` | No | `3000` | Backend listen port |
| `NODE_ENV` | No | `development` | `development` or `production` |

---

## Default Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@osher.com` | `adminpassword` |
| User | `user@osher.com` | `userpassword` |

> These are for local development only. Do not use in production.

---

## API Overview

All routes are prefixed with `/api`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/products` | — | List all products |
| GET | `/api/products/:id` | — | Get product by ID |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/reviews` | User | Add a review |
| GET | `/api/categories` | — | List categories |
| POST | `/api/categories` | Admin | Create category |
| DELETE | `/api/categories/:id` | Admin | Delete category (blocked if products exist) |
| GET | `/api/orders` | Admin | List all orders |
| GET | `/api/orders/my` | User | Get own orders |
| POST | `/api/orders` | User | Place an order |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| POST | `/api/orders/:id/cancel` | User | Cancel own order |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart` | User | Add item to cart |
| PUT | `/api/cart/:productId` | User | Update cart item quantity |
| DELETE | `/api/cart/:productId` | User | Remove cart item |

---

## Password Policy

Passwords must be at least 8 characters and include:
- One uppercase letter
- One lowercase letter
- At least 4 digits
- One special character (`!@%$#^&*-_`)

Example: `Password1234!`

---

## Running Tests

```bash
npm test
```

> **First run:** `mongodb-memory-server` downloads a MongoDB binary (~778 MB). Cached at `~/.cache/mongodb-binaries/` for subsequent runs.

---

## Production Build

```bash
npm run build
npm start
```

Express serves the compiled React frontend from `apps/react/dist` with client-side routing fallback — a single server on port 3000 serves everything.

---

## Database (Docker)

```bash
docker compose up -d    # start MongoDB
docker compose down     # stop MongoDB
docker compose down -v  # stop and wipe data
```
