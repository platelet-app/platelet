import * as actions from "./taskAssigneesActions";

const initialState = { items: [], isSynced: false, ready: false };

export function taskAssigneesReducer(state = initialState, action) {
    switch (action.type) {
        case actions.SET_TASK_ASSIGNEES:
            return action.taskAssignees;
        case actions.ADD_ASSIGNEE:
            return {
                ...state,
                items: [
                    action.assignee,
                    ...state.items.filter((a) => a.id !== action.assignee.id),
                ],
            };
        default:
            return state;
    }
}
