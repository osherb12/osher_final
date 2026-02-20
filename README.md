# Osher's Final Project

This repository contains a **React 19 frontend** and an **Express.js backend** within a **monorepo** using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

## Features

- **Monorepo Setup:** Both frontend (React) and backend (Express.js) applications are contained in a single repository.
- **React 19:** Latest version of React with new features and optimizations.
- **Vite Proxy:** Seamlessly proxy API requests from the frontend to the backend for local development.
- **npm Workspaces:** Simplifies dependency management and running commands across packages.
- **Database:** MongoDB integrated with Docker Compose.
- **Production-Ready Setup:** Serves static files from the backend and handles fallback routes for **client-side routing**.

## Folder Structure

```bash
/apps
  /react      # Frontend React application
  /express    # Backend Express.js application
/packages
  /shared     # Shared code or utilities (if any)
```

## Setup and Installation

### 1. Install dependencies using npm:

```bash
npm install
```

### 2. Set up the database:

```bash
docker-compose up -d
```

### 3. Set up environment variables:

Create a `.env` file in the root directory.

### 4. Start development servers:

```bash
npm run dev
```

### 5. Build for production:

```bash
npm run build
```

### 6. Start the production server:

```bash
npm start
```
