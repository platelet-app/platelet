import React from "react";
import DeliverableGridSelect from "../../Deliverables/DeliverableGridSelect";
import PropTypes from "prop-types";

function DeliverableDetails(props) {
    return (
        <DeliverableGridSelect
            deliverables={props.deliverables}
            taskUUID={props.taskUUID}
            onChange={props.onChange}
        />
    );
}

DeliverableDetails.propTypes = {
    deliverables: PropTypes.arrayOf(PropTypes.object),
    taskUUID: PropTypes.string,
    onChange: PropTypes.func,
};

DeliverableDetails.defaultProps = {
    deliverables: [],
    taskUUID: "",
    onChange: () => {},
};

export default DeliverableDetails;
