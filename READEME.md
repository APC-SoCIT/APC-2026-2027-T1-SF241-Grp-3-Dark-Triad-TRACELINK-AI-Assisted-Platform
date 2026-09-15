# TraceLink — Local Setup Guide

This covers everything needed to get TraceLink running on your own machine,
from a completely fresh computer to a working login page in the browser.

**Current scope:** this setup only covers the **Account Access** module
(register/login). The Task Queue, Worker Service, and Core Batch Scan
processing are not built yet — see "What's not built yet" at the bottom.

---

## 1. Prerequisites — install these first

| Tool | Why you need it | Check it worked |
|---|---|---|
| [Node.js](https://nodejs.org/) (v18 or newer) | Runs both the backend and frontend | `node --version` |
| [PostgreSQL](https://www.postgresql.org/download/) | The database | `psql --version` |
| A code editor (e.g. [VS Code](https://code.visualstudio.com/)) | Editing the project | — |

**Important — do not install `prisma@latest`.** As of this writing, the
newest Prisma CLI (v8) is a completely different tool with different
commands. This project is built on **Prisma 5**, and every command below
assumes that version. If npm suggests updating Prisma, ignore it.

**Windows-specific note:** the PostgreSQL installer does not always add
`psql` to your system PATH automatically. If `psql --version` doesn't work
after installing:
1. Find your install folder, usually `C:\Program Files\PostgreSQL\<version>\bin`
2. Search Windows for "Edit the system environment variables" → Environment
   Variables → under "System variables", edit `Path` → add that folder.
3. Close and reopen your terminal (a full restart isn't necessary).

During installation, PostgreSQL will ask you to set a password for the
default `postgres` user — remember it, you'll need it below.

---

## 2. Clone the project

```
git clone <repo-url>
cd <repo-folder>
```

This repo has two separate projects inside it:
- `/tracelink-api` — the backend (Express + Prisma + PostgreSQL)
- `/tracelink-web` — the frontend (React + Vite)

They run as two separate processes, in two separate terminals, at the same time.

---

## 3. Backend setup

```
cd tracelink-api
npm install
```

### Create the database

Open a terminal and run:
```
psql -U postgres
```
Enter your PostgreSQL password when prompted. Once you see a `postgres=#`
prompt, run:
```sql
CREATE DATABASE tracelink;
```
Then type `\q` and press Enter to exit.

### Configure environment variables

Copy `.env.example` to a new file named `.env` in the `tracelink-api` folder,
and fill in your real values:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/tracelink?schema=public"
JWT_SECRET="pick-any-long-random-string-here"
PORT=3000
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL
installation. If your password contains special characters (`@`, `:`, `/`,
`#`), they need to be URL-encoded or the connection string will fail.

### Create the database tables

```
npx prisma generate
npx prisma migrate dev
```

This reads `prisma/schema.prisma` and creates all the actual tables in your
`tracelink` database. You should see "Your database is now in sync with
your schema" when it finishes.

### Run the backend

```
node src/index.js
```

You should see `TraceLink API listening on port 3000`. Leave this terminal
open and running.

**Quick check:** open `http://localhost:3000/health` in your browser — you
should see `{"status":"ok"}`.

---

## 4. Frontend setup

Open a **new, separate terminal** (don't close the one running the backend).

```
cd tracelink-web
npm install
npm run dev
```

This prints a local URL, usually `http://localhost:5173` — open that in
your browser.

---

## 5. Try it end-to-end

With both the backend (port 3000) and frontend (port 5173) running:

1. On the page, make sure you're on the Register form.
2. Fill in a first name, last name, email, and password, then submit.
3. You should see a green "Account created! You can log in now." message,
   and the form switches to Login automatically.
4. Log in with the same email/password.
5. You should see a "Welcome, [your name]!" greeting.

If all five steps work, your full local setup — React frontend, Express
API, and PostgreSQL database — is working correctly end to end.

---

## Troubleshooting

**`Cannot GET /`** when visiting `localhost:3000` directly — expected. There's
no route defined at `/`, only at `/health` and `/api/auth/...`. Not a bug.

**`Error: Cannot find module 'X'`** — you're missing a dependency. Run
`npm install` again in whichever folder (`tracelink-api` or `tracelink-web`)
the error is coming from.

**CORS error in the browser console** (something like "blocked by CORS
policy") — make sure the backend's `src/index.js` includes
`app.use(cors())` and that you restarted the backend server after adding it.

**PowerShell's `curl` doesn't work like real curl** — PowerShell aliases
`curl` to `Invoke-WebRequest`, which takes different arguments. Use
`Invoke-RestMethod` instead if testing the API directly from PowerShell,
or run `curl.exe` to force the real curl.

**Nothing happens / connection refused in the browser** — check that both
the backend and frontend terminals are still running (they must stay open
the whole time you're using the app) and that you're visiting the frontend
URL (`:5173`), not the backend URL (`:3000`), in your browser.

---

## What's not built yet

- **Redis / Task Queue** — not installed or wired in yet.
- **Worker Service** — doesn't exist yet; nothing processes URLs.
- **Core Batch Scan endpoints** (upload, scan, job status) — schema tables
  exist in the database, but the API routes for this module haven't been
  built yet.
- **Frontend styling** — currently unstyled on purpose, functional only.

Next milestone: installing Redis and building the Task Queue + Worker
Service, so uploaded URLs can actually be processed.
