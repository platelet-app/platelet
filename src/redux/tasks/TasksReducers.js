import {
    getTasksActions,
    taskCategoryActions,
    REPLACE_TASKS_STATE,
} from "./TasksActions";
import {
    findExistingTask,
} from "./task_redux_utilities";
import _ from "lodash"

export const initialTasksState = {
    tasks: {
        tasksNew: {},
        tasksActive: {},
        tasksRejected: {},
        tasksCancelled: {},
        tasksPickedUp: {},
        tasksDelivered: {}
    },
    error: null
}

const categoriesCondense = () => {
    let result = [];
    for (const value of Object.values(taskCategoryActions)) {
        result.push(value.add);
    }
    return result;
}
const categoriesCheck = categoriesCondense();

export function tasks(state = initialTasksState, action) {
    let filteredTasks = state.tasks;
    if (categoriesCheck.includes(action.type)) {
        // we're adding to state -
        for (const key of Object.keys(action.data)) {
            const {listType} = findExistingTask(filteredTasks, key);
            if (listType)
                filteredTasks = {...filteredTasks, ..._.omit(filteredTasks[listType], key)}
        }

    }
    switch (action.type) {
        case taskCategoryActions.tasksNew.put:
            return {tasks: {...filteredTasks, tasksNew: action.data}, error: null};
        case taskCategoryActions.tasksNew.add:
            return {tasks: {...filteredTasks, tasksNew: {...filteredTasks.tasksNew, ...action.data}}, error: null}
        case taskCategoryActions.tasksActive.put:
            return {tasks: {...filteredTasks, tasksActive: action.data}, error: null};
        case taskCategoryActions.tasksActive.add:
            return {tasks: {...filteredTasks, tasksActive: {...filteredTasks.tasksActive, ...action.data}}, error: null}
        case taskCategoryActions.tasksPickedUp.put:
            return {tasks: {...filteredTasks, tasksPickedUp: action.data}, error: null};
        case taskCategoryActions.tasksPickedUp.add:
            return {tasks: {...filteredTasks, tasksPickedUp: {...filteredTasks.tasksPickedUp, ...action.data}}, error: null}
        case taskCategoryActions.tasksDelivered.put:
            return {tasks: {...filteredTasks, tasksDelivered: action.data}, error: null};
        case taskCategoryActions.tasksDelivered.add:
            return {tasks: {...filteredTasks, tasksDelivered: {...filteredTasks.tasksDelivered, ...action.data}}, error: null}
        case taskCategoryActions.tasksRejected.put:
            return {tasks: {...filteredTasks, tasksRejected: action.data}, error: null};
        case taskCategoryActions.tasksRejected.add:
            return {tasks: {...filteredTasks, tasksRejected: {...filteredTasks.tasksRejected, ...action.data}}, error: null}
        case taskCategoryActions.tasksCancelled.put:
            return {tasks: {...filteredTasks, tasksCancelled: action.data}, error: null};
        case taskCategoryActions.tasksCancelled.add:
            return {tasks: {...filteredTasks, tasksCancelled: {...filteredTasks.tasksCancelled, ...action.data}}, error: null}
        case getTasksActions.success:
        case REPLACE_TASKS_STATE:
            return {tasks: action.data, error: null};
        case getTasksActions.failure:
            return {...initialTasksState, error: action.error};
        default:
            return state;
    }
}
