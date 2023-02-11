import { render } from "../../test-utils";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import TaskContextMenu from "./TaskContextMenu";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
import { tasksStatus, userRoles } from "../../apiConsts";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TasksGridColumn from "../../scenes/Dashboard/components/TasksGridColumn";
import * as copyTaskDataToClipboard from "../../utilities/copyTaskDataToClipboard";

const tenantId = "tenantId";

describe("TaskContextMenu", () => {
    const RealDate = Date;
    const isoDate = "2021-11-29T23:24:58.987Z";
    const dateString = "2021-11-29";

    function mockDate() {
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

    test("cancel a task", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskContextMenu task={task} assignedRiders={[]} />);
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Mark cancelled" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeCancelled: isoDate,
                status: tasksStatus.cancelled,
            });
        });
        await waitFor(() => {
            expect(
                screen.getByText("Task marked cancelled")
            ).toBeInTheDocument();
        });
        // undo
        userEvent.click(screen.getByRole("button", { name: "UNDO" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeCancelled: null,
            });
        });
    });

    test("cancel a task failure", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue(new Error());
        render(<TaskContextMenu task={task} assignedRiders={[]} />);
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Mark cancelled" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, something went wrong")
            ).toBeInTheDocument();
        });
    });

    test("reject a task", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskContextMenu task={task} assignedRiders={[]} />);
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Mark rejected" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeRejected: isoDate,
                status: tasksStatus.rejected,
            });
        });
        await waitFor(() => {
            expect(
                screen.getByText("Task marked rejected")
            ).toBeInTheDocument();
        });
        // undo
        userEvent.click(screen.getByRole("button", { name: "UNDO" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeRejected: null,
            });
        });
    });

    test("mark a task picked up", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.active,
            })
        );
        const fakeRider = await DataStore.save(
            new models.User({
                displayName: "Someone person",
                roles: [userRoles.user, userRoles.rider],
            })
        );
        const fakeAssignment = await DataStore.save(
            new models.TaskAssignee({
                task,
                assignee: fakeRider,
                role: userRoles.rider,
            })
        );
        const preloadedState = {
            taskAssigneesReducer: {
                items: [fakeAssignment],
                ready: true,
                isSynced: true,
            },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <TaskContextMenu task={task} assignedRiders={[fakeAssignment]} />,
            { preloadedState }
        );
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Mark picked up" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timePickedUp: isoDate,
                status: tasksStatus.pickedUp,
            });
        });
        await waitFor(() => {
            expect(
                screen.getByText("Task marked picked up")
            ).toBeInTheDocument();
        });
        // undo
        userEvent.click(screen.getByRole("button", { name: "UNDO" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timePickedUp: null,
            });
        });
    });

    test("mark a task delivered", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.pickedUp,
                timePickedUp: new Date().toISOString(),
            })
        );
        const fakeRider = await DataStore.save(
            new models.User({
                displayName: "Someone person",
                roles: [userRoles.user, userRoles.rider],
            })
        );
        const fakeAssignment = await DataStore.save(
            new models.TaskAssignee({
                task,
                assignee: fakeRider,
                role: userRoles.rider,
            })
        );
        const preloadedState = {
            taskAssigneesReducer: {
                items: [fakeAssignment],
                ready: true,
                isSynced: true,
            },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <TaskContextMenu task={task} assignedRiders={[fakeAssignment]} />,
            { preloadedState }
        );
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Mark delivered" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeDroppedOff: isoDate,
                status: tasksStatus.droppedOff,
            });
        });
        await waitFor(() => {
            expect(
                screen.getByText("Task marked delivered")
            ).toBeInTheDocument();
        });
        // undo
        userEvent.click(screen.getByRole("button", { name: "UNDO" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeDroppedOff: null,
            });
        });
    });
    test("mark a rider home", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.droppedOff,
                timePickedUp: new Date().toISOString(),
                timeDroppedOff: new Date().toISOString(),
            })
        );
        const fakeRider = await DataStore.save(
            new models.User({
                displayName: "Someone person",
                roles: [userRoles.user, userRoles.rider],
            })
        );
        const fakeAssignment = await DataStore.save(
            new models.TaskAssignee({
                task,
                assignee: fakeRider,
                role: userRoles.rider,
            })
        );
        const preloadedState = {
            taskAssigneesReducer: {
                items: [fakeAssignment],
                ready: true,
                isSynced: true,
            },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <TaskContextMenu task={task} assignedRiders={[fakeAssignment]} />,
            { preloadedState }
        );
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Mark rider home" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeRiderHome: isoDate,
                status: tasksStatus.completed,
            });
        });
        await waitFor(() => {
            expect(
                screen.getByText("Task marked rider home")
            ).toBeInTheDocument();
        });
        // undo
        userEvent.click(screen.getByRole("button", { name: "UNDO" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeRiderHome: null,
            });
        });
    });

    test("if the copy fails, show it in a dialog instead", async () => {
        Object.assign(window, {
            cordova: undefined,
        });
        Object.assign(window.navigator, {
            clipboard: {
                writeText: jest.fn().mockImplementation(() => Promise.reject()),
            },
        });
        const timeOfCall = "2022-09-14T07:55:07.473Z";
        const pickUpLocation = new models.Location({
            line1: "line one",
            ward: "test ward",
            postcode: "postcode",
        });
        const dropOffLocation = new models.Location({
            line1: "something",
            ward: "some ward",
            postcode: "some postcode",
        });
        const mockTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
            pickUpLocation,
            dropOffLocation,
            priority: models.Priority.HIGH,
        });
        await DataStore.save(mockTask);
        const mockDeliverableType = new models.DeliverableType({
            label: "test deliverable",
        });
        await DataStore.save(mockDeliverableType);
        const mockDeliverables = [
            {
                unit: "ITEM",
                count: 1,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
            {
                unit: "ITEM",
                count: 2,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
            {
                unit: models.DeliverableUnit.LITER,
                count: 3,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
        ];
        await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );
        render(<TaskContextMenu task={mockTask} assignedRiders={[]} />);
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Copy to clipboard" })
        );
        await screen.findByTestId("copy-failed-dialog");
        expect(
            screen.getByText(
                "TOC: 23:24 FROM: test ward - line one, postcode TO: some ward - something, some postcode PRIORITY: high ITEMS: test deliverable x 1, test deliverable x 2, test deliverable x 3"
            )
        ).toBeInTheDocument();
        userEvent.click(screen.getByTestId("copy-ok-button"));
        await waitFor(() => {
            expect(screen.queryByTestId("copy-failed-dialog")).toBeNull();
        });
    });

    test("copy to clipboard", async () => {
        Object.assign(window.navigator, {
            clipboard: {
                writeText: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve()),
            },
        });

        const timeOfCall = "2022-09-14T07:55:07.473Z";
        const pickUpLocation = new models.Location({
            line1: "line one",
            ward: "test ward",
            postcode: "postcode",
        });
        const dropOffLocation = new models.Location({
            line1: "something",
            ward: "some ward",
            postcode: "some postcode",
        });
        const mockTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
            pickUpLocation,
            dropOffLocation,
            priority: models.Priority.HIGH,
        });
        await DataStore.save(mockTask);
        const mockDeliverableType = new models.DeliverableType({
            label: "test deliverable",
        });
        await DataStore.save(mockDeliverableType);
        const mockDeliverables = [
            {
                unit: models.DeliverableUnit.ITEM,
                count: 1,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
            {
                unit: models.DeliverableUnit.ITEM,
                count: 2,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
            {
                unit: models.DeliverableUnit.LITER,
                count: 3,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
        ];
        await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );

        const clipboardSpy = jest.spyOn(navigator.clipboard, "writeText");
        render(<TaskContextMenu task={mockTask} assignedRiders={[]} />);
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Copy to clipboard" })
        );
        await waitFor(() => {
            expect(screen.getByText("Copied to clipboard")).toBeInTheDocument();
        });
        expect(clipboardSpy).toMatchSnapshot();
    });

    test("failed copy to clipboard", async () => {
        Object.assign(window.navigator, {
            clipboard: {
                writeText: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve()),
            },
        });

        const timeOfCall = "2022-09-14T07:55:07.473Z";
        const mockTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
            priority: models.Priority.HIGH,
        });
        await DataStore.save(mockTask);
        const querySpy = jest
            .spyOn(DataStore, "query")
            .mockResolvedValueOnce(mockTask)
            .mockRejectedValue({});
        render(<TaskContextMenu task={mockTask} assignedRiders={[]} />);
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(
            screen.getByRole("menuitem", { name: "Copy to clipboard" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(screen.getByText("Copy failed!")).toBeInTheDocument();
        });
    });

    test("duplicate a task", async () => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "someone person",
                roles: [userRoles.user, userRoles.coordinator],
                tenantId,
            })
        );
        const mockLocation = await DataStore.save(
            new models.Location({
                name: "woop",
                listed: 1,
                tenantId,
            })
        );
        const mockLocation2 = await DataStore.save(
            new models.Location({
                name: "ohp",
                listed: 1,
                tenantId,
            })
        );
        const mockEstablishment = await DataStore.save(
            new models.Location({
                name: "something",
                listed: 1,
                tenantId,
            })
        );
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
                pickUpLocation: mockLocation,
                dropOffLocation: mockLocation2,
                establishmentLocation: mockEstablishment,
                tenantId,
            })
        );
        const mockTaskAssignee = new models.TaskAssignee({
            task,
            assignee: whoami,
            role: userRoles.coordinator,
            tenantId,
        });
        const deliverableTypes = await Promise.all(
            ["test deliverable", "another one"].map((d) =>
                DataStore.save(new models.DeliverableType({ label: d }))
            )
        );
        const deliverables = await Promise.all(
            deliverableTypes.map((deliverableType) =>
                DataStore.save(
                    new models.Deliverable({
                        deliverableType,
                        count: 3,
                        unit: deliverableType.defaultUnit,
                        task,
                        tenantId,
                    })
                )
            )
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = {
            whoami: { user: whoami },
            roleView: userRoles.coordinator,
            taskAssigneesReducer: {
                items: [mockTaskAssignee],
                ready: true,
                isSynced: true,
            },
            tenantId,
        };
        //render(<TaskContextMenu task={task} assignedRiders={[]} />, {
        //    preloadedState,
        //});
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <TaskContextMenu task={task} assignedRiders={[]} />
                <TasksGridColumn taskKey={[tasksStatus.new]} />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(4);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...task,
            dateCreated: dateString,
            createdBy: whoami,
            tenantId,
            id: expect.not.stringMatching(task.id),
        });
        deliverables.forEach((del) => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...del,
                tenantId,
                id: expect.not.stringMatching(del.id),
                task: {
                    ...task,
                    dateCreated: dateString,
                    createdBy: whoami,
                    id: expect.not.stringMatching(task.id),
                },
            });
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTaskAssignee,
            tenantId,
            id: expect.any(String),
            task: {
                ...task,
                createdBy: whoami,
                dateCreated: dateString,
                id: expect.any(String),
            },
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(13);
        });
        expect(screen.getByText("Task duplicated to NEW")).toBeInTheDocument();
        expect(screen.queryAllByRole("link")).toHaveLength(2);
    });

    test("can't duplicate in rider role view", async () => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "someone person",
                roles: [userRoles.user, userRoles.rider],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.active,
                riderResponsibility: "something",
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            roleView: userRoles.rider,
        };
        render(<TaskContextMenu task={task} assignedRiders={[]} />, {
            preloadedState,
        });
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        expect(
            screen.queryByRole("menuitem", { name: "Duplicate" })
        ).toBeNull();
    });

    test.skip("duplicate a task in rider role view", async () => {
        // at the moment riders can't duplicate tasks
        const whoami = await DataStore.save(
            new models.User({
                displayName: "someone person",
                roles: [userRoles.user, userRoles.rider],
                tenantId,
            })
        );
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.active,
                riderResponsibility: "something",
            })
        );
        const mockTaskAssignee = new models.TaskAssignee({
            task,
            assignee: whoami,
            role: userRoles.rider,
            tenantId: whoami.tenantId,
        });
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = {
            whoami: { user: whoami },
            roleView: userRoles.rider,
        };
        render(<TaskContextMenu task={task} assignedRiders={[]} />, {
            preloadedState,
        });
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...task,
            id: expect.not.stringMatching(task.id),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTaskAssignee,
            id: expect.any(String),
            task: {
                ...task,
                id: expect.any(String),
            },
        });
    });

    test("duplicate a task with unlisted locations", async () => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "someone person",
                roles: [userRoles.user, userRoles.coordinator],
                tenantId,
            })
        );
        const mockLocation = await DataStore.save(
            new models.Location({ name: "woop", listed: 0, tenantId })
        );
        const mockLocation2 = await DataStore.save(
            new models.Location({ name: "ohp", listed: 0, tenantId })
        );
        const mockEstablishment = await DataStore.save(
            new models.Location({ name: "something", listed: 0, tenantId })
        );
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
                pickUpLocation: mockLocation,
                dropOffLocation: mockLocation2,
                establishmentLocation: mockEstablishment,
                tenantId,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        render(<TaskContextMenu task={task} assignedRiders={[]} />, {
            preloadedState,
        });
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(5);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation,
            id: expect.not.stringMatching(mockLocation.id),
            tenantId,
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation2,
            id: expect.not.stringMatching(mockLocation2.id),
            tenantId,
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockEstablishment,
            id: expect.not.stringMatching(mockEstablishment.id),
            tenantId,
        });
    });

    test("duplicate a task failure", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        const whoami = await DataStore.save(
            new models.User({
                displayName: "someone person",
                roles: [userRoles.user, userRoles.coordinator],
                tenantId,
            })
        );
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue(new Error());
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        render(<TaskContextMenu task={task} assignedRiders={[]} />, {
            preloadedState,
        });
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, something went wrong")
            ).toBeInTheDocument();
        });
    });

    test.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.abandoned} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
    `("disable duplicate if completed", async ({ taskStatus }) => {
        const task = await DataStore.save(
            new models.Task({
                status: taskStatus,
            })
        );
        render(<TaskContextMenu task={task} assignedRiders={[]} />);
        const button = screen.getByRole("button", { name: "task options" });
        userEvent.click(button);
        expect(
            screen.getByRole("menuitem", { name: "Duplicate" })
        ).toHaveAttribute("aria-disabled", "true");
    });
});
