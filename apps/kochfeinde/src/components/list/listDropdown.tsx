import { useState } from "react";
import { Minus, Plus, ScrollText, ShoppingCart, Trash } from "lucide-react";
import { useRecipeListStore } from "./listContext"
import { Link } from "@tanstack/react-router";

function AmountControl({ slug, amount }: { slug: string; amount: number }) {
    const changeAmount = useRecipeListStore(s => s.changeAmount);

    return (
        <div className="join justify-self-center">
            <button className="btn btn-square join-item" onClick={() => changeAmount(slug, amount - 1)}> <Minus/> </button>
            <span className="join-item text-center input">{amount}</span>
            <button className="btn btn-square join-item" onClick={() => changeAmount(slug, amount + 1)}> <Plus/> </button>
        </div>

    );
}

export default function ListDropdown() {
    const list = useRecipeListStore(s => s.list);
    const removeRecipe = useRecipeListStore(s => s.removeRecipe);
    const clearList = useRecipeListStore(s => s.clearList);
    const entries = Object.entries(list);

    const [hasRestored, setHasRestored] = useState(() => localStorage.getItem('kochfeinde_shopping_r') !== null)

    const slugs = entries.map((e) => `${e[0]}:${e[1].amount}`).join(",");


    return (
        <ul className={`dropdown dropdown-end w-72 rounded-box bg-base-100 shadow-sm p-2`}
            popover="auto" id="recipe-list" style={{ positionAnchor: "--recipe-list" } satisfies React.CSSProperties}>
                {entries.map(([slug, item]) => (
                    <li key={slug} className="grid grid-cols-[1fr_min-content_min-content] items-center my-2">
                        <span className="flex-1 truncate text-sm">{item.name}</span>
                        <AmountControl slug={slug} amount={item.amount} />
                        <button className="btn btn-square btn-ghost btn-error justify-self-end ml-1" onClick={() => removeRecipe(slug)}>
                            <Trash></Trash>
                        </button>
                    </li>
                ))}

                {entries.length > 0 ? (
                    <>
                    <li>
                        <Link to="/shopping-list" search={{ r: slugs, m: '0' }} className="btn btn-ghost w-full" onClick={e => {
                            (e.currentTarget.closest("[popover]") as HTMLElement).hidePopover();
                            setHasRestored(true)
                        }}>
                            <ShoppingCart /> Einkaufsliste Erstellen
                        </Link>
                    </li>
                    <li>
                        <button className="btn btn-ghost btn-xs w-full text-error" onClick={clearList}>
                            Liste leeren
                        </button>
                    </li>
                    </>
                    
                ) : null}
                {hasRestored === false ||
                <>
                    <div className="divider my-1"></div>
                    <li>
                        <Link to="/shopping-list" search={{r: "", m: ""}} className="btn btn-ghost w-full" onClick={e => {
                            (e.currentTarget.closest("[popover]") as HTMLElement).hidePopover();
                        }}>
                            <ScrollText/> Letzte Liste öffnen
                        </Link>
                    </li>
                    <li>
                        <button className="btn btn-ghost btn-xs w-full text-error" onClick={() => {
                            localStorage.removeItem('kochfeinde_shopping_r')
                            localStorage.removeItem('kochfeinde_shopping_m')
                            setHasRestored(false)
                        }}>
                            Letzte List löschen
                        </button>
                    </li>
                </>
                }
        </ul>
    );
}