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

const DeliverableUnit = {
  "LITRE": "LITRE",
  "MILLILITRES": "MILLILITRES",
  "GRAMS": "GRAMS",
  "COUNT": "COUNT",
  "BOX": "BOX"
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
  "REJECTED": "REJECTED"
};

const Patch = {
  "NORTH": "NORTH",
  "WEST": "WEST",
  "EAST": "EAST",
  "SOUTH": "SOUTH",
  "RELIEF": "RELIEF",
  "AIR_AMBULANCE": "AIR_AMBULANCE"
};

const { User, AddressAndContactDetails, Vehicle, Comment, RiderResponsibility, Group, RiderTasks, Task, Location, CoordinatorTasks, Deliverable, DeliverableType } = initSchema(schema);

export {
  User,
  AddressAndContactDetails,
  Vehicle,
  Comment,
  RiderResponsibility,
  Group,
  RiderTasks,
  Task,
  Location,
  CoordinatorTasks,
  Deliverable,
  DeliverableType,
  Role,
  CommentVisibility,
  Priority,
  DeliverableUnit,
  DeliverableTypeIcon,
  TaskStatus,
  Patch
};