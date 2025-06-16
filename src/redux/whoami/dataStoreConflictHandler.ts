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
    if (remoteModel.archived === 1) {
        return DISCARD;
    }
    if (
        modelConstructor ===
        (models.Task as PersistentModelConstructor<models.Task>)
    ) {
        const remote = remoteModel as models.Task;
        const local = localModel as models.Task;
        let newModel = models.Task.copyOf(remote, (task) => {
            task.timePickedUp = remote.timePickedUp || local.timePickedUp;
            task.timeDroppedOff = remote.timeDroppedOff || local.timeDroppedOff;
            task.timeRiderHome = remote.timeRiderHome || local.timeRiderHome;
            task.timeCancelled = remote.timeCancelled || local.timeCancelled;
            task.timeRejected = remote.timeRejected || local.timeRejected;
            task.timePickedUpSenderName =
                remote.timePickedUpSenderName || local.timePickedUpSenderName;
            task.timeDroppedOffRecipientName =
                remote.timeDroppedOffRecipientName ||
                local.timeDroppedOffRecipientName;
        });
        console.log("Resolved task conflict result:", newModel);
        const status = await determineTaskStatus(newModel);
        console.log("Updating task status to", status);
        newModel = models.Task.copyOf(newModel, (task) => {
            task.status = status;
        });
        const {
            createdAt,
            updatedAt,
            tenantId,
            archived,
            dateCompleted,
            ...rest
        } = newModel;
        return rest;
    } else if (
        modelConstructor ===
        (models.Comment as PersistentModelConstructor<models.Comment>)
    ) {
        const { createdAt, updatedAt, tenantId, archived, ...rest } =
            remoteModel;
        return rest;
    }
    return DISCARD;
};

export default dataStoreConflictHandler;
