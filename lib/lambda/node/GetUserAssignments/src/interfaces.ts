import type { TaskAssignee } from "@platelet-app/types";

export interface LambdaEvent {
  graphQLEndpoint: string;
  userId: string;
  userPoolId: string;
  retryCount: number;
}

export interface LambdaReturn {
  graphQLEndpoint: string;
  userId: string;
  assignments: TaskAssignee[];
  userPoolId: string;
  retryCount: number;
}
