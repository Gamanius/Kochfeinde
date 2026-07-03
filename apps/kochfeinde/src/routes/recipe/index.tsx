import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react';
import RecipeList from '#/components/recipe/recipeList';
import RecipeNotFound from '#/components/recipe/recipeNotFound';

export const Route = createFileRoute('/recipe/')({
    component: RouteComponent,
    errorComponent: RecipeNotFound
})

function RouteComponent() {
    return <div>
        <Suspense>
            <RecipeList/>
        </Suspense>
    </div>
}
