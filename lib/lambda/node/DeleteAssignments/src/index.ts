import type { LambdaEvent } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import type { TaskAssignee } from "@platelet-app/types";
import pAll from "p-all";
import { deleteTaskAssignee } from "./queries.js";

const deleteAssignment = async (assignment: TaskAssignee, endpoint: string) => {
  const variables = {
    input: {
      id: assignment.id,
      _version: assignment._version,
    },
  };
  const response = await request(
    { query: deleteTaskAssignee, variables },
    endpoint
  );
  const body = await response.json();
  errorCheck(body);
};

export const handler = async (event: LambdaEvent) => {
  console.log("delete ass", event);
  const { graphQLEndpoint, userId, assignments } = event;
  await pAll(
    assignments.map((a) => () => deleteAssignment(a, graphQLEndpoint)),
    { concurrency: 10 }
  );
  return { userId, graphQLEndpoint };
};
