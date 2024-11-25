// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TimeRelation = {
  "BEFORE": "BEFORE",
  "AFTER": "AFTER",
  "AT": "AT",
  "ANYTIME": "ANYTIME"
};

const DeliverableTypeIcon = {
  "BUG": "BUG",
  "CHILD": "CHILD",
  "DOCUMENT": "DOCUMENT",
  "EQUIPMENT": "EQUIPMENT",
  "OTHER": "OTHER"
};

const TaskStatus = {
  "NEW": "NEW",
  "ACTIVE": "ACTIVE",
  "PICKED_UP": "PICKED_UP",
  "DROPPED_OFF": "DROPPED_OFF",
  "CANCELLED": "CANCELLED",
  "REJECTED": "REJECTED",
  "ABANDONED": "ABANDONED",
  "COMPLETED": "COMPLETED",
  "PENDING": "PENDING",
  "FUTURE": "FUTURE"
};

const Priority = {
  "HIGH": "HIGH",
  "MEDIUM": "MEDIUM",
  "LOW": "LOW"
};

const DeliverableUnit = {
  "NONE": "NONE",
  "LITER": "LITER",
  "MILLILITER": "MILLILITER",
  "GRAM": "GRAM",
  "ITEM": "ITEM",
  "BOX": "BOX"
};

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

const { Tenant, User, PossibleRiderResponsibilities, Vehicle, VehicleAssignment, Location, Task, TaskAssignee, ScheduledTask, Comment, DeliverableType, Deliverable, RiderResponsibility, S3Object, AddressAndContactDetails, Schedule, SendFeedback, Statistics } = initSchema(schema);

export {
  Tenant,
  User,
  PossibleRiderResponsibilities,
  Vehicle,
  VehicleAssignment,
  Location,
  Task,
  TaskAssignee,
  ScheduledTask,
  Comment,
  DeliverableType,
  Deliverable,
  RiderResponsibility,
  TimeRelation,
  DeliverableTypeIcon,
  TaskStatus,
  Priority,
  DeliverableUnit,
  Role,
  CommentVisibility,
  S3Object,
  AddressAndContactDetails,
  Schedule,
  SendFeedback,
  Statistics
};