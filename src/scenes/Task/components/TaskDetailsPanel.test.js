import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../test-utils";
import TaskDetailsPanel from "./TaskDetailsPanel";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { priorities, tasksStatus, userRoles } from "../../../apiConsts";
import moment from "moment";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import { DataStore } from "aws-amplify";

const tenantId = "tenantId";

const preloadedState = {
    roleView: "ALL",
    tenantId,
    whoami: {
        user: { displayName: "Test User", roles: [userRoles.coordinator] },
    },
};

function createMatchMedia(width) {
    return (query) => ({
        matches: mediaQuery.match(query, {
            width,
        }),
        addListener: () => {},
        removeListener: () => {},
    });
}

describe("TaskDetailsPanel", () => {
    const originalMatchMedia = window.matchMedia;
    beforeEach(() => {
        // add window.matchMedia
        // this is necessary for the date picker to be rendered in desktop mode.
        // if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query) => ({
                media: query,
                // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
                matches: query === "(pointer: fine)",
                onchange: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                addListener: () => {},
                removeListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    });

    afterEach(async () => {
        window.matchMedia = originalMatchMedia;
        jest.restoreAllMocks();
        const tasks = await DataStore.query(models.Task);
        const locations = await DataStore.query(models.Location);
        const responsibilities = await DataStore.query(
            models.RiderResponsibility
        );
        await Promise.all(
            [...tasks, ...locations, ...responsibilities].map((item) =>
                DataStore.delete(item)
            )
        );
    });

    it("renders", async () => {
        const mockTask = new models.Task({});
        const querySpy = jest.spyOn(DataStore, "query");
        await DataStore.save(mockTask);
        render(<TaskDetailsPanel taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
    });

    it("renders task details", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            riderResponsibility: "North",
            timeOfCall,
            priority: priorities.high,
            establishmentLocation: new models.Location({
                name: "Test Establishment",
            }),
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("North")).toBeInTheDocument();
        expect(screen.getByText("test-reference")).toBeInTheDocument();
        expect(screen.getByText("Someone Person")).toBeInTheDocument();
        expect(screen.getByText("Test Establishment")).toBeInTheDocument();
        expect(screen.getByText("01234567890")).toBeInTheDocument();
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: priorities.high })
            ).toHaveClass("MuiChip-filled");
        });
        expect(screen.getByText(/Today at/)).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).format("HH:mm"))
        ).toBeInTheDocument();
    });

    test("changing the requester contact details failure", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest
            .spyOn(amplify.DataStore, "save")
            .mockRejectedValue(new Error());
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit caller details" })
        );
        userEvent.click(screen.getByText(mockTask.requesterContact.name));
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, " more name");
        userEvent.type(textBox, "{enter}");
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
    });

    test("changing the requester contact details", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest.spyOn(amplify.DataStore, "save");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit caller details" })
        );
        userEvent.click(screen.getByText(mockTask.requesterContact.name));
        userEvent.type(screen.getByRole("textbox"), " more name");
        userEvent.type(screen.getByRole("textbox"), "{enter}");
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.queryByRole("textbox")).toBeNull();
        userEvent.click(
            screen.getByText(mockTask.requesterContact.telephoneNumber)
        );
        userEvent.type(screen.getByRole("textbox"), "999999");
        userEvent.type(screen.getByRole("textbox"), "{enter}");
        expect(screen.queryByRole("textbox")).toBeNull();
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenNthCalledWith(1, {
            ...mockTask,
            requesterContact: {
                name: "Someone Person more name",
                telephoneNumber: "01234567890",
            },
        });
        expect(saveSpy).toHaveBeenNthCalledWith(2, {
            ...mockTask,
            requesterContact: {
                name: "Someone Person more name",
                telephoneNumber: "01234567890999999",
            },
        });
    });

    test("changing rider responsibility", async () => {
        const timeOfCall = new Date().toISOString();
        const resps = ["North", "South", "East", "West"];
        const possibleRiderResponsibilities = await Promise.all(
            resps.map((label) =>
                DataStore.save(new models.RiderResponsibility({ label }))
            )
        );
        console.log(possibleRiderResponsibilities);
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            riderResponsibility: "North",
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest.spyOn(amplify.DataStore, "save");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit rider role" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        possibleRiderResponsibilities.forEach((resp) => {
            expect(
                screen.getByRole("button", { name: resp.label })
            ).toBeInTheDocument();
        });

        possibleRiderResponsibilities
            .filter((r) => r.label !== "North")
            .forEach((resp) => {
                expect(
                    screen.getByRole("button", { name: resp.label })
                ).toHaveClass("MuiChip-outlinedDefault");
            });
        const northButton = screen.getByRole("button", { name: "North" });
        expect(northButton).toHaveClass("MuiChip-filled");
        const southButton = screen.getByRole("button", { name: "South" });
        userEvent.click(southButton);
        expect(southButton).toHaveClass("MuiChip-filled");
        expect(northButton).toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            riderResponsibility: "South",
        });
        expect(screen.getByText("South")).toBeInTheDocument();
        expect(screen.queryByText("North")).toBeNull();
    });

    test("changing rider responsibility failure", async () => {
        const timeOfCall = new Date().toISOString();
        const resps = ["North", "South", "East", "West"];
        const possibleRiderResponsibilities = await Promise.all(
            resps.map((label) =>
                DataStore.save(new models.RiderResponsibility({ label }))
            )
        );
        console.log(possibleRiderResponsibilities);
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            riderResponsibility: "North",
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest
            .spyOn(amplify.DataStore, "save")
            .mockRejectedValue(new Error());
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit rider role" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        possibleRiderResponsibilities.forEach((resp) => {
            expect(
                screen.getByRole("button", { name: resp.label })
            ).toBeInTheDocument();
        });

        possibleRiderResponsibilities
            .filter((r) => r.label !== "North")
            .forEach((resp) => {
                expect(
                    screen.getByRole("button", { name: resp.label })
                ).toHaveClass("MuiChip-outlinedDefault");
            });
        const northButton = screen.getByRole("button", { name: "North" });
        expect(northButton).toHaveClass("MuiChip-filled");
        const southButton = screen.getByRole("button", { name: "South" });
        userEvent.click(southButton);
        expect(southButton).toHaveClass("MuiChip-filled");
        expect(northButton).toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
    });

    test("unset the rider responsibility", async () => {
        const timeOfCall = new Date().toISOString();
        const resps = ["North", "South", "East", "West"];
        const possibleRiderResponsibilities = await Promise.all(
            resps.map((label) =>
                DataStore.save(new models.RiderResponsibility({ label }))
            )
        );
        console.log(possibleRiderResponsibilities);
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            riderResponsibility: "North",
            establishmentLocation: new models.Location({
                name: "Test Location",
            }),
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest.spyOn(amplify.DataStore, "save");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit rider role" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        const northButton = screen.getByRole("button", { name: "North" });
        expect(northButton).toHaveClass("MuiChip-filled");
        userEvent.click(northButton);
        expect(northButton).toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            riderResponsibility: null,
        });
        expect(screen.getByText("Unset")).toBeInTheDocument();
        expect(screen.queryByText("North")).toBeNull();
    });

    test("changing the requester contact details in mobile view", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest.spyOn(amplify.DataStore, "save");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });

        window.matchMedia = createMatchMedia(100);

        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit caller details" })
        );
        const textBoxes = screen.getAllByRole("textbox");
        userEvent.type(textBoxes[0], " more name");
        userEvent.type(textBoxes[1], "999999");
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                requesterContact: {
                    name: "Someone Person more name",
                    telephoneNumber: "01234567890999999",
                },
            });
        });
    });
    test("change the establishment failure", async () => {
        const timeOfCall = new Date().toISOString();
        const mockEstablishment = await DataStore.save(
            new models.Location({
                name: "Test Establishment",
                listed: 1,
            })
        );
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            establishmentLocation: null,
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest
            .spyOn(amplify.DataStore, "save")
            .mockRejectedValue(new Error());
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });

        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit establishment" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                2,
                models.Location,
                expect.any(Function)
            );
        });
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, "Test");
        userEvent.click(screen.getByText(mockEstablishment.name));
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                establishmentLocation: mockEstablishment,
            });
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
        expect(textBox).toBeInTheDocument();
    });

    test("change the establishment", async () => {
        const timeOfCall = new Date().toISOString();
        const mockEstablishment = await DataStore.save(
            new models.Location({
                name: "Test Establishment",
                listed: 1,
            })
        );
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            establishmentLocation: null,
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest.spyOn(amplify.DataStore, "save");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });

        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit establishment" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                2,
                models.Location,
                expect.any(Function)
            );
        });
        userEvent.type(screen.getByRole("textbox"), "Test");
        userEvent.click(screen.getByText(mockEstablishment.name));
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                establishmentLocation: mockEstablishment,
            });
        });
    });

    test("disable establishment ok button", async () => {
        const timeOfCall = new Date().toISOString();
        const mockEstablishment = await DataStore.save(
            new models.Location({
                name: "Test Establishment",
                listed: 1,
            })
        );
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            establishmentLocation: null,
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });

        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit establishment" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                2,
                models.Location,
                expect.any(Function)
            );
        });
        const okButton = screen.getByTestId("confirmation-ok-button");
        expect(okButton).toBeDisabled();
        userEvent.type(screen.getByRole("textbox"), "Test");
        userEvent.click(screen.getByText(mockEstablishment.name));
        expect(okButton).toBeEnabled();
        userEvent.click(
            screen.getByRole("button", { name: "establishment not listed?" })
        );
        expect(okButton).toBeDisabled();
        userEvent.type(screen.getByRole("textbox"), "Test");
        expect(okButton).toBeEnabled();
    });

    test("change the establishment to unlisted", async () => {
        const timeOfCall = new Date().toISOString();
        const mockEstablishment = new models.Location({
            name: "Test Unlisted",
            listed: 0,
            tenantId,
        });
        const mockTask = new models.Task({
            timeOfCall,
            tenantId,
            priority: priorities.high,
            reference: "test-reference",
            establishmentLocation: null,
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest.spyOn(amplify.DataStore, "save");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });

        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit establishment" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                2,
                models.Location,
                expect.any(Function)
            );
        });
        userEvent.click(screen.getByText("Not listed?"));
        userEvent.type(screen.getByRole("textbox"), "Test Unlisted");
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                establishmentLocation: expect.objectContaining({
                    ...mockEstablishment,
                    id: expect.any(String),
                }),
            });
        });
    });

    test("responds to the observer", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const establishment = await DataStore.save(
            new models.Location({
                name: "some establishment",
            })
        );
        await DataStore.save(establishment);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        await DataStore.save(
            models.Task.copyOf(mockTask, (upd) => {
                upd.priority = priorities.low;
            })
        );
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: priorities.low })
            ).toHaveClass("MuiChip-filled");
        });
        await DataStore.save(
            models.Task.copyOf(mockTask, (upd) => {
                upd.requesterContact.name = "New Name";
            })
        );
        await waitFor(() => {
            expect(screen.getByText("New Name")).toBeInTheDocument();
        });
        await DataStore.save(
            models.Task.copyOf(mockTask, (upd) => {
                upd.requesterContact.telephoneNumber = "000000";
            })
        );
        await waitFor(() => {
            expect(screen.getByText("000000")).toBeInTheDocument();
        });
        const toc = new Date().toISOString();
        await DataStore.save(
            models.Task.copyOf(mockTask, (upd) => {
                upd.timeOfCall = toc;
            })
        );
        await waitFor(() => {
            expect(
                screen.getByText(moment(toc).format("HH:mm"))
            ).toBeInTheDocument();
        });
        const latest = await DataStore.query(models.Task, mockTask.id);
        await DataStore.save(
            models.Task.copyOf(latest, (upd) => {
                upd.establishmentLocation = establishment;
            })
        );
        await screen.findByText(establishment.name);
    });

    it("unsubscribes to task observer on unmount", async () => {
        const mockTask = new models.Task({
            status: tasksStatus.new,
        });
        await DataStore.save(mockTask);
        const unsubscribe = jest.fn();
        const observeSpy = jest
            .spyOn(amplify.DataStore, "observe")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const { component } = render(
            <TaskDetailsPanel taskId={mockTask.id} />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(observeSpy).toHaveBeenCalledTimes(1);
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    test("the view for an assigned rider", async () => {
        const timeOfCall = new Date().toISOString();
        const mockEstablishment = new models.Location({
            name: "Test Establishment",
        });
        const mockTask = new models.Task({
            riderResponsibility: "North",
            timeOfCall,
            priority: priorities.high,
            establishmentLocation: mockEstablishment,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const mockWhoami = new models.User({
            displayName: "test rider",
            roles: [userRoles.rider],
        });
        const mockAssignment = await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                assignee: mockWhoami,
                role: userRoles.rider,
            })
        );
        const preloadedState = {
            roleView: userRoles.rider,
            whoami: {
                user: mockWhoami,
            },
            taskAssigneesReducer: {
                ready: true,
                isSynced: true,
                items: [mockAssignment],
            },
        };
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("North")).toBeInTheDocument();
        expect(screen.getByText("test-reference")).toBeInTheDocument();
        expect(screen.queryByText("Someone Person")).toBeNull();
        expect(screen.queryByText("01234567890")).toBeNull();
        expect(screen.queryByText("Test Establishment")).toBeNull();
        expect(screen.getByText(priorities.high)).toBeInTheDocument();
        expect(screen.getByText(/Today at/)).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).format("HH:mm"))
        ).toBeInTheDocument();
        expect(screen.queryAllByRole("button")).toHaveLength(0);
        await DataStore.save(
            models.Task.copyOf(mockTask, (upd) => {
                upd.riderResponsibility = null;
            })
        );
        await waitFor(() => {
            expect(screen.queryByText("North")).toBeNull();
        });
    });

    test("the view for an assigned coordinator", async () => {
        const timeOfCall = new Date().toISOString();
        const mockEstablishment = new models.Location({
            name: "Test Establishment",
        });
        const mockTask = new models.Task({
            riderResponsibility: "North",
            timeOfCall,
            priority: priorities.high,
            establishmentLocation: mockEstablishment,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const mockWhoami = new models.User({
            displayName: "test coord",
            roles: [userRoles.coordinator],
        });
        const mockAssignment = await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                assignee: mockWhoami,
                role: userRoles.coordinator,
            })
        );
        const preloadedState = {
            roleView: userRoles.rider,
            whoami: {
                user: mockWhoami,
            },
            taskAssigneesReducer: {
                ready: true,
                isSynced: true,
                items: [mockAssignment],
            },
        };
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("North")).toBeInTheDocument();
        expect(screen.getByText("test-reference")).toBeInTheDocument();
        expect(screen.getByText("Someone Person")).toBeInTheDocument();
        expect(screen.getByText("Test Establishment")).toBeInTheDocument();
        expect(screen.getByText("01234567890")).toBeInTheDocument();
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: priorities.high })
            ).toHaveClass("MuiChip-filled");
        });
        expect(screen.getByText(/Today at/)).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).format("HH:mm"))
        ).toBeInTheDocument();
    });

    test("view and change the time of call", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            riderResponsibility: "North",
            timeOfCall,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest.spyOn(amplify.DataStore, "save");
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText(/Today at/)).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).format("HH:mm"))
        ).toBeInTheDocument();
        userEvent.click(
            screen.getByRole("button", { name: "edit Time of call" })
        );
        const dateField = screen.getByRole("textbox");
        expect(dateField).toHaveValue(
            moment(timeOfCall).format("DD/MM/YYYY HH:mm")
        );
        userEvent.clear(dateField);
        userEvent.type(dateField, "01/01/2021 12:00");
        await waitFor(() => {
            expect(dateField).toHaveValue("01/01/2021 12:00");
        });
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                timeOfCall: "2021-01-01T12:00:00.000Z",
            });
        });
    });

    test("view and set the time failure", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            riderResponsibility: "North",
            timeOfCall,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const saveSpy = jest
            .spyOn(amplify.DataStore, "save")
            .mockRejectedValue(new Error());
        render(<TaskDetailsPanel taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText(/Today at/)).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).format("HH:mm"))
        ).toBeInTheDocument();
        userEvent.click(
            screen.getByRole("button", { name: "edit Time of call" })
        );
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({ ...mockTask });
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
        expect(okButton).toBeInTheDocument();
    });

    test.each`
        role
        ${userRoles.rider} | ${userRoles.coordinator}
    `("the views for different role views not assigned", async ({ role }) => {
        const timeOfCall = new Date().toISOString();
        const mockEstablishment = new models.Location({
            name: "Test Establishment",
        });
        const mockTask = new models.Task({
            riderResponsibility: "North",
            timeOfCall,
            establishmentLocation: mockEstablishment,
            priority: priorities.high,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const mockWhoami = new models.User({
            displayName: "test coord",
            roles: [role],
        });
        const preloadedState = {
            roleView: role,
            whoami: {
                user: mockWhoami,
            },
            taskAssigneesReducer: {
                ready: true,
                isSynced: true,
                items: [],
            },
        };
        render(<TaskDetailsPanel taskId={mockTask.id} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });

        if (role === userRoles.rider) {
            expect(screen.getByText("North")).toBeInTheDocument();
            expect(screen.getByText("test-reference")).toBeInTheDocument();
            expect(screen.queryByText("Someone Person")).toBeNull();
            expect(screen.queryByText("Test Establishment")).toBeNull();
            expect(screen.queryByText("01234567890")).toBeNull();
            expect(screen.getByText(priorities.high)).toBeInTheDocument();
            expect(screen.getByText(/Today at/)).toBeInTheDocument();
            expect(
                screen.getByText(moment(timeOfCall).format("HH:mm"))
            ).toBeInTheDocument();
        } else {
            expect(screen.getByText("North")).toBeInTheDocument();
            expect(screen.getByText("test-reference")).toBeInTheDocument();
            expect(screen.getByText("Someone Person")).toBeInTheDocument();
            expect(screen.getByText("Test Establishment")).toBeInTheDocument();
            expect(screen.getByText("01234567890")).toBeInTheDocument();
            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: priorities.high })
                ).toHaveClass("MuiChip-filled");
            });
            expect(screen.getByText(/Today at/)).toBeInTheDocument();
            expect(
                screen.getByText(moment(timeOfCall).format("HH:mm"))
            ).toBeInTheDocument();
        }
    });
});
