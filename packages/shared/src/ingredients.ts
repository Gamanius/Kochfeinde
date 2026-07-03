import type { IngredientUnitType } from "./ingredient.schema"

const ingredientSlugRegex = new RegExp(/-\s+(\d*[,.]?\d*)\s*([^\d\n]*)\s+\[.*\]\(\/ingredient\/(.*)\)/, "g")

type UnitMapping = {
    unit: IngredientUnitType
    factor: number
}

const UNIT_MAP: Record<string, UnitMapping> = {
    // Liter / volume → normalize to LITER
    "l":             { unit: "LITER",  factor: 1 },
    "liter":         { unit: "LITER",  factor: 1 },
    "ml":            { unit: "LITER",  factor: 0.001 },
    "milliliter":    { unit: "LITER",  factor: 0.001 },
    "el":            { unit: "LITER",  factor: 0.015 },  // 1 EL ≈ 15 ml
    "tl":            { unit: "LITER",  factor: 0.005 },  // 1 TL ≈ 5 ml
    // Cups → normalize to LITER
    "cup":           { unit: "LITER",  factor: 0.24 },   // 1 cup ≈ 240 ml
    "cups":          { unit: "LITER",  factor: 0.24 },
    // Imperial volume → normalize to LITER
    "fl oz":         { unit: "LITER",  factor: 0.0295735 },
    "fl.oz":         { unit: "LITER",  factor: 0.0295735 },
    "pt":            { unit: "LITER",  factor: 0.473176 }, // pint
    "pint":          { unit: "LITER",  factor: 0.473176 },
    "pints":         { unit: "LITER",  factor: 0.473176 },
    "qt":            { unit: "LITER",  factor: 0.946353 }, // quart
    "quart":         { unit: "LITER",  factor: 0.946353 },
    "quarts":        { unit: "LITER",  factor: 0.946353 },
    "gal":           { unit: "LITER",  factor: 3.78541 },  // gallon
    "gallon":        { unit: "LITER",  factor: 3.78541 },
    "gallons":       { unit: "LITER",  factor: 3.78541 },
    // English spoons → normalize to LITER
    "tsp":           { unit: "LITER",  factor: 0.005 },   // teaspoon ≈ 5 ml
    "teaspoon":      { unit: "LITER",  factor: 0.005 },
    "teaspoons":     { unit: "LITER",  factor: 0.005 },
    "tbsp":          { unit: "LITER",  factor: 0.015 },   // tablespoon ≈ 15 ml
    "tablespoon":    { unit: "LITER",  factor: 0.015 },
    "tablespoons":   { unit: "LITER",  factor: 0.015 },
    // Gramm / weight → normalize to GRAMM
    "g":             { unit: "GRAMM",  factor: 1 },
    "gramm":         { unit: "GRAMM",  factor: 1 },
    "kg":            { unit: "GRAMM",  factor: 1000 },
    "kilogramm":     { unit: "GRAMM",  factor: 1000 },
    "mg":            { unit: "GRAMM",  factor: 0.001 },
    "milligramm":    { unit: "GRAMM",  factor: 0.001 },
    // Imperial weight → normalize to GRAMM
    "oz":            { unit: "GRAMM",  factor: 28.3495 },  // ounce
    "ounce":         { unit: "GRAMM",  factor: 28.3495 },
    "ounces":        { unit: "GRAMM",  factor: 28.3495 },
    "lb":            { unit: "GRAMM",  factor: 453.592 },  // pound
    "lbs":           { unit: "GRAMM",  factor: 453.592 },
    "pound":         { unit: "GRAMM",  factor: 453.592 },
    "pounds":        { unit: "GRAMM",  factor: 453.592 },
}

export function normalizeUnit(raw: string | null): UnitMapping {
    if (!raw) return { unit: "PIECE", factor: 1 }
    const key = raw.trim().toLowerCase()
    return UNIT_MAP[key] ?? { unit: "PIECE", factor: 1 }
}

export type RecipeIngredient = {
    ingredient_slug : string,
    quantity: number | null,
    unit: IngredientUnitType,
}

/**
 * Merges duplicate ingredients by slug, summing quantities.
 * If one entry has a null quantity and the other has a real value,
 * the real value is used. If both have values, they are added.
 * Prefers GRAMM/LITER over PIECE when units differ.
 */
export function mergeIngredients(
    ingredients: RecipeIngredient[],
): RecipeIngredient[] {
    const UNIT_PREFERENCE: Record<string, number> = { PIECE: 0, GRAMM: 1, LITER: 1 }

    const merged = new Map<string, RecipeIngredient>()

    for (const i of ingredients) {
        const existing = merged.get(i.ingredient_slug)
        if (existing) {
            // Pick the better unit — prefer GRAMM/LITER over PIECE
            if (UNIT_PREFERENCE[i.unit] > UNIT_PREFERENCE[existing.unit]) {
                existing.unit = i.unit
            }

            // Merge quantities
            if (existing.quantity === null && i.quantity !== null) {
                existing.quantity = i.quantity
            } else if (existing.quantity !== null && i.quantity !== null) {
                existing.quantity += i.quantity
            }
            // both null → keep null, existing non-null & i null → keep existing
        } else {
            merged.set(i.ingredient_slug, { ...i })
        }
    }

    return Array.from(merged.values())
}

export function parseIngredient(input: string): Array<RecipeIngredient> {
    const matches = Array.from(input.matchAll(ingredientSlugRegex))

    const parsed = matches.map((match) => {
        const [, rawQuantity = "", rawUnit = "", ingredient_slug = ""] = match
        const normalizedQuantity = rawQuantity.replace(",", ".")
        const quantity = normalizedQuantity ? Number.parseFloat(normalizedQuantity) : 0
        const mapping = normalizeUnit(rawUnit.trim())

        return {
            ingredient_slug,
            quantity: Number.isNaN(quantity) ? null : quantity * mapping.factor,
            unit: mapping.unit,
        }
    })

    return mergeIngredients(parsed)
}