package specs

import (
	"context"
	_ "embed"
	"encoding/json"
	"net/http"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/getkin/kin-openapi/openapi3filter"
	nethttpmiddleware "github.com/oapi-codegen/nethttp-middleware"
	"kochfeinde.com/api/internal/api"
	"kochfeinde.com/api/internal/impl"
)

func InitHandler() (http.Handler, error) {
	mux := http.NewServeMux()
	
	authfunc := func(ctx context.Context, ai *openapi3filter.AuthenticationInput) error {
		// var cookie *http.Cookie
		// var err error

		// switch ai.SecuritySchemeName {
		// case "bearerAccessAuth":
		// 	cookie, err = ai.RequestValidationInput.Request.Cookie(lib.ACCESS_TOKEN_KEY)
		// case "bearerRefreshAuth":
		// 	cookie, err = ai.RequestValidationInput.Request.Cookie(lib.REFRESH_TOKEN_KEY)
		// default:
		// 	return errors.New("Unknown Secutiry scheme")
		// }	

		// if err != nil {
		// 	return err;
		// }
		// newCtx, err := lib.VerifyToken(ctx, cookie.Value)
		// if err != nil {
		// 	return err;
		// }
		// *ai.RequestValidationInput.Request =
		// 	*ai.RequestValidationInput.Request.WithContext(newCtx)
		
		return nil
	}

	ctx := context.Background()
	loader := &openapi3.Loader{Context: ctx, IsExternalRefsAllowed: true}
	spec, err := loader.LoadFromFile("/workspaces/Kochfeinde/backend/public/specs.yaml")
	spec.Servers = nil
	if err != nil {
		panic("Specs are wrong: "+ err.Error())
	}

	loader.ResolveRefsIn(spec, nil)

	jsonOpenAPI, err := json.Marshal(spec)
	
	if err != nil {
		panic("Couldnt convert: "+ err.Error())
	}

	mw := nethttpmiddleware.OapiRequestValidatorWithOptions(spec, &nethttpmiddleware.Options{
		Options: openapi3filter.Options{
			AuthenticationFunc: authfunc,
		},
		ErrorHandlerWithOpts: func(ctx context.Context, err error, w http.ResponseWriter, r *http.Request, opts nethttpmiddleware.ErrorHandlerOpts) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(opts.StatusCode)
			_ = json.NewEncoder(w).Encode(map[string]string{
				"error": err.Error(),
			})
		},
	})

	server := &impl.ServerImpl{
		OpenAPIJSON: jsonOpenAPI,
	}


	strictserver := api.NewStrictHandler(server, nil)
	handler := api.HandlerFromMux(strictserver, mux)

	return mw(handler), nil
}