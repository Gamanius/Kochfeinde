import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useRef } from 'react'
import { Confetti } from '#/components/list/confetti'
import type { ConfettiRef } from '#/components/list/confetti'
import { decodeBitmask, encodeBitmask, parseSlugEntries } from '#/components/shopping/shopping-utils'
import { useShoppingSearchParams } from '#/components/shopping/useShoppingSearchParams'
import { useRecipeIngredients } from '#/components/shopping/useRecipeIngredients'
import { useAllCheckedConfetti } from '#/components/shopping/useAllCheckedConfetti'
import { RecipeBadges } from '#/components/shopping/RecipeBadges'
import { IngredientList } from '#/components/shopping/IngredientList'

export const Route = createFileRoute('/shopping-list/')({
  validateSearch: (search: Record<string, string | undefined>) => ({
    r: search.r ?? '',
    m: search.m ?? '',
  }),
  ssr: false,
  component: RouteComponent,
})

function RouteComponent() {
  const { r: urlR, m: urlM } = Route.useSearch()
  const navigate = useNavigate()

  const { r, m } = useShoppingSearchParams(urlR, urlM, navigate)
  const slugEntries = useMemo(() => parseSlugEntries(r), [r])
  const { recipeQueries, ings } = useRecipeIngredients(slugEntries)
  const checked = useMemo(() => decodeBitmask(m, ings.length), [m, ings.length])
  const confettiRef = useRef<ConfettiRef>(null)
  useAllCheckedConfetti(checked, confettiRef)

  function toggleItem(index: number) {
    const newChecked = [...checked]
    newChecked[index] = !newChecked[index]
    const newM = encodeBitmask(newChecked)
    navigate({
      to: '/shopping-list',
      search: { r: r || '', m: newM || '0' },
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <div className="flex justify-center min-w-full">
      <div className="mx-4 p-10 max-w-4xl w-full shadow-2xl">
        <RecipeBadges
          entries={recipeQueries.map((q, i) => ({
            slug: q.data.slug,
            name: q.data.name,
            portion_string: q.data.portion_string,
            amount: slugEntries[i].amount,
          }))}
        />
        <IngredientList
          ings={ings}
          checked={checked}
          flipKey={m}
          onToggle={toggleItem}
        />
      </div>
      <Confetti
        manualstart={true}
        ref={confettiRef}
        className="fixed top-0 left-0 -z-1 size-full"
      />
    </div>
  )
}
