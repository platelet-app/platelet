import { DataStore } from "aws-amplify";
import { render, waitFor, screen, fireEvent } from "../../test-utils";
import * as models from "../../models";
import CommentsSection from "./CommentsSection";

const tenantId = "test-tenant-id";
const dateCreated = new Date().toISOString().split("T")[0];

describe("CommentsSection", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
    });

    afterEach(async () => {
        await DataStore.clear();
    });

    beforeAll(async () => {
        jest.useFakeTimers();
    });

    test("show comments and respond to changes", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const anotherUser = await DataStore.save(
            new models.User({
                tenantId,
                name: "another user",
                displayName: "another user",
                username: "another user",
                cognitoId: "anotherCognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const comment = await DataStore.save(
            new models.Comment({
                tenantId,
                body: "test comment",
                parentId: task.id,
                visibility: models.CommentVisibility.EVERYONE,
                author: whoami,
            })
        );
        const comment2 = await DataStore.save(
            new models.Comment({
                tenantId,
                body: "another",
                parentId: task.id,
                visibility: models.CommentVisibility.EVERYONE,
                author: anotherUser,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        render(<CommentsSection parentId={task.id} />, { preloadedState });
        await screen.findByText("test comment");
        // HoldItem component renders comments twice (for animation?)
        screen.getByText(`${comment.body}`);
        screen.getByText(`${comment2.body}`);
        screen.getByText(`${whoami.displayName}`);
        screen.getByText(`${anotherUser.displayName}`);
        await DataStore.save(
            models.Comment.copyOf(comment, (updated) => {
                updated.body = "updated comment";
            })
        );
        await waitFor(() => screen.getByText("updated comment"), {
            timeout: 5000,
        });
        await DataStore.delete(comment2);
        await waitFor(
            () => {
                expect(screen.queryByText(`${comment2.body}`)).toBeNull();
            },
            { timeout: 5000 }
        );
        await DataStore.save(
            new models.Comment({
                tenantId,
                body: "boop",
                parentId: task.id,
                visibility: models.CommentVisibility.EVERYONE,
                author: anotherUser,
            })
        );
        await waitFor(() => screen.getByText("boop"), { timeout: 5000 });
        screen.getByText(`${anotherUser.displayName}`);
    });
    test("don't show private comments for another user", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const anotherUser = await DataStore.save(
            new models.User({
                tenantId,
                name: "another user",
                displayName: "another user",
                username: "another user",
                cognitoId: "anotherCognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        await DataStore.save(
            new models.Comment({
                tenantId,
                body: "private comment",
                parentId: task.id,
                visibility: models.CommentVisibility.ME,
                author: anotherUser,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        render(<CommentsSection parentId={task.id} />, { preloadedState });
        await expect(
            screen.findByText("private comment", {}, { timeout: 5000 })
        ).rejects.toThrow();
        await DataStore.save(
            new models.Comment({
                tenantId,
                body: "boop",
                parentId: task.id,
                visibility: models.CommentVisibility.ME,
                author: anotherUser,
            })
        );
        await expect(
            screen.findByText("boop", {}, { timeout: 5000 })
        ).rejects.toThrow();
    });
    test("show your own private comments", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        await DataStore.save(
            new models.Comment({
                tenantId,
                body: "private comment",
                parentId: task.id,
                visibility: models.CommentVisibility.ME,
                author: whoami,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        render(<CommentsSection parentId={task.id} />, { preloadedState });
        await screen.findByText("private comment", {}, { timeout: 5000 });
        await DataStore.save(
            new models.Comment({
                tenantId,
                body: "boop",
                parentId: task.id,
                visibility: models.CommentVisibility.ME,
                author: whoami,
            })
        );
        await screen.findByText("boop", {}, { timeout: 5000 });
    });
    test("post a comment and private comment", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        const expectedComment = new models.Comment({
            tenantId,
            body: "test comment",
            parentId: task.id,
            visibility: models.CommentVisibility.EVERYONE,
            author: whoami,
        });
        const expectedPrivateComment = new models.Comment({
            tenantId,
            body: "private comment",
            parentId: task.id,
            visibility: models.CommentVisibility.ME,
            author: whoami,
        });
        render(<CommentsSection parentId={task.id} />, { preloadedState });
        const input = screen.getByPlaceholderText("Write a comment...");
        fireEvent(input, "onChangeText", "test comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        fireEvent(postButton, "onPress");
        expect(postButton).toBeDisabled();
        await waitFor(() =>
            expect(saveSpy).toHaveBeenCalledWith({
                ...expectedComment,
                id: expect.any(String),
            })
        );
        const privateButton = screen.getByRole("button", { name: "ME" });
        fireEvent(input, "onChangeText", "private comment");
        fireEvent(privateButton, "onPress");
        fireEvent(postButton, "onPress");
        await waitFor(() =>
            expect(saveSpy).toHaveBeenCalledWith({
                ...expectedPrivateComment,
                id: expect.any(String),
            })
        );
        await screen.findByText("private comment", {}, { timeout: 5000 });
        screen.getByText("test comment");
        expect(input).toHaveProp("value", "");
    });
    test("post a comment failure", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        jest.spyOn(DataStore, "save").mockRejectedValue(new Error("error"));
        render(<CommentsSection parentId={task.id} />, { preloadedState });
        const input = screen.getByPlaceholderText("Write a comment...");
        fireEvent(input, "onChangeText", "test comment");
        const postButton = screen.getByRole("button", { name: "Post" });
        fireEvent(postButton, "onPress");
        expect(postButton).toBeDisabled();
        await screen.findByText("Sorry, something went wrong");
    });
    test("edit a comment", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const comment = await DataStore.save(
            new models.Comment({
                tenantId,
                body: "some comment",
                parentId: task.id,
                visibility: models.CommentVisibility.EVERYONE,
                author: whoami,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<CommentsSection parentId={task.id} />, { preloadedState });
        await screen.findByText("some comment", {}, { timeout: 5000 });
        const menu = screen.getByRole("button", { name: "Comment menu" });
        fireEvent(menu, "onPress");
        const editButton = await screen.findByText("Edit");
        fireEvent(editButton, "onPress");
        const textInput = screen.getByDisplayValue("some comment");
        fireEvent(textInput, "onChangeText", "edited comment");
        const saveButton = screen.getByRole("button", { name: "Save" });
        fireEvent(saveButton, "onPress");
        await screen.findByText("edited comment", {}, { timeout: 5000 });
        expect(saveSpy).toHaveBeenCalledWith({
            ...comment,
            body: "edited comment",
        });
    });
    test("delete a comment", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const comment = await DataStore.save(
            new models.Comment({
                tenantId,
                body: "some comment",
                parentId: task.id,
                visibility: models.CommentVisibility.EVERYONE,
                author: whoami,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(<CommentsSection parentId={task.id} />, { preloadedState });
        await screen.findByText("some comment", {}, { timeout: 5000 });
        const menu = screen.getByRole("button", { name: "Comment menu" });
        fireEvent(menu, "onPress");
        const editButton = await screen.findByText("Delete");
        fireEvent(editButton, "onPress");
        await expect(screen.getAllByText("some comment")).toHaveLength(2);
        const saveButton = screen.getByRole("button", { name: "Delete" });
        fireEvent(saveButton, "onPress");
        const expected = { ...comment, body: "" };
        await waitFor(() => expect(deleteSpy).toHaveBeenCalledWith(expected));
        expect(saveSpy).toHaveBeenCalledWith(expected);
        await waitFor(
            () => {
                expect(screen.queryByText("some comment")).toBeNull();
            },
            { timeout: 5000 }
        );
    });
    test("unsubscribe observer on unmount", async () => {
        const unsubscribe = jest.fn();
        jest.spyOn(DataStore, "observeQuery").mockImplementation(() => {
            return {
                subscribe: (callback: any) => {
                    callback({ items: [] });
                    return {
                        unsubscribe,
                    };
                },
            };
        });
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                name: "test user",
                displayName: "test user",
                username: "test user",
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        const { component } = render(<CommentsSection parentId={task.id} />, {
            preloadedState,
        });
        component.unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });
});
