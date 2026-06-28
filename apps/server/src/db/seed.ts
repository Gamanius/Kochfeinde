import { db } from "./database";
import { recipeTable } from "./schema";

async function main() {
    db.insert(recipeTable).values({
        name: "Bananenshake",
        slug: "banane"
    })
}

await main()