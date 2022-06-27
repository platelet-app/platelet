import { determineTaskStatus } from "../../../utilities";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import _ from "lodash";

async function generateMultipleTaskTimeModels(
    selectedItems,
    timeKey,
    time,
    riderAssignees
) {
    if (!selectedItems || _.isEmpty(selectedItems) || !timeKey) return;
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
            return models.Task.copyOf(item, (updated) => {
                updated[timeKey] = time.toISOString();
                updated.status = status;
            });
        })
    );
}

export default generateMultipleTaskTimeModels;
