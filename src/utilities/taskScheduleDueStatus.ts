import * as models from "../models";

const taskScheduleDueStatus = (
    schedule: models.Schedule | null,
    hours: number = 0,
    days: number = 0,
    // ANYTIME and AFTER schedules span a window rather than a point in time;
    // by default they count as due at the end of the window (23:59), which
    // suits deadline warnings. Pass useWindowStart to count them as due from
    // when they first become actionable instead.
    useWindowStart: boolean = false
) => {
    if (!schedule) {
        return false;
    }
    const now = new Date();
    let scheduleDate = new Date(schedule?.timePrimary ?? "");
    if (schedule?.timeSecondary) {
        scheduleDate = new Date(schedule?.timeSecondary ?? "");
    }
    if (
        [models.TimeRelation.ANYTIME, models.TimeRelation.AFTER].includes(
            schedule?.relation as models.TimeRelation
        )
    ) {
        if (useWindowStart) {
            if (schedule?.relation === models.TimeRelation.ANYTIME) {
                scheduleDate.setHours(0, 0, 0, 0);
            }
        } else {
            scheduleDate.setHours(23, 59, 59, 999);
        }
    }
    scheduleDate.setUTCHours(scheduleDate.getUTCHours() - hours);
    scheduleDate.setUTCDate(scheduleDate.getUTCDate() - days);
    if (scheduleDate < now) {
        return true;
    }
    return false;
};

export default taskScheduleDueStatus;
