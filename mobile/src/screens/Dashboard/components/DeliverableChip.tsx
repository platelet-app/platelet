import { Chip } from "react-native-paper";
import * as React from "react";
//import { getDeliverableIconByEnum } from "../utilities";
import * as models from "../../../models";
import SmallChip from "./SmallChip";

type DeliverableChipProps = {
    deliverable: models.Deliverable | null;
    showIcon?: boolean;
    style?: object;
};

const DeliverableChip: React.FC<DeliverableChipProps> = ({
    deliverable,
    showIcon = false,
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
        return <SmallChip style={style}>{label}</SmallChip>;
    }
    return null;
};

export default DeliverableChip;
