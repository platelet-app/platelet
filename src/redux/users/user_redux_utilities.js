export function convertUsersListToObjects(users) {
    const result = {};
    for (const user of users) {
        result[user.uuid] = user
    }
    return result;
}
