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
        dropOffLocation,
        pickUpLocation,
        ...rest
    } = { ...task };
    if (pickUpLocation?.listed === 0) {
        pickUpLocation = new models.Location({
            ..._.omit(pickUpLocation, ...ignoredFields),
            tenantId,
        });
    }
    if (dropOffLocation?.listed === 0) {
        dropOffLocation = new models.Location({
            ..._.omit(dropOffLocation, ...ignoredFields),
            tenantId,
        });
    }
    let newTaskData = new models.Task({
        ...rest,
        status: tasksStatus.new,
        pickUpLocation,
        dropOffLocation,
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
                tenantId,
            });
        }
        const assignee = await DataStore.query(models.User, assigneeId);
        assignment = await DataStore.save(
            new models.TaskAssignee({
                task: newTaskData,
                assignee,
                role: assigneeRole,
                tenantId,
            })
        );
    }

    const newTask = await DataStore.save(newTaskData);

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
