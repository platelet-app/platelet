export type LocationDdb = {
    Town: string;
    PostCode: string;
};

export type TaskDdbRecord = {
    pk: string;
    sk: string;
    PickUpTime?: string | null;
    PickUpLocation?: LocationDdb | null;
    DropOffTime?: string | null;
    DropOffLocation?: LocationDdb | null;
    CancelTime?: string | null;
    RejectTime?: string | null;
    TenantName?: string | null;
    TenantWebsite?: string | null;
    ExpiresAt: number | null;
};

export type TokenDdbRecord = {
    pk: string;
    sk: string;
    ExpiresAt: number;
};
