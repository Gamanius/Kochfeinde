import type { ServerResponse } from "http";

const REFRESH_COOKIE_NAME = "kochfeinde_refresh";
const ACCESS_COOKIE_NAME = "kochfeinde_access";
const SEVEN_DAYS = 7 * 24 * 60 * 60; // seconds
const FIFTEEN_MINUTES = 15 * 60; // seconds


export function setCookies(res: ServerResponse, access: string, refresh: string) : void {
    res.setHeader("Set-Cookie", [
        `${ACCESS_COOKIE_NAME}=${access}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${FIFTEEN_MINUTES}`,
        `${REFRESH_COOKIE_NAME}=${refresh}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SEVEN_DAYS}`,
    ]);
}

export function clearCookies(res: ServerResponse): void {
    res.setHeader("Set-Cookie", [
        `${ACCESS_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
        `${REFRESH_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
    ]);
}

export function getRefreshToken(req: { headers: { cookie?: string } }): string | null {
    return getCookie(req, REFRESH_COOKIE_NAME);
}

export function getAccessToken(req: { headers: { cookie?: string } }): string | null {
    return getCookie(req, ACCESS_COOKIE_NAME);
}

function getCookie(req: { headers: { cookie?: string } }, name: string): string | null {
    const cookies = req.headers.cookie;
    if (!cookies) return null;

    for (const c of cookies.split(";")) {
        const [key, ...rest] = c.trim().split("=");
        if (key === name) {
            return rest.join("=");
        }
    }
    return null;
}