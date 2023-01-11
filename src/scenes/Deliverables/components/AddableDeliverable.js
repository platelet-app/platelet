import React from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import * as models from "../../../models";
import { SmallCirclePlusButton } from "../../../components/Buttons";

function AddableDeliverable(props) {
    const deliverableType = props.deliverableType;
    function makeNewDeliverable() {
        const { defaultUnit, ...rest } = deliverableType;
        let newDeliverable = {
            unit: defaultUnit || models.DeliverableUnit.NONE,
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
    onChange: PropTypes.func,
    isPosting: PropTypes.bool,
};

AddableDeliverable.defaultProps = {
    onChange: () => {},
    isPosting: false,
    deliverableType: { id: "", label: "None" },
};

export default AddableDeliverable;
