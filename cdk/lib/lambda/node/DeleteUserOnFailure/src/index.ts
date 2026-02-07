import type { LambdaEvent } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";
import { mutations } from "@platelet-app/graphql";
import type { User } from "@platelet-app/types";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

const setUserNotBeingDeleted = async (user: User, endpoint: string) => {
    const variables = {
        input: {
            id: user.id,
            _version: user._version,
            isBeingDeleted: false,
        },
    };
    const response = await request(
        { query: mutations.updateUser, variables },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
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

export const handler = async (event: LambdaEvent) => {
    console.log(
        "User deletion failed! Marking them as not being deleted.",
        event
    );
    const { userId } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const user = await getUserFunction(userId, GRAPHQL_ENDPOINT);
    if (!user.username) {
        throw new Error("No username found");
    }
    await setUserNotBeingDeleted(user, GRAPHQL_ENDPOINT);
};
