import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import type { TaskAssignee } from "@platelet-app/types";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";

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
    const response = await request({ query: getUser, variables }, endpoint);
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

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
  const { userId, graphQLEndpoint, userPoolId } = event;
  console.log("get user ass", event);
  const assignments = await getUserAssignments(userId, graphQLEndpoint);
  return { userId, graphQLEndpoint, assignments, userPoolId };
};
