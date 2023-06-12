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
import { DataStore } from "aws-amplify";

const parentId = uuidv4();

const mockPublicComments = _.range(0, 3).map((i) => {
    return new models.Comment({
        body: uuidv4(),
        parentId,
        visibility: commentVisibility.everyone,
        author: new models.User({
            displayName: `User ${i}`,
        }),
    });
});

const mockUser = new models.User({
    displayName: "Mock User",
    roles: [userRoles.user, userRoles.coordinator],
});

const preloadedState = { tenantId: "tenant-id", whoami: { user: mockUser } };

const mockPrivateComments = _.range(0, 3).map((i) => {
    return new models.Comment({
        body: uuidv4(),
        parentId,
        visibility: commentVisibility.me,
        author: new models.User({
            displayName: `User ${i}`,
        }),
    });
});

async function savePublicComments() {
    await Promise.all(
        mockPublicComments.map((comment) => DataStore.save(comment))
    );
}
async function savePrivateComments() {
    await Promise.all(
        mockPrivateComments.map((comment) => DataStore.save(comment))
    );
}

describe("CommentsSection", () => {
    const finishLoading = async () => {
        await waitFor(() => {
            expect(screen.queryByTestId("comments-skeleton")).toBeNull();
        });
    };
    afterEach(async () => {
        jest.restoreAllMocks();
        const comments = await DataStore.query(models.Comment);
        await Promise.all(comments.map((c) => DataStore.delete(c)));
    });
    beforeAll(async () => {
        await DataStore.save(mockUser);
    });
    it("should render correctly", async () => {
        const mockTask = await DataStore.save(new models.Task({}));
        render(<CommentsSection parentId={mockTask.id} />);
        await finishLoading();
    });

    it("should render with comments", async () => {
        await savePublicComments();
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await finishLoading();
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
        await savePrivateComments();
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await finishLoading();
        for (const comment of mockPrivateComments) {
            expect(screen.queryByText(comment.body)).toBeNull();
        }
    });

    it("should show the private comment when the whoami id matches", async () => {
        const author = mockUser;
        await savePrivateComments();
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
        await finishLoading();
        for (const comment of mockPrivateCommentsForMe) {
            expect(screen.getByText(comment.body)).toBeInTheDocument();
        }
        for (const comment of mockPrivateComments) {
            expect(screen.queryByText(comment.body)).toBeNull();
        }
    });

    it("posts a new comment", async () => {
        const author = mockUser;
        const mockTask = await DataStore.save(new models.Task({}));
        const mockComment = new models.Comment({
            body: "This is a comment",
            visibility: commentVisibility.everyone,
            parentId: mockTask.id,
            tenantId: preloadedState.tenantId,
            author,
        });
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={mockTask.id} />, {
            preloadedState,
        });
        await finishLoading();
        const commentTextBox = screen.getByRole("textbox");
        userEvent.type(commentTextBox, "This is a comment");
        expect(commentTextBox).toHaveValue("This is a comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        expect(postButton).toBeEnabled();
        userEvent.click(postButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockComment,
                id: expect.any(String),
            });
        });
        expect(commentTextBox).toHaveValue("");
        expect(postButton).toBeDisabled();
        await waitFor(
            () => {
                expect(
                    screen.getByText("This is a comment")
                ).toBeInTheDocument();
            },
            { timeout: 10000 }
        );
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
    });

    it("posts a private comment", async () => {
        const mockTask = await DataStore.save(new models.Task({}));
        const author = mockUser;
        const mockComment = new models.Comment({
            body: "This is a comment",
            visibility: commentVisibility.me,
            tenantId: "tenant-id",
            parentId: mockTask.id,
            author,
        });
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={mockTask.id} />, {
            preloadedState,
        });
        await finishLoading();
        userEvent.click(screen.getByText("ONLY ME"));
        const commentTextBox = screen.getByRole("textbox");
        userEvent.type(commentTextBox, "This is a comment");
        expect(commentTextBox).toHaveValue("This is a comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        expect(postButton).toBeEnabled();
        userEvent.click(postButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockComment,
                id: expect.any(String),
            });
        });
        expect(commentTextBox).toHaveValue("");
        expect(postButton).toBeDisabled();
        await waitFor(
            () => {
                expect(
                    screen.getByText("This is a comment")
                ).toBeInTheDocument();
            },
            { timeout: 10000 }
        );
        expect(screen.getAllByText("Mock User")).toHaveLength(2);
    });

    it("deletes a comment", async () => {
        const mockCommentInput = new models.Comment({
            ...mockPublicComments[0],
            author: mockUser,
        });
        const mockComment = await DataStore.save(mockCommentInput);
        const deleteSpy = jest.spyOn(DataStore, "delete");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await finishLoading();
        expect(
            screen.getAllByText(mockComment.author.displayName)
        ).toHaveLength(2);
        const body = screen.getByText(mockComment.body);
        userEvent.hover(body);
        const contextMenu = await screen.findByTestId("comment-menu");
        userEvent.click(contextMenu);
        const deleteButton = await screen.findByText("Delete");
        userEvent.click(deleteButton);
        userEvent.click(await screen.findByText("OK"));
        const mockCommentCleared = { ...mockComment, body: "" };
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith(mockCommentCleared);
        });
        await waitFor(() => {
            expect(deleteSpy).toHaveBeenCalledWith(mockCommentCleared);
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
            ...mockPublicComments[0],
            author: mockUser,
        });
        const mockComment = await DataStore.save(mockCommentInput);
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(<CommentsSection parentId={parentId} />, {
            preloadedState,
        });
        await finishLoading();
        expect(
            screen.getAllByText(mockComment.author.displayName)
        ).toHaveLength(2);
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
        await finishLoading();
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, "This is a comment");
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(textBox).toHaveValue("This is a comment");
        userEvent.click(screen.getByText("OK"));
        expect(textBox).toHaveValue("");
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
            parentId: mockTask.id,
        });
        render(<CommentsSection parentId={mockTask.id} />);
        await finishLoading();
        expect(screen.queryByText(mockComment.body)).toBeNull();
        await DataStore.save(mockComment);
        await waitFor(
            () => {
                expect(screen.getByText(mockComment.body)).toBeInTheDocument();
            },
            { timeout: 10000 }
        );
    });

    test("observing editing a comment", async () => {
        const mockAuthor = new models.User({
            displayName: "Mock User",
        });
        const mockTask = new models.Task({});
        const mockComment = await DataStore.save(
            new models.Comment({
                body: "This is a comment",
                author: mockAuthor,
                visibility: commentVisibility.everyone,
                parentId: mockTask.id,
            })
        );
        render(<CommentsSection parentId={mockTask.id} />);
        await finishLoading();
        expect(screen.getByText(mockComment.body)).toBeInTheDocument();
        await DataStore.save(
            models.Comment.copyOf(mockComment, (updated) => {
                updated.body = "This is an updated comment";
            })
        );
        await waitFor(
            () => {
                expect(
                    screen.getByText("This is an updated comment")
                ).toBeInTheDocument();
            },
            { timeout: 10000 }
        );
    });

    test("observing deleting a comment", async () => {
        const mockAuthor = new models.User({
            displayName: "Mock User",
        });
        const mockTask = new models.Task({});
        const mockComment = await DataStore.save(
            new models.Comment({
                body: "This is a comment",
                author: mockAuthor,
                visibility: commentVisibility.everyone,
                parentId: mockTask.id,
            })
        );
        render(<CommentsSection parentId={mockTask.id} />);
        await finishLoading();
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
        const mockTask = await DataStore.save(new models.Task({}));
        const unsubscribe = jest.fn();
        const observeSpy = jest
            .spyOn(amplify.DataStore, "observe")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        const { component } = render(
            <CommentsSection parentId={mockTask.id} />
        );
        await waitFor(() => {
            expect(screen.queryByTestId("comments-skeleton")).toBeNull();
        });
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
                visibility: commentVisibility.everyone,
                parentId: mockTask.id,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={mockTask.id} />, { preloadedState });
        await finishLoading();
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
