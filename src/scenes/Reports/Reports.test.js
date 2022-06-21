import { DataStore } from "aws-amplify";
import _ from "lodash";
import * as models from "../../models";
import Reports from "./Reports";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as gr from "./utilities/generateReport";
import { userRoles } from "../../apiConsts";

describe("Reports", () => {
    beforeAll(async () => {
        await Promise.all(
            _.range(0, 10).map((i) => DataStore.save(new models.Task({})))
        );
        global.URL.createObjectURL = jest.fn();
    });

    afterEach(async () => {
        jest.restoreAllMocks();
        const tasks = await DataStore.query(models.Task);
        await Promise.all(tasks.map((t) => DataStore.delete(t)));
    });
    test("generate and download a CSV report", async () => {
        const generateReportSpy = jest.spyOn(gr, "default");
        const querySpy = jest.spyOn(DataStore, "query");

        render(<Reports />);
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(32);
        });
    });

    test.each`
        role
        ${userRoles.admin} | ${userRoles.rider} | ${userRoles.coordinator}
    `("show the correct roles available to the user", async ({ role }) => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "Test User",
                roles: [role],
            })
        );
        const preloadedState = {
            whoami: {
                user: whoami,
            },
        };
        render(<Reports />, { preloadedState });
        if (role === userRoles.admin) {
            expect(screen.getByText("ALL")).toBeInTheDocument();
            expect(screen.queryByText("RIDER")).toBeNull();
            expect(screen.queryByText("COORDINATOR")).toBeNull();
        } else if (role === userRoles.rider) {
            expect(screen.getByText("RIDER")).toBeInTheDocument();
            expect(screen.queryByText("ALL")).toBeNull();
            expect(screen.queryByText("COORDINATOR")).toBeNull();
        } else if (role === userRoles.coordinator) {
            expect(screen.getByText("COORDINATOR")).toBeInTheDocument();
            expect(screen.queryByText("ALL")).toBeNull();
            expect(screen.queryByText("RIDER")).toBeNull();
        }
    });
});
