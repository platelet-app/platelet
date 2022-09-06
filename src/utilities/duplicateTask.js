import { DataStore } from "aws-amplify";
import _ from "lodash";
import { tasksStatus, userRoles } from "../apiConsts";
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
    task,
    tenantId,
    assigneeId = null,
    assigneeRole = null
) {
    if (!tenantId) throw new Error("tenantId must exist");
    if (!task) throw new Error("task must exist");
    let {
        id,
        _version,
        _lastChangedAt,
        _deleted,
        updatedAt,
        createdAt,
        timePickedUp,
        timeDroppedOff,
        timeRiderHome,
        timeRejected,
        timeCancelled,
        riderResponsibility,
        establishmentLocation,
        dropOffLocation,
        pickUpLocation,
        ...rest
    } = { ...task };
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
    let newTaskData = new models.Task({
        ...rest,
        status: tasksStatus.new,
        pickUpLocation,
        dropOffLocation,
        establishmentLocation,
        tenantId,
    });
    let assignment = null;
    if (assigneeId && assigneeRole) {
        if (assigneeRole === userRoles.rider) {
            newTaskData = new models.Task({
                ...rest,
                status: tasksStatus.active,
                pickUpLocation,
                dropOffLocation,
                riderResponsibility,
                establishmentLocation,
                tenantId,
            });
        }
        const assignee = await DataStore.query(models.User, assigneeId);
        assignment = new models.TaskAssignee({
            task: newTaskData,
            assignee,
            role: assigneeRole,
            tenantId,
        });
    }

    const newTask = await DataStore.save(newTaskData);
    if (assignment) {
        assignment = await DataStore.save(assignment);
    }

    const deliverables = await DataStore.query(models.Deliverable);
    const filteredDeliverables = deliverables.filter(
        (d) => d.task && d.task.id === task.id
    );
    const newDeliverables = await Promise.all(
        filteredDeliverables.map((del) =>
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
