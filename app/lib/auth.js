/**
 * Shared authentication helpers.
 *
 * Every protected page calls `requireRole(router, allowedRoles)` inside its
 * useEffect to verify the session and redirect if the role doesn't match.
 *
 * Returns the full profile object on success, or null if redirected.
 */

import { apiFetch, ROLES, ROLE_DASHBOARD } from "./api";

/**
 * Fetch the current user's profile and enforce role-based access.
 *
 * @param {import("next/navigation").AppRouterInstance} router
 * @param {string[]} allowedRoles  – e.g. [ROLES.ADMIN, ROLES.SUPER_ADMIN]
 * @returns {Promise<object|null>}  profile data or null (already redirected)
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
            // Redirect to the user's own dashboard if they're just in the wrong place,
            // otherwise send them back to login for unknown roles.
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

/**
 * Log the current user out and navigate to /login.
 *
 * @param {import("next/navigation").AppRouterInstance} router
 */
export async function logout(router) {
    try {
        await apiFetch("/users/logout", "POST");
    } catch {
        // swallow – we redirect regardless
    }
    router.push("/login");
}
