import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import type { TaskAssignee } from "@platelet-app/types";
import pAll from "p-all";
import { mutations } from "@platelet-app/graphql";

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
  const { graphQLEndpoint, userId, assignments, userPoolId, retryCount } =
    event;
  const filterDeleted = assignments.filter((c) => !c._deleted);
  console.log("Assignments:", assignments);
  console.log("Filtered:", filterDeleted);
  await pAll(
    assignments.map((a) => () => deleteAssignment(a, graphQLEndpoint)),
    { concurrency: 10 }
  );
  return { userId, graphQLEndpoint, userPoolId, retryCount };
};
