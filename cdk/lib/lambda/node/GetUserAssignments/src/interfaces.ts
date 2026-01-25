import type { TaskAssignee } from "@platelet-app/types";

export interface LambdaEvent {
    userId: string;
    retryCount: number;
}

export interface LambdaReturn {
    userId: string;
    assignments: TaskAssignee[];
    retryCount: number;
}
