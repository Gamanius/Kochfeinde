package main

import (
	"log"
	"net/http"
	"os"

	"kochfeinde.com/api/internal/lib"
	"kochfeinde.com/api/internal/middleware"
	"kochfeinde.com/api/internal/spec"
)

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Handle preflight
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}


func main() {	
	dbURL := os.Getenv("DATABASE_URL")
	lib.ConnectToDB(dbURL)
	defer lib.Close()
	
	apihandler, err := spec.InitHandler()
	

	if err != nil {
		panic("Could not init");
	}

	httpServer := http.Server{
		Addr:    ":8080",
		Handler: middleware.Logging(withCORS(apihandler)),
	}

	log.Println("Server running on Port 8080")
	httpServer.ListenAndServe()
}
