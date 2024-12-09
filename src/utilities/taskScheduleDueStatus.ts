import * as models from "../models";

const taskScheduleDueStatus = (
    schedule: models.Schedule | null,
    hours: number = 1
) => {
    debugger;
    if (
        [models.TimeRelation.ANYTIME, models.TimeRelation.AFTER].includes(
            schedule?.relation as models.TimeRelation
        )
    ) {
        return false;
    }
    if (!schedule) {
        return false;
    }
    const now = new Date();
    const scheduleDate = new Date(schedule?.date ?? "");
    scheduleDate.setUTCHours(parseInt(schedule.time?.split(":")[0] ?? "0"));
    scheduleDate.setUTCMinutes(parseInt(schedule.time?.split(":")[1] ?? "0"));
    scheduleDate.setUTCHours(scheduleDate.getUTCHours() - hours);

    if (scheduleDate < now) {
        return true;
    }
    return false;
};

export default taskScheduleDueStatus;
