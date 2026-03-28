package lib

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"kochfeinde.com/api/internal/repository"
)

var Pool *pgxpool.Pool
var Repo *repository.Queries

func ConnectToDB(url string) {
	var err error
	config, err := pgxpool.ParseConfig(url)
	if err != nil {
		log.Fatalf("failed to parse db url: %v", err)
	}
	config.MaxConnLifetime = 30 * time.Minute
	config.MaxConns = 20
    config.MinConns = 2

    Pool, err = pgxpool.NewWithConfig(context.Background(), config)
    if err != nil {
        log.Fatalf("failed to create db pool: %v", err)
    }

    Repo = repository.New(Pool) // sqlc supports pgxpool.Pool
}

func Close() {    
	if Pool != nil {
        Pool.Close()
    }
}