import { render, screen, waitFor } from "../../test-utils";
import Login from "./Login";
import { Auth, Hub, DataStore } from "aws-amplify";
import * as redux from "react-redux";
import { initialiseApp } from "../../redux/initialise/initialiseActions";
import { getWhoamiSuccess } from "../../redux/whoami/whoamiActions";

jest.mock("@aws-amplify/ui-react", () => ({
    Authenticator: ({ children }) => <div>{children}</div>,
}));

describe("Login", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("dispatches init app on login. datastore clears", async () => {
        const dataStoreSpy = jest.spyOn(DataStore, "clear");
        const dispatch = jest.fn();
        jest.spyOn(redux, "useDispatch").mockReturnValue(dispatch);
        jest.spyOn(Auth, "currentAuthenticatedUser").mockImplementation(() => {
            return Promise.reject();
        });
        const hubSpy = jest.spyOn(Hub, "listen").mockImplementation(() => {
            return () => {};
        });
        const { store } = render(<Login>test</Login>);
        await waitFor(() => {
            expect(hubSpy).toHaveBeenCalledWith("auth", expect.any(Function));
        });
        const hubListener = hubSpy.mock.calls[0][1];
        hubListener({ payload: { event: "signIn" } });
        expect(dispatch).toHaveBeenCalledWith(initialiseApp());
        expect(screen.queryByText("test")).toBeNull();
        store.dispatch(getWhoamiSuccess({ id: "someId" }));
        expect(screen.getByText("test")).toBeInTheDocument();
        expect(dataStoreSpy).toHaveBeenCalledTimes(1);
    });
    it("unsubscribe from listener on unmount", async () => {
        const dispatch = jest.fn();
        jest.spyOn(redux, "useDispatch").mockReturnValue(dispatch);
        jest.spyOn(Auth, "currentAuthenticatedUser").mockImplementation(() => {
            return Promise.resolve({ username: "someUser" });
        });
        const hubSpy = jest.spyOn(Hub, "listen").mockImplementation(() => {
            return () => {};
        });
        const hubRemoveSpy = jest.spyOn(Hub, "remove");
        const { component } = render(<Login>test</Login>);
        await waitFor(() => {
            expect(hubSpy).toHaveBeenCalledWith("auth", expect.any(Function));
        });
        component.unmount();
        expect(hubRemoveSpy).toHaveBeenCalledWith("auth", expect.any(Function));
    });
    it("dispatches init app if the user is logged in", async () => {
        const dataStoreSpy = jest.spyOn(DataStore, "clear");
        const dispatch = jest.fn();
        jest.spyOn(redux, "useDispatch").mockReturnValue(dispatch);
        jest.spyOn(Auth, "currentAuthenticatedUser").mockImplementation(() => {
            return Promise.resolve({ username: "someUser" });
        });
        jest.spyOn(Hub, "listen").mockImplementation(() => {
            return () => {};
        });
        const { store } = render(<Login>test</Login>);
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith(initialiseApp());
        });
        expect(screen.queryByText("test")).toBeNull();
        store.dispatch(getWhoamiSuccess({ id: "someId" }));
        expect(screen.getByText("test")).toBeInTheDocument();
        expect(dataStoreSpy).not.toHaveBeenCalled();
    });
});
