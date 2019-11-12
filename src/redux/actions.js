/*
 * action types
 */

export const ADD_TASK = 'ADD_TASK';

/*
 * other constants
 */

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action creators
 */

export function addTask(data) {
    return { type: ADD_TASK, data }
}

