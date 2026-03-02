// Admin auth utilities using localStorage

const AUTH_KEY = "rafeeq_admin_session";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "rafeeq2026";

export function login(username: string, password: string): boolean {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
        return true;
    }
    return false;
}

export function logout(): void {
    localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;
    try {
        const { loggedIn } = JSON.parse(session);
        return loggedIn === true;
    } catch {
        return false;
    }
}
