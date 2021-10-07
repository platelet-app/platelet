export const protectedFields = [
    "id",
    "_version",
    "_lastChangedAt",
    "updatedAt",
    "createdAt",
];

export const userRoles = {
    admin: "ADMIN",
    user: "USER",
    coordinator: "COORDINATOR",
    rider: "RIDER",
};

export const commentVisibility = {
    everyone: "EVERYONE",
    me: "ME",
};

export const tasksStatus = {
    new: "NEW",
    active: "ACTIVE",
    pickedUp: "PICKED_UP",
    droppedOff: "DROPPED_OFF",
    rejected: "REJECTED",
    cancelled: "CANCELLED",
};

export const priorities = {
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
};
