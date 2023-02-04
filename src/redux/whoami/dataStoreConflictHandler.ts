import { DISCARD } from "@aws-amplify/datastore";
import { SyncConflict, PersistentModel } from "@aws-amplify/datastore";
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
    // @ts-ignore
    if (modelConstructor === models.Task) {
        // @ts-ignore
        let newModel = modelConstructor.copyOf(remoteModel, (task) => {
            task.timePickedUp =
                remoteModel.timePickedUp || localModel.timePickedUp;
            task.timeDroppedOff =
                remoteModel.timeDroppedOff || localModel.timeDroppedOff;
            task.timeRiderHome =
                remoteModel.timeRiderHome || localModel.timeRiderHome;
            task.timeCancelled =
                remoteModel.timeCancelled || localModel.timeCancelled;
            task.timeRejected =
                remoteModel.timeRejected || localModel.timeRejected;
            task.timePickedUpSenderName =
                remoteModel.timePickedUpSenderName ||
                localModel.timePickedUpSenderName;
            task.timeDroppedOffRecipientName =
                remoteModel.timeDroppedOffRecipientName ||
                localModel.timeDroppedOffRecipientName;
        });
        console.log("Resolved task conflict result:", newModel);
        const status = await determineTaskStatus(newModel);
        console.log("Updating task status to", status);
        // @ts-ignore
        newModel = modelConstructor.copyOf(newModel, (task) => {
            task.status = status;
        });
        const { createdAt, updatedAt, ...rest } = newModel;
        return rest;
    }
    return DISCARD;
};

export default dataStoreConflictHandler;
