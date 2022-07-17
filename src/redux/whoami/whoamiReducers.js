import * as actions from "./whoamiActions";

const whoamiInitialState = {
    user: {
        id: null,
        address: null,
        name: null,
        email: null,
        dateOfBirth: null,
        riderResponsibility: null,
        roles: [],
        displayName: null,
        createdAt: null,
        modifiedAt: null,
    },
    error: null,
};

export function whoami(state = whoamiInitialState, action) {
    switch (action.type) {
        case actions.GET_WHOAMI_SUCCESS:
            return { user: action.data, error: null };
        case actions.GET_WHOAMI_FAILURE:
            return { ...whoamiInitialState, error: action.error };
        case actions.CLEAR_WHOAMI:
            return whoamiInitialState;
        default:
            return state;
    }
}
