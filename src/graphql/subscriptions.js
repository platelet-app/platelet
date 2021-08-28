/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateLocation = /* GraphQL */ `
  subscription OnCreateLocation {
    onCreateLocation {
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
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation {
    onUpdateLocation {
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
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation {
    onDeleteLocation {
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
export const onCreateLogEntry = /* GraphQL */ `
  subscription OnCreateLogEntry {
    onCreateLogEntry {
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
export const onUpdateLogEntry = /* GraphQL */ `
  subscription OnUpdateLogEntry {
    onUpdateLogEntry {
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
export const onDeleteLogEntry = /* GraphQL */ `
  subscription OnDeleteLogEntry {
    onDeleteLogEntry {
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
export const onCreatePriority = /* GraphQL */ `
  subscription OnCreatePriority {
    onCreatePriority {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onUpdatePriority = /* GraphQL */ `
  subscription OnUpdatePriority {
    onUpdatePriority {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onDeletePriority = /* GraphQL */ `
  subscription OnDeletePriority {
    onDeletePriority {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onCreatePatch = /* GraphQL */ `
  subscription OnCreatePatch {
    onCreatePatch {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onUpdatePatch = /* GraphQL */ `
  subscription OnUpdatePatch {
    onUpdatePatch {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onDeletePatch = /* GraphQL */ `
  subscription OnDeletePatch {
    onDeletePatch {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onCreateVehicle = /* GraphQL */ `
  subscription OnCreateVehicle {
    onCreateVehicle {
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
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle {
    onUpdateVehicle {
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
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle {
    onDeleteVehicle {
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
export const onCreateContact = /* GraphQL */ `
  subscription OnCreateContact {
    onCreateContact {
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
export const onUpdateContact = /* GraphQL */ `
  subscription OnUpdateContact {
    onUpdateContact {
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
export const onDeleteContact = /* GraphQL */ `
  subscription OnDeleteContact {
    onDeleteContact {
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
export const onCreateAddress = /* GraphQL */ `
  subscription OnCreateAddress {
    onCreateAddress {
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
export const onUpdateAddress = /* GraphQL */ `
  subscription OnUpdateAddress {
    onUpdateAddress {
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
export const onDeleteAddress = /* GraphQL */ `
  subscription OnDeleteAddress {
    onDeleteAddress {
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
export const onCreateDeliverable = /* GraphQL */ `
  subscription OnCreateDeliverable {
    onCreateDeliverable {
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
export const onUpdateDeliverable = /* GraphQL */ `
  subscription OnUpdateDeliverable {
    onUpdateDeliverable {
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
export const onDeleteDeliverable = /* GraphQL */ `
  subscription OnDeleteDeliverable {
    onDeleteDeliverable {
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
export const onCreateDeliverableType = /* GraphQL */ `
  subscription OnCreateDeliverableType {
    onCreateDeliverableType {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onUpdateDeliverableType = /* GraphQL */ `
  subscription OnUpdateDeliverableType {
    onUpdateDeliverableType {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onDeleteDeliverableType = /* GraphQL */ `
  subscription OnDeleteDeliverableType {
    onDeleteDeliverableType {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onCreateDeliverableUnit = /* GraphQL */ `
  subscription OnCreateDeliverableUnit {
    onCreateDeliverableUnit {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onUpdateDeliverableUnit = /* GraphQL */ `
  subscription OnUpdateDeliverableUnit {
    onUpdateDeliverableUnit {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onDeleteDeliverableUnit = /* GraphQL */ `
  subscription OnDeleteDeliverableUnit {
    onDeleteDeliverableUnit {
      id
      label
      timeCreated
      timeModified
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
export const onCreateLocale = /* GraphQL */ `
  subscription OnCreateLocale {
    onCreateLocale {
      id
      label
      code
      timeCreated
      timeModified
    }
  }
`;
export const onUpdateLocale = /* GraphQL */ `
  subscription OnUpdateLocale {
    onUpdateLocale {
      id
      label
      code
      timeCreated
      timeModified
    }
  }
`;
export const onDeleteLocale = /* GraphQL */ `
  subscription OnDeleteLocale {
    onDeleteLocale {
      id
      label
      code
      timeCreated
      timeModified
    }
  }
`;
export const onCreateServerSettings = /* GraphQL */ `
  subscription OnCreateServerSettings {
    onCreateServerSettings {
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
export const onUpdateServerSettings = /* GraphQL */ `
  subscription OnUpdateServerSettings {
    onUpdateServerSettings {
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
export const onDeleteServerSettings = /* GraphQL */ `
  subscription OnDeleteServerSettings {
    onDeleteServerSettings {
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
export const onCreateOrganisation = /* GraphQL */ `
  subscription OnCreateOrganisation {
    onCreateOrganisation {
      id
      organisationName
      timeCreated
      timeModified
    }
  }
`;
export const onUpdateOrganisation = /* GraphQL */ `
  subscription OnUpdateOrganisation {
    onUpdateOrganisation {
      id
      organisationName
      timeCreated
      timeModified
    }
  }
`;
export const onDeleteOrganisation = /* GraphQL */ `
  subscription OnDeleteOrganisation {
    onDeleteOrganisation {
      id
      organisationName
      timeCreated
      timeModified
    }
  }
`;
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup {
    onUpdateGroup {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup {
    onDeleteGroup {
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
