/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
      riderResponsibility {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      profilePictureURL
      profilePictureThumbnailURL
      comments {
        items {
          id
          parentId
          body
          visibility
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
      tasksRider {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
      riderResponsibility {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      profilePictureURL
      profilePictureThumbnailURL
      comments {
        items {
          id
          parentId
          body
          visibility
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
      tasksRider {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
      riderResponsibility {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      profilePictureURL
      profilePictureThumbnailURL
      comments {
        items {
          id
          parentId
          body
          visibility
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
      tasksRider {
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
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
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
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
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
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
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
export const createVehicle = /* GraphQL */ `
  mutation CreateVehicle(
    $input: CreateVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    createVehicle(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
          visibility
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
export const updateVehicle = /* GraphQL */ `
  mutation UpdateVehicle(
    $input: UpdateVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    updateVehicle(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
          visibility
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
export const deleteVehicle = /* GraphQL */ `
  mutation DeleteVehicle(
    $input: DeleteVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    deleteVehicle(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
          visibility
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
export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
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
          visibility
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
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
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
          visibility
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
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
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
          visibility
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
export const createAddressAndContactDetails = /* GraphQL */ `
  mutation CreateAddressAndContactDetails(
    $input: CreateAddressAndContactDetailsInput!
    $condition: ModelAddressAndContactDetailsConditionInput
  ) {
    createAddressAndContactDetails(input: $input, condition: $condition) {
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
export const updateAddressAndContactDetails = /* GraphQL */ `
  mutation UpdateAddressAndContactDetails(
    $input: UpdateAddressAndContactDetailsInput!
    $condition: ModelAddressAndContactDetailsConditionInput
  ) {
    updateAddressAndContactDetails(input: $input, condition: $condition) {
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
export const deleteAddressAndContactDetails = /* GraphQL */ `
  mutation DeleteAddressAndContactDetails(
    $input: DeleteAddressAndContactDetailsInput!
    $condition: ModelAddressAndContactDetailsConditionInput
  ) {
    deleteAddressAndContactDetails(input: $input, condition: $condition) {
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
export const createDeliverable = /* GraphQL */ `
  mutation CreateDeliverable(
    $input: CreateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    createDeliverable(input: $input, condition: $condition) {
      id
      deliverableType {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      taskDeliverablesId
      count
      unit
      orderInGrid
      icon
      comments {
        items {
          id
          parentId
          body
          visibility
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
export const updateDeliverable = /* GraphQL */ `
  mutation UpdateDeliverable(
    $input: UpdateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    updateDeliverable(input: $input, condition: $condition) {
      id
      deliverableType {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      taskDeliverablesId
      count
      unit
      orderInGrid
      icon
      comments {
        items {
          id
          parentId
          body
          visibility
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
export const deleteDeliverable = /* GraphQL */ `
  mutation DeleteDeliverable(
    $input: DeleteDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    deleteDeliverable(input: $input, condition: $condition) {
      id
      deliverableType {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      taskDeliverablesId
      count
      unit
      orderInGrid
      icon
      comments {
        items {
          id
          parentId
          body
          visibility
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
export const createRiderTasks = /* GraphQL */ `
  mutation CreateRiderTasks(
    $input: CreateRiderTasksInput!
    $condition: ModelRiderTasksConditionInput
  ) {
    createRiderTasks(input: $input, condition: $condition) {
      id
      user {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      task {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateRiderTasks = /* GraphQL */ `
  mutation UpdateRiderTasks(
    $input: UpdateRiderTasksInput!
    $condition: ModelRiderTasksConditionInput
  ) {
    updateRiderTasks(input: $input, condition: $condition) {
      id
      user {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      task {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteRiderTasks = /* GraphQL */ `
  mutation DeleteRiderTasks(
    $input: DeleteRiderTasksInput!
    $condition: ModelRiderTasksConditionInput
  ) {
    deleteRiderTasks(input: $input, condition: $condition) {
      id
      user {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      task {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createCoordinatorTasks = /* GraphQL */ `
  mutation CreateCoordinatorTasks(
    $input: CreateCoordinatorTasksInput!
    $condition: ModelCoordinatorTasksConditionInput
  ) {
    createCoordinatorTasks(input: $input, condition: $condition) {
      id
      coordinator {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      task {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateCoordinatorTasks = /* GraphQL */ `
  mutation UpdateCoordinatorTasks(
    $input: UpdateCoordinatorTasksInput!
    $condition: ModelCoordinatorTasksConditionInput
  ) {
    updateCoordinatorTasks(input: $input, condition: $condition) {
      id
      coordinator {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      task {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteCoordinatorTasks = /* GraphQL */ `
  mutation DeleteCoordinatorTasks(
    $input: DeleteCoordinatorTasksInput!
    $condition: ModelCoordinatorTasksConditionInput
  ) {
    deleteCoordinatorTasks(input: $input, condition: $condition) {
      id
      coordinator {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      task {
        id
        name
        createdBy {
          id
          username
          displayName
          name
          roles
          dateOfBirth
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      pickUpLocation {
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
      dropOffLocation {
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
      riderResponsibility {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      assignedCoordinators {
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
      assignedRiders {
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
        items {
          id
          taskDeliverablesId
          count
          unit
          orderInGrid
          icon
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
          visibility
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
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      pickUpLocation {
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
      dropOffLocation {
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
      riderResponsibility {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      assignedCoordinators {
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
      assignedRiders {
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
        items {
          id
          taskDeliverablesId
          count
          unit
          orderInGrid
          icon
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
          visibility
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
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      pickUpLocation {
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
      dropOffLocation {
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
      riderResponsibility {
        id
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      assignedCoordinators {
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
      assignedRiders {
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
        items {
          id
          taskDeliverablesId
          count
          unit
          orderInGrid
          icon
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
        pickUpLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        dropOffLocation {
          id
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        assignedCoordinators {
          nextToken
          startedAt
        }
        assignedRiders {
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
          name
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
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
          visibility
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
        riderResponsibility {
          id
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
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
        tasksRider {
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
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createDeliverableType = /* GraphQL */ `
  mutation CreateDeliverableType(
    $input: CreateDeliverableTypeInput!
    $condition: ModelDeliverableTypeConditionInput
  ) {
    createDeliverableType(input: $input, condition: $condition) {
      id
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateDeliverableType = /* GraphQL */ `
  mutation UpdateDeliverableType(
    $input: UpdateDeliverableTypeInput!
    $condition: ModelDeliverableTypeConditionInput
  ) {
    updateDeliverableType(input: $input, condition: $condition) {
      id
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteDeliverableType = /* GraphQL */ `
  mutation DeleteDeliverableType(
    $input: DeleteDeliverableTypeInput!
    $condition: ModelDeliverableTypeConditionInput
  ) {
    deleteDeliverableType(input: $input, condition: $condition) {
      id
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createRiderResponsibility = /* GraphQL */ `
  mutation CreateRiderResponsibility(
    $input: CreateRiderResponsibilityInput!
    $condition: ModelRiderResponsibilityConditionInput
  ) {
    createRiderResponsibility(input: $input, condition: $condition) {
      id
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateRiderResponsibility = /* GraphQL */ `
  mutation UpdateRiderResponsibility(
    $input: UpdateRiderResponsibilityInput!
    $condition: ModelRiderResponsibilityConditionInput
  ) {
    updateRiderResponsibility(input: $input, condition: $condition) {
      id
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteRiderResponsibility = /* GraphQL */ `
  mutation DeleteRiderResponsibility(
    $input: DeleteRiderResponsibilityInput!
    $condition: ModelRiderResponsibilityConditionInput
  ) {
    deleteRiderResponsibility(input: $input, condition: $condition) {
      id
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
