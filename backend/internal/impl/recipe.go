package impl

import (
	"context"

	"kochfeinde.com/api/internal/api"
)

// (GET /recipes)
func (s *ServerImpl) GetRecipes(ctx context.Context, request api.GetRecipesRequestObject) (api.GetRecipesResponseObject, error) {
	return api.GetRecipes200JSONResponse{

	},nil
}