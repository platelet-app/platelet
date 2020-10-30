
export const concatTasks = tasks => Object.entries(tasks).reduce(
    (accumulator, [key, value]) => {
        return [...accumulator, value.map(t => t)]
    }, []);

export const getTaskUUIDs = tasks => {
    let result = [];
    for (const [key, value] of Object.entries(tasks)) {
        for (const group of value) {
            result = [...result, ...group.map(t => t.uuid)]
        }

    }
    return result;
}

