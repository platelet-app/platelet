import { useSelector } from "react-redux";
import { getWhoami, taskAssigneesSelector } from "../redux/Selectors";
import * as models from "../models";

type TaskAssigneeResolved = models.TaskAssignee & {
    assignee: models.User | undefined;
    task: models.Task | undefined;
};

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
            (item: TaskAssigneeResolved) =>
                item.task?.id === taskId && item.role === role
        );
    } else {
        assignees = taskAssignees.items.filter(
            (item: TaskAssigneeResolved) => item.task?.id === taskId
        );
    }
    if (ignoreSelf) {
        assignees = assignees.filter(
            (item: TaskAssigneeResolved) => item.assignee?.id !== whoami.id
        );
    }

    return assignees;
};

export default useTaskAssigneesRedux;
