import * as actions from "./taskAssigneesActions";

const initialState = { items: [], isSynced: false, ready: false };

export function taskAssigneesReducer(state = initialState, action) {
    switch (action.type) {
        case actions.SET_TASK_ASSIGNEES:
            return action.taskAssignees;
        case actions.INSERT_TASK_ASSIGNEE:
            return {
                ...state,
                items: [...state.items, action.newTaskAssignee],
            };
        case actions.DELETE_TASK_ASSIGNEE:
            console.log({
                ...state,
                items: state.items.filter(
                    (a) => a.id !== action.deletedTaskAssignee.id
                ),
            });
            return {
                ...state,
                items: state.items.filter(
                    (a) => a.id !== action.deletedTaskAssignee.id
                ),
            };
        default:
            return state;
    }
}
