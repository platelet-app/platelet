import { Task, Role, Priority, TaskStatus, User } from "../../../API";

type PriorityUnion = Priority | "NONE" | "TOTAL";

type Stats = {
    common: {
        TOTAL: number;
        [key: string]: number;
    };
    priorities: {
        [key in PriorityUnion]?: number;
    };
    riders: {
        [key: string]: {
            [key: string]: number;
        };
    };
    riderResponsibilities: {
        [key: string]: {
            [key: string]: number;
        };
    };
};

export default function getStats(data: Task[], whoamiId: string) {
    const stats: Stats = {
        common: { TOTAL: 0 },
        priorities: {},
        riders: {},
        riderResponsibilities: {},
    };
    // get all tasks within the date range
    const myTasks = data.filter((t) =>
        t.assignees?.items?.some(
            (a) =>
                !a?._deleted &&
                a?.role === Role.COORDINATOR &&
                a?.assignee?.id === whoamiId
        )
    );
    const myTaskIds = myTasks.map((t) => t.id);
    stats.common.TOTAL = myTasks.length;
    // get the status stats
    for (const status of Object.values(TaskStatus)) {
        if (status === TaskStatus.PENDING) continue;
        stats.common[status] = myTasks.filter(
            (task) => task.status === status
        ).length;
    }
    // get the priority stats
    for (const priority of Object.values(Priority)) {
        stats.priorities[priority] = myTasks.filter(
            (task) => task.priority === priority
        ).length;
    }
    // any unset priorities
    stats.priorities["NONE"] = myTasks.filter((task) => !task.priority).length;
    stats.priorities["TOTAL"] = myTasks.length;

    // get all the rider assignments that intersect with mine
    const riderAssignmentsAll = data.filter((t) =>
        t.assignees?.items?.some((a) => !a?._deleted && a?.role === Role.RIDER)
    );
    const taskAssignments = riderAssignmentsAll.filter((ta) =>
        myTaskIds.includes(ta.id)
    );
    const assignments = taskAssignments
        .map((ta) => ta?.assignees?.items)
        .flat()
        .filter((a) => !a?._deleted && a?.role === Role.RIDER);
    const activeRiders: { [key: string]: User } = {};
    for (const assignment of assignments) {
        if (assignment?.assignee)
            activeRiders[assignment?.assignee?.id] = assignment?.assignee;
    }
    const riders: { [key: string]: any } = {};
    for (const rider of Object.values(activeRiders)) {
        riders[rider.displayName] = {};
        for (const priority of Object.values(Priority)) {
            const count = assignments.filter(
                (assignment) =>
                    assignment?.assignee.id === rider.id &&
                    assignment.task &&
                    assignment.task.priority === priority
            ).length;
            riders[rider.displayName][priority] = count;
        }
        const noPriority = assignments.filter(
            (assignment) =>
                assignment?.assignee.id === rider.id &&
                assignment.task &&
                !assignment.task.priority
        ).length;
        const total = assignments.filter(
            (assignment) => assignment?.assignee.id === rider.id
        ).length;
        riders[rider.displayName]["TOTAL"] = total;
        riders[rider.displayName]["NONE"] = noPriority;
    }
    const responsibilities: { [key: string]: { [key: string]: number } } = {
        None: { Total: 0 },
    };
    const prioritiesTemplate = {
        [Priority.LOW]: 0,
        [Priority.MEDIUM]: 0,
        [Priority.HIGH]: 0,
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
        for (const priority of Object.values(Priority)) {
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

    return stats;
}
