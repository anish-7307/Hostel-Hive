# Hostel Hive

Hostel Hive is a role-based hostel management portal with a React client and an Express/MongoDB API.

## Technology

- **Client:** React, Vite, React Router, Tailwind CSS
- **API:** Node.js, Express, Mongoose, JWT
- **Database:** MongoDB

## Run locally

Requirements: Node.js and a reachable MongoDB instance.

1. Configure `server/.env`:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/hostel_hive
   JWT_SECRET=replace-with-a-long-random-secret
   ```

   Keep real environment files and secrets out of source control. Use a unique, high-entropy `JWT_SECRET` outside local development.

2. Start the API:

   ```powershell
   cd server
   npm install
   npm run dev
   ```

3. Optionally configure the client API URL in `client/.env`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   The client uses this URL by default if the variable is omitted.

4. Start the client in a second terminal:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

   Open the Vite URL shown in the terminal (normally `http://localhost:5173`). Check API availability at `http://localhost:5000/api/health`.

## Account access

The following demo accounts have been added to the currently configured development MongoDB. They are not seeded automatically in other environments. Their passwords were generated uniquely and are intentionally not stored in this README or source control; distribute them securely and rotate them if they are lost.

| Role | Sign-in ID | Password | How the account is created |
| --- | --- | --- | --- |
| Student | `student.demo@hostelhive.test` (`HH-DEMO-2026-001`) | 460449937 | Generated; distribute securely | Demo account in the configured development database. New students can use **Register**. |
| Warden | `warden.demo@hostelhive.test` | 592589545 | Generated; distribute securely | Demo account in the configured development database. |
| Owner | `owner.demo@hostelhive.test` | 980415473 | Generated; distribute securely | Demo account in the configured development database. |

These demo accounts use placeholder contact details and must not be used in production. Public registration creates student accounts only; additional warden and owner accounts must be provisioned by an administrator with the appropriate role.

During local development, the login page also shows **Development Demo** buttons. These create temporary client-side preview sessions and require no ID or password. They are for viewing the UI only; API-backed actions require a real account and valid server-issued login token.

## Current pages and API

### Student

Student routes include dashboard, room, attendance, fees, leave, visitors, complaints, and notifications. Student registration and login use the API. Leave requests and complaints submitted by an authenticated student are stored in MongoDB and appear in the warden review pages. Other student feature content (including payments, visitor records, and attendance) is currently sample or client-side content.

### Warden

- `/warden` — dashboard metrics
- `/warden/students` — searchable student directory
- `/warden/attendance` — daily student attendance marking
- `/warden/leave-requests` — review and approve/reject leave applications
- `/warden/complaints` — review complaints and update their status

These pages use role-protected API endpoints:

- `GET /api/warden/dashboard`
- `GET /api/warden/students`
- `GET /api/warden/attendance?date=YYYY-MM-DD`
- `PUT /api/warden/attendance`
- `GET /api/warden/leave-requests`
- `PATCH /api/warden/leave-requests/:id/status`
- `GET /api/warden/complaints`
- `PATCH /api/warden/complaints/:id/status`

### Student API actions

- `POST /api/student/leave-requests` and `GET /api/student/leave-requests`
- `POST /api/student/complaints` and `GET /api/student/complaints`

These endpoints require a student JWT. Warden endpoints require a warden JWT. The owner dashboard is available at `/owner`; its current overview is client-side and does not yet have owner-specific API endpoints.

## Checks

```powershell
cd client
npm run lint
npm run build
```
