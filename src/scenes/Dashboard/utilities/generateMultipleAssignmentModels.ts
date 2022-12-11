import { DataStore } from "aws-amplify";
import _ from "lodash";
import * as models from "../../../models";
import determineTaskStatus from "../../../utilities/determineTaskStatus";

async function generateMultipleAssignmentModels(
    selectedItems: models.Task[],
    coordinators: models.User[],
    riders: models.User[],
    allAssignees: models.TaskAssignee[],
    tenantId: string
) {
    if (
        !selectedItems ||
        _.isEmpty(selectedItems) ||
        (_.isEmpty(coordinators) && _.isEmpty(riders))
    ) {
        return;
    }
    if (!tenantId) throw new Error("Tenant ID is required");
    const ridersMapped = Object.values(selectedItems).map((task) => {
        return Object.values(riders).map((assignee) => {
            return new models.TaskAssignee({
                assignee,
                task,
                role: models.Role.RIDER,
                tenantId,
            });
        });
    });
    const coordinatorsMapped = Object.values(selectedItems).map((task) => {
        return Object.values(coordinators).map(
            (assignee) =>
                new models.TaskAssignee({
                    assignee,
                    task,
                    role: models.Role.COORDINATOR,
                    tenantId,
                })
        );
    });
    const result = [...ridersMapped, ...coordinatorsMapped].flat(2);
    const filtered = result.filter((assignment) => {
        return !allAssignees.some((assignee) => {
            return (
                assignment.task.id === assignee.task.id &&
                assignment.assignee.id === assignee.assignee.id &&
                assignment.role === assignee.role
            );
        });
    });
    let newTasks: models.Task[] = [];
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
