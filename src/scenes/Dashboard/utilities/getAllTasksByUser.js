import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { userRoles } from "../../../apiConsts";
import { addAssigneesAndConvertToObject, isCompletedTab } from "./functions";
import moment from "moment";

export default async function getAllTasksByUser(
    keys,
    userId,
    role = userRoles.rider
) {
    const allAssignments = await DataStore.query(models.TaskAssignee);
    let allTasks = [];
    // only get one week worth if completed tab
    if (isCompletedTab(keys)) {
        const newMoment = moment();
        const start = newMoment.toISOString();
        const end = newMoment.subtract(1, "week").toISOString();
        allTasks = await DataStore.query(
            models.Task,
            (task) =>
                task.or((task) =>
                    task
                        // TODO: not ideal since it sometimes is one index but works for now
                        .status("eq", keys[0])
                        .status("eq", keys[1])
                        .createdAt("le", start)
                        .createdAt("ge", end)
                ),

            {
                sort: (s) => s.createdAt("desc"),
                limit: 200,
            }
        );
    } else {
        allTasks = await DataStore.query(
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
                limit: 0,
            }
        );
    }
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
    return addAssigneesAndConvertToObject(riderTasks, allAssignments);
}
