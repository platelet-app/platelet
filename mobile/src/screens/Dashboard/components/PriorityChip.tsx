import * as React from "react";
import SmallChip from "./SmallChip";

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
        <SmallChip
            style={{
                borderColor,
                borderWidth: borderColor ? 2 : 0,
                marginRight: 4,
            }}
        >
            {priority}
        </SmallChip>
    );
};

export default PriorityChip;
