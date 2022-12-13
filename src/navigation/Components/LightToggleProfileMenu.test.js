import { render } from "../../test-utils";
import * as hubActions from "../../redux/awsHubListener/awsHubListenerActions";
import LightToggleProfileMenu from "./LightToggleProfileMenu";
import { screen, waitFor } from "@testing-library/react";
import * as amplify from "aws-amplify";
import * as models from "../../models";
import * as queries from "../../graphql/queries";
import userEvent from "@testing-library/user-event";
import { encodeUUID } from "../../utilities";
import { DataStore } from "aws-amplify";

jest.mock("aws-amplify");

const preloadedState = {
    whoami: { user: new models.User({ displayName: "Test User" }) },
};

const initialSyncState = Object.values(models).reduce((acc, model) => {
    // maybe a better way than checking for copyOf function?
    if (model.name && !!model.copyOf) return { ...acc, [model.name]: false };
    else return acc;
}, {});

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
        const sendButton = screen.getByRole("button", {
            name: "send feedback",
        });
        // disabled while empty body
        expect(sendButton).toBeDisabled();
        userEvent.type(
            screen.getByRole("textbox", { name: "feedback body" }),
            "some feedback"
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "email address" }),
            "test@example.com"
        );
        userEvent.click(sendButton);
        expect(sendButton).toBeDisabled();
        await waitFor(() => {
            expect(opSpy).toHaveBeenCalledWith(queries.sendUserFeedback, {
                emailAddress: "test@example.com",
                body: "some feedback",
            });
        });
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalled();
        });
        return;
        await waitFor(() => {
            expect(
                screen.queryByRole("button", { name: "send feedback" })
            ).toBeNull();
        });
    });

    test("send feedback failure", async () => {
        const apiSpy = jest
            .spyOn(amplify.API, "graphql")
            .mockRejectedValue(new Error());
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
            expect(apiSpy).toHaveBeenCalled();
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "send feedback" })
        ).toBeInTheDocument();
    });

    test.skip("refresh DataStore button", async () => {
        const preloadedState = {
            whoami: { user: new models.User({ displayName: "Test User" }) },
            awsHubDataStoreModelsSyncedStatusReducer: initialSyncState,
            awsHubDataStoreEventsReducer: { network: true, ready: false },
        };
        const { store } = render(<LightToggleProfileMenu />, {
            preloadedState,
        });
        store.dispatch(hubActions.setModelSyncedAll());
        store.dispatch(hubActions.setReadyStatus(true));
        const button = await screen.findByRole(
            "button",
            {
                name: "refresh resync data",
            },
            { timeout: 2500 }
        );
        userEvent.click(button);
        const dataStoreStopSpy = jest.spyOn(DataStore, "stop");
        const dataStoreStartSpy = jest.spyOn(DataStore, "start");
        await waitFor(() => {
            expect(dataStoreStopSpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(dataStoreStartSpy).toHaveBeenCalledTimes(1);
        });
    });
});
