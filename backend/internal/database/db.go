package database

import (
	"context"
	"database/sql"
	"log"
	"time"

	_ "github.com/lib/pq"
)

// ConnectDB initializes the PostgreSQL connection with resilient pooling
func ConnectDB(dataSourceName string) (*sql.DB, error) {
	if dataSourceName == "" {
		log.Println("[Database] DATABASE_URL is empty; running in headless mock fallback mode")
		return nil, nil
	}

	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}

	// Connection Pool Settings for high-performance Render deployment
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Printf("[Database Warning] Could not ping PostgreSQL: %v (will retry on requests)\n", err)
	} else {
		log.Println("[Database] Successfully connected to PostgreSQL")
	}

	return db, nil
}
