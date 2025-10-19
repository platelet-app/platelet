import * as models from "../models";
import { Schedule } from "../scenes/sharedTaskComponents/PickUpAndDeliverSchedule";
import { calculateBetweenIsOneDay } from "../utilities/calculateBetweenIsOneDay";

export const convertScheduleToTaskData = (
    schedule: Schedule | null | undefined
): models.Schedule | null => {
    if (!schedule) return null;
    const scheduledDate = schedule.date || new Date("2099-01-01");
    let scheduledDateSecond = null;
    const hour = schedule?.timePrimary?.split(":")[0];
    const minute = schedule?.timePrimary?.split(":")[1];
    if (scheduledDate) {
        scheduledDate.setHours(parseInt(hour ?? "0"));
        scheduledDate.setMinutes(parseInt(minute ?? "0"));
    }
    const date = scheduledDate?.toISOString() ?? null;
    let dateSecond: string | null = null;
    if (
        schedule.timeRelation === models.TimeRelation.BETWEEN &&
        schedule.timeSecondary
    ) {
        const hourSecond = schedule?.timeSecondary?.split(":")[0];
        const minuteSecond = schedule?.timeSecondary?.split(":")[1];
        if (scheduledDate) {
            scheduledDateSecond = new Date(scheduledDate);
        } else {
            scheduledDateSecond = new Date();
        }
        if (scheduledDateSecond) {
            scheduledDateSecond.setHours(parseInt(hourSecond ?? "0"));
            scheduledDateSecond.setMinutes(parseInt(minuteSecond ?? "0"));
        }
        if (
            calculateBetweenIsOneDay(
                schedule.timePrimary,
                schedule.timeSecondary
            )
        ) {
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
