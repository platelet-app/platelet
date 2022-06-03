import { determineTaskStatus } from "../../../utilities";
import * as models from "../../../models";

async function generateMultipleTaskTimeModels(
    selectedItems,
    timeKey,
    time,
    riderAssignees
) {
    if (!selectedItems || !timeKey) return;
    return await Promise.all(
        Object.values(selectedItems).map(async (item) => {
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
