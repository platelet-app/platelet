const resolvers = {
    Task: {
        statusHumanReadable: (event) => {
            const status = event.source ? event.source.status : undefined;
            switch (status) {
                case "NEW":
                    return "New";
                case "ACTIVE":
                    return "Active";
                case "PICKED_UP":
                    return "Picked up";
                case "DROPPED_OFF":
                    return "Dropped off";
                case "REJECTED":
                    return "Rejected";
                case "CANCELLED":
                    return "Cancelled";
                default:
                    return "";
            }
        },
    },
};

exports.handler = async (event) => {
    const typeHandler = resolvers[event.typeName];
    if (typeHandler) {
        const resolver = typeHandler[event.fieldName];
        if (resolver) {
            return await resolver(event);
        }
    }
    throw new Error("Resolver not found.");
};
