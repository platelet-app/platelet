
export const concatTasks = tasks => Object.entries(tasks).reduce(
    (accumulator, [key, value]) => {
        return [...accumulator, value.map(t => t)]
    }, []);

export const getTaskUUIDs = tasks => {
    let result = [];
    for (const value of Object.values(tasks)) {
        for (const group of Object.values(value)) {
            result = [...result, ...Object.keys(group)]
        }

    }
    return result;
}

export const getTaskUUIDEtags = tasks => {
    let result = {};
    for (const value of Object.values(tasks)) {
        for (const group of Object.values(value)) {
            for (const task of Object.values(group)) {
                result[task.uuid] = task.etag;
            }
        }
    }
    return result;
}

