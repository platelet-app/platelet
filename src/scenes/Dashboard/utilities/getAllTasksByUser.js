import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { userRoles } from "../../../apiConsts";
import { isCompletedTab } from "./functions";
import store from "../../../redux/Store";
import moment from "moment";
import { convertListDataToObject } from "../../../utilities";

export default async function getAllTasksByUser(
    keys,
    userId,
    role = userRoles.rider
) {
    const allAssignments = store.getState().taskAssigneesReducer.items;
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
                            .createdAt("eq", undefined)
                            .createdAt("gt", oneWeekAgo)
                    ),
            {
                sort: (s) => s.createdAt("desc"),
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
                sort: (s) => s.createdAt("desc"),
                limit: 0,
            }
        );
    }
    return convertListDataToObject(allTasks);
}
