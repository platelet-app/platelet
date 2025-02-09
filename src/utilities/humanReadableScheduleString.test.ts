import * as models from "../models";
import humanReadableScheduleString from "./humanReadableScheduleString";

describe("humanReadableScheduleString", () => {
    const isoDate = "2021-11-29T12:00:58.987Z";

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(isoDate));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it("should describe a schedule today with a primary time only", () => {
        const schedule = new models.Schedule({
            timePrimary: isoDate,
            relation: models.TimeRelation.AT,
        });
        const result = humanReadableScheduleString(schedule);
        expect(result).toEqual("Today at 12:00");
    });

    it("should describe a schedule tomorrow at anytime", () => {
        const date = new Date(isoDate);
        date.setDate(date.getDate() + 1);
        const timePrimary = date.toISOString();
        const schedule = new models.Schedule({
            timePrimary,
            relation: models.TimeRelation.ANYTIME,
        });
        const result = humanReadableScheduleString(schedule);
        expect(result).toEqual("Tomorrow at any time");
    });

    it("should describe a schedule on a date between two times", () => {
        const date = new Date(isoDate);
        date.setDate(date.getDate() + 10);
        const timePrimary = date.toISOString();
        const date2 = new Date(timePrimary);
        date2.setHours(date2.getHours() + 1);
        const timeSecondary = date2.toISOString();
        const schedule = new models.Schedule({
            timePrimary,
            timeSecondary,
            relation: models.TimeRelation.BETWEEN,
        });
        const result = humanReadableScheduleString(schedule);
        expect(result).toMatchInlineSnapshot(
            `"12/09/2021 between 12:00 and 13:00"`
        );
    });

    it("no schedule should return empty string", () => {
        const result = humanReadableScheduleString(null);
        expect(result).toEqual("");
    });
});
