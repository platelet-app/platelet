
export const concatTasks = tasks => Object.entries(tasks).reduce(
    (accumulator, [key, value]) => {
        return [...accumulator, ...value]
    }, []);
