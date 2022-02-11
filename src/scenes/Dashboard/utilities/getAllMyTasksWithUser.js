import { DataStore } from "aws-amplify";
import { userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import {
    addAssigneesAndConvertToObject,
    filterTasksToOneWeek,
    isCompletedTab,
} from "./functions";

export default async function getAllMyTasksWithUser(
    keys,
    userId,
    roleView,
    filteredUser
) {
    const allTasks = await DataStore.query(models.Task);
    const allAssignments = await DataStore.query(models.TaskAssignee);
    const myAssignments = allAssignments.filter(
        (a) => a.role === roleView && a.assignee && a.assignee.id === userId
    );
    const theirAssignments = allAssignments.filter(
        (a) =>
            a.role === userRoles.rider &&
            a.assignee &&
            a.assignee.id === filteredUser
    );
    const intersectingTasks = myAssignments.filter((a) =>
        theirAssignments.some((b) => b.task.id === a.task.id)
    );
    const intersectingTasksIds = intersectingTasks.map(
        (a) => a.task && a.task.id
    );
    const filteredTasks = allTasks.filter(
        (t) => keys.includes(t.status) && intersectingTasksIds.includes(t.id)
    );
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        return addAssigneesAndConvertToObject(
            filteredTasks.filter(filterTasksToOneWeek),
            allAssignments
        );
    }
    return addAssigneesAndConvertToObject(filteredTasks, allAssignments);
}
