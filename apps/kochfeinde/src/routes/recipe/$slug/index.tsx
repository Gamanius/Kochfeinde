import RecipeNotFound from '#/components/recipe/recipeNotFound'
import RecipeSite from '#/components/recipe/recipeSite'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/recipe/$slug/')({
    component: RouteComponent,
    errorComponent: ({ error: _error }) => {
        const { slug } = Route.useParams()
        return <RecipeNotFound slug={slug} />
    },
})

function RouteComponent() {
    const { slug } = Route.useParams()

    return <div>
        <Suspense>
            <RecipeSite slug={slug}/>
        </Suspense>
    </div>
}
