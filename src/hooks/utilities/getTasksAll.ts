import { DataStore } from "aws-amplify";
import { isCompletedTab } from "./isCompletedTab";
import * as models from "../../models";
import moment from "moment";
import { convertListDataToObject } from "../../utilities";
import { TaskStateType } from "../useTasksColumnTasks";

export default async function getTasksAll(
    keys: models.TaskStatus[] = []
): Promise<TaskStateType> {
    let tasksResult = [];
    if (isCompletedTab(keys)) {
        const oneWeekAgo = moment.utc().subtract(7, "days").toISOString();
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
                            .createdAt("eq", undefined!)
                            .createdAt("gt", oneWeekAgo)
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
    return convertListDataToObject(tasksResult);
}
