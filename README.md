# Team Task Manager

An AI-powered interview preparation platform with a modern Next.js frontend and a Flask backend API. It helps users create mock interviews, run voice-based sessions, and review AI-generated feedback and analytics.

## Project Structure

```text
apps/
  web/        Next.js frontend
backend/      Flask backend API
```

## Tech Stack

### Frontend (`apps/web`)
- Next.js 15
- React 19
- Tailwind CSS 4
- React Hook Form
- Axios
- Vapi Web SDK

### Backend (`backend`)
- Python 3
- Flask + Flask-RESTful
- PyMongo (MongoDB)
- JWT authentication (PyJWT)
- Flask-Bcrypt
- Google Gemini API
- PyPDF2

## Environment Setup

### 1) Frontend `.env.local`

Create file:

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Set values in `apps/web/.env.local`:

- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- `NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token`
- `NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id`
- `NEXT_PUBLIC_VAPI_VOICE_PROVIDER=11labs`
- `NEXT_PUBLIC_VAPI_VOICE_ID=your_voice_id`

### 2) Backend `.env`

Create file:

```bash
cp backend/.env.example backend/.env
```

Set values in `backend/.env`:

- `APP_ENV=development`
- `APP_DEBUG=true`
- `PORT=5000`
- `CLIENT_ORIGIN=http://localhost:3000`
- `MONGODB_URI=your_mongodb_connection_string`
- `MONGODB_DB_NAME=prepwise_clone`
- `JWT_SECRET=your_jwt_secret`
- `JWT_EXPIRES_IN_MINUTES=1440`
- `GEMINI_API_KEY=your_gemini_api_key`
- `GEMINI_MODEL=gemini-1.5-flash`
- `VAPI_WEB_TOKEN=your_vapi_web_token`
- `VAPI_WORKFLOW_ID=your_vapi_workflow_id`
- `MAX_CONTENT_LENGTH=10485760`
- `UPLOAD_DIR=backend/uploads`

## Run Locally

### 1) Install frontend dependencies

```bash
npm --prefix apps/web install
```

### 2) Install backend dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 3) Start backend

```bash
python backend/app.py
```

Backend API runs at: `http://localhost:5000`

### 4) Start frontend (new terminal)

```bash
npm --prefix apps/web run dev
```

Frontend runs at: `http://localhost:3000`
