import { DataStore } from "aws-amplify";
import _ from "lodash";
import moment from "moment";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";

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

const requesterContactFields = {
    name: "",
    telephoneNumber: "",
};

const commentFields = {
    body: "",
    author: "",
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

function generateCommentsHeader(count) {
    return _.range(count)
        .map((i) => {
            return Object.keys(commentFields)
                .map((k) => `comment_${i}_${k}`)
                .join(",");
        })
        .join(",");
}

async function generateCSV(data) {
    let csv = "";
    debugger;

    const commentsCount = data.reduce((acc, task) => {
        if (task.comments && task.comments.length > acc)
            return task.comments.length;
        else return acc;
    }, 0);

    let keys = Object.keys(
        _.omit(
            data[0],
            "pickUpLocation",
            "dropOffLocation",
            "requesterContact",
            "createdBy",
            "_version",
            "_lastChangedAt",
            "_deleted"
        )
    );
    csv += keys.join(",") + ",";
    csv += generateHeader(locationFields, "pickUpLocation") + ",";
    csv += generateHeader(locationFields, "dropOffLocation") + ",";
    csv += generateHeader(requesterContactFields, "requesterContact") + ",";
    csv += generateCommentsHeader(commentsCount) + ",";
    csv += "\n";
    data.forEach((item) => {
        let row = [];
        const {
            pickUpLocation,
            dropOffLocation,
            requesterContact,
            comments,
            createdBy,
            ...rest
        } = item;
        keys.forEach((key) => {
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
            return { ...t, comments: comments };
        })
    );

    return generateCSV(finalTasks, mostComments);
}
