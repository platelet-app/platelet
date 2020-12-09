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
                for (const taskGroup of groupList) {
                    const filtered = taskGroup.filter(task => {
                        if (task.assigned_riders_display_string ? task.assigned_riders_display_string.toLowerCase().includes(searchTerm) : false) {
                            return true
                        } else if (task.patch ? task.patch.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.reference ? task.reference.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.priority ? task.priority.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.dropoff_address && task.dropoff_address.line1 ? task.dropoff_address.line1.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.pickup_address && task.pickup_address.line1 ? task.pickup_address.line1.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.pickup_address && task.pickup_address.ward ? task.pickup_address.ward.toLowerCase().includes(searchTerm) : false) {
                            return true;
                        } else if (task.dropoff_address && task.dropoff_address.ward ? task.dropoff_address.ward.toLowerCase().includes(searchTerm) : false) {
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
