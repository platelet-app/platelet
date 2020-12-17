import {
    ADD_TASK_SUCCESS,
    CLEAR_CURRENT_TASK,
    DELETE_TASK_SUCCESS,
    GET_MY_TASKS_FAILURE,
    GET_MY_TASKS_SUCCESS,
    GET_TASK_SUCCESS,
    GET_TASKS_FAILURE,
    GET_TASKS_SUCCESS,
    RESTORE_TASK_SUCCESS,
    SET_CURRENT_TASK,
    UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET,
    UPDATE_TASK_ASSIGNED_RIDER_SUCCESS,
    UPDATE_TASK_CANCELLED_TIME_SUCCESS,
    UPDATE_TASK_REQUESTER_CONTACT_SUCCESS,
    UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS,
    UPDATE_TASK_DROPOFF_TIME_SUCCESS,
    UPDATE_TASK_FROM_SOCKET,
    UPDATE_TASK_PATCH_SUCCESS,
    UPDATE_TASK_PICKUP_ADDRESS_SUCCESS,
    UPDATE_TASK_PICKUP_TIME_SUCCESS,
    UPDATE_TASK_PRIORITY_SUCCESS,
    UPDATE_TASK_REJECTED_TIME_SUCCESS,
    UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET,
    UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS,
    UPDATE_TASK_SUCCESS,
    ADD_TASK_RELAY_SUCCESS,
    ADD_TASK_FROM_SOCKET,
    DELETE_TASK_FROM_SOCKET,
    RESTORE_TASK_FROM_SOCKET,
    ADD_TASK_RELAY_FROM_SOCKET,
    RESET_GROUP_RELAY_UUIDS,
    GROUP_RELAYS_TOGETHER,
    PUT_TASK_FROM_SOCKET,
    PUT_TASK_SUCCESS,
    UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET,
    UPDATE_TASK_TIME_REJECTED_FROM_SOCKET,
    UPDATE_TASK_ASSIGNED_COORDINATOR_SUCCESS,
    UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET,
    UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_SUCCESS,
    UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET, APPEND_TASKS_SUCCESS

} from "./TasksActions";
import {taskGroupSort} from "./task_redux_utilities";
import update from "immutability-helper";
import {
    convertTaskGroupToObject,
    determineTaskType,
    findExistingTaskParent,
    findExistingTaskParentByID,
} from "../../utilities";
import {
    APPEND_TASKS_CANCELLED_SUCCESS,
    APPEND_TASKS_DELIVERED_SUCCESS,
    APPEND_TASKS_REJECTED_SUCCESS
} from "./TasksWaypointActions";
import _ from "lodash"

const initialState = {
    task: {
        uuid: null,
        reference: "",
        etag: "",
        author: null,
        author_uuid: null,
        pickup_address: null,
        dropoff_address: null,
        patch: null,
        patch_id: null,
        requester_contact: {
            name: null,
            telephone_number: null
        },
        priority: null,
        session_uuid: null,
        time_of_call: null,
        deliverables: null,
        comments: null,
        links: null,
        time_picked_up: null,
        time_dropped_off: null,
        rider: null,
        assigned_riders: [],
        assigned_coordinators: [],
        priority_id: null,
        time_cancelled: null,
        time_rejected: null,
        patient_name: null,
        patient_contact_number: null,
        destination_contact_number: null,
        destination_contact_name: null,
        time_created: null,
        time_modified: null,
        parent_id: 0,
        order_in_relay: 0,
        assigned_riders_display_string: "",
        assigned_coordinators_display_string: ""
    },
    error: null
}

export function task(state = initialState, action) {
    switch (action.type) {
        case GET_TASK_SUCCESS:
            return {task: action.data, error: null};
        default:
            return state;
    }
}

export function currentTask(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_TASK:
            return {task: action.data, error: null};
        case CLEAR_CURRENT_TASK:
            return initialState;
        default:
            return state;
    }
}

export const initialTasksState = {
    tasks: {
        tasksNew: [],
        tasksActive: [],
        tasksRejected: [],
        tasksCancelled: [],
        tasksActivePickedUp: [],
        tasksDelivered: []
    },
    error: null
}

function sortAndConcat(tasks, data) {
    const sorted = determineTaskType(data);
    const result = {};
    for (const [key, value] of Object.entries(sorted)) {
        result[key] = {...tasks[key], ...value}
        //sorted[key] = sorted[key].sort((a, b) => b[0].parent_id - a[0].parent_id);
    }
    return {...tasks, ...result};
}


function convertToRelays(group) {
    let result = {};
    let currentParentId = -1;
    let currentIndex = -1;
    for (const t of group) {
        if (currentParentId !== t.parent_id) {
            currentParentId = t.parent_id;
            currentIndex += 1;
            result[currentParentId] = {};
        }
        result[currentParentId][t.uuid] = t;
    }
    return result;

}

function groupRelaysTogether(tasks) {
    let groupedTasks = {};
    for (const [key, value] of Object.entries(tasks)) {
        groupedTasks[key] = convertToRelays(value);
    }
    //  for (const [key, value] of Object.entries(groupedTasks)) {
    //      groupedTasks[key] = value.sort((a, b) => a.order_in_relay < b.order_in_relay);
    //  }
    return groupedTasks;
}

const addAssigneeToList = (task, user, role = "rider") => {
    if (role === "rider") {
        // add the assignee to the list
        const assigneesList = [...task.assigned_riders, user]
        return {
            assigned_riders: assigneesList,
            assigned_riders_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    } else if (role === "coordinator") {
        // add the assignee to the list
        const assigneesList = [...task.assigned_coordinators, user]
        return {
            assigned_coordinators: assigneesList,
            assigned_coordinators_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    }
}

const removeAssigneeFromList = (task, userUUID, role = "rider") => {
    if (role === "rider") {
        // remove the assignee from the list
        const assigneesList = task.assigned_riders.filter(u => u.uuid !== userUUID)
        return {
            assigned_riders: assigneesList,
            assigned_riders_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    } else if (role === "coordinator") {
        // remove the assignee from the list
        const assigneesList = task.assigned_coordinators.filter(u => u.uuid !== userUUID)
        return {
            assigned_coordinators: assigneesList,
            assigned_coordinators_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    }
}

function removeParentFromTasks(tasks, listType, parent_id) {
    const newList = _.omit(tasks[listType], parent_id)
    return update(tasks,
        {[listType]: {$set: newList}}
    );
}

export function tasks(state = initialTasksState, action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
        case ADD_TASK_FROM_SOCKET:
            const data = {[action.data.uuid]: action.data}
            return {tasks: sortAndConcat(state.tasks, data), error: null}
        case RESTORE_TASK_SUCCESS:
        case RESTORE_TASK_FROM_SOCKET: {
            const parent = findExistingTaskParentByID(state.tasks, action.data.parent_id);
            let newGroup;
            let newTasks;
            if (parent.taskGroup) {
                newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
                newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
            } else {
                newTasks = state.tasks;
                newGroup = {[action.data.uuid]: action.data}
            }
            return {tasks: sortAndConcat(newTasks, newGroup), error: null}
        }
        case ADD_TASK_RELAY_SUCCESS:
        case ADD_TASK_RELAY_FROM_SOCKET: {
            const parent = findExistingTaskParentByID(state.tasks, action.data.parent_id);
            if (parent.taskGroup) {
                const newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
                return {tasks: sortAndConcat(state.tasks, newGroup), error: null}
            } else {
                return state;
            }
        }

        case PUT_TASK_SUCCESS:
        case PUT_TASK_FROM_SOCKET: {
            const parent = findExistingTaskParent(state.tasks, action.data.uuid);
            if (parent.taskGroup) {
                const newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
                const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
                return {tasks: sortAndConcat(newTasks, newGroup), error: null};
            } else {
                return state;
            }
        }
        case APPEND_TASKS_DELIVERED_SUCCESS:
        case APPEND_TASKS_REJECTED_SUCCESS:
        case APPEND_TASKS_CANCELLED_SUCCESS: {
            let result;
            for (const [key, value] of Object.entries(action.data)) {
                const converted = convertToRelays(value);
                const newList = {...state.tasks[key]}
                for (const [parentID, taskGroup] of Object.entries(converted)) {
                    newList[parentID] = {...newList[parentID], ...taskGroup}
                }
                result = update(state.tasks, {[key]: {$set: newList}})
            }
            return {tasks: result, error: null}

        }
        case UPDATE_TASK_SUCCESS:
        case UPDATE_TASK_REQUESTER_CONTACT_SUCCESS:
        case UPDATE_TASK_PRIORITY_SUCCESS:
        case UPDATE_TASK_PATCH_SUCCESS:
        case UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_TIME_SUCCESS:
        case UPDATE_TASK_DROPOFF_TIME_SUCCESS:
        case UPDATE_TASK_FROM_SOCKET: {
            const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (parent.taskGroup) {
                const taskToUpdate = parent.taskGroup[action.data.taskUUID]
                const updatedItem = {...taskToUpdate, ...action.data.payload};
                const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
                return {tasks: sortAndConcat(state.tasks, updatedGroup), error: null};
            } else {
                return state;
            }
        }
        case UPDATE_TASK_CANCELLED_TIME_SUCCESS:
        case UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET:
        case UPDATE_TASK_TIME_REJECTED_FROM_SOCKET:
        case UPDATE_TASK_REJECTED_TIME_SUCCESS: {
            const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (parent.taskGroup) {
                const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
                let newGroup = {};
                let newTasksSecond = {};
                // if it was already categorised as rejected or cancelled, we need to put it back into the existing parent group before sorting it again
                if (parent.listType === "tasksRejected" || parent.listType === "tasksCancelled") {
                    const rejectedCancelledTask = {...parent.taskGroup[action.data.taskUUID], ...action.data.payload};
                    const taskCurrentParent = findExistingTaskParentByID(state.tasks, parent.parentID)
                    if (taskCurrentParent.taskGroup) {
                        newTasksSecond = removeParentFromTasks(newTasks, taskCurrentParent.listType, taskCurrentParent.parentID)
                        newGroup = {...taskCurrentParent.taskGroup, [action.data.taskUUID]: rejectedCancelledTask}
                    } else {
                        newTasksSecond = newTasks;
                        newGroup = {[action.data.taskUUID]: rejectedCancelledTask}
                    }
                    return {tasks: sortAndConcat(newTasksSecond, newGroup)}
                } else {
                    let updatedItem;
                    const taskToUpdate = parent.taskGroup[action.data.taskUUID];
                    updatedItem = {...taskToUpdate, ...action.data.payload};
                    const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
                    return {tasks: sortAndConcat(newTasks, updatedGroup), error: null};
                }

            } else {
                return state;
            }
        }
        case UPDATE_TASK_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET: {
            // Get the parent group first
            const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (parent.taskGroup) {
                const task = parent.taskGroup[action.data.taskUUID]
                const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
                const updatedItem = {
                    ...task,
                    ...addAssigneeToList(task,
                        action.data.payload.rider, "rider")
                }
                const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
                return {tasks: sortAndConcat(newTasks, updatedGroup), error: null}
            } else {
                return state;
            }
        }
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET: {
            // Get the parent group first
            const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            // remove it from the list
            const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
            if (parent.taskGroup) {
                const task = parent.taskGroup[action.data.taskUUID]
                const updatedItem = {
                    ...task,
                    ...removeAssigneeFromList(task,
                        action.data.payload.user_uuid, "rider")
                }
                const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}

                // sort the item and merge it
                return {tasks: sortAndConcat(newTasks, updatedGroup), error: null}
            } else {
                return state;
            }
        }
        case UPDATE_TASK_ASSIGNED_COORDINATOR_SUCCESS:
        case UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET: {
            // Get the parent group first
            const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (parent.taskGroup) {
                const task = parent.taskGroup[action.data.taskUUID]
                const updatedItem = {
                    ...task,
                    ...addAssigneeToList(task,
                        action.data.payload.user, "coordinator")
                }
                const updatedGroup = update(parent.taskGroup, {[action.data.taskUUID]: {$set: updatedItem}})
                const newList = {[parent.listType]: {...state.tasks[parent.listType], [parent.parentID]: updatedGroup}}
                const tasksUpdated = {...state.tasks, ...newList}
                return {tasks: tasksUpdated, error: null}
            } else {
                return state;
            }
        }
        case UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_SUCCESS:
        case UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET: {
            // Get the parent group first
            const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (parent.taskGroup) {
                const task = parent.taskGroup[action.data.taskUUID]
                const updatedItem = {
                    ...task,
                    ...removeAssigneeFromList(task,
                        action.data.payload.user_uuid, "coordinator")
                }
                const updatedGroup = update(parent.taskGroup, {[action.data.taskUUID]: {$set: updatedItem}})
                const newList = {[parent.listType]: {...state.tasks[parent.listType], [parent.parentID]: updatedGroup}}
                const tasksUpdated = {...state.tasks, ...newList}
                return {tasks: tasksUpdated, error: null}
            } else {
                return state;
            }
        }
        case DELETE_TASK_SUCCESS:
        case DELETE_TASK_FROM_SOCKET: {
            const parent = findExistingTaskParent(state.tasks, action.data)
            if (parent.taskGroup) {
                const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
                const filteredGroup = _.omit(parent.taskGroup, action.data)
                if (_.isEmpty(filteredGroup)) {
                    const {[parent.parentID]: removedParent, ...newTasksList} = state.tasks[parent.listType]
                    return {tasks: {...newTasks, [parent.listType]: newTasksList}, error: null}
                } else {
                    return {tasks: sortAndConcat(newTasks, filteredGroup), error: null};
                }

            } else {
                return state;
            }
        }
        case RESET_GROUP_RELAY_UUIDS: {
            const parent = findExistingTaskParentByID(state.tasks, action.data)
            if (!parent.taskGroup)
                return state;
            let count = 0;
            let newTask;
            const newGroupRelayFixed = [];
            const sortedGroup = Object.values(parent.taskGroup).sort(taskGroupSort);
            for (const t of sortedGroup) {
                // first one in the group and so has no previous relays
                if (count === 0) {
                    newTask = {
                        ...t,
                        relay_previous_uuid: null,
                        relay_previous: null
                    }

                    // Not the first one, so relay_previous is the task from before
                } else {
                    newTask = {
                        ...t,
                        relay_previous_uuid: sortedGroup[count - 1].uuid,
                        relay_previous: sortedGroup[count - 1]
                    }
                }
                // not on the final task, so set relay_next to the next one
                if (parent.taskGroup.length !== count + 1) {
                    newTask = {...newTask, relay_next: sortedGroup[count + 1]}
                    // if we're on the final task, then there is no relay_next
                } else {
                    newTask = {...newTask, relay_next: null}
                }
                // add the final result to the list, increment counter
                newGroupRelayFixed.push(newTask)
                count++;
            }
            const result = convertTaskGroupToObject(newGroupRelayFixed);
            // TODO: make this better

            return {tasks: sortAndConcat(state.tasks, result[sortedGroup[0].parent_id]), error: null};
        }
        case GET_TASKS_SUCCESS:
            return {tasks: groupRelaysTogether(action.data), error: null};
        case GROUP_RELAYS_TOGETHER:
            return state;
            return {tasks: groupRelaysTogether(state.tasks), error: null}
        case GET_TASKS_FAILURE:
            return {...initialTasksState, error: action.error};
        case GET_MY_TASKS_SUCCESS:
            return {tasks: action.data, error: null};
        case GET_MY_TASKS_FAILURE:
            return {...initialTasksState, error: action.error};
        default:
            return state
    }
}
