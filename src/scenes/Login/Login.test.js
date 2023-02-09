import { waitFor } from "@testing-library/react";
import { render } from "../../test-utils";
import Login from "./Login";

jest.mock("@aws-amplify/ui-react", () => ({
    Authenticator: () => <div>Mocked Authenticator</div>,
}));

describe("Login", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });
    // TODO: don't skip this when multi tenant is fully in place
    it.skip("should save the amplify config", async () => {
        const testUrl = "https://test.com/graphql";
        const testApiKey = "test";
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT = testUrl;
        process.env.REACT_APP_TENANT_GRAPHQL_API_KEY = testApiKey;
        const mockAmplifyReturn = {
            data: {
                getTenant: {
                    config: JSON.stringify({
                        test: "test",
                    }),
                    version: "3",
                    name: "some team",
                },
            },
        };

        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce("someId")
            .mockReturnValue("2");
        const saveSpy = jest.spyOn(Storage.prototype, "setItem");
        const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
            json: () => Promise.resolve(mockAmplifyReturn),
        });
        render(<Login />);
        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                testUrl,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "x-api-key": testApiKey,
                    }),
                })
            );
        });
        expect(saveSpy).toHaveBeenCalledWith("tenantVersion", "3");
        expect(saveSpy).toHaveBeenCalledWith(
            "amplifyConfig",
            mockAmplifyReturn.data.getTenant.config
        );
        expect(saveSpy).toHaveBeenCalledWith(
            "tenantName",
            mockAmplifyReturn.data.getTenant.name
        );
    });
});
