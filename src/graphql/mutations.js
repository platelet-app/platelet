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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
      tasksCoordinator {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
      active
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
      tasksCoordinator {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
      active
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
      tasksCoordinator {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
      active
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
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
        tasksCoordinator {
          nextToken
        }
        active
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
        tasksCoordinator {
          nextToken
        }
        active
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
        tasksCoordinator {
          nextToken
        }
        active
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      id
      name
      address {
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
        createdAt
        updatedAt
      }
      listed
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      id
      name
      address {
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
        createdAt
        updatedAt
      }
      listed
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      id
      name
      address {
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
        createdAt
        updatedAt
      }
      listed
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
      type {
        id
        name
        createdAt
        updatedAt
      }
      count
      unit
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
export const updateDeliverable = /* GraphQL */ `
  mutation UpdateDeliverable(
    $input: UpdateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    updateDeliverable(input: $input, condition: $condition) {
      id
      type {
        id
        name
        createdAt
        updatedAt
      }
      count
      unit
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
export const deleteDeliverable = /* GraphQL */ `
  mutation DeleteDeliverable(
    $input: DeleteDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    deleteDeliverable(input: $input, condition: $condition) {
      id
      type {
        id
        name
        createdAt
        updatedAt
      }
      count
      unit
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
export const createUserTasks = /* GraphQL */ `
  mutation CreateUserTasks(
    $input: CreateUserTasksInput!
    $condition: ModelUserTasksConditionInput
  ) {
    createUserTasks(input: $input, condition: $condition) {
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
        tasksCoordinator {
          nextToken
        }
        active
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
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUserTasks = /* GraphQL */ `
  mutation UpdateUserTasks(
    $input: UpdateUserTasksInput!
    $condition: ModelUserTasksConditionInput
  ) {
    updateUserTasks(input: $input, condition: $condition) {
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
        tasksCoordinator {
          nextToken
        }
        active
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
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserTasks = /* GraphQL */ `
  mutation DeleteUserTasks(
    $input: DeleteUserTasksInput!
    $condition: ModelUserTasksConditionInput
  ) {
    deleteUserTasks(input: $input, condition: $condition) {
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
        tasksCoordinator {
          nextToken
        }
        active
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
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
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
        tasksCoordinator {
          nextToken
        }
        active
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
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
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
        tasksCoordinator {
          nextToken
        }
        active
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
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
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
        tasksCoordinator {
          nextToken
        }
        active
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
          patch
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
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
        tasksCoordinator {
          nextToken
        }
        active
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
        createdAt
        updatedAt
      }
      patch
      coordinators {
        items {
          id
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
        type {
          id
          name
          createdAt
          updatedAt
        }
        count
        unit
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      group {
        items {
          id
          name
          createdAt
          updatedAt
        }
        nextToken
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
        tasksCoordinator {
          nextToken
        }
        active
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
        createdAt
        updatedAt
      }
      patch
      coordinators {
        items {
          id
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
        type {
          id
          name
          createdAt
          updatedAt
        }
        count
        unit
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      group {
        items {
          id
          name
          createdAt
          updatedAt
        }
        nextToken
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
        tasksCoordinator {
          nextToken
        }
        active
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
        createdAt
        updatedAt
      }
      patch
      coordinators {
        items {
          id
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
        type {
          id
          name
          createdAt
          updatedAt
        }
        count
        unit
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
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
          profilePictureURL
          profilePictureThumbnailURL
          active
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
          count
          unit
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
        group {
          nextToken
        }
        comments {
          nextToken
        }
        status
        createdAt
        updatedAt
      }
      group {
        items {
          id
          name
          createdAt
          updatedAt
        }
        nextToken
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
          what3words
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
        tasksCoordinator {
          nextToken
        }
        active
        createdAt
        updatedAt
      }
      publiclyVisible
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
          what3words
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
        tasksCoordinator {
          nextToken
        }
        active
        createdAt
        updatedAt
      }
      publiclyVisible
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
          what3words
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
        tasksCoordinator {
          nextToken
        }
        active
        createdAt
        updatedAt
      }
      publiclyVisible
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
      name
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
      name
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
      name
      createdAt
      updatedAt
    }
  }
`;
