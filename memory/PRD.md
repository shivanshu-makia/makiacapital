# Makia Capital Website — PRD

## Original Problem Statement
Build a complete website combining pre-designed React pages: Homepage, About Us, Pitch to Us, and Insights. Pages linked via React Router. Makia logo included globally. Backend captures and manages leads from "Pitch to Us" section. Admin Dashboard with login to view/manage leads (email notifications deferred for cost savings).

## Architecture
- **Frontend**: React + React Router DOM + Tailwind CSS (inline styles)
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **Auth**: JWT (httpOnly cookies + Bearer header fallback) + bcrypt

## What's Been Implemented

### Pages (Frontend)
- **Homepage** (`/`) — Hero, numbers, sectors marquee, portfolio, investment focus, services, testimonials, knowledge hub (linked to Insights data), FAQ, CTA, footer
- **About Us** (`/about`) — Hero, our perspective, investment thesis, founders, leadership, transactions, disclosures, CTA, footer
- **Pitch to Us** (`/pitch`) — 4-step multi-step form (Basic Info → Business Overview → Financials → Fundraise Intent) with POST to `/api/leads`
- **Insights** (`/insights`) — Article list with filter tabs (All/Newsletter/Research/Blog), article detail view with rich content (tables, geo grid, case studies, bullet lists)
- **Admin Login** (`/admin/login`) — Email/password login form for admin
- **Admin Dashboard** (`/admin`) — Protected. Stats cards, leads table with expandable rows, status filter, status change dropdown, logout

### Backend API
- `POST /api/leads` — Public. Create lead from pitch form
- `GET /api/leads` — Protected. List all leads with optional status filter
- `GET /api/leads/stats/summary` — Protected. Lead count by status
- `GET /api/leads/{id}` — Protected. Single lead detail
- `PATCH /api/leads/{id}` — Protected. Update lead status/notes
- `DELETE /api/leads/{id}` — Protected. Delete lead
- `POST /api/auth/login` — Login with email/password, sets JWT cookies
- `GET /api/auth/me` — Get current user from token
- `POST /api/auth/logout` — Clear auth cookies
- `POST /api/auth/refresh` — Refresh access token

### Data & Assets
- Shared article data in `/app/frontend/src/data/insightsData.js` (used by both Homepage Knowledge Hub and Insights page)
- Logo images in `/app/frontend/public/images/` (transparent backgrounds)
- Admin seeded on backend startup from .env credentials

## DB Schema
- **leads**: {id, company, website, sector, name, email, phone, pitch_mode, deck_filename, what_do, biz_model, customers, problem, differentiator, revenue, ebitda, fy, run_rate, services[], raise_amount, status, notes, created_at, updated_at}
- **users**: {email, password_hash, name, role, created_at}
- **login_attempts**: {identifier, count, locked_until}

## Testing Status
- Backend: 32/32 tests passed (iteration_1)
- Frontend: All UI flows verified
- Auth: Login/logout/protected routes all working

## Backlog
- **P1**: Content Management API — POST/GET /api/insights for managing content via admin dashboard
- **P2**: Email notifications (SendGrid) — deferred per user request
- **P2**: Additional test coverage and regression tests
