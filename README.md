# HealthPost Management System — Frontend

An offline-capable, bilingual (English / नेपाली) web app for running Nepal's community **health posts**: registering clients, issuing OPD tickets, referring patients upward, managing staff, and giving patients access to their own records.

Built as a final-year **B.E. Software Engineering** project at Pokhara University.

**Live demo:** <https://healthpost.vercel.app> · **Backend:** [healthpost-management-backend](https://github.com/sangatsharma/healthpost-management-backend)

---

## Why offline-first

Many health posts work on unreliable or intermittent internet. The app is designed so staff can keep working when the connection drops:

| Layer | What it does |
| --- | --- |
| **Service worker** (`public/sw.js`) | Pre-caches the app shell and every portal route in both locales; serves pages network-first with a cache fallback, so the UI still loads offline. Registered after login in `ClientWrapper.tsx`. |
| **Persisted query cache** (`src/lib/idbPersister.ts`) | The TanStack Query cache is persisted to **IndexedDB** for 24 hours, so previously loaded clients, OPD visits and referrals remain readable offline. |
| **Offline write queue** (`src/api/axios.ts`) | An Axios request interceptor detects `POST/PUT/PATCH/DELETE` calls made while offline and stores them in an IndexedDB `offline-mutations` store instead of failing. `FormData` (including file uploads) is serialized to base64 so attachments survive the queue. |
| **Review & sync** | Queued client registrations and OPD records appear under an **Offline** tab on their pages. Once back online, staff review each record and sync it to the server; synced entries are removed from the queue. |
| **Connectivity indicator** (`OfflineIndicator.tsx`) | Shows online / offline state so staff know when they are working from the local queue. |

## Features

**Three portals, one app**, selected by role after login:

- **Admin portal** (`/admin`): dashboard, create and manage health posts, assign health-post admins, manage staff and permissions, compose emails with a rich-text editor (Tiptap).
- **Health Post portal** (`/hp`): client (patient) registration as a multi-step form (personal, address, family, health and banking info), OPD registration with printable OPD tickets, referrals with printable referral slips, medical history, laboratory, and staff management.
- **Patient portal** (`/patient`): profile, medical history, reports, medications, vaccinations, pregnancy tracking, chronic conditions and reminders.

**Built for Nepal**

- English and Nepali UI via `next-intl` (`messages/en.json`, `messages/np.json`), with localized numerals.
- Bikram Sambat (B.S.) dates and a Nepali date picker.
- PDF export in Devanagari (jsPDF with embedded Noto Sans Devanagari) and Excel export for tables.

**Access control**: staff roles mirror real health-post positions (Health Assistant, ANM, Lab Technician, FCHV, Inventory Keeper, …) with resource-level read/write permissions checked in the UI via `useHasPermission`.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 15 (App Router), React 18, TypeScript |
| UI | Tailwind CSS, shadcn/ui (Radix), lucide-react, Recharts, Tiptap |
| Data | TanStack Query (with IndexedDB persistence via `idb`), Axios, TanStack Table |
| State & forms | Zustand, React Hook Form, Zod |
| i18n & locale | next-intl, bikram-sambat-js, nepali-datepicker-reactjs |
| Export | jsPDF, jspdf-autotable, react-export-table-to-excel |
| Tooling | ESLint, Prettier, Husky (lint-staged, commit-message check, pre-push lint and build) |

## Getting started

**Prerequisites:** Node.js 18+ and a running instance of the [backend API](https://github.com/sangatsharma/healthpost-management-backend).

```bash
git clone https://github.com/sangatsharma/healthpost-management-frontend.git
cd healthpost-management-frontend
npm install
```

Create a `.env` file in the project root:

```env
# Base URL of the backend API, including the /api prefix
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Run it:

```bash
npm run dev      # http://localhost:3000, redirects to /en or /np
```

> Authentication uses httpOnly cookies set by the backend, so the backend's CORS `origin` list must include the URL the frontend is served from (`http://localhost:3000` is allowed by default).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Project structure

```
messages/                 en.json / np.json translations
public/
  sw.js                   service worker (app-shell and route caching)
  manifest.json           PWA manifest
src/
  app/[locale]/
    admin/                admin portal (dashboard, healthpost, staffs, email)
    hp/                   health-post portal (clients, opd-section, referrals, laboratory, medicalhistory, staffs)
    patient/              patient portal
  api/                    axios instance (offline queue), queries, mutations, query keys
  components/             shared components, data-table, block-editor, sidebar, shadcn/ui
  hooks/                  auth, permissions, localized numbers, typed translations
  i18n/                   next-intl routing and request config
  lib/                    query client, IndexedDB persister, validators, utils
  provider/               React Query, auth and health-post providers
  schemas/                Zod schemas per portal
  zustand/                user, permission and alert stores
  middleware.ts           locale detection and redirect
```


## Team

| Member | Role |
| --- | --- |
| [Sangat Sharma](https://github.com/sangatsharma) | Frontend lead: architecture, offline support, portals, i18n |
| [Saurav Dhakal](https://github.com/sauravdhakal12) | Backend API |
| [Sudip KC](https://github.com/sudipkc3) | Frontend contributor |
| [Sandesh Baral](https://github.com/Sandesh-baral) | Frontend contributor |
