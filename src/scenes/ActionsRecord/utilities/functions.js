export function generateMessage(record, fields) {
    switch (record.http_request_type) {
        case "POST":
        case "DELETE":
            return `${getActionString(record.http_request_type)} this ${record.parent_type}.`
        case "PUT":
        case "PATCH":
            return `${getActionString(record.http_request_type)} ${getFields(fields)}.`
        default:
            return "Unknown action"
    }
}

function getActionString(HTTPType) {
    switch (HTTPType) {
        case "POST":
            return "created"
        case "PUT":
        case "PATCH":
            return "updated"
        case "DELETE":
            return "deleted"
        default:
            return "unknown actioned"
    }
}

function getFields(values) {
    let humanised = [];
    for (const i of values) {
        const result = fieldToHumanReadable(i);
        if (result)
            humanised.push(result)
    }
    if (humanised.length === 0)
        return "";
    else if (humanised.length === 1)
        return `the ${humanised[0]}`;
    else
        return humanised.map((value, index, arr) => {
                return arr.length - 1 !== index ? `${index === 0 ? "the " : ", "}${value}` : ` and ${value}`
            }
        ).join("")
}

function fieldToHumanReadable(field) {
    switch (field) {
        case "location_uuid":
            return "location";
        case "patch_id":
            return "patch";
        case "requester_contact":
            return "requester's contact details";
        case "priority_id":
            return "priority";
        case "time_of_call":
            return "time of call";
        case "time_picked_up":
            return "time of pick up";
        case "time_dropped_off":
            return "time of delivery";
        case "time_cancelled":
            return "time of cancellation";
        case "time_rejected":
            return "time of rejection";
        default:
            return "";
    }
}
