import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../test-utils";
import TaskDetailsPanel from "./TaskDetailsPanel";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { priorities, tasksStatus } from "../../../apiConsts";
import moment from "moment";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import { DataStore } from "aws-amplify";

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
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    afterEach(() => {
        jest.restoreAllMocks();
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
        render(<TaskDetailsPanel taskId={mockTask.id} />);
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
            ).toHaveClass("MuiChip-default");
        });
        expect(screen.getByText(/Today at/)).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).format("HH:mm"))
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
        render(<TaskDetailsPanel taskId={mockTask.id} />);
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
        render(<TaskDetailsPanel taskId={mockTask.id} />);

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
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        render(<TaskDetailsPanel taskId={mockTask.id} />);
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
            ).toHaveClass("MuiChip-default");
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
        const { component } = render(<TaskDetailsPanel taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(observeSpy).toHaveBeenCalledTimes(1);
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
});
