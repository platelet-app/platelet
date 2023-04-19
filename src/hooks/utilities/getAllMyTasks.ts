import { DataStore } from "aws-amplify";
import moment from "moment";
import * as models from "../../models";
import { convertTasksToStateType, TaskStateType } from "../useTasksColumnTasks";
import { isCompletedTab } from "./isCompletedTab";

export default async function getAllMyTasks(
    keys: models.TaskStatus[],
    userId: string,
    roleView: models.Role,
    allAssignees: models.TaskAssignee[]
): Promise<TaskStateType> {
    const roleViewAssignments = allAssignees.filter((assignee) =>
        roleView?.includes(assignee.role)
    );
    const myTasksIds = roleViewAssignments
        .filter((a) => a.task && a?.assignee.id === userId)
        .map((a2) => a2?.task?.id);
    let filteredTasks = [];
    if (!myTasksIds || myTasksIds.length === 0) {
        return {};
    }
    if (isCompletedTab(keys)) {
        const oneWeekAgo = moment.utc().subtract(7, "days").toISOString();
        filteredTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        myTasksIds.reduce(
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
                        myTasksIds.reduce(
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
            }
        );
    }
    return convertTasksToStateType(filteredTasks);
}
