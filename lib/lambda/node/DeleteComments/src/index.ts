import { LambdaEvent } from "./interfaces";
import { mutations } from "@platelet-app/graphql";
import { request, errorCheck } from "@platelet-app/lambda";
import pAll from "p-all";

const deleteComment = async (commentId: string, endpoint: string) => {
  const variables = {
    id: commentId,
  };
  const response = request(
    { query: mutations.deleteComment, variables },
    endpoint
  );
  const body = await response.json();
  errorCheck(body);
};

export const handler = async (event: LambdaEvent) => {
  const { graphQLEndpoint, commentIds } = event;
  pAll(
    commentIds.map((id) => () => deleteComment(id, graphQLEndpoint)),
    { concurrency: 10 }
  );
};
