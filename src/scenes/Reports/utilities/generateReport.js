import { DataStore } from "aws-amplify";
import _ from "lodash";
import moment from "moment";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";
import { writeToString } from "@fast-csv/format";

const taskFields = {
    id: "",
    createdAt: "",
    timeOfCall: "",
    priority: "",
    status: "",
    riderResponsibility: "",
    timePickedUp: "",
    timeDroppedOff: "",
    timeRiderHome: "",
};

const locationFields = {
    ward: "",
    line1: "",
    line2: "",
    line3: "",
    town: "",
    county: "",
    state: "",
    country: "",
    postcode: "",
};

const itemFields = {
    id: "",
    createdAt: "",
    label: "",
    count: "",
    unit: "",
};

const requesterContactFields = {
    name: "",
    telephoneNumber: "",
};

const assigneeFields = {
    id: "",
    createdAt: "",
    displayName: "",
    name: "",
    role: "",
};

const commentFields = {
    id: "",
    createdAt: "",
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

async function generateCSVAltForFreewheelersSheet(data) {
    const rows = [];
    data.sort((a, b) => {
        return new Date(a.timeOfCall) - new Date(b.timeOfCall);
    });
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

        row.push(moment(item.timeOfCall).format("DD-MM-YYYY"));
        row.push(moment(item.timeOfCall).format("HH:mm"));
        row.push(requesterContact.name);
        row.push(requesterContact.telephoneNumber);
        let prior = "";
        if (["CANCELLED", "REJECTED"].includes(item.status)) {
            prior = item.status === "REJECTED" ? "Rejected" : "Cancelled";
        } else if (item.priority === "MEDIUM") {
            prior = "Urgent";
        } else if (item.priority === "LOW") {
            prior = "Non-urgent";
        }
        row.push(prior);
        let itemsString = "";
        items.forEach((i) => {
            if (i.deliverableType) {
                if (items.length === 1) {
                    itemsString = `${i.deliverableType.label}`;
                } else {
                    itemsString += `${i.deliverableType.label}, `;
                }
            }
        });
        row.push(itemsString);
        if (pickUpLocation?.listed === 0 || dropOffLocation?.listed === 0) {
            row.push("maybe patient?");
        } else {
            row.push("");
        }
        row.push(
            pickUpLocation?.name ? pickUpLocation.name : pickUpLocation?.line1
        );
        row.push(
            dropOffLocation?.name
                ? dropOffLocation.name
                : dropOffLocation?.line1
        );
        row.push("");
        row.push("");
        row.push(item.riderResponsibility);
        let assignee = "";
        assignees.forEach((a) => {
            if (a.role === "RIDER") {
                assignee = a.assignee.displayName;
            }
        });
        row.push(assignee);
        row.push(
            item.timePickedUp ? moment(item.timePickedUp).format("HH:mm") : ""
        );
        row.push(
            item.timeDroppedOff
                ? moment(item.timeDroppedOff).format("HH:mm")
                : ""
        );
        row.push(
            item.timeRiderHome ? moment(item.timeRiderHome).format("HH:mm") : ""
        );
        let commentsString = "";
        comments.forEach((c) => {
            commentsString += `${c.body}, `;
        });
        row.push(commentsString);
        rows.push(row);
    });
    return await writeToString(rows);
}

async function generateCSV(data) {
    const rows = [];
    const headers = [];
    const commentsCount = data.reduce((acc, task) => {
        if (task.comments && task.comments.length > acc)
            return task.comments.length;
        else return acc;
    }, 0);
    const itemOffsetCount =
        [
            ...Object.keys(taskFields),
            ...Object.keys(locationFields),
            ...Object.keys(locationFields),
            ...Object.keys(requesterContactFields),
        ].length +
        commentsCount * Object.keys(commentFields).length;

    const itemsCount = data.reduce((acc, task) => {
        if (task.items && task.items.length > acc) return task.items.length;
        else return acc;
    }, 0);

    const assigneeOffsetCount =
        itemOffsetCount + itemsCount * Object.keys(itemFields).length;

    const assigneesCount = data.reduce((acc, task) => {
        if (task.assignees && task.assignees.length > acc)
            return task.assignees.length;
        else return acc;
    }, 0);

    headers.push(generateHeader(taskFields));
    headers.push(generateHeader(locationFields, "pickUpLocation"));
    headers.push(generateHeader(locationFields, "dropOffLocation"));
    headers.push(generateHeader(requesterContactFields, "requesterContact"));
    if (commentsCount > 0) {
        headers.push(
            generateCountedHeader(commentsCount, commentFields, "comment")
        );
    }
    if (itemsCount > 0) {
        headers.push(generateCountedHeader(itemsCount, itemFields, "item"));
    }
    if (assigneesCount > 0) {
        headers.push(
            generateCountedHeader(assigneesCount, assigneeFields, "assignee")
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
        if (requesterContact)
            Object.keys(requesterContactFields).forEach((key) => {
                row.push(requesterContact[key]);
            });
        else
            Object.values(requesterContactFields).forEach((value) => {
                row.push(value);
            });
        if (comments && comments.length > 0) {
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

        if (assignees && assignees.length > 0) {
            if (row.length !== assigneeOffsetCount) {
                _.range(assigneeOffsetCount - row.length).forEach(() => {
                    row.push("");
                });
            }
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

        rows.push(row);
    });
    return await writeToString(rows);
}

export default async function generateReport(userId, role, days) {
    const timeStamp = moment
        .utc()
        .subtract(days.toString(), "days")
        .toISOString();
    let finalTasks = [];
    const assignments = await DataStore.query(models.TaskAssignee);
    debugger;
    if (role !== "ALL") {
        const filteredAssignments = assignments.filter(
            (assignment) =>
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
            const comments = commentsAll.filter((c) => c.parentId === t.id);
            const items = deliverables.filter(
                (d) => d.task && d.task.id === t.id
            );
            const assignees = assignments.filter(
                (assignment) => assignment.task && assignment.task.id === t.id
            );
            return { ...t, comments, items, assignees };
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
