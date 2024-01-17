import { DataStore } from "aws-amplify";
import { isCompletedTab } from "./isCompletedTab";
import * as models from "../../models";
import moment from "moment";
import { convertTasksToStateType, TaskStateType } from "../useTasksColumnTasks";
import { DAYS_AGO } from "./getTasksConsts";

export default async function getTasksAll(
    keys: models.TaskStatus[] = []
): Promise<TaskStateType> {
    let tasksResult = [];
    if (isCompletedTab(keys)) {
        const daysAgo = moment.utc().subtract(DAYS_AGO, "days").toISOString();
        tasksResult = await DataStore.query(
            models.Task,
            (task) =>
                task
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
        tasksResult = await DataStore.query(
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
                limit: 0,
            }
        );
    }
    return convertTasksToStateType(tasksResult);
}
