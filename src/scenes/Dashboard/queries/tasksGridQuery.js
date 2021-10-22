export const dashboardQuery = `
  query tasksByStatus (
    $status: TaskStatus
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
    items {
      assignees {
        items {
          role
          assignee {
            id
            displayName
            name
            profilePictureThumbnailURL
          }
        }
      }
      id
      reference
      timeOfCall
      status
      statusHumanReadable
      relayNext {
        id
      }
      relayPrevious {
        id
      }
    }
  }
}
`;
