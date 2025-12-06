# BACKEND — Project Demock Requirements

This document defines the backend requirements to support the frontend of this clinic. Focus on priority routes and ignore any finance/financial scope. Protected routes must use **Better Auth** based authentication.


## Overview
- Suggested Base URL: `https://api.your-clinic.com`
- API Version: `/api` prefix (no explicit versioning in the URL)
- Format: JSON by default; uploads via `multipart/form-data`.
- Suggested Time zone: `America/Fortaleza` (configurable); all times in ISO 8601 with offset.
- Message Language: en-US.


## Architecture and Database Technologies
- **Database**: SQLite.
- **ORM**: Drizzle ORM.
- **Data Access Pattern**: Repository Pattern with separation of interfaces and implementations.
  - **Structure**: Each entity or domain should have its repository interface (e.g., `IUserRepository.ts`, `IPatientRepository.ts`) and its concrete implementation using Drizzle (e.g., `DrizzleUserRepository.ts`, `DrizzlePatientRepository.ts`).
  - **Goal**: Desacoplar business logic from specific database implementation.


## Authentication and Authorization
- Scheme: **Better Auth** — a complete authentication library.
- Authentication Routes: Better Auth automatically manages routes based on `/api/auth/*` (e.g., `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/sign-out`, `/api/auth/get-session`).
- Client: The frontend uses the Better Auth client to manage sessions and tokens.
- Backend Verification: The backend uses Better Auth's server-side utilities to validate the session for each protected request.
- Profiles (suggestion): `admin`, `professional`, `attendant` (stored in user metadata or a linked table).

Notes:
- Login, registration, logout, password recovery, and email verification flows are native to Better Auth.

Current User (protected):
- GET `/api/auth/get-session` — Returns the current session and user (Better Auth Route).
- PATCH `/api/me` — updates basic profile (if there are custom fields beyond those managed by Better Auth).


## API Conventions
- Pagination: `?page=1&limit=20`
- Ordering: `?sort=field&order=asc|desc`
- Text Search: `?q=<term>`
- Field Filters: `?status=...&startDate=...&endDate=...`
- Paginated Response:
  ```json
  {
    "data": [],
    "meta": { "page": 1, "limit": 20, "total": 135 }
  }
  ```
- Errors:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Required field missing.",
      "details": [{ "path": "cpf", "message": "Invalid CPF" }]
    }
  }
  ```
- Uploads: `multipart/form-data` with `file` field.


## Main Entities (priority)
1) Users/Professionals (Integrated with Better Auth)
2) Patients
3) Appointments (Professional's Schedule)
4) Medical Record (Patient Timeline: consultations, evaluations, attachments, observations)
5) Anamnesis (patient form)
6) Tasks
7) Reports (non-financial operational summaries)
8) Configurations (basic)
9) Agreements (Insurance/Health Plans)


## 1) Users and Professionals
- **User (Better Auth)**: Managed by the library. Standard fields: `id`, `email`, `name`, `emailVerified`, `image`, `createdAt`, `updatedAt`.
- `Professional` (subtype or profile): `id`, `userId`, `name`, `specialties[]`, `professionalRegistration?`, `phone?`, `scheduleConfig` (e.g., standard hours, slot duration, holidays).

Routes:
- Basic user creation/editing routes are managed by Better Auth (`/api/auth/*`).
- GET `/api/users` [admin] — list users (pagination, `role`)
- GET `/api/users/:id` [admin]
- PATCH `/api/users/:id` [admin] — for non-native or administrative fields.
- DELETE `/api/users/:id` [admin]
- GET `/api/professionals` — list professionals and basic fields
- GET `/api/professionals/:id` — details and `scheduleConfig`
- PATCH `/api/professionals/:id` — update professional data


## 2) Patients
From the frontend, there is a list/kanban, date filter, CRUD, and visual status related to the service flow.

Suggested `Patient` Model:
- `id`, `name`, `cpf`, `dateOfBirth`, `gender?`, `phone?`, `agreementId?`, `address?`, `city?`,
  `responsibleName?`, `responsiblePhone?`, `createdAt`, `updatedAt`

Routes:
- GET `/api/patients` — `?q`, `?page`, `?limit`, filters: `?startDate`, `?endDate`
- GET `/api/patients/:id`
- POST `/api/patients` — creates patient
- PATCH `/api/patients/:id`
- DELETE `/api/patients/:id`
- GET `/api/patients/:id/files` — list attachments
- POST `/api/patients/:id/files` — upload `multipart/form-data`
- DELETE `/api/patients/:id/files/:fileId`

Note: The "statuses" displayed in the frontend Kanban (Scheduled, In Service, Finished, Canceled) are better represented as appointment states, not patient states. The backend should expose these statuses via Appointment resources.


## 3) Appointments (Professional's Schedule)
- Connects `professionalId` and `patientId` with a time interval.
- Status: `Scheduled | Confirmed | InService | Finished | Canceled | Missed`
- Fields: `id`, `professionalId`, `patientId`, `start` (ISO), `end` (ISO), `title?`, `description?`, `status`, `location?`, `createdBy`, `updatedAt`.

Routes:
- GET `/api/appointments` — filters: `professionalId`, `patientId`, `startDate`, `endDate`, `status[]`
- GET `/api/appointments/:id`
- POST `/api/appointments` — creates (validate conflicts/overlaps in the professional's schedule)
- PATCH `/api/appointments/:id` — reschedule/update data
- PATCH `/api/appointments/:id/status` — quickly update status
- DELETE `/api/appointments/:id` — cancel/delete
- GET `/api/professionals/:id/schedule` — view by professional (slots, availability)
- GET `/api/professionals/:id/availability` — returns calculated free slots

Suggested Rules:
- Time overlap validation by `professionalId`.
- Default session duration (e.g., 30–60 min) from `scheduleConfig`.


## 4) Medical Record (Timeline)
Events per patient, as in the frontend (Timeline):
- Types: `Consultation | Evaluation | Attachment | Observation`
- Fields: `id`, `patientId`, `date` (ISO, date/time), `type`, `title`, `description?`, `attachmentUrl?`, `attachmentName?`, `createdBy`, `createdAt`.

Routes:
- GET `/api/patients/:id/medical-record` — list events in descending order of `date`
- POST `/api/patients/:id/medical-record` — creates event (for `Attachment`, use upload + metadata)
- PATCH `/api/patients/:id/medical-record/:eventId`
- DELETE `/api/patients/:id/medical-record/:eventId`
- POST `/api/patients/:id/medical-record/:eventId/attachment` — `multipart/form-data`


## 5) Anamnesis
- One anamnesis form (or versions) per patient.
- Main fields derived from the frontend form (examples):
  - `mainComplaint`, `hda`, `hmp`, `gestationDelivery`, `psychomotorDevelopment`, `familyHistory`,
    `medicationsAllergies`, `clinicalDiagnosis`, `evaluationDate`, vital signs (`bp`, `hr`),
    boolean groups (diseases/antecedents), habits and conditions (`ap*`).

Routes:
- GET `/api/patients/:id/anamnesis` — returns the latest version
- PUT `/api/patients/:id/anamnesis` — creates/updates (upsert)
- GET `/api/patients/:id/anamnesis/history` — optional: previous versions


## 6) Tasks
- Simple tasks related to the user/professional (non-financial).
- `id`, `title`, `description?`, `status: Pending|Completed|Canceled`, `assignedToUserId?`, `dueDate?`, `createdAt`, `updatedAt`.

Routes:
- GET `/api/tasks` — filters: `status`, `assignedToUserId`, `dueDateUpTo`
- POST `/api/tasks`
- PATCH `/api/tasks/:id`
- DELETE `/api/tasks/:id`


## 7) Reports (non-financial)
- Operational summary for dashboard widgets (e.g., "Today's Summary", "Monthly Goals").

Suggested Routes:
- GET `/api/reports/today` — `{ confirmedAppointments, pendingConfirmations, completedServices }`
- GET `/api/reports/goals` — configurable qualitative/quantitative goals
- GET `/api/reports/upcoming-appointments` — compact list (next few hours)


## 8) Configurations
- Basic app configurations and auxiliary registrations (non-financial):
  - `specialties`, `serviceLocations`, clinic holidays, standard session duration, etc.

Routes:
- GET `/api/config`
- PATCH `/api/config` [admin]
- GET `/api/specialties`
- POST `/api/specialties` [admin]
- DELETE `/api/specialties/:id` [admin]


## 9) Agreements
- Registration of accepted health agreements.
- Model: `id`, `name`, `cnpj?`, `ansRegistration?`, `active` (boolean).

Routes:
- GET `/api/agreements` — List all (with pagination, `?q=...` for search)
- POST `/api/agreements` [admin] — Add new agreement
- PATCH `/api/agreements/:id` [admin] — Update agreement data
- DELETE `/api/agreements/:id` [admin] — Deactivate or remove agreement


## Uploads/Files
- For `Medical Record` and `Patient` attachments.
- Permitted types (pdf, jpg, png); max size (e.g., 10MB).


## API Health and Utilities
- GET `/health` — public → `{ status: "ok", version: "1.0" }`
- GET `/api/version` — protected → build information


## Final Notes
- This project is for educational purposes. Therefore, solutions that overcomplicate development or introduce unnecessary complexity should be avoided.
- Financial scope is explicitly out of scope for this document.
- This guide covers the flows present in the current frontend (patients, schedule, medical record, anamnesis, tasks, basic reports, and configurations).
- Fine adjustments to fields can be made during integration as screens evolve.
