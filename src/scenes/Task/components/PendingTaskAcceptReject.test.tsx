import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import { render } from "../../../test-utils";
import PendingTaskAcceptReject from "./PendingTaskAcceptReject";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const tenantId = "tenantId";

const dateCreated = new Date().toISOString().split("T")[0];

describe("PendingTaskAcceptReject", () => {
    const RealDate = Date;
    const isoDate = "2021-11-29T23:24:58.987Z";

    function mockDate() {
        // @ts-ignore
        global.Date = class extends RealDate {
            constructor() {
                super();
                return new RealDate(isoDate);
            }
        };
    }

    afterEach(async () => {
        global.Date = RealDate;
    });

    beforeEach(async () => {
        jest.restoreAllMocks();
        mockDate();
    });

    afterEach(async () => {
        jest.restoreAllMocks();
        const tasks = await DataStore.query(models.Task);
        await Promise.all([...tasks].map((item) => DataStore.delete(item)));
    });
    test.each`
        action
        ${"Accept"} | ${"Reject"}
    `("accept/reject task and undo", async ({ action }) => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "whoami",
                username: "whoami",
                cognitoId: "someid",
                roles: [models.Role.COORDINATOR],
            })
        );
        const preloadedState = {
            tenantId,
            whoami: { user: whoami },
        };
        const mockTask = await DataStore.save(
            new models.Task({
                status: "PENDING",
                tenantId,
                dateCreated,
            })
        );
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: whoami,
            role: models.Role.COORDINATOR,
            tenantId,
        });
        const saveSpy = jest.spyOn(DataStore, "save");
        const deleteSpy = jest.spyOn(DataStore, "delete");

        render(<PendingTaskAcceptReject taskId={mockTask.id} />, {
            preloadedState,
        });
        userEvent.click(
            await screen.findByRole("button", {
                name: action,
            })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        if (action === "Accept") {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                status: models.TaskStatus.NEW,
            });
        } else {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                status: models.TaskStatus.REJECTED,
                timeRejected: isoDate,
            });
        }
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockAssignment,
            id: expect.any(String),
        });
        expect(screen.queryByRole("button", { name: "Accept" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Reject" })).toBeNull();
        userEvent.click(screen.getByRole("button", { name: "UNDO" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(3);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            status: models.TaskStatus.PENDING,
            timeRejected: null,
        });
        expect(deleteSpy).toHaveBeenCalledWith({
            ...mockAssignment,
            task: { ...mockTask, timeRejected: null, id: expect.any(String) },
            id: expect.any(String),
        });
    });
});
