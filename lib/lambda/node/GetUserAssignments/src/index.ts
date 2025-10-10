import { LambdaEvent } from "./interfaces";
import { queries } from "@platelet-app/graphql";
import { TaskAssignee } from "@platelet-app/types";
import { request, errorCheck } from "@platelet-app/lambda";

const getUserAssignments = async (
  userId: string,
  endpoint: string
): Promise<TaskAssignee[]> => {
  const items = [];
  let nextToken = null;
  do {
    const variables = {
      id: userId,
      nextToken,
    };
    const response = await request(
      { query: queries.getUser, variables },
      endpoint
    );
    const body = await response.json();
    errorCheck(body);
    if (body?.data?.getUser?.assignments) {
      items.push(...body.data.getUser.assignments.items);
      nextToken = body.data.getUser.assignments.nextToken;
    } else {
      nextToken = null;
    }
  } while (nextToken);
  return items.flat();
};

export const handler = async (event: LambdaEvent): Promise<TaskAssignee[]> => {
  const { graphQLEndpoint, userId } = event;
  return getUserAssignments(userId, graphQLEndpoint);
};
