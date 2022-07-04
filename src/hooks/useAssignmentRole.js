import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
} from "../redux/Selectors";
import { userRoles } from "../apiConsts";

export function useAssignmentRole(taskId) {
    const taskAssignees = useSelector(taskAssigneesSelector);
    const whoami = useSelector(getWhoami);
    const [currentUserRole, setCurrentUserRole] = useState(userRoles.user);
    const roleView = useSelector(getRoleView);

    // return the user role in order of precedence
    // 1. coordinator
    // 2. rider
    // 3. user

    useEffect(() => {
        if (!taskId || !whoami || !roleView) return;
        if (
            (whoami.roles.includes(userRoles.admin) ||
                whoami.roles.includes(userRoles.coordinator)) &&
            ["ALL", userRoles.coordinator].includes(roleView)
        ) {
            setCurrentUserRole(userRoles.coordinator);
        } else {
            const isRider = taskAssignees.items.some(
                (a) =>
                    a.role === userRoles.rider &&
                    a.assignee &&
                    a.assignee.id === whoami.id &&
                    a.task &&
                    a.task.id === taskId
            );
            if (isRider) {
                setCurrentUserRole(userRoles.rider);
            } else {
                // are we assigned as coord on rider view?
                const isCoord = taskAssignees.items.some(
                    (a) =>
                        a.role === userRoles.coordinator &&
                        a.assignee &&
                        a.assignee.id === whoami.id &&
                        a.task &&
                        a.task.id === taskId
                );
                if (isCoord) {
                    setCurrentUserRole(userRoles.coordinator);
                } else {
                    setCurrentUserRole(userRoles.user);
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
    const [currentUserRole, setCurrentUserRole] = useState(userRoles.user);

    // return the user role in order of precedence
    // 1. admin
    // 2. coordinator
    // 3. rider
    // 3. user

    useEffect(() => {
        if (!taskId || !whoami) return;
        if (whoami.roles.includes(userRoles.admin)) {
            setCurrentUserRole(userRoles.admin);
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
                (a) => a.role === userRoles.coordinator
            )
                ? userRoles.coordinator
                : userRoles.rider;
            setCurrentUserRole(role);
        } else {
            setCurrentUserRole(userRoles.user);
        }
    }, [taskAssignees, whoami, taskId]);

    return currentUserRole;
}

*/
