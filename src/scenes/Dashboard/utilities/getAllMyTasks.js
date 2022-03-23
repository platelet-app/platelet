import { DataStore } from "aws-amplify";
import moment from "moment";
import * as models from "../../../models";
import { addAssigneesAndConvertToObject, isCompletedTab } from "./functions";
import store from "../../../redux/Store";
import { convertListDataToObject } from "../../../utilities";

export default async function getAllMyTasks(keys, userId, roleView) {
    const allAssignees = store.getState().taskAssigneesReducer.items;
    const roleViewAssignments = allAssignees.filter(
        (assignee) => assignee.role === roleView
    );
    const myTasksIds = roleViewAssignments
        .filter((a) => a.assignee && a.assignee.id === userId)
        .map((a2) => a2.task && a2.task.id);
    let filteredTasks = [];
    if (!myTasksIds || myTasksIds.length === 0) {
        return {};
    }
    if (isCompletedTab(keys)) {
        filteredTasks = await DataStore.query(
            models.Task,
            (task) =>
                task
                    .or((task) =>
                        myTasksIds.reduce((task, id) => task.id("eq", id), task)
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
                        myTasksIds.reduce((task, id) => task.id("eq", id), task)
                    )
                    .or((task) =>
                        keys.reduce(
                            (task, status) => task.status("eq", status),
                            task
                        )
                    ),
            {
                sort: (s) => s.createdAt("desc"),
            }
        );
    }
    return convertListDataToObject(filteredTasks);
}
