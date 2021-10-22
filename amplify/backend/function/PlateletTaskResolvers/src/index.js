const resolvers = {
    Task: {
        statusHumanReadable: (ctx) => {
            const status = ctx.source ? ctx.source.status : undefined;
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
        //TODO figure out how to generate assignees display strings and why event.source doesn't have assignees field
        assignedCoordinatorsDisplayString: (ctx) => {
            return "";
            const assignees = ctx.source
                ? ctx.source.assignees.items
                : undefined;
            if (assignees) {
                const assignedCoordinators = assignees.filter(
                    (u) => u.role === "COORDINATOR"
                );
                return assignedCoordinators.join(", ");
            }
            return "";
        },
        assignedRidersDisplayString: (ctx) => {
            return "";
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
