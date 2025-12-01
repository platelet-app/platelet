/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API.js";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateTenant = /* GraphQL */ `subscription OnCreateTenant($filter: ModelSubscriptionTenantFilterInput) {
  onCreateTenant(filter: $filter) {
    id
    name
    referenceIdentifier
    admin {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    tenantAdminId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTenantSubscriptionVariables,
  APITypes.OnCreateTenantSubscription
>;
export const onUpdateTenant = /* GraphQL */ `subscription OnUpdateTenant($filter: ModelSubscriptionTenantFilterInput) {
  onUpdateTenant(filter: $filter) {
    id
    name
    referenceIdentifier
    admin {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    tenantAdminId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTenantSubscriptionVariables,
  APITypes.OnUpdateTenantSubscription
>;
export const onDeleteTenant = /* GraphQL */ `subscription OnDeleteTenant($filter: ModelSubscriptionTenantFilterInput) {
  onDeleteTenant(filter: $filter) {
    id
    name
    referenceIdentifier
    admin {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    tenantAdminId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTenantSubscriptionVariables,
  APITypes.OnDeleteTenantSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $cognitoId: String
) {
  onCreateUser(filter: $filter, cognitoId: $cognitoId) {
    id
    username
    cognitoId
    tenantId
    isPrimaryAdmin
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    displayName
    name
    roles
    dateOfBirth
    riderResponsibility
    possibleRiderResponsibilities {
      nextToken
      startedAt
      __typename
    }
    profilePicture {
      bucket
      key
      region
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    assignments {
      nextToken
      startedAt
      __typename
    }
    vehicleAssignments {
      nextToken
      startedAt
      __typename
    }
    createdTasks {
      nextToken
      startedAt
      __typename
    }
    createdLocations {
      nextToken
      startedAt
      __typename
    }
    createdVehicles {
      nextToken
      startedAt
      __typename
    }
    createdScheduledTasks {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $cognitoId: String
) {
  onUpdateUser(filter: $filter, cognitoId: $cognitoId) {
    id
    username
    cognitoId
    tenantId
    isPrimaryAdmin
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    displayName
    name
    roles
    dateOfBirth
    riderResponsibility
    possibleRiderResponsibilities {
      nextToken
      startedAt
      __typename
    }
    profilePicture {
      bucket
      key
      region
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    assignments {
      nextToken
      startedAt
      __typename
    }
    vehicleAssignments {
      nextToken
      startedAt
      __typename
    }
    createdTasks {
      nextToken
      startedAt
      __typename
    }
    createdLocations {
      nextToken
      startedAt
      __typename
    }
    createdVehicles {
      nextToken
      startedAt
      __typename
    }
    createdScheduledTasks {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $cognitoId: String
) {
  onDeleteUser(filter: $filter, cognitoId: $cognitoId) {
    id
    username
    cognitoId
    tenantId
    isPrimaryAdmin
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    displayName
    name
    roles
    dateOfBirth
    riderResponsibility
    possibleRiderResponsibilities {
      nextToken
      startedAt
      __typename
    }
    profilePicture {
      bucket
      key
      region
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    assignments {
      nextToken
      startedAt
      __typename
    }
    vehicleAssignments {
      nextToken
      startedAt
      __typename
    }
    createdTasks {
      nextToken
      startedAt
      __typename
    }
    createdLocations {
      nextToken
      startedAt
      __typename
    }
    createdVehicles {
      nextToken
      startedAt
      __typename
    }
    createdScheduledTasks {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreatePossibleRiderResponsibilities = /* GraphQL */ `subscription OnCreatePossibleRiderResponsibilities(
  $filter: ModelSubscriptionPossibleRiderResponsibilitiesFilterInput
) {
  onCreatePossibleRiderResponsibilities(filter: $filter) {
    id
    tenantId
    user {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    riderResponsibility {
      id
      tenantId
      label
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userPossibleRiderResponsibilitiesId
    riderResponsibilityPossibleUsersId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePossibleRiderResponsibilitiesSubscriptionVariables,
  APITypes.OnCreatePossibleRiderResponsibilitiesSubscription
>;
export const onUpdatePossibleRiderResponsibilities = /* GraphQL */ `subscription OnUpdatePossibleRiderResponsibilities(
  $filter: ModelSubscriptionPossibleRiderResponsibilitiesFilterInput
) {
  onUpdatePossibleRiderResponsibilities(filter: $filter) {
    id
    tenantId
    user {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    riderResponsibility {
      id
      tenantId
      label
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userPossibleRiderResponsibilitiesId
    riderResponsibilityPossibleUsersId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePossibleRiderResponsibilitiesSubscriptionVariables,
  APITypes.OnUpdatePossibleRiderResponsibilitiesSubscription
>;
export const onDeletePossibleRiderResponsibilities = /* GraphQL */ `subscription OnDeletePossibleRiderResponsibilities(
  $filter: ModelSubscriptionPossibleRiderResponsibilitiesFilterInput
) {
  onDeletePossibleRiderResponsibilities(filter: $filter) {
    id
    tenantId
    user {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    riderResponsibility {
      id
      tenantId
      label
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userPossibleRiderResponsibilitiesId
    riderResponsibilityPossibleUsersId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePossibleRiderResponsibilitiesSubscriptionVariables,
  APITypes.OnDeletePossibleRiderResponsibilitiesSubscription
>;
export const onCreateVehicle = /* GraphQL */ `subscription OnCreateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
  onCreateVehicle(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    manufacturer
    model
    dateOfManufacture
    dateOfRegistration
    assignments {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedVehiclesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateVehicleSubscriptionVariables,
  APITypes.OnCreateVehicleSubscription
>;
export const onUpdateVehicle = /* GraphQL */ `subscription OnUpdateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
  onUpdateVehicle(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    manufacturer
    model
    dateOfManufacture
    dateOfRegistration
    assignments {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedVehiclesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateVehicleSubscriptionVariables,
  APITypes.OnUpdateVehicleSubscription
>;
export const onDeleteVehicle = /* GraphQL */ `subscription OnDeleteVehicle($filter: ModelSubscriptionVehicleFilterInput) {
  onDeleteVehicle(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    manufacturer
    model
    dateOfManufacture
    dateOfRegistration
    assignments {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedVehiclesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteVehicleSubscriptionVariables,
  APITypes.OnDeleteVehicleSubscription
>;
export const onCreateVehicleAssignment = /* GraphQL */ `subscription OnCreateVehicleAssignment(
  $filter: ModelSubscriptionVehicleAssignmentFilterInput
) {
  onCreateVehicleAssignment(filter: $filter) {
    id
    tenantId
    vehicle {
      id
      tenantId
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userVehicleAssignmentsId
    vehicleAssignmentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateVehicleAssignmentSubscriptionVariables,
  APITypes.OnCreateVehicleAssignmentSubscription
>;
export const onUpdateVehicleAssignment = /* GraphQL */ `subscription OnUpdateVehicleAssignment(
  $filter: ModelSubscriptionVehicleAssignmentFilterInput
) {
  onUpdateVehicleAssignment(filter: $filter) {
    id
    tenantId
    vehicle {
      id
      tenantId
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userVehicleAssignmentsId
    vehicleAssignmentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateVehicleAssignmentSubscriptionVariables,
  APITypes.OnUpdateVehicleAssignmentSubscription
>;
export const onDeleteVehicleAssignment = /* GraphQL */ `subscription OnDeleteVehicleAssignment(
  $filter: ModelSubscriptionVehicleAssignmentFilterInput
) {
  onDeleteVehicleAssignment(filter: $filter) {
    id
    tenantId
    vehicle {
      id
      tenantId
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userVehicleAssignmentsId
    vehicleAssignmentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteVehicleAssignmentSubscriptionVariables,
  APITypes.OnDeleteVehicleAssignmentSubscription
>;
export const onCreateLocation = /* GraphQL */ `subscription OnCreateLocation($filter: ModelSubscriptionLocationFilterInput) {
  onCreateLocation(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    listed
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    ward
    line1
    line2
    line3
    town
    county
    state
    country
    postcode
    what3words
    tasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    tasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    taskAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    googleMapsPlaceId
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedLocationsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLocationSubscriptionVariables,
  APITypes.OnCreateLocationSubscription
>;
export const onUpdateLocation = /* GraphQL */ `subscription OnUpdateLocation($filter: ModelSubscriptionLocationFilterInput) {
  onUpdateLocation(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    listed
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    ward
    line1
    line2
    line3
    town
    county
    state
    country
    postcode
    what3words
    tasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    tasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    taskAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    googleMapsPlaceId
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedLocationsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLocationSubscriptionVariables,
  APITypes.OnUpdateLocationSubscription
>;
export const onDeleteLocation = /* GraphQL */ `subscription OnDeleteLocation($filter: ModelSubscriptionLocationFilterInput) {
  onDeleteLocation(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    listed
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    ward
    line1
    line2
    line3
    town
    county
    state
    country
    postcode
    what3words
    tasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    tasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    taskAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    googleMapsPlaceId
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedLocationsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLocationSubscriptionVariables,
  APITypes.OnDeleteLocationSubscription
>;
export const onCreateTask = /* GraphQL */ `subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
  onCreateTask(filter: $filter) {
    id
    tenantId
    createdAt
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    dateCreated
    dateCompleted
    timeOfCall
    timePickedUp
    timePickedUpSenderName
    timeDroppedOff
    timeDroppedOffRecipientName
    timeCancelled
    timeRejected
    timeRiderHome
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    riderResponsibility
    assignees {
      nextToken
      startedAt
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    status
    isRiderUsingOwnVehicle
    archived
    pickUpSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    dropOffSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedTasksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTaskSubscriptionVariables,
  APITypes.OnCreateTaskSubscription
>;
export const onUpdateTask = /* GraphQL */ `subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
  onUpdateTask(filter: $filter) {
    id
    tenantId
    createdAt
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    dateCreated
    dateCompleted
    timeOfCall
    timePickedUp
    timePickedUpSenderName
    timeDroppedOff
    timeDroppedOffRecipientName
    timeCancelled
    timeRejected
    timeRiderHome
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    riderResponsibility
    assignees {
      nextToken
      startedAt
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    status
    isRiderUsingOwnVehicle
    archived
    pickUpSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    dropOffSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedTasksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTaskSubscriptionVariables,
  APITypes.OnUpdateTaskSubscription
>;
export const onDeleteTask = /* GraphQL */ `subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
  onDeleteTask(filter: $filter) {
    id
    tenantId
    createdAt
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    dateCreated
    dateCompleted
    timeOfCall
    timePickedUp
    timePickedUpSenderName
    timeDroppedOff
    timeDroppedOffRecipientName
    timeCancelled
    timeRejected
    timeRiderHome
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    riderResponsibility
    assignees {
      nextToken
      startedAt
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    status
    isRiderUsingOwnVehicle
    archived
    pickUpSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    dropOffSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedTasksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTaskSubscriptionVariables,
  APITypes.OnDeleteTaskSubscription
>;
export const onCreateTaskAssignee = /* GraphQL */ `subscription OnCreateTaskAssignee(
  $filter: ModelSubscriptionTaskAssigneeFilterInput
) {
  onCreateTaskAssignee(filter: $filter) {
    id
    tenantId
    role
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userAssignmentsId
    taskAssigneesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTaskAssigneeSubscriptionVariables,
  APITypes.OnCreateTaskAssigneeSubscription
>;
export const onUpdateTaskAssignee = /* GraphQL */ `subscription OnUpdateTaskAssignee(
  $filter: ModelSubscriptionTaskAssigneeFilterInput
) {
  onUpdateTaskAssignee(filter: $filter) {
    id
    tenantId
    role
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userAssignmentsId
    taskAssigneesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTaskAssigneeSubscriptionVariables,
  APITypes.OnUpdateTaskAssigneeSubscription
>;
export const onDeleteTaskAssignee = /* GraphQL */ `subscription OnDeleteTaskAssignee(
  $filter: ModelSubscriptionTaskAssigneeFilterInput
) {
  onDeleteTaskAssignee(filter: $filter) {
    id
    tenantId
    role
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userAssignmentsId
    taskAssigneesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTaskAssigneeSubscriptionVariables,
  APITypes.OnDeleteTaskAssigneeSubscription
>;
export const onCreateScheduledTask = /* GraphQL */ `subscription OnCreateScheduledTask(
  $filter: ModelSubscriptionScheduledTaskFilterInput
) {
  onCreateScheduledTask(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    cronExpression
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    disabled
    pickUpSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    dropOffSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedScheduledTasksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateScheduledTaskSubscriptionVariables,
  APITypes.OnCreateScheduledTaskSubscription
>;
export const onUpdateScheduledTask = /* GraphQL */ `subscription OnUpdateScheduledTask(
  $filter: ModelSubscriptionScheduledTaskFilterInput
) {
  onUpdateScheduledTask(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    cronExpression
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    disabled
    pickUpSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    dropOffSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedScheduledTasksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateScheduledTaskSubscriptionVariables,
  APITypes.OnUpdateScheduledTaskSubscription
>;
export const onDeleteScheduledTask = /* GraphQL */ `subscription OnDeleteScheduledTask(
  $filter: ModelSubscriptionScheduledTaskFilterInput
) {
  onDeleteScheduledTask(filter: $filter) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    cronExpression
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    disabled
    pickUpSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    dropOffSchedule {
      relation
      timePrimary
      timeSecondary
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedScheduledTasksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteScheduledTaskSubscriptionVariables,
  APITypes.OnDeleteScheduledTaskSubscription
>;
export const onCreateComment = /* GraphQL */ `subscription OnCreateComment(
  $filter: ModelSubscriptionCommentFilterInput
  $owner: String
) {
  onCreateComment(filter: $filter, owner: $owner) {
    id
    parentId
    owner
    tenantId
    body
    author {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    visibility
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCommentSubscriptionVariables,
  APITypes.OnCreateCommentSubscription
>;
export const onUpdateComment = /* GraphQL */ `subscription OnUpdateComment(
  $filter: ModelSubscriptionCommentFilterInput
  $owner: String
) {
  onUpdateComment(filter: $filter, owner: $owner) {
    id
    parentId
    owner
    tenantId
    body
    author {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    visibility
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCommentSubscriptionVariables,
  APITypes.OnUpdateCommentSubscription
>;
export const onDeleteComment = /* GraphQL */ `subscription OnDeleteComment(
  $filter: ModelSubscriptionCommentFilterInput
  $owner: String
) {
  onDeleteComment(filter: $filter, owner: $owner) {
    id
    parentId
    owner
    tenantId
    body
    author {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    visibility
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCommentSubscriptionVariables,
  APITypes.OnDeleteCommentSubscription
>;
export const onCreateDeliverableType = /* GraphQL */ `subscription OnCreateDeliverableType(
  $filter: ModelSubscriptionDeliverableTypeFilterInput
) {
  onCreateDeliverableType(filter: $filter) {
    id
    label
    tenantId
    icon
    defaultUnit
    deliverables {
      nextToken
      startedAt
      __typename
    }
    tags
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateDeliverableTypeSubscriptionVariables,
  APITypes.OnCreateDeliverableTypeSubscription
>;
export const onUpdateDeliverableType = /* GraphQL */ `subscription OnUpdateDeliverableType(
  $filter: ModelSubscriptionDeliverableTypeFilterInput
) {
  onUpdateDeliverableType(filter: $filter) {
    id
    label
    tenantId
    icon
    defaultUnit
    deliverables {
      nextToken
      startedAt
      __typename
    }
    tags
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateDeliverableTypeSubscriptionVariables,
  APITypes.OnUpdateDeliverableTypeSubscription
>;
export const onDeleteDeliverableType = /* GraphQL */ `subscription OnDeleteDeliverableType(
  $filter: ModelSubscriptionDeliverableTypeFilterInput
) {
  onDeleteDeliverableType(filter: $filter) {
    id
    label
    tenantId
    icon
    defaultUnit
    deliverables {
      nextToken
      startedAt
      __typename
    }
    tags
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteDeliverableTypeSubscriptionVariables,
  APITypes.OnDeleteDeliverableTypeSubscription
>;
export const onCreateDeliverable = /* GraphQL */ `subscription OnCreateDeliverable(
  $filter: ModelSubscriptionDeliverableFilterInput
) {
  onCreateDeliverable(filter: $filter) {
    id
    tenantId
    deliverableType {
      id
      label
      tenantId
      icon
      defaultUnit
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    scheduledTask {
      id
      tenantId
      cronExpression
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      priority
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedScheduledTasksId
      __typename
    }
    count
    unit
    orderInGrid
    comments {
      nextToken
      startedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    taskDeliverablesId
    scheduledTaskDeliverablesId
    deliverableTypeDeliverablesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateDeliverableSubscriptionVariables,
  APITypes.OnCreateDeliverableSubscription
>;
export const onUpdateDeliverable = /* GraphQL */ `subscription OnUpdateDeliverable(
  $filter: ModelSubscriptionDeliverableFilterInput
) {
  onUpdateDeliverable(filter: $filter) {
    id
    tenantId
    deliverableType {
      id
      label
      tenantId
      icon
      defaultUnit
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    scheduledTask {
      id
      tenantId
      cronExpression
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      priority
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedScheduledTasksId
      __typename
    }
    count
    unit
    orderInGrid
    comments {
      nextToken
      startedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    taskDeliverablesId
    scheduledTaskDeliverablesId
    deliverableTypeDeliverablesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateDeliverableSubscriptionVariables,
  APITypes.OnUpdateDeliverableSubscription
>;
export const onDeleteDeliverable = /* GraphQL */ `subscription OnDeleteDeliverable(
  $filter: ModelSubscriptionDeliverableFilterInput
) {
  onDeleteDeliverable(filter: $filter) {
    id
    tenantId
    deliverableType {
      id
      label
      tenantId
      icon
      defaultUnit
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    scheduledTask {
      id
      tenantId
      cronExpression
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      priority
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedScheduledTasksId
      __typename
    }
    count
    unit
    orderInGrid
    comments {
      nextToken
      startedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    taskDeliverablesId
    scheduledTaskDeliverablesId
    deliverableTypeDeliverablesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteDeliverableSubscriptionVariables,
  APITypes.OnDeleteDeliverableSubscription
>;
export const onCreateRiderResponsibility = /* GraphQL */ `subscription OnCreateRiderResponsibility(
  $filter: ModelSubscriptionRiderResponsibilityFilterInput
) {
  onCreateRiderResponsibility(filter: $filter) {
    id
    tenantId
    label
    disabled
    possibleUsers {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRiderResponsibilitySubscriptionVariables,
  APITypes.OnCreateRiderResponsibilitySubscription
>;
export const onUpdateRiderResponsibility = /* GraphQL */ `subscription OnUpdateRiderResponsibility(
  $filter: ModelSubscriptionRiderResponsibilityFilterInput
) {
  onUpdateRiderResponsibility(filter: $filter) {
    id
    tenantId
    label
    disabled
    possibleUsers {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRiderResponsibilitySubscriptionVariables,
  APITypes.OnUpdateRiderResponsibilitySubscription
>;
export const onDeleteRiderResponsibility = /* GraphQL */ `subscription OnDeleteRiderResponsibility(
  $filter: ModelSubscriptionRiderResponsibilityFilterInput
) {
  onDeleteRiderResponsibility(filter: $filter) {
    id
    tenantId
    label
    disabled
    possibleUsers {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRiderResponsibilitySubscriptionVariables,
  APITypes.OnDeleteRiderResponsibilitySubscription
>;
