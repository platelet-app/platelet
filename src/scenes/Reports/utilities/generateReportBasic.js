import { DataStore } from "aws-amplify";
import _ from "lodash";
import moment from "moment";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";
import { writeToString } from "@fast-csv/format";

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

function generateHeader(fields, prefix = "") {
    let keys = Object.keys(fields);
    if (prefix) {
        return keys.map((k) => `${prefix}_${k}`);
    } else {
        return keys;
    }
}

function generateCountedHeader(count, fields, prefix) {
    return _.range(count)
        .map((i) => {
            return Object.keys(fields).map((k) => `${prefix}_${i}_${k}`);
        })
        .flat();
}

async function generateCSV(data) {
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
        let row = [];
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
                row.push(pickUpLocation[key] || locationFields[key]);
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        if (dropOffLocation)
            Object.keys(locationFields).forEach((key) => {
                row.push(dropOffLocation[key] || locationFields[key]);
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        if (assignees && assignees.length > 0) {
            assignees.forEach((item) => {
                Object.keys(assigneeFields).forEach((key) => {
                    if (["displayName", "name"].includes(key)) {
                        row.push(item.assignee[key] || assigneeFields[key]);
                    } else {
                        row.push(item[key] || assigneeFields[key]);
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
            items.forEach((item) => {
                Object.keys(itemFields).forEach((key) => {
                    if (key === "label") {
                        row.push(item.deliverableType.label || itemFields[key]);
                    } else {
                        row.push(item[key] || itemFields[key]);
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
            comments.forEach((comment) => {
                Object.keys(commentFields).forEach((key) => {
                    if (key === "author") {
                        row.push(
                            comment[key].displayName || commentFields[key]
                        );
                    } else {
                        row.push(comment[key] || commentFields[key]);
                    }
                });
            });
        }

        rows.push(row);
    });
    return await writeToString(rows);
}

export default async function generateReportBasic(userId, role, days) {
    const timeStamp = moment
        .utc()
        .subtract(days.toString(), "days")
        .toISOString();
    let finalTasks = [];
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
            finalTasks = [];
        } else {
            finalTasks = await DataStore.query(models.Task, (task) =>
                task
                    .or((task) =>
                        task
                            .createdAt("eq", undefined)
                            .createdAt("gt", timeStamp)
                    )
                    .or((task) =>
                        taskIds.reduce((task, id) => task.id("eq", id), task)
                    )
            );
        }
    } else if (role === "ALL") {
        finalTasks = await DataStore.query(models.Task, (task) =>
            task.or((task) =>
                task.createdAt("eq", undefined).createdAt("gt", timeStamp)
            )
        );
    }
    const deliverables = await DataStore.query(models.Deliverable);
    const commentsAll = await DataStore.query(models.Comment, (c) =>
        c.visibility("eq", commentVisibility.everyone)
    );
    finalTasks = await Promise.all(
        finalTasks.map(async (t) => {
            const isRiderUsingOwnVehicleBool = !!t.isRiderUsingOwnVehicle;
            const isRiderUsingOwnVehicle = isRiderUsingOwnVehicleBool
                ? "TRUE"
                : "FALSE";

            const comments = commentsAll.filter((c) => c.parentId === t.id);
            const items = deliverables.filter(
                (d) => d.task && d.task.id === t.id
            );
            const assignees = assignments.filter(
                (assignment) => assignment.task && assignment.task.id === t.id
            );
            return { ...t, comments, items, assignees, isRiderUsingOwnVehicle };
        })
    );
    return generateCSV(finalTasks);
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
