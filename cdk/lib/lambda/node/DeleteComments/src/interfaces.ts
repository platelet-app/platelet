import type { Comment } from "@platelet-app/types";

export interface LambdaEvent {
    userId: string;
    comments: Comment[];
    retryCount: number;
}

export interface LambdaReturn {
    userId: string;
    retryCount: number;
}
