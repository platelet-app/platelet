import { DataStore } from "aws-amplify";
import * as models from "../../models";

export default async function dataStoreNestedWorkAroundMapper(data = []) {
    return Promise.all(
        data.map(async (item) => {
            console.log("item", item);
            if (!item.taskId && !item.assigneeId) {
                return item;
            }
            const { taskId, assigneeId, ...rest } = item;
            const task = taskId
                ? await DataStore.query(models.Task, taskId)
                : null;
            const assignee = assigneeId
                ? await DataStore.query(models.User, assigneeId)
                : null;
            return { ...rest, task, assignee };
        })
    );
}
