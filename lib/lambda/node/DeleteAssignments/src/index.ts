import { LambdaEvent } from "./interfaces";
import { mutations } from "@platelet-app/graphql";
import { request, errorCheck } from "@platelet-app/lambda";
import pAll from "p-all";

const deleteAssignment = async (assignmentId: string, endpoint: string) => {
  const variables = {
    id: assignmentId,
  };
  const response = request(
    { query: mutations.deleteTaskAssignee, variables },
    endpoint
  );
  const body = await response.json();
  errorCheck(body);
};

export const handler = async (event: LambdaEvent) => {
  const { graphQLEndpoint, assignmentIds } = event;
  pAll(
    assignmentIds.map((id) => () => deleteAssignment(id, graphQLEndpoint)),
    { concurrency: 10 }
  );
};
