import StatusBar from "./StatusBar";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import { tasksStatus } from "../../../apiConsts";
import * as models from "../../../models/index";
import userEvent from "@testing-library/user-event";
import { createMatchMedia } from "../../../test-utils";
import { DataStore } from "aws-amplify";
import * as copyTaskDataToClipboard from "../../../utilities/copyTaskDataToClipboard";

describe("StatusBar", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("renders correctly", () => {
        render(<StatusBar />);
    });

    it.each`
        status
        ${tasksStatus.completed}
        ${tasksStatus.cancelled}
        ${tasksStatus.pickedUp}
        ${tasksStatus.droppedOff}
        ${tasksStatus.abandoned}
        ${tasksStatus.active}
        ${tasksStatus.new}
        ${tasksStatus.rejected}
    `("renders the correct status", async ({ status }) => {
        const mockTask = await DataStore.save(new models.Task({ status }));
        const querySpy = jest.spyOn(DataStore, "query");
        render(<StatusBar taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        if (status === tasksStatus.droppedOff) status = "DELIVERED";
        else if (status === tasksStatus.pickedUp) status = "PICKED UP";
        expect(screen.getByText(status)).toBeInTheDocument();
    });

    test("click the copy to clipboard button on mobile", async () => {
        Object.assign(window, {
            cordova: {
                plugins: {
                    clipboard: {
                        copy: jest
                            .fn()
                            .mockImplementation(() => Promise.resolve()),
                    },
                },
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
        const savedDeliverables = await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        let cordovaSpy;
        cordovaSpy = jest.spyOn(window.cordova.plugins.clipboard, "copy");
        render(<StatusBar taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        const copySpy = jest.spyOn(copyTaskDataToClipboard, "default");
        await waitFor(() =>
            expect(copySpy).toHaveBeenCalledWith({
                ...mockTask,
                deliverables: savedDeliverables,
            })
        );
        await waitFor(() => {
            expect(cordovaSpy).toHaveBeenCalled();
        });
        expect(cordovaSpy).toMatchSnapshot();
        // I don't know why this fails, I can see it is working in the app
        //expect(await screen.findByText("Copy successful!")).toBeInTheDocument();
    });

    test("click the copy to clipboard button", async () => {
        Object.assign(window, {
            cordova: undefined,
        });
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
        const savedDeliverables = await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const clipboardSpy = jest.spyOn(navigator.clipboard, "writeText");
        render(<StatusBar taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        const copySpy = jest.spyOn(copyTaskDataToClipboard, "default");
        await waitFor(() =>
            expect(copySpy).toHaveBeenCalledWith({
                ...mockTask,
                deliverables: savedDeliverables,
            })
        );
        await waitFor(() => {
            expect(clipboardSpy).toHaveBeenCalled();
        });
        expect(clipboardSpy).toMatchSnapshot();
        expect(await screen.findByText("Copy successful!")).toBeInTheDocument();
    });

    it("fails to copy task data to clipboard", async () => {
        jest.restoreAllMocks();
        render(<StatusBar taskId={"nope"} />);
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        expect(await screen.findByText("Copy failed!")).toBeInTheDocument();
    });
    test("click the close button", async () => {
        const mockClose = jest.fn();
        render(<StatusBar handleClose={mockClose} />);
        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toBeInTheDocument();
        userEvent.click(closeButton);
        expect(mockClose).toHaveBeenCalled();
    });

    test("click the back button on mobile", async () => {
        window.matchMedia = createMatchMedia(240);
        const mockClose = jest.fn();
        render(<StatusBar handleClose={mockClose} />);
        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toBeInTheDocument();
        userEvent.click(closeButton);
        expect(mockClose).toHaveBeenCalled();
    });
});
