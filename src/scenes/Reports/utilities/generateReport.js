import { DataStore } from "aws-amplify";
import _ from "lodash";
import moment from "moment";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";

const taskFields = {
    id: "",
    riderResponsibility: "",
    timePickedUp: "",
    timeDroppedOff: "",
    timeRiderHome: "",
    createdAt: "",
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
    label: "",
    count: "",
    unit: "",
    createdAt: "",
};

const requesterContactFields = {
    name: "",
    telephoneNumber: "",
};

const commentFields = {
    author: "",
    body: "",
    createdAt: "",
};

function generateHeader(fields, prefix = "") {
    let keys = Object.keys(fields);
    if (prefix) {
        return keys.map((k) => `${prefix}_${k}`).join(",");
    } else {
        return keys.join(",");
    }
}

function generateCountedHeader(count, fields, prefix) {
    return _.range(count)
        .map((i) => {
            return Object.keys(fields)
                .map((k) => `${prefix}_${i}_${k}`)
                .join(",");
        })
        .join(",");
}

//    items
//    "bike allocated" (referred to as riderResponsibility in the schema, but we could start using "Rider role" on the front end as a better name?)
//    rider name
//    handover group (not currently recorded, but may be put in to a comment or attached to location, I'll check with the charity)
//    time collected
//    time delivered
//    time rider home

async function generateCSV(data) {
    let csv = "";
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
        commentsCount * 3;

    const itemsCount = data.reduce((acc, task) => {
        if (task.items && task.items.length > acc) return task.items.length;
        else return acc;
    }, 0);

    csv += generateHeader(taskFields) + ",";
    csv += generateHeader(locationFields, "pickUpLocation") + ",";
    csv += generateHeader(locationFields, "dropOffLocation") + ",";
    csv += generateHeader(requesterContactFields, "requesterContact") + ",";
    csv += generateCountedHeader(commentsCount, commentFields, "comment") + ",";
    csv += generateCountedHeader(itemsCount, itemFields, "item") + ",";
    csv += "\n";
    data.forEach((item) => {
        let row = [];
        const {
            pickUpLocation,
            dropOffLocation,
            requesterContact,
            comments,
            items,
            createdBy,
            ...rest
        } = item;
        Object.keys(taskFields).forEach((key) => {
            row.push(rest[key]);
        });
        if (pickUpLocation && pickUpLocation.listed === 1)
            Object.keys(locationFields).forEach((key) => {
                row.push(pickUpLocation[key] || locationFields[key]);
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(pickUpLocation ? "Unlisted" : value);
            });

        if (dropOffLocation && dropOffLocation.listed === 1)
            Object.keys(locationFields).forEach((key) => {
                row.push(dropOffLocation[key] || locationFields[key]);
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(dropOffLocation ? "Unlisted" : value);
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

        csv += row.join(",") + "\n";
    });
    return csv;
}

export default async function generateReport(userId, role, days) {
    const timeStamp = moment.utc().subtract(days, "days").toISOString();
    let finalTasks = [];
    if (role !== "ALL") {
        const assignments = await DataStore.query(models.TaskAssignee);
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
        finalTasks = await DataStore.query(models.Task, (task) =>
            task
                .or((task) =>
                    task.createdAt("eq", undefined).createdAt("gt", timeStamp)
                )
                .or((task) =>
                    taskIds.reduce((task, id) => task.id("eq", id), task)
                )
        );
    } else if (role === "ALL") {
        finalTasks = await DataStore.query(models.Task, (task) =>
            task.or((task) =>
                task.createdAt("eq", undefined).createdAt("gt", timeStamp)
            )
        );
    }
    let mostComments = 0;
    finalTasks = await Promise.all(
        finalTasks.map(async (t) => {
            const comments = await DataStore.query(models.Comment, (c) =>
                c
                    .parentId("eq", t.id)
                    .visibility("eq", commentVisibility.everyone)
            );
            const deliverables = await DataStore.query(models.Deliverable);
            const items = deliverables.filter(
                (d) => d.task && d.task.id === t.id
            );
            return { ...t, comments, items };
        })
    );

    return generateCSV(finalTasks, mostComments);
}
