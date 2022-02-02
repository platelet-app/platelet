import { tasksStatus, userRoles } from "../../apiConsts";
import { DataStore } from "aws-amplify";
import * as models from "../../models";

export async function saveNewTaskToDataStore(
    data,
    author = null,
    rider = null
) {
    let { pickUpLocation, dropOffLocation, deliverables, comment, ...rest } =
        data;
    let existingAuthor = null;
    if (author) {
        existingAuthor = await DataStore.query(models.User, author);
    }
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
            })
        );
    }

    if (comment && comment.body && existingAuthor) {
        await DataStore.save(
            new models.Comment({
                ...comment,
                parentId: newTask.id,
                author: existingAuthor,
            })
        );
    }

    return newTask;
}
