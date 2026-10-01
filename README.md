# TraceLink Prototype

TraceLink is an automated SEO URL validation and web content analysis platform. This prototype currently focuses on two primary use cases:

- **UC-3 — Initiate Batch Scan**
- **UC-6 — Review Dashboard Results**

The prototype allows a user to upload a CSV file containing URLs, prepare a URL batch, initiate asynchronous URL validation, monitor scan progress, and review persisted technical validation results.

## Current Prototype Features

The current prototype supports:

- CSV URL batch upload
- URL extraction
- URL normalization
- Duplicate URL detection
- Batch scan creation
- Asynchronous URL processing using BullMQ
- HTTP status validation
- Redirect detection and counting
- Final URL detection
- Timeout and network error handling
- Scan result persistence
- Scan progress monitoring
- Scan result retrieval by Scan Job ID
- Simple React dashboard for reviewing scan results

The prototype currently supports **CSV files only**.

---

# Project Structure

```text
tracelink-prototype/
│
├── tracelink-api/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── index.js
│   │   ├── worker.js
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   │
│   │   ├── queue/
│   │   │   └── queue.js
│   │   │
│   │   └── routes/
│   │       ├── batches.js
│   │       └── scan.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── tracelink-web/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── InitiateBatchScan.jsx
│   │   │   └── ViewResults.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# Requirements

Before running TraceLink, install the following software.

## 1. Node.js

Node.js is required for both the frontend and backend.

Check whether Node.js is installed:

```bash
node --version
```

Also verify npm:

```bash
npm --version
```

If both commands return version numbers, Node.js and npm are available.

## 2. PostgreSQL

PostgreSQL is used as the main database for the prototype.

Each developer using a local PostgreSQL installation should create a database named:

```text
tracelink_sprint
```

The PostgreSQL database stores:

- URL batches
- URLs
- Scan jobs
- Scan results

## 3. Redis

TraceLink uses Redis with BullMQ as the queue for asynchronous URL scanning.

The current development Redis instance is hosted using Upstash.

A local Redis installation is therefore **not required** when using the provided development Redis URL.

The Redis connection URL will be provided privately to authorized team members and must not be committed to GitHub.

---

# Main Dependencies

The exact package versions are defined in each project's `package.json` and `package-lock.json`. Running `npm install` will install the required versions automatically.

## Backend

The backend uses:

- Node.js
- Express
- CORS
- Multer
- csv-parse
- Prisma
- `@prisma/client`
- BullMQ
- ioredis
- dotenv
- PostgreSQL

## Frontend

The frontend uses:

- React
- Vite
- JavaScript
- ESLint

You do **not** need to manually install each npm package individually.

---

# Installation

## 1. Clone the Repository

Clone the TraceLink prototype repository:

```bash
git clone <repository-url>
```

Enter the project directory:

```bash
cd tracelink-prototype
```

---

# Backend Setup

## 2. Install Backend Dependencies

Enter the API directory:

```bash
cd tracelink-api
```

Install the dependencies:

```bash
npm install
```

Do not copy or commit the `node_modules` directory. `npm install` recreates it using the project's package files.

---

# PostgreSQL Setup

## 3. Create the Local Database

Make sure PostgreSQL is running.

Create a PostgreSQL database named:

```text
tracelink_sprint
```

For example, using `psql`:

```sql
CREATE DATABASE tracelink_sprint;
```

You may also create the database using pgAdmin or another PostgreSQL administration tool.

Each developer using local PostgreSQL will have their own copy of `tracelink_sprint`.

---

# Environment Variables

## 4. Create `.env`

Inside:

```text
tracelink-api/
```

create a file named:

```text
.env
```

The file should contain:

```env
DATABASE_URL="postgresql://POSTGRES_USERNAME:POSTGRES_PASSWORD@localhost:5432/tracelink_sprint"

REDIS_URL="REDIS_URL_PROVIDED_PRIVATELY"

PORT=3000
```

Replace:

```text
POSTGRES_USERNAME
```

and:

```text
POSTGRES_PASSWORD
```

with the credentials for your local PostgreSQL installation.

For example:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/tracelink_sprint"
```

The actual `REDIS_URL` will be shared privately and should be placed directly into the `.env` file.

### Important

Never commit the real `.env` file to GitHub.

Make sure the backend `.gitignore` contains:

```gitignore
node_modules/
.env
```

A safe `.env.example` may instead be committed:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/tracelink_sprint"
REDIS_URL="rediss://your-redis-connection-url"
PORT=3000
```

The example file must not contain real passwords or Redis credentials.

---

# Prisma Setup

## 5. Generate the Prisma Client

From inside `tracelink-api`, run:

```bash
npx prisma generate
```

This generates the Prisma Client based on:

```text
prisma/schema.prisma
```

## 6. Create the Prototype Database Tables

For the current prototype, synchronize the local PostgreSQL database with the Prisma schema:

```bash
npx prisma db push
```

This creates the tables required by the prototype in `tracelink_sprint`.

The current prototype database includes the main models:

```text
URL_BATCH
URL
SCAN_JOB
SCAN_RESULT
```

To inspect the database using Prisma Studio:

```bash
npx prisma studio
```

---

# Running TraceLink

TraceLink currently consists of three running processes:

1. API Service
2. Worker Service
3. Web Frontend

It is recommended to open three terminals.

---

## Terminal 1 — Start the API

Navigate to:

```bash
cd tracelink-api
```

Run:

```bash
node src/index.js
```

The terminal should display:

```text
TraceLink API listening on port 3000
```

To verify that the API is running, open:

```text
http://localhost:3000/health
```

The expected response is:

```json
{
    "status": "ok"
}
```

---

## Terminal 2 — Start the Worker

From `tracelink-api`, run:

```bash
node src/worker.js
```

The terminal should display:

```text
Worker Service listening for jobs...
```

The worker consumes URL-validation tasks from the BullMQ queue and performs the actual HTTP validation.

During a scan, output similar to the following should appear:

```text
Checking: https://example.com
Checking: https://github.com
Checking: https://www.google.com
✅ Job 1 done
✅ Job 2 done
✅ Job 3 done
```

A completed BullMQ job means that the URL-processing task completed. It does not necessarily mean that the URL itself was operational. The actual technical result is stored in PostgreSQL and displayed through the View Results page.

---

## Terminal 3 — Start the Frontend

Navigate to:

```bash
cd tracelink-web
```

Install the frontend dependencies if this is the first time running the project:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend should become available at:

```text
http://localhost:5173
```

---

# Using the Prototype

## Initiate Batch Scan

Open the TraceLink frontend and select:

```text
Initiate Batch Scan
```

Select a CSV file containing URLs.

Example:

```csv
https://example.com
https://www.google.com
https://github.com
https://example.com/
https://example.com
```

Click:

```text
Upload CSV
```

TraceLink will:

1. Parse the CSV.
2. Extract the URLs.
3. Normalize the URLs.
4. Identify duplicates.
5. Create a URL batch.
6. Store the prepared URL records in PostgreSQL.

The frontend will display information such as:

```text
Batch ID: 1
File: test-urls.csv
Total URLs: 5
Duplicates: 2
```

Click:

```text
Start Scan
```

The API creates a Scan Job and publishes URL-processing tasks to BullMQ.

The Worker Service then performs the technical URL validation.

The frontend displays scan progress:

```text
Job ID: 1
Status: PROCESSING

Progress: 43 / 100
43%
```

Once every URL has been processed:

```text
Status: COMPLETED

Progress: 100 / 100
100%
```

Remember the **Scan Job ID**, since it can be used to retrieve the scan results.

---

# View Results

Select:

```text
View Results
```

Enter the Scan Job ID.

For example:

```text
Scan Job ID: 1
```

Click:

```text
View Results
```

The dashboard retrieves the persisted results from the API.

The dashboard displays information including:

- Original URL
- HTTP status
- Technical status
- Final URL
- Redirect count
- Duplicate status
- Error type
- Checked time

Possible technical status values currently include:

```text
OPERATIONAL
RESTRICTED
BROKEN
CLIENT_ERROR
SERVER_ERROR
TIMEOUT
NETWORK_ERROR
TOO_MANY_REDIRECTS
UNKNOWN
```

A Scan Job marked `COMPLETED` means that all URLs in the job have finished processing.

It does **not** mean that all URLs are operational.

For example:

```text
Scan Status: COMPLETED

100 URLs processed

82 OPERATIONAL
5 BROKEN
4 SERVER_ERROR
9 NETWORK_ERROR
```

is still a successfully completed scan.

---

# How the Prototype Works

The current architecture is approximately:

```text
                 React Frontend
                 localhost:5173
                       |
                       | HTTP
                       v
                  Express API
                 localhost:3000
                  /          \
                 /            \
                v              v
          PostgreSQL       BullMQ Queue
                               |
                               v
                         Upstash Redis
                               |
                               v
                         Worker Service
                               |
                               | HTTP requests
                               v
                         Target Websites
                               |
                               v
                         Scan Results
                               |
                               v
                          PostgreSQL
```

PostgreSQL is the persistent data store.

Redis is **not** the primary TraceLink database. Redis is used by BullMQ to coordinate asynchronous scanning jobs.

---

# Important Redis Development Note

The provided Upstash Redis URL connects everyone using it to the **same Redis instance and BullMQ queue**.

Developers do not need to create Redis locally when using this connection.

However, be careful when multiple developers use the shared Redis instance while using separate local PostgreSQL databases.

For example:

```text
Developer A
Local PostgreSQL A
       |
Worker A ----\
             \
              Shared Upstash Redis
             /
Worker B ----/
       |
Local PostgreSQL B
Developer B
```

BullMQ may give a task created by Developer A's API to Developer B's worker.

Because the workers would be connected to different local PostgreSQL databases, this can cause incorrect or failed result persistence.

### Recommended Prototype Testing

When using the shared development Redis URL with separate local PostgreSQL databases:

- Prefer having only one developer actively running/testing the worker at a time.
- Stop unused worker processes when another teammate is testing.
- Avoid simultaneously submitting independent scans from multiple local databases.

For fully independent simultaneous development, each developer should use a separate Redis instance/queue.

Alternatively, a future shared development environment can use both:

```text
Shared PostgreSQL
+
Shared Redis
```

which allows multiple worker instances to safely consume the same queue.

---

# Resetting the Development Database

If you want to completely reset the local PostgreSQL prototype database, run:

```bash
npx prisma migrate reset
```

**Warning:** This deletes the existing development data.

If the project is currently being synchronized using `prisma db push` rather than migrations, the database may instead be reset manually and synchronized again using:

```bash
npx prisma db push
```

Do not reset a database containing data that needs to be preserved.

---

# Common Problems

## API cannot connect to PostgreSQL

Check:

```env
DATABASE_URL
```

Make sure:

- PostgreSQL is running.
- `tracelink_sprint` exists.
- The username is correct.
- The password is correct.
- PostgreSQL is listening on port `5432`.

---

## Worker shows Redis connection errors

Errors such as:

```text
ETIMEDOUT
ENOTFOUND
ECONNRESET
```

may indicate that the worker temporarily cannot reach the remote Upstash Redis service.

Check:

- Internet connection
- `REDIS_URL`
- Upstash service availability

Because Upstash is remote, the worker requires an internet connection.

---

## Frontend cannot communicate with API

Make sure the API is running:

```bash
node src/index.js
```

Then check:

```text
http://localhost:3000/health
```

The expected response is:

```json
{"status":"ok"}
```

The frontend currently expects the API at:

```text
http://localhost:3000
```

---

## Scan stays at PROCESSING

Make sure the Worker Service is running:

```bash
node src/worker.js
```

The API only creates and queues scan tasks.

The Worker Service performs the actual URL validation.

Without the worker, queued URLs will not be processed.

---

# Development Notes

The current implementation is a prototype and does not represent the complete planned TraceLink platform.

Current development priority:

1. Core batch scanning and technical URL validation
2. Scan results and dashboard
3. Supporting functionality and remaining backlog items

Features outside the current prototype scope may be implemented in later development iterations.

---

# Security

Do not commit any of the following to GitHub:

- `.env`
- PostgreSQL passwords
- Upstash Redis credentials
- API keys
- Other private connection strings

Only `.env.example` should be committed.

If a secret is accidentally committed to GitHub, removing it from the latest commit is not sufficient. The credential should be considered compromised and rotated.

---

# Quick Start Summary

After cloning the repository:

### Backend

```bash
cd tracelink-api
npm install
npx prisma generate
npx prisma db push
node src/index.js
```

### Worker

Open another terminal:

```bash
cd tracelink-api
node src/worker.js
```

### Frontend

Open another terminal:

```bash
cd tracelink-web
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

TraceLink should now be ready for prototype testing.