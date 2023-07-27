import React from "react";
import { Chip } from "react-native-paper";

type PriorityChipProps = {
    priority: "HIGH" | "MEDIUM" | "LOW" | null;
};

const PriorityChip: React.FC<PriorityChipProps> = ({ priority }) => {
    let borderColor = "";
    if (priority === "HIGH") {
        borderColor = "red";
    } else if (priority === "MEDIUM") {
        borderColor = "orange";
    } else {
        borderColor = "green";
    }
    return (
        <Chip
            style={{
                borderColor,
                borderWidth: borderColor ? 1 : 0,
                marginRight: 4,
                height: 32,
            }}
            compact
        >
            {priority}
        </Chip>
    );
};

export default PriorityChip;
