import { ListCheck, ListPlus } from "lucide-react";
import { useRecipeListStore } from "./listContext";

type AddToListButtonProps = {
    slug: string;
    name: string;
    portionNum?: number;
    small?: boolean;
};

export default function AddToListButton({ slug, name, portionNum = 4, small = true }: AddToListButtonProps) {
    const addRecipe = useRecipeListStore((s) => s.addRecipe);
    const list = useRecipeListStore((s) => s.list);

    const sizeClass = small ? " btn-sm" : "";

    if (slug in list) {
        return (
            <button className={"btn btn-disabled btn-square btn-ghost" + sizeClass}>
                <ListCheck />
            </button>
        );
    }

    return (
        <button
            className={"btn btn-square btn-ghost" + sizeClass}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addRecipe(slug, name, portionNum);
            }}
        >
            <ListPlus />
        </button>
    );
}
