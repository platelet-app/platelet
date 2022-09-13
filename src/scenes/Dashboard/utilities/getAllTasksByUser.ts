import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { isCompletedTab } from "./functions";
import moment from "moment";
import { convertListDataToObject } from "../../../utilities";

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

export default async function getAllTasksByUser(
    keys: tasksStatus[],
    userId: string,
    role: userRoles = userRoles.rider,
    allAssignments: Assignee[] = []
) {
    const roleAssignments = allAssignments.filter(
        (assignment) => assignment.role === role
    );
    let allTasks = [];
    const riderTaskIds = roleAssignments
        .filter((a) => a.assignee && userId === a.assignee.id)
        .map((a) => a.task && a.task.id);
    if (!riderTaskIds || riderTaskIds.length === 0) {
        return {};
    }

    if (isCompletedTab(keys)) {
        const oneWeekAgo = moment.utc().subtract(7, "days").toISOString();
        allTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        riderTaskIds.reduce(
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
        allTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        riderTaskIds.reduce(
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
    return convertListDataToObject(allTasks);
}
