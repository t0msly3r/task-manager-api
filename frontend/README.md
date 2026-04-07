# TaskFlow — Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

<p align="center">
  The Next.js 16 frontend for the TaskFlow task management application.
</p>

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Server State | TanStack React Query v5 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Auth | JWT via js-cookie |
| Notifications | react-hot-toast |

---

## Features

- **Authentication** — Login and registration forms with error handling and loading states
- **Protected routes** — Middleware redirects unauthenticated users away from `/tasks`
- **Task management** — Create, update (inline edit), complete/uncomplete and delete tasks
- **Role-based UI** — Admin users can edit and delete any task; regular users only their own
- **Optimistic UX** — Toast notifications for all async actions
- **Responsive design** — Clean, minimal layout that works on all screen sizes
- **Auto logout** — Axios interceptor detects expired tokens and redirects to login

---

## Project Structure

```
frontend/
├── app/
│   ├── (dashboard)/
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   └── tasks/          # Tasks dashboard (protected)
│   ├── globals.css
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Landing page
│
├── features/
│   ├── auth/
│   │   ├── components/     # LoginForm, RegisterForm, LogoutButton
│   │   ├── hooks/          # useAuth, useLogin, useRegister, useLogout
│   │   └── services/       # auth.service.ts (API calls)
│   └── tasks/
│       ├── components/     # TasksItem, CreateTask, ConfirmModal
│       ├── hooks/          # useTasks, useCreateTask, useUpdateTask, useDeleteTask
│       └── services/       # task.service.ts (API calls)
│
├── lib/
│   └── axios.ts            # Axios instance with auth interceptors
│
├── providers/
│   ├── auth-provider.tsx
│   └── query-provider.tsx  # TanStack Query client
│
├── types/
│   └── tasks.ts            # Task type definitions
│
└── proxy.ts                # Next.js middleware for route protection
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- The [backend API](../README.md) running (locally or via Docker)

### Install dependencies

```bash
cd frontend
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

> Make sure `NEXT_PUBLIC_API_URL` is set to your backend URL before starting.

---

## Environment Variables

Create a `.env.local` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format code with Prettier |
