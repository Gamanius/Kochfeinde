import { defineRelations, sql } from "drizzle-orm";
import { char, integer, pgTable, primaryKey, text, uuid, varchar } from "drizzle-orm/pg-core";

export const ingredientTable = pgTable('ingredient', {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    slug: text().notNull().unique(),

    name: text().notNull(),
});

export const recipeTable = pgTable('recipe', {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    slug: text().notNull().unique(),

    name: text().notNull(),
    markdown: text()
});

export const ingredientToRecipe = pgTable(
  'ingredient_to_recipe',
  {
    recipeId: uuid('recipe_id').notNull().references(() => ingredientTable.id, { onDelete: "cascade" }),
    ingredientId: uuid('ingredient_id').notNull().references(() => recipeTable.id, {onDelete: "restrict"}),
    quantity: text(),
    unit: text()
  },
  (t) => [primaryKey({ columns: [t.recipeId, t.ingredientId] })],
);

export const relations = defineRelations({ ingredient: ingredientTable, recipe: recipeTable, ingredientToRecipe: ingredientToRecipe },
  (r) => ({
    ingredient: {
      recipe: r.many.recipe({
        from: r.ingredient.id.through(r.ingredientToRecipe.recipeId),
        to: r.recipe.id.through(r.ingredientToRecipe.ingredientId),
      }),
    },
    recipe: {
      participants: r.many.ingredient(),
    },
  })
);
