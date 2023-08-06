import determineTaskStatus from "../../../utilities/determineTaskStatus";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import _ from "lodash";

async function generateMultipleTaskTimeModels(
    selectedItems: models.Task[],
    values: any
) {
    if (!selectedItems || _.isEmpty(selectedItems)) return [];
    const filteredTasks = await DataStore.query(models.Task, (task) =>
        task.or((task) => selectedItems.map((t) => task.id.eq(t.id)))
    );
    return await Promise.all(
        filteredTasks.map(async (item) => {
            const status = await determineTaskStatus({
                ...item,
                ...values,
            });
            return models.Task.copyOf(item, (updated) => {
                updated.status = status;
                for (const key in values) {
                    if (key !== "id") {
                        // @ts-ignore
                        updated[key] = values[key];
                    }
                }
            });
        })
    );
}

export default generateMultipleTaskTimeModels;
