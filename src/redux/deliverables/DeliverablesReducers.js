import {
    GET_DELIVERABLES_SUCCESS,
    ADD_DELIVERABLE_SUCCESS,
    UPDATE_DELIVERABLE_SUCCESS,
    GET_AVAILABLE_DELIVERABLES_SUCCESS, GET_DELIVERABLES_FAILURE, DELETE_DELIVERABLE_SUCCESS, DELETE_DELIVERABLE_FAILURE
} from "./DeliverablesActions";
import _ from "lodash"

const initialState = {
    deliverables: {},
    error: null
}

export function deliverables(state = initialState, action) {
    switch (action.type) {
        case ADD_DELIVERABLE_SUCCESS:
            return {deliverables: {...state.deliverables, [action.data.uuid]: action.data},
                error: null};
        case UPDATE_DELIVERABLE_SUCCESS:
            const result = state.deliverables[action.data.deliverableUUID];
            if (result) {
                const updated_item = {...result, ...action.data.payload};
                return {deliverables: {...state.deliverables, [action.data.deliverableUUiD]: updated_item},
                error: null};
            } else {
                return state
            }
        case GET_DELIVERABLES_SUCCESS:
            return {deliverables: action.data, error: null};
        case GET_DELIVERABLES_FAILURE:
            return {deliverables: {}, error: action.error}
        case DELETE_DELIVERABLE_SUCCESS:
            return {deliverables: _.omit(state.deliverables, action.data), error: null};
        case DELETE_DELIVERABLE_FAILURE:
            return {deliverables: state.deliverables, error: action.error}
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
        case GET_AVAILABLE_DELIVERABLES_SUCCESS:
            return {deliverables: action.data, error: null};
        default:
            return state
    }
}
