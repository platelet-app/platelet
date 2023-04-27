import { Chip } from "@mui/material";
import { Deliverable } from "../API";
import { getDeliverableIconByEnum } from "../utilities";
import * as models from "../models";

type DeliverableChipProps = {
    deliverable: Deliverable | models.Deliverable | null;
    showIcon?: boolean;
    sx?: object;
    size?: "small" | "medium";
};

const DeliverableChip: React.FC<DeliverableChipProps> = ({
    deliverable,
    showIcon = false,
    size = "small",
    sx = {},
}) => {
    const label = deliverable
        ? `${deliverable?.deliverableType?.label} x ${deliverable?.count}`
        : "";
    const icon = showIcon
        ? getDeliverableIconByEnum(deliverable?.deliverableType?.icon, 3)
        : undefined;
    if (deliverable) {
        return <Chip sx={sx} avatar={icon} size={size} label={label} />;
    }
    return <div></div>;
};

export default DeliverableChip;
