import * as queries from "./graphql/queries";

const resolvers = {
    Tasks: {
        tasksAll: (ctx) => {},
        tasksNew: (ctx) => {},
        tasksActive: (ctx) => {},
        tasksPickedUp: (ctx) => {},
        tasksDelivered: (ctx) => {},
        tasksCancelled: (ctx) => {},
        tasksRejected: (ctx) => {},
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
