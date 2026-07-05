import { useState } from "react";
import { tagGroups } from "@kochfeinde/shared";
import type { RecipeTag } from "@kochfeinde/shared";

export default function TagSelector({
  selected,
  onChange,
}: {
  selected: RecipeTag[];
  onChange: (tags: RecipeTag[]) => void;
}) {
  const [search, setSearch] = useState("");

  const toggle = (tag: RecipeTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const q = search.toLowerCase();

  const filtered = tagGroups
    .map((group) => ({
      ...group,
      tags: group.tags.filter(
        (t) => t.label.toLowerCase().includes(q) || t.value.toLowerCase().includes(q),
      ),
    }))
    .filter((group) => group.tags.length > 0);

  return (
    <fieldset className="fieldset bg-base-100 border-neutral-content rounded-box border p-4 mb-4 max-h-96 overflow-scroll">
      <legend className="fieldset-legend">Tags</legend>

      <input
        type="search"
        className="input input-sm w-full mb-3"
        placeholder="Tag suchen …"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-8">
        {filtered.map((group) => (
          <div key={group.groupLabel}>
            <h4 className="font-semibold text-sm mb-2 opacity-70">{group.groupLabel}</h4>
            <div className="flex flex-col gap-1">
              {group.tags.map((tag) => (
                <label key={tag.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selected.includes(tag.value)}
                    onChange={() => toggle(tag.value)}
                  />
                  <span className="text-sm">{tag.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}