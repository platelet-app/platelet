export type LocationDdb = {
    Town: string;
    PostCode: string;
};

export type TaskDdbRecord = {
    pk: string;
    sk: string;
    PickUpTime: string;
    PickUpLocation: LocationDdb;
    DropOffTime: string;
    DropOffLocation: LocationDdb;
    TenantName: string;
    TenantWebsite: string;
    ExpiresAt: number;
};

export type TokenDdbRecord = {
    pk: string;
    TaskId: string;
};
