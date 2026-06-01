import type {
    TrackingData,
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
            pk: util.dynamodb.toDynamoDB(ctx?.prev?.result?.pk),
            sk: util.dynamodb.toDynamoDB("metadata"),
        },
    };
}

export function response(
    ctx: Context<QueryGetTrackingArgs, object, object, object, TaskDdbRecord>
): TrackingData | null {
    const { result } = ctx;
    if (!result) {
        return null;
    }
    return {
        id: result.pk,
        tenantName: result.TenantName ?? null,
        tenantWebsite: result.TenantWebsite ?? null,
        pickUpTime: result.PickUpTime ?? null,
        dropOffTime: result.DropOffTime ?? null,
        pickUpLocation: {
            town: result.PickUpLocation?.Town ?? null,
            postCode: result.PickUpLocation?.PostCode ?? null,
        },
        dropOffLocation: {
            town: result.DropOffLocation?.Town ?? null,
            postCode: result.DropOffLocation?.PostCode ?? null,
        },
        __typename: "TrackingData",
    };
}
