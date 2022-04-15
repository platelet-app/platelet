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

export const INSERT_TASK_ASSIGNEE = "INSERT_TASK_ASSIGNEE";

export function insertTaskAssignee(newTaskAssignee) {
    return {
        type: INSERT_TASK_ASSIGNEE,
        newTaskAssignee,
    };
}

export const DELETE_TASK_ASSIGNEE = "DELETE_TASK_ASSIGNEE";

export function deleteTaskAssignee(deletedTaskAssignee) {
    return {
        type: DELETE_TASK_ASSIGNEE,
        deletedTaskAssignee,
    };
}
