# Recipe Data Model — Design Decisions

## The Core Setup

Two markdown columns on the `recipe` table:

| Column | Purpose |
|---|---|
| `markdown_ingredients` | Structured ingredient list — source of truth for the junction table |
| `markdown_steps` | Freeform instructions — links are for navigation only |

## Parsing: `markdown_ingredients` → `recipe_ingredient` junction

When saving a recipe, the backend:

1. Parses `markdown_ingredients` for all `[Display](recipe:slug)` links
2. Resolves each slug to an actual `ingredient.id` from the `ingredient` table
3. Replaces all rows in `recipe_ingredient` for that recipe (delete-all + insert)
4. Validates that every referenced slug actually exists — rejects save if not

## Navigation in `markdown_steps`

Links in steps use `(ingredient:slug)` syntax:

```markdown
1. [Zwiebeln](ingredient:onion) anschwitzen...
```

These are **purely navigation aids** — they render as clickable links to the ingredient page (`/ingredient/:slug`). The system does NOT parse step links for data modeling.

## Deduplication

If the same ingredient appears multiple times in `markdown_ingredients` (e.g., in different sections), the parser **merges** them into a single `recipe_ingredient` row. The original markdown is preserved as the detailed source of truth.

## Decision: Per-step quantities are NOT modeled

The system does not track how much of each ingredient goes into each step. Quantities in the global ingredient list are the total needed. Subdivision into steps is handled in prose ("2 onions for the sauce, 1 for the topping").

This can be revisited later if needed.

## Key constraints

- `recipe_ingredient.onDelete: "cascade"` — deleting a recipe cleans up junction rows
- `recipe_ingredient.ingredientId` has `onDelete: "restrict"` — can't delete an ingredient that's used in a recipe
- Every `recipe:slug` in `markdown_ingredients` must exist in the `ingredient` table