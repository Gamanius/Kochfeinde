-- name: GetRecipes :many
SELECT *
FROM recipes
ORDER BY title;

-- name: GetRecipeBySlug :one
SELECT *
FROM recipes
WHERE slug = $1;

-- name: CreateRecipe :one
INSERT INTO recipes (
    slug,
    title
)
VALUES ($1,$2)
RETURNING *;