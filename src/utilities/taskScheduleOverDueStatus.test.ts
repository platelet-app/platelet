import * as models from "../models";
import taskScheduleOverDueStatus from "./taskScheduleOverDueStatus";

describe("taskScheduleOverDueStatus", () => {
    it("should return false if [models.TimeRelation.ANYTIME, models.TimeRelation.AFTER].includes(schedule?.relation as models.TimeRelation)", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
        });
        const result = taskScheduleOverDueStatus(schedule);
        expect(result).toEqual(false);
        const schedule2 = new models.Schedule({
            relation: models.TimeRelation.AFTER,
        });
        const result2 = taskScheduleOverDueStatus(schedule2);
        expect(result2).toEqual(false);
    });

    it("should return false if !schedule", () => {
        const schedule = null;
        const result = taskScheduleOverDueStatus(schedule);
        expect(result).toEqual(false);
    });

    it("should return true if overdue", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.BEFORE,
            timePrimary: "2022-01-01T10:00:00.000Z",
        });
        const result = taskScheduleOverDueStatus(schedule);
        expect(result).toEqual(true);
    });
    it("should return true if overdue and between", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.BETWEEN,
            timePrimary: "2022-01-01T09:00:00.000Z",
            timeSecondary: "2022-01-01T10:00:00.000Z",
        });
        const result = taskScheduleOverDueStatus(schedule);
        expect(result).toEqual(true);
    });
    it("should return false if not overdue", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.BEFORE,
            timePrimary: "2199-01-01T10:00:00.000Z",
        });
        const result = taskScheduleOverDueStatus(schedule);
        expect(result).toEqual(false);
    });
});
