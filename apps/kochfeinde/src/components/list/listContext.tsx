import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type RecipeListItem = {
    amount: number,
    name: string,
}

interface RecipeListState {
    list: Record<string, RecipeListItem>,
    addRecipe: (slug: string, name: string, amount?: number) => void,
    removeRecipe: (slug: string) => void,
    changeAmount: (slug: string, amount: number) => void,
    clearList: () => void,
}

export const useRecipeListStore = create<RecipeListState>()(persist((set) => ({
    list: {},
    addRecipe: (slug, name, amount = 1) => set((state) => {
        if (slug in state.list) return state;
        return {
            list: {
                ...state.list,
                [slug]: { amount, name },
            },
        };
    }),
    removeRecipe: (slug) => set((state) => {
        const { [slug]: _, ...rest } = state.list;
        return { list: rest };
    }),
    changeAmount: (slug, amount) => set((state) => {
        if (amount <= 0) {
            const { [slug]: _, ...rest } = state.list;
            return { list: rest };
        }
        
        const name = state.list[slug].name
        return {
            list: {
                ...state.list,
                [slug]: { amount, name},
            },
        };
    }),
    clearList: () => set({ list: {} }),
}), {name: "shopping-list"}))