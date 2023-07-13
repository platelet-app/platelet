import React from "react";
import { Chip } from "react-native-paper";

type PriorityChipProps = {
    priority: "HIGH" | "MEDIUM" | "LOW" | null;
    size?: "small" | "medium";
    style?: object;
};

const PriorityChip: React.FC<PriorityChipProps> = ({
    priority,
    size = "medium",
    style = {},
}) => {
    let color = undefined;
    if (priority === "HIGH") {
        //color = red[500];
    } else if (priority === "MEDIUM") {
        //color = orange[500];
    }
    return <Chip style={style}>{priority}</Chip>;
};

export default PriorityChip;
