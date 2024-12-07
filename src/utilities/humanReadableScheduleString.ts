import moment from "moment";
import * as models from "../models";

const humanReadableScheduleString = (schedule: models.Schedule) => {
    let result = "";
    if (!schedule) return "";
    if (schedule.date) {
        const date = new Date(schedule.date).toISOString().split("T")[0];
        result += moment(date).calendar(null, {
            lastDay: "[Yesterday]",
            sameDay: "[Today]",
            nextDay: "[Tomorrow]",
            lastWeek: "[last] dddd",
            nextWeek: "dddd",
            sameElse: "L",
        });
    }
    switch (schedule.relation) {
        case models.TimeRelation.ANYTIME:
            result += " at any time";
            break;
        case models.TimeRelation.BEFORE:
            result += " before";
            break;
        case models.TimeRelation.AFTER:
            result += " after";
            break;
        case models.TimeRelation.AT:
            result += " at";
            break;
    }
    if (schedule.time && schedule.relation !== models.TimeRelation.ANYTIME) {
        const time = new Date();
        time.setHours(parseInt(schedule.time.split(":")[0]));
        time.setMinutes(parseInt(schedule.time.split(":")[1]));
        result += ` ${moment(time).format("HH:mm")}`;
    }
    return result;
};

export default humanReadableScheduleString;
