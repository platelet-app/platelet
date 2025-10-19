import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import type { VehicleAssignment } from "@platelet-app/types";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";
import { mutations } from "@platelet-app/graphql";
import pAll from "p-all";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

const deleteVehicleAssignmentFunction = async (
    vehicleAssignment: VehicleAssignment,
    endpoint: string
) => {
    const variables = {
        input: {
            id: vehicleAssignment.id,
            _version: vehicleAssignment._version,
        },
    };
    const response = await request(
        { query: mutations.deleteVehicleAssignment, variables },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
};

const getVehicleAssignments = async (
    userId: string,
    endpoint: string
): Promise<VehicleAssignment[]> => {
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
        if (body?.data?.getUser?.vehicleAssignments) {
            items.push(...body.data.getUser.vehicleAssignments.items);
            nextToken = body.data.getUser.vehicleAssignments.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("clean vehicle assignments", event);
    const { userId, retryCount } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const vehicleAssignments = await getVehicleAssignments(
        userId,
        GRAPHQL_ENDPOINT
    );
    console.log("Found vehicle assignments", vehicleAssignments);
    const filterDeleted = vehicleAssignments.filter((va) => !va._deleted);
    await pAll(
        filterDeleted.map(
            (va) => () => deleteVehicleAssignmentFunction(va, GRAPHQL_ENDPOINT)
        ),
        { concurrency: 10 }
    );
    return { userId, retryCount };
};
