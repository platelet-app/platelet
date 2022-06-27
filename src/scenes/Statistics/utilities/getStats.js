import { DataStore } from "aws-amplify";
import { priorities, tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";

export default async function getStats(role, range, whoamiId) {
    const stats = {
        common: {},
        priorities: {},
        riders: {},
        responsibilities: {},
    };
    // get all tasks within the date range
    const tasksWithinRange = await DataStore.query(models.Task, (t) =>
        t.or((t) =>
            t
                .createdAt("eq", undefined)
                .and((t) =>
                    t.createdAt("le", range.start).createdAt("ge", range.end)
                )
        )
    );
    const taskIds = tasksWithinRange.map((t) => t.id);
    const coordAssignmentsAll = await DataStore.query(
        models.TaskAssignee,
        (a) => a.role("eq", userRoles.coordinator)
    );
    // get all of my tasks as a coordinator that fit in the range
    const myCoordAssignments = coordAssignmentsAll.filter(
        (a) => a.assignee && a.assignee.id === whoamiId
    );
    const myTasks = myCoordAssignments
        .filter((ta) => taskIds.includes(ta.task.id))
        .map((a) => a.task);
    const myTaskIds = myTasks.map((t) => t.id);
    console.log(myTasks);
    console.log(tasksWithinRange);
    stats.common.TOTAL = myTasks.length;
    // get the status stats
    for (const status of Object.values(tasksStatus)) {
        stats.common[status] = myTasks.filter(
            (task) => task.status === status
        ).length;
    }
    // get the priority stats
    for (const priority of Object.values(priorities)) {
        stats.priorities[priority] = myTasks.filter(
            (task) => task.priority === priority
        ).length;
    }
    // any unset priorities
    stats.priorities["NONE"] = myTasks.filter((task) => !task.priority).length;
    stats.priorities["TOTAL"] = myTasks.length;

    // get all the rider assignments that intersect with mine
    const riderAssignmentsAll = await DataStore.query(
        models.TaskAssignee,
        (a) => a.role("eq", userRoles.rider)
    );
    const taskAssignments = riderAssignmentsAll.filter((ta) =>
        myTaskIds.includes(ta.task.id)
    );
    const activeRiders = {};
    for (const assignment of taskAssignments) {
        if (assignment.assignee)
            activeRiders[assignment.assignee.id] = assignment.assignee;
    }
    const riders = {};
    for (const rider of Object.values(activeRiders)) {
        riders[rider.displayName] = {};
        for (const priority of Object.values(priorities)) {
            const count = taskAssignments.filter(
                (assignment) =>
                    assignment.assignee &&
                    assignment.assignee.id === rider.id &&
                    assignment.task &&
                    assignment.task.priority === priority
            ).length;
            riders[rider.displayName][priority] = count;
        }
        const noPriority = taskAssignments.filter(
            (assignment) =>
                assignment.assignee &&
                assignment.assignee.id === rider.id &&
                assignment.task &&
                !assignment.task.priority
        ).length;
        const total = taskAssignments.filter(
            (assignment) =>
                assignment.assignee && assignment.assignee.id === rider.id
        ).length;
        riders[rider.displayName]["TOTAL"] = total;
        riders[rider.displayName]["NONE"] = noPriority;
    }
    const responsibilities = { None: { Total: 0 } };
    const prioritiesTemplate = {
        [priorities.low]: 0,
        [priorities.medium]: 0,
        [priorities.high]: 0,
    };
    for (const task of myTasks) {
        const t = {
            ...task,
        };
        if (!t.riderResponsibility) {
            responsibilities["None"].Total = responsibilities["None"].Total++;
            continue;
        }
        if (!responsibilities[t.riderResponsibility]) {
            responsibilities[t.riderResponsibility] = {
                Total: 1,
                ...prioritiesTemplate,
            };
        } else {
            responsibilities[t.riderResponsibility].Total++;
        }
    }
    for (const resp of Object.keys(responsibilities)) {
        for (const priority of Object.values(priorities)) {
            if (resp === "None") {
                responsibilities[resp][priority] = myTasks.filter(
                    (t) => !t.riderResponsibility && t.priority === priority
                ).length;
                responsibilities[resp]["Total"] +=
                    responsibilities[resp][priority];
            } else {
                if (resp) {
                    responsibilities[resp][priority] = myTasks.filter(
                        (t) =>
                            t.riderResponsibility &&
                            t.riderResponsibility === resp &&
                            t.priority === priority
                    ).length;
                }
            }
        }
    }
    for (const resp of Object.keys(responsibilities)) {
        if (resp === "None") {
            responsibilities[resp]["None"] = myTasks.filter(
                (t) => !t.riderResponsibility && !t.priority
            ).length;
            responsibilities[resp]["Total"] += responsibilities[resp]["None"];
        } else {
            if (resp) {
                responsibilities[resp]["None"] = myTasks.filter(
                    (t) => t.riderResponsibility === resp && !t.priority
                ).length;
            }
        }
    }

    stats.riders = riders;
    stats.riderResponsibilities = responsibilities;
    console.log("Generated stats:", stats);

    return stats;
}
