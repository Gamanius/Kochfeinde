import IngredientSite from '#/components/ingredient/ingredientSite'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { useBreadcrumbs } from '#/components/breadcrumbs'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/ingredient/$slug/')({
  component: RouteComponent,
})

function RouteComponent() {
      const { slug } = Route.useParams()
      const { setCrumbs } = useBreadcrumbs()
      const trcp = useTRPC()
      const res = useSuspenseQuery(trcp.ingredient.get.queryOptions({slug}))
  
      useEffect(() => {
          setCrumbs([
              { label: "Zutaten", path: "/ingredient" },
              { label: res.data.name },
          ])
          return () => setCrumbs([])
      }, [res.data.name])

      return <div>
          <Suspense>
              <IngredientSite slug={slug}/>
          </Suspense>
      </div>
}
