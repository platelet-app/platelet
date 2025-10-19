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
    let scheduleDate = new Date(schedule?.timePrimary ?? "");
    if (schedule?.timeSecondary) {
        scheduleDate = new Date(schedule?.timeSecondary ?? "");
    }
    if (scheduleDate < now) {
        return true;
    }
    return false;
};

export default taskScheduleOverDueStatus;
