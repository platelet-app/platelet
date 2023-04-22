import { Chip } from "@mui/material";
import { red, orange } from "@mui/material/colors";

type PriorityChipProps = {
    priority: "HIGH" | "MEDIUM" | "LOW" | null;
    size?: "small" | "medium";
    sx?: object;
};

const PriorityChip: React.FC<PriorityChipProps> = ({
    priority,
    size = "medium",
    sx = {},
}) => {
    let color = undefined;
    if (priority === "HIGH") {
        color = red[500];
    } else if (priority === "MEDIUM") {
        color = orange[500];
    }
    return <Chip sx={{ ...sx, color }} label={priority} size={size} />;
};

export default PriorityChip;
