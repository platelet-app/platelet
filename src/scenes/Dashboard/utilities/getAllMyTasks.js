import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import {
    addAssigneesAndConvertToObject,
    filterTasksToOneWeek,
    isCompletedTab,
} from "./functions";

export default async function getAllMyTasks(keys, userId, roleView) {
    const allAssignees = await DataStore.query(models.TaskAssignee);
    const allAssignments = await DataStore.query(models.TaskAssignee, (a) =>
        a.role("eq", roleView)
    );
    const myTasks = allAssignments
        .filter((a) => a.assignee && a.assignee.id === userId)
        .map((a2) => a2.task && a2.task);
    const filteredTasks = myTasks.filter((t) => keys.includes(t.status));
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        return addAssigneesAndConvertToObject(
            filteredTasks.filter(filterTasksToOneWeek),
            allAssignees
        );
    }
    return addAssigneesAndConvertToObject(filteredTasks, allAssignees);
}
