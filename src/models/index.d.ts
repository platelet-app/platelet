import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Role {
  USER = "USER",
  COORDINATOR = "COORDINATOR",
  RIDER = "RIDER",
  ADMIN = "ADMIN"
}

export enum CommentVisibility {
  EVERYONE = "EVERYONE",
  ME = "ME"
}

export enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

export enum DeliverableTypeIcon {
  BUG = "BUG",
  CHILD = "CHILD",
  DOCUMENT = "DOCUMENT",
  EQUIPMENT = "EQUIPMENT",
  OTHER = "OTHER"
}

export enum DeliverableUnit {
  NONE = "NONE",
  LITRE = "LITRE",
  MILLILITRE = "MILLILITRE",
  GRAM = "GRAM",
  ITEM = "ITEM",
  BOX = "BOX"
}

export enum TaskStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  PICKED_UP = "PICKED_UP",
  DROPPED_OFF = "DROPPED_OFF",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  ABANDONED = "ABANDONED",
  COMPLETED = "COMPLETED"
}

export enum Patch {
  NORTH = "NORTH",
  WEST = "WEST",
  EAST = "EAST",
  SOUTH = "SOUTH",
  RELIEF = "RELIEF",
  AIR_AMBULANCE = "AIR_AMBULANCE"
}

export declare class Statistics {
  readonly numCancelled?: number | null;
  readonly numCompleted?: number | null;
  readonly numDroppedOff?: number | null;
  readonly numRejected?: number | null;
  readonly numAbandoned?: number | null;
  readonly numActive?: number | null;
  readonly numPickedUp?: number | null;
  readonly numNew?: number | null;
  readonly numTest?: number | null;
  constructor(init: ModelInit<Statistics>);
}

export declare class AddressAndContactDetails {
  readonly name?: string | null;
  readonly telephoneNumber?: string | null;
  readonly mobileNumber?: string | null;
  readonly emailAddress?: string | null;
  readonly ward?: string | null;
  readonly line1?: string | null;
  readonly line2?: string | null;
  readonly line3?: string | null;
  readonly town?: string | null;
  readonly county?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly postcode?: string | null;
  readonly what3words?: string | null;
  constructor(init: ModelInit<AddressAndContactDetails>);
}

export declare class S3Object {
  readonly bucket: string;
  readonly key: string;
  readonly region: string;
  constructor(init: ModelInit<S3Object>);
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PossibleRiderResponsibilitiesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RiderResponsibilityMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CommentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TaskAssigneeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TaskMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LocationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DeliverableMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DeliverableTypeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TenantMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type VehicleMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class User {
  readonly id: string;
  readonly username: string;
  readonly cognitoId: string;
  readonly tenantId: string;
  readonly contact?: AddressAndContactDetails | null;
  readonly displayName: string;
  readonly name?: string | null;
  readonly roles: Role[] | keyof typeof Role;
  readonly dateOfBirth?: string | null;
  readonly riderResponsibility?: string | null;
  readonly possibleRiderResponsibilities?: (PossibleRiderResponsibilities | null)[] | null;
  readonly profilePictureURL?: string | null;
  readonly profilePictureThumbnailURL?: string | null;
  readonly profilePicture?: S3Object | null;
  readonly profilePictureThumbnail?: S3Object | null;
  readonly comments?: (Comment | null)[] | null;
  readonly assignments?: (TaskAssignee | null)[] | null;
  readonly createdTasks?: (Task | null)[] | null;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class PossibleRiderResponsibilities {
  readonly id: string;
  readonly tenantId: string;
  readonly user: User;
  readonly riderResponsibility: RiderResponsibility;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<PossibleRiderResponsibilities, PossibleRiderResponsibilitiesMetaData>);
  static copyOf(source: PossibleRiderResponsibilities, mutator: (draft: MutableModel<PossibleRiderResponsibilities, PossibleRiderResponsibilitiesMetaData>) => MutableModel<PossibleRiderResponsibilities, PossibleRiderResponsibilitiesMetaData> | void): PossibleRiderResponsibilities;
}

export declare class RiderResponsibility {
  readonly id: string;
  readonly tenantId: string;
  readonly label: string;
  readonly disabled?: number | null;
  readonly possibleUsers?: (PossibleRiderResponsibilities | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<RiderResponsibility, RiderResponsibilityMetaData>);
  static copyOf(source: RiderResponsibility, mutator: (draft: MutableModel<RiderResponsibility, RiderResponsibilityMetaData>) => MutableModel<RiderResponsibility, RiderResponsibilityMetaData> | void): RiderResponsibility;
}

export declare class Comment {
  readonly id: string;
  readonly parentId?: string | null;
  readonly tenantId: string;
  readonly body?: string | null;
  readonly author?: User | null;
  readonly visibility?: CommentVisibility | keyof typeof CommentVisibility | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Comment, CommentMetaData>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

export declare class TaskAssignee {
  readonly id: string;
  readonly tenantId: string;
  readonly role: Role | keyof typeof Role;
  readonly task: Task;
  readonly assignee: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<TaskAssignee, TaskAssigneeMetaData>);
  static copyOf(source: TaskAssignee, mutator: (draft: MutableModel<TaskAssignee, TaskAssigneeMetaData>) => MutableModel<TaskAssignee, TaskAssigneeMetaData> | void): TaskAssignee;
}

export declare class Task {
  readonly id: string;
  readonly tenantId: string;
  readonly createdBy?: User | null;
  readonly timeOfCall?: string | null;
  readonly timePickedUp?: string | null;
  readonly timeDroppedOff?: string | null;
  readonly timeCancelled?: string | null;
  readonly timeRejected?: string | null;
  readonly timeRiderHome?: string | null;
  readonly requesterContact?: AddressAndContactDetails | null;
  readonly pickUpLocation?: Location | null;
  readonly dropOffLocation?: Location | null;
  readonly riderResponsibility?: string | null;
  readonly assignees?: (TaskAssignee | null)[] | null;
  readonly priority?: Priority | keyof typeof Priority | null;
  readonly deliverables?: (Deliverable | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly status?: TaskStatus | keyof typeof TaskStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Task, TaskMetaData>);
  static copyOf(source: Task, mutator: (draft: MutableModel<Task, TaskMetaData>) => MutableModel<Task, TaskMetaData> | void): Task;
}

export declare class Location {
  readonly id: string;
  readonly tenantId: string;
  readonly name?: string | null;
  readonly listed?: number | null;
  readonly contact?: AddressAndContactDetails | null;
  readonly ward?: string | null;
  readonly line1?: string | null;
  readonly line2?: string | null;
  readonly line3?: string | null;
  readonly town?: string | null;
  readonly county?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly postcode?: string | null;
  readonly what3words?: string | null;
  readonly tasksAsPickUp?: (Task | null)[] | null;
  readonly tasksAsDropOff?: (Task | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Location, LocationMetaData>);
  static copyOf(source: Location, mutator: (draft: MutableModel<Location, LocationMetaData>) => MutableModel<Location, LocationMetaData> | void): Location;
}

export declare class Deliverable {
  readonly id: string;
  readonly tenantId: string;
  readonly deliverableType?: DeliverableType | null;
  readonly task?: Task | null;
  readonly count?: number | null;
  readonly unit?: DeliverableUnit | keyof typeof DeliverableUnit | null;
  readonly orderInGrid?: number | null;
  readonly comments?: (Comment | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Deliverable, DeliverableMetaData>);
  static copyOf(source: Deliverable, mutator: (draft: MutableModel<Deliverable, DeliverableMetaData>) => MutableModel<Deliverable, DeliverableMetaData> | void): Deliverable;
}

export declare class DeliverableType {
  readonly id: string;
  readonly label: string;
  readonly tenantId: string;
  readonly icon?: DeliverableTypeIcon | keyof typeof DeliverableTypeIcon | null;
  readonly defaultUnit?: DeliverableUnit | keyof typeof DeliverableUnit | null;
  readonly deliverables?: (Deliverable | null)[] | null;
  readonly tags?: (string | null)[] | null;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<DeliverableType, DeliverableTypeMetaData>);
  static copyOf(source: DeliverableType, mutator: (draft: MutableModel<DeliverableType, DeliverableTypeMetaData>) => MutableModel<DeliverableType, DeliverableTypeMetaData> | void): DeliverableType;
}

export declare class Tenant {
  readonly id: string;
  readonly name: string;
  readonly referenceIdentifier: string;
  readonly admin: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly tenantAdminId: string;
  constructor(init: ModelInit<Tenant, TenantMetaData>);
  static copyOf(source: Tenant, mutator: (draft: MutableModel<Tenant, TenantMetaData>) => MutableModel<Tenant, TenantMetaData> | void): Tenant;
}

export declare class Vehicle {
  readonly id: string;
  readonly tenantId: string;
  readonly assignedUserID?: string | null;
  readonly name?: string | null;
  readonly manufacturer?: string | null;
  readonly model?: string | null;
  readonly dateOfManufacture?: string | null;
  readonly dateOfRegistration?: string | null;
  readonly comments?: (Comment | null)[] | null;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Vehicle, VehicleMetaData>);
  static copyOf(source: Vehicle, mutator: (draft: MutableModel<Vehicle, VehicleMetaData>) => MutableModel<Vehicle, VehicleMetaData> | void): Vehicle;
}