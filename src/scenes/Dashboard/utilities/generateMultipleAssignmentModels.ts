import { DataStore } from "aws-amplify";
import _ from "lodash";
import * as models from "../../../models";
import determineTaskStatus from "../../../utilities/determineTaskStatus";

// any ts-ignore in this file is because datastore
// can't lazy load a related model until it has been saved
// instead it returns the id of the related model
// but this id isn't in the type

const filterExistingAssignments = async (
    assignments: models.TaskAssignee[]
): Promise<models.TaskAssignee[]> => {
    const results = await Promise.all(
        assignments.map(async (assignment) => {
            const task = await DataStore.query(
                models.Task,
                // @ts-ignore
                assignment.taskAssigneesId
            );
            const assignee = await DataStore.query(
                models.User,
                // @ts-ignore
                assignment.userAssignmentsId
            );
            if (task && assignee) {
                return await DataStore.query(models.TaskAssignee, (a) =>
                    a.and((a) => [
                        a.task.id.eq(task.id),
                        a.assignee.id.eq(assignee.id),
                        a.role.eq(assignment.role),
                    ])
                );
            }
        })
    );
    const flat = results.flat();
    const filtered = assignments.filter(
        (a) => !flat.map((a) => a?.id).includes(a.id)
    );
    return filtered;
};

async function generateMultipleAssignmentModels(
    selectedItems: models.Task[],
    coordinators: models.User[],
    riders: models.User[],
    tenantId: string
) {
    debugger;
    if (
        !selectedItems ||
        selectedItems.length === 0 ||
        (coordinators.length === 0 && riders.length === 0)
    ) {
        return;
    }
    if (!tenantId) throw new Error("Tenant ID is required");
    const tasksResolved = [];
    for (const task of selectedItems) {
        const taskResolved = await DataStore.query(models.Task, task.id);
        if (taskResolved) {
            tasksResolved.push(taskResolved);
        }
    }
    const ridersMapped = await Promise.all(
        tasksResolved.map(async (task) => {
            return riders.map((assignee) => {
                return new models.TaskAssignee({
                    assignee,
                    task,
                    role: models.Role.RIDER,
                    tenantId,
                });
            });
        })
    );
    const coordinatorsMapped = await Promise.all(
        tasksResolved.map(async (task) => {
            return coordinators.map(
                (assignee) =>
                    new models.TaskAssignee({
                        assignee,
                        task,
                        role: models.Role.COORDINATOR,
                        tenantId,
                    })
            );
        })
    );
    const result = [...ridersMapped, ...coordinatorsMapped].flat(2);
    const filtered = await filterExistingAssignments(result);
    let newTasks: models.Task[] = [];
    if (ridersMapped.flat().length > 0) {
        newTasks = await Promise.all(
            tasksResolved.map(async (task) => {
                const status = await determineTaskStatus(
                    task,
                    ridersMapped.flat()
                );
                let riderResponsibility = task.riderResponsibility;
                for (const assignment of ridersMapped.flat()) {
                    const rider = await DataStore.query(
                        models.User,
                        // @ts-ignore
                        assignment.userAssignmentsId
                    );
                    if (rider?.riderResponsibility) {
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
