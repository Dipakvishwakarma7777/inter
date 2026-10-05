# SupportDesk — Full-stack ticketing system

This release completes the requested implementation plan across the React frontend and Node/Express/MongoDB backend.

## Implemented phases
1. **Frontend ↔ Backend API synchronization** — consistent `/api` contract, PATCH/POST methods, response envelopes, ObjectId categories, error handling and pagination.
2. **Authentication** — register/login/logout/me, JWT + HttpOnly cookie, bearer fallback, role protection, forgot/reset password and rate limiting.
3. **Ticket CRUD** — create/read/update/delete, filtering, pagination, assignment, status/priority/category and authorization.
4. **Comments / conversation** — ticket-scoped comments with access control, notifications and first-response tracking.
5. **Admin** — dashboard, users/roles/status, agents, categories and activity logs.
6. **Attachments** — validated uploads, size limits, secure authenticated downloads and ownership/admin deletion.
7. **Notifications** — ticket/comment notifications, unread filtering, mark read/all and delete.
8. **Dashboard** — customer, agent and admin operational dashboards.
9. **Search** — ticket/user/category search with escaped regex and text indexes.
10. **Tests** — Jest unit coverage for validation, pagination and SLA logic; existing test suite retained.
11. **SLA** — priority-based due dates, first-response timestamp and periodic breach detection.
12. **Email delivery** — intentionally disabled for this local/testing build; password reset generates a temporary local reset URL instead of sending email.
13. **Real-time Socket.IO** — authenticated socket sessions, ticket rooms, live ticket/comment events.
14. **Knowledge Base** — searchable/published articles and admin/agent authoring.
15. **Analytics** — status, priority, category, monthly and SLA aggregations.
16. **AI/RAG** — Mistral AI agent with read-only knowledge-base tool calling. Set `MISTRAL_API_KEY` in `backend/.env` to enable it.

## Security and maintainability
- Helmet, CORS allow-list, request IDs and rate limits.
- Passwords hashed with bcrypt.
- JWT secret required in production and must be long.
- Uploads are not publicly exposed; downloads require authentication/authorization.
- File names are generated server-side and MIME types/size are restricted.
- MongoDB writes use allow-lists and Mongoose validation.
- Error responses avoid stack traces/secrets.
- Sensitive credentials must be provided through environment variables.

## Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill MONGODB_URI and a strong JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Set VITE_API_URL in .env, e.g. http://localhost:3000/api
npm run dev
```

### Tests
```bash
cd backend
npm test
```

## Important
The supplied archive contained a real-looking MongoDB connection string and JWT secret in `backend/.env.example`. Those values were removed and replaced with safe placeholders. Never commit real secrets to Git.
