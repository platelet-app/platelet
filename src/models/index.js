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
  "LITRE": "LITRE",
  "MILLILITRE": "MILLILITRE",
  "GRAM": "GRAM",
  "ITEM": "ITEM",
  "BOX": "BOX"
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

const Patch = {
  "NORTH": "NORTH",
  "WEST": "WEST",
  "EAST": "EAST",
  "SOUTH": "SOUTH",
  "RELIEF": "RELIEF",
  "AIR_AMBULANCE": "AIR_AMBULANCE"
};

const { User, PossibleRiderResponsibilities, RiderResponsibility, Comment, TaskAssignee, Task, Location, Deliverable, DeliverableType, VehicleAssignment, Vehicle, Tenant, Statistics, AddressAndContactDetails, S3Object } = initSchema(schema);

export {
  User,
  PossibleRiderResponsibilities,
  RiderResponsibility,
  Comment,
  TaskAssignee,
  Task,
  Location,
  Deliverable,
  DeliverableType,
  VehicleAssignment,
  Vehicle,
  Tenant,
  Role,
  CommentVisibility,
  Priority,
  DeliverableTypeIcon,
  DeliverableUnit,
  TaskStatus,
  Patch,
  Statistics,
  AddressAndContactDetails,
  S3Object
};