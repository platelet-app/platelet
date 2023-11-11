import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import { render, screen } from "../test-utils";
import UsersList from "./UsersList";
import userEvent from "@testing-library/user-event";

const tenantId = "test-tenant";

describe("UsersList", () => {
    afterEach(async () => {
        await DataStore.clear();
    });
    it("should list the users. toggle disabled users.", async () => {
        await DataStore.save(
            new models.User({
                name: "user1",
                displayName: "Some Name",
                riderResponsibility: "some resp",
                tenantId,
                username: "user1",
                cognitoId: "user1",
                roles: [models.Role.RIDER],
            })
        );
        await DataStore.save(
            new models.User({
                name: "user2",
                displayName: "Another Person",
                tenantId,
                username: "user2",
                cognitoId: "user2",
                roles: [models.Role.COORDINATOR],
            })
        );
        const disabledUser = await DataStore.save(
            new models.User({
                name: "user3",
                displayName: "Disabled User",
                tenantId,
                disabled: 1,
                username: "user3",
                cognitoId: "user3",
                roles: [models.Role.COORDINATOR],
            })
        );
        render(<UsersList />);
        expect(await screen.findByText("Some Name")).toBeInTheDocument();
        expect(screen.getByText("Another Person")).toBeInTheDocument();
        expect(screen.getByText("some resp")).toBeInTheDocument();
        expect(screen.getByText("SN")).toBeInTheDocument();
        expect(screen.getByText("AP")).toBeInTheDocument();
        expect(screen.queryByText("Disabled User")).toBeNull();
        userEvent.click(
            screen.getByRole("checkbox", { name: "Show disabled" })
        );
        expect(screen.getByText("Disabled User")).toBeInTheDocument();
    });
    it("filter users.", async () => {
        await DataStore.save(
            new models.User({
                name: "user1",
                displayName: "Some Name",
                riderResponsibility: "some resp",
                tenantId,
                username: "user1",
                cognitoId: "user1",
                roles: [models.Role.RIDER],
            })
        );
        await DataStore.save(
            new models.User({
                name: "user2",
                displayName: "Another Person",
                tenantId,
                username: "user2",
                cognitoId: "user2",
                roles: [models.Role.COORDINATOR],
            })
        );
        await DataStore.save(
            new models.User({
                name: "user3",
                displayName: "Woop Woop",
                tenantId,
                username: "user3",
                cognitoId: "user3",
                roles: [models.Role.COORDINATOR],
            })
        );
        render(<UsersList />);
        expect(await screen.findByText("Some Name")).toBeInTheDocument();
        userEvent.type(screen.getByRole("textbox"), "woop");
        expect(screen.queryByText("Some Name")).toBeNull();
        expect(screen.queryByText("Another Person")).toBeNull();
        expect(screen.getByText("Woop Woop")).toBeInTheDocument();
    });
    it("observer responds.", async () => {
        render(<UsersList />);
        expect(screen.queryByText("Woop Woop")).toBeNull();
        await DataStore.save(
            new models.User({
                name: "user3",
                displayName: "Woop Woop",
                tenantId,
                username: "user3",
                cognitoId: "user3",
                roles: [models.Role.COORDINATOR],
            })
        );
        expect(await screen.findByText("Woop Woop")).toBeInTheDocument();
    });
});
