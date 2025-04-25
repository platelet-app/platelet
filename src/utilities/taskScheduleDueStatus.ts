import * as models from "../models";

const taskScheduleDueStatus = (
    schedule: models.Schedule | null,
    hours: number = 0,
    days: number = 0
) => {
    if (!schedule) {
        return false;
    }
    const now = new Date();
    const scheduleDate = new Date(schedule?.timePrimary ?? "");
    if (
        [models.TimeRelation.ANYTIME, models.TimeRelation.AFTER].includes(
            schedule?.relation as models.TimeRelation
        )
    ) {
        scheduleDate.setHours(23);
        scheduleDate.setMinutes(59);
    }
    scheduleDate.setUTCHours(scheduleDate.getUTCHours() - hours);
    scheduleDate.setUTCDate(scheduleDate.getUTCDate() - days);
    if (scheduleDate < now) {
        return true;
    }
    return false;
};

export default taskScheduleDueStatus;
