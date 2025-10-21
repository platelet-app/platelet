import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import type { TaskAssignee } from "@platelet-app/types";
import pAll from "p-all";
import { mutations } from "@platelet-app/graphql";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

const deleteAssignment = async (assignment: TaskAssignee, endpoint: string) => {
    const variables = {
        input: {
            id: assignment.id,
            _version: assignment._version,
        },
    };
    const response = await request(
        { query: mutations.deleteTaskAssignee, variables },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("delete ass", event);
    const { userId, assignments, retryCount } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const filterDeleted = assignments.filter((c) => !c._deleted);
    console.log("Assignments:", assignments);
    console.log("Filtered:", filterDeleted);
    await pAll(
        filterDeleted.map((a) => () => deleteAssignment(a, GRAPHQL_ENDPOINT)),
        { concurrency: 10 }
    );
    return { userId, retryCount };
};
