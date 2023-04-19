import { DataStore } from "aws-amplify";
import * as models from "../../models";
import { isCompletedTab } from "./isCompletedTab";
import moment from "moment";

export default async function getAllTasksByUser(
    keys: models.TaskStatus[],
    userId: string,
    role: models.Role = models.Role.RIDER,
    allAssignments: models.TaskAssignee[] = []
): Promise<models.Task[]> {
    const roleAssignments = allAssignments.filter(
        (assignment) => assignment.role === role
    );
    let allTasks = [];
    const riderTaskIds = roleAssignments
        .filter((a) => a.task && userId === a.assignee.id)
        .map((a) => a.task && a.task.id);
    if (!riderTaskIds || riderTaskIds.length === 0) {
        return [];
    }

    if (isCompletedTab(keys)) {
        const oneWeekAgo = moment.utc().subtract(7, "days").toISOString();
        allTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        riderTaskIds.reduce(
                            (task, id) => task.id("eq", id || ""),
                            task
                        )
                    )
                    .or((task) =>
                        keys.reduce(
                            (task, status) => task.status("eq", status),
                            task
                        )
                    )
                    .or((task) =>
                        task
                            .createdAt("eq", undefined!)
                            .createdAt("gt", oneWeekAgo)
                    ),
            {
                sort: (s) => s.createdAt("DESCENDING"),
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
                            (task, id) => task.id("eq", id || ""),
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
                sort: (s) => s.createdAt("DESCENDING"),
                limit: 0,
            }
        );
    }
    return allTasks;
}
