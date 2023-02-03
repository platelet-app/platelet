import React from "react";
import CommentsSection from "./CommentsSection";
import { render, testUser } from "../../test-utils";
import * as amplify from "aws-amplify";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import * as models from "../../models";
import { v4 as uuidv4 } from "uuid";
import { DataStore } from "aws-amplify";

const fakeUsers = _.range(0, 3).map((i) => {
    return new models.User({
        displayName: `User ${i}`,
    });
});

const parentId = uuidv4();

const mockUser = new models.User({
    displayName: "Mock User",
    roles: [models.Role.USER, models.Role.COORDINATOR],
});

const tenantId = "tenantId";

const preloadedState = { tenantId, whoami: { user: mockUser } };

async function savePublicComments() {
    const mockPublicComments = _.range(0, 3).map(async (i) => {
        const author = await DataStore.save(
            new models.User({
                displayName: `User ${i}`,
            })
        );
        return await DataStore.save(
            new models.Comment({
                body: uuidv4(),
                parentId,
                visibility: models.CommentVisibility.EVERYONE,
                author,
            })
        );
    });
    return await Promise.all(mockPublicComments);
}
async function savePrivateComments() {
    const mockPrivateComments = _.range(0, 3).map(async (i) => {
        const author = await DataStore.save(
            new models.User({
                displayName: `User ${i}`,
            })
        );
        return await DataStore.save(
            new models.Comment({
                body: uuidv4(),
                parentId,
                visibility: models.CommentVisibility.ME,
                author,
            })
        );
    });
    return await Promise.all(mockPrivateComments);
}

describe("CommentsSection", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
    });
    beforeEach(async () => {
        await DataStore.save(mockUser);
    });
    it("should render correctly", async () => {
        render(<CommentsSection parentId="test" />);
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
    });

    it("should render with comments", async () => {
        const mockPublicComments = await savePublicComments();
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        for (const comment of mockPublicComments) {
            expect(screen.getByText(comment.body)).toBeInTheDocument();
        }
        const mockPublicCommentsResolved = await Promise.all(
            mockPublicComments.map(async (c) => {
                const author = await c.author;
                return { ...c, author };
            })
        );
        for (const comment of mockPublicCommentsResolved) {
            expect(
                screen.getByText(comment.author.displayName)
            ).toBeInTheDocument();
        }
    });

    it("should hide the private comment when the whoami id doesn't match", async () => {
        const mockPrivateComments = await savePrivateComments();
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        for (const comment of mockPrivateComments) {
            expect(screen.queryByText(comment.body)).toBeNull();
        }
    });

    it("should show the private comment when the whoami id matches", async () => {
        const author = mockUser;
        const mockPrivateComments = await savePrivateComments();
        const mockPrivateCommentsForMe = mockPrivateComments.map((comment) => {
            return new models.Comment({
                ...comment,
                body: uuidv4(),
                author,
            });
        });
        await Promise.all(
            mockPrivateCommentsForMe.map((comment) => DataStore.save(comment))
        );
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        for (const comment of mockPrivateCommentsForMe) {
            expect(screen.getByText(comment.body)).toBeInTheDocument();
        }
        for (const comment of mockPrivateComments) {
            expect(screen.queryByText(comment.body)).toBeNull();
        }
    });

    it("posts a new comment", async () => {
        const author = mockUser;
        const mockComment = new models.Comment({
            body: "This is a comment",
            visibility: models.CommentVisibility.EVERYONE,
            author,
            tenantId,
            parentId,
        });
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        const commentTextBox = screen.getByRole("textbox");
        userEvent.type(commentTextBox, "This is a comment");
        expect(commentTextBox).toHaveValue("This is a comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        expect(postButton).toBeEnabled();
        userEvent.click(postButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockComment,
                id: expect.any(String),
            });
        });
        expect(commentTextBox).toHaveValue("");
        expect(postButton).toBeDisabled();
        expect(screen.getByText("This is a comment")).toBeInTheDocument();
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
    });

    it("posts a private comment", async () => {
        const author = mockUser;
        const mockComment = new models.Comment({
            body: "This is a comment",
            visibility: models.CommentVisibility.ME,
            author,
        });
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        userEvent.click(screen.getByText("ONLY ME"));
        const commentTextBox = screen.getByRole("textbox");
        userEvent.type(commentTextBox, "This is a comment");
        expect(commentTextBox).toHaveValue("This is a comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        expect(postButton).toBeEnabled();
        userEvent.click(postButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining(_.omit(mockComment, "id"))
            );
        });
        expect(commentTextBox).toHaveValue("");
        expect(postButton).toBeDisabled();
        expect(screen.getByText("This is a comment")).toBeInTheDocument();
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
    });

    it("deletes a comment", async () => {
        const mockCommentInput = new models.Comment({
            body: "This is a comment",
            tenantId,
            author: mockUser,
            parentId,
            visibility: models.CommentVisibility.EVERYONE,
        });
        const mockComment = await DataStore.save(mockCommentInput);
        const deleteSpy = jest.spyOn(DataStore, "delete");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        const author = await mockComment.author;
        expect(screen.getAllByText(author.displayName)).toHaveLength(2);
        const body = screen.getByText(mockComment.body);
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const deleteButton = await screen.findByText("Delete");
        userEvent.click(deleteButton);
        userEvent.click(await screen.findByText("OK"));
        await waitFor(() => {
            expect(deleteSpy).toHaveBeenNthCalledWith(1, mockComment);
        });
        await waitFor(
            () => {
                expect(screen.queryByText(mockComment.body)).toBeNull();
            },
            { timeout: 10000 }
        );
        expect(await screen.findByText("Comment deleted")).toBeInTheDocument();
    });

    it("cancel deleting a comment", async () => {
        const mockCommentInput = new models.Comment({
            body: "This is a comment",
            tenantId,
            author: mockUser,
            parentId,
            visibility: models.CommentVisibility.EVERYONE,
        });
        const mockComment = await DataStore.save(mockCommentInput);
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        const author = await mockComment.author;
        expect(screen.getAllByText(author.displayName)).toHaveLength(2);
        const body = screen.getByText(mockComment.body);
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const deleteButton = await screen.findByText("Delete");
        userEvent.click(deleteButton);
        userEvent.click(await screen.findByText("Cancel"));
        await waitFor(() => {
            expect(deleteSpy).toHaveBeenCalledTimes(0);
        });
        await waitFor(() => {
            expect(screen.queryByText(mockComment.body)).toBeInTheDocument();
        });
    });

    it("discard an in progress comment", async () => {
        const mockTask = await DataStore.save(new models.Task({}));
        render(<CommentsSection parentId={mockTask.id} />);
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, "This is a comment");
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(textBox).toHaveValue("This is a comment");
        userEvent.click(screen.getByText("OK"));
        expect(textBox).toHaveValue("");
    });

    test("observing a new comment", async () => {
        const mockAuthor = await DataStore.save(
            new models.User({
                displayName: "Mock User",
            })
        );
        const mockTask = await DataStore.save(new models.Task({}));
        const mockComment = new models.Comment({
            body: "This is a comment",
            author: mockAuthor,
            visibility: models.CommentVisibility.EVERYONE,
            parentId: mockTask.id,
        });
        render(<CommentsSection parentId={mockTask.id} />);
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        await DataStore.save(mockComment);
        await waitFor(
            () => {
                expect(screen.getByText(mockComment.body)).toBeInTheDocument();
            },
            { timeout: 10000 }
        );
    });

    test("observing editing a comment", async () => {
        const mockAuthor = await DataStore.save(
            new models.User({
                displayName: "Mock User",
            })
        );
        const mockTask = await DataStore.save(new models.Task({}));
        const mockComment = await DataStore.save(
            new models.Comment({
                body: "This is a comment",
                author: mockAuthor,
                visibility: models.CommentVisibility.EVERYONE,
                parentId: mockTask.id,
            })
        );
        render(<CommentsSection parentId={mockTask.id} />);
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });

        await DataStore.save(
            models.Comment.copyOf(mockComment, (updated) => {
                updated.body = "This is an edited comment";
            })
        );
        await waitFor(
            () => {
                expect(
                    screen.getByText("This is an edited comment")
                ).toBeInTheDocument();
            },
            { timeout: 10000 }
        );
    });

    test("observing deleting a comment", async () => {
        const mockAuthor = await DataStore.save(
            new models.User({
                displayName: "Mock User",
            })
        );
        const mockTask = await DataStore.save(new models.Task({}));
        const mockComment = await DataStore.save(
            new models.Comment({
                body: "This is a comment",
                author: mockAuthor,
                visibility: models.CommentVisibility.EVERYONE,
                parentId: mockTask.id,
            })
        );
        render(<CommentsSection parentId={mockTask.id} />);
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        expect(screen.getByText(mockComment.body)).toBeInTheDocument();
        await DataStore.delete(mockComment);
        await waitFor(
            () => {
                expect(screen.queryByText(mockComment.body)).toBeNull();
            },
            { timeout: 10000 }
        );
    });

    it("unsubscribes on unmount", async () => {
        const unsubscribe = jest.fn();
        const observeSpy = jest
            .spyOn(amplify.DataStore, "observeQuery")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });

        const { component } = render(<CommentsSection parentId="something" />);
        await waitFor(() => {
            expect(observeSpy).toHaveBeenCalledTimes(1);
        });
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it("edits a comment", async () => {
        const mockTask = await DataStore.save(new models.Task({}));
        const mockComment = await DataStore.save(
            new models.Comment({
                body: "This is a comment",
                author: mockUser,
                visibility: models.CommentVisibility.EVERYONE,
                parentId: mockTask.id,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(screen.queryByTestId("fetching-comments")).toBeNull();
        });
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
        const body = screen.getByText(mockComment.body);
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const editButton = await screen.findByText("Edit");
        userEvent.click(editButton);
        const commentTextBox = screen.getByTestId("edit-comment-textbox");
        expect(commentTextBox).toHaveValue("This is a comment");
        userEvent.type(commentTextBox, " additional edit");
        expect(commentTextBox).toHaveValue(
            `${mockComment.body} additional edit`
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockComment,
                body: `${mockComment.body} additional edit`,
            });
        });
    });
});
