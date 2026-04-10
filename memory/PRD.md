# Makia Capital Website — PRD

## Original Problem Statement
Build a complete website combining pre-designed React pages: Homepage, About Us, Pitch to Us, and Insights. Pages linked via React Router. Makia logo included globally. Backend captures and manages leads from "Pitch to Us" section. Admin Dashboard with login to view/manage leads (email notifications deferred for cost savings).

## Architecture
- **Frontend**: React + React Router DOM + Tailwind CSS (inline styles + media query classes)
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **Auth**: JWT (httpOnly cookies + Bearer header fallback) + bcrypt

## What's Been Implemented

### Pages (Frontend) — All Mobile Responsive
- **Homepage** (`/`) — Hero, numbers, sectors marquee, portfolio, investment focus, services, testimonials, knowledge hub (shared data with Insights), FAQ, CTA, footer
- **About Us** (`/about`) — Hero, perspective, thesis, founders, leadership, transactions, disclosures, CTA, footer. Mobile hamburger menu
- **Pitch to Us** (`/pitch`) — 4-step multi-step form with POST to /api/leads
- **Insights** (`/insights`) — Article list with filter tabs, article detail with rich content. Mobile hamburger menu
- **Admin Login** (`/admin/login`) — Email/password login
- **Admin Dashboard** (`/admin`) — Protected. Stats, leads table, status management, logout

### Mobile Responsiveness (Feb 2026)
- All pages: Section paddings collapse (100px→48px, 48px→20px horizontal)
- Grids: Multi-column layouts stack to single column on <768px
- Nav: Hamburger menus on all pages (Home, About, Insights)
- Typography: Headlines scale down (42px→26-30px)
- Tables: Horizontal scroll on overflow
- Footer: Stacks vertically, centered text
- Insights tabs: Horizontal scroll, smaller padding
- Detail stats: 2-column grid on mobile
- "Made with Emergent" badge removed

### Backend API
- `POST /api/leads` — Public. Create lead
- `GET /api/leads` — Protected. List leads
- `GET /api/leads/stats/summary` — Protected. Stats by status
- `GET/PATCH/DELETE /api/leads/{id}` — Protected. CRUD
- `POST /api/auth/login` — Login with JWT
- `GET /api/auth/me` — Current user
- `POST /api/auth/logout` — Clear cookies
- `POST /api/auth/refresh` — Refresh token

### Assets
- Logo images with transparent backgrounds in `/public/images/`
- Shared article data in `/src/data/insightsData.js`
- Admin seeded on startup from .env

## DB Schema
- **leads**: {id, company, website, sector, name, email, phone, pitch_mode, deck_filename, what_do, biz_model, customers, problem, differentiator, revenue, ebitda, fy, run_rate, services[], raise_amount, status, notes, created_at, updated_at}
- **users**: {email, password_hash, name, role, created_at}
- **login_attempts**: {identifier, count, locked_until}

## Testing
- Backend: 32/32 passed (iteration_1)
- Frontend: All UI flows verified
- Mobile: Verified on 390px viewport (iPhone 14 size)

## Backlog
- **P1**: Content Management API — POST/GET /api/insights for admin dashboard
- **P2**: Email notifications (deferred per user request)
- **P2**: Additional test coverage
