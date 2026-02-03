/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createTenant = /* GraphQL */ `mutation CreateTenant(
  $input: CreateTenantInput!
  $condition: ModelTenantConditionInput
) {
  createTenant(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateTenantMutationVariables,
  APITypes.CreateTenantMutation
>;
export const updateTenant = /* GraphQL */ `mutation UpdateTenant(
  $input: UpdateTenantInput!
  $condition: ModelTenantConditionInput
) {
  updateTenant(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateTenantMutationVariables,
  APITypes.UpdateTenantMutation
>;
export const deleteTenant = /* GraphQL */ `mutation DeleteTenant(
  $input: DeleteTenantInput!
  $condition: ModelTenantConditionInput
) {
  deleteTenant(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteTenantMutationVariables,
  APITypes.DeleteTenantMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createPossibleRiderResponsibilities = /* GraphQL */ `mutation CreatePossibleRiderResponsibilities(
  $input: CreatePossibleRiderResponsibilitiesInput!
  $condition: ModelPossibleRiderResponsibilitiesConditionInput
) {
  createPossibleRiderResponsibilities(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreatePossibleRiderResponsibilitiesMutationVariables,
  APITypes.CreatePossibleRiderResponsibilitiesMutation
>;
export const updatePossibleRiderResponsibilities = /* GraphQL */ `mutation UpdatePossibleRiderResponsibilities(
  $input: UpdatePossibleRiderResponsibilitiesInput!
  $condition: ModelPossibleRiderResponsibilitiesConditionInput
) {
  updatePossibleRiderResponsibilities(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdatePossibleRiderResponsibilitiesMutationVariables,
  APITypes.UpdatePossibleRiderResponsibilitiesMutation
>;
export const deletePossibleRiderResponsibilities = /* GraphQL */ `mutation DeletePossibleRiderResponsibilities(
  $input: DeletePossibleRiderResponsibilitiesInput!
  $condition: ModelPossibleRiderResponsibilitiesConditionInput
) {
  deletePossibleRiderResponsibilities(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeletePossibleRiderResponsibilitiesMutationVariables,
  APITypes.DeletePossibleRiderResponsibilitiesMutation
>;
export const createVehicle = /* GraphQL */ `mutation CreateVehicle(
  $input: CreateVehicleInput!
  $condition: ModelVehicleConditionInput
) {
  createVehicle(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateVehicleMutationVariables,
  APITypes.CreateVehicleMutation
>;
export const updateVehicle = /* GraphQL */ `mutation UpdateVehicle(
  $input: UpdateVehicleInput!
  $condition: ModelVehicleConditionInput
) {
  updateVehicle(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateVehicleMutationVariables,
  APITypes.UpdateVehicleMutation
>;
export const deleteVehicle = /* GraphQL */ `mutation DeleteVehicle(
  $input: DeleteVehicleInput!
  $condition: ModelVehicleConditionInput
) {
  deleteVehicle(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteVehicleMutationVariables,
  APITypes.DeleteVehicleMutation
>;
export const createVehicleAssignment = /* GraphQL */ `mutation CreateVehicleAssignment(
  $input: CreateVehicleAssignmentInput!
  $condition: ModelVehicleAssignmentConditionInput
) {
  createVehicleAssignment(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateVehicleAssignmentMutationVariables,
  APITypes.CreateVehicleAssignmentMutation
>;
export const updateVehicleAssignment = /* GraphQL */ `mutation UpdateVehicleAssignment(
  $input: UpdateVehicleAssignmentInput!
  $condition: ModelVehicleAssignmentConditionInput
) {
  updateVehicleAssignment(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateVehicleAssignmentMutationVariables,
  APITypes.UpdateVehicleAssignmentMutation
>;
export const deleteVehicleAssignment = /* GraphQL */ `mutation DeleteVehicleAssignment(
  $input: DeleteVehicleAssignmentInput!
  $condition: ModelVehicleAssignmentConditionInput
) {
  deleteVehicleAssignment(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteVehicleAssignmentMutationVariables,
  APITypes.DeleteVehicleAssignmentMutation
>;
export const createLocation = /* GraphQL */ `mutation CreateLocation(
  $input: CreateLocationInput!
  $condition: ModelLocationConditionInput
) {
  createLocation(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateLocationMutationVariables,
  APITypes.CreateLocationMutation
>;
export const updateLocation = /* GraphQL */ `mutation UpdateLocation(
  $input: UpdateLocationInput!
  $condition: ModelLocationConditionInput
) {
  updateLocation(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateLocationMutationVariables,
  APITypes.UpdateLocationMutation
>;
export const deleteLocation = /* GraphQL */ `mutation DeleteLocation(
  $input: DeleteLocationInput!
  $condition: ModelLocationConditionInput
) {
  deleteLocation(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteLocationMutationVariables,
  APITypes.DeleteLocationMutation
>;
export const createTask = /* GraphQL */ `mutation CreateTask(
  $input: CreateTaskInput!
  $condition: ModelTaskConditionInput
) {
  createTask(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateTaskMutationVariables,
  APITypes.CreateTaskMutation
>;
export const updateTask = /* GraphQL */ `mutation UpdateTask(
  $input: UpdateTaskInput!
  $condition: ModelTaskConditionInput
) {
  updateTask(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateTaskMutationVariables,
  APITypes.UpdateTaskMutation
>;
export const deleteTask = /* GraphQL */ `mutation DeleteTask(
  $input: DeleteTaskInput!
  $condition: ModelTaskConditionInput
) {
  deleteTask(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteTaskMutationVariables,
  APITypes.DeleteTaskMutation
>;
export const createTaskAssignee = /* GraphQL */ `mutation CreateTaskAssignee(
  $input: CreateTaskAssigneeInput!
  $condition: ModelTaskAssigneeConditionInput
) {
  createTaskAssignee(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateTaskAssigneeMutationVariables,
  APITypes.CreateTaskAssigneeMutation
>;
export const updateTaskAssignee = /* GraphQL */ `mutation UpdateTaskAssignee(
  $input: UpdateTaskAssigneeInput!
  $condition: ModelTaskAssigneeConditionInput
) {
  updateTaskAssignee(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateTaskAssigneeMutationVariables,
  APITypes.UpdateTaskAssigneeMutation
>;
export const deleteTaskAssignee = /* GraphQL */ `mutation DeleteTaskAssignee(
  $input: DeleteTaskAssigneeInput!
  $condition: ModelTaskAssigneeConditionInput
) {
  deleteTaskAssignee(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteTaskAssigneeMutationVariables,
  APITypes.DeleteTaskAssigneeMutation
>;
export const createScheduledTask = /* GraphQL */ `mutation CreateScheduledTask(
  $input: CreateScheduledTaskInput!
  $condition: ModelScheduledTaskConditionInput
) {
  createScheduledTask(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateScheduledTaskMutationVariables,
  APITypes.CreateScheduledTaskMutation
>;
export const updateScheduledTask = /* GraphQL */ `mutation UpdateScheduledTask(
  $input: UpdateScheduledTaskInput!
  $condition: ModelScheduledTaskConditionInput
) {
  updateScheduledTask(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateScheduledTaskMutationVariables,
  APITypes.UpdateScheduledTaskMutation
>;
export const deleteScheduledTask = /* GraphQL */ `mutation DeleteScheduledTask(
  $input: DeleteScheduledTaskInput!
  $condition: ModelScheduledTaskConditionInput
) {
  deleteScheduledTask(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteScheduledTaskMutationVariables,
  APITypes.DeleteScheduledTaskMutation
>;
export const createComment = /* GraphQL */ `mutation CreateComment(
  $input: CreateCommentInput!
  $condition: ModelCommentConditionInput
) {
  createComment(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.CreateCommentMutationVariables,
  APITypes.CreateCommentMutation
>;
export const updateComment = /* GraphQL */ `mutation UpdateComment(
  $input: UpdateCommentInput!
  $condition: ModelCommentConditionInput
) {
  updateComment(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.UpdateCommentMutationVariables,
  APITypes.UpdateCommentMutation
>;
export const deleteComment = /* GraphQL */ `mutation DeleteComment(
  $input: DeleteCommentInput!
  $condition: ModelCommentConditionInput
) {
  deleteComment(input: $input, condition: $condition) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.DeleteCommentMutationVariables,
  APITypes.DeleteCommentMutation
>;
export const createDeliverableType = /* GraphQL */ `mutation CreateDeliverableType(
  $input: CreateDeliverableTypeInput!
  $condition: ModelDeliverableTypeConditionInput
) {
  createDeliverableType(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateDeliverableTypeMutationVariables,
  APITypes.CreateDeliverableTypeMutation
>;
export const updateDeliverableType = /* GraphQL */ `mutation UpdateDeliverableType(
  $input: UpdateDeliverableTypeInput!
  $condition: ModelDeliverableTypeConditionInput
) {
  updateDeliverableType(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateDeliverableTypeMutationVariables,
  APITypes.UpdateDeliverableTypeMutation
>;
export const deleteDeliverableType = /* GraphQL */ `mutation DeleteDeliverableType(
  $input: DeleteDeliverableTypeInput!
  $condition: ModelDeliverableTypeConditionInput
) {
  deleteDeliverableType(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteDeliverableTypeMutationVariables,
  APITypes.DeleteDeliverableTypeMutation
>;
export const createDeliverable = /* GraphQL */ `mutation CreateDeliverable(
  $input: CreateDeliverableInput!
  $condition: ModelDeliverableConditionInput
) {
  createDeliverable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateDeliverableMutationVariables,
  APITypes.CreateDeliverableMutation
>;
export const updateDeliverable = /* GraphQL */ `mutation UpdateDeliverable(
  $input: UpdateDeliverableInput!
  $condition: ModelDeliverableConditionInput
) {
  updateDeliverable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateDeliverableMutationVariables,
  APITypes.UpdateDeliverableMutation
>;
export const deleteDeliverable = /* GraphQL */ `mutation DeleteDeliverable(
  $input: DeleteDeliverableInput!
  $condition: ModelDeliverableConditionInput
) {
  deleteDeliverable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteDeliverableMutationVariables,
  APITypes.DeleteDeliverableMutation
>;
export const createRiderResponsibility = /* GraphQL */ `mutation CreateRiderResponsibility(
  $input: CreateRiderResponsibilityInput!
  $condition: ModelRiderResponsibilityConditionInput
) {
  createRiderResponsibility(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateRiderResponsibilityMutationVariables,
  APITypes.CreateRiderResponsibilityMutation
>;
export const updateRiderResponsibility = /* GraphQL */ `mutation UpdateRiderResponsibility(
  $input: UpdateRiderResponsibilityInput!
  $condition: ModelRiderResponsibilityConditionInput
) {
  updateRiderResponsibility(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateRiderResponsibilityMutationVariables,
  APITypes.UpdateRiderResponsibilityMutation
>;
export const deleteRiderResponsibility = /* GraphQL */ `mutation DeleteRiderResponsibility(
  $input: DeleteRiderResponsibilityInput!
  $condition: ModelRiderResponsibilityConditionInput
) {
  deleteRiderResponsibility(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteRiderResponsibilityMutationVariables,
  APITypes.DeleteRiderResponsibilityMutation
>;
export const registerUser = /* GraphQL */ `mutation RegisterUser(
  $name: String
  $email: String
  $tenantId: ID
  $roles: [Role]
) {
  registerUser(name: $name, email: $email, tenantId: $tenantId, roles: $roles) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.RegisterUserMutationVariables,
  APITypes.RegisterUserMutation
>;
export const registerTenant = /* GraphQL */ `mutation RegisterTenant(
  $name: String
  $emailAddress: String
  $tenantName: String
) {
  registerTenant(
    name: $name
    emailAddress: $emailAddress
    tenantName: $tenantName
  ) {
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
      isBeingDeleted
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
` as GeneratedMutation<
  APITypes.RegisterTenantMutationVariables,
  APITypes.RegisterTenantMutation
>;
export const updateUserRoles = /* GraphQL */ `mutation UpdateUserRoles($userId: ID, $roles: [Role]) {
  updateUserRoles(userId: $userId, roles: $roles) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserRolesMutationVariables,
  APITypes.UpdateUserRolesMutation
>;
export const disableUser = /* GraphQL */ `mutation DisableUser($userId: ID) {
  disableUser(userId: $userId) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DisableUserMutationVariables,
  APITypes.DisableUserMutation
>;
export const enableUser = /* GraphQL */ `mutation EnableUser($userId: ID) {
  enableUser(userId: $userId) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.EnableUserMutationVariables,
  APITypes.EnableUserMutation
>;
export const updateUserEmail = /* GraphQL */ `mutation UpdateUserEmail($userId: ID, $emailAddress: AWSEmail) {
  updateUserEmail(userId: $userId, emailAddress: $emailAddress) {
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
    isBeingDeleted
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserEmailMutationVariables,
  APITypes.UpdateUserEmailMutation
>;
export const resetUserPassword = /* GraphQL */ `mutation ResetUserPassword($userId: ID) {
  resetUserPassword(userId: $userId) {
    successState
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ResetUserPasswordMutationVariables,
  APITypes.ResetUserPasswordMutation
>;
export const adminDeleteRiderResponsibility = /* GraphQL */ `mutation AdminDeleteRiderResponsibility($riderResponsibilityId: ID) {
  adminDeleteRiderResponsibility(
    riderResponsibilityId: $riderResponsibilityId
  ) {
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
` as GeneratedMutation<
  APITypes.AdminDeleteRiderResponsibilityMutationVariables,
  APITypes.AdminDeleteRiderResponsibilityMutation
>;
export const adminDeleteUser = /* GraphQL */ `mutation AdminDeleteUser($userId: ID) {
  adminDeleteUser(userId: $userId) {
    executionArn
    startDate
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AdminDeleteUserMutationVariables,
  APITypes.AdminDeleteUserMutation
>;
