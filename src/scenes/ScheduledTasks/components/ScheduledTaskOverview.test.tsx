import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import ScheduledTaskOverview from "./ScheduledTaskOverview";
import { render } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
const tenantId = "test-tenant";

describe("ScheduledTaskOverview", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        const scheduledTasks = await DataStore.query(models.ScheduledTask);
        const users = await DataStore.query(models.User);
        await Promise.all(
            [...scheduledTasks, ...users].map((item) => DataStore.delete(item))
        );
    });
    test("the enable and disable buttons", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "name",
                roles: [models.Role.ADMIN],
                username: "username",
                cognitoId: "cognitoId",
            })
        );
        const scheduledTask = await DataStore.save(
            new models.ScheduledTask({
                tenantId,
                cronExpression: "0 18 * * *",
                disabled: 0,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<ScheduledTaskOverview scheduledTaskId={scheduledTask.id} />, {
            preloadedState,
        });
        userEvent.click(await screen.findByRole("button", { name: "Disable" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...scheduledTask,
                disabled: 1,
            });
        });
        expect(screen.queryByRole("button", { name: "Disable" })).toBeNull();
        userEvent.click(await screen.findByRole("button", { name: "Enable" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...scheduledTask,
                disabled: 0,
            });
        });
        expect(screen.queryByRole("button", { name: "Enable" })).toBeNull();
        expect(
            screen.getByRole("button", { name: "Disable" })
        ).toBeInTheDocument();
    });
    test("hide enable and disable buttons if not admin", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "name",
                roles: [models.Role.USER],
                username: "username",
                cognitoId: "cognitoId",
            })
        );
        const scheduledTask = await DataStore.save(
            new models.ScheduledTask({
                tenantId,
                cronExpression: "0 18 * * *",
                disabled: 0,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        render(<ScheduledTaskOverview scheduledTaskId={scheduledTask.id} />, {
            preloadedState,
        });
        expect(screen.queryByRole("button", { name: "Disable" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Enable" })).toBeNull();
    });
});
