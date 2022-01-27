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
            compact
            label={deliverableType.label}
            icon={deliverableType.icon}
        >
            <SmallCirclePlusButton
                onClick={makeNewDeliverable}
                disabled={props.isPosting}
                aria-label={`Add ${props.deliverableType.label}`}
            />
        </DeliverableCard>
    );
}

AddableDeliverable.propTypes = {
    deliverableType: PropTypes.object,
    onChange: PropTypes.func,
    isPosting: PropTypes.bool,
};

AddableDeliverable.defaultProps = {
    onChange: () => {},
    isPosting: false,
    deliverableType: { id: "", label: "None" },
};

export default AddableDeliverable;
