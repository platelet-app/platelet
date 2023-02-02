import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRoleView, getWhoami } from "../redux/Selectors";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import { ResolvedTaskAssignee } from "../resolved-models";

export function useAssignmentRole(taskId: string) {
    const [taskAssignees, setTaskAssignees] = useState<ResolvedTaskAssignee[]>(
        []
    );
    const whoami = useSelector(getWhoami);
    const [currentUserRole, setCurrentUserRole] = useState(models.Role.USER);
    const roleView = useSelector(getRoleView);
    const taskAssigneesObserver = React.useRef({ unsubscribe: () => {} });

    // return the user role in order of precedence
    // 1. coordinator
    // 2. rider
    // 3. user

    const getTaskAssignees = React.useCallback(async () => {
        if (!taskId) return;
        try {
            taskAssigneesObserver.current.unsubscribe();
            taskAssigneesObserver.current = DataStore.observeQuery(
                models.TaskAssignee,
                (a) => a.task.id.eq(taskId)
            ).subscribe(async ({ items }) => {
                const result = await Promise.all(
                    items.map(async (item) => {
                        const assignee = await item.assignee;
                        return { ...item, assignee };
                    })
                );
                setTaskAssignees(result);
            });
        } catch (e) {
            console.log("error getting task assignees", e);
            setCurrentUserRole(models.Role.USER);
        }
    }, [taskId]);

    useEffect(() => {
        getTaskAssignees();
        return () => {
            taskAssigneesObserver.current.unsubscribe();
        };
    }, [getTaskAssignees]);

    useEffect(() => {
        if (!taskId || !whoami || !roleView) return;
        if (
            (whoami.roles.includes(models.Role.ADMIN) ||
                whoami.roles.includes(models.Role.COORDINATOR)) &&
            ["ALL", models.Role.COORDINATOR].includes(roleView)
        ) {
            setCurrentUserRole(models.Role.COORDINATOR);
        } else {
            const isRider = taskAssignees.some(
                (a) =>
                    a.role === models.Role.RIDER &&
                    a.assignee &&
                    a.assignee.id === whoami.id
            );
            if (isRider) {
                setCurrentUserRole(models.Role.RIDER);
            } else {
                // are we assigned as coord on rider view?
                const isCoord = taskAssignees.some(
                    (a) =>
                        a.role === models.Role.COORDINATOR &&
                        a.assignee &&
                        a.assignee.id === whoami.id
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
