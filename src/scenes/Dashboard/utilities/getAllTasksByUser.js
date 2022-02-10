import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { userRoles } from "../../../apiConsts";
import {
    addAssigneesAndConvertToObject,
    filterTasksToOneWeek,
    isCompletedTab,
} from "./functions";

export default async function getAllTasksByUser(
    keys,
    userId,
    role = userRoles.rider
) {
    const allAssignees = await DataStore.query(models.TaskAssignee);

    const riderAssigneesFiltered = allAssignees
        .filter(
            (a) =>
                a.role === role &&
                a.task &&
                keys.includes(a.task.status) &&
                a.assignee &&
                userId === a.assignee.id
        )
        .map((a) => a.task && a.task);
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        return addAssigneesAndConvertToObject(
            riderAssigneesFiltered.filter(filterTasksToOneWeek),
            allAssignees
        );
    }
    return addAssigneesAndConvertToObject(riderAssigneesFiltered, allAssignees);
}
