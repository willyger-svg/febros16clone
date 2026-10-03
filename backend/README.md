# FEBROS16 — Golang Backend Service

Hii ni nakala kamili ya **Backend ya FEBROS16** iliyoandikwa kwa lugha ya **Go (Golang)**, tayari kuunganishwa na database ya **PostgreSQL** na ku-deploy kwenye seva ya **Render**.

---

## 1. Muundo wa Mafaili ya Backend

```text
backend/
├── main.go                     # Seva kuu, CORS middleware, na routing
├── go.mod                      # Mipangilio ya module ya Go
├── Dockerfile                  # Multi-stage Docker image kwa ajili ya Render
├── .env.example                # Mfano wa variables za mazingira
├── internal/
│   ├── database/
│   │   └── db.go               # Muunganisho wa PostgreSQL na connection pooling
│   └── handlers/
│       └── handlers.go         # Logic ya endpoints (Health, Stats, Search, n.k.)
└── migrations/
    └── 001_init.sql            # SQL schema na mbegu za awali (seeds)
```

---

## 2. Jinsi ya Kuanzisha Seva (Local Development)

### Hatua ya 1: Weka Environment Variables
```bash
cp .env.example .env
```

### Hatua ya 2: Anzisha Database ya PostgreSQL
Unaweza kutumia PostgreSQL iliyopo kwenye mashine yako au Docker:
```bash
psql -U postgres -d febros16_db -f migrations/001_init.sql
```

### Hatua ya 3: Washa Seva ya Go
```bash
go run main.go
```
Seva itawaka kwenye: `http://localhost:8080`

---

## 3. Endpoints Zilizopo (`/api/v1`)

| Method | Endpoint | Maelezo | Mfano wa Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Kuangalia afya ya mfumo | `{"status":"success","version":"1.0.0"}` |
| `GET` | `/api/v1/stats` | Jumla ya makala na tafiti | `{"articles_count":100,"projects_count":25}` |
| `GET` | `/api/v1/search?q=query` | Kutafuta makala na tafiti (ILIKE) | `{"query":"quantum","count":1,"data":[...]}` |
| `GET` | `/api/v1/categories` | Orodha ya vitengo 8 vya elimu | `{"categories":[...]}` |
| `POST` | `/api/v1/newsletter` | Kujiandikisha kwenye Dispatch | `{"status":"success"}` |

---

## 4. Ku-deploy kwenye Render

1. Kwenye dashboard ya Render, fungua **New Web Service**.
2. Unganisha GitHub repository hii ya `FEBROS16`.
3. Weka:
   - **Root Directory**: `backend`
   - **Environment**: `Docker` (au `Go`)
   - **Build Command**: `go build -o febros16-server main.go`
   - **Start Command**: `./febros16-server`
4. Ongeza Environment Variable:
   - `DATABASE_URL`: Weka link ya PostgreSQL kutoka Render database.
