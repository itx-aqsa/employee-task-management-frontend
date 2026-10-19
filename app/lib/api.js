/**
 * Central API client for Employee Task Management.
 *
 * All fetch calls should go through this module so that:
 *  - The base URL is driven by NEXT_PUBLIC_API_URL (falls back to localhost:5000 for dev)
 *  - Cookie credentials are always included
 *  - Any future global headers (e.g. X-Agency-Id) are applied in one place
 */

export const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Role constants ───────────────────────────────────────────────────────────
export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE",
};

// ─── Dashboard routes per role ────────────────────────────────────────────────
export const ROLE_DASHBOARD = {
    [ROLES.SUPER_ADMIN]: "/dashboard/super-admin",
    [ROLES.ADMIN]: "/dashboard/admin",
    [ROLES.EMPLOYEE]: "/dashboard/employee",
};

/**
 * Build shared fetch options.
 * If `agencyId` is provided it is forwarded as the `X-Agency-Id` header so
 * the backend can scope queries to the correct agency.
 *
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method
 * @param {object|null} body  – will be JSON-serialised
 * @param {string|number|null} agencyId – optional agency context header
 */
export function buildOptions(method = "GET", body = null, agencyId = null) {
    const headers = {};

    if (body !== null) {
        headers["Content-Type"] = "application/json";
    }

    // Agency scoping header — expected by backend routes /tasks, /users, etc.
    if (agencyId != null) {
        headers["X-Agency-Id"] = String(agencyId);
    }

    const options = {
        method,
        headers,
        credentials: "include",
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    return options;
}

/**
 * Thin wrapper around fetch that prepends BASE_URL and applies shared options.
 *
 * @param {string} path    – e.g. "/users/profile"
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method
 * @param {object|null} body
 * @param {string|number|null} agencyId
 */
export async function apiFetch(path, method = "GET", body = null, agencyId = null) {
    const response = await fetch(`${BASE_URL}${path}`, buildOptions(method, body, agencyId));
    const data = await response.json();
    return { response, data };
}
