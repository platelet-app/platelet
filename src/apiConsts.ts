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

export enum userRoles {
    admin = "ADMIN",
    user = "USER",
    coordinator = "COORDINATOR",
    rider = "RIDER",
}

export type UserRole = "ADMIN" | "RIDER" | "USER" | "COORDINATOR";

export enum commentVisibility {
    everyone = "EVERYONE",
    me = "ME",
}

export enum tasksStatus {
    new = "NEW",
    active = "ACTIVE",
    pickedUp = "PICKED_UP",
    droppedOff = "DROPPED_OFF",
    rejected = "REJECTED",
    cancelled = "CANCELLED",
    abandoned = "ABANDONED",
    completed = "COMPLETED",
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

export enum priorities {
    high = "HIGH",
    medium = "MEDIUM",
    low = "LOW",
}

export enum deliverableUnits {
    none = "NONE",
    liter = "LITER",
    milliliter = "MILLILITER",
    gram = "GRAM",
    item = "ITEM",
    box = "BOX",
}

export enum S3ObjectAccessLevels {
    protected = "protected",
    public = "public",
    private = "private",
}
