import React from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import styled from "@material-ui/core/styles/styled";
import Box from "@material-ui/core/Box";
import { SmallCirclePlusButton } from "../../../components/Buttons";

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
});

function AddableDeliverable(props) {
    const deliverableType = props.deliverableType;
    function makeNewDeliverable() {
        let newDeliverable = {
            ...deliverableType,
            count: 1,
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
