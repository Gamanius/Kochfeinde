import { defineRelations, sql } from "drizzle-orm";
import { date, integer, pgEnum, pgTable, primaryKey, real, text, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    name: text().unique().notNull(),
    displayName: text().notNull(),
    passwordHash: text().notNull(),
    creation_date: date().defaultNow()
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
    undertitle: text(),
    markdown: text(),

    time_active: integer().default(30).notNull(),
    time_total: integer().default(30).notNull(),

    fileUrl: text(),

    userId: uuid('user_id').notNull().references(() => userTable.id, { onDelete: "cascade" }),
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

export const relations = defineRelations({ user: userTable, ingredient: ingredientTable, recipe: recipeTable, ingredientToRecipe: ingredientToRecipe },
    (r) => ({
        user: {
            recipes: r.many.recipe(),
        },
        ingredient: {
        recipe: r.many.recipe({
            from: r.ingredient.id.through(r.ingredientToRecipe.recipeId),
            to: r.recipe.id.through(r.ingredientToRecipe.ingredientId),
        }),
        },
        recipe: {
        participants: r.many.ingredient(),
        author: r.one.user({
            from: r.recipe.userId,
            to: r.user.id,
        }),
        },
    })
);
