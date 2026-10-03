package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"febros16/backend/internal/auth"

	_ "github.com/lib/pq"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Println("WARNING: DATABASE_URL is not set. Ensure it is defined before running production queries.")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to initialize database connection: %v", err)
	}
	defer db.Close()

	// Initialize OAuth Service
	oauthService := auth.NewOAuthService(db)

	mux := http.NewServeMux()

	// Health Check
	mux.HandleFunc("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy","service":"febros16-backend"}`))
	})

	// Google OAuth 2.0 Endpoints
	mux.HandleFunc("/api/auth/google/login", oauthService.HandleGoogleLogin)
	mux.HandleFunc("/api/auth/google/callback", oauthService.HandleGoogleCallback)

	// Wrap with basic CORS middleware
	handler := corsMiddleware(mux)

	log.Printf("FEBROS16 Backend Server listening on port %s...", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
