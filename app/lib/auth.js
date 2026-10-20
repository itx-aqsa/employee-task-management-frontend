// Shared auth helpers used by every protected page.

import { apiFetch, ROLES, ROLE_DASHBOARD, setStoredAgencyId, clearStoredAgencyId } from "./api";

/**
 * Verify the session, enforce role access, and redirect if needed.
 * Returns the profile object on success, or null if redirected.
 *
 * Side-effect: if the profile includes agencyId (once the backend exposes it),
 * it is cached in localStorage so every subsequent apiFetch automatically
 * sends the X-Agency-Id header without each page having to pass it manually.
 */
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

        // Persist agencyId so apiFetch sends X-Agency-Id automatically.
        // For SUPER_ADMIN and EMPLOYEE this will be null/undefined — that's
        // correct; clearStoredAgencyId ensures no stale value lingers.
        if (profile?.agencyId) {
            setStoredAgencyId(profile.agencyId);
        } else {
            // SUPER_ADMIN / EMPLOYEE: clear any leftover value from a
            // previous admin session on the same browser.
            clearStoredAgencyId();
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
    // Clear the cached agency so the next login starts fresh.
    clearStoredAgencyId();
    router.push("/login");
}
