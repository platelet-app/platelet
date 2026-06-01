import type {
    QueryGetTrackingArgs,
    TokenDdbRecord,
} from "@platelet-app/tracking-types";
import type { Context, DynamoDBQueryRequest } from "@aws-appsync/utils";
import { util } from "@aws-appsync/utils";

export function request(
    ctx: Context<QueryGetTrackingArgs>
): DynamoDBQueryRequest {
    return {
        operation: "Query",
        index: "TokenIndex",
        query: {
            expression: "sk = :val",
            expressionValues: {
                ":val": util.dynamodb.toDynamoDB(`token#${ctx?.args?.token}`),
            },
        },
    };
}

export function response(
    ctx: Context<
        QueryGetTrackingArgs,
        object,
        object,
        object,
        { items: TokenDdbRecord[] }
    >
): TokenDdbRecord | null {
    const result = ctx.result?.items?.[0] || null;
    if (!result) {
        runtime.earlyReturn(null);
    }
    return result;
}
