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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      patch
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      patch
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      patch
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createLogEntry = /* GraphQL */ `
  mutation CreateLogEntry(
    $input: CreateLogEntryInput!
    $condition: ModelLogEntryConditionInput
  ) {
    createLogEntry(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      dataFields
      createdAt
      updatedAt
    }
  }
`;
export const updateLogEntry = /* GraphQL */ `
  mutation UpdateLogEntry(
    $input: UpdateLogEntryInput!
    $condition: ModelLogEntryConditionInput
  ) {
    updateLogEntry(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      dataFields
      createdAt
      updatedAt
    }
  }
`;
export const deleteLogEntry = /* GraphQL */ `
  mutation DeleteLogEntry(
    $input: DeleteLogEntryInput!
    $condition: ModelLogEntryConditionInput
  ) {
    deleteLogEntry(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      dataFields
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createContact = /* GraphQL */ `
  mutation CreateContact(
    $input: CreateContactInput!
    $condition: ModelContactConditionInput
  ) {
    createContact(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
      }
      telephoneNumber
      mobileNumber
      emailAddress
      createdAt
      updatedAt
    }
  }
`;
export const updateContact = /* GraphQL */ `
  mutation UpdateContact(
    $input: UpdateContactInput!
    $condition: ModelContactConditionInput
  ) {
    updateContact(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
      }
      telephoneNumber
      mobileNumber
      emailAddress
      createdAt
      updatedAt
    }
  }
`;
export const deleteContact = /* GraphQL */ `
  mutation DeleteContact(
    $input: DeleteContactInput!
    $condition: ModelContactConditionInput
  ) {
    deleteContact(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
      }
      telephoneNumber
      mobileNumber
      emailAddress
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
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
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
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
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
        body
        author {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      patch
      priority
      deliverables {
        id
        type
        count
        unit
        numBoxes
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        pickupLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        patch
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
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        pickupLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        patch
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
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      patch
      priority
      deliverables {
        id
        type
        count
        unit
        numBoxes
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        pickupLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        patch
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
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        pickupLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        patch
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
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        telephoneNumber
        mobileNumber
        emailAddress
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        listed
        protected
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      patch
      priority
      deliverables {
        id
        type
        count
        unit
        numBoxes
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        pickupLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        patch
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
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
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
          createdAt
          updatedAt
        }
        pickupLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        dropoffLocation {
          id
          name
          listed
          protected
          createdAt
          updatedAt
        }
        patch
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
        assignedRidersDisplayString
        assignedCoordinatorsDisplayString
        assignedRiders {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        assignedCoordinators {
          id
          username
          displayName
          name
          dateOfBirth
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
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
          patch
          priority
          assignedRidersDisplayString
          assignedCoordinatorsDisplayString
          status
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        publiclyVisible
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        numEdits
        createdAt
        updatedAt
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
      }
      numEdits
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
      }
      numEdits
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
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        patch
        status
        profilePictureURL
        profilePictureThumbnailURL
        comments {
          id
          body
          publiclyVisible
          numEdits
          createdAt
          updatedAt
        }
        loggedActions {
          id
          ipAddress
          dataFields
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
          patch
          status
          profilePictureURL
          profilePictureThumbnailURL
          createdAt
          updatedAt
        }
        dataFields
        createdAt
        updatedAt
      }
      numEdits
      createdAt
      updatedAt
    }
  }
`;
export const createServerSettings = /* GraphQL */ `
  mutation CreateServerSettings(
    $input: CreateServerSettingsInput!
    $condition: ModelServerSettingsConditionInput
  ) {
    createServerSettings(input: $input, condition: $condition) {
      id
      imageURL
      favicon
      version
      hostname
      createdAt
      updatedAt
    }
  }
`;
export const updateServerSettings = /* GraphQL */ `
  mutation UpdateServerSettings(
    $input: UpdateServerSettingsInput!
    $condition: ModelServerSettingsConditionInput
  ) {
    updateServerSettings(input: $input, condition: $condition) {
      id
      imageURL
      favicon
      version
      hostname
      createdAt
      updatedAt
    }
  }
`;
export const deleteServerSettings = /* GraphQL */ `
  mutation DeleteServerSettings(
    $input: DeleteServerSettingsInput!
    $condition: ModelServerSettingsConditionInput
  ) {
    deleteServerSettings(input: $input, condition: $condition) {
      id
      imageURL
      favicon
      version
      hostname
      createdAt
      updatedAt
    }
  }
`;
export const createOrganisation = /* GraphQL */ `
  mutation CreateOrganisation(
    $input: CreateOrganisationInput!
    $condition: ModelOrganisationConditionInput
  ) {
    createOrganisation(input: $input, condition: $condition) {
      id
      organisationName
      createdAt
      updatedAt
    }
  }
`;
export const updateOrganisation = /* GraphQL */ `
  mutation UpdateOrganisation(
    $input: UpdateOrganisationInput!
    $condition: ModelOrganisationConditionInput
  ) {
    updateOrganisation(input: $input, condition: $condition) {
      id
      organisationName
      createdAt
      updatedAt
    }
  }
`;
export const deleteOrganisation = /* GraphQL */ `
  mutation DeleteOrganisation(
    $input: DeleteOrganisationInput!
    $condition: ModelOrganisationConditionInput
  ) {
    deleteOrganisation(input: $input, condition: $condition) {
      id
      organisationName
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
      groupName
      locale
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
      groupName
      locale
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
      groupName
      locale
      createdAt
      updatedAt
    }
  }
`;
