import React from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import { SmallCirclePlusButton } from "../../../components/Buttons";
import { deliverableUnits } from "../../../apiConsts";

function AddableDeliverable(props) {
    const deliverableType = props.deliverableType;
    function makeNewDeliverable() {
        const { defaultUnit, ...rest } = deliverableType;
        let newDeliverable = {
            unit: defaultUnit || deliverableUnits.none,
            count: 1,
            ...rest,
        };
        props.onAdd(newDeliverable);
    }

    return (
        <DeliverableCard
            label={deliverableType.label}
            icon={deliverableType.icon}
        >
            <SmallCirclePlusButton
                onClick={makeNewDeliverable}
                disabled={props.disabled}
                aria-label={`Add ${props.deliverableType.label}`}
            />
        </DeliverableCard>
    );
}

AddableDeliverable.propTypes = {
    deliverableType: PropTypes.object,
    onAdd: PropTypes.func,
    isPosting: PropTypes.bool,
    disabled: PropTypes.bool,
};

AddableDeliverable.defaultProps = {
    onAdd: () => {},
    isPosting: false,
    deliverableType: { id: "", label: "None" },
    disabled: false,
};

export default AddableDeliverable;
