import IngredientSite from '#/components/ingredient/ingredientSite'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/ingredient/$slug/')({
  component: RouteComponent,
})

function RouteComponent() {
      const { slug } = Route.useParams()
      const trcp = useTRPC()
      const res = useSuspenseQuery(trcp.ingredient.get.queryOptions({slug}))
  
      return <div>
          <Suspense>
              <IngredientSite slug={slug}/>
          </Suspense>
      </div>
}
