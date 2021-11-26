import React from "react";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import { render } from "../../../test-utils";

import * as amplify from "aws-amplify";
import * as models from "../../../models/index";
import _ from "lodash";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";

jest.mock("aws-amplify");

jest.mock("../../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const errorMessage = "Sorry, something went wrong";

const profilePictureThumbnailURL =
    "data:image/jpeg;base64,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";

const fakeAssignments = [
    {
        id: "1",
        assignee: {
            id: "someId",
            riderResponsibility: "Something",
            userRiderResponsibilityId: "responsibilityId",
            displayName: "Some Person",
            profilePictureThumbnailURL,
        },
        task: { id: "test" },
        role: userRoles.rider,
    },
    {
        id: "2",
        assignee: {
            id: "someId2",
            displayName: "Another Individual",
            profilePictureThumbnailURL,
        },
        task: { id: "test" },
        role: userRoles.coordinator,
    },
    {
        id: "3",
        assignee: {
            id: "someId3",
            riderResponsibility: "Something",
            riderResponsibilityId: "responsibilityId",
            displayName: "Nope",
            profilePictureThumbnailURL,
        },
        task: { id: "not_test" },
        role: userRoles.rider,
    },
    {
        id: "4",
        assignee: {
            id: "someId4",
            displayName: "Nope the second",
            profilePictureThumbnailURL,
        },
        task: { id: "not_test" },
        role: userRoles.coordinator,
    },
];

const fakeUsers = [
    {
        id: "someId",
        profilePictureThumbnailURL,
        displayName: "Some Person",
        roles: [userRoles.rider, userRoles.coordinator],
        riderResponsibility: { id: "responsibilityId" },
    },
    {
        id: "someId2",
        profilePictureThumbnailURL,
        displayName: "Another Individual",
        roles: [userRoles.rider, userRoles.coordinator],
        riderResponsibility: { id: "responsibilityId2" },
    },
    {
        id: "someId3",
        profilePictureThumbnailURL,
        displayName: "Nope",
        roles: [userRoles.rider, userRoles.coordinator],
        riderResponsibility: { id: "responsibilityId3" },
    },
    {
        id: "someId4",
        profilePictureThumbnailURL,
        displayName: "Nope the second",
        roles: [userRoles.rider, userRoles.coordinator],
        riderResponsibility: { id: "responsibilityId4" },
    },
];

describe("TaskAssignmentsPanel", () => {
    it("renders", () => {
        render(<TaskAssignmentsPanel />);
    });

    it("displays an avatar group of assigned users", async () => {
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        const avatarGroup = screen.queryAllByRole("img");
        // expect to have the correct number of avatars
        expect(avatarGroup).toHaveLength(2);
        // mouse over the avatar group to show the tooltip
        fireEvent.mouseOver(avatarGroup[0]);
        const displayString = fakeAssignments
            .filter((assignment) => assignment.task.id === "test")
            .map((assignment) => assignment.assignee.displayName)
            .join(", ");
        expect(await screen.findByText(displayString)).toBeInTheDocument();
    });

    it("displays cards for the assigned users when expanded", async () => {
        amplify.DataStore.query
            .mockResolvedValueOnce(fakeAssignments)
            .mockResolvedValue(fakeUsers);
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        // click the expand button
        userEvent.click(screen.getByText("Expand to see more"));
        const rider = screen.getByRole("link", {
            name: "Some Person Some Person",
        });
        const coord = screen.getByRole("link", {
            name: "Another Individual Another Individual",
        });
        expect(rider).toBeInTheDocument();
        expect(coord).toBeInTheDocument();
    });

    it("is expanded by default when there are no riders assignees", async () => {
        amplify.DataStore.query
            .mockResolvedValueOnce([fakeAssignments[1]])
            .mockResolvedValue(fakeUsers);
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2)
        );
        expect(screen.getByText("Show less")).toBeInTheDocument();
        expect(
            screen.getByRole("link", {
                name: "Another Individual Another Individual",
            })
        ).toBeInTheDocument();
    });

    test("select and assign a rider", async () => {
        const mockUser = new models.User(fakeUsers[0]);
        const mockTask = new models.Task({ status: tasksStatus.new });
        const mockAssignment = new models.TaskAssignee({
            assignee: mockUser,
            task: mockTask,
            role: userRoles.rider,
        });
        const mockRiderResponsibility = new models.RiderResponsibility({
            id: "responsibilityId",
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([fakeAssignments[1]])
            .mockResolvedValueOnce(fakeUsers)
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockRiderResponsibility)
            .mockResolvedValueOnce(fakeUsers);
        amplify.DataStore.save
            .mockResolvedValueOnce(mockAssignment)
            .mockResolvedValue({ ...mockTask, status: tasksStatus.active });
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(screen.getByText("RIDER")).toBeInTheDocument();
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, mockUser.displayName);
        const option = screen.getByText(mockUser.displayName);
        expect(option).toBeInTheDocument();
        userEvent.click(option);
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(2)
        );
        const expandLink = screen.getByText("Expand to see more");
        userEvent.click(expandLink);
        expect(
            screen.getByRole("link", {
                name: `${mockUser.displayName} ${mockUser.displayName}`,
            })
        ).toBeInTheDocument();
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
            expect.objectContaining({
                ..._.omit(mockAssignment, "id"),
                assignee: expect.objectContaining(_.omit(mockUser, "id")),
                task: expect.objectContaining(_.omit(mockTask, "id")),
            })
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
            expect.objectContaining({
                ..._.omit(mockTask, "id"),
                status: tasksStatus.active,
                riderResponsibility: expect.objectContaining(
                    _.omit(mockRiderResponsibility, "id")
                ),
            })
        );
        await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
        expect(mockDispatch).toHaveBeenCalledWith(
            displayInfoNotification("Task moved to ACTIVE")
        );
    });

    test("select and assign a coordinator", async () => {
        const mockUser = new models.User(fakeUsers[0]);
        const mockTask = new models.Task({});
        const mockAssignment = new models.TaskAssignee({
            assignee: mockUser,
            task: mockTask,
            role: userRoles.coordinator,
        });
        // mock no assignments
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            //fakeUser mock resolve twice for role select refreshing picker component
            .mockResolvedValueOnce(fakeUsers)
            .mockResolvedValueOnce(fakeUsers)
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(fakeUsers);
        amplify.DataStore.save
            .mockResolvedValueOnce(mockAssignment)
            .mockResolvedValue(mockTask);
        render(<TaskAssignmentsPanel taskId="eee" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(screen.getByText("RIDER")).toBeInTheDocument();
        const selectMenuButton = screen.getByRole("button", {
            name: "Role RIDER",
        });
        userEvent.click(selectMenuButton);
        const roleOption = screen.getByText("COORDINATOR");
        userEvent.click(roleOption);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, mockUser.displayName);
        const option = screen.getByText(mockUser.displayName);
        expect(option).toBeInTheDocument();
        userEvent.click(option);
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        expect(
            screen.getByRole("link", {
                name: `${mockUser.displayName} ${mockUser.displayName}`,
            })
        ).toBeInTheDocument();
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
            expect.objectContaining({
                ..._.omit(mockAssignment, "id"),
                assignee: expect.objectContaining(_.omit(mockUser, "id")),
                task: expect.objectContaining(_.omit(mockTask, "id")),
            })
        );
    });

    test("get assignments failure", async () => {
        amplify.DataStore.query.mockRejectedValueOnce(new Error("test"));
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test("failure on assigning a user", async () => {
        const mockUser = new models.User(fakeUsers[0]);
        const mockTask = new models.Task({});
        amplify.DataStore.query
            .mockResolvedValueOnce([fakeAssignments[1]])
            .mockResolvedValueOnce(fakeUsers)
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(fakeUsers);
        amplify.DataStore.save.mockRejectedValueOnce(new Error("test"));
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(screen.getByText("RIDER")).toBeInTheDocument();
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, mockUser.displayName);
        const option = screen.getByText(mockUser.displayName);
        expect(option).toBeInTheDocument();
        userEvent.click(option);
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
        expect(mockDispatch).toHaveBeenCalledWith(
            displayErrorNotification(errorMessage)
        );
    });

    it("deletes a coordinator assignment", async () => {
        const mockAssignment = new models.TaskAssignee(fakeAssignments[1]);
        const mockTask = new models.Task({ status: tasksStatus.new });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockAssignment])
            .mockResolvedValueOnce(fakeUsers)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockAssignment);
        amplify.DataStore.delete.mockResolvedValueOnce(mockAssignment);
        amplify.DataStore.save.mockResolvedValueOnce({
            ...mockTask,
            status: tasksStatus.new,
        });
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2)
        );
        userEvent.click(screen.getByRole("button", { name: "delete" }));
        await waitFor(() =>
            expect(amplify.DataStore.delete).toHaveBeenCalledTimes(1)
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.delete).toHaveBeenCalledWith(mockAssignment);
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...mockTask,
            status: tasksStatus.new,
        });
    });

    it("deletes a rider assignment", async () => {
        const mockAssignment = new models.TaskAssignee(fakeAssignments[0]);
        const mockTask = new models.Task({ status: tasksStatus.active });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockAssignment])
            .mockResolvedValueOnce(fakeUsers)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockAssignment);
        amplify.DataStore.delete.mockResolvedValueOnce(mockAssignment);
        amplify.DataStore.save.mockResolvedValueOnce({
            ...mockTask,
            status: tasksStatus.new,
        });
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        userEvent.click(screen.getByText("Expand to see more"));
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2)
        );
        userEvent.click(screen.getByRole("button", { name: "delete" }));
        await waitFor(() =>
            expect(amplify.DataStore.delete).toHaveBeenCalledTimes(1)
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(2)
        );
        expect(amplify.DataStore.delete).toHaveBeenCalledWith(mockAssignment);
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...mockTask,
            status: tasksStatus.new,
        });
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...mockTask,
            riderResponsibility: null,
        });
    });

    it("deletes a rider assignment with multiple riders", async () => {
        const mockAssignment = new models.TaskAssignee(fakeAssignments[0]);
        const mockAssignment2 = new models.TaskAssignee({
            ...fakeAssignments[0],
            id: "anotherId",
        });
        const mockRiderResponsibility = new models.RiderResponsibility({
            label: "Something",
        });
        const mockTask = new models.Task({ status: tasksStatus.active });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockAssignment, mockAssignment2])
            .mockResolvedValueOnce(fakeUsers)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockAssignment)
            .mockResolvedValue(mockRiderResponsibility);
        amplify.DataStore.delete.mockResolvedValueOnce(mockAssignment);
        amplify.DataStore.save.mockResolvedValueOnce({
            ...mockTask,
            status: tasksStatus.new,
        });
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        userEvent.click(screen.getByText("Expand to see more"));
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2)
        );
        const deleteButtons = await screen.findAllByRole("button", {
            name: "delete",
        });
        expect(deleteButtons).toHaveLength(2);
        userEvent.click(deleteButtons[0]);
        await waitFor(() =>
            expect(amplify.DataStore.delete).toHaveBeenCalledTimes(1)
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(2)
        );
        expect(amplify.DataStore.delete).toHaveBeenCalledWith(mockAssignment);
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...mockTask,
            status: tasksStatus.active,
        });
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...mockTask,
            riderResponsibility: mockRiderResponsibility,
        });
    });

    test("delete assignment error", async () => {
        amplify.DataStore.query
            .mockResolvedValueOnce(fakeAssignments)
            .mockResolvedValueOnce(fakeUsers)
            .mockRejectedValue(new Error("test error"));
        render(<TaskAssignmentsPanel taskId="test" />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        userEvent.click(screen.getByText("Expand to see more"));
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2)
        );
        const deleteButtons = await screen.findAllByRole("button", {
            name: "delete",
        });
        expect(deleteButtons).toHaveLength(2);
        userEvent.click(deleteButtons[0]);
        await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
        expect(mockDispatch).toHaveBeenCalledWith(
            displayErrorNotification(errorMessage)
        );
    });
});
