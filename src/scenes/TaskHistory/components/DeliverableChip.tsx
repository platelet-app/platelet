import { Chip } from "@mui/material";
import { Deliverable } from "../../../API";
import { getDeliverableIconByEnum } from "../../../utilities";

type DeliverableChipProps = {
    deliverable: Deliverable | null;
};

const DeliverableChip: React.FC<DeliverableChipProps> = ({ deliverable }) => {
    const label = deliverable
        ? `${deliverable?.deliverableType?.label} x ${deliverable?.count}`
        : "";
    const icon = getDeliverableIconByEnum(
        deliverable?.deliverableType?.icon,
        3
    );
    if (deliverable) {
        return <Chip avatar={icon} size="small" label={label} />;
    }
    return <div></div>;
};

export default DeliverableChip;
