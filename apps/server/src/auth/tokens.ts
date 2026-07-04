import jwt from "jsonwebtoken";

// Dev fallbacks — set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env for production
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret-change-me";

export function generateAccessToken(userId: string): string {
    return jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string): string {
    return jwt.sign({ sub: userId, type: "refresh" }, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(
    token: string,
): { sub: string } | null {
    try {
        const payload = jwt.verify(token, ACCESS_SECRET);
        if (typeof payload === "string") return null;
        return { sub: payload.sub as string };
    } catch {
        return null;
    }
}

export function verifyRefreshToken(
    token: string,
): { sub: string } | null {
    try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        if (typeof payload === "string") return null;
        return { sub: payload.sub as string };
    } catch {
        return null;
    }
}
