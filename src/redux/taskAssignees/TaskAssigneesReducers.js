import {
    addTaskAssignedRiderActions,
    removeTaskAssignedRiderActions,
    getTaskAssignedRidersActions
} from "./TaskAssigneesActions";
import _ from "lodash"

const initialTaskAssigneesState = {assignees: [], error: null};

// TODO: don't think this is used anywhere
export function taskAssignees(state = initialTaskAssigneesState, action) {
    switch (action.type) {
        case addTaskAssignedRiderActions.success:
            return {assignees: {...state.assignees, [action.data.payload.rider.uuid]: action.data.payload.rider},
            error: null};
        case removeTaskAssignedRiderActions.success:
            return {assignees: _.omit(state.assignees, action.data.payload.user_uuid), error: null}
        case getTaskAssignedRidersActions.success:
            return {assignees: action.data, error: null}
        default:
            return state;
    }
}
