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
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup {
    onUpdateGroup {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup {
    onDeleteGroup {
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
export const onCreateLocation = /* GraphQL */ `
  subscription OnCreateLocation {
    onCreateLocation {
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
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation {
    onUpdateLocation {
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
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation {
    onDeleteLocation {
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
export const onUpdateDeliverable = /* GraphQL */ `
  subscription OnUpdateDeliverable {
    onUpdateDeliverable {
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
export const onDeleteDeliverable = /* GraphQL */ `
  subscription OnDeleteDeliverable {
    onDeleteDeliverable {
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
      visibility
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
