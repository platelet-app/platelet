import * as models from "../models";

const taskScheduleOverDueStatus = (schedule?: models.Schedule | null) => {
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
    const scheduleDate = new Date(schedule?.timePrimary ?? "");
    if (scheduleDate < now) {
        return true;
    }
    return false;
};

export default taskScheduleOverDueStatus;
