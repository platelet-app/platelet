//import { waitFor } from "@testing-library/react";
//import { render } from "../../test-utils";
//import Login from "./Login";

jest.mock("@aws-amplify/ui-react", () => ({
    Authenticator: () => <div>Mocked Authenticator</div>,
}));

describe("Login", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });
    it("placeholder", async () => {
        return;
    });
});
