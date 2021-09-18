/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        zipcode
        what3words
        listed
        protected
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
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
          createdAt
          updatedAt
        }
        nextToken
      }
      patch
      status
      profilePictureURL
      profilePictureThumbnailURL
      comments {
        id
        parentID
        body
        author {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        createdAt
        updatedAt
      }
      group {
        id
        name
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      tasks {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        group {
          id
          name
          createdAt
          updatedAt
        }
        tasks {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
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
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        nextToken
      }
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
        name
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        group {
          id
          name
          createdAt
          updatedAt
        }
        tasks {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        id
        parentID
        body
        author {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        createdAt
        updatedAt
      }
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
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAddress = /* GraphQL */ `
  query GetAddress($id: ID!) {
    getAddress(id: $id) {
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
      zipcode
      what3words
      listed
      protected
      comments {
        id
        parentID
        body
        author {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listAddresses = /* GraphQL */ `
  query ListAddresses(
    $filter: ModelAddressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAddresses(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        zipcode
        what3words
        listed
        protected
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDeliverable = /* GraphQL */ `
  query GetDeliverable($id: ID!) {
    getDeliverable(id: $id) {
      id
      type
      count
      unit
      numBoxes
      comments {
        id
        parentID
        body
        author {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        createdAt
        updatedAt
      }
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
        type
        count
        unit
        numBoxes
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        group {
          id
          name
          createdAt
          updatedAt
        }
        tasks {
          nextToken
        }
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
        zipcode
        what3words
        listed
        protected
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
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
        zipcode
        what3words
        listed
        protected
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
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
        zipcode
        what3words
        listed
        protected
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      patch
      coordinators {
        items {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        nextToken
      }
      riders {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
      priority
      deliverables {
        id
        type
        count
        unit
        numBoxes
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
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
          status
          profilePictureURL
          profilePictureThumbnailURL
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
        }
        riders {
          nextToken
        }
        priority
        deliverables {
          id
          type
          count
          unit
          numBoxes
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
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        status
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
          status
          profilePictureURL
          profilePictureThumbnailURL
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
        }
        riders {
          nextToken
        }
        priority
        deliverables {
          id
          type
          count
          unit
          numBoxes
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
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        nextToken
      }
      status
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
          status
          profilePictureURL
          profilePictureThumbnailURL
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
        }
        riders {
          nextToken
        }
        priority
        deliverables {
          id
          type
          count
          unit
          numBoxes
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
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      parentID
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        displayName
        name
        roles
        dateOfBirth
        vehicles {
          nextToken
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          parentID
          body
          publiclyVisible
          createdAt
          updatedAt
        }
        group {
          id
          name
          createdAt
          updatedAt
        }
        tasks {
          nextToken
        }
        createdAt
        updatedAt
      }
      publiclyVisible
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
        parentID
        body
        author {
          id
          username
          displayName
          name
          roles
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        createdAt
        updatedAt
      }
      nextToken
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
          status
          profilePictureURL
          profilePictureThumbnailURL
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
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
          zipcode
          what3words
          listed
          protected
          createdAt
          updatedAt
        }
        patch
        coordinators {
          nextToken
        }
        riders {
          nextToken
        }
        priority
        deliverables {
          id
          type
          count
          unit
          numBoxes
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
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
