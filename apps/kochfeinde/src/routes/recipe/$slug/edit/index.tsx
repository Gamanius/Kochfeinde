import { createFileRoute } from '@tanstack/react-router'
import RecipeEdit from '#/components/recipe/recipeEdit';
import { useBreadcrumbs } from '#/components/breadcrumbs'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'


export const Route = createFileRoute('/recipe/$slug/edit/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { slug } = Route.useParams()
    const { setCrumbs } = useBreadcrumbs()
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.recipe.get.queryOptions({slug}))

    useEffect(() => {
        setCrumbs([
            { label: "Rezepte", path: "/recipe" },
            { label: res.data.name, path: `/recipe/${slug}` },
            { label: "Bearbeiten" },
        ])
        return () => setCrumbs([])
    }, [res.data.name])


    return <>
        <Suspense>
            <RecipeEdit slug={slug}/>
        </Suspense>
    </>
}
