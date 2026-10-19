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

export function buildOptions(method = "GET", body = null, agencyId = null) {
    const headers = {};

    if (body !== null) {
        headers["Content-Type"] = "application/json";
    }

    // X-Agency-Id scopes the request to the correct agency on the backend.
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

export async function apiFetch(path, method = "GET", body = null, agencyId = null) {
    const response = await fetch(`${BASE_URL}${path}`, buildOptions(method, body, agencyId));
    const data = await response.json();
    return { response, data };
}
