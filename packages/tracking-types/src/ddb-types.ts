export type LocationDdb = {
    Town: string;
    PostCode: string;
};

export type TaskDdbRecord = {
    pk: string;
    PickUpTime?: string | null;
    PickUpLocation?: LocationDdb | null;
    DropOffTime?: string | null;
    DropOffLocation?: LocationDdb | null;
    TenantName?: string | null;
    TenantWebsite?: string | null;
    ExpiresAt: number | null;
};

export type TokenDdbRecord = {
    pk: string;
    TaskId: string;
    ExpiresAt: number;
};
