// Shared auth helpers used by every protected page.

import { apiFetch, ROLES, ROLE_DASHBOARD } from "./api";

// Verifies the session, enforces role access, and redirects if needed.
// Returns the profile object on success, or null if redirected.
export async function requireRole(router, allowedRoles) {
    try {
        const { response, data } = await apiFetch("/users/profile");

        if (!response.ok) {
            router.push("/login");
            return null;
        }

        const profile = data.data;
        const role = profile?.role;

        if (!allowedRoles.includes(role)) {
            // Send to the user's own dashboard, or /login for unknown roles.
            const destination = ROLE_DASHBOARD[role] || "/login";
            router.push(destination);
            return null;
        }

        return profile;
    } catch {
        router.push("/login");
        return null;
    }
}

export async function logout(router) {
    try {
        await apiFetch("/users/logout", "POST");
    } catch {
        // redirect regardless
    }
    router.push("/login");
}
