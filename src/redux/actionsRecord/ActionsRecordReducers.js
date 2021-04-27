import {
    getActionsRecordActions,
    getTasksActionsRecordActions
} from "./ActionsRecordActions";

export const actionsRecordInitialState = {actionsRecord: [], error: null};

export function actionsRecord(state = actionsRecordInitialState, action) {
    switch (action.type) {
        case getActionsRecordActions.success:
            return {actionsRecord: action.data, error: null};
        default:
            return state;
    }
}

export function tasksActionsRecord(state = actionsRecordInitialState, action) {
    switch (action.type) {
        case getTasksActionsRecordActions.success:
            return {actionsRecord: action.data, error: null};
        default:
            return state;
    }
}
