import { DataStore } from "aws-amplify";
import moment from "moment";
import * as models from "../../models";
import { convertTasksToStateType, TaskStateType } from "../useTasksColumnTasks";
import { isCompletedTab } from "./isCompletedTab";
import { DAYS_AGO } from "./getTasksConsts";

export default async function getAllMyTasks(
    keys: models.TaskStatus[],
    myTasksIds: string[]
): Promise<TaskStateType> {
    let filteredTasks = [];
    if (!myTasksIds || myTasksIds.length === 0) {
        return {};
    }
    if (isCompletedTab(keys)) {
        const daysAgo = moment.utc().subtract(DAYS_AGO, "days").toISOString();
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
                            .dateCompleted("gt", daysAgo)
                            //@ts-ignore
                            .dateCompleted("eq", null)
                            //@ts-ignore
                            .dateCompleted("eq", undefined)
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
