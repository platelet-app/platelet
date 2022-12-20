import * as models from "../models";
import moment from "moment";

export default function copyTaskDataToClipboard(task: models.Task) {
    debugger;
    const {
        pickUpLocation,
        priority,
        dropOffLocation,
        timeOfCall,
        deliverables,
    } = task;
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
        data["ITEMS"] = deliverables
            .map((deliverable) => {
                if (deliverable) {
                    const { deliverableType, count } = deliverable;
                    return `${
                        deliverableType ? deliverableType.label : ""
                    } x ${count}`;
                } else {
                    return "";
                }
            })
            .join(", ");
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
