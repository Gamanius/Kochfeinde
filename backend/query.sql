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

-- name: GetRecipeSteps :many
SELECT *
FROM recipe_step
WHERE recipe_id = $1
ORDER BY position;

-- name: CreateRecipeStep :one
INSERT INTO recipe_step (
    section_name,
    position,
    description
)
VALUES ($1,$2,$3)
RETURNING *;

-- name: GetRecipeIngredients :many
SELECT *
FROM recipe_ingredients
WHERE recipe_id = $1
ORDER BY position;