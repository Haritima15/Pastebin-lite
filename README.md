# Pastebin-lite

A Pastebin-like web application built as a take-home assignment using **Node.js, Express, MongoDB, and React**.

The application allows users to create text pastes, retrieve them via short IDs, and enforce optional constraints such as **time-based expiry (TTL)** and **maximum view limits**, exactly as specified in the assignment.

The project is **API-first**.  
A simple frontend UI is included **only for demonstration and manual testing**.

---

## 🚀 Features

### Core Features (Assignment Requirements)
- Create a paste via REST API
- Retrieve a paste using a short ID
- Optional constraints:
  - Time-to-live (`ttl_seconds`)
  - Maximum number of views (`max_views`)
- Automatic enforcement of constraints
- HTML rendering of pastes at `/p/:id`
- Proper HTTP status codes (`404` when unavailable)
- Deterministic time handling for automated tests
- No hardcoded `localhost` URLs in committed source code

### Optional UI Enhancements (Not required for evaluation)
- React-based frontend to create and view pastes
- Inputs for TTL and max views
- Clean, centered UI
- Copy-to-clipboard button
- Automatic redirect to home page after paste expiry

> **Note:**  
> Automated evaluation interacts **only with the backend APIs**.  
> The frontend is provided purely for usability and demonstration.

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (Atlas)
- Mongoose
- nanoid

### Frontend (Optional)
- React (Vite + TypeScript)
- Fetch API
- Inline CSS styling (no external UI libraries)

---

## 🗂️ Project Structure

```text
pastebin-lite/
├── client/              # React frontend (optional)
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── config/
│   │   └── index.ts
├── README.md

```

## 🔌 API Endpoints

### Health Check
```bash
GET /api/healthz
```

### Response:
```json
{ "ok": true }
```
### Create Paste
```bash
POST /api/pastes
```
### Request body:
```json
{
  "content": "Hello World",
  "ttl_seconds": 60,
  "max_views": 3
}
```
-content is required
-ttl_seconds and max_views are optional
-Constraints can be used independently or together

### Response:
```json
{
  "id": "AbC123xY",
  "url": "https://<base-url>/p/AbC123xY"
}
```
### Fetch Paste (API)
```bash
GET /api/pastes/:id
```
### Response:
```json
{
  "content": "Hello World",
  "remaining_views": 2,
  "expires_at": "2026-01-28T10:30:00.000Z"
}
```
If the paste is unavailable (expired or max views exceeded):
```mathematica
404 Not Found
```
### Fetch Paste (HTML)
```bash
GET /p/:id
```
Returns an HTML page containing the paste
Content is safely escaped to prevent script execution
Returns 404 if unavailable

---

## ⏱️ Deterministic Time Support (TEST_MODE)
To support automated testing, the backend provides deterministic time handling.
If the environment variable is set:
```ini
TEST_MODE=1
```
The backend reads the request header:
```css
x-test-now-ms
```
This allows tests to simulate time passing without waiting in real time.

---

## 🌍 Environment Variables
### Backend (server/.env)
```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
PUBLIC_BASE_URL=http://localhost:5000
```
### Frontend (client/.env) – optional
```env
VITE_API_BASE=http://localhost:5000/api
```
.env files are excluded from version control.

---

## ▶️ Running Locally
### 1️⃣ Install dependencies
```bash
pnpm install
```
### 2️⃣ Start backend
```bash
cd server
pnpm dev
```
### 3️⃣ Start frontend (optional)
```bash
cd client
pnpm dev
```
Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:5173

---

## Design Notes
Constraints are stored as:
-expiresAt (absolute timestamp)
-maxViews (integer limit)
-Views are incremented only on successful access
-All unavailable cases return 404, as required
-Frontend logic is completely decoupled from backend enforcement
-Backend remains compliant even if the UI is removed

---
## 👨‍💻 Author
Built as a take-home assignment with a focus on:
-correctness
-clean API design
-robustness
-real-world engineering practices
