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
    RESET_GROUP_RELAY_UUIDS, GROUP_RELAYS_TOGETHER

} from "./TasksActions";
import update from "immutability-helper";
import {
    determineTaskType, findExistingTask,
    findExistingTaskParent,
    findExistingTaskParentByID,
} from "../../utilities";

const initialState = {
    task: {
        uuid: null,
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
    console.log("AAAAAAAAAAAAAAAA")
    const sorted = determineTaskType(data);
    for (const [key, value] of Object.entries(sorted)) {
        sorted[key] = [...tasks[key], value]
        if (key === "tasksNew") {
            sorted[key] = sorted[key].sort((a, b) => b[0].parent_id - a[0].parent_id);
        } else {
            sorted[key] = sorted[key].sort((a, b) => a[0].parent_id - b[0].parent_id);
        }
    }
    return {...tasks, ...sorted};
}


function groupRelaysTogether(tasks) {
    let groupedTasks = {};
    for (const [key, value] of Object.entries(tasks)) {
        groupedTasks[key] = [];
        let currentParentId = -1;
        let currentIndex = -1;
        for (const t of value) {
            if (currentParentId !== t.parent_id) {
                currentParentId = t.parent_id;
                currentIndex += 1;
                groupedTasks[key][currentIndex] = [];
            }
            groupedTasks[key][currentIndex].push(t);
        }
    }
    //  for (const [key, value] of Object.entries(groupedTasks)) {
    //      groupedTasks[key] = value.sort((a, b) => a.order_in_relay < b.order_in_relay);
    //  }
    return groupedTasks;
}

const addAssigneeToList = (task, rider) => {
    // add the assignee to the list
    let assigneesList = [...task.assigned_riders, rider]
    return {
        assigned_riders: assigneesList,
        assigned_riders_display_string: assigneesList.map(
            (user) => user.display_name
        ).join(", ")
    }
}

const removeAssigneeFromList = (task, userUUID) => {
    // remove the assignee from the list
    let assigneesList = task.assigned_riders.filter(u => u.uuid !== userUUID)
    return {
        assigned_riders: assigneesList,
        assigned_riders_display_string: assigneesList.map(
            (user) => user.display_name
        ).join(", ")
    }
}

function taskGroupSort(a, b) {
    return a.order_in_relay - b.order_in_relay;
}

export function tasks(state = initialTasksState, action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
        case ADD_TASK_FROM_SOCKET:
            return {tasks: sortAndConcat(state.tasks, [action.data]), error: null}
        case RESTORE_TASK_SUCCESS:
        case RESTORE_TASK_FROM_SOCKET:
            const findParentRestore = findExistingTaskParentByID(state.tasks, action.data.parent_id);
            let newGroupRestore;
            let newTasksRestore;
            if (findParentRestore.taskGroup) {
                newGroupRestore = [...findParentRestore.taskGroup, action.data].sort(taskGroupSort)
                newTasksRestore = update(state.tasks,
                    {[findParentRestore.listType]: {$set: state.tasks[findParentRestore.listType].filter(t => action.data.parent_id !== t[0].parent_id)}}
                );
            } else {
                newGroupRestore = [action.data]
                newTasksRestore = state.tasks;
            }
            return {tasks: sortAndConcat(newTasksRestore, newGroupRestore), error: null}
        case ADD_TASK_RELAY_SUCCESS:
        case ADD_TASK_RELAY_FROM_SOCKET:
            const findParent = findExistingTaskParentByID(state.tasks, action.data.parent_id);
            const newGroup = [...findParent.taskGroup, action.data]
            const newTasks = update(state.tasks, {[findParent.listType]: {$set: state.tasks[findParent.listType].filter(t => action.data.parent_id !== t[0].parent_id)}});
            return {tasks: sortAndConcat(newTasks, newGroup), error: null}
        case UPDATE_TASK_SUCCESS:
        case UPDATE_TASK_REQUESTER_CONTACT_SUCCESS:
        case UPDATE_TASK_PRIORITY_SUCCESS:
        case UPDATE_TASK_PATCH_SUCCESS:
        case UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_TIME_SUCCESS:
        case UPDATE_TASK_DROPOFF_TIME_SUCCESS:
        case UPDATE_TASK_FROM_SOCKET:
            const taskToUpdateParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (taskToUpdateParent.taskGroup) {
                const newTasks = update(
                    state.tasks, {[taskToUpdateParent.listType]: {$set: state.tasks[taskToUpdateParent.listType].filter(t => taskToUpdateParent.taskGroup[0].parent_id !== t[0].parent_id)}}
                );
                let updatedItem;
                const taskToUpdate = taskToUpdateParent.taskGroup.find(t => t.uuid === action.data.taskUUID);
                const taskIndex = taskToUpdateParent.taskGroup.indexOf(taskToUpdate);
                updatedItem = {...taskToUpdate, ...action.data.payload};
                const updatedGroup = update(taskToUpdateParent.taskGroup, {[taskIndex]: {$set: updatedItem}})
                return {tasks: sortAndConcat(newTasks, updatedGroup), error: null};
            } else {
                return state;
            }
        case UPDATE_TASK_CANCELLED_TIME_SUCCESS:
        case UPDATE_TASK_REJECTED_TIME_SUCCESS:
            const taskToUpdateRejectCancelParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (taskToUpdateRejectCancelParent.taskGroup) {
                const newTasks = update(
                    state.tasks, {[taskToUpdateRejectCancelParent.listType]: {$set: state.tasks[taskToUpdateRejectCancelParent.listType].filter(t => taskToUpdateRejectCancelParent.taskGroup[0].parent_id !== t[0].parent_id)}}
                );
                let newGroup = [];
                // if it was already categorised as rejected or cancelled, we need to put it back into the existing parent group before sorting it again
                if (taskToUpdateRejectCancelParent.listType === "tasksRejected" || taskToUpdateRejectCancelParent.listType === "tasksCancelled") {
                    const rejectedCancelledTask = {...taskToUpdateRejectCancelParent.taskGroup[0], ...action.data.payload};
                    const taskCurrentParent = findExistingTaskParentByID(state.tasks, taskToUpdateRejectCancelParent.taskGroup[0].parent_id)
                    const newTasksSecond = update(
                        newTasks, {[taskCurrentParent.listType]: {$set: state.tasks[taskCurrentParent.listType].filter(t => taskCurrentParent.taskGroup[0].parent_id !== t[0].parent_id)}}
                    );
                    if (taskCurrentParent.taskGroup) {
                        newGroup = [...taskCurrentParent.taskGroup, rejectedCancelledTask].sort((a, b) => a.order_in_relay - b.order_in_relay)
                    } else {
                        newGroup = [rejectedCancelledTask]
                    }
                    return {tasks: sortAndConcat(newTasksSecond, newGroup)}
                } else {
                    let updatedItem;
                    const taskToUpdate = taskToUpdateRejectCancelParent.taskGroup.find(t => t.uuid === action.data.taskUUID);
                    const taskIndex = taskToUpdateRejectCancelParent.taskGroup.indexOf(taskToUpdate);
                    updatedItem = {...taskToUpdate, ...action.data.payload};
                    const updatedGroup = update(taskToUpdateRejectCancelParent.taskGroup, {[taskIndex]: {$set: updatedItem}})
                    return {tasks: sortAndConcat(newTasks, updatedGroup), error: null};
                }

            } else {
                return state;
            }
        case UPDATE_TASK_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET:
            // Get the parent group first
            const taskToUpdateAssignedRiderParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            // remove it from the list
            const newTasksAssignedRider = update(
                state.tasks, {
                    [taskToUpdateAssignedRiderParent.listType]: {
                        $set: state.tasks[taskToUpdateAssignedRiderParent.listType].filter(
                            t => taskToUpdateAssignedRiderParent.taskGroup[0].parent_id !== t[0].parent_id)
                    }
                }
            );

            if (taskToUpdateAssignedRiderParent.taskGroup) {
                const taskToUpdateAssignedRider = taskToUpdateAssignedRiderParent.taskGroup.find(t => t.uuid === action.data.taskUUID);
                const updatedItem = {
                    ...taskToUpdateAssignedRider,
                    ...addAssigneeToList(taskToUpdateAssignedRider,
                        action.data.payload.rider)
                }
                const taskIndex = taskToUpdateAssignedRiderParent.taskGroup.indexOf(taskToUpdateAssignedRider);
                const updatedGroup = update(taskToUpdateAssignedRiderParent.taskGroup, {[taskIndex]: {$set: updatedItem}})

                // sort the item and merge it
                return {tasks: sortAndConcat(newTasksAssignedRider, updatedGroup), error: null}
            } else {
                return state;
            }
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET:
            // Get the parent group first
            const taskToUnassignParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            // remove it from the list
            const newTasksUnassignedRider = update(
                state.tasks, {
                    [taskToUnassignParent.listType]: {
                        $set: state.tasks[taskToUnassignParent.listType].filter(
                            t => taskToUnassignParent.taskGroup[0].parent_id !== t[0].parent_id)
                    }
                }
            );

            if (taskToUnassignParent.taskGroup) {
                const taskToUpdateUnassignedRider = taskToUnassignParent.taskGroup.find(t => t.uuid === action.data.taskUUID);
                const updatedItem = {
                    ...taskToUpdateUnassignedRider,
                    ...removeAssigneeFromList(taskToUpdateUnassignedRider,
                        action.data.payload.user_uuid)
                }
                const taskIndex = taskToUnassignParent.taskGroup.indexOf(taskToUpdateUnassignedRider);
                const updatedGroup = update(taskToUnassignParent.taskGroup, {[taskIndex]: {$set: updatedItem}})

                // sort the item and merge it
                return {tasks: sortAndConcat(newTasksUnassignedRider, updatedGroup), error: null}
            } else {
                return state;
            }
        case DELETE_TASK_SUCCESS:
        case DELETE_TASK_FROM_SOCKET:
            const findDelete = findExistingTaskParent(state.tasks, action.data)
            if (findDelete.taskGroup) {
                const newDeletedTasks = update(
                    state.tasks, {
                        [findDelete.listType]: {
                            $set: state.tasks[findDelete.listType].filter(
                                t => findDelete.taskGroup[0].parent_id !== t[0].parent_id)
                        }
                    }
                );
                const filteredGroup = findDelete.taskGroup.filter(t => t.uuid !== action.data);
                if (filteredGroup.length === 0) {
                    return {tasks: newDeletedTasks, error: null}
                } else {
                    return {tasks: sortAndConcat(newDeletedTasks, filteredGroup), error: null};
                }
            } else {
                return state;
            }
        case RESET_GROUP_RELAY_UUIDS:
            const parent = findExistingTaskParentByID(state.tasks, action.data)
            if (!parent.taskGroup)
                return state;
            // remove it from current state
            const newTasksResetRelays = update(
                state.tasks, {
                    [parent.listType]: {
                        $set: state.tasks[parent.listType].filter(
                            t => parent.taskGroup[0].parent_id !== t[0].parent_id)
                    }
                }
            );
            let count = 0;
            let newTask;
            const newGroupRelayFixed = [];
            for (const t of parent.taskGroup) {
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
                        relay_previous_uuid: parent.taskGroup[count - 1].uuid,
                        relay_previous: parent.taskGroup[count - 1]}
                }
                // not on the final task, so set relay_next to the next one
                if (parent.taskGroup.length !== count + 1) {
                    newTask = {...newTask, relay_next: parent.taskGroup[count + 1]}
                // if we're on the final task, then there is no relay_next
                } else {
                    newTask = {...newTask, relay_next: null}
                }
                // add the final result to the list, increment counter
                newGroupRelayFixed.push(newTask)
                count++;
            }

            return {tasks: sortAndConcat(newTasksResetRelays, newGroupRelayFixed), error: null};
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
