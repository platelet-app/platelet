import * as models from "../../../models";

const generateMultipleAcceptedTasks = (tasks: models.Task[]): models.Task[] => {
    const result = Object.values(tasks).map((task) => {
        return models.Task.copyOf(task, (updated) => {
            updated.status = models.TaskStatus.NEW;
        });
    });
    return result;
};

export default generateMultipleAcceptedTasks;
