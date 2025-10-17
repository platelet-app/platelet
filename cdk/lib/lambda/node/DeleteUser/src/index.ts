import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";
import { mutations } from "@platelet-app/graphql";
import type { User, S3Object } from "@platelet-app/types";
import {
    AdminDeleteUserCommand,
    AdminDisableUserCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const USER_POOL_ID = process.env.USER_POOL_ID;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

const disableUserCognito = async (username: string, userPoolId: string) => {
    const params = {
        UserPoolId: userPoolId,
        Username: username,
    };

    const config = {};
    const client = new CognitoIdentityProviderClient(config);
    const command = new AdminDisableUserCommand(params);
    await client.send(command);
};

const deleteUserCognito = async (username: string, userPoolId: string) => {
    const params = {
        UserPoolId: userPoolId,
        Username: username,
    };
    const config = {};
    const client = new CognitoIdentityProviderClient(config);
    const command = new AdminDeleteUserCommand(params);
    await client.send(command);
};

const deleteUserFunction = async (user: User, endpoint: string) => {
    const variables = {
        input: {
            id: user.id,
            _version: user._version,
        },
    };
    const response = await request(
        { query: mutations.deleteUser, variables },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
};

const deleteProfilePicture = async (item: S3Object) => {
    const config = {};
    const client = new S3Client(config);
    const input = {
        Bucket: item.bucket,
        Key: item.key,
    };
    const command = new DeleteObjectCommand(input);
    await client.send(command);
};

const getUserFunction = async (userId: string, endpoint: string) => {
    const variables = {
        id: userId,
    };
    const response = await request({ query: getUser, variables }, endpoint);
    const body = await response.json();
    errorCheck(body);
    return body?.data?.getUser;
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("delete user", event);
    const { userId, retryCount } = event;
    if (!GRAPHQL_ENDPOINT || !USER_POOL_ID) {
        throw new Error("Missing env variables");
    }
    const user = await getUserFunction(userId, GRAPHQL_ENDPOINT);
    if (!user.username) {
        throw new Error("No username found");
    }
    await disableUserCognito(user.username, USER_POOL_ID);
    await deleteUserFunction(user, GRAPHQL_ENDPOINT);
    await deleteUserCognito(user.username, USER_POOL_ID);
    await deleteProfilePicture(user.profilePicture);
    return { retryCount, userId };
};
