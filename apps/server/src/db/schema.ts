import { defineRelations, isNull, sql } from "drizzle-orm";
import { char, integer, pgEnum, pgTable, primaryKey, real, text, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    name: text().unique().notNull(),
    passwordHash: text().notNull()
})

export const unit = pgEnum("unit", [
    "LITER",
    "GRAMM",
    "PIECE"
])

export const ingredientTable = pgTable('ingredient', {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    slug: text().notNull().unique(),

    name: text().notNull(),

    calories: real().notNull().default(0),
    totalFat: real().notNull().default(0),
    fatUnsaturated: real().notNull().default(0),
    fatSaturated: real().notNull().default(0),
    cholesterol: real().notNull().default(0),

    totalCarbohydrates: real().notNull().default(0),
    totalSugars: real().notNull().default(0),

    dietaryFiber: real().notNull().default(0),
    protein: real().notNull().default(0),
    salt: real().notNull().default(0),
    water: real().notNull().default(0),

    vitaminA: real().notNull().default(0),
    vitaminB12: real().notNull().default(0),
    vitaminC: real().notNull().default(0),
    vitaminD: real().notNull().default(0),

    potassium: real().notNull().default(0),
    sodium: real().notNull().default(0),
    calcium: real().notNull().default(0),
    iron: real().notNull().default(0),

    density: real().default(1)
});

export const recipeTable = pgTable('recipe', {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    slug: text().notNull().unique(),

    name: text().notNull(),
    markdown: text(),


});

export const ingredientToRecipe = pgTable(
    'ingredient_to_recipe',
    {
        recipeId: uuid('recipe_id').notNull().references(() => recipeTable.id, { onDelete: "cascade" }),
        ingredientId: uuid('ingredient_id').notNull().references(() => ingredientTable.id, {onDelete: "restrict"}),
        quantity: real(),
        unit: unit(),
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
