import { DataStore } from "aws-amplify";
import _ from "lodash";
import moment from "moment";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";
import { writeToString } from "@fast-csv/format";
import getTasksByTenantId from "./getTasksByTenantId";
import { Task, Role, CommentVisibility } from "../../../API";

const isDateValid = (date: Date): boolean => {
    const newDate = new Date(date);
    return !isNaN(newDate.getTime());
};

const isStartDateBeforeEndDate = (startDate: Date, endDate: Date): boolean => {
    return startDate.getTime() <= endDate.getTime();
};

const taskFields = {
    timeOfCall: "",
    riderResponsibility: "",
    isRiderUsingOwnVehicle: "",
    priority: "",
    status: "",
    timePickedUp: "",
    timeDroppedOff: "",
    timeRiderHome: "",
};

const locationFields = {
    ward: "",
    line1: "",
    town: "",
    postcode: "",
};

const itemFields = {
    label: "",
    count: "",
};

const requesterContactFields = {
    name: "",
    telephoneNumber: "",
};

const assigneeFields = {
    name: "",
    role: "",
};

const commentFields = {
    author: "",
    body: "",
};

function generateHeader(fields: any, prefix = "") {
    let keys = Object.keys(fields);
    if (prefix) {
        return keys.map((k) => `${prefix}_${k}`);
    } else {
        return keys;
    }
}

function generateCountedHeader(count: number, fields: any, prefix: string) {
    return _.range(count)
        .map((i) => {
            return Object.keys(fields).map((k) => `${prefix}_${i}_${k}`);
        })
        .flat();
}

async function generateCSVDataStore(data: any[]) {
    const rows = [];
    const headers = [];
    const assigneesCount = data.reduce((acc, task) => {
        if (task.assignees && task.assignees.length > acc)
            return task.assignees.length;
        else return acc;
    }, 0);
    const itemOffsetCount =
        [
            ...Object.keys(taskFields),
            ...Object.keys(locationFields),
            ...Object.keys(locationFields),
            ...Object.keys(requesterContactFields),
        ].length +
        assigneesCount * Object.keys(assigneeFields).length;

    const itemsCount = data.reduce((acc, task) => {
        if (task.items && task.items.length > acc) return task.items.length;
        else return acc;
    }, 0);

    const commentsOffsetCount =
        itemOffsetCount + itemsCount * Object.keys(itemFields).length;

    const commentsCount = data.reduce((acc, task) => {
        if (task.comments && task.comments.length > acc)
            return task.comments.length;
        else return acc;
    }, 0);

    headers.push(generateHeader(taskFields));
    headers.push(generateHeader(requesterContactFields, "requesterContact"));
    headers.push(generateHeader(locationFields, "pickUpLocation"));
    headers.push(generateHeader(locationFields, "dropOffLocation"));
    if (assigneesCount > 0) {
        headers.push(
            generateCountedHeader(assigneesCount, assigneeFields, "assignee")
        );
    }
    if (itemsCount > 0) {
        headers.push(generateCountedHeader(itemsCount, itemFields, "item"));
    }
    if (commentsCount > 0) {
        headers.push(
            generateCountedHeader(commentsCount, commentFields, "comment")
        );
    }
    console.log(headers);
    rows.push(headers.flat());
    console.log(rows);
    data.forEach((item) => {
        let row: string[] = [];
        const {
            pickUpLocation,
            dropOffLocation,
            requesterContact,
            comments,
            items,
            assignees,
            createdBy,
            ...rest
        } = item;
        Object.keys(taskFields).forEach((key) => {
            row.push(rest[key]);
        });
        if (requesterContact)
            Object.keys(requesterContactFields).forEach((key) => {
                row.push(requesterContact[key]);
            });
        else
            Object.values(requesterContactFields).forEach((value) => {
                row.push(value);
            });
        if (pickUpLocation)
            Object.keys(locationFields).forEach((key) => {
                row.push(
                    pickUpLocation[key] ||
                        locationFields[key as keyof typeof locationFields]
                );
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        if (dropOffLocation)
            Object.keys(locationFields).forEach((key) => {
                row.push(
                    dropOffLocation[key] ||
                        locationFields[key as keyof typeof locationFields]
                );
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        if (assignees && assignees.length > 0) {
            assignees.forEach((item: models.TaskAssignee) => {
                Object.keys(assigneeFields).forEach((key) => {
                    if (key === "name") {
                        row.push(item?.assignee.name || assigneeFields.name);
                    } else if (key === "role") {
                        row.push(item?.role || assigneeFields.role);
                    }
                });
            });
        }

        if (items && items.length > 0) {
            if (row.length !== itemOffsetCount) {
                _.range(itemOffsetCount - row.length).forEach(() => {
                    row.push("");
                });
            }
            items.forEach((item: models.Deliverable) => {
                Object.keys(itemFields).forEach((key) => {
                    if (key === "label") {
                        row.push(
                            item?.deliverableType?.label || itemFields[key]
                        );
                    } else {
                        row.push(item?.count?.toString() || "");
                    }
                });
            });
        }

        if (comments && comments.length > 0) {
            if (row.length !== commentsOffsetCount) {
                _.range(commentsOffsetCount - row.length).forEach(() => {
                    row.push("");
                });
            }
            comments.forEach((comment: models.Comment) => {
                Object.keys(commentFields).forEach((key) => {
                    if (key === "author") {
                        row.push(
                            comment.author?.displayName || commentFields[key]
                        );
                    } else {
                        row.push(comment.body || commentFields.body);
                    }
                });
            });
        }

        rows.push(row);
    });
    return await writeToString(rows);
}

async function generateCSV(data: (Task | null)[]) {
    const filteredNulls = data.filter((t) => !!t);
    const newData = filteredNulls.map((t) => {
        const isRiderUsingOwnVehicleBool = !!t?.isRiderUsingOwnVehicle;
        const isRiderUsingOwnVehicle = isRiderUsingOwnVehicleBool
            ? "TRUE"
            : "FALSE";

        return { ...t, isRiderUsingOwnVehicle };
    });
    const rows = [];
    const headers = [];
    const assigneesCount = newData.reduce((acc, task) => {
        if (task?.assignees?.items && task?.assignees?.items.length > acc)
            return task.assignees.items.length;
        else return acc;
    }, 0);
    const itemOffsetCount =
        [
            ...Object.keys(taskFields),
            ...Object.keys(locationFields),
            ...Object.keys(locationFields),
            ...Object.keys(requesterContactFields),
        ].length +
        assigneesCount * Object.keys(assigneeFields).length;

    const itemsCount = newData.reduce((acc, task) => {
        if (task?.deliverables?.items && task?.deliverables?.items.length > acc)
            return task?.deliverables?.items.length;
        else return acc;
    }, 0);

    const commentsOffsetCount =
        itemOffsetCount + itemsCount * Object.keys(itemFields).length;

    const commentsCount = newData.reduce((acc, task) => {
        const filtered = task?.comments?.items?.filter(
            (c) =>
                c?.visibility === models.CommentVisibility.EVERYONE &&
                !c?._deleted
        );
        if (filtered && filtered?.length > acc) return filtered?.length;
        else return acc;
    }, 0);

    headers.push(generateHeader(taskFields));
    headers.push(generateHeader(requesterContactFields, "requesterContact"));
    headers.push(generateHeader(locationFields, "pickUpLocation"));
    headers.push(generateHeader(locationFields, "dropOffLocation"));
    if (assigneesCount > 0) {
        headers.push(
            generateCountedHeader(assigneesCount, assigneeFields, "assignee")
        );
    }
    if (itemsCount > 0) {
        headers.push(generateCountedHeader(itemsCount, itemFields, "item"));
    }
    if (commentsCount > 0) {
        headers.push(
            generateCountedHeader(commentsCount, commentFields, "comment")
        );
    }
    console.log(headers);
    rows.push(headers.flat());
    console.log(rows);
    newData.forEach((item) => {
        let row: (string | number)[] = [];
        const {
            pickUpLocation,
            dropOffLocation,
            requesterContact,
            comments,
            deliverables,
            assignees,
            createdBy,
            ...rest
        } = item;
        Object.keys(taskFields).forEach((key) => {
            row.push(rest[key as keyof typeof taskFields] || "");
        });
        if (requesterContact)
            Object.keys(requesterContactFields).forEach((key) => {
                row.push(
                    requesterContact[
                        key as keyof typeof requesterContactFields
                    ] || ""
                );
            });
        else
            Object.values(requesterContactFields).forEach((value) => {
                row.push(value);
            });
        if (pickUpLocation)
            Object.keys(locationFields).forEach((key) => {
                row.push(
                    pickUpLocation[key as keyof typeof locationFields] ||
                        locationFields[key as keyof typeof locationFields]
                );
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        if (dropOffLocation)
            Object.keys(locationFields).forEach((key) => {
                row.push(
                    dropOffLocation[key as keyof typeof locationFields] ||
                        locationFields[key as keyof typeof locationFields]
                );
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        if (assignees?.items && assignees?.items.length > 0) {
            assignees?.items.forEach((item) => {
                Object.keys(assigneeFields).forEach((key) => {
                    if (key === "name") {
                        row.push(item?.assignee.name || assigneeFields.name);
                    } else if (key === "role") {
                        row.push(item?.role || assigneeFields.role);
                    }
                });
            });
        }

        if (deliverables?.items && deliverables?.items.length > 0) {
            if (row.length !== itemOffsetCount) {
                _.range(itemOffsetCount - row.length).forEach(() => {
                    row.push("");
                });
            }
            deliverables?.items.forEach((item) => {
                Object.keys(itemFields).forEach((key) => {
                    if (key === "label") {
                        row.push(
                            item?.deliverableType?.label || itemFields[key]
                        );
                    } else {
                        row.push(item?.count || itemFields?.count);
                    }
                });
            });
        }

        const filteredComments = comments?.items?.filter(
            (c) =>
                c && !c._deleted && c?.visibility === CommentVisibility.EVERYONE
        );

        console.log(filteredComments);

        if (filteredComments && filteredComments.length > 0) {
            if (row.length !== commentsOffsetCount) {
                _.range(commentsOffsetCount - row.length).forEach(() => {
                    row.push("");
                });
            }
            filteredComments?.forEach((comment) => {
                Object.keys(commentFields).forEach((key) => {
                    if (key === "author") {
                        row.push(
                            comment?.author?.displayName || commentFields[key]
                        );
                    } else {
                        row.push(comment?.body || commentFields.body);
                    }
                });
            });
        }

        rows.push(row);
    });
    return await writeToString(rows);
}

export default async function generateReportBasic(
    userId: string,
    role: Role | "ALL",
    tenantId: string,
    startDate: Date | null = null,
    endDate: Date | null = null
) {
    debugger;
    if (endDate && !isDateValid(endDate)) {
        console.log("end date is not valid");
        return;
    }
    if (startDate && !isDateValid(startDate)) {
        console.log("start date is not valid");
        return;
    }
    const actualEndDate = endDate ? new Date(endDate) : null;
    const actualStartDate = startDate ? new Date(startDate) : null;
    if (actualStartDate) {
        actualStartDate.setUTCHours(0, 0, 0, 0);
    }
    if (actualEndDate) {
        actualEndDate.setDate(actualEndDate.getDate() + 1);
        actualEndDate.setUTCHours(0, 0, 0, 0);
    }
    console.log("get tasks", actualStartDate, actualEndDate);
    if (
        actualStartDate &&
        actualEndDate &&
        !isStartDateBeforeEndDate(actualStartDate, actualEndDate)
    ) {
        console.log("start date is not before end date");
        return;
    }
    const assignments = await DataStore.query(models.TaskAssignee);
    if (role !== "ALL") {
        const filteredAssignments = assignments.filter(
            (assignment) =>
                assignment.task &&
                assignment.role === role &&
                assignment.assignee &&
                assignment.assignee.id === userId &&
                assignment.task
        );
        const taskIds = filteredAssignments.map(
            (assignment) => assignment.task.id
        );
        if (taskIds.length === 0) {
            return generateCSVDataStore([]);
        } else {
            const deliverables = await DataStore.query(models.Deliverable);
            const commentsAll = await DataStore.query(models.Comment, (c) =>
                c.visibility("eq", commentVisibility.everyone)
            );
            const tasks = await DataStore.query(models.Task, (task) =>
                task
                    .or((task) =>
                        task
                            .createdAt(
                                "gt",
                                actualStartDate?.toISOString() || ""
                            )
                            .createdAt("lt", actualEndDate?.toISOString() || "")
                    )
                    .or((task) =>
                        taskIds.reduce((task, id) => task.id("eq", id), task)
                    )
            );
            const finalTasks = await Promise.all(
                tasks.map(async (t) => {
                    const isRiderUsingOwnVehicleBool =
                        !!t.isRiderUsingOwnVehicle;
                    const isRiderUsingOwnVehicle = isRiderUsingOwnVehicleBool
                        ? "TRUE"
                        : "FALSE";

                    const comments = commentsAll.filter(
                        (c) => c.parentId === t.id
                    );
                    const items = deliverables.filter(
                        (d) => d.task && d.task.id === t.id
                    );
                    const assignees = assignments.filter(
                        (assignment) =>
                            assignment.task && assignment.task.id === t.id
                    );
                    return {
                        ...t,
                        comments,
                        items,
                        assignees,
                        isRiderUsingOwnVehicle,
                    };
                })
            );
            return generateCSVDataStore(finalTasks);
        }
    } else if (role === "ALL") {
        const tasks = await getTasksByTenantId(tenantId);
        return generateCSV(tasks);
    }
}

// callback code that may be useful
/*let count = 0;
    finalTasks = await Promise.all(
        finalTasks.map((t) =>
            new Promise((resolve, reject) => {
                const comments = commentsAll.filter((c) => c.parentId === t.id);
                const items = deliverables.filter(
                    (d) => d.task && d.task.id === t.id
                );
                const assignees = assignments.filter(
                    (assignment) =>
                        assignment.task && assignment.task.id === t.id
                );
                resolve({ ...t, comments, items, assignees });
            })
                .then((result) => {
                    count++;
                    if (progressCallback) {
                        progressCallback((count * 100) / finalTasks.length);
                    }
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                })
        )
    );
    */
