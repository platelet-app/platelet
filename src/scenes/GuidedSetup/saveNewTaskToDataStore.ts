import { userRoles } from "../../apiConsts";
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
import taskScheduleDueStatus from "../../utilities/taskScheduleDueStatus";
import { calculateBetweenIsOneDay } from "../../utilities/calculateBetweenIsOneDay";

export const convertScheduleToTaskData = (
    schedule: Schedule | null | undefined
): models.Schedule | null => {
    if (!schedule) return null;
    let scheduledDate: Date | null = null;
    let scheduledDateSecond: Date | null = null;
    if (schedule?.selectionState === ScheduledDatePickerOption.TODAY) {
        scheduledDate = new Date();
    } else if (
        schedule?.selectionState === ScheduledDatePickerOption.TOMORROW
    ) {
        scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 1);
    } else if (schedule?.customDate) {
        scheduledDate = schedule?.customDate;
    }
    const hour = schedule?.time?.split(":")[0];
    const minute = schedule?.time?.split(":")[1];
    if (scheduledDate) {
        scheduledDate.setHours(parseInt(hour ?? "0"));
        scheduledDate.setMinutes(parseInt(minute ?? "0"));
    }
    const date = scheduledDate?.toISOString() ?? null;
    let dateSecond: string | null = null;
    if (
        schedule.timeRelation === models.TimeRelation.BETWEEN &&
        schedule.timeSecond
    ) {
        const hourSecond = schedule?.timeSecond?.split(":")[0];
        const minuteSecond = schedule?.timeSecond?.split(":")[1];
        if (scheduledDate) {
            scheduledDateSecond = new Date(scheduledDate);
        } else {
            scheduledDateSecond = new Date();
        }
        if (scheduledDateSecond) {
            scheduledDateSecond.setHours(parseInt(hourSecond ?? "0"));
            scheduledDateSecond.setMinutes(parseInt(minuteSecond ?? "0"));
        }
        if (calculateBetweenIsOneDay(schedule.time, schedule.timeSecond)) {
            scheduledDateSecond.setDate(scheduledDateSecond.getDate() + 1);
        }
        dateSecond = scheduledDateSecond?.toISOString() ?? null;
    }
    return new models.Schedule({
        timePrimary: date,
        timeSecondary: dateSecond,
        relation: schedule?.timeRelation ?? null,
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
