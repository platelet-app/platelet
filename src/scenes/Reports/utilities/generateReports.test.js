import { DataStore } from "aws-amplify";
import { tasksStatus } from "../../../apiConsts";
import * as models from "../../../models";

describe("generateReports", () => {
    test("generate a report", async () => {
        const task1 = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
                timeOfCall: new Date(),
            })
        );
    });
});
