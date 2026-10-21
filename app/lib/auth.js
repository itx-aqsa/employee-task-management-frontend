import { apiFetch, ROLES, ROLE_DASHBOARD, setStoredAgencyId, clearStoredAgencyId } from "./api";

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
            router.push(ROLE_DASHBOARD[role] || "/login");
            return null;
        }

        // Cache agencyId so X-Agency-Id is sent on all subsequent requests.
        // SUPER_ADMIN has no agency — clear any stale value.
        if (profile?.agencyId) {
            setStoredAgencyId(profile.agencyId);
        } else {
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
    clearStoredAgencyId();
    router.push("/login");
}
