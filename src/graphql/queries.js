/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        contact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
          startedAt
        }
        patch
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          nextToken
          startedAt
        }
        group {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        tasks {
          nextToken
          startedAt
        }
        tasksCoordinator {
          nextToken
          startedAt
        }
        active
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      contact {
        id
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      displayName
      name
      roles
      dateOfBirth
      vehicles {
        items {
          id
          assignedUserID
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      patch
      profilePictureURL
      profilePictureThumbnailURL
      comments {
        items {
          id
          parentId
          body
          publiclyVisible
          userCommentsId
          vehicleCommentsId
          taskCommentsId
          deliverableCommentsId
          locationCommentsId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      group {
        id
        taskGroupId
        name
        users {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      tasks {
        items {
          id
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      tasksCoordinator {
        items {
          id
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      active
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        contact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
          startedAt
        }
        patch
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          nextToken
          startedAt
        }
        group {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        tasks {
          nextToken
          startedAt
        }
        tasksCoordinator {
          nextToken
          startedAt
        }
        active
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncGroups = /* GraphQL */ `
  query SyncGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncGroups(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        taskGroupId
        name
        users {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      taskGroupId
      name
      users {
        items {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        taskGroupId
        name
        users {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        assignedUserID
        name
        manufacturer
        model
        dateOfManufacture
        dateOfRegistration
        assignedUser {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        comments {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      assignedUserID
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignedUser {
        id
        username
        contact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
          startedAt
        }
        patch
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          nextToken
          startedAt
        }
        group {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        tasks {
          nextToken
          startedAt
        }
        tasksCoordinator {
          nextToken
          startedAt
        }
        active
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          parentId
          body
          publiclyVisible
          userCommentsId
          vehicleCommentsId
          taskCommentsId
          deliverableCommentsId
          locationCommentsId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        assignedUserID
        name
        manufacturer
        model
        dateOfManufacture
        dateOfRegistration
        assignedUser {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        comments {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        name
        listed
        contact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        comments {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      name
      listed
      contact {
        id
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      comments {
        items {
          id
          parentId
          body
          publiclyVisible
          userCommentsId
          vehicleCommentsId
          taskCommentsId
          deliverableCommentsId
          locationCommentsId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        name
        listed
        contact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        comments {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncAddressAndContactDetails = /* GraphQL */ `
  query SyncAddressAndContactDetails(
    $filter: ModelAddressAndContactDetailsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncAddressAndContactDetails(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getAddressAndContactDetails = /* GraphQL */ `
  query GetAddressAndContactDetails($id: ID!) {
    getAddressAndContactDetails(id: $id) {
      id
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listAddressAndContactDetails = /* GraphQL */ `
  query ListAddressAndContactDetails(
    $filter: ModelAddressAndContactDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAddressAndContactDetails(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        type {
          id
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        count
        unit
        comments {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      type {
        id
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      count
      unit
      comments {
        items {
          id
          parentId
          body
          publiclyVisible
          userCommentsId
          vehicleCommentsId
          taskCommentsId
          deliverableCommentsId
          locationCommentsId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        type {
          id
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        count
        unit
        comments {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUserTasks = /* GraphQL */ `
  query SyncUserTasks(
    $filter: ModelUserTasksFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserTasks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        user {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        task {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncCoordinatorTasks = /* GraphQL */ `
  query SyncCoordinatorTasks(
    $filter: ModelCoordinatorTasksFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCoordinatorTasks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        coordinator {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        task {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
        timeCancelled
        timeRejected
        requesterContact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        pickupLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
          startedAt
        }
        riders {
          nextToken
          startedAt
        }
        priority
        deliverables {
          id
          count
          unit
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayPrevious {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayNext {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        group {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      name
      createdBy {
        id
        username
        contact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
          startedAt
        }
        patch
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          nextToken
          startedAt
        }
        group {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        tasks {
          nextToken
          startedAt
        }
        tasksCoordinator {
          nextToken
          startedAt
        }
        active
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      timeOfCall
      timePickedUp
      timeDroppedOff
      timeCancelled
      timeRejected
      requesterContact {
        id
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      pickupLocation {
        id
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      dropoffLocation {
        id
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      patch
      coordinators {
        items {
          id
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      riders {
        items {
          id
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      priority
      deliverables {
        id
        type {
          id
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        count
        unit
        comments {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      relayPrevious {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
        timeCancelled
        timeRejected
        requesterContact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        pickupLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
          startedAt
        }
        riders {
          nextToken
          startedAt
        }
        priority
        deliverables {
          id
          count
          unit
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayPrevious {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayNext {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        group {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      relayNext {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
        timeCancelled
        timeRejected
        requesterContact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        pickupLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
          startedAt
        }
        riders {
          nextToken
          startedAt
        }
        priority
        deliverables {
          id
          count
          unit
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayPrevious {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayNext {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        group {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      group {
        items {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      comments {
        items {
          id
          parentId
          body
          publiclyVisible
          userCommentsId
          vehicleCommentsId
          taskCommentsId
          deliverableCommentsId
          locationCommentsId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      status
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
        timeCancelled
        timeRejected
        requesterContact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        pickupLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
          startedAt
        }
        riders {
          nextToken
          startedAt
        }
        priority
        deliverables {
          id
          count
          unit
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayPrevious {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayNext {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        group {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        body
        author {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        publiclyVisible
        userCommentsId
        vehicleCommentsId
        taskCommentsId
        deliverableCommentsId
        locationCommentsId
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      body
      author {
        id
        username
        contact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
          startedAt
        }
        patch
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          nextToken
          startedAt
        }
        group {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        tasks {
          nextToken
          startedAt
        }
        tasksCoordinator {
          nextToken
          startedAt
        }
        active
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      publiclyVisible
      userCommentsId
      vehicleCommentsId
      taskCommentsId
      deliverableCommentsId
      locationCommentsId
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        body
        author {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        publiclyVisible
        userCommentsId
        vehicleCommentsId
        taskCommentsId
        deliverableCommentsId
        locationCommentsId
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
      name
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const tasksByStatus = /* GraphQL */ `
  query TasksByStatus(
    $status: TaskStatus
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
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        timeOfCall
        timePickedUp
        timeDroppedOff
        timeCancelled
        timeRejected
        requesterContact {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        pickupLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
          startedAt
        }
        riders {
          nextToken
          startedAt
        }
        priority
        deliverables {
          id
          count
          unit
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayPrevious {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        relayNext {
          id
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          patch
          priority
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        group {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
