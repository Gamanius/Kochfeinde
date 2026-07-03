import type { InsertIngredientSchemaType } from "@kochfeinde/shared";

const api = "https://api.webapp.prod.blv.foodcase-services.com/BLV_WebApp_WS/webresources/BLV-api/"

/** Maps Swiss BLV component codes to our schema field keys */
const codeToField: Record<string, keyof InsertIngredientSchemaType> = {
    ENERCC: "calories",
    FAT: "totalFat",
    FASAT: "fatSaturated",
    CHORL: "cholesterol",
    CHO: "totalCarbohydrates",
    SUGAR: "totalSugars",
    FIBT: "dietaryFiber",
    PROT625: "protein",
    NACL: "salt",
    WATER: "water",
    VITARE: "vitaminA",
    VITB12: "vitaminB12",
    VITC: "vitaminC",
    VITD: "vitaminD",
    K: "potassium",
    NA: "sodium",
    CA: "calcium",
    FE: "iron",
}

type SwissBlvValue = {
    rawValue: number | null
    component: { code: string }
}

export async function getIngredientfromSwissID(id: number): Promise<InsertIngredientSchemaType> {
    // Step 1: resolve swiss food id → internal dbid
    const dbidRes = await fetch(new URL(`fooddbid/${id}`, api), {
        method: "GET",
        headers: { accept: "application/json" },
    })
    const dbid = await dbidRes.text()

    // Step 2: fetch full food data
    const foodRes = await fetch(new URL(`food/${dbid}?lang=de`, api), {
        method: "GET",
        headers: { accept: "application/json" },
    })
    const data: {
        name: string
        values: SwissBlvValue[]
    } = await foodRes.json()


    // Step 3: build a lookup by component code
    const byCode = new Map<string, number>()
    for (const v of data.values) {
        if (v.rawValue !== null) {
            byCode.set(v.component.code, v.rawValue)
        }
    }

    // Step 4: unsaturated = monounsaturated + polyunsaturated
    const fams = byCode.get("FAMS") ?? 0
    const fapu = byCode.get("FAPU") ?? 0

    // Step 5: map to our schema
    const result: InsertIngredientSchemaType = {
        name: data.name,
    }

    for (const [code, field] of Object.entries(codeToField)) {
        const val = byCode.get(code)
        if (val !== undefined) {
            (result as Record<string, unknown>)[field] = val
        }
    }

    result.fatUnsaturated = Math.round((fams + fapu) * 100) / 100

    return result
}