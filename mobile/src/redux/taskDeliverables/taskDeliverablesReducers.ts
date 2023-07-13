import * as actions from "./taskDeliverablesActions";

const initialState = { items: [], isSynced: false, ready: false };

export function taskDeliverablesReducer(
    state = initialState,
    action: actions.TaskDeliverableActionType
) {
    switch (action.type) {
        case actions.SET_TASK_DELIVERABLES:
            return action.taskDeliverables;
        default:
            return state;
    }
}
