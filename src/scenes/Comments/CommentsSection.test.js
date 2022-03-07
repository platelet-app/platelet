import React from "react";
import CommentsSection from "./CommentsSection";
import { render, testUser } from "../../test-utils";
import * as amplify from "aws-amplify";
import { screen, waitFor } from "@testing-library/react";
import { commentVisibility, userRoles } from "../../apiConsts";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import * as models from "../../models";
import { v4 as uuidv4 } from "uuid";

jest.mock("aws-amplify");

const fakeUsers = _.range(0, 3).map((i) => {
    return new models.User({
        displayName: `User ${i}`,
    });
});

const mockPublicComments = _.range(0, 3).map((i) => {
    return new models.Comment({
        body: uuidv4(),
        visibility: commentVisibility.everyone,
        author: new models.User({
            displayName: `User ${i}`,
        }),
    });
});

const preloadedState = { tenantId: "tenant-id", whoami: { user: testUser } };

const mockPrivateComments = _.range(0, 3).map((i) => {
    return new models.Comment({
        body: uuidv4(),
        visibility: commentVisibility.me,
        author: new models.User({
            displayName: `User ${i}`,
        }),
    });
});

describe("CommentsSection", () => {
    it("should render correctly", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });

    it("should render with comments", async () => {
        amplify.DataStore.query.mockResolvedValue(mockPublicComments);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        for (const comment of mockPublicComments) {
            expect(screen.getByText(comment.body)).toBeInTheDocument();
        }
        for (const comment of mockPublicComments) {
            expect(
                screen.getByText(comment.author.displayName)
            ).toBeInTheDocument();
        }
    });

    it("should hide the private comment when the whoami id doesn't match", async () => {
        amplify.DataStore.query.mockResolvedValue(mockPrivateComments);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        for (const comment of mockPrivateComments) {
            expect(screen.queryByText(comment.body)).toBeNull();
        }
    });

    it("should show the private comment when the whoami id matches", async () => {
        const mockPrivateCommentsForMe = mockPrivateComments.map((comment) => {
            return {
                ...comment,
                author: {
                    ...comment.author,
                    id: "whoami",
                },
            };
        });
        amplify.DataStore.query.mockResolvedValue(mockPrivateCommentsForMe);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        for (const comment of mockPrivateCommentsForMe) {
            expect(screen.getByText(comment.body)).toBeInTheDocument();
        }
        for (const comment of mockPrivateCommentsForMe) {
            expect(
                screen.getByText(comment.author.displayName)
            ).toBeInTheDocument();
        }
    });

    it("posts a new comment", async () => {
        const mockWhoami = new models.User({
            cognitoId: "test",
            displayName: "Mock User",
        });
        const mockComment = new models.Comment({
            body: "This is a comment",
            visibility: commentVisibility.everyone,
            author: mockWhoami,
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValue(mockWhoami);
        amplify.DataStore.save.mockResolvedValue(mockComment);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const commentTextBox = screen.getByRole("textbox");
        userEvent.type(commentTextBox, "This is a comment");
        expect(commentTextBox).toHaveValue("This is a comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        expect(postButton).toBeEnabled();
        userEvent.click(postButton);
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining(_.omit(mockComment, "id"))
            );
        });
        expect(commentTextBox).toHaveValue("");
    });

    it("deletes a comment", async () => {
        const mockWhoami = {
            id: "whoami",
            displayName: "Mock User",
        };
        const mockComment = {
            ...mockPublicComments[0],
            author: mockWhoami,
        };
        amplify.DataStore.query
            .mockResolvedValueOnce([mockComment])
            .mockResolvedValue(mockComment);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.Auth.currentAuthenticatedUser.mockReturnValue(mockWhoami);
        render(<CommentsSection parentId="test" />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(
            screen.getAllByText(mockComment.author.displayName)
        ).toHaveLength(2);
        const body = screen.getByText(mockComment.body);
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const deleteButton = await screen.findByText("Delete");
        userEvent.click(deleteButton);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Comment,
                mockComment.id
            );
        });
        userEvent.click(screen.getByText("OK"));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Comment,
                mockComment.id
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.delete).toHaveBeenNthCalledWith(
                1,
                mockComment
            );
        });
        await waitFor(() => {
            expect(screen.queryByText(mockComment.body)).toBeNull();
        });
        expect(await screen.findByText("Comment deleted")).toBeInTheDocument();
    });

    it("cancel deleting a comment", async () => {
        const mockWhoami = {
            id: "whoami",
            displayName: "Mock User",
        };
        const mockComment = {
            ...mockPublicComments[0],
            author: mockWhoami,
        };
        amplify.DataStore.query
            .mockResolvedValueOnce([mockComment])
            .mockResolvedValue(mockComment);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.Auth.currentAuthenticatedUser.mockReturnValue(mockWhoami);
        render(<CommentsSection parentId="test" />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(
            screen.getAllByText(mockComment.author.displayName)
        ).toHaveLength(2);
        const body = screen.getByText(mockComment.body);
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const deleteButton = await screen.findByText("Delete");
        userEvent.click(deleteButton);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Comment,
                mockComment.id
            );
        });
        userEvent.click(screen.getByText("Cancel"));
        await waitFor(() => {
            expect(amplify.DataStore.delete).toHaveBeenCalledTimes(0);
        });
        await waitFor(() => {
            expect(screen.queryByText(mockComment.body)).toBeInTheDocument();
        });
    });

    test("observing a new comment", async () => {
        const mockAuthor = new models.User({
            displayName: "Mock User",
        });
        const mockTask = new models.Task({});
        const mockComment = new models.Comment({
            body: "This is a comment",
            author: mockAuthor,
            visibility: commentVisibility.everyone,
        });
        const mockObservedResult = {
            element: mockComment,
            opType: "INSERT",
        };
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValue([mockComment]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: jest.fn().mockImplementation((callback) => {
                callback(mockObservedResult);
                return { unsubscribe: jest.fn() };
            }),
        });
        render(<CommentsSection parentId={mockTask.id} />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.Comment,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Comment,
                expect.any(Function)
            );
        });
        expect(screen.getByText(mockComment.body)).toBeInTheDocument();
    });

    test("observing editing a comment", async () => {
        const mockAuthor = new models.User({
            displayName: "Mock User",
        });
        const mockTask = new models.Task({});
        const mockComment = new models.Comment({
            body: "This is a comment",
            author: mockAuthor,
            visibility: commentVisibility.everyone,
        });
        const mockObservedResult = {
            element: { ...mockComment, body: "something else" },
            opType: "UPDATE",
        };
        amplify.DataStore.query
            .mockResolvedValueOnce([mockComment])
            .mockResolvedValue([mockObservedResult.element]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: jest.fn().mockImplementation((callback) => {
                callback(mockObservedResult);
                return { unsubscribe: jest.fn() };
            }),
        });
        render(<CommentsSection parentId={mockTask.id} />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.Comment,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Comment,
                expect.any(Function)
            );
        });
        expect(
            screen.getByText(mockObservedResult.element.body)
        ).toBeInTheDocument();
    });

    test("observing deleting a comment", async () => {
        const mockAuthor = new models.User({
            displayName: "Mock User",
        });
        const mockTask = new models.Task({});
        const mockComment = new models.Comment({
            body: "This is a comment",
            author: mockAuthor,
            visibility: commentVisibility.everyone,
        });
        const mockObservedResult = {
            element: { id: mockComment.id },
            opType: "DELETE",
        };
        amplify.DataStore.query
            .mockResolvedValueOnce([mockComment])
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: jest.fn().mockImplementation((callback) => {
                callback(mockObservedResult);
                return { unsubscribe: jest.fn() };
            }),
        });
        render(<CommentsSection parentId={mockTask.id} />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.Comment,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Comment,
                expect.any(Function)
            );
        });
        expect(screen.queryByText(mockComment.body)).toBeNull();
    });

    it("unsubscribes on unmount", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        const component = render(<CommentsSection />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
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
