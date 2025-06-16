import * as models from "../../../../models";
import calculateDefaultEditTimes from "./calculateDefaultEditTimes";

describe("calculateDefaultEditTimes", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2021-01-01T12:00:00Z"));
    });
    test("calculate times when there is no current state", () => {
        const result = calculateDefaultEditTimes(null, true);
        expect(result).toEqual({
            timePrimary: "12:30",
            timeSecondary: "13:00",
            timeRelation: models.TimeRelation.ANYTIME,
            date: new Date("2099-01-01T00:00:00Z"),
        });
    });
    test("calculate times when there is no current state and it is half past", () => {
        jest.setSystemTime(new Date("2021-01-01T12:30:00Z"));
        const result = calculateDefaultEditTimes(null, true);
        expect(result).toEqual({
            timePrimary: "13:00",
            timeSecondary: "13:30",
            timeRelation: models.TimeRelation.ANYTIME,
            date: new Date("2099-01-01T00:00:00Z"),
        });
    });
    test("calculate times when there is state", () => {
        const timePrimary = new Date("2021-01-01T14:00:00Z").toISOString();
        const timeSecondary = new Date("2021-01-01T15:30:00Z").toISOString();
        const state = new models.Schedule({
            timePrimary,
            timeSecondary,
            relation: models.TimeRelation.ANYTIME,
        });
        const result = calculateDefaultEditTimes(state, true);
        expect(result).toEqual({
            timePrimary: "14:00",
            timeSecondary: "15:30",
            timeRelation: models.TimeRelation.ANYTIME,
            date: new Date("2021-01-01T14:00:00Z"),
        });
    });
    test("calculate times when there is half state", () => {
        const timePrimary = new Date("2021-01-01T14:00:00Z").toISOString();
        const state = new models.Schedule({
            timePrimary,
            timeSecondary: null,
            relation: models.TimeRelation.ANYTIME,
        });
        const result = calculateDefaultEditTimes(state, true);
        expect(result).toEqual({
            timePrimary: "14:00",
            timeSecondary: "14:30",
            timeRelation: models.TimeRelation.ANYTIME,
            date: new Date("2021-01-01T14:00:00Z"),
        });
    });
    test("calculate times when there is half state half past", () => {
        const timePrimary = new Date("2021-01-01T14:30:00Z").toISOString();
        const state = new models.Schedule({
            timePrimary,
            timeSecondary: null,
            relation: models.TimeRelation.ANYTIME,
        });
        const result = calculateDefaultEditTimes(state, true);
        expect(result).toEqual({
            timePrimary: "14:30",
            timeSecondary: "15:00",
            timeRelation: models.TimeRelation.ANYTIME,
            date: new Date("2021-01-01T14:30:00Z"),
        });
    });
});
