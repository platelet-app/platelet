import { ResolvedTask } from "../hooks/useMyAssignedTasks";
import _ from "lodash";

export function filterTasks(tasks: ResolvedTask[], search: string) {
    if (!search || !tasks || tasks.length === 0) {
        return null;
    } else {
        const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
        const results = [];
        for (const searchTerm of searchTerms) {
            let filteredResult: string[] = [];
            const filtered = tasks
                .filter((task) => {
                    if (
                        task.riderResponsibility
                            ? task.riderResponsibility
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.priority
                            ? task.priority.toLowerCase().includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.dropOffLocation && task.dropOffLocation.line1
                            ? task.dropOffLocation.line1
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.pickUpLocation && task.pickUpLocation.line1
                            ? task.pickUpLocation.line1
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.pickUpLocation && task.pickUpLocation.ward
                            ? task.pickUpLocation.ward
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    } else if (
                        task.dropOffLocation && task.dropOffLocation.ward
                            ? task.dropOffLocation.ward
                                  .toLowerCase()
                                  .includes(searchTerm)
                            : false
                    ) {
                        return true;
                    }
                    return false;
                })
                .map((t) => t.id);
            if (filtered.length !== 0)
                filteredResult = [...filteredResult, ...filtered];
            results.push(filteredResult);
        }
        const result = _.intersection(...results);
        return result;
    }
}
