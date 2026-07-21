import { useMemo } from 'react'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQueries } from '@tanstack/react-query'
import { parseIngredient } from '@kochfeinde/shared'
import { scaleNumbers } from '#/components/recipe/recipeParser'

export function useRecipeIngredients(
  slugEntries: { slug: string; amount: number }[],
) {
  const trpc = useTRPC()

  const recipeQueries = useSuspenseQueries({
    queries: slugEntries.map(e => ({
      ...trpc.recipe.get.queryOptions({ slug: e.slug }),
    })),
  })

  const ings = useMemo(
    () =>
      parseIngredient(
        recipeQueries.reduce(
          (acc, curr, i) =>
            acc +
            scaleNumbers(
              curr.data.markdown,
              slugEntries[i].amount / curr.data.portion_num,
            ),
          '',
        ),
      ),
    [recipeQueries, slugEntries],
  )

  return { recipeQueries, ings }
}