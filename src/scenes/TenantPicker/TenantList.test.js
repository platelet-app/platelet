import TenantList from "./TenantList";
import Amplify from "aws-amplify";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const fakeConfigData = `{
    "aws_project_region": "eu-west-1",
    "aws_cognito_identity_pool_id": "eu-west-1:12345678-1234-1234-1234-123456789012",
    "aws_cognito_region": "eu-west-1",
    "aws_user_pools_id": "eu-west-1_12345678",
    "aws_user_pools_web_client_id": "1234567890123456789012",
    "oauth": {},
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ],
    "aws_appsync_graphqlEndpoint": "https://someendpoint.appsync-api.eu-west-1.amazonaws.com/graphql",
    "aws_appsync_region": "eu-west-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_user_files_s3_bucket": "somebucket",
    "aws_user_files_s3_bucket_region": "eu-west-1",
    "geo": {
        "amazon_location_service": {
            "region": "eu-west-1",
            "search_indices": {
                "items": [
                    "plateletPlace"
                ],
                "default": "plateletPlace"
            }
        }
    },
    "aws_cognito_login_mechanisms": [
        "EMAIL"
    ]
}`;

describe("TenantList", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it("lists the tenants", async () => {
        const fakeItems = [
            { id: 1, name: "Tenant 1" },
            { id: 2, name: "Tenant 2" },
        ];
        const querySpy = jest.spyOn(global, "fetch").mockResolvedValue({
            json: () =>
                Promise.resolve({
                    data: { listTenants: { items: fakeItems } },
                }),
        });
        render(<TenantList />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        expect(screen.getByText("Tenant 1")).toBeInTheDocument();
        expect(screen.getByText("Tenant 2")).toBeInTheDocument();
    });

    it("failure while listing the tenants", async () => {
        const querySpy = jest
            .spyOn(global, "fetch")
            .mockRejectedValue(new Error());
        render(<TenantList />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        expect(
            screen.getByText("There was an error while retrieving the list.")
        ).toBeInTheDocument();
    });

    test("clicking and configuring a tenant", async () => {
        const fakeItems = [
            { id: 1, name: "Tenant 1" },
            { id: 2, name: "Tenant 2" },
        ];
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const querySpy = jest
            .spyOn(global, "fetch")
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        data: { listTenants: { items: fakeItems } },
                    }),
            })
            .mockResolvedValueOnce(
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            data: {
                                getTenant: {
                                    id: 1,
                                    name: "Tenant 1",
                                    config: fakeConfigData,
                                },
                            },
                        }),
                })
            );
        const setupComplete = jest.fn();
        const localStorageSpy = jest.spyOn(Storage.prototype, "setItem");
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        const tenantItem = screen.getByText("Tenant 1");
        expect(tenantItem).toBeInTheDocument();
        userEvent.click(tenantItem);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        const parsedConfig = JSON.parse(fakeConfigData);
        await waitFor(() => {
            expect(amplifySpy).toHaveBeenCalledWith(parsedConfig);
        });
        expect(localStorageSpy).toHaveBeenCalledWith(
            "amplifyConfig",
            fakeConfigData
        );
        expect(setupComplete).toHaveBeenCalled();
    });
});
