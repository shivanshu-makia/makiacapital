# Makia Capital Website — PRD

## Original Problem Statement
Complete website with Homepage, About Us, Pitch to Us, Insights pages + Markdown Blog CMS + Admin Dashboard + Formspree email notifications. SEBI Registered AIF, Investment Banking.

## Architecture
- **Frontend**: React (CRA + Craco) + React Router DOM + Inline styles with media queries
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **Auth**: JWT + bcrypt
- **Blog CMS**: Markdown files in `/public/content/blogs/` + build-time index generation
- **Form Notifications**: Formspree (https://formspree.io/f/xbdwjejg) + Backend API

## What's Been Implemented

### Pages
- `/` — Homepage (hero, numbers, sectors, portfolio, services, testimonials, knowledge hub, FAQs, CTA)
- `/about` — About Us (perspective, thesis, founders, leadership, process, disclosures)
- `/pitch` — Pitch To Us (4-step form → saves to MongoDB + emails via Formspree)
- `/insights` — Insights listing (rich posts from insightsData.js + markdown blog posts from blog-index.json)
- `/insights/:slug` — Individual insight/blog post pages (handles both rich POSTS and markdown blogs via unified route)
- `/admin/login` — Admin login
- `/admin` — Admin dashboard (lead stats, table, status management)

### Unique URL Routing for All Insights (Fixed May 2026)
- All insight types (Newsletter, Research, Blog) now navigate to unique URLs `/insights/:slug`
- Rich posts (Newsletter/Research) from `insightsData.js` have `slug` field
- `BlogPostPage.jsx` handles both rich posts (data-driven) and markdown blog posts (fetched at runtime)
- Nonexistent slugs show "Post not found" with Back to Insights link
- SPA fallback detection: checks fetched content isn't HTML before treating as markdown

### Blog CMS
- Markdown files in `/public/content/blogs/*.md`
- Frontmatter: title, slug, date, excerpt, coverImage, category, author, published
- Build script (`scripts/build-blog-index.js`) generates `blog-index.json` at build time
- Only `published: true` posts appear on the site
- Sample posts: Vol. 01 (published), Vol. 02 (draft)

### Formspree Integration
- Pitch form POSTs to both backend API AND Formspree
- Emails shivanshu@makiacapital.com on every submission
- Viewable on Formspree dashboard

### Backend API
- POST /api/leads (public), GET/PATCH/DELETE /api/leads (protected)
- GET /api/leads/stats/summary (protected)
- POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout, POST /api/auth/refresh

### Mobile Responsive
All pages fully responsive at 390px viewport

### Deployment
- `vercel.json` in `/frontend/` for Vercel deployment
- Build: `node scripts/build-blog-index.js && NODE_OPTIONS=--openssl-legacy-provider craco build`

## DB Schema
- **leads**: {id, company, website, sector, name, email, phone, pitch_mode, services[], status, notes, etc.}
- **users**: {email, password_hash, name, role, created_at}
- **login_attempts**: {identifier, count, locked_until}

## How to Add New Blog Posts
1. Create a `.md` file in `/frontend/public/content/blogs/`
2. Add frontmatter (title, slug, date, excerpt, coverImage, category, author, published)
3. Write content in markdown
4. Push to GitHub and redeploy — the build script auto-generates the index

## Backlog
- **P1**: E2E testing for Lead Submission → Admin Dashboard flow
- **P2**: Email notifications via backend (SendGrid/Resend) — deferred
- **P2**: Admin dashboard Insights management tab
- **P2**: Social sharing buttons on insight detail pages
