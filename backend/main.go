package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/febros16/backend/internal/database"
	"github.com/febros16/backend/internal/handlers"
)

// CORSMiddleware enables secure cross-origin requests from the Next.js frontend
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "*"
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// RequestLogger logs incoming HTTP requests
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("[%s] %s %s (%s)", r.Method, r.URL.Path, r.RemoteAddr, time.Since(start))
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	databaseURL := os.Getenv("DATABASE_URL")
	db, err := database.ConnectDB(databaseURL)
	if err != nil {
		log.Printf("[Database Warning] Failed to connect: %v\n", err)
	}
	if db != nil {
		defer db.Close()
	}

	mux := http.NewServeMux()

	// Root Index Route
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{
			"service": "FEBROS16 REST API",
			"status":  "operational",
			"version": "1.0.0",
			"docs":    "/api/v1/health",
		})
	})

	// API v1 Routes
	mux.HandleFunc("/api/v1/health", handlers.HealthCheckHandler)
	mux.HandleFunc("/api/v1/stats", handlers.StatsHandler(db))
	mux.HandleFunc("/api/v1/search", handlers.SearchHandler(db))
	mux.HandleFunc("/api/v1/categories", handlers.CategoriesHandler(db))
	mux.HandleFunc("/api/v1/newsletter", handlers.NewsletterHandler(db))

	// Chain middlewares: CORS -> RequestLogger -> Mux
	handler := CORSMiddleware(RequestLogger(mux))

	server := &http.Server{
		Addr:         fmt.Sprintf("0.0.0.0:%s", port),
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Server startup in background goroutine
	go func() {
		log.Printf("==================================================")
		log.Printf(" FEBROS16 Backend Server is listening on port %s", port)
		log.Printf(" Health Check: http://localhost:%s/api/v1/health", port)
		log.Printf("==================================================")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown handling (SIGINT, SIGTERM)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down FEBROS16 server gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("FEBROS16 server exited cleanly.")
}
