import { useSelector } from "react-redux";
import { getWhoami, taskAssigneesSelector } from "../redux/Selectors";
import * as models from "../models";

const useTaskAssigneesRedux = (
    taskId: string,
    ignoreSelf: boolean = false,
    role: models.Role | null = null
) => {
    const taskAssignees = useSelector(taskAssigneesSelector);
    const whoami = useSelector(getWhoami);
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
    if (ignoreSelf) {
        assignees = assignees.filter(
            (item: models.TaskAssignee) => item.assignee?.id !== whoami.id
        );
    }

    return assignees;
};

export default useTaskAssigneesRedux;
