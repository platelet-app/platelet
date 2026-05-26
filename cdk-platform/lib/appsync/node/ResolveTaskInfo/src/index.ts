import type {
    TrackingInfo,
    QueryGetTrackingArgs,
    TaskDdbRecord,
    TokenDdbRecord,
} from "@platelet-app/tracking-types";
import type { Context, DynamoDBGetItemRequest } from "@aws-appsync/utils";
import { util } from "@aws-appsync/utils";

export function request(
    ctx: Context<
        QueryGetTrackingArgs,
        Record<string, any>,
        { result: TokenDdbRecord }
    >
): DynamoDBGetItemRequest {
    return {
        operation: "GetItem",
        key: {
            pk: util.dynamodb.toDynamoDB(ctx?.prev?.result?.TaskId),
        },
    };
}

export function response(
    ctx: Context<QueryGetTrackingArgs, object, object, object, TaskDdbRecord>
): TrackingInfo | null {
    const { result } = ctx;
    if (!result) {
        return null;
    }
    return {
        id: result.pk,
        tenantName: result.TenantName,
        tenantWebsite: result.TenantWebsite,
        pickUpTime: result.PickUpTime,
        dropOffTime: result.DropOffTime,
        pickUpLocation: {
            town: result.PickUpLocation?.Town,
            postCode: result.PickUpLocation?.PostCode,
        },
        dropOffLocation: {
            town: result.DropOffLocation?.Town,
            postCode: result.DropOffLocation?.PostCode,
        },
        __typename: "TrackingInfo",
    };
}
