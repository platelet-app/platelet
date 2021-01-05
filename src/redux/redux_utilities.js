export function convertListDataToObjects(list) {
    const result = {};
    for (const item of list) {
        result[item.uuid] = item
    }
    return result;
}
