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
            date: "2021-01-01",
            time: "12:59:58.987Z",
        });
        const result = taskScheduleDueStatus(schedule, 1);
        expect(result).toEqual(true);
    });
});
