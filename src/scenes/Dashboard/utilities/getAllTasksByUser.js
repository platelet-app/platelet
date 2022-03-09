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
    const allAssignments = await DataStore.query(models.TaskAssignee);
    const allTasks = await DataStore.query(
        models.Task,
        (task) =>
            task.or((task) =>
                task
                    // TODO: not ideal since it sometimes is one index but works for now
                    .status("eq", keys[0])
                    .status("eq", keys[1])
            ),

        {
            sort: (s) => s.createdAt("desc"),
            limit: isCompletedTab(keys) ? 100 : 0,
        }
    );
    const riderAssigneesFiltered = allAssignments
        .filter(
            (a) =>
                a.role === role &&
                a.task &&
                keys.includes(a.task.status) &&
                a.assignee &&
                userId === a.assignee.id
        )
        .map((a) => a.task && a.task);

    const riderTaskIds = riderAssigneesFiltered.map((t) => t.id);
    const riderTasks = allTasks.filter((t) => riderTaskIds.includes(t.id));
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        return addAssigneesAndConvertToObject(
            riderTasks.filter(filterTasksToOneWeek),
            allAssignments
        );
    }
    return addAssigneesAndConvertToObject(riderTasks, allAssignments);
}
