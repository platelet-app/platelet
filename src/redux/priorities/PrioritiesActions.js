import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getAvailablePrioritiesPrefix = "GET_AVAILABLE_PRIORITIES";
export const getAvailablePrioritiesActions = createRequestActions(getAvailablePrioritiesPrefix);
export const {getAvailablePrioritiesRequest, getAvailablePrioritiesSuccess, getAvailablePrioritiesFailure} = createRequestFunctions(getAvailablePrioritiesActions);
