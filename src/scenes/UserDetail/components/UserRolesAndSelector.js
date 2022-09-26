import React from "react";
import { Chip, Grid, Tooltip } from "@mui/material";
import { userRoles } from "../../../apiConsts";
import PropTypes from "prop-types";

function UserRolesAndSelector(props) {
    if (props.selectMode) {
        return (
            <Grid container direction="row" spacing={1}>
                {Object.values(userRoles).map((role) => {
                    let isDisabled = false;
                    let adminTooltip = "";
                    if (props.disabled || role === userRoles.user)
                        isDisabled = true;
                    if (props.isPrimaryAdmin && role === userRoles.admin) {
                        isDisabled = true;
                        adminTooltip = "You cannot remove the primary admin";
                    }
                    let chipComponent = (
                        <Chip
                            variant={
                                props.value.includes(role)
                                    ? "default"
                                    : "outlined"
                            }
                            disabled={isDisabled}
                            color={
                                props.value.includes(role)
                                    ? "primary"
                                    : "default"
                            }
                            key={role}
                            label={role}
                            onClick={() => props.onSelect(role)}
                        />
                    );
                    if (props.isPrimaryAdmin && role === userRoles.admin) {
                        return (
                            <Tooltip title={adminTooltip}>
                                <Grid item key={role}>
                                    {chipComponent}
                                </Grid>
                            </Tooltip>
                        );
                    } else {
                        return (
                            <Grid item key={role}>
                                {chipComponent}
                            </Grid>
                        );
                    }
                })}
            </Grid>
        );
    } else {
        return (
            <Grid container direction="row" spacing={1}>
                {props.value.map((role) => (
                    <Grid item key={role}>
                        <Chip key={role} label={role} />
                    </Grid>
                ))}
            </Grid>
        );
    }
}

UserRolesAndSelector.propTypes = {
    value: PropTypes.array,
    selectMode: PropTypes.bool,
    disabled: PropTypes.bool,
    isPrimaryAdmin: PropTypes.bool,
};

UserRolesAndSelector.defaultProps = {
    value: [],
    selectMode: false,
    disabled: false,
    isPrimaryAdmin: false,
};

export default UserRolesAndSelector;
