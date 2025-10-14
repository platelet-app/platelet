import type { Comment } from "@platelet-app/types";

export interface LambdaEvent {
  graphQLEndpoint: string;
  userId: string;
}

export interface LambdaReturn {
  graphQLEndpoint: string;
  userId: string;
  comments: Comment[];
}
