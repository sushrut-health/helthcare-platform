# Sushrut Healthcare Platform - Setup & Deployment Guide

## 1. System Requirements & Prerequisites

Ensure the following tools are installed in your development environment:

- **Node.js:** v18.0.0 or higher (v20+ or v22 LTS recommended)
- **npm:** v9.0.0 or higher
- **PostgreSQL Database:** Supabase PostgreSQL instance (or local PostgreSQL 14+)
- **Operating System:** Linux, macOS, or Windows (WSL recommended)
- **Git:** Version 2.25+

---

## 2. Repository Architecture Overview

```text
Sushrut/
├── backend/                  # Node.js + Express REST API (/api/v1)
│   ├── src/                  # Controllers, services, repositories, routes
│   ├── tests/                # Automated Node test runner suites
│   ├── package.json
│   └── .env.example
├── frontend/                 # React 18 + Vite + Tailwind CSS (51 pages)
│   ├── src/                  # Layouts, pages, components, context, API client
│   ├── package.json
│   └── vite.config.js
├── database/                 # Tabular SQL migrations & seeds
│   ├── supabase-schema.sql   # Complete Supabase PostgreSQL schema
│   ├── migrations/           # Incremental SQL migration scripts
│   └── seeds/                # Seed datasets
├── storage/                  # Local filesystem storage adapter directory
├── docs/                     # Full technical documentation suite
└── README.md
```

---

## 3. Step-by-Step Installation

### Step 1: Database Setup (Supabase PostgreSQL)

#### Option A: Supabase Cloud (Recommended for Production / Cloud Staging)
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project (e.g., `sushrut-healthcare`).
3. Open the **SQL Editor** from the left navigation.
4. Copy the entire contents of [`database/supabase-schema.sql`](file:///home/gaurang/Sushrut/database/supabase-schema.sql) and execute it.
5. Retrieve your PostgreSQL connection string from **Project Settings > Database > Connection String (URI)**.

#### Option B: Zero-Config Local Development Mode
The backend includes a high-fidelity seeded relational repository (`backend/src/repositories/db.repository.js`) pre-populated with doctors, patients, laboratories, specialties, diagnostic tests, appointments, and medical documents. If `DATABASE_URL` is omitted, the platform boots immediately out-of-the-box in local development mode without requiring an active external database daemon!

---

### Step 2: Backend Setup & Configuration

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Configure the variables inside `backend/.env`:
   ```ini
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=sushrut_dev_super_secret_jwt_key_2026_healthcare_platform
   JWT_EXPIRES_IN=24h

   # Database Connection (Optional for local mock fallback; required for Supabase)
   # DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

   # File Storage Configuration
   STORAGE_DRIVER=local
   STORAGE_LOCAL_DIR=../storage

   # S3 Configuration (Used only when STORAGE_DRIVER=s3)
   S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
   S3_REGION=auto
   S3_BUCKET=sushrut-medical-records
   S3_ACCESS_KEY_ID=your_access_key
   S3_SECRET_ACCESS_KEY=your_secret_key

   CLIENT_ORIGIN=http://localhost:5173
   ```

4. Run the automated backend test suite:
   ```bash
   npm test
   ```
   *Expected output: All test suites pass (7/7).*

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will be live at `http://localhost:5000/api/v1`.
   Health check: `curl http://localhost:5000/api/v1/health`

---

### Step 3: Frontend Setup & Configuration

1. In a new terminal window, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Verify `frontend/.env`:
   ```ini
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application UI will be accessible at:
   `http://localhost:5173`

5. Verify production build:
   ```bash
   npm run build
   ```
   This compiles all 51 React pages into optimized production bundles inside `frontend/dist/`.

---

## 4. Pre-Seeded Demo Credentials & Fast Role Switcher

The application features pre-seeded test accounts for testing each role:

| Role | Email Address | Password | Account Details |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@sushrut.com` | `Password123!` | Aarav Sharma (`PAI100001`) - Has appointments & medical records |
| **Doctor** | `doctor@sushrut.com` | `Password123!` | Dr. Rajesh Mehta (`DOC100001`) - Endocrinologist, 15-min slots |
| **Laboratory** | `lab@sushrut.com` | `Password123!` | Apex Diagnostic Centre (`LAB100001`) - NABL accredited |
| **Administrator** | `admin@sushrut.com` | `Password123!` | Platform Oversight (`ADM100001`) - Approves doctors/labs |

> **Pro Tip:** In development mode, the sticky top banner (**Role Switcher Bar**) enables switching between Patient, Doctor, Laboratory, and Administrator roles with a single click.

---

## 5. Storage Adapter Configuration

### 5.1 Local Filesystem Adapter (`STORAGE_DRIVER=local`)
- Files are saved to the relative directory specified by `STORAGE_LOCAL_DIR` (e.g., `../storage`).
- Files are named using strict spec patterns:
  - Prescriptions: `PAI100001-DIS000001-DOC100001-RPT000001.pdf`
  - Lab Reports: `PAI100001-TST000001-LAB100001-RPT000002.pdf`
- Valid sample PDFs are pre-generated in `storage/` for testing the document viewer.

### 5.2 S3-Compatible Object Storage (`STORAGE_DRIVER=s3`)
- Works with AWS S3, Cloudflare R2, MinIO, or Supabase Storage (S3 API).
- Private bucket: Ensure public access is blocked. Files are securely piped through the backend streaming endpoint `/api/v1/documents/:documentId`.

---

## 6. Verification Checklist

To confirm your installation is functioning end-to-end:

- [x] Backend responds to `GET /api/v1/health` with `{"status":"healthy"}`.
- [x] Backend automated tests pass via `npm test` in `backend/`.
- [x] Frontend builds cleanly via `npm run build` in `frontend/`.
- [x] Public directory loads doctors and diagnostic tests without authentication.
- [x] Patient can browse doctor availability, select a 15-minute slot, and book an appointment.
- [x] Double-booking the same doctor and slot triggers a `409 Conflict`.
- [x] Patient medical records vault allows viewing prescriptions and lab reports via the interactive PDF viewer.
- [x] Doctor portal prompts for consent before revealing patient historical records.
- [x] Admin portal displays pending verification requests for doctors and diagnostic labs.
