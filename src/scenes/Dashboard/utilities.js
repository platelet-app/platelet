
export const concatTasks = tasks => Object.entries(tasks).reduce(
    (accumulator, [key, value]) => {
        return [...accumulator, value.map(t => t)]
    }, []);

export const getTaskUUIDs = tasks => {
    let result = [];
    for (const value of Object.values(tasks)) {
        for (const group of value) {
            result = [...result, ...group.map(t => t.uuid)]
        }

    }
    return result;
}

export const getTaskUUIDEtags = tasks => {
    let result = {};
    for (const value of Object.values(tasks)) {
        for (const group of value) {
            for (const task of group) {
                result[task.uuid] = task.etag;
            }
        }
    }
    return result;
}

