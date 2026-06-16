BACKEND_DIR := "./backend"
FRONTEND_DIR := "./frontend"

default:
  just --list


[group("Backend")]
[group("dev")]
air:
    cd {{BACKEND_DIR}} && air

[group("Backend")]
build:
    cd {{BACKEND_DIR}} && go build -o ./tmp/server ./cmd

[group("Backend")]
oapi: bundle
    cd {{BACKEND_DIR}} && oapi-codegen -config oapi.yml internal/spec/spec.gen.yaml 

[group("Backend")]
bundle: 
    cd {{BACKEND_DIR}} && redocly bundle spec/spec.yaml -o internal/spec/spec.gen.yaml

[group("Backend")]
[group("dev")]
sqlc:
    cd {{BACKEND_DIR}} && sqlc generate

[group("Backend")]
[group("dev")]
migrate-reset:
    dropdb mydb
    createdb mydb
    migrate -path backend/migrations/ -database ${DATABASE_URL}mydb up