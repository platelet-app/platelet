export const deleteComment = `mutation DeleteComment(
  $input: DeleteCommentInput!
  $condition: ModelCommentConditionInput
) {
  deleteComment(input: $input, condition: $condition) {
    id
    parentId
    owner
    tenantId
    body
    visibility
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    __typename
  }
}`;
