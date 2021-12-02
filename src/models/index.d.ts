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



type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type AddressAndContactDetailsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type VehicleMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CommentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RiderResponsibilityMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GroupMetaData = {
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

export declare class User {
  readonly id: string;
  readonly username: string;
  readonly contact?: AddressAndContactDetails;
  readonly displayName: string;
  readonly name?: string;
  readonly roles: Role[] | keyof typeof Role;
  readonly dateOfBirth?: string;
  readonly vehicles?: (Vehicle | null)[];
  readonly riderResponsibility?: RiderResponsibility;
  readonly profilePictureURL?: string;
  readonly profilePictureThumbnailURL?: string;
  readonly comments?: Comment[];
  readonly group?: Group;
  readonly assignments?: (TaskAssignee | null)[];
  readonly active: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class AddressAndContactDetails {
  readonly id: string;
  readonly name?: string;
  readonly telephoneNumber?: string;
  readonly mobileNumber?: string;
  readonly emailAddress?: string;
  readonly ward?: string;
  readonly line1?: string;
  readonly line2?: string;
  readonly line3?: string;
  readonly town?: string;
  readonly county?: string;
  readonly state?: string;
  readonly country?: string;
  readonly postcode?: string;
  readonly what3words?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<AddressAndContactDetails, AddressAndContactDetailsMetaData>);
  static copyOf(source: AddressAndContactDetails, mutator: (draft: MutableModel<AddressAndContactDetails, AddressAndContactDetailsMetaData>) => MutableModel<AddressAndContactDetails, AddressAndContactDetailsMetaData> | void): AddressAndContactDetails;
}

export declare class Vehicle {
  readonly id: string;
  readonly name: string;
  readonly manufacturer?: string;
  readonly model?: string;
  readonly dateOfManufacture?: string;
  readonly dateOfRegistration?: string;
  readonly assignedUser?: User;
  readonly comments?: Comment[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Vehicle, VehicleMetaData>);
  static copyOf(source: Vehicle, mutator: (draft: MutableModel<Vehicle, VehicleMetaData>) => MutableModel<Vehicle, VehicleMetaData> | void): Vehicle;
}

export declare class Comment {
  readonly id: string;
  readonly parentId: string;
  readonly body: string;
  readonly author: User;
  readonly visibility?: CommentVisibility | keyof typeof CommentVisibility;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Comment, CommentMetaData>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

export declare class RiderResponsibility {
  readonly id: string;
  readonly label: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<RiderResponsibility, RiderResponsibilityMetaData>);
  static copyOf(source: RiderResponsibility, mutator: (draft: MutableModel<RiderResponsibility, RiderResponsibilityMetaData>) => MutableModel<RiderResponsibility, RiderResponsibilityMetaData> | void): RiderResponsibility;
}

export declare class Group {
  readonly id: string;
  readonly taskGroupId?: string;
  readonly name?: string;
  readonly users?: (User | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Group, GroupMetaData>);
  static copyOf(source: Group, mutator: (draft: MutableModel<Group, GroupMetaData>) => MutableModel<Group, GroupMetaData> | void): Group;
}

export declare class TaskAssignee {
  readonly id: string;
  readonly role: Role | keyof typeof Role;
  readonly task: Task;
  readonly assignee: User;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<TaskAssignee, TaskAssigneeMetaData>);
  static copyOf(source: TaskAssignee, mutator: (draft: MutableModel<TaskAssignee, TaskAssigneeMetaData>) => MutableModel<TaskAssignee, TaskAssigneeMetaData> | void): TaskAssignee;
}

export declare class Task {
  readonly id: string;
  readonly name?: string;
  readonly createdBy?: User;
  readonly timeOfCall?: string;
  readonly timePickedUp?: string;
  readonly timeDroppedOff?: string;
  readonly timeCancelled?: string;
  readonly timeRejected?: string;
  readonly requesterContact?: AddressAndContactDetails;
  readonly pickUpLocation?: Location;
  readonly dropOffLocation?: Location;
  readonly riderResponsibility?: RiderResponsibility;
  readonly assignees?: (TaskAssignee | null)[];
  readonly priority?: Priority | keyof typeof Priority;
  readonly deliverables?: Deliverable[];
  readonly relayPrevious?: Task;
  readonly relayNext?: Task;
  readonly group?: (Group | null)[];
  readonly comments?: Comment[];
  readonly status: TaskStatus | keyof typeof TaskStatus;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Task, TaskMetaData>);
  static copyOf(source: Task, mutator: (draft: MutableModel<Task, TaskMetaData>) => MutableModel<Task, TaskMetaData> | void): Task;
}

export declare class Location {
  readonly id: string;
  readonly name?: string;
  readonly listed?: number;
  readonly contact?: AddressAndContactDetails;
  readonly ward?: string;
  readonly line1?: string;
  readonly line2?: string;
  readonly line3?: string;
  readonly town?: string;
  readonly county?: string;
  readonly state?: string;
  readonly country?: string;
  readonly postcode?: string;
  readonly what3words?: string;
  readonly tasksAsPickUp?: (Task | null)[];
  readonly tasksAsDropOff?: (Task | null)[];
  readonly comments?: Comment[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Location, LocationMetaData>);
  static copyOf(source: Location, mutator: (draft: MutableModel<Location, LocationMetaData>) => MutableModel<Location, LocationMetaData> | void): Location;
}

export declare class Deliverable {
  readonly id: string;
  readonly deliverableType: DeliverableType;
  readonly taskDeliverablesId?: string;
  readonly task?: Task;
  readonly count?: number;
  readonly unit?: DeliverableUnit | keyof typeof DeliverableUnit;
  readonly orderInGrid?: number;
  readonly comments?: Comment[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Deliverable, DeliverableMetaData>);
  static copyOf(source: Deliverable, mutator: (draft: MutableModel<Deliverable, DeliverableMetaData>) => MutableModel<Deliverable, DeliverableMetaData> | void): Deliverable;
}

export declare class DeliverableType {
  readonly id: string;
  readonly label: string;
  readonly icon?: DeliverableTypeIcon | keyof typeof DeliverableTypeIcon;
  readonly defaultUnit?: DeliverableUnit | keyof typeof DeliverableUnit;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<DeliverableType, DeliverableTypeMetaData>);
  static copyOf(source: DeliverableType, mutator: (draft: MutableModel<DeliverableType, DeliverableTypeMetaData>) => MutableModel<DeliverableType, DeliverableTypeMetaData> | void): DeliverableType;
}