import { LambdaEvent } from "./interfaces";
import { queries } from "@platelet-app/graphql";
import { Comment } from "@platelet-app/types";
import { request, errorCheck } from "@platelet-app/lambda";

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
    const response = await request(
      { query: queries.getUser, variables },
      endpoint
    );
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

export const handler = async (event: LambdaEvent): Promise<Comment[]> => {
  const { graphQLEndpoint, userId } = event;
  return getUserComments(userId, graphQLEndpoint);
};
