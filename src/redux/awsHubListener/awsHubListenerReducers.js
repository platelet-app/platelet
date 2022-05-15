import * as actions from "./awsHubListenerActions";
import * as models from "../../models";

const initialState = {
    network: true,
    ready: false,
};

const initialSyncState = Object.values(models).reduce((acc, model) => {
    // maybe a better way than checking for copyOf function?
    if (model.name && !!model.copyOf) return { ...acc, [model.name]: false };
    else return acc;
}, {});

console.log("Syncing models: ", initialSyncState);

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

export function awsHubDataStoreModelsSyncedStatusReducer(
    state = initialSyncState,
    action
) {
    switch (action.type) {
        case actions.setModelSyncedStatusAction:
            return { ...state, [action.modelName]: true };
        case actions.setModelSyncedAllAction:
            return Object.keys(state).reduce((acc, key) => {
                return { ...acc, [key]: true };
            }, {});
        default:
            return state;
    }
}
