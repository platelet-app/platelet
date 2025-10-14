import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import type { Comment } from "@platelet-app/types";
import pAll from "p-all";
import { mutations } from "@platelet-app/graphql";

const deleteCommentFunction = async (comment: Comment, endpoint: string) => {
  const variables = {
    input: {
      id: comment.id,
      _version: comment._version,
    },
  };
  const response = await request(
    { query: mutations.deleteComment, variables },
    endpoint
  );
  const body = await response.json();
  errorCheck(body);
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
  console.log("delete comments", event);
  const { userId, graphQLEndpoint, comments, userPoolId } = event;
  const filterDeleted = comments.filter((c) => !c._deleted);
  console.log("Comments:", comments);
  console.log("Filtered:", filterDeleted);
  await pAll(
    filterDeleted.map((c) => () => deleteCommentFunction(c, graphQLEndpoint)),
    { concurrency: 10 }
  );
  return { userId, graphQLEndpoint, userPoolId };
};
