import moment from "moment";
import * as models from "../models";

const humanReadableScheduleString = (schedule: models.Schedule) => {
    if (!schedule) return "";
    if (schedule.date) {
        const date = new Date(schedule.date);
        if (schedule.time) {
            date.setHours(parseInt(schedule.time.split(":")[0]));
            date.setMinutes(parseInt(schedule.time.split(":")[1]));
        }
        return moment(date).calendar();
    }
};

export default humanReadableScheduleString;
