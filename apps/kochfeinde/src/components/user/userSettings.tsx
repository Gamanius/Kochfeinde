import { useTRPC } from "#/query/trcp";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Card from "../card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeDisplayNameSchema, ChangePasswordSchema } from "@kochfeinde/shared";
import type { ChangeDisplayNameType, ChangePasswordType } from "@kochfeinde/shared";

export default function UserSetting() {
    const trpc = useTRPC()
    const query = useQueryClient()
    const user = useSuspenseQuery(trpc.auth.get.queryOptions());

    const displayMut = useMutation(trpc.auth.updatedisplayname.mutationOptions({
        onSuccess: () => {
            query.invalidateQueries(trpc.auth.get.queryOptions())
            displayForm.reset()
        },
    }))

    const passwordMut = useMutation(trpc.auth.updatepassword.mutationOptions({
        onSuccess: () => {
            passwordForm.reset()
        },
    }))

    const displayForm = useForm<ChangeDisplayNameType>({
        resolver: zodResolver(ChangeDisplayNameSchema),
        defaultValues: { name: "" },
    })

    const passwordForm = useForm<ChangePasswordType>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: { oldPassword: "", password: "", confirmPassword: "" },
    })

    const onDisplaySubmit = (data: ChangeDisplayNameType) => {
        displayMut.mutate(data)
    }

    const onPasswordSubmit = (data: ChangePasswordType) => {
        passwordMut.mutate(data)
    }

    return (
        <div className="flex flex-col gap-6">
            <Card title="Einstellungen">
                <p><span className="font-semibold">Anmelde Name:</span> {user.data?.name}</p>
                <p><span className="font-semibold">Anzeige Name:</span> {user.data?.displayname}</p>
                <p><span className="font-semibold">Erstellt am:</span> {user.data?.creationdate}</p>
            </Card>

            <Card title="Anzeige Name ändern">
                <form onSubmit={displayForm.handleSubmit(onDisplaySubmit)} className="flex flex-col gap-4">
                    <fieldset className="fieldset">
                        <label className="floating-label">
                            <span>Neuer Anzeige Name</span>
                            <input type="text" className="input w-full" {...displayForm.register("name")} />
                        </label>
                        {displayForm.formState.errors.name && (
                            <p className="label text-error">{displayForm.formState.errors.name.message}</p>
                        )}
                    </fieldset>
                    {displayMut.error && <p className="text-error">{displayMut.error.message}</p>}
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" type="submit" disabled={displayMut.isPending}>
                            {displayMut.isPending ? "Speichern …" : "Speichern"}
                        </button>
                    </div>
                </form>
            </Card>

            <Card title="Passwort ändern">
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
                    <fieldset className="fieldset">
                        <label className="floating-label">
                            <span>Altes Passwort</span>
                            <input type="password" className="input w-full" {...passwordForm.register("oldPassword")} />
                        </label>
                        {passwordForm.formState.errors.oldPassword && (
                            <p className="label text-error">{passwordForm.formState.errors.oldPassword.message}</p>
                        )}
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="floating-label">
                            <span>Neues Passwort</span>
                            <input type="password" className="input w-full" {...passwordForm.register("password")} />
                        </label>
                        {passwordForm.formState.errors.password && (
                            <p className="label text-error">{passwordForm.formState.errors.password.message}</p>
                        )}
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="floating-label">
                            <span>Neues Passwort bestätigen</span>
                            <input type="password" className="input w-full" {...passwordForm.register("confirmPassword")} />
                        </label>
                        {passwordForm.formState.errors.confirmPassword && (
                            <p className="label text-error">{passwordForm.formState.errors.confirmPassword.message}</p>
                        )}
                    </fieldset>
                    {passwordMut.error && <p className="text-error">{passwordMut.error.message}</p>}
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" type="submit" disabled={passwordMut.isPending}>
                            {passwordMut.isPending ? "Speichern …" : "Speichern"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}