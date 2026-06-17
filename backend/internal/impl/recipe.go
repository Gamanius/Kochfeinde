package impl

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	openapi_types "github.com/oapi-codegen/runtime/types"

	"kochfeinde.com/api/internal/api"
	"kochfeinde.com/api/internal/lib"
)

// (GET /recipes)
func (s *ServerImpl) GetRecipes(ctx context.Context, request api.GetRecipesRequestObject) (api.GetRecipesResponseObject, error) {
	recipes, err := lib.Repo.GetRecipes(ctx)
	if err != nil {
		return nil, err
	}

	response := make(api.GetRecipes200JSONResponse, 0, len(recipes))
	for _, r := range recipes {
		response = append(response, api.RecipeResponseModel{
			Id:            openapi_types.UUID(r.ID.Bytes),
			Slug:          r.Slug,
			Title:         r.Title,
			Description:   pgtypeTextToPtr(r.Description),
			TimeActive:    r.TimeActive,
			TimeTaken:     r.TimeTaken,
			PortionNum:    r.PortionNum,
			PortionString: r.PortionString,
		})
	}

	return response, nil
}

func (s *ServerImpl) GetRecipesSlug(ctx context.Context, request api.GetRecipesSlugRequestObject) (api.GetRecipesSlugResponseObject, error) {
	recipe, err := lib.Repo.GetRecipeBySlug(ctx, request.Slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return api.GetRecipesSlug404JSONResponse{}, nil
		}
		return nil, err
	}

	steps, err := lib.Repo.GetRecipeSteps(ctx, recipe.ID)
	if err != nil {
		return nil, err
	}

	ingredients, err := lib.Repo.GetRecipeIngredients(ctx, recipe.ID)
	if err != nil {
		return nil, err
	}

	apiSteps := make([]api.RecipeStepModel, 0, len(steps))
	for _, s := range steps {
		apiSteps = append(apiSteps, api.RecipeStepModel{
			Id:          openapi_types.UUID(s.ID.Bytes),
			SectionName: pgtypeTextToPtr(s.SectionName),
			Position:    s.Position,
			Description: s.Description,
		})
	}

	apiIngredients := make([]api.RecipeIngredientModel, 0, len(ingredients))
	for _, i := range ingredients {
		apiIngredients = append(apiIngredients, api.RecipeIngredientModel{
			Id:           openapi_types.UUID(i.ID.Bytes),
			IngredientId: openapi_types.UUID(i.IngredientID.Bytes),
			SectionName:  pgtypeTextToPtr(i.SectionName),
			Position:     i.Position,
			Amount:       float32(i.Amount),
		})
	}

	return api.GetRecipesSlug200JSONResponse{
		Id:            openapi_types.UUID(recipe.ID.Bytes),
		Slug:          recipe.Slug,
		Title:         recipe.Title,
		Description:   pgtypeTextToPtr(recipe.Description),
		TimeActive:    recipe.TimeActive,
		TimeTaken:     recipe.TimeTaken,
		PortionNum:    recipe.PortionNum,
		PortionString: recipe.PortionString,
		Steps:         apiSteps,
		Ingredients:   apiIngredients,
	}, nil
}

func pgtypeTextToPtr(t pgtype.Text) *string {
	if t.Valid {
		return &t.String
	}
	return nil
}
