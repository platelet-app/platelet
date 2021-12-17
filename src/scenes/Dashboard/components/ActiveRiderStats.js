import React from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

function ActiveRiderStats(props) {
    if (props.droppedOff === 0 && props.active === 0) {
        return (
            <Typography>{`${props.displayName} does not have any activity.`}</Typography>
        );
    } else if (props.droppedOff === 0 && props.active > 0) {
        return (
            <Typography>{`${props.displayName} has no delivered tasks and ${props.active} active.`}</Typography>
        );
    } else if (props.droppedOff > 0 && props.active === 0) {
        return (
            <Typography>{`${props.displayName} has ${props.droppedOff} delivered tasks.`}</Typography>
        );
    } else {
        return (
            <Typography>
                {`${props.displayName} has ${props.droppedOff} delivered tasks and ${props.active} still tasks still active.`}
            </Typography>
        );
    }
}

ActiveRiderStats.propTypes = {
    displayName: PropTypes.string,
    droppedOff: PropTypes.number,
    active: PropTypes.number,
};
export default ActiveRiderStats;
