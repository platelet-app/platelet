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
export const createAddress = /* GraphQL */ `
  mutation CreateAddress(
    $input: CreateAddressInput!
    $condition: ModelAddressConditionInput
  ) {
    createAddress(input: $input, condition: $condition) {
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
export const updateAddress = /* GraphQL */ `
  mutation UpdateAddress(
    $input: UpdateAddressInput!
    $condition: ModelAddressConditionInput
  ) {
    updateAddress(input: $input, condition: $condition) {
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
export const deleteAddress = /* GraphQL */ `
  mutation DeleteAddress(
    $input: DeleteAddressInput!
    $condition: ModelAddressConditionInput
  ) {
    deleteAddress(input: $input, condition: $condition) {
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
export const createDeliverable = /* GraphQL */ `
  mutation CreateDeliverable(
    $input: CreateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    createDeliverable(input: $input, condition: $condition) {
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
export const updateDeliverable = /* GraphQL */ `
  mutation UpdateDeliverable(
    $input: UpdateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    updateDeliverable(input: $input, condition: $condition) {
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
export const deleteDeliverable = /* GraphQL */ `
  mutation DeleteDeliverable(
    $input: DeleteDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    deleteDeliverable(input: $input, condition: $condition) {
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
