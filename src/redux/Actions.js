import {saveKanbanMode} from "../utilities";


export const GET_ACTIVE_TASK_UUID = 'GET_ACTIVE_TASK_UUID';
export const SET_ACTIVE_TASK_UUID = 'GET_ACTIVE_TASK_UUID';

export function getActiveTaskUUID() {
    return { type: GET_ACTIVE_TASK_UUID }
}

export function setActiveTaskUUID() {
    return { type: SET_ACTIVE_TASK_UUID }
}

export const CLEAR_LOADING = 'CLEAR_LOADING';

export function clearLoading() {
    return { type: CLEAR_LOADING }
}

export const GET_WHOAMI = 'GET_WHOAMI';
export const GET_WHOAMI_SUCCESS = 'GET_WHOAMI_SUCCESS';

export function getWhoami() {
    return { type: GET_WHOAMI }
}

export function getWhoamiSuccess(data) {
    return { type: GET_WHOAMI_SUCCESS, data }
}

export const SET_VIEW_MODE = 'SET_VIEW_MODE';

export function setViewMode(data) {
    saveKanbanMode(data);
    return { type: SET_VIEW_MODE, data }
}

export const SET_MOBILE_VIEW = 'SET_MOBILE_VIEW';

export function setMobileView(data) {
    return { type: SET_MOBILE_VIEW, data }
}

export const SET_MENU_INDEX = 'SET_MENU_INDEX';

export function setMenuIndex(data) {
    return { type: SET_MENU_INDEX, data }
}
