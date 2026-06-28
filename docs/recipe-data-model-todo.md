# To-Do: Recipe Data Model Implementation

## Schema & Data Layer

- [ ] Add `display_order` column to `recipe_ingredient` table
- [ ] Add `markdownIngredients` and `markdownSteps` to `recipeTable`
- [ ] Create `apps/server/src/db/relations.ts` with Drizzle `relations()`
- [ ] Run `npx drizzle-kit generate` + `just db-push`

## Parser (shared package)

- [ ] Write `parseIngredientLinks()` — extracts `[Display](recipe:slug)` + quantity from markdown
- [ ] Resolve slugs → ingredient IDs, reject unknown slugs
- [ ] Handle deduplication: same slug appearing multiple times → one junction row

## Backend (tRPC)

- [ ] Create `save` procedure: upsert recipe + parse ingredients + replace junction rows
- [ ] Create `getBySlug` procedure: return recipe with nested ingredient data
- [ ] Create `previewIngredients` procedure: validate markdown without saving

## Frontend

- [ ] Custom `ReactMarkdown` renderer that intercepts `ingredient:` links → internal navigation
- [ ] Recipe editor: two separate markdown textareas (ingredients + steps)
- [ ] Recipe view: display parsed ingredient list from junction table, render steps with clickable links

## Validation & UX

- [ ] Show error if `markdown_ingredients` references a nonexistent ingredient slug
- [ ] Autocomplete / suggestion UI for `recipe:slug` when typing in the editor (future)