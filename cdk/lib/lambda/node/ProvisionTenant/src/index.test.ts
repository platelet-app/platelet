import { jest, expect } from "@jest/globals";

jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
}));

jest.unstable_mockModule("@aws-sdk/client-cognito-identity-provider", () => {
    const mockSend = jest.fn().mockResolvedValue({
        User: {
            Attributes: [{ Name: "sub", Value: "some-sub" }],
        },
    });
    const MockCognitoIdentityProviderClient = jest.fn(() => ({
        send: mockSend,
    }));
    return {
        CognitoIdentityProviderClient: MockCognitoIdentityProviderClient,
        AdminCreateUserCommand: jest.fn(),
        AdminSetUserPasswordCommand: jest.fn(),
        AdminAddUserToGroupCommand: jest.fn(),
        AdminDeleteUserCommand: jest.fn(),
        mockSend, // Export mockSend to assert on tests
    };
});

jest.unstable_mockModule("@aws-sdk/client-ses", () => {
    const mockSend = jest.fn().mockResolvedValue({});
    const MockSESClient = jest.fn(() => ({
        send: mockSend,
    }));
    return {
        SESClient: MockSESClient,
        SendEmailCommand: jest.fn(),
        mockSend, // Export mockSend to assert on tests
    };
});

jest.unstable_mockModule("@aws-sdk/client-ssm", () => {
    const mockSend = jest.fn().mockImplementation((command: any) => {
        if (command.input.Name.endsWith("FromEmail")) {
            return Promise.resolve({
                Parameter: { Value: "noreply@example.com" },
            });
        }
        return Promise.resolve({ Parameter: { Value: "example.com" } });
    });
    const MockSSMClient = jest.fn(() => ({
        send: mockSend,
    }));
    return {
        SSMClient: MockSSMClient,
        GetParameterCommand: jest.fn().mockImplementation((input) => ({
            input,
        })),
        mockSend, // Export mockSend to assert on tests
    };
});

// must be imported before the handler
const cognito = await import("@aws-sdk/client-cognito-identity-provider");
const ses = await import("@aws-sdk/client-ses");
const lambda = await import("@platelet-app/lambda");
// import handler
const { handler, generateReferenceIdentifier } = await import("./index.js");

function setupFetchStub(data: any): () => Promise<Response> {
    return function fetchStub(): Promise<Response> {
        return new Promise((resolve) => {
            resolve({
                json: () =>
                    Promise.resolve({
                        data,
                    }),
            } as Response);
        });
    };
}

const noTenants = { listTenants: { items: [] } };

const existingTenant = {
    listTenants: {
        items: [
            {
                id: "existing-tenant",
                name: "Existing",
                referenceIdentifier: "Exis",
                _version: 1,
                _deleted: null,
                admin: {
                    id: "existing-admin",
                    username: "existing-username",
                    contact: { emailAddress: "admin@example.com" },
                },
            },
        ],
    },
};

const createdUser = {
    createUser: {
        id: "new-user",
        username: "some-username",
        _version: 1,
        contact: { emailAddress: "new-admin@example.com" },
    },
};

const createdTenant = {
    createTenant: {
        id: "new-tenant",
        name: "Some Tenant",
        referenceIdentifier: "Some",
        _version: 1,
    },
};

const updatedUser = {
    updateUser: {
        id: "new-user",
        username: "some-username",
        tenantId: "new-tenant",
        cognitoId: "some-sub",
        _version: 2,
    },
};

describe("ProvisionTenant", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("generates a reference identifier from the tenant name", () => {
        expect(generateReferenceIdentifier("Some Tenant")).toBe("Some");
        expect(() => generateReferenceIdentifier("a b")).toThrow(
            "tenantName must be at least 4 characters without whitespace"
        );
    });

    test("rejects an unknown mode", async () => {
        await expect(
            handler({
                mode: "something" as any,
                tenantName: "Some Tenant",
                adminName: "Some Admin",
                adminEmailAddress: "new-admin@example.com",
            })
        ).rejects.toThrow('mode must be "bootstrap" or "preview"');
    });

    test("rejects missing arguments", async () => {
        await expect(
            handler({
                mode: "bootstrap",
                tenantName: "",
                adminName: "Some Admin",
                adminEmailAddress: "new-admin@example.com",
            })
        ).rejects.toThrow(
            "tenantName, adminName, and adminEmailAddress are required"
        );
    });

    test("bootstrap creates a tenant and sends the welcome email", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(noTenants))
            .mockImplementationOnce(setupFetchStub(createdUser))
            .mockImplementationOnce(setupFetchStub(createdTenant))
            .mockImplementationOnce(setupFetchStub(updatedUser));
        const result = await handler({
            mode: "bootstrap",
            tenantName: "Some Tenant",
            adminName: "Some Admin",
            adminEmailAddress: "new-admin@example.com",
        });
        expect(result).toEqual({ status: "created", tenantId: "new-tenant" });
        expect(lambda.request).toHaveBeenCalledTimes(4);
        // create the cognito user and add the three roles
        expect(cognito.AdminCreateUserCommand).toHaveBeenCalledTimes(1);
        expect(cognito.AdminAddUserToGroupCommand).toHaveBeenCalledTimes(3);
        expect(cognito.AdminSetUserPasswordCommand).not.toHaveBeenCalled();
        expect(ses.mockSend).toHaveBeenCalledTimes(1);
        const createUserCall = lambda.request.mock.calls[1][0];
        expect(createUserCall.variables.input).toMatchObject({
            isPrimaryAdmin: 1,
            disabled: 0,
            roles: ["USER", "ADMIN", "COORDINATOR"],
            contact: { emailAddress: "new-admin@example.com" },
        });
        const createTenantCall = lambda.request.mock.calls[2][0];
        expect(createTenantCall.variables.input).toMatchObject({
            name: "Some Tenant",
            referenceIdentifier: "Some",
            tenantAdminId: "new-user",
        });
    });

    test("preview creates a tenant with a permanent password and no email", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(noTenants))
            .mockImplementationOnce(setupFetchStub(createdUser))
            .mockImplementationOnce(setupFetchStub(createdTenant))
            .mockImplementationOnce(setupFetchStub(updatedUser));
        const result = await handler({
            mode: "preview",
            tenantName: "Preview pr/12",
            adminName: "Preview Admin",
            adminEmailAddress: "preview@example.com",
        });
        expect(result.status).toBe("created");
        expect(result.tenantId).toBe("new-tenant");
        expect(result.loginEmailAddress).toBe("preview@example.com");
        expect(result.password).toEqual(expect.any(String));
        expect(result.password!.length).toBeGreaterThanOrEqual(8);
        expect(cognito.AdminSetUserPasswordCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                Permanent: true,
                Password: result.password,
            })
        );
        expect(ses.mockSend).not.toHaveBeenCalled();
    });

    test("bootstrap does nothing when a tenant already exists", async () => {
        lambda.request.mockImplementationOnce(setupFetchStub(existingTenant));
        const result = await handler({
            mode: "bootstrap",
            tenantName: "Some Tenant",
            adminName: "Some Admin",
            adminEmailAddress: "new-admin@example.com",
        });
        expect(result).toEqual({
            status: "already-provisioned",
            tenantId: "existing-tenant",
        });
        expect(lambda.request).toHaveBeenCalledTimes(1);
        expect(cognito.mockSend).not.toHaveBeenCalled();
        expect(ses.mockSend).not.toHaveBeenCalled();
    });

    test("preview refreshes the admin password when a tenant already exists", async () => {
        lambda.request.mockImplementationOnce(setupFetchStub(existingTenant));
        const result = await handler({
            mode: "preview",
            tenantName: "Preview pr/12",
            adminName: "Preview Admin",
            adminEmailAddress: "preview@example.com",
        });
        expect(result.status).toBe("already-provisioned");
        expect(result.tenantId).toBe("existing-tenant");
        expect(result.loginEmailAddress).toBe("admin@example.com");
        expect(result.password).toEqual(expect.any(String));
        expect(cognito.AdminSetUserPasswordCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                Username: "existing-username",
                Permanent: true,
                Password: result.password,
            })
        );
        expect(lambda.request).toHaveBeenCalledTimes(1);
        expect(ses.mockSend).not.toHaveBeenCalled();
    });

    test("cleans up the user and tenant when provisioning fails", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(noTenants))
            .mockImplementationOnce(setupFetchStub(createdUser))
            .mockImplementationOnce(setupFetchStub(createdTenant))
            // cleanUp getUser and getTenant lookups
            .mockImplementationOnce(
                setupFetchStub({ getUser: { id: "new-user", _version: 1 } })
            )
            .mockImplementationOnce(setupFetchStub({}))
            .mockImplementationOnce(
                setupFetchStub({
                    getTenant: { id: "new-tenant", _version: 1 },
                })
            )
            .mockImplementationOnce(setupFetchStub({}));
        cognito.mockSend.mockRejectedValueOnce(new Error("cognito failure"));
        await expect(
            handler({
                mode: "bootstrap",
                tenantName: "Some Tenant",
                adminName: "Some Admin",
                adminEmailAddress: "new-admin@example.com",
            })
        ).rejects.toThrow("cognito failure");
        // getUser, deleteUser, getTenant, deleteTenant after the three
        // creation requests
        expect(lambda.request).toHaveBeenCalledTimes(7);
        const deleteUserCall = lambda.request.mock.calls[4][0];
        expect(deleteUserCall.variables.input.id).toBe("new-user");
        const deleteTenantCall = lambda.request.mock.calls[6][0];
        expect(deleteTenantCall.variables.input.id).toBe("new-tenant");
        expect(ses.mockSend).not.toHaveBeenCalled();
    });
});
