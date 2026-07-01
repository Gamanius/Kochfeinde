import RecipeSite from '#/components/recipe/recipeSite'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { useBreadcrumbs } from '#/components/breadcrumbs'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/recipe/$slug/')({
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
            { label: res.data.name },
        ])
        return () => setCrumbs([])
    }, [res.data.name])

    return <div>
        <Suspense>
            <RecipeSite slug={slug}/>
        </Suspense>
    </div>
}
