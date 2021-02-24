import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getAvailablePatchesPrefix = "GET_AVAILABLE_PATCHES";
export const getAvailablePatchesActions = createRequestActions(getAvailablePatchesPrefix);
export const {getAvailablePatchesRequest, getAvailablePatchesSuccess, getAvailablePatchesFailure} = createRequestFunctions(getAvailablePatchesActions);
