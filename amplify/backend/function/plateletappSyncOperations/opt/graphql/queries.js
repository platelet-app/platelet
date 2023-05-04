"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tasksByStatus = exports.tasksByArchivedStatus = exports.syncVehicles = exports.syncVehicleAssignments = exports.syncUsers = exports.syncTenants = exports.syncTasks = exports.syncTaskAssignees = exports.syncScheduledTasks = exports.syncRiderResponsibilities = exports.syncPossibleRiderResponsibilities = exports.syncLocations = exports.syncDeliverables = exports.syncDeliverableTypes = exports.syncComments = exports.sendUserFeedback = exports.profilePictureUploadURL = exports.profilePictureURL = exports.listVehicles = exports.listVehicleAssignments = exports.listUsers = exports.listTenants = exports.listTasksByTenantId = exports.listTasks = exports.listTaskAssignees = exports.listScheduledTasks = exports.listRiderResponsibilities = exports.listPossibleRiderResponsibilities = exports.listLocations = exports.listDeliverables = exports.listDeliverableTypes = exports.listComments = exports.getVehicleAssignment = exports.getVehicle = exports.getUserByCognitoId = exports.getUser = exports.getTenant = exports.getTaskAssignee = exports.getTask = exports.getScheduledTask = exports.getRiderResponsibility = exports.getPossibleRiderResponsibilities = exports.getLocation = exports.getDeliverableType = exports.getDeliverable = exports.getComment = void 0;
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

const getTenant = /* GraphQL */`
  query GetTenant($id: ID!) {
    getTenant(id: $id) {
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
exports.getTenant = getTenant;
const listTenants = /* GraphQL */`
  query ListTenants(
    $filter: ModelTenantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        referenceIdentifier
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        tenantAdminId
      }
      nextToken
      startedAt
    }
  }
`;
exports.listTenants = listTenants;
const syncTenants = /* GraphQL */`
  query SyncTenants(
    $filter: ModelTenantFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTenants(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        referenceIdentifier
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        tenantAdminId
      }
      nextToken
      startedAt
    }
  }
`;
exports.syncTenants = syncTenants;
const getUser = /* GraphQL */`
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
exports.getUser = getUser;
const listUsers = /* GraphQL */`
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listUsers = listUsers;
const syncUsers = /* GraphQL */`
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.syncUsers = syncUsers;
const getUserByCognitoId = /* GraphQL */`
  query GetUserByCognitoId(
    $cognitoId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByCognitoId(
      cognitoId: $cognitoId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.getUserByCognitoId = getUserByCognitoId;
const getPossibleRiderResponsibilities = /* GraphQL */`
  query GetPossibleRiderResponsibilities($id: ID!) {
    getPossibleRiderResponsibilities(id: $id) {
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
exports.getPossibleRiderResponsibilities = getPossibleRiderResponsibilities;
const listPossibleRiderResponsibilities = /* GraphQL */`
  query ListPossibleRiderResponsibilities(
    $filter: ModelPossibleRiderResponsibilitiesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPossibleRiderResponsibilities(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tenantId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userPossibleRiderResponsibilitiesId
        riderResponsibilityPossibleUsersId
      }
      nextToken
      startedAt
    }
  }
`;
exports.listPossibleRiderResponsibilities = listPossibleRiderResponsibilities;
const syncPossibleRiderResponsibilities = /* GraphQL */`
  query SyncPossibleRiderResponsibilities(
    $filter: ModelPossibleRiderResponsibilitiesFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPossibleRiderResponsibilities(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        tenantId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userPossibleRiderResponsibilitiesId
        riderResponsibilityPossibleUsersId
      }
      nextToken
      startedAt
    }
  }
`;
exports.syncPossibleRiderResponsibilities = syncPossibleRiderResponsibilities;
const getVehicle = /* GraphQL */`
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
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
exports.getVehicle = getVehicle;
const listVehicles = /* GraphQL */`
  query ListVehicles(
    $filter: ModelVehicleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVehicles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listVehicles = listVehicles;
const syncVehicles = /* GraphQL */`
  query SyncVehicles(
    $filter: ModelVehicleFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncVehicles(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.syncVehicles = syncVehicles;
const getVehicleAssignment = /* GraphQL */`
  query GetVehicleAssignment($id: ID!) {
    getVehicleAssignment(id: $id) {
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
exports.getVehicleAssignment = getVehicleAssignment;
const listVehicleAssignments = /* GraphQL */`
  query ListVehicleAssignments(
    $filter: ModelVehicleAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVehicleAssignments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tenantId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userVehicleAssignmentsId
        vehicleAssignmentsId
      }
      nextToken
      startedAt
    }
  }
`;
exports.listVehicleAssignments = listVehicleAssignments;
const syncVehicleAssignments = /* GraphQL */`
  query SyncVehicleAssignments(
    $filter: ModelVehicleAssignmentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncVehicleAssignments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        tenantId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userVehicleAssignmentsId
        vehicleAssignmentsId
      }
      nextToken
      startedAt
    }
  }
`;
exports.syncVehicleAssignments = syncVehicleAssignments;
const getLocation = /* GraphQL */`
  query GetLocation($id: ID!) {
    getLocation(id: $id) {
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
exports.getLocation = getLocation;
const listLocations = /* GraphQL */`
  query ListLocations(
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listLocations = listLocations;
const syncLocations = /* GraphQL */`
  query SyncLocations(
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLocations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.syncLocations = syncLocations;
const getTask = /* GraphQL */`
  query GetTask($id: ID!) {
    getTask(id: $id) {
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
exports.getTask = getTask;
const listTasks = /* GraphQL */`
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listTasks = listTasks;
const syncTasks = /* GraphQL */`
  query SyncTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTasks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.syncTasks = syncTasks;
const listTasksByTenantId = /* GraphQL */`
  query ListTasksByTenantId(
    $tenantId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasksByTenantId(
      tenantId: $tenantId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listTasksByTenantId = listTasksByTenantId;
const tasksByStatus = /* GraphQL */`
  query TasksByStatus(
    $status: TaskStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.tasksByStatus = tasksByStatus;
const tasksByArchivedStatus = /* GraphQL */`
  query TasksByArchivedStatus(
    $archived: Int!
    $status: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByArchivedStatus(
      archived: $archived
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.tasksByArchivedStatus = tasksByArchivedStatus;
const getTaskAssignee = /* GraphQL */`
  query GetTaskAssignee($id: ID!) {
    getTaskAssignee(id: $id) {
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
exports.getTaskAssignee = getTaskAssignee;
const listTaskAssignees = /* GraphQL */`
  query ListTaskAssignees(
    $filter: ModelTaskAssigneeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTaskAssignees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tenantId
        role
        archived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userAssignmentsId
        taskAssigneesId
      }
      nextToken
      startedAt
    }
  }
`;
exports.listTaskAssignees = listTaskAssignees;
const syncTaskAssignees = /* GraphQL */`
  query SyncTaskAssignees(
    $filter: ModelTaskAssigneeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTaskAssignees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        tenantId
        role
        archived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userAssignmentsId
        taskAssigneesId
      }
      nextToken
      startedAt
    }
  }
`;
exports.syncTaskAssignees = syncTaskAssignees;
const getScheduledTask = /* GraphQL */`
  query GetScheduledTask($id: ID!) {
    getScheduledTask(id: $id) {
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
exports.getScheduledTask = getScheduledTask;
const listScheduledTasks = /* GraphQL */`
  query ListScheduledTasks(
    $filter: ModelScheduledTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScheduledTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listScheduledTasks = listScheduledTasks;
const syncScheduledTasks = /* GraphQL */`
  query SyncScheduledTasks(
    $filter: ModelScheduledTaskFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncScheduledTasks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.syncScheduledTasks = syncScheduledTasks;
const getComment = /* GraphQL */`
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
exports.getComment = getComment;
const listComments = /* GraphQL */`
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        parentId
        owner
        tenantId
        body
        visibility
        archived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCommentsId
      }
      nextToken
      startedAt
    }
  }
`;
exports.listComments = listComments;
const syncComments = /* GraphQL */`
  query SyncComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        parentId
        owner
        tenantId
        body
        visibility
        archived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCommentsId
      }
      nextToken
      startedAt
    }
  }
`;
exports.syncComments = syncComments;
const getDeliverableType = /* GraphQL */`
  query GetDeliverableType($id: ID!) {
    getDeliverableType(id: $id) {
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
exports.getDeliverableType = getDeliverableType;
const listDeliverableTypes = /* GraphQL */`
  query ListDeliverableTypes(
    $filter: ModelDeliverableTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDeliverableTypes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listDeliverableTypes = listDeliverableTypes;
const syncDeliverableTypes = /* GraphQL */`
  query SyncDeliverableTypes(
    $filter: ModelDeliverableTypeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncDeliverableTypes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.syncDeliverableTypes = syncDeliverableTypes;
const getDeliverable = /* GraphQL */`
  query GetDeliverable($id: ID!) {
    getDeliverable(id: $id) {
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
exports.getDeliverable = getDeliverable;
const listDeliverables = /* GraphQL */`
  query ListDeliverables(
    $filter: ModelDeliverableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDeliverables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tenantId
        count
        unit
        orderInGrid
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
      nextToken
      startedAt
    }
  }
`;
exports.listDeliverables = listDeliverables;
const syncDeliverables = /* GraphQL */`
  query SyncDeliverables(
    $filter: ModelDeliverableFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncDeliverables(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        tenantId
        count
        unit
        orderInGrid
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
      nextToken
      startedAt
    }
  }
`;
exports.syncDeliverables = syncDeliverables;
const getRiderResponsibility = /* GraphQL */`
  query GetRiderResponsibility($id: ID!) {
    getRiderResponsibility(id: $id) {
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
exports.getRiderResponsibility = getRiderResponsibility;
const listRiderResponsibilities = /* GraphQL */`
  query ListRiderResponsibilities(
    $filter: ModelRiderResponsibilityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRiderResponsibilities(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.listRiderResponsibilities = listRiderResponsibilities;
const syncRiderResponsibilities = /* GraphQL */`
  query SyncRiderResponsibilities(
    $filter: ModelRiderResponsibilityFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRiderResponsibilities(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
exports.syncRiderResponsibilities = syncRiderResponsibilities;
const profilePictureUploadURL = /* GraphQL */`
  query ProfilePictureUploadURL($userId: ID!) {
    profilePictureUploadURL(userId: $userId)
  }
`;
exports.profilePictureUploadURL = profilePictureUploadURL;
const profilePictureURL = /* GraphQL */`
  query ProfilePictureURL($userId: ID!, $width: Int, $height: Int) {
    profilePictureURL(userId: $userId, width: $width, height: $height)
  }
`;
exports.profilePictureURL = profilePictureURL;
const sendUserFeedback = /* GraphQL */`
  query SendUserFeedback($emailAddress: AWSEmail, $body: String) {
    sendUserFeedback(emailAddress: $emailAddress, body: $body) {
      successState
    }
  }
`;
exports.sendUserFeedback = sendUserFeedback;