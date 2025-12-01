export const deleteTaskAssignee = `mutation DeleteTaskAssignee(
  $input: DeleteTaskAssigneeInput!
  $condition: ModelTaskAssigneeConditionInput
) {
  deleteTaskAssignee(input: $input, condition: $condition) {
    id
    tenantId
    role
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userAssignmentsId
    taskAssigneesId
    __typename
  }
}`;
