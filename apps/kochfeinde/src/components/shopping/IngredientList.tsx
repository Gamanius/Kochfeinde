import { Flipper, Flipped } from 'react-flip-toolkit'
import type { RecipeIngredient } from '@kochfeinde/shared'
import { formatQuantity, formatUnit } from './shopping-utils'

function IngredientItem({
  ingredient,
  index,
  checked,
  onToggle,
}: {
  ingredient: RecipeIngredient
  index: number
  checked: boolean
  onToggle: (index: number) => void
}) {
  const fu = formatUnit(ingredient.quantity, ingredient.unit)
  const formatted = `${formatQuantity(fu.qty)}${fu.label ? ` ${fu.label}` : ''}`

  return (
    <Flipped key={index} flipId={String(index)}>
      <li
        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-base-200 ${checked ? 'opacity-40 line-through' : ''}`}
        onClick={() => onToggle(index)}
      >
        <input className="checkbox" type="checkbox" checked={checked} readOnly />
        <span className="flex-1">{ingredient.name}</span>
        <span className="text-sm opacity-60">{formatted}</span>
      </li>
    </Flipped>
  )
}

export function IngredientList({
  ings,
  checked,
  flipKey,
  onToggle,
}: {
  ings: RecipeIngredient[]
  checked: boolean[]
  flipKey: string
  onToggle: (index: number) => void
}) {
  const sorted = ings
    .map((e, i) => ({ e, i }))
    .sort((a, b) => {
      // Checked items go last
      if (checked[a.i] !== checked[b.i])
        return Number(checked[a.i]) - Number(checked[b.i])
      // Same unit → sort by quantity descending
      if (a.e.unit === b.e.unit) return (b.e.quantity ?? 0) - (a.e.quantity ?? 0)
      // Different units → sort alphabetically by unit
      return a.e.unit.localeCompare(b.e.unit)
    })

  return (
    <Flipper flipKey={flipKey} className="space-y-2">
      {sorted.map(({ e, i }) => (
        <IngredientItem
          key={i}
          ingredient={e}
          index={i}
          checked={checked[i]}
          onToggle={onToggle}
        />
      ))}
    </Flipper>
  )
}