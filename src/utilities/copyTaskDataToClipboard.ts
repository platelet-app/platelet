import * as models from "../models";
import moment from "moment";

export default async function copyTaskDataToClipboard(task: models.Task) {
    const { priority, timeOfCall } = task;
    const pickUpLocation = await task.pickUpLocation;
    const dropOffLocation = await task.dropOffLocation;
    const deliverables = await task.deliverables.toArray();
    const data = {
        TOC: timeOfCall ? moment(timeOfCall).format("HH:mm") : undefined,
        FROM: pickUpLocation
            ? `${pickUpLocation.ward || ""} - ${pickUpLocation.line1 || ""}, ${
                  pickUpLocation.postcode || ""
              }`
            : undefined,
        TO: dropOffLocation
            ? `${dropOffLocation.ward || ""} - ${
                  dropOffLocation.line1 || ""
              }, ${dropOffLocation.postcode || ""}`
            : undefined,
        PRIORITY: priority ? priority.toLowerCase() : undefined,
        ITEMS: "",
    };

    if (deliverables) {
        const items = await Promise.all(
            deliverables.map(async (deliverable) => {
                if (deliverable) {
                    const { count } = deliverable;
                    const deliverableType = await deliverable.deliverableType;
                    return `${
                        deliverableType ? deliverableType.label : ""
                    } x ${count}`;
                } else {
                    return "";
                }
            })
        );
        data["ITEMS"] = items.join(", ");
    }

    let result = "";
    let first = true;
    for (const [key, value] of Object.entries(data)) {
        if (value) result += `${first ? "" : " "}${key}: ${value}`;
        first = false;
    }

    if ((window as any).cordova) {
        return new Promise((resolve, reject) => {
            (window as any).cordova.plugins.clipboard.copy(
                result,
                resolve,
                reject
            );
        });
    } else {
        return navigator.clipboard.writeText(result);
    }
}
