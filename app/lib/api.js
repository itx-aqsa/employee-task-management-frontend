export const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE",
};

export const ROLE_DASHBOARD = {
    [ROLES.SUPER_ADMIN]: "/dashboard/super-admin",
    [ROLES.ADMIN]: "/dashboard/admin",
    [ROLES.EMPLOYEE]: "/dashboard/employee",
};

const AGENCY_KEY = "x_agency_id";

export function setStoredAgencyId(id) {
    if (typeof window === "undefined") return;
    if (id != null) {
        localStorage.setItem(AGENCY_KEY, String(id));
    } else {
        localStorage.removeItem(AGENCY_KEY);
    }
}

export function getStoredAgencyId() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AGENCY_KEY) ?? null;
}

export function clearStoredAgencyId() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AGENCY_KEY);
}

export function buildOptions(method = "GET", body = null, agencyId = null) {
    const headers = {};

    if (body !== null) {
        headers["Content-Type"] = "application/json";
    }

    const resolvedAgencyId = agencyId ?? getStoredAgencyId();
    if (resolvedAgencyId != null) {
        headers["X-Agency-Id"] = String(resolvedAgencyId);
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
    const options = buildOptions(method, body, agencyId);
    console.log(
        `[apiFetch] ${method} ${path} | X-Agency-Id: ${options.headers["X-Agency-Id"] ?? "(none)"}`
    );
    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();
    return { response, data };
}
