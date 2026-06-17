package main

import (
	"context"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"kochfeinde.com/api/internal/repository"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL") + "mydb"
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	ctx := context.Background()

	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	defer pool.Close()

	repo := repository.New(pool)

	// --- Ingredients ---
	ingredientData := []struct {
		slug  string
		title string
	}{
		{"weizenmehl-405", "Weizenmehl Type 405"},
		{"zucker", "Zucker"},
		{"salz", "Salz"},
		{"ei", "Ei"},
		{"butter", "Butter"},
		{"milch-3-5", "Milch 3,5%"},
		{"olivenoel", "Olivenöl"},
		{"knoblauchzehe", "Knoblauchzehe"},
		{"zwiebel", "Zwiebel"},
		{"tomate", "Tomate"},
		{"tomatenmark", "Tomatenmark"},
		{"spaghetti", "Spaghetti"},
		{"parmesan", "Parmesan"},
		{"haehnchenbrust", "Hähnchenbrust"},
		{"paprika-rot", "Paprika rot"},
		{"reis-langkorn", "Reis Langkorn"},
		{"kurzkettiger-reis", "Kurzkettiger Reis"},
		{"nori-algen", "Nori Algen"},
		{"lachs-frisch", "Lachs frisch"},
		{"reisessig", "Reisessig"},
		{"sojasauce", "Sojasauce"},
		{"wasabi", "Wasabi"},
		{"apfel", "Apfel"},
		{"haferflocken", "Haferflocken"},
		{"honig", "Honig"},
		{"zitrone", "Zitrone"},
		{"minze-frisch", "Minze frisch"},
	}

	type seedIngredient struct {
		id    uuid.UUID
		slug  string
		title string
	}

	var ingredients []seedIngredient

	for _, ing := range ingredientData {
		_, err := repo.CreateIngredient(ctx, repository.CreateIngredientParams{
			Slug:  ing.slug,
			Title: ing.title,
		})
		if err != nil {
			log.Printf("ingredient %s already exists, skipping\n", ing.slug)
			log.Println(err)
		}
		// Look up the ingredient to get its generated ID
		row := pool.QueryRow(ctx, "SELECT id, slug, title FROM ingredients WHERE slug = $1", ing.slug)
		var dbIngredient seedIngredient
		if err := row.Scan(&dbIngredient.id, &dbIngredient.slug, &dbIngredient.title); err != nil {
			log.Fatalf("failed to lookup ingredient %s: %v", ing.slug, err)
		}
		ingredients = append(ingredients, dbIngredient)
	}

	log.Printf("seeded %d ingredients\n", len(ingredients))

	// helper maps for quick lookup
	ingBySlug := make(map[string]seedIngredient)
	for _, ing := range ingredients {
		ingBySlug[ing.slug] = ing
	}

	// --- Recipes ---

	type seedStep struct {
		sectionName string
		position    int32
		description string
	}

	type seedRecipeIngredient struct {
		slug    string
		amount  float64
		stepIdx int // index into steps (0-based)
	}

	type recipeDef struct {
		slug          string
		title         string
		description   string
		timeTaken     int32
		timeActive    int32
		portionNum    int32
		portionString string
		steps         []seedStep
		recipeIngs    []seedRecipeIngredient
	}

	recipes := []recipeDef{
		{
			slug:          "spaghetti-aglio-olio",
			title:         "Spaghetti Aglio e Olio",
			description:   "Klassische italienische Pasta mit Knoblauch und Olivenöl",
			timeTaken:     20,
			timeActive:    15,
			portionNum:    2,
			portionString: "Portionen",
			steps: []seedStep{
				{position: 1, description: "Spaghetti in einem großen Topf mit Salzwasser nach Packungsanweisung al dente kochen."},
				{position: 2, description: "Währenddessen Olivenöl in einer Pfanne erhitzen und die fein gehackten Knoblauchzehen darin goldgelb braten."},
				{position: 3, description: "Gekochte Spaghetti abgießen, dabei etwas Nudelwasser auffangen."},
				{position: 4, description: "Spaghetti zum Knoblauchöl in die Pfanne geben, gut vermengen. Bei Bedarf etwas Nudelwasser hinzufügen."},
				{position: 5, description: "Mit Salz und frisch gehackter Petersilie bestreut servieren."},
			},
			recipeIngs: []seedRecipeIngredient{
				{slug: "spaghetti", amount: 200, stepIdx: 0},
				{slug: "salz", amount: 1, stepIdx: 0},
				{slug: "olivenoel", amount: 60, stepIdx: 1},
				{slug: "knoblauchzehe", amount: 4, stepIdx: 1},
			},
		},
		{
			slug:          "haehnchen-paprika-reis",
			title:         "Hähnchen mit Paprika und Reis",
			description:   "Ein einfaches und leckeres Gericht für den Alltag",
			timeTaken:     35,
			timeActive:    25,
			portionNum:    3,
			portionString: "Portionen",
			steps: []seedStep{
				{position: 1, description: "Reis nach Packungsanweisung in Salzwasser kochen."},
				{position: 2, description: "Hähnchenbrust in Streifen schneiden, mit Salz und Pfeffer würzen."},
				{position: 3, description: "Öl in einer Pfanne erhitzen, Hähnchen darin rundherum goldbraun braten, herausnehmen."},
				{position: 4, description: "Paprika und Zwiebel in Streifen schneiden, im Bratfett anbraten."},
				{position: 5, description: "Hähnchen wieder dazugeben, mit Sojasauce ablöschen und kurz durchschwenken."},
				{position: 6, description: "Zusammen mit dem Reis servieren."},
			},
			recipeIngs: []seedRecipeIngredient{
				{slug: "reis-langkorn", amount: 240, stepIdx: 0},
				{slug: "salz", amount: 1, stepIdx: 0},
				{slug: "haehnchenbrust", amount: 400, stepIdx: 1},
				{slug: "olivenoel", amount: 30, stepIdx: 2},
				{slug: "paprika-rot", amount: 200, stepIdx: 3},
				{slug: "zwiebel", amount: 100, stepIdx: 3},
				{slug: "sojasauce", amount: 30, stepIdx: 4},
			},
		},
		{
			slug:          "lachs-onigiri",
			title:         "Lachs Onigiri",
			description:   "Japanische Reisbällchen mit Lachsfüllung",
			timeTaken:     45,
			timeActive:    40,
			portionNum:    8,
			portionString: "Stück",
			steps: []seedStep{
				{position: 1, description: "Reis waschen, bis das Wasser klar bleibt, dann nach Packungsanweisung kochen."},
				{position: 2, description: "Lachs in einer Pfanne braten, zerkleinern und mit etwas Salz würzen."},
				{position: 3, description: "Reisessig unter den gekochten Reis mischen und abkühlen lassen."},
				{position: 4, description: "Nori-Algen in Streifen schneiden."},
				{position: 5, description: "Hände anfeuchten, etwas Reis in die Handfläche geben, Lachs in die Mitte setzen, zu einem Dreieck formen."},
				{position: 6, description: "Mit Nori-Streifen umwickeln und mit Sojasauce und Wasabi servieren."},
			},
			recipeIngs: []seedRecipeIngredient{
				{slug: "kurzkettiger-reis", amount: 400, stepIdx: 0},
				{slug: "salz", amount: 1, stepIdx: 1},
				{slug: "lachs-frisch", amount: 200, stepIdx: 1},
				{slug: "reisessig", amount: 30, stepIdx: 2},
				{slug: "nori-algen", amount: 10, stepIdx: 3},
				{slug: "sojasauce", amount: 20, stepIdx: 5},
				{slug: "wasabi", amount: 5, stepIdx: 5},
			},
		},
		{
			slug:          "apfel-haferflocken-bowls",
			title:         "Apfel-Haferflocken Bowl",
			description:   "Gesundes Frühstück mit Haferflocken, Apfel und Honig",
			timeTaken:     10,
			timeActive:    5,
			portionNum:    1,
			portionString: "Portion",
			steps: []seedStep{
				{position: 1, description: "Haferflocken mit heißem Wasser oder Milch übergießen und 5 Minuten quellen lassen."},
				{position: 2, description: "Apfel waschen, entkernen und in kleine Würfel schneiden."},
				{position: 3, description: "Apfelwürfel unter die Haferflocken mischen."},
				{position: 4, description: "Mit Honig beträufeln und mit Zitronensaft abschmecken."},
				{position: 5, description: "Mit frischen Minzblättern garnieren."},
			},
			recipeIngs: []seedRecipeIngredient{
				{slug: "haferflocken", amount: 50, stepIdx: 0},
				{slug: "milch-3-5", amount: 150, stepIdx: 0},
				{slug: "apfel", amount: 1, stepIdx: 1},
				{slug: "honig", amount: 15, stepIdx: 3},
				{slug: "zitrone", amount: 0.5, stepIdx: 3},
				{slug: "minze-frisch", amount: 3, stepIdx: 4},
			},
		},
	}

	for _, r := range recipes {
		// Create recipe
		recipe, err := repo.CreateRecipe(ctx, repository.CreateRecipeParams{
			Slug:  r.slug,
			Title: r.title,
		})
		if err != nil {
			log.Printf("recipe %s already exists, updating\n", r.slug)

			// Fetch existing recipe
			existing, err := repo.GetRecipeBySlug(ctx, r.slug)
			if err != nil {
				log.Printf("  could not fetch existing recipe: %v, skipping", err)
				continue
			}

			// Delete old steps and ingredients (cascade handles ingredients since they reference steps)
			oldSteps, err := repo.GetRecipeSteps(ctx, existing.ID)
			if err == nil {
				for _, s := range oldSteps {
					_, _ = pool.Exec(ctx, "DELETE FROM recipe_ingredients WHERE recipe_step_id = $1", s.ID)
				}
				_, _ = pool.Exec(ctx, "DELETE FROM recipe_step WHERE recipe_id = $1", existing.ID)
			}

			// Update recipe fields
			_, err = pool.Exec(ctx,
				`UPDATE recipes SET title=$1, description=$2, time_taken=$3, time_active=$4, portion_num=$5, portion_string=$6 WHERE id=$7`,
				r.title, nullableText(r.description), r.timeTaken, r.timeActive, r.portionNum, r.portionString, existing.ID,
			)
			if err != nil {
				log.Printf("  could not update recipe: %v, skipping", err)
				continue
			}

			recipe = existing
		} else {
			// Update additional fields for new recipe
			_, err = pool.Exec(ctx,
				`UPDATE recipes SET description=$1, time_taken=$2, time_active=$3, portion_num=$4, portion_string=$5 WHERE id=$6`,
				nullableText(r.description), r.timeTaken, r.timeActive, r.portionNum, r.portionString, recipe.ID,
			)
			if err != nil {
				log.Printf("  could not update recipe fields: %v", err)
			}
		}

		// Create steps
		type stepInfo struct {
			id       pgtype.UUID
			position int32
		}
		var stepInfos []stepInfo
		for _, step := range r.steps {
			created, err := repo.CreateRecipeStep(ctx, repository.CreateRecipeStepParams{
				RecipeID:    recipe.ID,
				SectionName: pgtype.Text{String: step.sectionName, Valid: step.sectionName != ""},
				Position:    step.position,
				Description: step.description,
			})
			if err != nil {
				log.Fatalf("failed to create step for recipe %s: %v", r.slug, err)
			}
			stepInfos = append(stepInfos, stepInfo{id: created.ID, position: created.Position})
		}

		// Create recipe ingredients
		for _, ri := range r.recipeIngs {
			ing, ok := ingBySlug[ri.slug]
			if !ok {
				log.Printf("ingredient %s not found, skipping\n", ri.slug)
				continue
			}
			// Find the step ID for ri.stepIdx
			if ri.stepIdx >= len(stepInfos) {
				log.Printf("step index %d out of range for recipe %s\n", ri.stepIdx, r.slug)
				continue
			}
			_, err := repo.CreateRecipeIngredient(ctx, repository.CreateRecipeIngredientParams{
				IngredientID: pgtype.UUID{Bytes: ing.id, Valid: true},
				RecipeID:     recipe.ID,
				RecipeStepID: stepInfos[ri.stepIdx].id,
				SectionName:  pgtype.Text{Valid: false},
				Position:     1,
				Amount:       ri.amount,
			})
			if err != nil {
				log.Printf("failed to create recipe ingredient for %s: %v\n", r.slug, err)
			}
		}

		log.Printf("seeded recipe: %s\n", r.slug)
	}
}

func nullableText(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
