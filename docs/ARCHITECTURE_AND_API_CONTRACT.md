# FEBROS16 — ARCHITECTURE, API CONTRACT & INTEGRATION ROADMAP

## 1. System Architecture Overview

```text
                               FEBROS16.COM
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
                 VERCEL                          RENDER
          Next.js / TypeScript / React        Go / Golang REST API
          Tailwind CSS Frontend               Business Logic & Auth
                    │                               │
                    └────────── HTTPS API ──────────┘
                                    │
                                    ▼
                               POSTGRESQL
                           Relational Database
```

* **Domain**: `febros16.com`
* **Frontend**: Next.js + TypeScript + Tailwind CSS (Hosted on Vercel)
* **Backend**: Go / Golang RESTful API (Hosted on Render)
* **Database**: PostgreSQL (Managed relational database)

---

## 2. API Contract Specification (`/api/v1`)

The frontend communicates with the Go backend via standard JSON REST endpoints over HTTPS.

### Configuration
* **Frontend Env Variable**: `NEXT_PUBLIC_API_URL` (in Next.js) or `VITE_API_URL` (in Vite/development)
* **Default**: `https://api.febros16.com`
* **CORS**: Go backend must allow `https://febros16.com` and Vercel preview deployment origins.

---

### Endpoint Specifications

#### 1. System Health & Ping
```http
GET /api/v1/health
```
* **Authentication**: None
* **Response (200 OK)**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-10-03T07:45:00Z",
  "database": "connected"
}
```

#### 2. Hero Statistics
```http
GET /api/v1/stats
```
* **Authentication**: None
* **Response (200 OK)**:
```json
{
  "stats": [
    { "id": "articles", "label": "Articles", "value": "100+", "count": 100, "description": "Peer-reviewed articles, in-depth guides & analytical essays" },
    { "id": "resources", "label": "Resources", "value": "50+", "count": 50, "description": "Open-access toolkits, datasets, research repositories & templates" },
    { "id": "opportunities", "label": "Opportunities", "value": "20+", "count": 20, "description": "International grants, fellowships, academic calls & programs" },
    { "id": "campaigns", "label": "Campaigns", "value": "10+", "count": 10, "description": "Public awareness, scientific outreach & educational initiatives" }
  ]
}
```

#### 3. Search Engine
```http
GET /api/v1/search?q={query}&type={type}&limit=20
```
* **Parameters**:
  * `q` (string): Query terms
  * `type` (enum): `all` | `article` | `research` | `resource` | `opportunity` | `campaign`
  * `limit` (integer, default 20)
* **Response (200 OK)**:
```json
{
  "query": "quantum",
  "total": 4,
  "results": [
    {
      "id": "art-01",
      "title": "The Architecture of Autonomous Knowledge Synthesis Systems",
      "description": "A comprehensive study on structuring verifiable research repositories...",
      "category": "Technology",
      "type": "article",
      "date": "Oct 2026",
      "authorOrSource": "Febros16 Editorial Board",
      "badge": "Core Article",
      "url": "/articles/art-01"
    }
  ]
}
```

#### 4. Categories Listing
```http
GET /api/v1/categories
```
* **Response (200 OK)**:
```json
{
  "categories": [
    {
      "id": "education",
      "name": "Education",
      "slug": "education",
      "description": "Pedagogical frameworks, higher education reforms, digital curricula...",
      "itemCount": 42,
      "featuredTopics": ["Open Courseware", "Pedagogical Design", "Higher Ed Policy"],
      "accentColor": "#3b82f6",
      "icon": "GraduationCap"
    }
  ]
}
```

#### 5. User Authentication
```http
POST /api/v1/auth/register
POST /api/v1/auth/login
```
* **Request Body**:
```json
{
  "email": "user@institution.edu",
  "password": "SecurePassword123!",
  "name": "Dr. Jane Cooper",
  "role": "researcher"
}
```
* **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "usr_948194",
    "name": "Dr. Jane Cooper",
    "email": "user@institution.edu",
    "role": "researcher"
  }
}
```

---

## 3. Implementation Roadmap

### Phase 1 — Foundation (Completed)
* Landing page with responsive cinematic mountain sunrise hero
* Top Navigation following Top Bar Contract with mobile touch menu
* Prominent search bar with real query handling and keyboard shortcut (`⌘K`)
* 6 Glassmorphic feature cards with action links
* "Explore by category" 8-card responsive section with clean light theme
* Research workflow visualization (Discover → Collect → Organize → Analyze → Report)
* Platform initiatives & campaigns showcase (including Project OO24)
* Modular API client with resilient Go backend fallback

### Phase 2 — Go Backend Core API (Next Milestone)
* Initialize Go HTTP router (`chi` or standard library)
* Connect to PostgreSQL via `pgx` with connection pooling
* Run initial database migrations (`users`, `categories`, `content`, `research_projects`)
* Implement `/api/v1/health`, `/api/v1/stats`, and `/api/v1/categories`

### Phase 3 — Authentication & Research Projects Workspace
* JWT authentication and bcrypt password hashing
* CRUD for Research Projects: Research questions, verified sources, notes, and findings
* Source citation verification API
