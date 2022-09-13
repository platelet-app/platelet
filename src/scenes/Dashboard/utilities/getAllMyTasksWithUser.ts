import { DataStore } from "aws-amplify";
import moment from "moment";
import { tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import { convertListDataToObject } from "../../../utilities";
import { isCompletedTab } from "./functions";

interface Task {
    id: string;
}
interface Assignee {
    id: string;
}

interface Assignee {
    task: Task;
    assignee: Assignee;
    role: userRoles;
}

export default async function getAllMyTasksWithUser(
    keys: tasksStatus[],
    userId: string,
    roleView: userRoles,
    filteredUser: string,
    allAssignments: Assignee[]
) {
    const myAssignments = allAssignments.filter(
        (a) => a.role === roleView && a.assignee && a.assignee.id === userId
    );
    const theirAssignments = allAssignments.filter(
        (a) =>
            a.role === userRoles.rider &&
            a.assignee &&
            a.assignee.id === filteredUser
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
        const oneWeekAgo = moment.utc().subtract(7, "days").toISOString();
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
                sort: (s) => s.createdAt("DESCENDING"),
                limit: 0,
            }
        );
    }

    return convertListDataToObject(filteredTasks);
}
