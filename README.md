# Team Task Manager

A production-ready full-stack team collaboration workspace built with **Next.js 15**, **TypeScript**, **Express**, **MongoDB/Mongoose**, **Socket.IO**, and **OpenAI integration**. The application helps teams manage projects, tasks, AI-assisted task breakdowns, and real-time team conversations in one recruiter-ready interface.

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control for **Admin** and **Member** users
- Project creation, membership management, and task assignment
- Task filtering, overdue tracking, and dashboard analytics
- AI-powered task breakdown endpoint at `POST /api/ai/generate-subtasks`
- Real-time personal and group chat with unread counts and presence updates
- Responsive, modern dashboard and collaboration UI
- Railway-ready frontend and backend deployment configuration
- Seed script for demo accounts and starter data

## Monorepo structure

```text
apps/
  server/   Express + MongoDB + Socket.IO API
  web/      Next.js 15 App Router frontend

docs/
  api.md
  team-task-manager.postman_collection.json
```

## Tech stack

### Frontend
- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Context API + Socket.IO client

### Backend
- Node.js + Express 5
- TypeScript
- JWT authentication
- bcrypt password hashing
- Mongoose + MongoDB
- Socket.IO
- OpenAI integration with structured fallback handling

## Quick start

### 1. Install dependencies

```bash
npm --prefix apps/server install
npm --prefix apps/web install
```

### 2. Configure environment variables

Copy the sample files:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.local.example apps/web/.env.local
```

### 3. Start the backend

```bash
npm --prefix apps/server run dev
```

> If `MONGODB_URI` is not supplied locally, the backend automatically falls back to an in-memory MongoDB instance for development/demo usage.

### 4. Start the frontend

```bash
npm --prefix apps/web run dev
```

Frontend: `http://localhost:3000`  
Backend API: `http://localhost:4000/api`

## Demo credentials

After running the seed script (`npm --prefix apps/server run seed`):

- **Admin**: `admin@teamtaskmanager.dev` / `Password123!`
- **Member**: `member@teamtaskmanager.dev` / `Password123!`

## Available scripts

### Root
- `npm run dev:web`
- `npm run dev:server`
- `npm run lint`
- `npm run build`

### Backend
- `npm --prefix apps/server run dev`
- `npm --prefix apps/server run lint`
- `npm --prefix apps/server run build`
- `npm --prefix apps/server run seed`

### Frontend
- `npm --prefix apps/web run dev`
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web run build`

## Environment variables

### Backend (`apps/server/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | API port, defaults to `4000` |
| `CLIENT_URL` | Frontend origin used for CORS |
| `MONGODB_URI` | MongoDB Atlas/local connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token TTL, defaults to `7d` |
| `OPENAI_API_KEY` | Optional API key for AI subtasks |
| `OPENAI_MODEL` | Optional model override |

### Frontend (`apps/web/.env.local`)

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base API URL including `/api` |

## Core API routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users
- `GET /api/users?search=`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/members`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard
- `GET /api/dashboard/summary`

### AI
- `POST /api/ai/generate-subtasks`

### Chat
- `GET /api/chat`
- `POST /api/chat`
- `POST /api/chat/group`
- `PATCH /api/chat/group/:id`
- `PATCH /api/chat/group/:id/members`
- `DELETE /api/chat/group/:id`
- `POST /api/message`
- `GET /api/message/:conversationId`

Full API examples live in [`docs/api.md`](docs/api.md) and [`docs/team-task-manager.postman_collection.json`](docs/team-task-manager.postman_collection.json).

## Seed data

Run:

```bash
npm --prefix apps/server run seed
```

The script creates:
- an admin user
- a member user
- a starter project
- seeded tasks
- a direct conversation with example messages

## Railway deployment

Deploy frontend and backend as separate Railway services from the same repository:

1. Create a **backend** service with root directory `apps/server` and use `apps/server/railway.json`.
2. Create a **frontend** service with root directory `apps/web` and use `apps/web/railway.json`.
3. Provision MongoDB Atlas and configure the backend variables.
4. Set `NEXT_PUBLIC_API_URL` on the frontend to the public backend URL plus `/api`.
5. Set the backend `CLIENT_URL` to the public frontend URL.

Detailed steps are available in [`docs/api.md`](docs/api.md#railway-deployment-guide).

## Screenshots

Screenshots captured during verification can be stored in `docs/screenshots/` and linked here for portfolio/demo usage.
