import { tasksStatus, userRoles } from "../../apiConsts";
import store from "../../redux/Store";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
import { convertListDataToObject } from "../../utilities";
import _ from "lodash";
import * as assigneeActions from "../../redux/taskAssignees/taskAssigneesActions";

export async function saveNewTaskToDataStore(
    data,
    tenantId,
    authorId,
    rider = null
) {
    if (!tenantId) {
        throw new Error("tenantId is required");
    }
    if (!authorId) {
        throw new Error("authorId is required");
    }
    const author = await DataStore.query(models.User, authorId);
    if (!author) {
        throw new Error("Author not found");
    }
    let { locations, deliverables, comment, ...rest } = data;
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
            createdBy: author,
            dropOffLocation,
            status: tasksStatus.new,
            tenantId,
        })
    );

    if (deliverables && !_.isEmpty(deliverables)) {
        DataStore.query(models.DeliverableType).then((deliverableTypes) => {
            const deliverableTypesObject =
                convertListDataToObject(deliverableTypes);
            for (const deliverable of Object.values(deliverables)) {
                const deliverableType = deliverableTypesObject[deliverable.id];
                DataStore.save(
                    new models.Deliverable({
                        deliverableType,
                        count: deliverable.count,
                        unit: deliverable.unit || null,
                        task: newTask,
                        tenantId,
                    })
                );
            }
        });
    }

    DataStore.save(
        new models.TaskAssignee({
            task: newTask,
            assignee: author,
            role: userRoles.coordinator,
            tenantId,
        })
    ).then((assignment) => {
        store.dispatch(assigneeActions.addTaskAssignee(assignment));
    });

    if (comment && comment.body) {
        DataStore.save(
            new models.Comment({
                ...comment,
                parentId: newTask.id,
                author,
                tenantId,
            })
        );
    }

    return newTask;
}
