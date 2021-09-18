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
export const onCreateAddress = /* GraphQL */ `
  subscription OnCreateAddress {
    onCreateAddress {
      id
      name
      telephoneNumber
      mobileNumber
      emailAddress
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
export const onUpdateAddress = /* GraphQL */ `
  subscription OnUpdateAddress {
    onUpdateAddress {
      id
      name
      telephoneNumber
      mobileNumber
      emailAddress
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
export const onDeleteAddress = /* GraphQL */ `
  subscription OnDeleteAddress {
    onDeleteAddress {
      id
      name
      telephoneNumber
      mobileNumber
      emailAddress
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
export const onCreateDeliverable = /* GraphQL */ `
  subscription OnCreateDeliverable {
    onCreateDeliverable {
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
export const onUpdateDeliverable = /* GraphQL */ `
  subscription OnUpdateDeliverable {
    onUpdateDeliverable {
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
export const onDeleteDeliverable = /* GraphQL */ `
  subscription OnDeleteDeliverable {
    onDeleteDeliverable {
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
