/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStatistics = /* GraphQL */ `
  query GetStatistics($tenantId: ID!) {
    getStatistics(tenantId: $tenantId) {
      numCancelled
      numCompleted
      numDroppedOff
      numRejected
      numAbandoned
      numActive
      numPickedUp
      numNew
      numTest
    }
  }
`;
export const getTenant = /* GraphQL */ `
  query GetTenant($id: ID!) {
    getTenant(id: $id) {
      id
      name
      referenceIdentifier
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      cognitoId
      tenantId
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
      vehicles {
        items {
          id
          tenantId
          assignedUserID
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      profilePictureURL
      profilePictureThumbnailURL
      profilePicture {
        bucket
        key
        region
      }
      profilePictureThumbnail {
        bucket
        key
        region
      }
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      assignments {
        items {
          id
          tenantId
          taskId
          assigneeId
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      active
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userRiderResponsibilityId
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
        cognitoId
        tenantId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        profilePictureURL
        profilePictureThumbnailURL
        profilePicture {
          bucket
          key
          region
        }
        profilePictureThumbnail {
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
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
        cognitoId
        tenantId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        profilePictureURL
        profilePictureThumbnailURL
        profilePicture {
          bucket
          key
          region
        }
        profilePictureThumbnail {
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
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
        cognitoId
        tenantId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        profilePictureURL
        profilePictureThumbnailURL
        profilePicture {
          bucket
          key
          region
        }
        profilePictureThumbnail {
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
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
      assignedUserID
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignedUser {
        id
        cognitoId
        tenantId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        profilePictureURL
        profilePictureThumbnailURL
        profilePicture {
          bucket
          key
          region
        }
        profilePictureThumbnail {
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
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
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
        assignedUserID
        name
        manufacturer
        model
        dateOfManufacture
        dateOfRegistration
        assignedUser {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        comments {
          nextToken
          startedAt
        }
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
        assignedUserID
        name
        manufacturer
        model
        dateOfManufacture
        dateOfRegistration
        assignedUser {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        comments {
          nextToken
          startedAt
        }
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
export const getLocation = /* GraphQL */ `
  query GetLocation($id: ID!) {
    getLocation(id: $id) {
      id
      tenantId
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
        items {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        nextToken
        startedAt
      }
      tasksAsDropOff {
        items {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        nextToken
        startedAt
      }
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
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
        comments {
          nextToken
          startedAt
        }
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
        comments {
          nextToken
          startedAt
        }
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
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      tenantId
      createdBy {
        id
        cognitoId
        tenantId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        profilePictureURL
        profilePictureThumbnailURL
        profilePicture {
          bucket
          key
          region
        }
        profilePictureThumbnail {
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
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      timeOfCall
      timePickedUp
      timeDroppedOff
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
      pickUpLocation {
        id
        tenantId
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
        comments {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      dropOffLocation {
        id
        tenantId
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
        comments {
          nextToken
          startedAt
        }
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      assignees {
        items {
          id
          tenantId
          taskId
          assigneeId
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      priority
      deliverables {
        items {
          id
          tenantId
          taskDeliverablesId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          deliverableDeliverableTypeId
        }
        nextToken
        startedAt
      }
      relayPrevious {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      relayNext {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      taskCreatedById
      taskRiderResponsibilityId
      taskRelayPreviousId
      taskRelayNextId
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
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
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
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
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
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
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
      taskId
      assigneeId
      role
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      assignee {
        id
        cognitoId
        tenantId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        profilePictureURL
        profilePictureThumbnailURL
        profilePicture {
          bucket
          key
          region
        }
        profilePictureThumbnail {
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
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
        taskId
        assigneeId
        role
        task {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        assignee {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
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
        taskId
        assigneeId
        role
        task {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        assignee {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
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
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      parentId
      tenantId
      body
      author {
        id
        cognitoId
        tenantId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        profilePictureURL
        profilePictureThumbnailURL
        profilePicture {
          bucket
          key
          region
        }
        profilePictureThumbnail {
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
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      visibility
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
        tenantId
        body
        author {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        visibility
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
        tenantId
        body
        author {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        visibility
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
export const getDeliverableType = /* GraphQL */ `
  query GetDeliverableType($id: ID!) {
    getDeliverableType(id: $id) {
      id
      label
      tenantId
      icon
      defaultUnit
      tags
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      taskDeliverablesId
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      count
      unit
      orderInGrid
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      deliverableDeliverableTypeId
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
        deliverableType {
          id
          label
          tenantId
          icon
          defaultUnit
          tags
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        taskDeliverablesId
        task {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        count
        unit
        orderInGrid
        comments {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        deliverableDeliverableTypeId
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
        deliverableType {
          id
          label
          tenantId
          icon
          defaultUnit
          tags
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        taskDeliverablesId
        task {
          id
          tenantId
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        count
        unit
        orderInGrid
        comments {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        deliverableDeliverableTypeId
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
