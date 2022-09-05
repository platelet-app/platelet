import { DataStore } from "aws-amplify";
import _ from "lodash";
import { tasksStatus, userRoles } from "../apiConsts";
import * as models from "../models";

export default async function duplicateTask(
    task,
    assigneeId = null,
    assigneeRole = null
) {
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
            ...pickUpLocation,
        });
    }
    if (dropOffLocation?.listed === 0) {
        dropOffLocation = new models.Location({
            ...dropOffLocation,
        });
    }
    let newTaskData = new models.Task({
        ...rest,
        status: tasksStatus.new,
        pickUpLocation,
        dropOffLocation,
    });
    if (assigneeId && assigneeRole) {
        if (assigneeRole === userRoles.rider) {
            newTaskData = new models.Task({
                ...rest,
                status: tasksStatus.active,
                pickUpLocation,
                dropOffLocation,
                riderResponsibility,
            });
        }
        const assignee = await DataStore.query(models.User, assigneeId);
        await DataStore.save(
            new models.TaskAssignee({
                task: newTaskData,
                assignee,
                role: assigneeRole,
            })
        );
    }

    const newTask = await DataStore.save(newTaskData);

    const deliverables = await DataStore.query(models.Deliverable);
    const filteredDeliverables = deliverables.filter(
        (d) => d.task && d.task.id === task.id
    );
    await Promise.all(
        filteredDeliverables.map((del) =>
            DataStore.save(new models.Deliverable({ ...del, task: newTask }))
        )
    );
    return newTask;
}
