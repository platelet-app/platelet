import React from "react";
import { render } from "../../test-utils";
import LightToggleProfileMenu from "./LightToggleProfileMenu";
import { screen, waitFor } from "@testing-library/react";
import * as amplify from "aws-amplify";
import * as models from "../../models";
import * as queries from "../../graphql/queries";
import userEvent from "@testing-library/user-event";
import { encodeUUID } from "../../utilities";

jest.mock("aws-amplify");

const preloadedState = {
    whoami: { user: new models.User({ displayName: "Test User" }) },
};

describe("LightToggleProfileMenu", () => {
    it("renders without crashing", () => {
        render(<LightToggleProfileMenu />);
    });
    it("logs out the user", async () => {
        render(<LightToggleProfileMenu />, { preloadedState });
        userEvent.click(screen.getByText("TU"));
        userEvent.click(screen.getByText("Logout"));
        await waitFor(() => expect(amplify.DataStore.stop).toHaveBeenCalled());
        await waitFor(() => expect(amplify.DataStore.clear).toHaveBeenCalled());
        await waitFor(() => expect(amplify.Auth.signOut).toHaveBeenCalled());
    });
    it("links to the user's profile", () => {
        render(<LightToggleProfileMenu />, { preloadedState });
        userEvent.click(screen.getByText("TU"));
        const profileLink = screen.getByRole("menuitem", { name: "Profile" });
        expect(profileLink).toBeInTheDocument();
        expect(profileLink.getAttribute("href")).toBe(
            `/user/${encodeUUID(preloadedState.whoami.user.id)}`
        );
    });
    it("shows the user's initials", () => {
        render(<LightToggleProfileMenu />, { preloadedState });
        expect(screen.getByText("TU")).toBeInTheDocument();
    });
    test("send feedback", async () => {
        const opSpy = jest.spyOn(amplify, "graphqlOperation").mockReturnValue();
        const apiSpy = jest
            .spyOn(amplify.API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    sendUserFeedback: { successState: true },
                },
            });
        render(<LightToggleProfileMenu />, { preloadedState });
        userEvent.click(screen.getByRole("button", { name: "send feedback" }));
        userEvent.type(
            screen.getByRole("textbox", { name: "feedback body" }),
            "some feedback"
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "email address" }),
            "test@example.com"
        );
        userEvent.click(screen.getByRole("button", { name: "send feedback" }));
        await waitFor(() => {
            expect(opSpy).toHaveBeenCalledWith(queries.sendUserFeedback, {
                emailAddress: "test@example.com",
                body: "some feedback",
            });
        });
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalled();
        });
    });
});
