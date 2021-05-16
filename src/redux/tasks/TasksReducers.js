import {
    UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET,
    UPDATE_TASK_FROM_SOCKET,
    UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET,
    ADD_TASK_FROM_SOCKET,
    DELETE_TASK_FROM_SOCKET,
    RESTORE_TASK_FROM_SOCKET,
    ADD_TASK_RELAY_FROM_SOCKET,
    RESET_GROUP_RELAY_UUIDS,
    GROUP_RELAYS_TOGETHER,
    PUT_TASK_FROM_SOCKET,
    UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET,
    UPDATE_TASK_TIME_REJECTED_FROM_SOCKET,
    UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET,
    UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET,
    UPDATE_TASK_PICKUP_LOCATION_FROM_SOCKET,
    UPDATE_TASK_DROPOFF_LOCATION_FROM_SOCKET,
    updateTaskTimeOfCallActions,
    addTaskActions,
    restoreTaskActions,
    addTaskRelayActions,
    putTaskActions,
    updateTaskActions,
    updateTaskRequesterContactActions,
    updateTaskPriorityActions,
    updateTaskPatchActions,
    updateTaskPickupTimeActions,
    updateTaskDropoffTimeActions,
    updateTaskCancelledTimeActions,
    updateTaskRejectedTimeActions, deleteTaskActions, getTasksActions, taskCategoryActions, REPLACE_TASKS_STATE

} from "./TasksActions";
import {
    convertToRelays,
    taskGroupSort,
    removeParentFromTasks,
    addAssigneeToList,
    removeAssigneeFromList,
    sortAndConcat
} from "./task_redux_utilities";
import update from "immutability-helper";
import {
    convertTaskGroupToObject,
    findExistingTaskParent,
    findExistingTaskParentByID,
} from "../../utilities";
import {
    appendTasksDeliveredActions,
    appendTasksCancelledActions,
    appendTasksRejectedActions
} from "./TasksWaypointActions";
import _ from "lodash"
import {
    addTaskAssignedCoordinatorActions,
    addTaskAssignedRiderActions, removeTaskAssignedCoordinatorActions,
    removeTaskAssignedRiderActions
} from "../taskAssignees/TaskAssigneesActions";
import {
    setTaskDropoffDestinationActions,
    setTaskPickupDestinationActions, unsetTaskDropoffDestinationActions, unsetTaskPickupDestinationActions
} from "../taskDestinations/TaskDestinationsActions";

export const initialTasksState = {
    tasks: {
        tasksNew: [],
        tasksActive: [],
        tasksRejected: [],
        tasksCancelled: [],
        tasksPickedUp: [],
        tasksDelivered: []
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
    if (action.type && categoriesCheck.includes(action.type)) {
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
