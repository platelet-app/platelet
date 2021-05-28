import {
    getTasksActions,
    taskCategoryActions,
    REPLACE_TASKS_STATE,
} from "./TasksActions";
import {
    removeParentFromTasks,
} from "./task_redux_utilities";
import {
    findExistingTaskParent,
    findExistingTaskParentByID,
} from "../../utilities";
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
        // find the first task we can
        let task;
        for (const g of Object.values(action.data)) {
            for (const t of Object.values(g)) {
                task = t;
                break;
            }
            break;
        }
        // get the rest of the parent group from state
        const parent = findExistingTaskParent(state.tasks, task.uuid);
        if (parent.taskGroup) {
            // if we find it, filter it from existing state and use that in the main reducer
            filteredTasks = removeParentFromTasks(state.tasks, parent.listType, task.parent_id);
            if ([taskCategoryActions.tasksRejected.add, taskCategoryActions.tasksCancelled.add].includes(action.type)) {
                const existingCheck = findExistingTaskParentByID(
                    _.pick(state.tasks, ["tasksRejected", "tasksCancelled"])
                , parent.parentID);
                if (existingCheck.taskGroup)
                    action.data[parent.parentID] = {...existingCheck.taskGroup, ...action.data[parent.parentID]}

            }
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
