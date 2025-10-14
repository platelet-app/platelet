import type { TaskAssignee } from "@platelet-app/types";

export interface LambdaEvent {
  graphQLEndpoint: string;
  userId: string;
  userPoolId: string;
}

export interface LambdaReturn {
  graphQLEndpoint: string;
  userId: string;
  assignments: TaskAssignee[];
  userPoolId: string;
}
