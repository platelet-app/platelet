// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Role = {
  "USER": "USER",
  "COORDINATOR": "COORDINATOR",
  "RIDER": "RIDER",
  "ADMIN": "ADMIN"
};

const CommentVisibility = {
  "EVERYONE": "EVERYONE",
  "ME": "ME"
};

const TaskStatus = {
  "NEW": "NEW",
  "ACTIVE": "ACTIVE",
  "PICKED_UP": "PICKED_UP",
  "DROPPED_OFF": "DROPPED_OFF",
  "CANCELLED": "CANCELLED",
  "REJECTED": "REJECTED",
  "ABANDONED": "ABANDONED",
  "COMPLETED": "COMPLETED"
};

const Priority = {
  "HIGH": "HIGH",
  "MEDIUM": "MEDIUM",
  "LOW": "LOW"
};

const DeliverableTypeIcon = {
  "BUG": "BUG",
  "CHILD": "CHILD",
  "DOCUMENT": "DOCUMENT",
  "EQUIPMENT": "EQUIPMENT",
  "OTHER": "OTHER"
};

const DeliverableUnit = {
  "NONE": "NONE",
  "LITER": "LITER",
  "MILLILITER": "MILLILITER",
  "GRAM": "GRAM",
  "ITEM": "ITEM",
  "BOX": "BOX"
};

const { User, PossibleRiderResponsibilities, RiderResponsibility, Comment, TaskAssignee, Task, Location, Handover, Deliverable, DeliverableType, VehicleAssignment, Vehicle, Tenant, Statistics, SendFeedback, AddressAndContactDetails, S3Object } = initSchema(schema);

export {
  User,
  PossibleRiderResponsibilities,
  RiderResponsibility,
  Comment,
  TaskAssignee,
  Task,
  Location,
  Handover,
  Deliverable,
  DeliverableType,
  VehicleAssignment,
  Vehicle,
  Tenant,
  Role,
  CommentVisibility,
  TaskStatus,
  Priority,
  DeliverableTypeIcon,
  DeliverableUnit,
  Statistics,
  SendFeedback,
  AddressAndContactDetails,
  S3Object
};