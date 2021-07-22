import _ from "lodash";

export function filterTasks(tasks, search) {
    if (!search) {
        return null;
    } else {
        const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
        //const searchTerm = search.toLowerCase();
        const results = [];
        for (const searchTerm of searchTerms) {
            let filteredResult = [];
            for (const groupList of Object.values(tasks)) {
                for (const taskGroup of Object.values(groupList)) {
                    const filtered = Object.values(taskGroup).filter(task => {
                        if (task.assigned_riders_display_string ? task.assigned_riders_display_string.toLowerCase().includes(searchTerm) : false) {
                            return true
                        } else if (task.patch ? task.patch.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.reference ? task.reference.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.priority ? task.priority.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.dropoff_location && task.dropoff_location.address && task.dropoff_location.address.line1 ? task.dropoff_location.address.line1.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.pickup_location && task.pickup_location.address && task.pickup_location.address.line1 ? task.pickup_location.address.line1.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.pickup_location && task.pickup_location.address && task.pickup_location.address.ward ? task.pickup_location.address.ward.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.dropoff_location && task.dropoff_location.address && task.dropoff_location.address.ward ? task.dropoff_location.address.ward.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        }
                        return false;
                    }).map(t => t.uuid);
                    if (filtered.length !== 0)
                        filteredResult = [...filteredResult, ...filtered];
                }
            }
            results.push(filteredResult)
        }
        const result = _.intersection(...results);
        return result;
    }
}

export const getTaskUUIDEtags = tasks => {
    let result = {};
    for (const value of Object.values(tasks)) {
        for (const task of Object.values(value)) {
            result[task.uuid] = task.etag;
        }
    }
    return result;
}

