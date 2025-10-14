import type { LambdaEvent } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import type { Comment } from "@platelet-app/types";
import pAll from "p-all";
import { deleteComment } from "./queries.js";

const deleteCommentFunction = async (comment: Comment, endpoint: string) => {
  const variables = {
    input: {
      id: comment.id,
      _version: comment._version,
    },
  };
  const response = await request({ query: deleteComment, variables }, endpoint);
  const body = await response.json();
  errorCheck(body);
};

export const handler = async (event: LambdaEvent) => {
  console.log("delete comments", event);
  const { userId, graphQLEndpoint, comments } = event;
  await pAll(
    comments.map((c) => () => deleteCommentFunction(c, graphQLEndpoint)),
    { concurrency: 10 }
  );
  return { userId, graphQLEndpoint };
};
