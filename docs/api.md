# API documentation

## Base URL

- Local backend: `http://localhost:4000/api`
- Frontend expected API env: `NEXT_PUBLIC_API_URL=http://localhost:4000/api`

## Authentication flow

1. Register or login via `/api/auth/register` or `/api/auth/login`
2. Use the returned bearer token in `Authorization: Bearer <token>`
3. Protected routes read the token through the auth middleware

## Auth routes

### `POST /api/auth/register`
```json
{
  "name": "Alex Admin",
  "email": "admin@teamtaskmanager.dev",
  "password": "Password123!",
  "role": "admin"
}
```

### `POST /api/auth/login`
```json
{
  "email": "admin@teamtaskmanager.dev",
  "password": "Password123!"
}
```

### `GET /api/auth/me`
Returns the authenticated user profile.

## Project routes

### `GET /api/projects`
Returns projects where the user is a member or creator.

### `POST /api/projects`
Admin only.
```json
{
  "title": "Platform Revamp",
  "description": "Ship the recruiter-facing task manager",
  "memberIds": ["<userId>"]
}
```

### `PATCH /api/projects/:id/members`
Admin only.
```json
{
  "memberIds": ["<userId>", "<userId>"]
}
```

## Task routes

### `GET /api/tasks`
Supports query params:
- `status`
- `priority`
- `assignedTo`
- `projectId`
- `search`
- `dueDate`
- `page`
- `limit`

### `POST /api/tasks`
Admin only.
```json
{
  "title": "Build authentication system with RBAC",
  "description": "Implement secure auth flows",
  "projectId": "<projectId>",
  "assignedTo": "<userId>",
  "priority": "High",
  "status": "Todo",
  "dueDate": "2026-05-25T00:00:00.000Z",
  "subtasks": ["Create signup API", "Create login API"]
}
```

### `PATCH /api/tasks/:id`
Admins can update any task fields. Members can update only `status`.

## AI route

### `POST /api/ai/generate-subtasks`
```json
{
  "title": "Build authentication system with RBAC",
  "description": "Create secure access flows for admin/member users"
}
```

Response:
```json
{
  "subtasks": [
    "Design the auth data model",
    "Create signup and login endpoints",
    "Implement JWT middleware",
    "Add role-based route protection",
    "Wire the frontend auth flow"
  ]
}
```

## Chat routes

### `POST /api/chat`
Create or open a direct conversation.

### `POST /api/chat/group`
Admin only.

### `POST /api/message`
```json
{
  "conversationId": "<conversationId>",
  "content": "The task is ready for review"
}
```

## Socket events

### Client emits
- `conversation:join`
- `conversation:leave`
- `message:typing`
- `message:stop-typing`

### Server emits
- `presence:update`
- `message:new`
- `conversation:typing`
- `conversation:stop-typing`

## Railway deployment guide

### Backend service
- Root directory: `apps/server`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment variables: `PORT`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `OPENAI_API_KEY`, `OPENAI_MODEL`

### Frontend service
- Root directory: `apps/web`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment variables: `NEXT_PUBLIC_API_URL`

### Atlas checklist
- Add the Railway backend outbound IP/network access
- Add database user credentials
- Use the generated SRV URL as `MONGODB_URI`
