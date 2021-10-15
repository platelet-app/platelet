import React from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import { SmallCirclePlusButton } from "../../../components/Buttons";
import { deliverableUnits } from "../../../apiConsts";

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
});

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
        <DeliverableBox>
            <DeliverableCard
                compact
                label={deliverableType.label}
                icon={deliverableType.icon}
            >
                <SmallCirclePlusButton
                    onClick={makeNewDeliverable}
                    disabled={props.isPosting}
                />
            </DeliverableCard>
        </DeliverableBox>
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
