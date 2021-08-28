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
export const createPriority = /* GraphQL */ `
  mutation CreatePriority(
    $input: CreatePriorityInput!
    $condition: ModelPriorityConditionInput
  ) {
    createPriority(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const updatePriority = /* GraphQL */ `
  mutation UpdatePriority(
    $input: UpdatePriorityInput!
    $condition: ModelPriorityConditionInput
  ) {
    updatePriority(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const deletePriority = /* GraphQL */ `
  mutation DeletePriority(
    $input: DeletePriorityInput!
    $condition: ModelPriorityConditionInput
  ) {
    deletePriority(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const createPatch = /* GraphQL */ `
  mutation CreatePatch(
    $input: CreatePatchInput!
    $condition: ModelPatchConditionInput
  ) {
    createPatch(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const updatePatch = /* GraphQL */ `
  mutation UpdatePatch(
    $input: UpdatePatchInput!
    $condition: ModelPatchConditionInput
  ) {
    updatePatch(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const deletePatch = /* GraphQL */ `
  mutation DeletePatch(
    $input: DeletePatchInput!
    $condition: ModelPatchConditionInput
  ) {
    deletePatch(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
export const updateDeliverable = /* GraphQL */ `
  mutation UpdateDeliverable(
    $input: UpdateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    updateDeliverable(input: $input, condition: $condition) {
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
export const deleteDeliverable = /* GraphQL */ `
  mutation DeleteDeliverable(
    $input: DeleteDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    deleteDeliverable(input: $input, condition: $condition) {
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
export const createDeliverableType = /* GraphQL */ `
  mutation CreateDeliverableType(
    $input: CreateDeliverableTypeInput!
    $condition: ModelDeliverableTypeConditionInput
  ) {
    createDeliverableType(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
    }
  }
`;
export const createDeliverableUnit = /* GraphQL */ `
  mutation CreateDeliverableUnit(
    $input: CreateDeliverableUnitInput!
    $condition: ModelDeliverableUnitConditionInput
  ) {
    createDeliverableUnit(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const updateDeliverableUnit = /* GraphQL */ `
  mutation UpdateDeliverableUnit(
    $input: UpdateDeliverableUnitInput!
    $condition: ModelDeliverableUnitConditionInput
  ) {
    updateDeliverableUnit(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const deleteDeliverableUnit = /* GraphQL */ `
  mutation DeleteDeliverableUnit(
    $input: DeleteDeliverableUnitInput!
    $condition: ModelDeliverableUnitConditionInput
  ) {
    deleteDeliverableUnit(input: $input, condition: $condition) {
      id
      label
      timeCreated
      timeModified
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
export const createLocale = /* GraphQL */ `
  mutation CreateLocale(
    $input: CreateLocaleInput!
    $condition: ModelLocaleConditionInput
  ) {
    createLocale(input: $input, condition: $condition) {
      id
      label
      code
      timeCreated
      timeModified
    }
  }
`;
export const updateLocale = /* GraphQL */ `
  mutation UpdateLocale(
    $input: UpdateLocaleInput!
    $condition: ModelLocaleConditionInput
  ) {
    updateLocale(input: $input, condition: $condition) {
      id
      label
      code
      timeCreated
      timeModified
    }
  }
`;
export const deleteLocale = /* GraphQL */ `
  mutation DeleteLocale(
    $input: DeleteLocaleInput!
    $condition: ModelLocaleConditionInput
  ) {
    deleteLocale(input: $input, condition: $condition) {
      id
      label
      code
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
      timeCreated
      timeModified
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
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
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
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
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
