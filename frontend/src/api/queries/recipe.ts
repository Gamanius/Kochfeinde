import { queryOptions } from "@tanstack/react-query"
import { api } from "../queries"

export function apiGetClients() {
    return queryOptions({
        queryKey: ["recipe"],
        queryFn: async () => {
            const res = await api.GET("/recipes")
            
            if (res.response.status !== 200) {
                throw new Error("Couldn't fetch recipes")
            }
            
            return res.data
        },
    })
}