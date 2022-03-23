import { DataStore } from "aws-amplify";
import moment from "moment";
import { userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import { convertListDataToObject } from "../../../utilities";
import { isCompletedTab } from "./functions";
import store from "../../../redux/Store";

export default async function getAllMyTasksWithUser(
    keys,
    userId,
    roleView,
    filteredUser
) {
    const allAssignments = store.getState().taskAssigneesReducer.items;
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

    return convertListDataToObject(filteredTasks);
}
