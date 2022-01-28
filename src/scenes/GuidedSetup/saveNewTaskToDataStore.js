import { tasksStatus, userRoles } from "../../apiConsts";
import { DataStore } from "aws-amplify";
import * as models from "../../models";

export async function saveNewTaskToDataStore(
    data,
    coordinator = null,
    rider = null
) {
    let { pickUpLocation, dropOffLocation, ...rest } = data;
    if (pickUpLocation && !pickUpLocation.id) {
        pickUpLocation = await DataStore.save(
            new models.Location({ ...pickUpLocation, listed: 0 })
        );
    }
    if (dropOffLocation && !dropOffLocation.id) {
        dropOffLocation = await DataStore.save(
            new models.Location({ ...dropOffLocation, listed: 0 })
        );
    }
    const newTask = await DataStore.save(
        new models.Task({
            ...rest,
            pickUpLocation,
            dropOffLocation,
            status: tasksStatus.new,
        })
    );

    if (coordinator) {
        const assignee = await DataStore.query(models.User, coordinator);
        if (!assignee) {
            throw new Error("Coordinator not found");
        }

        await DataStore.save(
            new models.TaskAssignee({
                task: newTask,
                assignee,
                role: userRoles.coordinator,
            })
        );
    }
    return newTask;
}
