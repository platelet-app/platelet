import { DataStore } from "aws-amplify";
import moment from "moment";
import * as models from "../../../models";
import { convertListDataToObject } from "../../../utilities";
import { isCompletedTab } from "./functions";

export default async function getAllMyTasksWithUser(
    keys: models.TaskStatus[],
    userId: string,
    roleView: models.Role,
    filteredUser: string,
    allAssignments: models.TaskAssignee[]
) {
    const myAssignments = allAssignments.filter(
        (a) => a.role === roleView && a.task && a.assignee.id === userId
    );
    const theirAssignments = allAssignments.filter(
        (a) =>
            a.role === models.Role.RIDER &&
            a.task &&
            a.assignee?.id === filteredUser
    );
    const intersectingTasks = myAssignments.filter((a) =>
        theirAssignments.some((b) => b.task?.id === a.task?.id)
    );
    const intersectingTasksIds = intersectingTasks.map((a) => a.task?.id);
    let filteredTasks = [];
    if (!intersectingTasksIds || intersectingTasksIds.length === 0) {
        return {};
    }
    if (isCompletedTab(keys)) {
        const oneWeekAgo = moment.utc().subtract(7, "days").toISOString();
        filteredTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        intersectingTasksIds.reduce(
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
        filteredTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        intersectingTasksIds.reduce(
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

    return convertListDataToObject(filteredTasks);
}
