import type {
    QueryGetTrackingArgs,
    TokenDdbRecord,
} from "@platelet-app/tracking-types";
import type { Context, DynamoDBGetItemRequest } from "@aws-appsync/utils";
import { util } from "@aws-appsync/utils";

export function request(
    ctx: Context<QueryGetTrackingArgs>
): DynamoDBGetItemRequest {
    return {
        operation: "GetItem",
        key: {
            pk: util.dynamodb.toDynamoDB(`token#${ctx?.args?.token}`),
        },
    };
}

export function response(
    ctx: Context<QueryGetTrackingArgs, object, object, object, TokenDdbRecord>
): TokenDdbRecord | null {
    return ctx.result;
}
