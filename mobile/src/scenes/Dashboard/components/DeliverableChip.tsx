import { Chip } from "react-native-paper";
import React from "react";
//import { getDeliverableIconByEnum } from "../utilities";
import * as models from "../../../models";

type DeliverableChipProps = {
    deliverable: models.Deliverable | null;
    showIcon?: boolean;
    size?: "small" | "medium";
    style?: object;
};

const DeliverableChip: React.FC<DeliverableChipProps> = ({
    deliverable,
    showIcon = false,
    size = "small",
    style = {},
}) => {
    const [label, setLabel] = React.useState("");

    const getLabel = React.useCallback(async () => {
        if (deliverable) {
            const result = await deliverable?.deliverableType;
            setLabel(`${result?.label} x ${deliverable?.count}`);
        }
    }, [deliverable]);
    React.useEffect(() => {
        getLabel();
    }, [getLabel]);

    if (label) {
        return (
            <Chip compact style={style}>
                {label}
            </Chip>
        );
    }
    return null;
};

export default DeliverableChip;
