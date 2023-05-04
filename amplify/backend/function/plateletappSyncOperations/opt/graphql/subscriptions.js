"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onUpdateVehicleAssignment = exports.onUpdateVehicle = exports.onUpdateUser = exports.onUpdateTenant = exports.onUpdateTaskAssignee = exports.onUpdateTask = exports.onUpdateScheduledTask = exports.onUpdateRiderResponsibility = exports.onUpdatePossibleRiderResponsibilities = exports.onUpdateLocation = exports.onUpdateDeliverableType = exports.onUpdateDeliverable = exports.onUpdateComment = exports.onDeleteVehicleAssignment = exports.onDeleteVehicle = exports.onDeleteUser = exports.onDeleteTenant = exports.onDeleteTaskAssignee = exports.onDeleteTask = exports.onDeleteScheduledTask = exports.onDeleteRiderResponsibility = exports.onDeletePossibleRiderResponsibilities = exports.onDeleteLocation = exports.onDeleteDeliverableType = exports.onDeleteDeliverable = exports.onDeleteComment = exports.onCreateVehicleAssignment = exports.onCreateVehicle = exports.onCreateUser = exports.onCreateTenant = exports.onCreateTaskAssignee = exports.onCreateTask = exports.onCreateScheduledTask = exports.onCreateRiderResponsibility = exports.onCreatePossibleRiderResponsibilities = exports.onCreateLocation = exports.onCreateDeliverableType = exports.onCreateDeliverable = exports.onCreateComment = void 0;
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

const onCreateTenant = /* GraphQL */`
  subscription OnCreateTenant($filter: ModelSubscriptionTenantFilterInput) {
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
    }
  }
`;
exports.onCreateTenant = onCreateTenant;
const onUpdateTenant = /* GraphQL */`
  subscription OnUpdateTenant($filter: ModelSubscriptionTenantFilterInput) {
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
    }
  }
`;
exports.onUpdateTenant = onUpdateTenant;
const onDeleteTenant = /* GraphQL */`
  subscription OnDeleteTenant($filter: ModelSubscriptionTenantFilterInput) {
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
    }
  }
`;
exports.onDeleteTenant = onDeleteTenant;
const onCreateUser = /* GraphQL */`
  subscription OnCreateUser(
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
      }
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      possibleRiderResponsibilities {
        nextToken
        startedAt
      }
      profilePicture {
        bucket
        key
        region
      }
      comments {
        nextToken
        startedAt
      }
      assignments {
        nextToken
        startedAt
      }
      vehicleAssignments {
        nextToken
        startedAt
      }
      createdTasks {
        nextToken
        startedAt
      }
      createdLocations {
        nextToken
        startedAt
      }
      createdVehicles {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onCreateUser = onCreateUser;
const onUpdateUser = /* GraphQL */`
  subscription OnUpdateUser(
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
      }
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      possibleRiderResponsibilities {
        nextToken
        startedAt
      }
      profilePicture {
        bucket
        key
        region
      }
      comments {
        nextToken
        startedAt
      }
      assignments {
        nextToken
        startedAt
      }
      vehicleAssignments {
        nextToken
        startedAt
      }
      createdTasks {
        nextToken
        startedAt
      }
      createdLocations {
        nextToken
        startedAt
      }
      createdVehicles {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onUpdateUser = onUpdateUser;
const onDeleteUser = /* GraphQL */`
  subscription OnDeleteUser(
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
      }
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      possibleRiderResponsibilities {
        nextToken
        startedAt
      }
      profilePicture {
        bucket
        key
        region
      }
      comments {
        nextToken
        startedAt
      }
      assignments {
        nextToken
        startedAt
      }
      vehicleAssignments {
        nextToken
        startedAt
      }
      createdTasks {
        nextToken
        startedAt
      }
      createdLocations {
        nextToken
        startedAt
      }
      createdVehicles {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onDeleteUser = onDeleteUser;
const onCreatePossibleRiderResponsibilities = /* GraphQL */`
  subscription OnCreatePossibleRiderResponsibilities(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
    }
  }
`;
exports.onCreatePossibleRiderResponsibilities = onCreatePossibleRiderResponsibilities;
const onUpdatePossibleRiderResponsibilities = /* GraphQL */`
  subscription OnUpdatePossibleRiderResponsibilities(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
    }
  }
`;
exports.onUpdatePossibleRiderResponsibilities = onUpdatePossibleRiderResponsibilities;
const onDeletePossibleRiderResponsibilities = /* GraphQL */`
  subscription OnDeletePossibleRiderResponsibilities(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
    }
  }
`;
exports.onDeletePossibleRiderResponsibilities = onDeletePossibleRiderResponsibilities;
const onCreateVehicle = /* GraphQL */`
  subscription OnCreateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
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
      }
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignments {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
    }
  }
`;
exports.onCreateVehicle = onCreateVehicle;
const onUpdateVehicle = /* GraphQL */`
  subscription OnUpdateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
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
      }
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignments {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
    }
  }
`;
exports.onUpdateVehicle = onUpdateVehicle;
const onDeleteVehicle = /* GraphQL */`
  subscription OnDeleteVehicle($filter: ModelSubscriptionVehicleFilterInput) {
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
      }
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignments {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
    }
  }
`;
exports.onDeleteVehicle = onDeleteVehicle;
const onCreateVehicleAssignment = /* GraphQL */`
  subscription OnCreateVehicleAssignment(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
    }
  }
`;
exports.onCreateVehicleAssignment = onCreateVehicleAssignment;
const onUpdateVehicleAssignment = /* GraphQL */`
  subscription OnUpdateVehicleAssignment(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
    }
  }
`;
exports.onUpdateVehicleAssignment = onUpdateVehicleAssignment;
const onDeleteVehicleAssignment = /* GraphQL */`
  subscription OnDeleteVehicleAssignment(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
    }
  }
`;
exports.onDeleteVehicleAssignment = onDeleteVehicleAssignment;
const onCreateLocation = /* GraphQL */`
  subscription OnCreateLocation($filter: ModelSubscriptionLocationFilterInput) {
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
      }
      tasksAsDropOff {
        nextToken
        startedAt
      }
      taskAsEstablishment {
        nextToken
        startedAt
      }
      scheduledTasksAsPickUp {
        nextToken
        startedAt
      }
      scheduledTasksAsDropOff {
        nextToken
        startedAt
      }
      scheduledTasksAsEstablishment {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
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
    }
  }
`;
exports.onCreateLocation = onCreateLocation;
const onUpdateLocation = /* GraphQL */`
  subscription OnUpdateLocation($filter: ModelSubscriptionLocationFilterInput) {
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
      }
      tasksAsDropOff {
        nextToken
        startedAt
      }
      taskAsEstablishment {
        nextToken
        startedAt
      }
      scheduledTasksAsPickUp {
        nextToken
        startedAt
      }
      scheduledTasksAsDropOff {
        nextToken
        startedAt
      }
      scheduledTasksAsEstablishment {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
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
    }
  }
`;
exports.onUpdateLocation = onUpdateLocation;
const onDeleteLocation = /* GraphQL */`
  subscription OnDeleteLocation($filter: ModelSubscriptionLocationFilterInput) {
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
      }
      tasksAsDropOff {
        nextToken
        startedAt
      }
      taskAsEstablishment {
        nextToken
        startedAt
      }
      scheduledTasksAsPickUp {
        nextToken
        startedAt
      }
      scheduledTasksAsDropOff {
        nextToken
        startedAt
      }
      scheduledTasksAsEstablishment {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
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
    }
  }
`;
exports.onDeleteLocation = onDeleteLocation;
const onCreateTask = /* GraphQL */`
  subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
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
      }
      dateCreated
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
      }
      riderResponsibility
      assignees {
        nextToken
        startedAt
      }
      priority
      deliverables {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
      }
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
    }
  }
`;
exports.onCreateTask = onCreateTask;
const onUpdateTask = /* GraphQL */`
  subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
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
      }
      dateCreated
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
      }
      riderResponsibility
      assignees {
        nextToken
        startedAt
      }
      priority
      deliverables {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
      }
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
    }
  }
`;
exports.onUpdateTask = onUpdateTask;
const onDeleteTask = /* GraphQL */`
  subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
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
      }
      dateCreated
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
      }
      riderResponsibility
      assignees {
        nextToken
        startedAt
      }
      priority
      deliverables {
        nextToken
        startedAt
      }
      comments {
        nextToken
        startedAt
      }
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
    }
  }
`;
exports.onDeleteTask = onDeleteTask;
const onCreateTaskAssignee = /* GraphQL */`
  subscription OnCreateTaskAssignee(
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
      }
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
    }
  }
`;
exports.onCreateTaskAssignee = onCreateTaskAssignee;
const onUpdateTaskAssignee = /* GraphQL */`
  subscription OnUpdateTaskAssignee(
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
      }
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
    }
  }
`;
exports.onUpdateTaskAssignee = onUpdateTaskAssignee;
const onDeleteTaskAssignee = /* GraphQL */`
  subscription OnDeleteTaskAssignee(
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
      }
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
    }
  }
`;
exports.onDeleteTaskAssignee = onDeleteTaskAssignee;
const onCreateScheduledTask = /* GraphQL */`
  subscription OnCreateScheduledTask(
    $filter: ModelSubscriptionScheduledTaskFilterInput
  ) {
    onCreateScheduledTask(filter: $filter) {
      id
      tenantId
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
      }
      priority
      deliverables {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onCreateScheduledTask = onCreateScheduledTask;
const onUpdateScheduledTask = /* GraphQL */`
  subscription OnUpdateScheduledTask(
    $filter: ModelSubscriptionScheduledTaskFilterInput
  ) {
    onUpdateScheduledTask(filter: $filter) {
      id
      tenantId
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
      }
      priority
      deliverables {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onUpdateScheduledTask = onUpdateScheduledTask;
const onDeleteScheduledTask = /* GraphQL */`
  subscription OnDeleteScheduledTask(
    $filter: ModelSubscriptionScheduledTaskFilterInput
  ) {
    onDeleteScheduledTask(filter: $filter) {
      id
      tenantId
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
      }
      priority
      deliverables {
        nextToken
        startedAt
      }
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onDeleteScheduledTask = onDeleteScheduledTask;
const onCreateComment = /* GraphQL */`
  subscription OnCreateComment(
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
      }
      visibility
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
    }
  }
`;
exports.onCreateComment = onCreateComment;
const onUpdateComment = /* GraphQL */`
  subscription OnUpdateComment(
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
      }
      visibility
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
    }
  }
`;
exports.onUpdateComment = onUpdateComment;
const onDeleteComment = /* GraphQL */`
  subscription OnDeleteComment(
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
      }
      visibility
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
    }
  }
`;
exports.onDeleteComment = onDeleteComment;
const onCreateDeliverableType = /* GraphQL */`
  subscription OnCreateDeliverableType(
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
      }
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onCreateDeliverableType = onCreateDeliverableType;
const onUpdateDeliverableType = /* GraphQL */`
  subscription OnUpdateDeliverableType(
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
      }
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onUpdateDeliverableType = onUpdateDeliverableType;
const onDeleteDeliverableType = /* GraphQL */`
  subscription OnDeleteDeliverableType(
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
      }
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onDeleteDeliverableType = onDeleteDeliverableType;
const onCreateDeliverable = /* GraphQL */`
  subscription OnCreateDeliverable(
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
      }
      task {
        id
        tenantId
        createdAt
        dateCreated
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
      }
      count
      unit
      orderInGrid
      comments {
        nextToken
        startedAt
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
    }
  }
`;
exports.onCreateDeliverable = onCreateDeliverable;
const onUpdateDeliverable = /* GraphQL */`
  subscription OnUpdateDeliverable(
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
      }
      task {
        id
        tenantId
        createdAt
        dateCreated
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
      }
      count
      unit
      orderInGrid
      comments {
        nextToken
        startedAt
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
    }
  }
`;
exports.onUpdateDeliverable = onUpdateDeliverable;
const onDeleteDeliverable = /* GraphQL */`
  subscription OnDeleteDeliverable(
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
      }
      task {
        id
        tenantId
        createdAt
        dateCreated
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
      }
      count
      unit
      orderInGrid
      comments {
        nextToken
        startedAt
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
    }
  }
`;
exports.onDeleteDeliverable = onDeleteDeliverable;
const onCreateRiderResponsibility = /* GraphQL */`
  subscription OnCreateRiderResponsibility(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onCreateRiderResponsibility = onCreateRiderResponsibility;
const onUpdateRiderResponsibility = /* GraphQL */`
  subscription OnUpdateRiderResponsibility(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onUpdateRiderResponsibility = onUpdateRiderResponsibility;
const onDeleteRiderResponsibility = /* GraphQL */`
  subscription OnDeleteRiderResponsibility(
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
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.onDeleteRiderResponsibility = onDeleteRiderResponsibility;