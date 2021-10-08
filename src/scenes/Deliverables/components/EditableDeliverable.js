import React from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import styled from "@material-ui/core/styles/styled";
import Box from "@material-ui/core/Box";
import IncreaseDecreaseCounter from "../../../components/IncreaseDecreaseCounter";

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
});

function EditableDeliverable(props) {
    const deliverable = props.deliverable;
    return (
        <DeliverableBox>
            <DeliverableCard
                compact
                label={deliverable.label}
                icon={deliverable.icon}
            >
                <IncreaseDecreaseCounter
                    value={deliverable.count || 0}
                    disabled={props.isDeleting}
                    onChange={(count) =>
                        props.onChangeCount(deliverable.id, count)
                    }
                    onDelete={() => props.onDelete(deliverable.id)}
                />
            </DeliverableCard>
        </DeliverableBox>
    );
}

EditableDeliverable.propTypes = {
    deliverable: PropTypes.object,
    onChangeCount: PropTypes.func,
    isDeleting: PropTypes.bool,
    isPosting: PropTypes.bool,
    onDelete: PropTypes.func,
};

EditableDeliverable.defaultProps = {
    onChangeCount: () => {},
    isDeleting: false,
    isPosting: false,
    deliverable: { id: "", label: "None", deliverableType: { icon: "" } },
    onDelete: () => {},
};

export default EditableDeliverable;
