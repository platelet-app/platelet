import * as actions from "./awsHubListenerActions";

const initialState = {
    network: false,
    ready: false,
};

export function awsHubDataStoreEventsReducer(state = initialState, action) {
    switch (action.type) {
        case actions.setNetworkStatusAction:
            return { ...state, network: action.data };
        case actions.setReadyStatusAction:
            return { ...state, ready: action.data };
        default:
            return state;
    }
}
