/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTenant = /* GraphQL */ `
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
export const listTenants = /* GraphQL */ `
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
export const syncTenants = /* GraphQL */ `
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
export const getUser = /* GraphQL */ `
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
      createdScheduledTasks {
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
export const listUsers = /* GraphQL */ `
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
export const syncUsers = /* GraphQL */ `
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
export const getUserByCognitoId = /* GraphQL */ `
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
export const getPossibleRiderResponsibilities = /* GraphQL */ `
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
export const listPossibleRiderResponsibilities = /* GraphQL */ `
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
export const syncPossibleRiderResponsibilities = /* GraphQL */ `
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
export const getVehicle = /* GraphQL */ `
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
export const listVehicles = /* GraphQL */ `
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
export const syncVehicles = /* GraphQL */ `
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
export const getVehicleAssignment = /* GraphQL */ `
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
export const listVehicleAssignments = /* GraphQL */ `
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
export const syncVehicleAssignments = /* GraphQL */ `
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
export const getLocation = /* GraphQL */ `
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
export const listLocations = /* GraphQL */ `
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
export const syncLocations = /* GraphQL */ `
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
export const getTask = /* GraphQL */ `
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
export const listTasks = /* GraphQL */ `
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
export const syncTasks = /* GraphQL */ `
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
export const listTasksByTenantId = /* GraphQL */ `
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
export const tasksByStatus = /* GraphQL */ `
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
export const tasksByArchivedStatus = /* GraphQL */ `
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
export const getTaskAssignee = /* GraphQL */ `
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
export const listTaskAssignees = /* GraphQL */ `
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
export const syncTaskAssignees = /* GraphQL */ `
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
export const getScheduledTask = /* GraphQL */ `
  query GetScheduledTask($id: ID!) {
    getScheduledTask(id: $id) {
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
      userCreatedScheduledTasksId
    }
  }
`;
export const listScheduledTasks = /* GraphQL */ `
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
        userCreatedScheduledTasksId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncScheduledTasks = /* GraphQL */ `
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
        userCreatedScheduledTasksId
      }
      nextToken
      startedAt
    }
  }
`;
export const getComment = /* GraphQL */ `
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
export const listComments = /* GraphQL */ `
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
export const syncComments = /* GraphQL */ `
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
export const getDeliverableType = /* GraphQL */ `
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
export const listDeliverableTypes = /* GraphQL */ `
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
export const syncDeliverableTypes = /* GraphQL */ `
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
export const getDeliverable = /* GraphQL */ `
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
        userCreatedScheduledTasksId
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
export const listDeliverables = /* GraphQL */ `
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
export const syncDeliverables = /* GraphQL */ `
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
export const getRiderResponsibility = /* GraphQL */ `
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
export const listRiderResponsibilities = /* GraphQL */ `
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
export const syncRiderResponsibilities = /* GraphQL */ `
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
export const profilePictureUploadURL = /* GraphQL */ `
  query ProfilePictureUploadURL($userId: ID!) {
    profilePictureUploadURL(userId: $userId)
  }
`;
export const profilePictureURL = /* GraphQL */ `
  query ProfilePictureURL($userId: ID!, $width: Int, $height: Int) {
    profilePictureURL(userId: $userId, width: $width, height: $height)
  }
`;
export const sendUserFeedback = /* GraphQL */ `
  query SendUserFeedback($emailAddress: AWSEmail, $body: String) {
    sendUserFeedback(emailAddress: $emailAddress, body: $body) {
      successState
    }
  }
`;
