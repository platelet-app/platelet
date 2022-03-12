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
    const roleAssignments = await DataStore.query(models.TaskAssignee, (a) =>
        a.role("eq", role)
    );
    let allTasks = [];
    const riderTaskIds = roleAssignments
        .filter((a) => a.assignee && userId === a.assignee.id)
        .map((a) => a.task && a.task.id);

    if (isCompletedTab(keys)) {
        allTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        riderTaskIds.reduce(
                            (task, id) => task.id("eq", id),
                            task
                        )
                    )
                    .or((task) =>
                        keys.reduce(
                            (task, status) => task.status("eq", status),
                            task
                        )
                    )
                    .createdAt(
                        "gt",
                        moment.utc().subtract(7, "days").toISOString()
                    ),
            {
                sort: (s) => s.createdAt("desc"),
                limit: 100,
            }
        );
    } else {
        allTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        riderTaskIds.reduce(
                            (task, id) => task.id("eq", id),
                            task
                        )
                    )
                    .or((task) =>
                        keys.reduce(
                            (task, status) => task.status("eq", status),
                            task
                        )
                    ),
            {
                sort: (s) => s.createdAt("desc"),
                limit: 0,
            }
        );
    }
    return addAssigneesAndConvertToObject(allTasks, allAssignments);
}
