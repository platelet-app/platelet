import { useSelector } from "react-redux";
import { taskAssigneesSelector } from "../redux/Selectors";
import * as models from "../models";

const useTaskAssigneesRedux = (
    taskId: string,
    role: models.Role | null = null
) => {
    const taskAssignees = useSelector(taskAssigneesSelector);
    let assignees = [];
    if (role) {
        assignees = taskAssignees.items.filter(
            (item: models.TaskAssignee) =>
                item.task?.id === taskId && item.role === role
        );
    } else {
        assignees = taskAssignees.items.filter(
            (item: models.TaskAssignee) => item.task?.id === taskId
        );
    }

    return assignees;
};

export default useTaskAssigneesRedux;
