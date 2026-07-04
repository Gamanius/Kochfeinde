CREATE TYPE "unit" AS ENUM('LITER', 'GRAMM', 'PIECE');--> statement-breakpoint
CREATE TABLE "ingredient" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"calories" real DEFAULT 0 NOT NULL,
	"totalFat" real DEFAULT 0 NOT NULL,
	"fatUnsaturated" real DEFAULT 0 NOT NULL,
	"fatSaturated" real DEFAULT 0 NOT NULL,
	"cholesterol" real DEFAULT 0 NOT NULL,
	"totalCarbohydrates" real DEFAULT 0 NOT NULL,
	"totalSugars" real DEFAULT 0 NOT NULL,
	"dietaryFiber" real DEFAULT 0 NOT NULL,
	"protein" real DEFAULT 0 NOT NULL,
	"salt" real DEFAULT 0 NOT NULL,
	"water" real DEFAULT 0 NOT NULL,
	"vitaminA" real DEFAULT 0 NOT NULL,
	"vitaminB12" real DEFAULT 0 NOT NULL,
	"vitaminC" real DEFAULT 0 NOT NULL,
	"vitaminD" real DEFAULT 0 NOT NULL,
	"potassium" real DEFAULT 0 NOT NULL,
	"sodium" real DEFAULT 0 NOT NULL,
	"calcium" real DEFAULT 0 NOT NULL,
	"iron" real DEFAULT 0 NOT NULL,
	"density" real DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "ingredient_to_recipe" (
	"recipe_id" uuid,
	"ingredient_id" uuid,
	"quantity" real,
	"unit" "unit",
	CONSTRAINT "ingredient_to_recipe_pkey" PRIMARY KEY("recipe_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"markdown" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL UNIQUE,
	"displayName" text NOT NULL,
	"passwordHash" text NOT NULL,
	"creation_date" date DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ingredient_to_recipe" ADD CONSTRAINT "ingredient_to_recipe_recipe_id_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ingredient_to_recipe" ADD CONSTRAINT "ingredient_to_recipe_ingredient_id_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;