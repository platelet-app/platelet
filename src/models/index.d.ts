import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

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
  LITER = "LITER",
  MILLILITER = "MILLILITER",
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

type EagerStatistics = {
  readonly numCancelled?: number | null;
  readonly numCompleted?: number | null;
  readonly numDroppedOff?: number | null;
  readonly numRejected?: number | null;
  readonly numAbandoned?: number | null;
  readonly numActive?: number | null;
  readonly numPickedUp?: number | null;
  readonly numNew?: number | null;
  readonly numTest?: number | null;
}

type LazyStatistics = {
  readonly numCancelled?: number | null;
  readonly numCompleted?: number | null;
  readonly numDroppedOff?: number | null;
  readonly numRejected?: number | null;
  readonly numAbandoned?: number | null;
  readonly numActive?: number | null;
  readonly numPickedUp?: number | null;
  readonly numNew?: number | null;
  readonly numTest?: number | null;
}

export declare type Statistics = LazyLoading extends LazyLoadingDisabled ? EagerStatistics : LazyStatistics

export declare const Statistics: (new (init: ModelInit<Statistics>) => Statistics)

type EagerSendFeedback = {
  readonly successState?: boolean | null;
}

type LazySendFeedback = {
  readonly successState?: boolean | null;
}

export declare type SendFeedback = LazyLoading extends LazyLoadingDisabled ? EagerSendFeedback : LazySendFeedback

export declare const SendFeedback: (new (init: ModelInit<SendFeedback>) => SendFeedback)

type EagerAddressAndContactDetails = {
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
}

type LazyAddressAndContactDetails = {
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
}

export declare type AddressAndContactDetails = LazyLoading extends LazyLoadingDisabled ? EagerAddressAndContactDetails : LazyAddressAndContactDetails

export declare const AddressAndContactDetails: (new (init: ModelInit<AddressAndContactDetails>) => AddressAndContactDetails)

type EagerS3Object = {
  readonly bucket: string;
  readonly key: string;
  readonly region: string;
}

type LazyS3Object = {
  readonly bucket: string;
  readonly key: string;
  readonly region: string;
}

export declare type S3Object = LazyLoading extends LazyLoadingDisabled ? EagerS3Object : LazyS3Object

export declare const S3Object: (new (init: ModelInit<S3Object>) => S3Object)

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

type VehicleAssignmentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type VehicleMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TenantMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerUser = {
  readonly id: string;
  readonly username: string;
  readonly cognitoId: string;
  readonly tenantId: string;
  readonly isPrimaryAdmin?: number | null;
  readonly contact?: AddressAndContactDetails | null;
  readonly displayName: string;
  readonly name?: string | null;
  readonly roles: Role[] | keyof typeof Role;
  readonly dateOfBirth?: string | null;
  readonly riderResponsibility?: string | null;
  readonly possibleRiderResponsibilities?: (PossibleRiderResponsibilities | null)[] | null;
  readonly profilePictureURL?: string | null;
  readonly profilePicture?: S3Object | null;
  readonly comments?: (Comment | null)[] | null;
  readonly assignments?: (TaskAssignee | null)[] | null;
  readonly vehicleAssignments?: (VehicleAssignment | null)[] | null;
  readonly createdTasks?: (Task | null)[] | null;
  readonly createdLocations?: (Location | null)[] | null;
  readonly createdVehicles?: (Vehicle | null)[] | null;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly username: string;
  readonly cognitoId: string;
  readonly tenantId: string;
  readonly isPrimaryAdmin?: number | null;
  readonly contact?: AddressAndContactDetails | null;
  readonly displayName: string;
  readonly name?: string | null;
  readonly roles: Role[] | keyof typeof Role;
  readonly dateOfBirth?: string | null;
  readonly riderResponsibility?: string | null;
  readonly possibleRiderResponsibilities: AsyncCollection<PossibleRiderResponsibilities>;
  readonly profilePictureURL?: string | null;
  readonly profilePicture?: S3Object | null;
  readonly comments: AsyncCollection<Comment>;
  readonly assignments: AsyncCollection<TaskAssignee>;
  readonly vehicleAssignments: AsyncCollection<VehicleAssignment>;
  readonly createdTasks: AsyncCollection<Task>;
  readonly createdLocations: AsyncCollection<Location>;
  readonly createdVehicles: AsyncCollection<Vehicle>;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

type EagerPossibleRiderResponsibilities = {
  readonly id: string;
  readonly tenantId: string;
  readonly user: User;
  readonly riderResponsibility: RiderResponsibility;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPossibleRiderResponsibilities = {
  readonly id: string;
  readonly tenantId: string;
  readonly user: AsyncItem<User>;
  readonly riderResponsibility: AsyncItem<RiderResponsibility>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PossibleRiderResponsibilities = LazyLoading extends LazyLoadingDisabled ? EagerPossibleRiderResponsibilities : LazyPossibleRiderResponsibilities

export declare const PossibleRiderResponsibilities: (new (init: ModelInit<PossibleRiderResponsibilities, PossibleRiderResponsibilitiesMetaData>) => PossibleRiderResponsibilities) & {
  copyOf(source: PossibleRiderResponsibilities, mutator: (draft: MutableModel<PossibleRiderResponsibilities, PossibleRiderResponsibilitiesMetaData>) => MutableModel<PossibleRiderResponsibilities, PossibleRiderResponsibilitiesMetaData> | void): PossibleRiderResponsibilities;
}

type EagerRiderResponsibility = {
  readonly id: string;
  readonly tenantId: string;
  readonly label: string;
  readonly disabled?: number | null;
  readonly possibleUsers?: (PossibleRiderResponsibilities | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRiderResponsibility = {
  readonly id: string;
  readonly tenantId: string;
  readonly label: string;
  readonly disabled?: number | null;
  readonly possibleUsers: AsyncCollection<PossibleRiderResponsibilities>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RiderResponsibility = LazyLoading extends LazyLoadingDisabled ? EagerRiderResponsibility : LazyRiderResponsibility

export declare const RiderResponsibility: (new (init: ModelInit<RiderResponsibility, RiderResponsibilityMetaData>) => RiderResponsibility) & {
  copyOf(source: RiderResponsibility, mutator: (draft: MutableModel<RiderResponsibility, RiderResponsibilityMetaData>) => MutableModel<RiderResponsibility, RiderResponsibilityMetaData> | void): RiderResponsibility;
}

type EagerComment = {
  readonly id: string;
  readonly parentId?: string | null;
  readonly tenantId: string;
  readonly body?: string | null;
  readonly author?: User | null;
  readonly visibility?: CommentVisibility | keyof typeof CommentVisibility | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyComment = {
  readonly id: string;
  readonly parentId?: string | null;
  readonly tenantId: string;
  readonly body?: string | null;
  readonly author: AsyncItem<User | undefined>;
  readonly visibility?: CommentVisibility | keyof typeof CommentVisibility | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Comment = LazyLoading extends LazyLoadingDisabled ? EagerComment : LazyComment

export declare const Comment: (new (init: ModelInit<Comment, CommentMetaData>) => Comment) & {
  copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

type EagerTaskAssignee = {
  readonly id: string;
  readonly tenantId: string;
  readonly role: Role | keyof typeof Role;
  readonly task: Task;
  readonly assignee: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTaskAssignee = {
  readonly id: string;
  readonly tenantId: string;
  readonly role: Role | keyof typeof Role;
  readonly task: AsyncItem<Task>;
  readonly assignee: AsyncItem<User>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TaskAssignee = LazyLoading extends LazyLoadingDisabled ? EagerTaskAssignee : LazyTaskAssignee

export declare const TaskAssignee: (new (init: ModelInit<TaskAssignee, TaskAssigneeMetaData>) => TaskAssignee) & {
  copyOf(source: TaskAssignee, mutator: (draft: MutableModel<TaskAssignee, TaskAssigneeMetaData>) => MutableModel<TaskAssignee, TaskAssigneeMetaData> | void): TaskAssignee;
}

type EagerTask = {
  readonly id: string;
  readonly tenantId: string;
  readonly createdBy?: User | null;
  readonly dateCreated: string;
  readonly timeOfCall?: string | null;
  readonly timePickedUp?: string | null;
  readonly timePickedUpSenderName?: string | null;
  readonly timeDroppedOff?: string | null;
  readonly timeDroppedOffRecipientName?: string | null;
  readonly timeCancelled?: string | null;
  readonly timeRejected?: string | null;
  readonly timeRiderHome?: string | null;
  readonly requesterContact?: AddressAndContactDetails | null;
  readonly pickUpLocation?: Location | null;
  readonly dropOffLocation?: Location | null;
  readonly establishmentLocation?: Location | null;
  readonly riderResponsibility?: string | null;
  readonly assignees?: (TaskAssignee | null)[] | null;
  readonly priority?: Priority | keyof typeof Priority | null;
  readonly deliverables?: (Deliverable | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly status?: TaskStatus | keyof typeof TaskStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTask = {
  readonly id: string;
  readonly tenantId: string;
  readonly createdBy: AsyncItem<User | undefined>;
  readonly dateCreated: string;
  readonly timeOfCall?: string | null;
  readonly timePickedUp?: string | null;
  readonly timePickedUpSenderName?: string | null;
  readonly timeDroppedOff?: string | null;
  readonly timeDroppedOffRecipientName?: string | null;
  readonly timeCancelled?: string | null;
  readonly timeRejected?: string | null;
  readonly timeRiderHome?: string | null;
  readonly requesterContact?: AddressAndContactDetails | null;
  readonly pickUpLocation: AsyncItem<Location | undefined>;
  readonly dropOffLocation: AsyncItem<Location | undefined>;
  readonly establishmentLocation: AsyncItem<Location | undefined>;
  readonly riderResponsibility?: string | null;
  readonly assignees: AsyncCollection<TaskAssignee>;
  readonly priority?: Priority | keyof typeof Priority | null;
  readonly deliverables: AsyncCollection<Deliverable>;
  readonly comments: AsyncCollection<Comment>;
  readonly status?: TaskStatus | keyof typeof TaskStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Task = LazyLoading extends LazyLoadingDisabled ? EagerTask : LazyTask

export declare const Task: (new (init: ModelInit<Task, TaskMetaData>) => Task) & {
  copyOf(source: Task, mutator: (draft: MutableModel<Task, TaskMetaData>) => MutableModel<Task, TaskMetaData> | void): Task;
}

type EagerLocation = {
  readonly id: string;
  readonly tenantId: string;
  readonly createdBy?: User | null;
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
  readonly taskAsEstablishment?: (Task | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly disabled?: number | null;
  readonly googleMapsPlaceId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLocation = {
  readonly id: string;
  readonly tenantId: string;
  readonly createdBy: AsyncItem<User | undefined>;
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
  readonly tasksAsPickUp: AsyncCollection<Task>;
  readonly tasksAsDropOff: AsyncCollection<Task>;
  readonly taskAsEstablishment: AsyncCollection<Task>;
  readonly comments: AsyncCollection<Comment>;
  readonly disabled?: number | null;
  readonly googleMapsPlaceId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Location = LazyLoading extends LazyLoadingDisabled ? EagerLocation : LazyLocation

export declare const Location: (new (init: ModelInit<Location, LocationMetaData>) => Location) & {
  copyOf(source: Location, mutator: (draft: MutableModel<Location, LocationMetaData>) => MutableModel<Location, LocationMetaData> | void): Location;
}

type EagerDeliverable = {
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
}

type LazyDeliverable = {
  readonly id: string;
  readonly tenantId: string;
  readonly deliverableType: AsyncItem<DeliverableType | undefined>;
  readonly task: AsyncItem<Task | undefined>;
  readonly count?: number | null;
  readonly unit?: DeliverableUnit | keyof typeof DeliverableUnit | null;
  readonly orderInGrid?: number | null;
  readonly comments: AsyncCollection<Comment>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Deliverable = LazyLoading extends LazyLoadingDisabled ? EagerDeliverable : LazyDeliverable

export declare const Deliverable: (new (init: ModelInit<Deliverable, DeliverableMetaData>) => Deliverable) & {
  copyOf(source: Deliverable, mutator: (draft: MutableModel<Deliverable, DeliverableMetaData>) => MutableModel<Deliverable, DeliverableMetaData> | void): Deliverable;
}

type EagerDeliverableType = {
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
}

type LazyDeliverableType = {
  readonly id: string;
  readonly label: string;
  readonly tenantId: string;
  readonly icon?: DeliverableTypeIcon | keyof typeof DeliverableTypeIcon | null;
  readonly defaultUnit?: DeliverableUnit | keyof typeof DeliverableUnit | null;
  readonly deliverables: AsyncCollection<Deliverable>;
  readonly tags?: (string | null)[] | null;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type DeliverableType = LazyLoading extends LazyLoadingDisabled ? EagerDeliverableType : LazyDeliverableType

export declare const DeliverableType: (new (init: ModelInit<DeliverableType, DeliverableTypeMetaData>) => DeliverableType) & {
  copyOf(source: DeliverableType, mutator: (draft: MutableModel<DeliverableType, DeliverableTypeMetaData>) => MutableModel<DeliverableType, DeliverableTypeMetaData> | void): DeliverableType;
}

type EagerVehicleAssignment = {
  readonly id: string;
  readonly tenantId: string;
  readonly vehicle: Vehicle;
  readonly assignee: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVehicleAssignment = {
  readonly id: string;
  readonly tenantId: string;
  readonly vehicle: AsyncItem<Vehicle>;
  readonly assignee: AsyncItem<User>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type VehicleAssignment = LazyLoading extends LazyLoadingDisabled ? EagerVehicleAssignment : LazyVehicleAssignment

export declare const VehicleAssignment: (new (init: ModelInit<VehicleAssignment, VehicleAssignmentMetaData>) => VehicleAssignment) & {
  copyOf(source: VehicleAssignment, mutator: (draft: MutableModel<VehicleAssignment, VehicleAssignmentMetaData>) => MutableModel<VehicleAssignment, VehicleAssignmentMetaData> | void): VehicleAssignment;
}

type EagerVehicle = {
  readonly id: string;
  readonly tenantId: string;
  readonly createdBy?: User | null;
  readonly name?: string | null;
  readonly manufacturer?: string | null;
  readonly model?: string | null;
  readonly dateOfManufacture?: string | null;
  readonly dateOfRegistration?: string | null;
  readonly assignments?: (VehicleAssignment | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVehicle = {
  readonly id: string;
  readonly tenantId: string;
  readonly createdBy: AsyncItem<User | undefined>;
  readonly name?: string | null;
  readonly manufacturer?: string | null;
  readonly model?: string | null;
  readonly dateOfManufacture?: string | null;
  readonly dateOfRegistration?: string | null;
  readonly assignments: AsyncCollection<VehicleAssignment>;
  readonly comments: AsyncCollection<Comment>;
  readonly disabled?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Vehicle = LazyLoading extends LazyLoadingDisabled ? EagerVehicle : LazyVehicle

export declare const Vehicle: (new (init: ModelInit<Vehicle, VehicleMetaData>) => Vehicle) & {
  copyOf(source: Vehicle, mutator: (draft: MutableModel<Vehicle, VehicleMetaData>) => MutableModel<Vehicle, VehicleMetaData> | void): Vehicle;
}

type EagerTenant = {
  readonly id: string;
  readonly name: string;
  readonly referenceIdentifier: string;
  readonly admin: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly tenantAdminId: string;
}

type LazyTenant = {
  readonly id: string;
  readonly name: string;
  readonly referenceIdentifier: string;
  readonly admin: AsyncItem<User>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly tenantAdminId: string;
}

export declare type Tenant = LazyLoading extends LazyLoadingDisabled ? EagerTenant : LazyTenant

export declare const Tenant: (new (init: ModelInit<Tenant, TenantMetaData>) => Tenant) & {
  copyOf(source: Tenant, mutator: (draft: MutableModel<Tenant, TenantMetaData>) => MutableModel<Tenant, TenantMetaData> | void): Tenant;
}