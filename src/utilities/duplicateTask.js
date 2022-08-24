import { DataStore } from "aws-amplify";
import { tasksStatus } from "../apiConsts";
import * as models from "../models";

export default async function duplicateTask(taskId) {
    const task = await DataStore.query(models.Task, taskId);
    const {
        timePickedUp,
        timeDroppedOff,
        timeRiderHome,
        timeRejected,
        timeCancelled,
        riderResponsibility,
        ...rest
    } = { ...task };
    const newTaskData = new models.Task({ ...rest, status: tasksStatus.new });
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
