import { DataStore } from "aws-amplify";
import moment from "moment";
import { userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import { addAssigneesAndConvertToObject, isCompletedTab } from "./functions";

export default async function getAllMyTasksWithUser(
    keys,
    userId,
    roleView,
    filteredUser
) {
    const coordAssignments = await DataStore.query(models.TaskAssignee, (a) =>
        a.role("eq", roleView)
    );
    const myAssignments = coordAssignments.filter(
        (a) => a.assignee && a.assignee.id === userId
    );
    const riderAssignments = await DataStore.query(models.TaskAssignee, (a) =>
        a.role("eq", userRoles.rider)
    );
    const theirAssignments = riderAssignments.filter(
        (a) => a.assignee && a.assignee.id === filteredUser
    );
    const intersectingTasks = myAssignments.filter((a) =>
        theirAssignments.some((b) => b.task.id === a.task.id)
    );
    const intersectingTasksIds = intersectingTasks.map(
        (a) => a.task && a.task.id
    );
    let filteredTasks = [];
    if (!intersectingTasksIds || intersectingTasksIds.length === 0) {
        return {};
    }
    if (isCompletedTab(keys)) {
        filteredTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        intersectingTasksIds.reduce(
                            (task, id) => task.id("eq", id),
                            task
                        )
                    )
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
        filteredTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        intersectingTasksIds.reduce(
                            (task, id) => task.id("eq", id),
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
                sort: (s) => s.createdAt("desc"),
                limit: 0,
            }
        );
    }

    const allAssignments = [...coordAssignments, ...riderAssignments];
    return addAssigneesAndConvertToObject(filteredTasks, allAssignments);
}
