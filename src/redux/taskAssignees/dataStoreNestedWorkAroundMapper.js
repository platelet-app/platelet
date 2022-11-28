import { DataStore } from "aws-amplify";
import * as models from "../../models";

export default async function dataStoreNestedWorkAroundMapper(data = []) {
    return Promise.all(
        data.map(async (item) => {
            if (!item.taskAssigneesId && !item.userAssignmentsId) {
                return item;
            }
            const { taskAssigneesId, userAssignmentsId, ...rest } = item;
            const task = taskAssigneesId
                ? await DataStore.query(models.Task, taskAssigneesId)
                : null;
            const assignee = userAssignmentsId
                ? await DataStore.query(models.User, userAssignmentsId)
                : null;
            return { ...rest, task, assignee };
        })
    );
}
