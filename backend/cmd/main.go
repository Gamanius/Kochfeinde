package main

import (
	"log"
	"net/http"

	"kochfeinde.com/api/internal/lib"
	"kochfeinde.com/api/internal/middleware"
	"kochfeinde.com/api/internal/specs"
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
	lib.ConnectToDB("postgres://postgres@localhost:5432/mydb")
	defer lib.Close()
	
	apihandler, err := specs.InitHandler()
	

	mux := http.NewServeMux()
	// Handler A → static files
	fs := http.FileServer(http.Dir("./public"))
	mux.Handle("/public/", http.StripPrefix("/public/", fs))

	// Handler B → API
	mux.Handle("/api/v1/", http.StripPrefix("/api/v1", apihandler))


	if err != nil {
		panic("Could not init");
	}

	httpServer := http.Server{
		Addr:    ":8080",
		Handler: middleware.Logging(withCORS(mux)),
	}

	log.Println("Server running on Port 8080")
	httpServer.ListenAndServe()
}
