import moment from "moment";
import * as models from "../models";

const getDayString = (date: Date | string) => {
    return moment(date).calendar(null, {
        lastDay: "[Yesterday]",
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        lastWeek: "[last] dddd",
        nextWeek: "dddd",
        sameElse: "L",
    });
};

const humanReadableScheduleString = (
    schedule: models.Schedule | null,
    shortened = false
) => {
    if (!schedule) return "";
    let result = "";
    if (schedule.timePrimary) {
        const date = new Date(schedule.timePrimary);
        if (!shortened) {
            const dateString = date.toISOString().split("T")[0];
            result += getDayString(dateString);
        }
    }
    switch (schedule.relation) {
        case models.TimeRelation.ANYTIME:
            if (shortened) {
                result += "At any time";
            } else {
                result += " at any time";
            }
            break;
        case models.TimeRelation.BEFORE:
            if (shortened) {
                result += "Before";
            } else {
                result += " before";
            }
            break;
        case models.TimeRelation.AFTER:
            if (shortened) {
                result += "After";
            } else {
                result += " after";
            }
            break;
        case models.TimeRelation.BETWEEN:
            if (shortened) {
                result += "Between";
            } else {
                result += " between";
            }
            break;
        case models.TimeRelation.AT:
            if (shortened) {
                result += "At";
            } else {
                result += " at";
            }
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
            let timeSecondaryDayString = getDayString(schedule.timeSecondary);
            if (
                ["Today", "Tomorrow", "Yesterday"].includes(
                    timeSecondaryDayString
                )
            ) {
                timeSecondaryDayString = timeSecondaryDayString.toLowerCase();
            }

            const secondaryTimeString = moment(schedule.timeSecondary).format(
                "HH:mm"
            );
            result += ` and ${timeSecondaryDayString} at ${secondaryTimeString}`;
        } else {
            result += ` and ${moment(schedule.timeSecondary).format("HH:mm")}`;
        }
    }
    return result;
};

export default humanReadableScheduleString;
