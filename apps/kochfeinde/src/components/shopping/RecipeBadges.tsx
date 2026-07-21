export function RecipeBadges({
  entries,
}: {
  entries: { slug: string; name: string; portion_string: string; amount: number }[]
}) {
  return (
    <div className="border-b mb-4">
      <h1>Zutaten</h1>
      <div className="flex flex-wrap gap-2 mb-2">
        {entries.map(e => (
          <span
            key={e.slug}
            className="flex h-auto badge badge-primary badge-lg"
          >
            {e.name} ({e.amount} {e.portion_string})
          </span>
        ))}
      </div>
    </div>
  )
}