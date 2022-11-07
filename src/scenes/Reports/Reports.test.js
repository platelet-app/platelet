import { DataStore } from "aws-amplify";
import _ from "lodash";
import * as models from "../../models";
import Reports from "./Reports";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as gr from "./utilities/generateReport";
import { userRoles } from "../../apiConsts";
import { setReadyStatus } from "../../redux/awsHubListener/awsHubListenerActions";
import { Days, dayOptions } from "../../components/DaysSelection";

const preloadedHub = {
    awsHubDataStoreEventsReducer: {
        dataStoreReadyStatus: true,
        networkStatus: true,
    },
};

describe("Reports", () => {
    beforeAll(async () => {
        await Promise.all(
            _.range(0, 10).map((i) => DataStore.save(new models.Task({})))
        );
        global.URL.createObjectURL = jest.fn();
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    test("generate and download a CSV report", async () => {
        const generateReportSpy = jest.spyOn(gr, "default");
        const querySpy = jest.spyOn(DataStore, "query");
        const whoami = new models.User({
            displayName: "Test User",
            name: "testuser",
            roles: [userRoles.coordinator],
        });

        const preloadedState = { ...preloadedHub, whoami: { user: whoami } };
        await DataStore.save(
            new models.TaskAssignee({
                assignee: whoami,
                task: new models.Task({ status: "NEW" }),
            })
        );
        render(<Reports />, { preloadedState });
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalledWith(
                whoami.id,
                userRoles.coordinator,
                3
            );
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(4);
        });
    });

    test("no other user select if not an admin", async () => {
        const whoami = new models.User({
            displayName: "Test User",
            name: "testuser",
            roles: [userRoles.coordinator],
        });

        const preloadedState = { ...preloadedHub, whoami: { user: whoami } };
        render(<Reports />, { preloadedState });
        expect(screen.queryByRole("combobox")).toBeNull();
    });

    test("show a confirmation window if datastore isn't ready", async () => {
        const generateReportSpy = jest.spyOn(gr, "default");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<Reports />, {
            preloadedState: {
                awsHubDataStoreEventsReducer: {
                    network: true,
                    ready: false,
                },
            },
        });
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        expect(screen.queryByRole(("button", { name: "OK" }))).toBeNull();
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
    });

    test("skip confirmation if sync status changes", async () => {
        const generateReportSpy = jest.spyOn(gr, "default");
        const querySpy = jest.spyOn(DataStore, "query");
        const { store } = render(<Reports />, {
            preloadedState: {
                awsHubDataStoreEventsReducer: {
                    network: true,
                    ready: false,
                },
            },
        });
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
        store.dispatch(setReadyStatus(true));
        expect(screen.queryByRole(("button", { name: "OK" }))).toBeNull();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
    });

    test("skip confirmation if user is offline", async () => {
        const generateReportSpy = jest.spyOn(gr, "default");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<Reports />, {
            preloadedState: {
                awsHubDataStoreEventsReducer: {
                    network: false,
                    ready: false,
                },
            },
        });
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(screen.queryByRole(("button", { name: "OK" }))).toBeNull();
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
    });

    test("export data for another coordinator if an admin", async () => {
        const generateReportSpy = jest.spyOn(gr, "default");
        const querySpy = jest.spyOn(DataStore, "query");
        const whoami = await DataStore.save(
            new models.User({
                displayName: "Test User",
                roles: [userRoles.admin, userRoles.coordinator],
            })
        );
        const anotherCoord = await DataStore.save(
            new models.User({
                displayName: "Some Coordinator",
                roles: [userRoles.coordinator],
            })
        );
        const preloadedStateWhoami = {
            ...preloadedHub,
            whoami: {
                user: whoami,
            },
        };
        render(<Reports />, {
            preloadedState: preloadedStateWhoami,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        const searchCoords = screen.getByRole("combobox");
        userEvent.type(searchCoords, "Some Coordinator");
        const option = screen.getByText(anotherCoord.displayName);
        expect(option).toBeInTheDocument();
        userEvent.click(option);
        expect(screen.queryByRole("combobox")).toBeNull();
        expect(
            await screen.findByText(anotherCoord.displayName)
        ).toBeInTheDocument();
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(button).toBeDisabled();
        expect(generateReportSpy).toHaveBeenCalledWith(
            anotherCoord.id,
            userRoles.coordinator,
            3
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
    });

    test.only.each`
        days
        ${Days.ONE_DAY} | ${Days.THREE_DAYS} | ${Days.FIVE_DAYS} | ${Days.ONE_WEEK} | ${Days.TWO_WEEKS}
    `("test selecting different amount of days", async ({ days }) => {
        const generateReportSpy = jest.spyOn(gr, "default");
        const querySpy = jest.spyOn(DataStore, "query");
        const whoami = new models.User({
            displayName: "Test User",
            name: "testuser",
            roles: [userRoles.coordinator],
        });

        const preloadedState = { ...preloadedHub, whoami: { user: whoami } };

        render(<Reports />, { preloadedState });
        const button = screen.getByRole("button", { name: "Export" });
        const label = Object.keys(dayOptions).find(
            (key) => dayOptions[key] === days
        );
        userEvent.click(screen.getByRole("button", { name: label }));
        userEvent.click(button);
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalledWith(
                whoami.id,
                userRoles.coordinator,
                days
            );
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
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
