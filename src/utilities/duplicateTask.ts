import { DataStore } from "aws-amplify";
import _ from "lodash";
import * as models from "../models";

const ignoredFields = [
    "id",
    "_version",
    "_lastChangedAt",
    "_deleted",
    "updatedAt",
    "createdAt",
];

export default async function duplicateTask(
    task: models.Task,
    tenantId: string,
    createdById: string,
    assigneeId: string | null = null,
    assigneeRole: models.Role | null = null
) {
    if (!tenantId) throw new Error("tenantId must exist");
    if (!task) throw new Error("task must exist");
    if (!createdById) throw new Error("createdById must exist");
    let {
        id,
        updatedAt,
        createdAt,
        timePickedUp,
        timeDroppedOff,
        timeRiderHome,
        timeRejected,
        timeCancelled,
        riderResponsibility,
        createdBy,
        assignees,
        deliverables,
        comments,
        ...rest
    } = task;
    let pickUpLocation = await task.pickUpLocation;
    let dropOffLocation = await task.dropOffLocation;
    let establishmentLocation = await task.establishmentLocation;
    const author = await DataStore.query(models.User, createdById);
    if (!author) throw new Error("author not found");
    if (pickUpLocation?.listed === 0) {
        pickUpLocation = await DataStore.save(
            new models.Location({
                ..._.omit(pickUpLocation, ...ignoredFields),
                tenantId,
            })
        );
    } else if (pickUpLocation) {
        pickUpLocation = await DataStore.query(
            models.Location,
            pickUpLocation.id
        );
    }
    if (dropOffLocation?.listed === 0) {
        dropOffLocation = await DataStore.save(
            new models.Location({
                ..._.omit(dropOffLocation, ...ignoredFields),
                tenantId,
            })
        );
    } else if (dropOffLocation) {
        dropOffLocation = await DataStore.query(
            models.Location,
            dropOffLocation.id
        );
    }
    if (establishmentLocation?.listed === 0) {
        establishmentLocation = await DataStore.save(
            new models.Location({
                ..._.omit(establishmentLocation, ...ignoredFields),
                tenantId,
            })
        );
    } else if (establishmentLocation) {
        establishmentLocation = await DataStore.query(
            models.Location,
            establishmentLocation.id
        );
    }
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let newTaskData = new models.Task({
        ...rest,
        status: models.TaskStatus.NEW,
        pickUpLocation,
        dropOffLocation,
        establishmentLocation,
        tenantId,
        createdBy: author,
        dateCreated: today.toISOString().split("T")[0],
    });
    let assignment = null;
    if (assigneeId && assigneeRole) {
        if (assigneeRole === models.Role.RIDER) {
            newTaskData = new models.Task({
                ...rest,
                status: models.TaskStatus.ACTIVE,
                pickUpLocation,
                dropOffLocation,
                riderResponsibility,
                establishmentLocation,
                tenantId,
                createdBy: author,
                dateCreated: today.toISOString().split("T")[0],
            });
        }
        const assignee = await DataStore.query(models.User, assigneeId);
        if (assignee) {
            assignment = new models.TaskAssignee({
                task: newTaskData,
                assignee,
                role: assigneeRole,
                tenantId,
            });
        } else {
            throw new Error("Assignee not found");
        }
    }

    const newTask = await DataStore.save(newTaskData);
    if (assignment) {
        assignment = await DataStore.save(assignment);
    }
    const deliverablesResolved = await deliverables.toArray();
    console.log(deliverablesResolved);

    const newDeliverables = await Promise.all(
        deliverablesResolved.map((del) =>
            DataStore.save(
                new models.Deliverable({
                    ..._.omit(del, ...ignoredFields),
                    task: newTask,
                    tenantId,
                })
            )
        )
    );
    return { task: newTask, deliverables: newDeliverables, assignment };
}
