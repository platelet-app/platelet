import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import {
    addAssigneesAndConvertToObject,
    filterTasksToOneWeek,
    isCompletedTab,
} from "./functions";

export default async function getAllMyTasks(keys, userId, roleView) {
    const allAssignees = await DataStore.query(models.TaskAssignee);
    const allTasks = await DataStore.query(
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
    const myTasks = allAssignees
        .filter(
            (a) => a.role === roleView && a.assignee && a.assignee.id === userId
        )
        .map((a2) => a2.task && a2.task);
    const myTasksIds = myTasks.map((t) => t.id);
    const filteredTasks = allTasks.filter(
        (t) => keys.includes(t.status) && myTasksIds.includes(t.id)
    );
    if (isCompletedTab(keys)) {
        // filter tasksResult to only return tasks that were created in the last week
        return addAssigneesAndConvertToObject(
            filteredTasks.filter(filterTasksToOneWeek),
            allAssignees
        );
    }
    return addAssigneesAndConvertToObject(filteredTasks, allAssignees);
}
