import { DataStore } from "aws-amplify";
import * as models from "../../models";

export default async function dataStoreNestedWorkAroundMapper(data = []) {
    return Promise.all(
        data.map(async (item) => {
            if (
                !item.deliverableTypeDeliverablesId &&
                !item.taskDeliverablesId
            ) {
                return item;
            }
            const {
                deliverableTypeDeliverablesId,
                taskDeliverablesId,
                ...rest
            } = item;
            const task = taskDeliverablesId
                ? await DataStore.query(models.Task, taskDeliverablesId)
                : null;
            const deliverableType = deliverableTypeDeliverablesId
                ? await DataStore.query(
                      models.DeliverableType,
                      deliverableTypeDeliverablesId
                  )
                : null;
            return { ...rest, task, deliverableType };
        })
    );
}
