import { DataStore } from "aws-amplify";
import _ from "lodash";
import { protectedFields, tasksStatus } from "../apiConsts";
import * as models from "../models";

export default async function duplicateTask(taskId) {
    const task = await DataStore.query(models.Task, taskId);
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
    const ignoreFields = [
        "id",
        "_version",
        "_lastChangedAt",
        "_deleted",
        "updatedAt",
        "createdAt",
    ];
    if (pickUpLocation?.listed === 0) {
        pickUpLocation = new models.Location({
            ..._.omit(pickUpLocation, ...ignoreFields),
        });
    }
    if (dropOffLocation?.listed === 0) {
        dropOffLocation = new models.Location({
            ..._.omit(dropOffLocation, ...ignoreFields),
        });
    }
    const newTaskData = new models.Task({
        ...rest,
        status: tasksStatus.new,
        pickUpLocation,
        dropOffLocation,
    });

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
