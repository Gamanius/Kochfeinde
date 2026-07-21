import { useTRPC } from "#/query/trcp"
import { zodResolver } from "@hookform/resolvers/zod"
import { InsertIngredientSchema } from "@kochfeinde/shared"
import type { InsertIngredientSchemaType } from "@kochfeinde/shared"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { useState } from "react"
import Card from "../card";
import { getIngredientfromSwissID } from "./fillingredient"
import { nutritionFields } from "./nutrition"

export default function IngredientAdd() {
    const trcp = useTRPC()
    const query = useQueryClient()
    const router = useRouter()

    const mut = useMutation(trcp.ingredient.insert.mutationOptions({
        onSuccess: (data) => {
            query.invalidateQueries(trcp.ingredient.list.queryOptions())
            if (data.name === undefined) {
                router.navigate( {to: "/ingredient"})
                return
            }
            router.navigate({to: "/ingredient/$slug", params: {slug: data.name.slug}})
        }
    }))
    const {register, handleSubmit, setValue, formState: { errors },} = useForm({
        resolver: zodResolver(InsertIngredientSchema),
    })

    const [blvId, setBlvId] = useState("")
    const [importing, setImporting] = useState(false)

    const handleImport = async () => {
        const id = Number(blvId)
        if (!id) return
        setImporting(true)
        try {
            const data = await getIngredientfromSwissID(id)
            if (data.name) setValue("name", data.name)
            for (const [key, val] of Object.entries(data)) {
                if (key === "name") continue
                setValue(key as keyof InsertIngredientSchemaType, val as never)
            }
        } finally {
            setImporting(false)
        }
    }

    const onSubmit = (data: InsertIngredientSchemaType) => {
        mut.mutate(data)
    }

    return <>
        <Card title="Zutat hinzufügen">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between flex-wrap">

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Allgemeine Information</legend>
                <label className="floating-label">
                    <span>Zutaten Name</span>
                <input type="text" className="input" placeholder="Zutaten Name" {...register("name")}/>
                </label>

                  {errors.name ? (
                    <p className="label text-error">{errors.name.message}</p>
                ) : (
                    <p className="label">
                    Es können nicht zwei Zutaten mit dem selben Namen existieren.
                    </p>
                )}

            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Aus <a className="underline" href="https://naehrwertdaten.ch" target="_blank" rel="noopener noreferrer">Schweizer Nährwertdatenbank</a> importieren</legend>
                <div className="flex gap-2 items-end">
                    <label className="floating-label">
                        <span className="label-text">ID</span>
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            placeholder="ID z.B. 378"
                            value={blvId}
                            onChange={(e) => setBlvId(e.target.value)}
                        />
                    </label>
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={handleImport}
                        disabled={importing || !blvId}
                    >
                        {importing ? "Importiere…" : "Importieren"}
                    </button>
                </div>
            </fieldset>
            </div>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nährwerte (pro 100g)</legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {nutritionFields.map(({ key, label, unit }) => (
                        <label key={key} className="form-control w-full max-w-xs">
                            <span className="label-text">{label} ({unit})</span>
                            <input
                                type="number"
                                step="any"
                                className="input input-bordered w-full"
                                {...register(key as keyof InsertIngredientSchemaType)}
                            />
                        </label>
                    ))}
                </div>
            </fieldset>
            
            <p className="text-error">
                {mut.error?.message}
            </p>
            <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary">Save</button>
            </div>
        </form>
        </Card>
    </>
}