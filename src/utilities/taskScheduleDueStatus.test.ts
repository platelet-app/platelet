import * as models from "../models";
import taskScheduleDueStatus from "./taskScheduleDueStatus";

describe("taskScheduleDueStatus", () => {
    const isoDate = "2021-01-01T12:00:58.987Z";
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(isoDate));
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });
    test("should return false if [models.TimeRelation.ANYTIME, models.TimeRelation.AFTER].includes(schedule?.relation as models.TimeRelation)", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
        });
        const result = taskScheduleDueStatus(schedule);
        expect(result).toEqual(false);
        const schedule2 = new models.Schedule({
            relation: models.TimeRelation.AFTER,
        });
        const result2 = taskScheduleDueStatus(schedule2);
        expect(result2).toEqual(false);
    });
    test("should return false if !schedule", () => {
        const schedule = null;
        const result = taskScheduleDueStatus(schedule);
        expect(result).toEqual(false);
    });
    test("return true if due in the next hour", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.BEFORE,
            timePrimary: "2021-01-01T12:59:58.987Z",
        });
        const result = taskScheduleDueStatus(schedule, 1);
        expect(result).toEqual(true);
    });
    test("return true if due in the next hour with between", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.BETWEEN,
            timePrimary: "2021-01-01T09:59:58.987Z",
            timeSecondary: "2021-01-01T12:59:58.987Z",
        });
        const result = taskScheduleDueStatus(schedule, 1);
        expect(result).toEqual(true);
    });
    test("anytime tomorrow is due within one day when using the window start", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
            timePrimary: "2021-01-02T12:00:00.000Z",
        });
        expect(taskScheduleDueStatus(schedule, 0, 1, true)).toEqual(true);
        // default end of window behaviour still counts it as not due
        expect(taskScheduleDueStatus(schedule, 0, 1)).toEqual(false);
    });
    test("anytime the day after tomorrow is not due within one day when using the window start", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
            timePrimary: "2021-01-03T12:00:00.000Z",
        });
        expect(taskScheduleDueStatus(schedule, 0, 1, true)).toEqual(false);
    });
    test("after a time tomorrow uses timePrimary when using the window start", () => {
        const dueSchedule = new models.Schedule({
            relation: models.TimeRelation.AFTER,
            timePrimary: "2021-01-02T09:00:00.000Z",
        });
        expect(taskScheduleDueStatus(dueSchedule, 0, 1, true)).toEqual(true);
        const notDueSchedule = new models.Schedule({
            relation: models.TimeRelation.AFTER,
            timePrimary: "2021-01-02T14:00:00.000Z",
        });
        expect(taskScheduleDueStatus(notDueSchedule, 0, 1, true)).toEqual(
            false
        );
    });
});
