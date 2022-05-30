import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const actions = {
    assignUser: "Assign User",
    markPickedUp: "Picked Up",
    markDelivered: "Delivered",
    markRiderHome: "Rider Home",
};
const dotActions = {
    markCancelled: "Cancelled",
    markRejected: "Rejected",
};

function humanReadableAction(action) {
    if (action === actions.assignUser) {
        return "Assigning a user to";
    } else if (action === actions.markPickedUp) {
        return "Marking as picked up on";
    } else if (action === actions.markDelivered) {
        return "Marking as delivered on";
    } else if (action === actions.markRiderHome) {
        return "Marking as rider home on";
    } else if (action === dotActions.markCancelled) {
        return "Marking as cancelled on";
    } else if (action === dotActions.markRejected) {
        return "Marking as rejected on";
    }

    return action;
}

function MultipleSelectionActionsInformation({ selectedItems, action }) {
    const [message, setMessage] = useState("");

    function generateMessage() {
        const items = Object.values(selectedItems);
        if (items.length === 0) {
            setMessage("No items selected");
            return;
        }
        if (items.length === 1) {
            setMessage(`${humanReadableAction(action)} ${items.length} item.`);
            return;
        }
        setMessage(`${humanReadableAction(action)} ${items.length} items`);
    }
    useEffect(generateMessage, [selectedItems, action]);

    return <Typography variant="h6">{message}</Typography>;
}

export default MultipleSelectionActionsInformation;
