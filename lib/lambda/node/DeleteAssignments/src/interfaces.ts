import type { TaskAssignee } from "@platelet-app/types";

export interface LambdaEvent {
  graphQLEndpoint: string;
  userId: string;
  assignments: TaskAssignee[];
}
