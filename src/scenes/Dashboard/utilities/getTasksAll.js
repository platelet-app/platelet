import { DataStore } from "aws-amplify";
import {
    addAssigneesAndConvertToObject,
    filterTasksToOneWeek,
    isCompletedTab,
} from "./functions";
import * as models from "../../../models";

export default async function getTasksAll(keys = []) {
    const allAssignments = await DataStore.query(models.TaskAssignee);
    let tasksResult = [];
    tasksResult = await DataStore.query(
        models.Task,
        (task) =>
            task.or((task) =>
                keys.reduce((task, status) => task.status("eq", status), task)
            ),
        {
            sort: (s) => s.createdAt("desc"),
            limit: isCompletedTab(keys) ? 100 : 0,
        }
    );
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        tasksResult = tasksResult.filter(filterTasksToOneWeek);
    }
    return addAssigneesAndConvertToObject(tasksResult, allAssignments);
}
