import React from "react";
import { Chip, Grid, Tooltip } from "@mui/material";
import * as models from "../../../models";

type UserRolesAndSelectorProps = {
    value: any[];
    onSelect: (value: models.Role) => void;
    selectMode?: boolean;
    disabled?: boolean;
    isPrimaryAdmin?: boolean;
};

const UserRolesAndSelector: React.FC<UserRolesAndSelectorProps> = (props) => {
    if (props.selectMode) {
        return (
            <Grid container direction="row" spacing={1}>
                {Object.values(models.Role)
                    .sort()
                    .map((role) => {
                        let isDisabled = false;
                        let adminTooltip = "";
                        if (props.disabled || role === models.Role.USER)
                            isDisabled = true;
                        if (
                            props.isPrimaryAdmin &&
                            role === models.Role.ADMIN
                        ) {
                            isDisabled = true;
                            adminTooltip =
                                "You cannot remove the primary admin";
                        }
                        let chipComponent = (
                            <Chip
                                variant={
                                    props.value.includes(role)
                                        ? "filled"
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
                        if (
                            props.isPrimaryAdmin &&
                            role === models.Role.ADMIN
                        ) {
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
                {Object.values(props.value)
                    .sort()
                    .map((role) => (
                        <Grid item key={role}>
                            <Chip key={role} label={role} />
                        </Grid>
                    ))}
            </Grid>
        );
    }
};

UserRolesAndSelector.defaultProps = {
    selectMode: false,
    disabled: false,
    isPrimaryAdmin: false,
};

export default UserRolesAndSelector;
