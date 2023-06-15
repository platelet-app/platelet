import { DataStore } from "aws-amplify";
import moment from "moment";
import * as models from "../../models";
import { convertTasksToStateType, TaskStateType } from "../useTasksColumnTasks";
import { isCompletedTab } from "./isCompletedTab";

export default async function getAllMyTasks(
    keys: models.TaskStatus[],
    myTasksIds: string[]
): Promise<TaskStateType> {
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
        const tasks = await DataStore.query(
            models.Task,
            (task) =>
                task.or((task) =>
                    keys.reduce(
                        (task, status) => task.status("eq", status),
                        task
                    )
                ),
            {
                sort: (s) => s.createdAt("DESCENDING"),
            }
        );
        filteredTasks = tasks.filter((task) =>
            myTasksIds.includes(task.id || "")
        );
    }
    return convertTasksToStateType(filteredTasks);
}
