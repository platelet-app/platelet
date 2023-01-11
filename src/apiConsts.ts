export const protectedFields = [
    "id",
    "_version",
    "_lastChangedAt",
    "_deleted",
    "updatedAt",
    "createdAt",
    "tenantId",
];

export enum deliverableIcons {
    bug = "BUG",
    child = "CHILD",
    document = "DOCUMENT",
    equipment = "EQUIPMENT",
    other = "OTHER",
}

export type TaskTimeName =
    | "timePickedUpSenderName"
    | "timeDroppedOffRecipientName"
    | null;

export type TaskTimeKey =
    | "timeOfCall"
    | "timePickedUp"
    | "timeDroppedOff"
    | "timeCancelled"
    | "timeRejected"
    | "timeRiderHome"
    | "timePickedUpSenderName"
    | "timeDroppedOffRecipientName"
    | null;

export enum S3ObjectAccessLevels {
    protected = "protected",
    public = "public",
    private = "private",
}
