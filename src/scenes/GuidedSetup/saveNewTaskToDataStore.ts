import { userRoles } from "../../apiConsts";
import store from "../../redux/Store";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
import { convertListDataToObject } from "../../utilities";
import _ from "lodash";
import * as assigneeActions from "../../redux/taskAssignees/taskAssigneesActions";
import { Schedule } from "../sharedTaskComponents/PickUpAndDeliverSchedule";
import taskScheduleDueStatus from "../../utilities/taskScheduleDueStatus";
import { convertScheduleToTaskData } from "../../utilities/convertScheduleToTaskData";

type Data = {
    locations: {
        pickUpLocation: models.Location | null;
        dropOffLocation: models.Location | null;
    };
    deliverables: {
        [key: string]: models.Deliverable;
    };
    comment: { body: string };
    establishmentLocation: models.Location | null;
    schedule: { pickUp: Schedule | null; dropOff: Schedule | null };
    requesterContact: models.AddressAndContactDetails;
    timeOfCall: string;
};

export async function saveNewTaskToDataStore(
    data: Data,
    tenantId: string,
    authorId: string,
    rider = null
) {
    if (!tenantId) {
        throw new Error("tenantId is required");
    }
    if (!authorId) {
        throw new Error("authorId is required");
    }
    const author = await DataStore.query(models.User, authorId);
    if (!author) {
        throw new Error("Author not found");
    }
    let {
        locations,
        deliverables,
        comment,
        establishmentLocation,
        schedule,
        ...rest
    } = data;
    // I don't know why id is defined on establishmentLocation but not on other locations
    if (establishmentLocation && establishmentLocation.listed === 0) {
        establishmentLocation = await DataStore.save(establishmentLocation);
    }
    let pickUpLocation = locations.pickUpLocation;
    if (locations.pickUpLocation && !locations.pickUpLocation.id) {
        pickUpLocation = await DataStore.save(
            new models.Location({ ...pickUpLocation, listed: 0, tenantId })
        );
    }
    let dropOffLocation = locations.dropOffLocation;
    if (locations.dropOffLocation && !locations.dropOffLocation.id) {
        dropOffLocation = await DataStore.save(
            new models.Location({ ...dropOffLocation, listed: 0, tenantId })
        );
    }
    // get the date today without time
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const pickUpSchedule = convertScheduleToTaskData(schedule?.pickUp);
    const dropOffSchedule = convertScheduleToTaskData(schedule?.dropOff);
    let taskDueStatus = true;
    if (pickUpSchedule) {
        taskDueStatus = taskScheduleDueStatus(pickUpSchedule, 0, 1);
    }
    const newTask = await DataStore.save(
        new models.Task({
            ...rest,
            pickUpLocation,
            pickUpSchedule,
            establishmentLocation,
            createdBy: author,
            dropOffLocation,
            dropOffSchedule,
            status: taskDueStatus
                ? models.TaskStatus.NEW
                : models.TaskStatus.FUTURE,
            tenantId,
            dateCreated: today.toISOString().split("T")[0],
        })
    );

    if (deliverables && !_.isEmpty(deliverables)) {
        DataStore.query(models.DeliverableType).then((deliverableTypes) => {
            const deliverableTypesObject: { [key: string]: any } =
                convertListDataToObject(deliverableTypes);
            for (const deliverable of Object.values(deliverables)) {
                const deliverableType = deliverableTypesObject[deliverable.id];
                DataStore.save(
                    new models.Deliverable({
                        deliverableType,
                        count: deliverable.count,
                        unit:
                            (deliverable.unit as models.DeliverableUnit) ||
                            null,
                        task: newTask,
                        tenantId,
                    })
                );
            }
        });
    }

    if (newTask.status !== models.TaskStatus.FUTURE) {
        DataStore.save(
            new models.TaskAssignee({
                task: newTask,
                assignee: author,
                role: userRoles.coordinator,
                tenantId,
            })
        ).then((assignment) => {
            store.dispatch(assigneeActions.addTaskAssignee(assignment));
        });
    }

    if (comment && comment.body) {
        DataStore.save(
            new models.Comment({
                ...comment,
                parentId: newTask.id,
                author,
                tenantId,
            })
        );
    }

    return newTask;
}
