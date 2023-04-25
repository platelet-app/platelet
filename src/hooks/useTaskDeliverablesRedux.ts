import { useSelector } from "react-redux";
import * as models from "../models";
import { taskDeliverablesSelector } from "../redux/Selectors";

const useTaskDeliverablesRedux = (taskId: string) => {
    const taskDeliverables = useSelector(taskDeliverablesSelector);
    const deliverables = taskDeliverables.items.filter(
        (item: models.Deliverable) => item.task?.id === taskId
    );
    return deliverables;
};

export default useTaskDeliverablesRedux;
