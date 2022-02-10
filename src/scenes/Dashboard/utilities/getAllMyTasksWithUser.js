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
    const allAssignments = await DataStore.query(models.TaskAssignee);
    const myAssignments = allAssignments.filter(
        (a) => a.role === roleView && a.assignee && a.assignee.id === userId
    );
    const theirAssignments = allAssignments.filter(
        (a) =>
            a.role === userRoles.rider &&
            a.assignee &&
            a.assignee.id !== filteredUser
    );
    const intersectingTasks = myAssignments.filter((a) =>
        theirAssignments.some((b) => b.task.id === a.task.id)
    );
    const filteredTasks = intersectingTasks
        .map((a) => a.task && a.task)
        .filter((t) => keys.includes(t.status));
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        return addAssigneesAndConvertToObject(
            filteredTasks.filter(filterTasksToOneWeek),
            allAssignments
        );
    }
    return addAssigneesAndConvertToObject(filteredTasks, allAssignments);
}
