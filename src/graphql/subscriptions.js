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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup {
    onUpdateGroup {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup {
    onDeleteGroup {
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
export const onCreateVehicle = /* GraphQL */ `
  subscription OnCreateVehicle {
    onCreateVehicle {
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
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle {
    onUpdateVehicle {
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
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle {
    onDeleteVehicle {
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
export const onCreateLocation = /* GraphQL */ `
  subscription OnCreateLocation {
    onCreateLocation {
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
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation {
    onUpdateLocation {
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
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation {
    onDeleteLocation {
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
export const onCreateAddressAndContactDetails = /* GraphQL */ `
  subscription OnCreateAddressAndContactDetails {
    onCreateAddressAndContactDetails {
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
export const onUpdateAddressAndContactDetails = /* GraphQL */ `
  subscription OnUpdateAddressAndContactDetails {
    onUpdateAddressAndContactDetails {
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
export const onDeleteAddressAndContactDetails = /* GraphQL */ `
  subscription OnDeleteAddressAndContactDetails {
    onDeleteAddressAndContactDetails {
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
export const onCreateDeliverable = /* GraphQL */ `
  subscription OnCreateDeliverable {
    onCreateDeliverable {
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
export const onUpdateDeliverable = /* GraphQL */ `
  subscription OnUpdateDeliverable {
    onUpdateDeliverable {
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
export const onDeleteDeliverable = /* GraphQL */ `
  subscription OnDeleteDeliverable {
    onDeleteDeliverable {
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
export const onCreateUserTasks = /* GraphQL */ `
  subscription OnCreateUserTasks {
    onCreateUserTasks {
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
export const onUpdateUserTasks = /* GraphQL */ `
  subscription OnUpdateUserTasks {
    onUpdateUserTasks {
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
export const onDeleteUserTasks = /* GraphQL */ `
  subscription OnDeleteUserTasks {
    onDeleteUserTasks {
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
export const onCreateCoordinatorTasks = /* GraphQL */ `
  subscription OnCreateCoordinatorTasks {
    onCreateCoordinatorTasks {
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
export const onUpdateCoordinatorTasks = /* GraphQL */ `
  subscription OnUpdateCoordinatorTasks {
    onUpdateCoordinatorTasks {
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
export const onDeleteCoordinatorTasks = /* GraphQL */ `
  subscription OnDeleteCoordinatorTasks {
    onDeleteCoordinatorTasks {
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
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
export const onCreateDeliverableType = /* GraphQL */ `
  subscription OnCreateDeliverableType {
    onCreateDeliverableType {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDeliverableType = /* GraphQL */ `
  subscription OnUpdateDeliverableType {
    onUpdateDeliverableType {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDeliverableType = /* GraphQL */ `
  subscription OnDeleteDeliverableType {
    onDeleteDeliverableType {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
