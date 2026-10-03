# FEBROS16 — Go (Golang) Backend & OAuth 2.0 Integration

Huu ni mfumo wa Backend uliotengenezwa kwa **Go (Golang)** ukitumia standard library ya `database/sql` kwa ajili ya mawasiliano na hifadhidata ya **PostgreSQL**.

---

## 1. Muundo wa Mafaili (Project Structure)

```text
backend/
├── go.mod                                              # Go dependencies
├── .env.example                                        # Environment template
├── README.md                                           # Maelekezo ya matumizi
├── migrations/
│   ├── 000002_add_google_oauth_columns.up.sql         # SQL Migration kuongeza Google OAuth
│   └── 000002_add_google_oauth_columns.down.sql       # SQL Rollback
├── internal/
│   └── auth/
│       └── oauth.go                                    # OAuth handlers & database/sql logic
└── cmd/
    └── server/
        └── main.go                                     # HTTP Server & Router entrypoint
```

---

## 2. Jinsi ya Kuendesha Migration (Database Migration)

Tumia faili la `migrations/000002_add_google_oauth_columns.up.sql` kwenye PostgreSQL yako:

```bash
psql $DATABASE_URL -f migrations/000002_add_google_oauth_columns.up.sql
```

Query hii inafanya mambo yafuatayo:
1. Inaondoa `NOT NULL` kwenye column ya `password` ili kuruhusu watumiaji wa Google kuingia bila nenosiri.
2. Inaongeza `google_id VARCHAR(255) UNIQUE`.
3. Inaongeza `avatar_url TEXT` kuhifadhi picha ya mtumiaji kutoka Google.
4. Inaongeza indexes kwa `google_id` na `email` kwa ajili ya kasi ya utafutaji.

---

## 3. Endpoints za Google OAuth

* **Kuanza Kuingia (Login Redirect):**
  `GET /api/auth/google/login`
  - Inatengeneza CSRF state token salama.
  - Inamhifadhia mtumiaji `HttpOnly` cookie.
  - Inam-redirect kwenda ukurasa wa idhini wa Google (*Google Consent Screen*).

* **Kupokea Majibu (Callback):**
  `GET /api/auth/google/callback?code=...&state=...`
  - Inathibitisha usalama wa state token.
  - Inabadilisha code kuwa token ya Google.
  - Inavuta taarifa za mtumiaji kutoka Google (`https://www.googleapis.com/oauth2/v2/userinfo`).
  - Inatafuta kwenye `users` meza:
    - Akikuwepo kwa `google_id`: Inasasisha avatar.
    - Akikuwepo kwa `email`: Inamuunganisha na `google_id`.
    - Asipokuwepo kabisa: Inamsajili upya.
  - Inatengeneza JWT Token ya mfumo ya siku 7.
  - Inam-redirect kwenda `$FRONTEND_URL/auth/callback?token=<JWT_TOKEN>`.

---

## 4. Jinsi ya Kuendesha Server

1. Tengeneza `.env` kutoka kwenye `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Sakinisha vifurushi (Dependencies):
   ```bash
   go mod tidy
   ```
3. Anzisha Server:
   ```bash
   go run cmd/server/main.go
   ```
   Server itawaka kwenye port `8080` (au ile uliyoiweka kwenye `PORT`).
