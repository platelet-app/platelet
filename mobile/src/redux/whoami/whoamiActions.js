export const GET_WHOAMI_REQUEST = "GET_WHOAMI_REQUEST";
export const REFRESH_WHOAMI_REQUEST = "REFRESH_WHOAMI_REQUEST";
export const GET_WHOAMI_SUCCESS = "GET_WHOAMI_SUCCESS";
export const GET_WHOAMI_FAILURE = "GET_WHOAMI_FAILURE";
export const CLEAR_WHOAMI = "CLEAR_WHOAMI";
export const INIT_WHOAMI_OBSERVER = "INIT_WHOAMI_OBSERVER";
export const SET_TENANT_ID = "SET_TENANT_ID";

export function getWhoamiRequest() {
    return { type: GET_WHOAMI_REQUEST };
}

export function refreshWhoamiRequest() {
    return { type: REFRESH_WHOAMI_REQUEST };
}

export function clearWhoami() {
    return { type: CLEAR_WHOAMI };
}

export function getWhoamiSuccess(data) {
    return { type: GET_WHOAMI_SUCCESS, data };
}

export function initWhoamiObserver(whoamiId) {
    return { type: INIT_WHOAMI_OBSERVER, whoamiId };
}

export function getWhoamiFailure(error) {
    return { type: GET_WHOAMI_FAILURE, error };
}

export function setTenantId(data) {
    return { type: SET_TENANT_ID, data };
}
