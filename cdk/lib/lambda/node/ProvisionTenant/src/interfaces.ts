export type ProvisionMode = "bootstrap" | "preview";

export interface LambdaEvent {
    mode: ProvisionMode;
    tenantName: string;
    adminName: string;
    adminEmailAddress: string;
}

export interface LambdaReturn {
    status: "created" | "already-provisioned";
    tenantId: string;
    // only set in preview mode, where the credentials are surfaced to
    // developers instead of being sent by welcome email
    loginEmailAddress?: string | undefined;
    password?: string | undefined;
}

export interface TenantRecord {
    id: string;
    name: string;
    referenceIdentifier: string;
    _version: number;
    _deleted?: boolean | null;
    admin?: {
        id: string;
        username: string;
        contact?: { emailAddress?: string | null } | null;
    } | null;
}

export interface UserRecord {
    id: string;
    username: string;
    _version: number;
    contact?: { emailAddress?: string | null } | null;
}
