import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import type { Comment } from "@platelet-app/types";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";

const getUserComments = async (
  userId: string,
  endpoint: string
): Promise<Comment[]> => {
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
    if (body?.data?.getUser?.comments) {
      items.push(...body.data.getUser.comments.items);
      nextToken = body.data.getUser.comments.nextToken;
    } else {
      nextToken = null;
    }
  } while (nextToken);
  return items.flat();
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
  console.log("get user comments", event);
  const { userId, graphQLEndpoint } = event;
  const comments = await getUserComments(userId, graphQLEndpoint);
  console.log("Found comments", comments);
  return { userId, graphQLEndpoint, comments };
};
