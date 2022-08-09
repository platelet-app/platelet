import { Box, Typography } from "@mui/material";
import React from "react";
import RiderPicker from "../../../components/RiderPicker";
import UserChip from "../../../components/UserChip";
import PropTypes from "prop-types";

function AssignUserToVehicle({
    assignment,
    canAssign,
    onAssignUser,
    handleDeleteAssignment,
    isPosting,
}) {
    if (assignment) {
        return (
            <Box>
                <UserChip
                    disable={isPosting}
                    onDelete={handleDeleteAssignment}
                    user={assignment.assignee}
                />
            </Box>
        );
    } else {
        return (
            <Box>
                {!canAssign ? (
                    <Typography>No assignee</Typography>
                ) : (
                    <RiderPicker
                        size="medium"
                        label="Assign someone?"
                        onSelect={onAssignUser}
                    />
                )}
            </Box>
        );
    }
}

AssignUserToVehicle.propTypes = {
    assignment: PropTypes.object,
    onAssignUser: PropTypes.func,
    handleDeleteAssignment: PropTypes.func,
    isPosting: PropTypes.bool,
    canAssign: PropTypes.bool,
};

AssignUserToVehicle.defaultProps = {
    assignment: null,
    onAssignUser: () => {},
    handleDeleteAssignment: () => {},
    isPosting: false,
    canAssign: false,
};

export default AssignUserToVehicle;
