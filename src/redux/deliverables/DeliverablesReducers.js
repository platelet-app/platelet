import update from "immutability-helper";
import {
    GET_DELIVERABLES_SUCCESS,
    ADD_DELIVERABLE_SUCCESS,
    UPDATE_DELIVERABLE_SUCCESS,
    GET_AVAILABLE_DELIVERABLES_SUCCESS
} from "./DeliverablesActions";

export function deliverables(state = [], action) {
    switch (action.type) {
        case ADD_DELIVERABLE_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_DELIVERABLE_SUCCESS:
            let result = state.filter(deliverable => deliverable.uuid === action.data.deliverableUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            } else {
                return state
            }
        case GET_DELIVERABLES_SUCCESS:
            return action.data;

        default:
            return state
    }
}

export function availableDeliverables(state = [], action) {
    switch (action.type) {
        case GET_AVAILABLE_DELIVERABLES_SUCCESS:
            return action.data;
        default:
            return state
    }

}

