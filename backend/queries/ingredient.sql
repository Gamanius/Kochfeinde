-- name: GetIngredients :many
SELECT *
FROM ingredients
ORDER BY title;

-- name: GetIngredient :one
SELECT *
FROM ingredients
WHERE id = $1;

-- name: CreateIngredient :one
INSERT INTO ingredients (
    slug,
    title
)
VALUES ($1, $2)
RETURNING *;