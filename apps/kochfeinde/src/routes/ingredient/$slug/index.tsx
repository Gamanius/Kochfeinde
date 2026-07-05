import IngredientSite from '#/components/ingredient/ingredientSite'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/ingredient/$slug/')({
  component: RouteComponent,
})

function RouteComponent() {
      const { slug } = Route.useParams()
  
      return <div>
          <Suspense>
              <IngredientSite slug={slug}/>
          </Suspense>
      </div>
}
