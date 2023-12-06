import { API, DataStore } from "aws-amplify";
import * as models from "../../../models";
import uploadProfilePicture from "./uploadProfilePicture";
import * as queries from "../../../graphql/queries";

jest.mock("../../../aws-exports", () => ({
    default: {
        aws_user_files_s3_bucket: "test-bucket",
        aws_user_files_s3_bucket_region: "eu-west-1",
    },
}));

describe("uploadProfilePicture", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
    });
    it("should upload a profile picture using aws-exports", async () => {
        const mockUser = await DataStore.save(
            new models.User({
                displayName: "test-user",
                cognitoId: "test-user-id",
                tenantId: "test-tenant-id",
                username: "test-username",
                roles: [models.Role.USER],
            })
        );
        const mockFetchPromise = Promise.resolve({
            json: () => Promise.resolve({}),
        });
        jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
        const saveSpy = jest.spyOn(DataStore, "save");

        const apiSpy = jest
            .spyOn(API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    profilePictureUploadURL: "test-upload-url",
                },
            })
            .mockResolvedValueOnce({
                data: {
                    profilePictureURL: "test-profile-picture-url-256",
                },
            })
            .mockResolvedValueOnce({
                data: {
                    profilePictureURL: "test-profile-picture-url-128",
                },
            });

        const mockSelectedFile = new File([""], "test-file.jpg", {
            type: "image/jpeg",
        });
        await uploadProfilePicture(mockUser.id, mockSelectedFile);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                method: "PUT",
                headers: expect.objectContaining({
                    Accept: "image/jpeg",
                    "Content-Type": "image/jpeg",
                }),
                body: expect.anything(),
            })
        );
        expect(apiSpy).toHaveBeenCalledWith({
            query: queries.profilePictureUploadURL,
            variables: {
                userId: mockUser.id,
            },
        });
        expect(apiSpy).toHaveBeenCalledWith({
            query: queries.profilePictureURL,
            variables: {
                userId: mockUser.id,
                height: 300,
                width: 300,
            },
        });
        expect(apiSpy).toHaveBeenCalledWith({
            query: queries.profilePictureURL,
            variables: {
                userId: mockUser.id,
                height: 128,
                width: 128,
            },
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockUser,
            profilePicture: {
                bucket: "test-bucket",
                key: `public/${mockUser.id}.jpg`,
                region: "eu-west-1",
            },
        });
    });
    it("should upload a profile picture using local storage", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT = new URL(
            "https://test.com"
        );
        const mockUser = await DataStore.save(
            new models.User({
                displayName: "test-user",
                cognitoId: "test-user-id",
                tenantId: "test-tenant-id",
                username: "test-username",
                roles: [models.Role.USER],
            })
        );
        const mockFetchPromise = Promise.resolve({
            json: () => Promise.resolve({}),
        });
        jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

        const localStorageSpy = jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValue(`{
                "aws_user_files_s3_bucket_region": "eu-west-1",
                "aws_user_files_s3_bucket":
                    "test-bucket"
            }`);

        const apiSpy = jest
            .spyOn(API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    profilePictureUploadURL: "test-upload-url",
                },
            })
            .mockResolvedValueOnce({
                data: {
                    profilePictureURL: "test-profile-picture-url-256",
                },
            })
            .mockResolvedValueOnce({
                data: {
                    profilePictureURL: "test-profile-picture-url-128",
                },
            });

        const mockSelectedFile = new File([""], "test-file.jpg", {
            type: "image/jpeg",
        });
        const saveSpy = jest.spyOn(DataStore, "save");
        await uploadProfilePicture(mockUser.id, mockSelectedFile);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                method: "PUT",
                headers: expect.objectContaining({
                    Accept: "image/jpeg",
                    "Content-Type": "image/jpeg",
                }),
                body: expect.anything(),
            })
        );
        expect(localStorageSpy).toHaveBeenCalledWith("amplifyConfig");
        expect(apiSpy).toHaveBeenCalledWith({
            query: queries.profilePictureUploadURL,
            variables: {
                userId: mockUser.id,
            },
        });
        expect(apiSpy).toHaveBeenCalledWith({
            query: queries.profilePictureURL,
            variables: {
                userId: mockUser.id,
                height: 300,
                width: 300,
            },
        });
        expect(apiSpy).toHaveBeenCalledWith({
            query: queries.profilePictureURL,
            variables: {
                userId: mockUser.id,
                height: 128,
                width: 128,
            },
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockUser,
            profilePicture: {
                bucket: "test-bucket",
                key: `public/${mockUser.id}.jpg`,
                region: "eu-west-1",
            },
        });
    });
});
