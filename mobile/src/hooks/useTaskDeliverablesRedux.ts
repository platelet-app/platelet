import { useSelector } from "react-redux";
import * as models from "../models";
import { taskDeliverablesSelector } from "../redux/Selectors";

type ResolvedDeliverable = models.Deliverable & {
    task: models.Task | undefined;
    scheduledTask: models.ScheduledTask | undefined;
};

const useTaskDeliverablesRedux = (
    taskId: string,
    taskType: "Task" | "ScheduledTask" = "Task"
) => {
    const taskDeliverables = useSelector(taskDeliverablesSelector);
    if (taskType === "Task") {
        return taskDeliverables.items.filter(
            (item: ResolvedDeliverable) => item.task?.id === taskId
        );
    } else {
        return taskDeliverables.items.filter(
            (item: ResolvedDeliverable) => item.scheduledTask?.id === taskId
        );
    }
};

export default useTaskDeliverablesRedux;
