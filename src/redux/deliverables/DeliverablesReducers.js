import {
    addDeliverableActions,
    getAvailableDeliverablesActions,
    getDeliverablesActions,
    updateDeliverableActions,
    deleteDeliverableActions, SET_DELIVERABLES_SORTED, DELIVERABLES_SORTED
} from "./DeliverablesActions";
import _ from "lodash"

const initialState = {
    deliverables: {},
    error: null
}

export function deliverables(state = initialState, action) {
    switch (action.type) {
        case addDeliverableActions.success:
            return {deliverables: {...state.deliverables, [action.data.uuid]: action.data},
                error: null};
        case updateDeliverableActions.success:
            const result = state.deliverables[action.data.deliverableUUID];
            if (result) {
                const updated_item = {...result, ...action.data.payload};
                return {deliverables: {...state.deliverables, [action.data.deliverableUUiD]: updated_item},
                error: null};
            } else {
                return state
            }
        case getDeliverablesActions.success:
            return {deliverables: action.data, error: null};
        case getDeliverablesActions.failure:
            return {...initialState, error: action.error}
        case deleteDeliverableActions.success:
            return {deliverables: _.omit(state.deliverables, action.data), error: null};
        default:
            return state
    }
}

const initialStateAvailables = {
    deliverables: [],
    error: null
}

export function availableDeliverables(state = initialStateAvailables, action) {
    switch (action.type) {
        case getAvailableDeliverablesActions.success:
            return {deliverables: action.data, error: null};
        default:
            return state
    }
}

const initialDeliverablesSorted = {
    deliverables: [],
    defaults: []

}

export function deliverablesSorted(state = initialDeliverablesSorted, action) {
    switch (action.type) {
        case DELIVERABLES_SORTED:
            return action.data;
        default:
            return state;
    }
}