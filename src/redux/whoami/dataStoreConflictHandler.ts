import { DISCARD } from "@aws-amplify/datastore";
import {
    SyncConflict,
    PersistentModel,
    PersistentModelConstructor,
} from "@aws-amplify/datastore";
import * as models from "../../models";
import determineTaskStatus from "../../utilities/determineTaskStatus";

const dataStoreConflictHandler = async (
    conflict: SyncConflict
): Promise<symbol | PersistentModel> => {
    const { modelConstructor, localModel, remoteModel } = conflict;
    console.log(
        "DataStore has found a conflict",
        modelConstructor,
        remoteModel,
        localModel
    );
    if (
        (modelConstructor as PersistentModelConstructor<models.Task>) ===
        models.Task
    ) {
        const localTask = localModel as models.Task;
        const remoteTask = remoteModel as models.Task;
        let newModel = models.Task.copyOf(remoteTask, (task) => {
            task.timePickedUp =
                remoteTask.timePickedUp || localTask.timePickedUp;
            task.timeDroppedOff =
                remoteTask.timeDroppedOff || localTask.timeDroppedOff;
            task.timeRiderHome =
                remoteTask.timeRiderHome || localTask.timeRiderHome;
            task.timeCancelled =
                remoteTask.timeCancelled || localTask.timeCancelled;
            task.timeRejected =
                remoteTask.timeRejected || localTask.timeRejected;
            task.timePickedUpSenderName =
                remoteTask.timePickedUpSenderName ||
                localTask.timePickedUpSenderName;
            task.timeDroppedOffRecipientName =
                remoteTask.timeDroppedOffRecipientName ||
                localTask.timeDroppedOffRecipientName;
        });
        console.log("Resolved task conflict result:", newModel);
        const status = await determineTaskStatus(newModel);
        console.log("Updating task status to", status);
        newModel = models.Task.copyOf(newModel, (task) => {
            task.status = status;
        });
        const { createdAt, updatedAt, ...rest } = newModel;
        return rest;
    }
    return DISCARD;
};

export default dataStoreConflictHandler;
