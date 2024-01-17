import { DataStore } from "aws-amplify";
import * as models from "../../models";
import { isCompletedTab } from "./isCompletedTab";
import moment from "moment";
import { convertTasksToStateType, TaskStateType } from "../useTasksColumnTasks";
import { DAYS_AGO } from "./getTasksConsts";

export default async function getAllTasksByUser(
    keys: models.TaskStatus[],
    userId: string,
    role: models.Role = models.Role.RIDER,
    allAssignments: models.TaskAssignee[] = []
): Promise<TaskStateType> {
    const roleAssignments = allAssignments.filter(
        (assignment) => assignment.role === role
    );
    let allTasks = [];
    const riderTaskIds = roleAssignments
        .filter((a) => a.task && userId === a.assignee.id)
        .map((a) => a.task && a.task.id);
    if (!riderTaskIds || riderTaskIds.length === 0) {
        return {};
    }

    if (isCompletedTab(keys)) {
        const daysAgo = moment.utc().subtract(DAYS_AGO, "days").toISOString();
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
                            //@ts-ignore
                            .dateCompleted("eq", null)
                            //@ts-ignore
                            .dateCompleted("eq", undefined)
                            .dateCompleted("gt", daysAgo)
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
    return convertTasksToStateType(allTasks);
}
