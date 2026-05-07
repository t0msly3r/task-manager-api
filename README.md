# TaskFlow — Fullstack Task Manager

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
</p>

<p align="center">
  A production-ready RESTful API for task management, featuring JWT authentication, role-based authorization, request validation and full Swagger documentation.
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Security](#security)
- [Frontend](#frontend)

---

## Overview

TaskFlow is a full-stack task management application. This repository contains the **backend API**, built with Node.js, Express and TypeScript, following a clean layered architecture. It is designed to be maintainable, secure and easy to extend.

Key features include:

- JWT-based authentication with secure cookie and header support
- Role-based access control (User / Admin)
- Full CRUD for tasks, scoped per user
- Input validation via Zod schemas
- Rate limiting, helmet headers and bcrypt password hashing
- Interactive API documentation via Swagger UI
- Docker Compose setup for one-command local development

### Running Both Projects

You can run both backend and frontend from the root directory:

```bash
npm run dev
```

This starts both servers in parallel. Alternatively, run them independently:

```bash
# Terminal 1: Backend (port 3000)
cd backend && npm run dev

# Terminal 2: Frontend (port 3000 with Turbopack)
cd frontend && npm run dev
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| Documentation | Swagger / OpenAPI |
| Logging | Pino |
| Security | Helmet, express-rate-limit, bcrypt |
| Containerization | Docker & Docker Compose |

---

## Architecture

The application follows a **layered architecture** to keep concerns separated and the codebase easy to navigate:

```
HTTP Request
    │
    ▼
 Routes          → Define endpoints and apply middleware
    │
    ▼
 Controllers     → Handle request/response cycle
    │
    ▼
 Services        → Business logic
    │
    ▼
 Prisma Client   → Database access (PostgreSQL)
```

Cross-cutting concerns such as authentication, validation and error handling are implemented as **Express middlewares**, keeping controllers thin and focused.

---

## Project Structure

```
src/
├── config/          # App configuration and environment variables
├── controllers/     # Request handlers
├── errors/          # Custom error classes
├── middlewares/     # Auth, validation, error handling
├── prisma/          # Prisma schema and migrations
├── routes/          # Route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic layer
└── server.ts        # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- Docker & Docker Compose (recommended)
- PostgreSQL (if running locally without Docker)

### Clone the repository

```bash
git clone https://github.com/t0msly3r/task-api.git
cd task-api
```

### Run with Docker (recommended)

```bash
docker compose up --build
```

This will start both the API server and a PostgreSQL instance. The API will be available at `http://localhost:3000`.

### Run locally

Each project must be run independently:

```bash
# Terminal 1: Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Or run both from the root:

```bash
npm install
npm run dev
```

The backend runs on `http://localhost:3000` and frontend on `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL=postgresql://admin:admin@localhost:5432/tasksdb
JWT_SECRET=your_secret_key_here
PORT=3000
```

> **Note:** Never commit your `.env` file. It is already included in `.gitignore`.

---

## API Reference

Interactive documentation is available via Swagger UI once the server is running:

```
http://localhost:3000/docs
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Log in and receive a JWT token |
| `GET` | `/auth/me` | Get the currently authenticated user |

### Tasks

All task endpoints require a valid `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | List all tasks for the authenticated user |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update a task (title or completed status) |
| `DELETE` | `/tasks/:id` | Delete a task |

> Admins can view and manage all tasks across users.

---

## Security

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt with salt rounds |
| Authentication | JWT signed tokens |
| Authorization | Role-based middleware (User / Admin) |
| Validation | Zod schemas on all inputs |
| Rate limiting | express-rate-limit to prevent brute force |
| HTTP headers | Helmet for secure defaults |

---

## Frontend

This API is consumed by a Next.js frontend located in the `/frontend` directory. It features a clean UI built with Tailwind CSS, React Query for server state management and react-hot-toast for notifications.

See [`frontend/README.md`](./frontend/README.md) for setup instructions.

---

## Backend

The REST API is located in the `/backend` directory. Built with Express 5 and TypeScript, it uses Prisma ORM for database access, JWT for authentication, and Zod for input validation. Requests are logged with Pino and the API is documented with Swagger.

See [`backend/README.md`](./backend/README.md) for setup instructions.

---

## Roadmap

- [ ] Unit and integration tests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Refresh token rotation
- [ ] Pagination and filtering for tasks
- [ ] Admin dashboard
- [ ] WebSocket support for real-time updates

---

## License

MIT
