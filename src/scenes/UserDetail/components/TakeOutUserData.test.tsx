import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../../test-utils";
import TakeOutUserData from "./TakeOutUserData";
import * as models from "@platelet-app/models";
import { queries } from "@platelet-app/graphql";
import { API } from "aws-amplify";

const tenantId = "tenant-id";

describe("TakeOutData", () => {
    test("take out some data", async () => {
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        const fakeUser = new models.User({
            username: "test",
            cognitoId: "subid",
            tenantId,
            displayName: "test",
            roles: [models.Role.USER],
        });

        const preloadedState = {
            whoami: { user: fakeUser },
            tenantId,
        };
        render(<TakeOutUserData user={fakeUser} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Take out data" });
        expect(button).toBeEnabled();
        userEvent.click(button);
        expect(
            screen.getByText(
                /It will be sent to your registered email address./
            )
        ).toBeInTheDocument();
        const confirmButton = screen.getByRole("button", {
            name: "Send my data",
        });
        userEvent.click(confirmButton);
        expect(confirmButton).toHaveProperty("disabled");
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: queries.userTakeOutData,
                variables: {
                    userId: fakeUser.id,
                },
            });
        });
    });
    test("admin take out some data for another user", async () => {
        const whoami = new models.User({
            tenantId,
            cognitoId: "cognitoId",
            roles: [models.Role.USER, models.Role.ADMIN],
            username: "username",
            displayName: "displayName",
        });
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        const fakeUser = new models.User({
            username: "test",
            cognitoId: "subid",
            tenantId,
            displayName: "test",
            roles: [models.Role.USER],
        });

        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        render(<TakeOutUserData user={fakeUser} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Take out data" });
        expect(button).toBeEnabled();
        userEvent.click(button);
        expect(
            screen.getByText(
                /It will be sent to the registered email address on their account./
            )
        ).toBeInTheDocument();
        const confirmButton = screen.getByRole("button", {
            name: "Send my data",
        });
        userEvent.click(confirmButton);
        expect(confirmButton).toHaveProperty("disabled");
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: queries.userTakeOutData,
                variables: {
                    userId: fakeUser.id,
                },
            });
        });
    });
});
