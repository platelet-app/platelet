import {getAvailablePatchesActions} from "./PatchesActions";

const initialState = {patches: [], error: null}

export function availablePatches(state = initialState, action) {
    switch (action.type) {
        case getAvailablePatchesActions.success:
            return {patches: action.data, error: null};
        case getAvailablePatchesActions.failure:
            return {...initialState, error: action.error}
        default:
            return state
    }
}
