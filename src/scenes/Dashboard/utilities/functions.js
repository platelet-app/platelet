import _ from "lodash";
import { DataStore } from "aws-amplify";
import { tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import moment from "moment";
import { convertListDataToObject } from "../../../utilities";

export const isCompletedTab = (keys) =>
    _.intersection(
        [
            tasksStatus.completed,
            tasksStatus.cancelled,
            tasksStatus.rejected,
            tasksStatus.abandoned,
        ],
        keys
    ).length > 0;

export const filterTasksToOneWeek = (task) =>
    moment(task.createdAt).isAfter(moment().subtract(1, "week"));

export function addAssigneesAndConvertToObject(tasks, allAssignees) {
    const finalResult = {};
    for (const t of tasks) {
        const assignmentsFiltered = allAssignees.filter(
            (a) => a.task.id === t.id
        );
        const assignees = convertListDataToObject(assignmentsFiltered);
        finalResult[t.id] = { ...t, assignees };
    }

    return finalResult;
}
export async function filterTasksByFilteredUser(tasks, userId, taskStatuses) {
    let taskIds = null;
    if (userId) {
        const usersTaskIds = (
            await DataStore.query(models.TaskAssignee, (a) =>
                a.role("eq", userRoles.rider)
            )
        )
            .filter(
                (a) =>
                    a.task &&
                    taskStatuses.includes(a.task.status) &&
                    a.assignee &&
                    userId === a.assignee.id
            )
            .map((a) => a.task && a.task.id);
        if (taskIds !== null) {
            taskIds = _.intersection(taskIds, usersTaskIds);
        } else {
            taskIds = usersTaskIds;
        }
    }
    if (taskIds !== null) {
        return tasks.filter((t) => taskIds.includes(t.id));
    } else {
        return tasks;
    }
}

export function filterTasks(tasks, search) {
    if (!search || !tasks || tasks.length === 0) {
        return null;
    } else {
        const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
        const results = [];
        for (const searchTerm of searchTerms) {
            let filteredResult = [];
            const filtered = Object.values(tasks)
                .filter((task) => {
                    if (
                        task.assigneesString
                            ? task.assigneesString
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.riderResponsibility
                            ? task.riderResponsibility
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.reference
                            ? task.reference.toLowerCase().includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.priority
                            ? task.priority.toLowerCase().includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.dropOffLocation && task.dropOffLocation.line1
                            ? task.dropOffLocation.line1
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.pickUpLocation && task.pickUpLocation.line1
                            ? task.pickUpLocation.line1
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.pickUpLocation && task.pickUpLocation.ward
                            ? task.pickUpLocation.ward
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.dropOffLocation && task.dropOffLocation.ward
                            ? task.dropOffLocation.ward
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    }
                    return false;
                })
                .map((t) => t.id);
            if (filtered.length !== 0)
                filteredResult = [...filteredResult, ...filtered];
            results.push(filteredResult);
        }
        const result = _.intersection(...results);
        return result;
    }
}
