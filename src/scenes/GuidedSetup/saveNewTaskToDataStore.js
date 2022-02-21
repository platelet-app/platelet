import { tasksStatus, userRoles } from "../../apiConsts";
import { DataStore } from "aws-amplify";
import * as models from "../../models";

export async function saveNewTaskToDataStore(
    data,
    tenantId,
    author = null,
    rider = null
) {
    if (!tenantId) {
        throw new Error("TenantId is required");
    }
    let { locations, deliverables, comment, ...rest } = data;
    let existingAuthor = null;
    if (author) {
        existingAuthor = await DataStore.query(models.User, author);
    }
    let pickUpLocation = locations.pickUpLocation;
    if (locations.pickUpLocation && !locations.pickUpLocation.id) {
        pickUpLocation = await DataStore.save(
            new models.Location({ ...pickUpLocation, listed: 0, tenantId })
        );
    }
    let dropOffLocation = locations.dropOffLocation;
    if (locations.dropOffLocation && !locations.dropOffLocation.id) {
        dropOffLocation = await DataStore.save(
            new models.Location({ ...dropOffLocation, listed: 0, tenantId })
        );
    }
    const newTask = await DataStore.save(
        new models.Task({
            ...rest,
            pickUpLocation,
            dropOffLocation,
            status: tasksStatus.new,
            tenantId,
        })
    );

    if (deliverables) {
        for (const deliverable of Object.values(deliverables)) {
            const deliverableType = await DataStore.query(
                models.DeliverableType,
                deliverable.id
            );
            await DataStore.save(
                new models.Deliverable({
                    deliverableType,
                    count: deliverable.count,
                    unit: deliverable.unit || null,
                    task: newTask,
                    tenantId,
                })
            );
        }
    }

    if (existingAuthor) {
        await DataStore.save(
            new models.TaskAssignee({
                task: newTask,
                assignee: existingAuthor,
                role: userRoles.coordinator,
                tenantId,
            })
        );
    }

    if (comment && comment.body && existingAuthor) {
        await DataStore.save(
            new models.Comment({
                ...comment,
                parentId: newTask.id,
                author: existingAuthor,
                tenantId,
            })
        );
    }

    return newTask;
}
