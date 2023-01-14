import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
} from "../redux/Selectors";
import * as models from "../models";

export function useAssignmentRole(taskId) {
    const taskAssignees = useSelector(taskAssigneesSelector);
    const whoami = useSelector(getWhoami);
    const [currentUserRole, setCurrentUserRole] = useState(models.Role.USER);
    const roleView = useSelector(getRoleView);

    // return the user role in order of precedence
    // 1. coordinator
    // 2. rider
    // 3. user

    useEffect(() => {
        if (!taskId || !whoami || !roleView) return;
        if (
            (whoami.roles.includes(models.Role.ADMIN) ||
                whoami.roles.includes(models.Role.COORDINATOR)) &&
            ["ALL", models.Role.COORDINATOR].includes(roleView)
        ) {
            setCurrentUserRole(models.Role.COORDINATOR);
        } else {
            const isRider = taskAssignees.items.some(
                (a) =>
                    a.role === models.Role.RIDER &&
                    a.assignee &&
                    a.assignee.id === whoami.id &&
                    a.task &&
                    a.task.id === taskId
            );
            if (isRider) {
                setCurrentUserRole(models.Role.RIDER);
            } else {
                // are we assigned as coord on rider view?
                const isCoord = taskAssignees.items.some(
                    (a) =>
                        a.role === models.Role.COORDINATOR &&
                        a.assignee &&
                        a.assignee.id === whoami.id &&
                        a.task &&
                        a.task.id === taskId
                );
                if (isCoord) {
                    setCurrentUserRole(models.Role.COORDINATOR);
                } else {
                    setCurrentUserRole(models.Role.USER);
                }
            }
        }
    }, [taskAssignees, whoami, taskId, roleView]);

    return currentUserRole;
}

// this is if we want to make coords only have access if assigned
//
/*export function useAssignmentRole(taskId) {
    const taskAssignees = useSelector(taskAssigneesSelector);
    const whoami = useSelector(getWhoami);
    const [currentUserRole, setCurrentUserRole] = useState(models.Role.USER);

    // return the user role in order of precedence
    // 1. admin
    // 2. coordinator
    // 3. rider
    // 3. user

    useEffect(() => {
        if (!taskId || !whoami) return;
        if (whoami.roles.includes(models.Role.ADMIN)) {
            setCurrentUserRole(models.Role.ADMIN);
            return;
        }
        const assignments = taskAssignees.items.filter(
            (a) =>
                a.assignee &&
                a.assignee.id === whoami.id &&
                a.task &&
                a.task.id === taskId
        );

        if (assignments.length === 1) {
            setCurrentUserRole(assignments[0].role);
        } else if (assignments.length > 1) {
            const role = assignments.some(
                (a) => a.role === models.Role.COORDINATOR
            )
                ? models.Role.COORDINATOR
                : models.Role.RIDER;
            setCurrentUserRole(role);
        } else {
            setCurrentUserRole(models.Role.USER);
        }
    }, [taskAssignees, whoami, taskId]);

    return currentUserRole;
}

*/
