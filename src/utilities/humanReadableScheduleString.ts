import moment from "moment";
import * as models from "../models";

const humanReadableScheduleString = (schedule: models.Schedule) => {
    let result = "";
    if (!schedule) return "";
    if (schedule.timePrimary) {
        const date = new Date(schedule.timePrimary).toISOString().split("T")[0];
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
        case models.TimeRelation.BETWEEN:
            result += " between";
            break;
        case models.TimeRelation.AT:
            result += " at";
            break;
    }
    if (
        schedule.timePrimary &&
        schedule.relation !== models.TimeRelation.ANYTIME
    ) {
        result += ` ${moment(schedule.timePrimary).format("HH:mm")}`;
    }
    if (
        schedule.timeSecondary &&
        schedule.timePrimary &&
        schedule.relation === models.TimeRelation.BETWEEN
    ) {
        if (
            new Date(schedule.timeSecondary).getDate() !==
            new Date(schedule.timePrimary).getDate()
        ) {
            result += ` ${moment(schedule.timeSecondary).format("L")} `;
        } else {
            result += ` and ${moment(schedule.timeSecondary).format("HH:mm")}`;
        }
    }
    return result;
};

export default humanReadableScheduleString;
