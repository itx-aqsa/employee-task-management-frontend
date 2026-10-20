// Central API client — base URL, role constants, and shared fetch helpers.

export const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE",
};

// Maps each role to its home dashboard route.
export const ROLE_DASHBOARD = {
    [ROLES.SUPER_ADMIN]: "/dashboard/super-admin",
    [ROLES.ADMIN]: "/dashboard/admin",
    [ROLES.EMPLOYEE]: "/dashboard/employee",
};

// ─── Agency ID storage ───────────────────────────────────────────────────────
// ADMIN pages scope every request to their agency via the X-Agency-Id header.
// The backend profile endpoint currently does not return agencyId, so we cache
// it in localStorage the moment we receive it (e.g. from the profile response
// once the backend adds the field, or from any other endpoint that returns it).
// SUPER_ADMIN and EMPLOYEE never set this — their requests are unscoped.

const AGENCY_KEY = "x_agency_id";

/** Persist agencyId for the current browser session. */
export function setStoredAgencyId(id) {
    if (typeof window === "undefined") return;
    if (id != null) {
        localStorage.setItem(AGENCY_KEY, String(id));
    } else {
        localStorage.removeItem(AGENCY_KEY);
    }
}

/** Read back the cached agencyId, or null if not set. */
export function getStoredAgencyId() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AGENCY_KEY) ?? null;
}

/** Clear the cached agencyId (call on logout). */
export function clearStoredAgencyId() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AGENCY_KEY);
}

// ─── Fetch helpers ───────────────────────────────────────────────────────────

/**
 * Build fetch options.
 *
 * agencyId resolution order:
 *   1. Explicit argument passed by the caller (highest priority)
 *   2. Value cached in localStorage by requireRole / login
 *   3. null → header is omitted (SUPER_ADMIN / EMPLOYEE / public routes)
 */
export function buildOptions(method = "GET", body = null, agencyId = null) {
    const headers = {};

    if (body !== null) {
        headers["Content-Type"] = "application/json";
    }

    // Resolve the agency to scope this request to.
    const resolvedAgencyId = agencyId ?? getStoredAgencyId();

    if (resolvedAgencyId != null) {
        headers["X-Agency-Id"] = String(resolvedAgencyId);
    }

    const options = {
        method,
        headers,
        credentials: "include", // send session cookie
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    return options;
}

export async function apiFetch(path, method = "GET", body = null, agencyId = null) {
    const response = await fetch(
        `${BASE_URL}${path}`,
        buildOptions(method, body, agencyId)
    );
    const data = await response.json();
    return { response, data };
}
