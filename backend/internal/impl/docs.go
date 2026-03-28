package impl

import (
	"context"
	"html/template"
	"net/http"

	"kochfeinde.com/api/internal/api"
)

type DocsResponse struct{
	Spec []byte
}

func (u DocsResponse) VisitGetDocsResponse(w http.ResponseWriter) error {
	tmpl := template.Must(template.New("swagger").Parse(
		`<!DOCTYPE html>
		<html>
		<head>
		<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
		</head>
		<body>
			<div id="swagger-ui"></div>
			<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
			<script>
				SwaggerUIBundle({
					url: "/public/specs.yaml",
					dom_id: "#swagger-ui",
				});
			</script>
		</body>
		</html>`))

	w.Header().Set("Content-Type", "text/html")
	tmpl.Execute(w, nil)
	return nil
}

func (s *ServerImpl) GetDocs(ctx context.Context, request api.GetDocsRequestObject) (api.GetDocsResponseObject, error) {
	return DocsResponse{
		Spec: s.OpenAPIJSON,
	}, nil
}