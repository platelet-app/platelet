// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Role = {
  "COORDINATOR": "COORDINATOR",
  "RIDER": "RIDER",
  "ADMIN": "ADMIN"
};

const Patch = {
  "NORTH": "NORTH",
  "WEST": "WEST",
  "EAST": "EAST",
  "SOUTH": "SOUTH",
  "RELIEF": "RELIEF",
  "AIR_AMBULANCE": "AIR_AMBULANCE"
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

const TaskStatus = {
  "NEW": "NEW",
  "ACTIVE": "ACTIVE",
  "PICKED_UP": "PICKED_UP",
  "DROPPED_OFF": "DROPPED_OFF",
  "CANCELLED": "CANCELLED",
  "REJECTED": "REJECTED"
};

const { User, AddressAndContactDetails, Vehicle, Comment, Group, UserTasks, Task, CoordinatorTasks, Deliverable, DeliverableType, Location } = initSchema(schema);

export {
  User,
  AddressAndContactDetails,
  Vehicle,
  Comment,
  Group,
  UserTasks,
  Task,
  CoordinatorTasks,
  Deliverable,
  DeliverableType,
  Location,
  Role,
  Patch,
  Priority,
  DeliverableUnit,
  TaskStatus
};