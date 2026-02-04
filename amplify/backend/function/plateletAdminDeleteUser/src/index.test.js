import { handler } from "./index.js";
import { request } from "@platelet-app/lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

// Provide an explicit factory for the mock. This is crucial to prevent the original
// module from being loaded and causing side effects or errors.
jest.mock("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
    mutations: {}, // Also mock any other exports from the module if they are used
}));

jest.mock("@aws-sdk/client-sfn", () => ({
    SFNClient: jest.fn(() => ({
        send: jest.fn(),
    })),
    StartExecutionCommand: jest.fn((params) => params),
}));

jest.mock("@aws-sdk/client-ssm", () => ({
    SSMClient: jest.fn(() => ({
        send: jest.fn(),
    })),
    GetParameterCommand: jest.fn((params) => ({ input: params })),
}));

describe("plateletAdminDeleteUser handler", () => {
    // These mocks are auto-mocked by Jest at the top level
    // and jest.clearAllMocks() in beforeEach will reset them.
    let mockSfnSend;
    let mockSsmSend;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mock history and implementations

        // Re-initialize mock implementations for SFNClient and SSMClient
        // Since jest.mock is at the top level, SFNClient and SSMClient are jest.fn()s
        mockSfnSend = jest.fn();
        SFNClient.mockImplementation(() => ({ send: mockSfnSend }));

        mockSsmSend = jest.fn();
        SSMClient.mockImplementation(() => ({ send: mockSsmSend }));
    });

    const mockUser = {
        id: "test-user-id",
        isPrimaryAdmin: 0,
        _deleted: false,
        isBeingDeleted: false,
        _version: 1,
    };

    it("should start a step function execution for a valid user", async () => {
        const event = { arguments: { userId: "test-user-id" } };

        mockSsmSend.mockResolvedValue({
            Parameter: { Value: "test-state-machine-arn" },
        });

        request.mockResolvedValueOnce({
            json: () => Promise.resolve({ data: { getUser: mockUser } }),
        });

        request.mockResolvedValueOnce({
            json: () =>
                Promise.resolve({
                    data: { updateUser: { ...mockUser, isBeingDeleted: true } },
                }),
        });

        const sfnResponse = {
            executionArn: "test-execution-arn",
            startDate: new Date(),
        };
        mockSfnSend.mockResolvedValue(sfnResponse);

        const result = await handler(event);

        expect(result).toEqual(sfnResponse);
        expect(SSMClient).toHaveBeenCalledTimes(1);
        expect(GetParameterCommand).toHaveBeenCalledWith({
            Name: "/platelet-supporting-cdk/dev/DeleteUserStateMachineArn",
        });
        expect(request).toHaveBeenCalledTimes(2);
        expect(SFNClient).toHaveBeenCalledTimes(1);
        expect(StartExecutionCommand).toHaveBeenCalledWith({
            stateMachineArn: "test-state-machine-arn",
            input: JSON.stringify({
                userId: "test-user-id",
                userPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
                graphQLEndpoint:
                    process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
            }),
        });
    });

    it("should throw an error if no userId is provided", async () => {
        const event = { arguments: {} };
        await expect(handler(event)).rejects.toThrow("No userId");
    });

    it("should throw an error if the user is a primary admin", async () => {
        const event = { arguments: { userId: "test-user-id" } };
        const primaryAdminUser = { ...mockUser, isPrimaryAdmin: 1 };

        request.mockResolvedValueOnce({
            json: () =>
                Promise.resolve({ data: { getUser: primaryAdminUser } }),
        });

        await expect(handler(event)).rejects.toThrow(
            "Cannot delete the primary admin"
        );
    });

    it("should throw an error if the user is already deleted", async () => {
        const event = { arguments: { userId: "test-user-id" } };
        const deletedUser = { ...mockUser, _deleted: true };

        request.mockResolvedValueOnce({
            json: () => Promise.resolve({ data: { getUser: deletedUser } }),
        });

        await expect(handler(event)).rejects.toThrow("User not found");
    });

    it("should throw an error if the user is already being deleted", async () => {
        const event = { arguments: { userId: "test-user-id" } };
        const deletingUser = { ...mockUser, isBeingDeleted: true };

        request.mockResolvedValueOnce({
            json: () => Promise.resolve({ data: { getUser: deletingUser } }),
        });

        await expect(handler(event)).rejects.toThrow(
            "User is already being deleted"
        );
    });

    it("should throw an error if the state machine ARN cannot be found", async () => {
        const event = { arguments: { userId: "test-user-id" } };

        request.mockResolvedValueOnce({
            json: () => Promise.resolve({ data: { getUser: mockUser } }),
        });
        request.mockResolvedValueOnce({
            json: () =>
                Promise.resolve({
                    data: { updateUser: { ...mockUser, isBeingDeleted: true } },
                }),
        });

        mockSsmSend.mockImplementation((command) => {
            if (
                command.input.Name ===
                `/platelet-supporting-cdk/dev/DeleteUserStateMachineArn`
            ) {
                return Promise.resolve({ Parameter: { Value: undefined } });
            }
            // This is for the fallback to 'dev' env, which also fails
            if (
                command.input.Name ===
                "/platelet-supporting-cdk/dev/DeleteUserStateMachineArn"
            ) {
                return Promise.resolve({ Parameter: { Value: undefined } });
            }
            return Promise.reject(
                new Error("SSM ParameterNotFound for unexpected call")
            );
        });

        await expect(handler(event)).rejects.toThrow(
            "Could not find any state machine ARN parameter"
        );
    });

    it("should fall back to 'dev' environment for SSM parameter if current env not found", async () => {
        // We need to override the ENV set in setupTests.js for this specific test
        process.env.ENV = "staging";
        const event = { arguments: { userId: "test-user-id" } };

        mockSsmSend.mockImplementation((command) => {
            if (
                command.input.Name ===
                "/platelet-supporting-cdk/staging/DeleteUserStateMachineArn"
            ) {
                return Promise.resolve({ Parameter: { Value: undefined } });
            }
            if (
                command.input.Name ===
                "/platelet-supporting-cdk/dev/DeleteUserStateMachineArn"
            ) {
                return Promise.resolve({
                    Parameter: { Value: "dev-state-machine-arn" },
                });
            }
            return Promise.resolve({});
        });

        request.mockResolvedValueOnce({
            json: () => Promise.resolve({ data: { getUser: mockUser } }),
        });
        request.mockResolvedValueOnce({
            json: () =>
                Promise.resolve({
                    data: { updateUser: { ...mockUser, isBeingDeleted: true } },
                }),
        });

        const sfnResponse = {
            executionArn: "test-execution-arn",
            startDate: new Date(),
        };
        // The last call to mockSsmSend would be for the 'dev' fallback, which succeeds.
        // The next call to a client send would be SFN.
        mockSfnSend.mockResolvedValue(sfnResponse);

        await handler(event);

        expect(GetParameterCommand).toHaveBeenCalledWith({
            Name: "/platelet-supporting-cdk/staging/DeleteUserStateMachineArn",
        });
        expect(GetParameterCommand).toHaveBeenCalledWith({
            Name: "/platelet-supporting-cdk/dev/DeleteUserStateMachineArn",
        });
        expect(StartExecutionCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                stateMachineArn: "dev-state-machine-arn",
            })
        );
    });
});
