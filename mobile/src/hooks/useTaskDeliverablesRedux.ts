import { useSelector } from "react-redux";
import * as models from "../models";
import { taskDeliverablesSelector } from "../redux/Selectors";

const useTaskDeliverablesRedux = (
    taskId: string,
    taskType: "Task" | "ScheduledTask" = "Task"
) => {
    const taskDeliverables = useSelector(taskDeliverablesSelector);
    if (taskType === "Task") {
        return taskDeliverables.items.filter(
            (item: models.Deliverable) => item.task?.id === taskId
        );
    } else {
        return taskDeliverables.items.filter(
            (item: models.Deliverable) => item.scheduledTask?.id === taskId
        );
    }
};

export default useTaskDeliverablesRedux;
