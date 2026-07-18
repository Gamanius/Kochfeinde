export type ShoppingListItem = {
    ingredientSlug: string;
    ingredientName: string;
    quantity: number | null;
    unit: string;
    checked: boolean;
    recipeSlugs: string[];
};