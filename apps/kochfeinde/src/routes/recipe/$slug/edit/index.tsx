import { createFileRoute } from '@tanstack/react-router'
import RecipeEdit from '#/components/recipe/recipeEdit';
import { Suspense } from 'react'
import RecipeDelete from '#/components/recipe/recipeDelete';

export const Route = createFileRoute('/recipe/$slug/edit/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { slug } = Route.useParams()

    return <>
        <Suspense>
            <RecipeEdit slug={slug}/>
            <RecipeDelete slug={slug}/>
        </Suspense>
    </>
}
