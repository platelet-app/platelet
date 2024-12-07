import { tasksStatus, userRoles } from "../../apiConsts";
import store from "../../redux/Store";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
import { convertListDataToObject } from "../../utilities";
import _ from "lodash";
import * as assigneeActions from "../../redux/taskAssignees/taskAssigneesActions";
import {
    Schedule,
    ScheduledDatePickerOption,
} from "../sharedTaskComponents/PickUpAndDeliverSchedule";

const convertScheduleToTaskData = (
    schedule: Schedule | null | undefined
): models.Schedule | null => {
    if (!schedule) return null;
    let scheduledDate: Date | null = null;
    if (schedule?.selectionState === ScheduledDatePickerOption.TODAY) {
        scheduledDate = new Date();
    } else if (
        schedule?.selectionState === ScheduledDatePickerOption.TOMORROW
    ) {
        scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 1);
    } else if (
        schedule?.selectionState === ScheduledDatePickerOption.CUSTOM &&
        schedule?.customDate
    ) {
        scheduledDate = schedule?.customDate;
    }
    const date = scheduledDate?.toISOString().split("T")[0] ?? null;
    const timeDate = new Date();
    const hour = schedule?.time?.split(":")[0];
    const minute = schedule?.time?.split(":")[1];
    timeDate.setHours(parseInt(hour ?? "0"));
    timeDate.setMinutes(parseInt(minute ?? "0"));
    return new models.Schedule({
        date,
        relation: schedule?.timeRelation ?? null,
        time: schedule?.time ? timeDate.toISOString().split("T")[1] : null,
    });
};

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
    let { locations, deliverables, comment, establishmentLocation, ...rest } =
        data;
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
    const pickUpSchedule = convertScheduleToTaskData(data.schedule?.pickUp);
    const dropOffSchedule = convertScheduleToTaskData(data.schedule?.dropOff);
    const newTask = await DataStore.save(
        new models.Task({
            ...rest,
            pickUpLocation,
            pickUpSchedule,
            establishmentLocation,
            createdBy: author,
            dropOffLocation,
            dropOffSchedule,
            status: tasksStatus.new,
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
