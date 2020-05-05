import {GET_AVAILABLE_PATCHES_SUCCESS} from "./PatchesActions";

const initialState = {patches: [], error: null}

export function availablePatches(state = initialState, action) {
    switch (action.type) {
        case GET_AVAILABLE_PATCHES_SUCCESS:
            return {patches: action.data, error: null};
        default:
            return state
    }
}

