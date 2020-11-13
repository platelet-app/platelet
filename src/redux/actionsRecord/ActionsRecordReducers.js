import {GET_ACTIONS_RECORD_SUCCESS, GET_TASKS_ACTIONS_RECORD_SUCCESS} from "./ActionsRecordActions";

const initialState = {actionsRecord: [], error: null};

export function actionsRecord(state = initialState, action) {
    switch (action.type) {
        case GET_ACTIONS_RECORD_SUCCESS:
            return {actionsRecord: action.data, error: null};
        default:
            return state;
    }
}

export function tasksActionsRecord(state = initialState, action) {
    switch (action.type) {
        case GET_TASKS_ACTIONS_RECORD_SUCCESS:
            return {actionsRecord: action.data, error: null};
        default:
            return state;
    }
}
