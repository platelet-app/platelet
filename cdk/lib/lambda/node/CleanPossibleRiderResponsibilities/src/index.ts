import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import type { PossibleRiderResponsibilities } from "@platelet-app/types";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";
import { mutations } from "@platelet-app/graphql";
import pAll from "p-all";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

const deletePossibleRiderResponsibilitiesFunction = async (
    resp: PossibleRiderResponsibilities,
    endpoint: string
) => {
    const variables = {
        input: {
            id: resp.id,
            _version: resp._version,
        },
    };
    const response = await request(
        { query: mutations.deletePossibleRiderResponsibilities, variables },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
};

const getPossibleRiderResponsibilities = async (
    userId: string,
    endpoint: string
): Promise<PossibleRiderResponsibilities[]> => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            id: userId,
            nextToken,
        };
        const response = await request({ query: getUser, variables }, endpoint);
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.getUser?.possibleRiderResponsibilities) {
            items.push(
                ...body.data.getUser.possibleRiderResponsibilities.items
            );
            nextToken =
                body.data.getUser.possibleRiderResponsibilities.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("clean possible rider responsibilities", event);
    const { userId, retryCount } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const resps = await getPossibleRiderResponsibilities(
        userId,
        GRAPHQL_ENDPOINT
    );
    console.log("Found possible rider responsibilities", resps);
    const filterDeleted = resps.filter((r) => !r._deleted);
    await pAll(
        filterDeleted.map(
            (r) => () =>
                deletePossibleRiderResponsibilitiesFunction(r, GRAPHQL_ENDPOINT)
        ),
        { concurrency: 10 }
    );
    return { userId, retryCount };
};
