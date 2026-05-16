# VertexFlow

VertexFlow is a full-stack project and task management workspace for small teams. It combines email-based authentication, project workspaces, member roles, task boards, dashboard metrics, schedule tracking, and light/dark themes in a React and Express application.

The repository directory is named `projectdesk`, and some internal package/local-storage keys still use the older `project-task` or `projectDesk` naming. The user-facing app name in the current project is `VertexFlow`.

## Features

- Email/password signup and login with JWT sessions
- Password reset flow through transactional email
- Project creation, search, and project directory views
- Project member search and role assignment
- Admin and Member project roles
- Task creation, assignment, status changes, due dates, notes, search, and deletion
- Kanban-style execution board with `Pending`, `In Progress`, and `Completed` columns
- Dashboard metrics for projects, total tasks, overdue work, and status distribution
- Overdue task and recently updated project summaries
- Schedule view for dated project tasks
- Profile/settings screen for account context
- Responsive React interface with light and dark theme support
- Express API with validation, centralized error handling, CORS, Helmet, and MongoDB persistence

## Tech Stack

**Client**

- React 18
- Vite
- Lucide React
- Radix UI Slot
- Custom CSS

**Server**

- Node.js
- Express
- MongoDB with Mongoose
- Zod validation
- JWT authentication
- bcrypt password hashing
- Google Auth Library for the `/api/auth/google` endpoint
- Mailtrap and Nodemailer for email delivery

## Project Structure

```text
projectdesk/
  client/                 React/Vite frontend for VertexFlow
    src/
      components/         Auth, workspace, dashboard, projects, tasks, members, settings, UI
      constants/          Task status and empty task helpers
      hooks/              Workspace and theme state
      lib/                Date and class name utilities
      api.js              API client and session storage helpers
  server/                 Express/MongoDB backend
    src/
      config/             Database connection
      controllers/        Auth, dashboard, project, and task handlers
      middleware/         Auth, validation, access control, and error middleware
      models/             User, Project, and Task schemas
      routes/             Auth, project/task, and dashboard routes
      utils/              Tokens, email, HTTP errors, and async wrapper
  package.json            Root scripts for install, dev, build, and start
  railway.json            Railway deployment config
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string
- Mailtrap API token if password reset emails should be delivered
- Google OAuth client ID only if the Google auth endpoint is enabled and wired into the client UI

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.example/database
JWT_SECRET=replace-with-a-long-random-secret
APP_URL=http://localhost:5173
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GOOGLE_CLIENT_ID=your-google-oauth-client-id
MAILTRAP_API_TOKEN=your-mailtrap-api-token
DISABLE_CLIENT_SERVE=false
```

Create `client/.env` only when client-side overrides are needed:

```env
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Notes:

- `MONGO_URI` and `JWT_SECRET` are required for the server.
- `VITE_API_URL` defaults to `/api`. During local development, Vite proxies `/api` to `http://localhost:5000`.
- Password reset uses `MAILTRAP_API_TOKEN`. If email delivery is not configured, reset-email sending will fail.
- Signup currently creates auto-verified email accounts in `server/src/controllers/auth.controller.js`.
- The backend exposes a Google login endpoint, and the client can load `GoogleOAuthProvider`, but the current auth screen does not render a Google login button.

## Installation

Install dependencies for the root, server, and client:

```bash
npm run install:all
```

Or install each workspace manually:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

## Running Locally

Start the API and Vite dev server together from the repository root:

```bash
npm run dev
```

Default local URLs:

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## Build and Production Start

Build the frontend:

```bash
npm run build
```

Start the Express server:

```bash
npm start
```

In production, the server serves `client/dist` automatically when it exists. Set `DISABLE_CLIENT_SERVE=true` if the frontend is hosted separately.

## Root Scripts

| Command | Description |
| --- | --- |
| `npm run install:all` | Install root, server, and client dependencies |
| `npm run dev` | Run server and client development servers concurrently |
| `npm run build` | Build the Vite frontend |
| `npm start` | Start the Express server |

## API Overview

Base path: `/api`

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/signup` | Create an email/password account |
| `POST` | `/auth/login` | Log in with email/password |
| `POST` | `/auth/google` | Log in or sign up with a Google credential |
| `POST` | `/auth/verify-email` | Verify an email token |
| `POST` | `/auth/forgot-password` | Send a password reset email |
| `POST` | `/auth/reset-password` | Reset password with a token |
| `GET` | `/auth/me` | Get the current authenticated user |

### Projects And Tasks

All project and task routes require authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/projects` | List projects for the current user |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects/:projectId` | Get project details |
| `PATCH` | `/projects/:projectId` | Update a project, Admin only |
| `DELETE` | `/projects/:projectId` | Delete a project, Admin only |
| `GET` | `/projects/:projectId/search-users` | Search users to add, Admin only |
| `POST` | `/projects/:projectId/members` | Add a member, Admin only |
| `PATCH` | `/projects/:projectId/members/:memberId` | Update member role, Admin only |
| `DELETE` | `/projects/:projectId/members/:memberId` | Remove a member, Admin only |
| `GET` | `/projects/:projectId/tasks` | List project tasks |
| `POST` | `/projects/:projectId/tasks` | Create a task, Admin only |
| `PATCH` | `/projects/:projectId/tasks/:taskId` | Update task details or status |
| `DELETE` | `/projects/:projectId/tasks/:taskId` | Delete a task, Admin only |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/dashboard` | Get workspace metrics, overdue tasks, and recent tasks for the current user |

## Roles

| Capability | Admin | Member |
| --- | --- | --- |
| View project data | Yes | Yes |
| View tasks | Yes | Yes |
| Change task status | Yes | Yes |
| Create tasks | Yes | No |
| Delete tasks | Yes | No |
| Update project details | Yes | No |
| Add, remove, or update members | Yes | No |

## Deployment

The repository includes `railway.json` for Railway:

- Installs root, server, and client dependencies
- Builds the client with `npm run build`
- Starts the app with `npm start`
- Uses `/health` as the health check endpoint

Set production environment variables in Railway or your hosting provider. At minimum, configure `MONGO_URI`, `JWT_SECRET`, `APP_URL`, and the correct client origin values.
