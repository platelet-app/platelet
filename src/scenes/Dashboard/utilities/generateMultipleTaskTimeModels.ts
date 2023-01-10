import determineTaskStatus from "../../../utilities/determineTaskStatus";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import _ from "lodash";
import { TaskTimeKey, TaskTimeName } from "../../../apiConsts";

async function generateMultipleTaskTimeModels(
    selectedItems: models.Task[],
    timeKey: TaskTimeKey,
    time: Date,
    riderAssignees: models.TaskAssignee[],
    nameKey: TaskTimeName | null = null,
    name: string | null = null
) {
    if (!selectedItems || _.isEmpty(selectedItems) || !timeKey) return [];
    const filteredTasks = await DataStore.query(models.Task, (task) =>
        task.or((task) =>
            Object.values(selectedItems)
                .map((t) => t.id)
                .reduce((task, id) => task.id("eq", id), task)
        )
    );
    return await Promise.all(
        filteredTasks.map(async (item) => {
            const status = await determineTaskStatus(
                {
                    ...item,
                    [timeKey]: time,
                },
                riderAssignees
            );
            if (nameKey) {
                return models.Task.copyOf(item, (updated) => {
                    updated[timeKey] = time.toISOString();
                    updated.status = status;
                    updated[nameKey] = name;
                });
            } else {
                return models.Task.copyOf(item, (updated) => {
                    updated[timeKey] = time.toISOString();
                    updated.status = status;
                });
            }
        })
    );
}

export default generateMultipleTaskTimeModels;
