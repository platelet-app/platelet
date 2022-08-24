import { DataStore } from "aws-amplify";
import _ from "lodash";
import { tasksStatus } from "../apiConsts";
import * as models from "../models";

export default async function duplicateTask(task) {
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
