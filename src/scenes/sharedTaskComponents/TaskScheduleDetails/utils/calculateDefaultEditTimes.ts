import moment from "moment";
import * as models from "../../../../models";

const calculateDefaultEditTimes = (
    schedule: models.Schedule | null,
    hideDate: boolean
) => {
    let defaultTime = "10:00";
    let defaultSecondTime = "10:30";
    if (!schedule?.timePrimary) {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        if (currentMinute >= 30) {
            const paddedHour = (currentHour + 1).toString().padStart(2, "0");
            defaultTime = `${paddedHour}:00`;
            defaultSecondTime = `${paddedHour}:30`;
        } else if (currentMinute >= 0) {
            const paddedHour = currentHour.toString().padStart(2, "0");
            const secondPaddedHour = new Date(new Date().getTime() + 60 * 60000)
                .getHours()
                .toString()
                .padStart(2, "0");
            defaultTime = `${paddedHour}:30`;
            defaultSecondTime = `${secondPaddedHour}:00`;
        }
    } else {
        const currentHour = new Date(schedule?.timePrimary).getHours();
        const currentMinute = new Date(schedule?.timePrimary).getMinutes();

        if (currentMinute >= 30) {
            const paddedHour = (currentHour + 1).toString().padStart(2, "0");
            defaultSecondTime = `${paddedHour}:00`;
        } else if (currentMinute >= 0) {
            let secondaryDate = new Date(
                new Date(schedule?.timePrimary).getTime() + 30 * 60000
            );
            const secondHour = new Date(secondaryDate).getHours();
            let secondPaddedHour = secondHour.toString().padStart(2, "0");
            defaultSecondTime = `${secondPaddedHour}:30`;
            if (secondaryDate.getMinutes() > 30) {
                secondPaddedHour = (secondHour + 1).toString().padStart(2, "0");
                defaultSecondTime = `${secondPaddedHour}:00`;
            }
        }
    }

    if (schedule) {
        const timePrimary = schedule?.timePrimary
            ? moment(schedule?.timePrimary).format("HH:mm")
            : defaultTime;
        const timeSecondary = schedule?.timeSecondary
            ? moment(schedule?.timeSecondary).format("HH:mm")
            : defaultSecondTime;
        return {
            timePrimary,
            timeSecondary,
            timeRelation:
                (schedule?.relation as models.TimeRelation | null) ??
                models.TimeRelation.ANYTIME,
            date: new Date(schedule?.timePrimary ?? ""),
        };
    } else {
        let date = new Date();
        if (hideDate) {
            date = new Date("2099-01-01");
        }
        return {
            timePrimary: defaultTime,
            timeSecondary: defaultSecondTime,
            timeRelation: models.TimeRelation.ANYTIME,
            date,
        };
    }
};

export default calculateDefaultEditTimes;
