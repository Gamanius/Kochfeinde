import createClient from "openapi-fetch/dist/index.cjs";
import type { paths } from "./scheme";

const BASE_URL = "/api";

export const api = createClient<paths>({
    baseUrl: BASE_URL,
    credentials: "include",
    fetch: customFetch
})


async function customFetch(input: Request): Promise<Response> {
    const response = await fetch(input)

    if (response.status !== 401) {
        return response
    }

    // TODO Implement auth later
    // const refresh = await refreshToken()
    
    //if (!refresh.ok) {
    //    return response; 
    //}
    
    return fetch(input);
}