import type { Comment } from "@platelet-app/types";

export interface LambdaEvent {
    userId: string;
    retryCount: number;
}

export interface LambdaReturn {
    userId: string;
    comments: Comment[];
    retryCount: number;
}
