import { DataStore } from "aws-amplify";
import {
    addAssigneesAndConvertToObject,
    filterTasksToOneWeek,
    isCompletedTab,
} from "./functions";
import * as models from "../../../models";
import moment from "moment";

export default async function getTasksAll(keys = []) {
    const allAssignments = await DataStore.query(models.TaskAssignee);
    let tasksResult = [];
    if (isCompletedTab(keys)) {
        const newMoment = moment();
        const start = newMoment.toISOString();
        const end = newMoment.subtract(1, "week").toISOString();
        tasksResult = await DataStore.query(
            models.Task,
            (task) =>
                task.or((task) =>
                    task
                        // TODO: not ideal since it sometimes is one index but works for now
                        .status("eq", keys[0])
                        .status("eq", keys[1])
                        .createdAt("le", start)
                        .createdAt("ge", end)
                ),

            {
                sort: (s) => s.createdAt("desc"),
                limit: 200,
            }
        );
    } else {
        tasksResult = await DataStore.query(
            models.Task,
            (task) =>
                task.or((task) =>
                    task
                        // TODO: not ideal since it sometimes is one index but works for now
                        .status("eq", keys[0])
                        .status("eq", keys[1])
                ),

            {
                sort: (s) => s.createdAt("desc"),
                limit: 0,
            }
        );
    }
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        tasksResult = tasksResult.filter(filterTasksToOneWeek);
    }
    return addAssigneesAndConvertToObject(tasksResult, allAssignments);
}
