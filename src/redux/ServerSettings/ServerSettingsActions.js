import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getServerSettingsPrefix = "GET_SERVER_SETTINGS";
export const getServerSettingsActions = createRequestActions(getServerSettingsPrefix);
export const {getServerSettingsRequest, getServerSettingsFailure, getServerSettingsSuccess} = createRequestFunctions(getServerSettingsActions);

export const CLEAR_SERVER_SETTINGS = 'CLEAR_SERVER_SETTINGS';

export function clearServerSettings() {
    return { type: CLEAR_SERVER_SETTINGS }
}
