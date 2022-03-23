export const INIT_TASK_ASSIGNEES = "INIT_TASK_ASSIGNEES";

export function initTaskAssignees() {
    return {
        type: INIT_TASK_ASSIGNEES,
    };
}

export const SET_TASK_ASSIGNEES = "SET_TASK_ASSIGNEES";

export function setTaskAssignees(taskAssignees) {
    return {
        type: SET_TASK_ASSIGNEES,
        taskAssignees,
    };
}
