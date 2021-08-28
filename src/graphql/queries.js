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
        address {
          id
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
          timeCreated
          timeModified
        }
        telephoneNumber
        mobileNumber
        emailAddress
        timeCreated
        timeModified
      }
      displayName
      name
      dateOfBirth
      assignedVehicles {
        id
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
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      patch {
        id
        label
        timeCreated
        timeModified
      }
      status
      profilePictureURL
      profilePictureThumbnailURL
      comments {
        id
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        numEdits
        timeCreated
        timeModified
      }
      loggedActions {
        id
        ipAddress
        callingUser {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        dataFields
        timeCreated
        timeModified
      }
      timeCreated
      timeModified
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
          timeCreated
          timeModified
        }
        displayName
        name
        dateOfBirth
        assignedVehicles {
          id
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getLocation = /* GraphQL */ `
  query GetLocation($id: ID!) {
    getLocation(id: $id) {
      id
      name
      contact {
        id
        name
        address {
          id
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
          timeCreated
          timeModified
        }
        telephoneNumber
        mobileNumber
        emailAddress
        timeCreated
        timeModified
      }
      address {
        id
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
        timeCreated
        timeModified
      }
      listed
      protected
      comments {
        id
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        numEdits
        timeCreated
        timeModified
      }
      loggedActions {
        id
        ipAddress
        callingUser {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        dataFields
        timeCreated
        timeModified
      }
      timeCreated
      timeModified
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
        contact {
          id
          name
          telephoneNumber
          mobileNumber
          emailAddress
          timeCreated
          timeModified
        }
        address {
          id
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
          timeCreated
          timeModified
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getLogEntry = /* GraphQL */ `
  query GetLogEntry($id: ID!) {
    getLogEntry(id: $id) {
      id
      ipAddress
      callingUser {
        id
        username
        contact {
          id
          name
          telephoneNumber
          mobileNumber
          emailAddress
          timeCreated
          timeModified
        }
        displayName
        name
        dateOfBirth
        assignedVehicles {
          id
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      dataFields
      timeCreated
      timeModified
    }
  }
`;
export const listLogEntries = /* GraphQL */ `
  query ListLogEntries(
    $filter: ModelLogEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLogEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        ipAddress
        callingUser {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        dataFields
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getPriority = /* GraphQL */ `
  query GetPriority($id: ID!) {
    getPriority(id: $id) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const listPriorities = /* GraphQL */ `
  query ListPriorities(
    $filter: ModelPriorityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPriorities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        label
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getPatch = /* GraphQL */ `
  query GetPatch($id: ID!) {
    getPatch(id: $id) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const listPatches = /* GraphQL */ `
  query ListPatches(
    $filter: ModelPatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        label
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getVehicle = /* GraphQL */ `
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
      id
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
          timeCreated
          timeModified
        }
        displayName
        name
        dateOfBirth
        assignedVehicles {
          id
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      comments {
        id
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        numEdits
        timeCreated
        timeModified
      }
      loggedActions {
        id
        ipAddress
        callingUser {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        dataFields
        timeCreated
        timeModified
      }
      timeCreated
      timeModified
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
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      name
      address {
        id
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
        timeCreated
        timeModified
      }
      telephoneNumber
      mobileNumber
      emailAddress
      timeCreated
      timeModified
    }
  }
`;
export const listContacts = /* GraphQL */ `
  query ListContacts(
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        address {
          id
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
          timeCreated
          timeModified
        }
        telephoneNumber
        mobileNumber
        emailAddress
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getAddress = /* GraphQL */ `
  query GetAddress($id: ID!) {
    getAddress(id: $id) {
      id
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
      timeCreated
      timeModified
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
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getDeliverable = /* GraphQL */ `
  query GetDeliverable($id: ID!) {
    getDeliverable(id: $id) {
      id
      type {
        id
        label
        timeCreated
        timeModified
      }
      count
      unit {
        id
        label
        timeCreated
        timeModified
      }
      numBoxes
      comments {
        id
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        numEdits
        timeCreated
        timeModified
      }
      timeCreated
      timeModified
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
          label
          timeCreated
          timeModified
        }
        count
        unit {
          id
          label
          timeCreated
          timeModified
        }
        numBoxes
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getDeliverableType = /* GraphQL */ `
  query GetDeliverableType($id: ID!) {
    getDeliverableType(id: $id) {
      id
      label
      timeCreated
      timeModified
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
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getDeliverableUnit = /* GraphQL */ `
  query GetDeliverableUnit($id: ID!) {
    getDeliverableUnit(id: $id) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const listDeliverableUnits = /* GraphQL */ `
  query ListDeliverableUnits(
    $filter: ModelDeliverableUnitFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDeliverableUnits(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        label
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      reference
      orderInRelay
      author {
        id
        username
        contact {
          id
          name
          telephoneNumber
          mobileNumber
          emailAddress
          timeCreated
          timeModified
        }
        displayName
        name
        dateOfBirth
        assignedVehicles {
          id
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      timeOfCall
      timePickedUp
      timeDroppedOff
      timeCancelled
      timeRejected
      requesterContact {
        id
        name
        address {
          id
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
          timeCreated
          timeModified
        }
        telephoneNumber
        mobileNumber
        emailAddress
        timeCreated
        timeModified
      }
      pickupLocation {
        id
        name
        contact {
          id
          name
          telephoneNumber
          mobileNumber
          emailAddress
          timeCreated
          timeModified
        }
        address {
          id
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
          timeCreated
          timeModified
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      dropoffLocation {
        id
        name
        contact {
          id
          name
          telephoneNumber
          mobileNumber
          emailAddress
          timeCreated
          timeModified
        }
        address {
          id
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
          timeCreated
          timeModified
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      patch {
        id
        label
        timeCreated
        timeModified
      }
      priority {
        id
        label
        timeCreated
        timeModified
      }
      deliverables {
        id
        type {
          id
          label
          timeCreated
          timeModified
        }
        count
        unit {
          id
          label
          timeCreated
          timeModified
        }
        numBoxes
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      assignedRidersDisplayString
      assignedCoordinatorsDisplayString
      assignedRiders {
        id
        username
        contact {
          id
          name
          telephoneNumber
          mobileNumber
          emailAddress
          timeCreated
          timeModified
        }
        displayName
        name
        dateOfBirth
        assignedVehicles {
          id
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      assignedCoordinators {
        id
        username
        contact {
          id
          name
          telephoneNumber
          mobileNumber
          emailAddress
          timeCreated
          timeModified
        }
        displayName
        name
        dateOfBirth
        assignedVehicles {
          id
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      relayPrevious {
        id
        reference
        orderInRelay
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
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
          timeCreated
          timeModified
        }
        pickupLocation {
          id
          name
          listed
          protected
          timeCreated
          timeModified
        }
        dropoffLocation {
          id
          name
          listed
          protected
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        priority {
          id
          label
          timeCreated
          timeModified
        }
        deliverables {
          id
          count
          numBoxes
          timeCreated
          timeModified
        }
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        relayPrevious {
          id
          reference
          orderInRelay
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          timeCreated
          timeModified
        }
        relayNext {
          id
          reference
          orderInRelay
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        status
        timeCreated
        timeModified
      }
      relayNext {
        id
        reference
        orderInRelay
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
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
          timeCreated
          timeModified
        }
        pickupLocation {
          id
          name
          listed
          protected
          timeCreated
          timeModified
        }
        dropoffLocation {
          id
          name
          listed
          protected
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        priority {
          id
          label
          timeCreated
          timeModified
        }
        deliverables {
          id
          count
          numBoxes
          timeCreated
          timeModified
        }
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        relayPrevious {
          id
          reference
          orderInRelay
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          timeCreated
          timeModified
        }
        relayNext {
          id
          reference
          orderInRelay
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        status
        timeCreated
        timeModified
      }
      loggedActions {
        id
        ipAddress
        callingUser {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        dataFields
        timeCreated
        timeModified
      }
      comments {
        id
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        numEdits
        timeCreated
        timeModified
      }
      status
      timeCreated
      timeModified
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
        reference
        orderInRelay
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
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
          timeCreated
          timeModified
        }
        pickupLocation {
          id
          name
          listed
          protected
          timeCreated
          timeModified
        }
        dropoffLocation {
          id
          name
          listed
          protected
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        priority {
          id
          label
          timeCreated
          timeModified
        }
        deliverables {
          id
          count
          numBoxes
          timeCreated
          timeModified
        }
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        relayPrevious {
          id
          reference
          orderInRelay
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          timeCreated
          timeModified
        }
        relayNext {
          id
          reference
          orderInRelay
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        status
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
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
          timeCreated
          timeModified
        }
        displayName
        name
        dateOfBirth
        assignedVehicles {
          id
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          timeCreated
          timeModified
        }
        patch {
          id
          label
          timeCreated
          timeModified
        }
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          timeCreated
          timeModified
        }
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      publiclyVisible
      loggedActions {
        id
        ipAddress
        callingUser {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        dataFields
        timeCreated
        timeModified
      }
      numEdits
      timeCreated
      timeModified
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
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          status
          profilePictureURL
          profilePictureThumbnailURL
          timeCreated
          timeModified
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          timeCreated
          timeModified
        }
        numEdits
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getLocale = /* GraphQL */ `
  query GetLocale($id: ID!) {
    getLocale(id: $id) {
      id
      label
      code
      timeCreated
      timeModified
    }
  }
`;
export const listLocales = /* GraphQL */ `
  query ListLocales(
    $filter: ModelLocaleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocales(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        label
        code
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getServerSettings = /* GraphQL */ `
  query GetServerSettings($id: ID!) {
    getServerSettings(id: $id) {
      id
      imageURL
      favicon
      version
      hostname
      timeCreated
      timeModified
    }
  }
`;
export const listServerSettings = /* GraphQL */ `
  query ListServerSettings(
    $filter: ModelServerSettingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServerSettings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        imageURL
        favicon
        version
        hostname
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getOrganisation = /* GraphQL */ `
  query GetOrganisation($id: ID!) {
    getOrganisation(id: $id) {
      id
      organisationName
      timeCreated
      timeModified
    }
  }
`;
export const listOrganisations = /* GraphQL */ `
  query ListOrganisations(
    $filter: ModelOrganisationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrganisations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        organisationName
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      groupName
      locale {
        id
        label
        code
        timeCreated
        timeModified
      }
      timeCreated
      timeModified
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
        groupName
        locale {
          id
          label
          code
          timeCreated
          timeModified
        }
        timeCreated
        timeModified
      }
      nextToken
    }
  }
`;
