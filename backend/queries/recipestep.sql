-- name: GetRecipeSteps :many
SELECT *
FROM recipe_step
WHERE recipe_id = $1
ORDER BY position;

-- name: CreateRecipeStep :one
INSERT INTO recipe_step (
    recipe_id,
    section_name,
    position,
    description
)
VALUES ($1,$2,$3,$4)
RETURNING *;

-- name: GetRecipeIngredients :many
SELECT *
FROM recipe_ingredients
WHERE recipe_id = $1
ORDER BY position;

-- name: CreateRecipeIngredient :one
INSERT INTO recipe_ingredients (
    ingredient_id,
    recipe_id,
    recipe_step_id,
    section_name,
    position,
    amount
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;