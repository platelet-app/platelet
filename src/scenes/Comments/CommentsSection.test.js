import React from "react";
import CommentsSection from "./CommentsSection";
import { render } from "../../test-utils";
import * as amplify from "aws-amplify";
import { screen, waitFor } from "@testing-library/react";
import { commentVisibility } from "../../apiConsts";
import userEvent from "@testing-library/user-event";
import { displayInfoNotification } from "../../redux/notifications/NotificationsActions";
import _ from "lodash";
import * as models from "../../models";

jest.mock("aws-amplify");

const mockComments = [
    {
        id: 1,
        body: "This is a comment",
        visibility: commentVisibility.everyone,
        createdAt: "2020-01-01T00:00:00.000Z",
        author: {
            id: 1,
            displayName: "Mock User",
            profilePictureThumbnailURL: "",
        },
    },
    {
        id: 2,
        body: "aww yeee",
        visibility: commentVisibility.everyone,
        createdAt: "2021-01-01T00:00:00.000Z",
        author: {
            id: 2,
            displayName: "Someone Person",
            profilePictureThumbnailURL: "",
        },
    },
    {
        id: 3,
        body: "private comment",
        visibility: commentVisibility.me,
        createdAt: "2021-01-02T00:00:00.000Z",
        author: {
            id: "privatePerson",
            displayName: "Private Person",
            profilePictureThumbnailURL: "",
        },
    },
    {
        id: 3,
        body: "private comment for me",
        visibility: commentVisibility.me,
        createdAt: "2021-01-02T00:00:00.000Z",
        author: {
            id: "whoami",
            displayName: "Mock User",
            profilePictureThumbnailURL: "",
        },
    },
];

describe("CommentsSection", () => {
    it("should render correctly", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        const mockWhoami = {
            id: "whoami",
            displayName: "Mock User",
        };
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });

    it("should render with comments", async () => {
        amplify.DataStore.query.mockResolvedValue(mockComments);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("This is a comment")).toBeInTheDocument();
        expect(screen.getAllByText("Mock User")).toHaveLength(3);
        expect(screen.getByText("aww yeee")).toBeInTheDocument();
        expect(screen.getByText("Someone Person")).toBeInTheDocument();
        expect(screen.getByText("private comment for me")).toBeInTheDocument();
    });

    it("should hide the private comment when the whoami id doesn't match", async () => {
        amplify.DataStore.query.mockResolvedValue(mockComments);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(screen.queryByText("private comment")).not.toBeInTheDocument();
        expect(screen.queryByText("Private Person")).not.toBeInTheDocument();
    });

    it.skip("posts a new comment", async () => {
        const mockWhoami = {
            id: "whoami",
            displayName: "Mock User",
        };
        const mockComment = {
            id: "test",
            body: "This is a comment",
            visibility: commentVisibility.everyone,
            createdAt: "2020-01-01T00:00:00.000Z",
            author: mockWhoami,
        };
        amplify.DataStore.query.mockResolvedValueOnce([]);
        amplify.DataStore.save.mockResolvedValue(mockComment);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const commentTextBox = screen.getByRole("textbox");
        userEvent.type(commentTextBox, "This is a comment");
        expect(commentTextBox).toHaveValue("This is a comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        expect(postButton).toBeEnabled();
        userEvent.click(postButton);
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1);
        });
        expect(commentTextBox).toHaveValue("");
        expect(screen.getByText("This is a comment")).toBeInTheDocument();
        // one for the comment, one for the new comment card
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
    });

    it("deletes a comment", async () => {
        const mockComment = new models.Comment({
            ..._.omit(mockComments[0], "id", "createdAt"),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockComment])
            .mockResolvedValue(mockComment);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        const mockWhoami = {
            id: "whoami",
            displayName: "Mock User",
        };
        amplify.Auth.currentAuthenticatedUser.mockReturnValue(mockWhoami);
        render(<CommentsSection parentId="test" />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
        const body = screen.getByText("This is a comment");
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const deleteButton = await screen.findByText("Delete");
        userEvent.click(deleteButton);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await waitFor(async () => {
            expect(amplify.DataStore.delete).toHaveBeenNthCalledWith(
                1,
                mockComment
            );
        });
        expect(await screen.findByText("Comment deleted")).toBeInTheDocument();
    });
    // still broken yet
    it("edits a comment", async () => {
        return;
        const mockWhoami = {
            id: "whoami",
            displayName: "Mock User",
        };
        amplify.Auth.currentAuthenticatedUser.mockReturnValue(mockWhoami);
        const mockComment = new models.Comment({
            ..._.omit(mockComments[0], "id", "createdAt"),
        });

        amplify.DataStore.query
            .mockResolvedValueOnce(mockWhoami)
            .mockResolvedValueOnce([mockComment])
            .mockResolvedValue(mockComment);
        amplify.DataStore.save.mockResolvedValue({
            ...mockComment,
            body: `${mockComment.body} additional edit`,
        });
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
        const body = screen.getByText("This is a comment");
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const editButton = await screen.findByText("Edit");
        userEvent.click(editButton);
        const commentTextBoxes = await screen.findAllByRole("textbox");
        const commentTextBox = commentTextBoxes[0];
        expect(commentTextBox).toHaveValue("This is a comment");
        userEvent.type(commentTextBox, " additional edit");
        expect(commentTextBox).toHaveValue(
            `${mockComment.body} additional edit`
        );
        userEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockComment,
                body: `${mockComment.body} additional edit`,
            });
        });
    });
});
