# TaskFlow — Backend
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white"/>
</p>
<p align="center">
  The Express 5 REST API backend for the TaskFlow task management application.
</p>

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript 5.x |
| Framework | Express 5 |
| ORM | Prisma 5 |
| Authentication | JWT + bcrypt |
| Validation | Zod |
| Logging | Pino + pino-http |
| Security | Helmet, CORS, express-rate-limit |
| Documentation | Swagger (swagger-jsdoc + swagger-ui-express) |
| Linting / Format | ESLint + Prettier |

---

## 📁 Project Structure

```
backend/
├── prisma/               # Prisma schema and migrations
├── src/
│   ├── config/          # App configuration
│   ├── controllers/    # Request handlers
│   ├── errors/         # Custom error classes
│   ├── middlewares/     # Auth, validation, error handling
│   ├── routes/        # Route definitions
│   ├── schemas/        # Zod validation schemas
│   ├── services/       # Business logic
│   ├── app.ts         # Express app setup
│   └── server.ts      # Server entry point
├── .env.example       # Environment variables template
├── Dockerfile         # Docker image definition
├── compose.yml        # Docker Compose setup
├── tsconfig.json      # TypeScript configuration
└── package.json
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Prisma connection string (e.g. PostgreSQL) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `FRONTEND_URL` | Allowed origin for CORS |
| `PORT` | Port the server listens on (default: `3000`) |

---

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm
- A running database compatible with your Prisma schema (e.g. PostgreSQL)

### Installation

```bash
# Install dependencies
npm install

# Apply database migrations
npx prisma migrate dev

# Start the development server (with hot reload)
npm run dev
```

The server will start at `http://localhost:3000`.

---

## 🐳 Docker

You can run the entire backend with Docker Compose:

```bash
docker compose up --build
```

This will start both the API server and the database container as defined in `compose.yml`.

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload via `tsx watch` |
| `npm run build` | Compile TypeScript to `./build` |
| `npm run lint` | Run ESLint on the `src/` directory |
| `npm run format` | Format code with Prettier |

---

## 📖 API Documentation

Once the server is running, interactive Swagger docs are available at:

```
http://localhost:3000/api-docs
```

---

## 🔐 Authentication

The API uses **JWT Bearer tokens**. After logging in, include the token in the `Authorization` header of every protected request:

```
Authorization: Bearer <your_token>
```

Passwords are stored securely using **bcrypt** hashing.

---

## 🛡️ Security Features

- **Helmet** — Sets secure HTTP headers
- **CORS** — Restricted to the origin defined in `FRONTEND_URL`
- **express-rate-limit** — Limits repeated requests to prevent abuse
- **Zod** — Runtime schema validation for all inputs

  
