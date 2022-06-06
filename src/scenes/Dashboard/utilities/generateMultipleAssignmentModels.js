import { DataStore } from "aws-amplify";
import _ from "lodash";
import { userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import { determineTaskStatus } from "../../../utilities";

async function generateMultipleAssignmentModels(
    selectedItems,
    coordinators,
    riders,
    allAssignees
) {
    if (
        !selectedItems ||
        _.isEmpty(selectedItems) ||
        (_.isEmpty(coordinators) && _.isEmpty(riders))
    ) {
        return;
    }
    const ridersMapped = Object.values(selectedItems).map((task) => {
        return Object.values(riders).map((assignee) => {
            return new models.TaskAssignee({
                assignee,
                task,
                role: userRoles.rider,
            });
        });
    });
    const coordinatorsMapped = Object.values(selectedItems).map((task) => {
        return Object.values(coordinators).map(
            (assignee) =>
                new models.TaskAssignee({
                    assignee,
                    task,
                    role: userRoles.coordinator,
                })
        );
    });
    const result = [...ridersMapped, ...coordinatorsMapped].flat(2);
    const filtered = result.filter((assignment) => {
        return !allAssignees.items.some((assignee) => {
            return (
                assignment.task.id === assignee.task.id &&
                assignment.assignee.id === assignee.assignee.id &&
                assignment.role === assignee.role
            );
        });
    });
    let newTasks = [];
    if (ridersMapped.flat().length > 0) {
        const filteredTasks = await DataStore.query(models.Task, (task) =>
            task.or((task) =>
                Object.values(selectedItems)
                    .map((t) => t.id)
                    .reduce((task, id) => task.id("eq", id), task)
            )
        );
        newTasks = await Promise.all(
            filteredTasks.map(async (task) => {
                const status = await determineTaskStatus(
                    task,
                    ridersMapped.flat()
                );
                let riderResponsibility = task.riderResponsibility;
                for (const rider of ridersMapped
                    .flat()
                    .map((assignment) => assignment.assignee)) {
                    if (rider.riderResponsibility) {
                        riderResponsibility = rider.riderResponsibility;
                    }
                }
                return models.Task.copyOf(task, (updated) => {
                    updated.status = status;
                    updated.riderResponsibility = riderResponsibility;
                });
            })
        );
    }
    return [...filtered, ...newTasks];
}

export default generateMultipleAssignmentModels;
