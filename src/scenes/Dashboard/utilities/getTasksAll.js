import { DataStore } from "aws-amplify";
import { addAssigneesAndConvertToObject, isCompletedTab } from "./functions";
import * as models from "../../../models";
import moment from "moment";
import { convertListDataToObject } from "../../../utilities";

export default async function getTasksAll(keys = []) {
    let tasksResult = [];
    if (isCompletedTab(keys)) {
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
                sort: (s) => s.createdAt("desc"),
                limit: 0,
            }
        );
    }
    return convertListDataToObject(tasksResult);
}
